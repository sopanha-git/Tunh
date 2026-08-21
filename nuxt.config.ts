// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  // This project uses the Nuxt 3-style flat layout (app.vue, pages/, components/,
  // composables/, assets/ at the project root). Nuxt 4 defaults srcDir to 'app/',
  // so pin it back to the root, otherwise the real app is ignored in favour of
  // the leftover app/ scaffold and '~/assets/css/main.css' fails to resolve.
  srcDir: '.',

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
        // Display: Bricolage Grotesque · Body: Inter · HUD/data: JetBrains Mono
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700;12..96,800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap' },
      ],
    },
  },
})
