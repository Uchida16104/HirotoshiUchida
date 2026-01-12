export default defineNuxtConfig({
  devtools: { enabled: true },
  
  app: {
    baseURL: '/viewer/',
    head: {
      title: 'Access Logs Viewer',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.12.0/cdn/themes/dark.css' }
      ],
      script: [
        { type: 'module', src: 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.12.0/cdn/shoelace.js' }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3000',
      wsUrl: process.env.NUXT_PUBLIC_WS_URL || 'ws://localhost:3000'
    }
  },

  compatibilityDate: '2025-01-13'
});
