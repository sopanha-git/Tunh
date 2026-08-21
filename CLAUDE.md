# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Tunh is an AI text-to-voice web app (Nuxt 4 + TypeScript + Tailwind). A user enters a script, picks a character/emotion/speed, and generates audio.

## Commands

```bash
npm run dev        # dev server at http://localhost:3000
npm run build      # production build (.output/)
npm run preview    # serve the production build
npm run generate   # static-site generation
npx nuxi prepare   # regenerate .nuxt/ types + aliases (also runs on postinstall)
```

- **No test, lint, or typecheck npm script exists.** The README references `npm run typecheck`, but that script is not defined in `package.json` — do not tell users to run it.
- `nuxt.config.ts` sets `typescript.typeCheck: false`, so `npm run build` does **not** type-check. `npx vue-tsc` currently fails in this repo due to a vue-tsc/TypeScript `exports` version mismatch (it errors before reading any source). To type-check, prefer `npx nuxi typecheck`.

## Critical: non-standard source layout

This project uses the **Nuxt 3-style flat layout** — `app.vue`, `pages/`, `components/`, `composables/`, `assets/`, `layouts/`, `types/` all live at the **project root**, not under `app/`.

Nuxt 4 defaults `srcDir` to `app/`, so `nuxt.config.ts` pins `srcDir: '.'` to keep this layout working. Without it, Nuxt ignores the real app. Consequences to remember:
- `~` and `@` resolve to the **project root** (e.g. `~/types`, `~/assets/css/main.css`).
- Do **not** create an `app/` directory or move files into one unless you also change `srcDir`.
- After changing `nuxt.config.ts` or aliases, run `npx nuxi prepare` and confirm `.nuxt/tsconfig.json` includes `../**/*`.

## Architecture

**Single feature, single page.** `pages/index.vue` is the whole UI; it wires child components to two composables and owns the `<audio>` element and playback handlers.

**State lives in composables backed by Nuxt `useState`** (SSR-safe, shared across components — not local `ref`s):
- `composables/useVoiceSettings.ts` — voice settings (character/emotion/speed) plus the exported **catalog arrays** `emotions`, `characters`, `speeds`. Selector components (`EmotionSelector.vue`, etc.) import these arrays directly. Add or change an emotion/character/speed here and in `types/index.ts`.
- `composables/useTextToSpeech.ts` — generation lifecycle. Status is a state machine: `idle → validating → generating → success | error`. Holds `audioUrl`, `audioDuration`, and player state. `releaseAudioUrl()` only revokes `blob:` URLs because the API returns `data:` URLs (see below).

**Types are centralized in `types/index.ts`** — the `VoiceCharacter`, `VoiceEmotion`, `VoiceSpeed` unions and request/response shapes are the single source of truth; server and client both import from here.

**The generation API is a mock.** `server/api/generate-voice.post.ts` validates the request, then synthesizes a 440 Hz sine-wave WAV and returns it as a `data:audio/wav;base64,...` URL — it does **not** call a real TTS provider. The ElevenLabs/OpenAI/Azure call is commented out, and `runtimeConfig.voiceApiKey` / `voiceApiUrl` (from `VOICE_API_KEY` / `VOICE_API_URL`) are unused until that integration is wired in. When replacing the mock: keep returning the `TextToSpeechResponse` envelope so the composable's error handling still works, and switch the client to `blob:` URLs only if you also update `releaseAudioUrl()`.

**Validation is intentionally duplicated** — client-side in `useTextToSpeech.ts` (`validateRequest`, for fast UX feedback) and server-side in `generate-voice.post.ts` (`validateBody`, the real trust boundary with `typeof` guards and allowlists). Keep both in sync when limits change (e.g. the 5000-char cap, speed 0.5–2.0). The endpoint returns `{ success, error }` with an explicit `setResponseStatus` (400 for validation, 500 for failures) rather than throwing `createError`.

**Config:** `runtimeConfig` in `nuxt.config.ts` keeps `voiceApiKey`/`voiceApiUrl` server-only; only `appName`/`appVersion` are under `public`. Copy `.env.example` → `.env` for API credentials.

## README caveats

The README states "Nuxt 3" and "Tailwind CSS 4"; the actual pinned versions are **Nuxt ^4.5** and **Tailwind ^3.4** (`package.json`). Trust `package.json` over the README for versions.
