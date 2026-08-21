import { GoogleGenAI } from "@google/genai";
import type {
  TextToSpeechRequest,
  TextToSpeechResponse,
  VoiceCharacter,
  VoiceEmotion,
  VoiceModel,
} from "~/types";

const MAX_TEXT_LENGTH = 5000;
const VALID_MODELS: VoiceModel[] = ["gemini", "local"];
// Per-attempt cap for a single Gemini call. Successful calls return in a few
// seconds; anything past this is a hang (queued behind quota, slow non-Latin
// synthesis, etc.), so we abort and retry rather than hold the socket open.
const GENERATION_TIMEOUT_MS = 45000;
const MAX_ATTEMPTS = 2;
const VALID_CHARACTERS = ["male", "female"] as const;

// A generation failure with a status code and a message safe to show the user.
// Lets us surface the real reason (quota, timeout) instead of a generic 500.
class VoiceGenError extends Error {
  constructor(
    readonly status: number,
    readonly userMessage: string,
    cause?: string,
  ) {
    super(cause ?? userMessage);
    this.name = "VoiceGenError";
  }
}
const VALID_EMOTIONS: VoiceEmotion[] = [
  "neutral",
  "happy",
  "sad",
  "angry",
  "excited",
  "calm",
  "friendly",
  "serious",
  "fearful",
  "romantic",
  "confident",
  "energetic",
];

// Validate the untrusted request body. Returns an error message, or null if valid.
// Every field is type-checked here rather than trusting the declared TS types,
// since the request body is attacker-controlled.
function validateBody(body: unknown): string | null {
  if (!body || typeof body !== "object") {
    return "Invalid request body";
  }

  const { text, model, character, emotion, speed } = body as Record<string, unknown>;

  if (typeof text !== "string" || text.trim().length === 0) {
    return "Text is required";
  }
  if (text.length > MAX_TEXT_LENGTH) {
    return `Text exceeds maximum length of ${MAX_TEXT_LENGTH} characters`;
  }
  if (typeof model !== "string" || !VALID_MODELS.includes(model as VoiceModel)) {
    return "Valid model (gemini or local) is required";
  }
  if (
    typeof character !== "string" ||
    !VALID_CHARACTERS.includes(character as any)
  ) {
    return "Valid character (male or female) is required";
  }
  if (
    typeof emotion !== "string" ||
    !VALID_EMOTIONS.includes(emotion as VoiceEmotion)
  ) {
    return "Valid emotion is required";
  }
  if (
    typeof speed !== "number" ||
    Number.isNaN(speed) ||
    speed < 0.5 ||
    speed > 2.0
  ) {
    return "Speed must be between 0.5 and 2.0";
  }

  return null;
}

export default defineEventHandler(
  async (event): Promise<TextToSpeechResponse> => {
    await requireUserSession(event);
    // Validate the request up front. Validation failures are client errors (400),
    // kept separate from the try/catch below so their status codes are actually
    // sent and they are not logged as server errors.
    const rawBody = await readBody(event);
    const validationError = validateBody(rawBody);
    if (validationError) {
      setResponseStatus(event, 400);
      return { success: false, error: validationError };
    }

    const body = rawBody as TextToSpeechRequest;

    try {
      const config = useRuntimeConfig();

      // Route to the selected engine. `local` posts to a self-hosted server;
      // everything else uses Gemini (or the mock tone when unconfigured).
      if (body.model === "local") {
        if (!config.localTtsUrl) {
          throw new VoiceGenError(
            503,
            "Local model isn't configured. Set LOCAL_TTS_URL to your self-hosted TTS server.",
          );
        }
        return await generateLocalSpeech(
          body,
          config.localTtsUrl,
          config.localTtsKey,
        );
      }

      // Without a Gemini key we can't call the real TTS service, so fall back to
      // the mock tone. This keeps local dev working before credentials are set.
      if (!config.geminiApiKey) {
        console.warn(
          "[generate-voice] GEMINI_API_KEY is not set — returning mock tone.",
        );
        const mockAudioData = generateMockAudio(body.text.length);
        const baseDuration = body.text.length / 13;
        return {
          success: true,
          audioUrl: mockAudioData,
          duration: Math.round(baseDuration / body.speed),
        };
      }

      return await generateGeminiSpeech(
        body,
        config.geminiApiKey,
        config.geminiTtsModel,
      );
    } catch (error: any) {
      // Known failures (quota, timeout) carry a status + user-facing message;
      // surface those directly instead of masking them behind a generic 500.
      if (error instanceof VoiceGenError) {
        setResponseStatus(event, error.status);
        return { success: false, error: error.userMessage };
      }

      // Anything else is an unexpected server-side error.
      console.error("Voice generation error:", error);
      setResponseStatus(event, 500);
      return {
        success: false,
        error: "Failed to generate voice. Please try again.",
      };
    }
  },
);

// --- Gemini text-to-speech -------------------------------------------------

