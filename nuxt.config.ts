// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devServer: {
    port: 4000,
    host: 'localhost'
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Disable SSR to prevent hydration mismatches
  ssr: false,

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt'
  ],

  // Auto-import configuration
  components: true,
  
  runtimeConfig: {
    apiBase: process.env.API_BASE || 'http://localhost:3030'
  },

  app: {
    head: {
      title: 'User Management System',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A full-stack user management system' }
      ]
    }
  },

  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.css'
  ],

  build: {
    transpile: ['vuetify']
  },

  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:3030',
        changeOrigin: true,
        prependPath: true
      }
    }
  }
})
