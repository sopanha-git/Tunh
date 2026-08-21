// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  // Standard Nuxt 4 layout: app.vue, pages/, components/, composables/, layouts/,
  // middleware/, assets/, and types/ live under app/ (the default srcDir). The
  // server/ and public/ directories stay at the project root. `~`/`@` resolve to
  // app/, so '~/assets/css/main.css' and '~/types' point inside app/.
  css: ['~/assets/css/main.css'],

  // Tailwind 4 is wired through its Vite plugin (CSS-first @theme config), so
  // there is no tailwind.config.js nor PostCSS config needed anymore.
  vite: {
    plugins: [tailwindcss()],
  },

  modules: ['nuxt-auth-utils'],

  typescript: {
    strict: true,
    typeCheck: false,
  },

  runtimeConfig: {
    session: {
      maxAge: 60 * 60 * 8,
      cookie: {
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
      },
    },
    authEmail: process.env.NUXT_AUTH_EMAIL || (process.env.NODE_ENV === 'production' ? '' : 'admin@tunh.app'),
    authPassword: process.env.NUXT_AUTH_PASSWORD || (process.env.NODE_ENV === 'production' ? '' : 'tunh-demo'),
    // Private keys (only available on server-side)
    voiceApiKey: process.env.VOICE_API_KEY || '',
    voiceApiUrl: process.env.VOICE_API_URL || '',
    // Google Gemini TTS. When unset, the endpoint falls back to the mock tone.
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    geminiTtsModel: process.env.GEMINI_TTS_MODEL || 'gemini-2.5-flash-preview-tts',
    // Self-hosted "local" TTS server. The endpoint POSTs the request to this URL
    // when model === 'local'. Optional bearer token sent as Authorization.
    localTtsUrl: process.env.LOCAL_TTS_URL || '',
    localTtsKey: process.env.LOCAL_TTS_KEY || '',

    // Public keys (exposed to client-side)
    public: {
      appName: 'Tunh',
      appVersion: '1.0.0',
    },
  },

  app: {
    head: {
      title: 'Tunh - AI Text-to-Voice',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Transform your text into natural-sounding speech with Tunh AI Text-to-Voice' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        // Signal Desk type: Chakra Petch (display/engraved labels) · IBM Plex Sans (body) · IBM Plex Mono (telemetry)
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap' },
      ],
    },
  },
})