// Prebuilt Gemini voices mapped to our two characters. See
// https://ai.google.dev/gemini-api/docs/speech-generation for the full list.
const VOICE_BY_CHARACTER: Record<VoiceCharacter, string> = {
  female: "Kore", // firm, clear
  male: "Charon", // informative, deeper
};

// Emotion -> natural-language delivery. Gemini TTS has no emotion parameter;
// tone is steered entirely through the prompt.
const EMOTION_STYLE: Record<VoiceEmotion, string> = {
  neutral: "in a natural, balanced tone",
  happy: "in a happy, cheerful tone",
  sad: "in a sad, somber tone",
  angry: "in an intense, angry tone",
  excited: "in an enthusiastic, excited tone",
  calm: "in a calm, relaxed tone",
  friendly: "in a warm, friendly tone",
  serious: "in a serious, professional tone",
  fearful: "in an anxious, fearful tone",
  romantic: "in a tender, romantic tone",
  confident: "in a bold, confident tone",
  energetic: "in a dynamic, energetic tone",
};

// Gemini TTS has no numeric speed control either, so map the ratio to a pace
// phrase. 1.0 adds no phrase (the model's natural pace).
function pacePhrase(speed: number): string {
  if (speed <= 0.5) return " at a very slow pace";
  if (speed < 1.0) return " at a slow pace";
  if (speed === 1.0) return "";
  if (speed < 1.5) return " at a slightly faster pace";
  if (speed < 1.75) return " at a fast pace";
  return " at a very fast pace";
}

function buildStylePrompt(request: TextToSpeechRequest): string {
  const style = EMOTION_STYLE[request.emotion] ?? EMOTION_STYLE.neutral;
  return `Read the following text aloud ${style}${pacePhrase(request.speed)}:\n\n${request.text}`;
}

// Gemini auto-detects English fine, but non-Latin scripts (notably Khmer) are
// far more reliable when the language is stated explicitly. Returns a BCP-47
// code for the dominant script, or undefined to let Gemini auto-detect.
function detectLanguageCode(text: string): string | undefined {
  if (/[ក-៿]/.test(text)) return "km-KH"; // Khmer script block
  return undefined;
}

// Pull an HTTP status out of a Gemini SDK error. The SDK surfaces the API's
// status both as `.status` and embedded in the JSON message (e.g. "code":429).
function errorStatus(err: any): number | undefined {
  if (typeof err?.status === "number") return err.status;
  const match = typeof err?.message === "string" && err.message.match(/"code":\s*(\d{3})/);
  return match ? Number(match[1]) : undefined;
}

// Turn a Gemini 429 into a precise, actionable message. Google's error carries
// the quota metric (per-day vs per-minute) and a suggested retry delay; surface
// both so the user knows whether waiting helps or they've hit the daily cap.
function quotaMessage(rawMessage: string | undefined): string {
  const text = rawMessage ?? "";
  const perDay = /PerDay|_free_tier_requests/i.test(text);
  const retry = text.match(/retry in ([\d.]+)s/i);

  let msg = perDay
    ? "Gemini's daily free-tier quota is used up for this model (the free tier allows only a handful of TTS requests per day)."
    : "Gemini's rate limit was reached.";

  if (retry) {
    msg += ` You can retry in ~${Math.ceil(Number(retry[1]))}s.`;
  }
  msg +=
    " To lift this, enable billing on your Google AI Studio project — or switch the engine to Local.";
  return msg;
}

// Call Gemini with a per-attempt timeout, retrying once on a hang. Quota (429)
// and other client errors are not worth an immediate retry, so they short-circuit.
async function generateContentWithRetry(
  ai: GoogleGenAI,
  model: string,
  request: TextToSpeechRequest,
  speechConfig: Record<string, unknown>,
) {
  let lastError: any;
  let timedOut = false;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), GENERATION_TIMEOUT_MS);
    try {
      return await ai.models.generateContent({
        model,
        contents: [{ role: "user", parts: [{ text: buildStylePrompt(request) }] }],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig,
          abortSignal: controller.signal,
        },
      });
    } catch (err: any) {
      lastError = err;
      timedOut = controller.signal.aborted;
      const status = errorStatus(err);
      if (status === 429) {
        throw new VoiceGenError(429, quotaMessage(err?.message), err?.message);
      }
      // Don't retry other client errors; only retry hangs/transient failures.
      if (attempt === MAX_ATTEMPTS || (status && status >= 400 && status < 500)) {
        break;
      }
    } finally {
      clearTimeout(timer);
    }
  }

  if (timedOut) {
    throw new VoiceGenError(
      504,
      "Voice generation timed out. Longer or non-Latin scripts can be slow — try again or shorten the text.",
      lastError?.message,
    );
  }
  throw lastError;
}

