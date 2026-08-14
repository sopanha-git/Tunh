// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  
  css: ['~/assets/css/main.css'],
  

  
  modules: [],
  
  typescript: {
    strict: true,
    typeCheck: false,
  },
  
  runtimeConfig: {
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
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
      ],
    },
  },
})
