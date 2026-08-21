import type { TextToSpeechRequest, TextToSpeechResponse, VoiceEmotion } from '~/types'

const MAX_TEXT_LENGTH = 5000
const VALID_CHARACTERS = ['male', 'female'] as const
const VALID_EMOTIONS: VoiceEmotion[] = [
  'neutral', 'happy', 'sad', 'angry', 'excited', 'calm',
  'friendly', 'serious', 'fearful', 'romantic', 'confident', 'energetic',
]

// Validate the untrusted request body. Returns an error message, or null if valid.
// Every field is type-checked here rather than trusting the declared TS types,
// since the request body is attacker-controlled.
function validateBody(body: unknown): string | null {
  if (!body || typeof body !== 'object') {
    return 'Invalid request body'
  }

  const { text, character, emotion, speed } = body as Record<string, unknown>

  if (typeof text !== 'string' || text.trim().length === 0) {
    return 'Text is required'
  }
  if (text.length > MAX_TEXT_LENGTH) {
    return `Text exceeds maximum length of ${MAX_TEXT_LENGTH} characters`
  }
  if (typeof character !== 'string' || !VALID_CHARACTERS.includes(character as any)) {
    return 'Valid character (male or female) is required'
  }
  if (typeof emotion !== 'string' || !VALID_EMOTIONS.includes(emotion as VoiceEmotion)) {
    return 'Valid emotion is required'
  }
  if (typeof speed !== 'number' || Number.isNaN(speed) || speed < 0.5 || speed > 2.0) {
    return 'Speed must be between 0.5 and 2.0'
  }

  return null
}

export default defineEventHandler(async (event): Promise<TextToSpeechResponse> => {
  // Validate the request up front. Validation failures are client errors (400),
  // kept separate from the try/catch below so their status codes are actually
  // sent and they are not logged as server errors.
  const rawBody = await readBody(event)
  const validationError = validateBody(rawBody)
  if (validationError) {
    setResponseStatus(event, 400)
    return { success: false, error: validationError }
  }

  const body = rawBody as TextToSpeechRequest

  try {
    // Get runtime config
    const config = useRuntimeConfig()

    // Simulate voice generation with a mock response
    // In production, this would call an actual TTS API like:
    // - ElevenLabs
    // - OpenAI TTS
    // - Azure Speech
    // - Google Cloud Text-to-Speech
    // - Amazon Polly
    
    // For demo purposes, we'll generate a mock audio file
    // In real implementation, replace this with actual API call:
    /*
    const response = await $fetch<Buffer>('https://api.elevenlabs.io/v1/text-to-speech/...', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.voiceApiKey}`,
        'Content-Type': 'application/json',
      },
      body: {
        text: body.text,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      },
      responseType: 'arrayBuffer',
    })
    */

    // Mock delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Generate a mock audio blob
    // In production, this would be the actual audio data from the API
    const mockAudioData = generateMockAudio(body.text.length)
    
    // Calculate approximate duration (rough estimate: ~13 chars per second at 1.0x speed)
    const baseDuration = body.text.length / 13
    const adjustedDuration = baseDuration / body.speed

    return {
      success: true,
      audioUrl: mockAudioData,
      duration: Math.round(adjustedDuration),
    }

  } catch (error: any) {
    // Only genuine generation failures reach here now that validation is
    // handled above, so this is a real server-side error.
    console.error('Voice generation error:', error)

    setResponseStatus(event, 500)
    return {
      success: false,
      error: 'Failed to generate voice. Please try again.',
    }
  }
})

// Generate a mock audio data URL for demo purposes
// In production, this function would not exist
function generateMockAudio(textLength: number): string {
  // Create a simple sine wave as a data URL for demo
  // This is just for demonstration - it creates a short beep sound
  const sampleRate = 44100
  const duration = Math.min(textLength / 13, 10) // Max 10 seconds
  const numSamples = Math.floor(sampleRate * duration)
  
  // Create WAV header
  const headerSize = 44
  const dataSize = numSamples * 2 // 16-bit samples
  const buffer = new ArrayBuffer(headerSize + dataSize)
  const view = new DataView(buffer)
  
  // Write WAV header
  writeString(view, 0, 'RIFF')
  view.setUint32(4, 36 + dataSize, true)
  writeString(view, 8, 'WAVE')
  writeString(view, 12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true) // PCM
  view.setUint16(22, 1, true) // Mono
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  writeString(view, 36, 'data')
  view.setUint32(40, dataSize, true)
  
  // Write audio data (sine wave)
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate
    const frequency = 440 // A4 note
    const sample = Math.sin(2 * Math.PI * frequency * t) * 0.5
    view.setInt16(headerSize + i * 2, sample * 0x7FFF, true)
  }
  
  // Convert to base64
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  const base64 = btoa(binary)
  
  return `data:audio/wav;base64,${base64}`
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i))
  }
}