async function generateGeminiSpeech(
  request: TextToSpeechRequest,
  apiKey: string,
  model: string,
): Promise<TextToSpeechResponse> {
  const ai = new GoogleGenAI({ apiKey });

  const speechConfig: Record<string, unknown> = {
    voiceConfig: {
      prebuiltVoiceConfig: {
        voiceName: VOICE_BY_CHARACTER[request.character],
      },
    },
  };
  const languageCode = detectLanguageCode(request.text);
  if (languageCode) speechConfig.languageCode = languageCode;

  const response = await generateContentWithRetry(ai, model, request, speechConfig);

  // Gemini returns raw 16-bit PCM (not a container), base64-encoded, with the
  // sample rate carried in the part's mimeType (e.g. audio/L16;codec=pcm;rate=24000).
  const part = response.candidates?.[0]?.content?.parts?.find(
    (p) => p.inlineData?.data,
  );
  const pcmBase64 = part?.inlineData?.data;
  if (!pcmBase64) {
    throw new Error("Gemini returned no audio data");
  }

  const sampleRate = parseSampleRate(part?.inlineData?.mimeType) ?? 24000;
  const pcm = Buffer.from(pcmBase64, "base64");
  const wav = pcmToWav(pcm, sampleRate);

  // 16-bit mono => 2 bytes/sample. Real duration of the synthesized audio.
  const duration = pcm.byteLength / 2 / sampleRate;

  return {
    success: true,
    audioUrl: `data:audio/wav;base64,${wav.toString("base64")}`,
    duration: Math.round(duration),
  };
}

function parseSampleRate(mimeType?: string): number | null {
  const match = mimeType?.match(/rate=(\d+)/);
  return match ? Number(match[1]) : null;
}

// Wrap raw 16-bit mono PCM in a minimal WAV (RIFF) container so browsers can
// play it directly.
function pcmToWav(pcm: Buffer, sampleRate: number): Buffer {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = pcm.byteLength;

  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16); // fmt chunk size
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcm]);
}

// --- Local (self-hosted) text-to-speech ------------------------------------

// POST the request to a self-hosted TTS server and normalize its reply.
//
// Contract (kept deliberately loose so most local servers "just work"):
//   Request:  POST <LOCAL_TTS_URL>  { text, character, emotion, speed }
//             Authorization: Bearer <LOCAL_TTS_KEY>   (only if key is set)
//   Response, any of:
//     - audio bytes  (Content-Type: audio/*)         -> used directly
//     - JSON { audioUrl | audioData, duration? }      -> audioUrl passed through,
//                                                        audioData treated as base64 WAV
//     - JSON { error }                                -> surfaced to the user
async function generateLocalSpeech(
  request: TextToSpeechRequest,
  url: string,
  key: string,
): Promise<TextToSpeechResponse> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), GENERATION_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(key ? { Authorization: `Bearer ${key}` } : {}),
      },
      body: JSON.stringify({
        text: request.text,
        character: request.character,
        emotion: request.emotion,
        speed: request.speed,
      }),
      signal: controller.signal,
    });
  } catch (err: any) {
    if (controller.signal.aborted) {
      throw new VoiceGenError(
        504,
        "Local TTS server timed out. Check that it's running and reachable.",
        err?.message,
      );
    }
    throw new VoiceGenError(
      502,
      "Couldn't reach the local TTS server. Check LOCAL_TTS_URL and that the server is running.",
      err?.message,
    );
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    throw new VoiceGenError(
      502,
      `Local TTS server returned ${res.status}. Check its logs.`,
    );
  }

  const contentType = res.headers.get("content-type") ?? "";

  // Raw audio response: wrap the bytes in a data URL as-is.
  if (contentType.startsWith("audio/")) {
    const buf = Buffer.from(await res.arrayBuffer());
    const mime = contentType.split(";")[0];
    return {
      success: true,
      audioUrl: `data:${mime};base64,${buf.toString("base64")}`,
    };
  }

  // JSON response.
  const data = (await res.json().catch(() => null)) as
    | { audioUrl?: string; audioData?: string; duration?: number; error?: string }
    | null;
  if (!data) {
    throw new VoiceGenError(502, "Local TTS server returned an unreadable response.");
  }
  if (data.error) {
    throw new VoiceGenError(502, data.error);
  }
  const audioUrl =
    data.audioUrl ??
    (data.audioData ? `data:audio/wav;base64,${data.audioData}` : undefined);
  if (!audioUrl) {
    throw new VoiceGenError(502, "Local TTS server returned no audio.");
  }
  return { success: true, audioUrl, duration: data.duration };
}

// --- Mock fallback ---------------------------------------------------------

// Generate a mock audio data URL used only when no Gemini key is configured.
function generateMockAudio(textLength: number): string {
  const sampleRate = 44100;
  const duration = Math.min(textLength / 13, 10); // Max 10 seconds
  const numSamples = Math.floor(sampleRate * duration);

  const headerSize = 44;
  const dataSize = numSamples * 2; // 16-bit samples
  const buffer = new ArrayBuffer(headerSize + dataSize);
  const view = new DataView(buffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const frequency = 440; // A4 note
    const sample = Math.sin(2 * Math.PI * frequency * t) * 0.5;
    view.setInt16(headerSize + i * 2, sample * 0x7fff, true);
  }

  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return `data:audio/wav;base64,${btoa(binary)}`;
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
