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

## Source layout

This project uses the **standard Nuxt 4 layout**. The app code lives under `app/`:
`app/app.vue`, `app/pages/`, `app/components/`, `app/composables/`, `app/layouts/`,
`app/middleware/`, `app/assets/`, and `app/types/`. The `server/` and `public/`
directories, plus `nuxt.config.ts` and `auth.d.ts`, stay at the **project root**.

`nuxt.config.ts` uses the default `srcDir` (`app/`) — there is no `srcDir` override. Notes:
- `~` and `@` resolve to `app/` in **both** client and server contexts (`.nuxt/tsconfig.json`
  and `.nuxt/tsconfig.server.json` both map `~/*` → `../app/*`). So `~/types` and
  `~/assets/css/main.css` point inside `app/`, and the server's `import type { … } from '~/types'`
  resolves correctly.
- After changing `nuxt.config.ts` or aliases, run `npx nuxi prepare` and confirm
  `.nuxt/tsconfig.json` maps `~/*` to `../app/*`.

## Architecture

**Single feature, single page.** `app/pages/index.vue` is the whole UI; it wires child components to two composables and owns the `<audio>` element and playback handlers.

**State lives in composables backed by Nuxt `useState`** (SSR-safe, shared across components — not local `ref`s):
- `app/composables/useVoiceSettings.ts` — voice settings (character/emotion/speed) plus the exported **catalog arrays** `emotions`, `characters`, `speeds`. Selector components (`EmotionSelector.vue`, etc.) import these arrays directly. Add or change an emotion/character/speed here and in `app/types/index.ts`. Each emotion's `color` is reused as the console accent (`--accent`) — it drives the oscilloscope glow and lit key-caps.
- `app/composables/useTextToSpeech.ts` — generation lifecycle. Status is a state machine: `idle → validating → generating → success | error`. Holds `audioUrl`, `audioDuration`, and player state. `releaseAudioUrl()` only revokes `blob:` URLs because the API returns `data:` URLs (see below).

**Types are centralized in `app/types/index.ts`** — the `VoiceCharacter`, `VoiceEmotion`, `VoiceSpeed` unions and request/response shapes are the single source of truth; server and client both import from here.

**The generation API is a mock.** `server/api/generate-voice.post.ts` validates the request, then synthesizes a 440 Hz sine-wave WAV and returns it as a `data:audio/wav;base64,...` URL — it does **not** call a real TTS provider. The ElevenLabs/OpenAI/Azure call is commented out, and `runtimeConfig.voiceApiKey` / `voiceApiUrl` (from `VOICE_API_KEY` / `VOICE_API_URL`) are unused until that integration is wired in. When replacing the mock: keep returning the `TextToSpeechResponse` envelope so the composable's error handling still works, and switch the client to `blob:` URLs only if you also update `releaseAudioUrl()`.

**Validation is intentionally duplicated** — client-side in `useTextToSpeech.ts` (`validateRequest`, for fast UX feedback) and server-side in `generate-voice.post.ts` (`validateBody`, the real trust boundary with `typeof` guards and allowlists). Keep both in sync when limits change (e.g. the 5000-char cap, speed 0.5–2.0). The endpoint returns `{ success, error }` with an explicit `setResponseStatus` (400 for validation, 500 for failures) rather than throwing `createError`.

**Config:** `runtimeConfig` in `nuxt.config.ts` keeps `voiceApiKey`/`voiceApiUrl` server-only; only `appName`/`appVersion` are under `public`. Copy `.env.example` → `.env` for API credentials.

## README caveats

The README states "Nuxt 3"; the actual pinned version is **Nuxt ^4.5** (`package.json`). Tailwind is **v4** (`tailwindcss` / `@tailwindcss/vite` ^4.3), wired through the Vite plugin with CSS-first `@theme` config in `app/assets/css/main.css` — there is no `tailwind.config.js`. Trust `package.json` over the README for versions.

## Design system

The UI is the **"Signal Desk"** direction — a tactile hardware voice instrument. Key pieces:
- **Tokens in `app/assets/css/main.css`** (`@theme`): `surface-*` is a warm brushed-metal grey scale, `primary-*` is the action orange. `--accent` is the live per-emotion hue.
- **Component classes** (`@layer components`): `.panel`/`.card` (brushed metal), `.screen` (dark oscilloscope inset — glows via `--accent`, scanlines via `::after`), `.keycap` (`[data-on="true"]` lights in `--accent`), `.engrave`/`.eyebrow` (etched mono labels), `.groove` (incised divider), `.screw`, `.readout`/`.hud`, `.btn-action`/`.btn-primary`/`.btn-secondary`, `.input-field`, `input.console-range`.
- **Signature:** `app/components/WaveformScope.vue` is the hero oscilloscope on `app/pages/index.vue`; it draws a per-emotion waveform (see the `WAVE` spec map) tinted by `--accent` and respects `prefers-reduced-motion`.
- **Fonts:** Chakra Petch (display/labels) · IBM Plex Sans (body) · IBM Plex Mono (readouts), loaded in `nuxt.config.ts`.
