// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Game CMS'
    }
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_API_BASE_URL || 'http://localhost:3031'
    }
  },
  css: [
    '~/assets/css/main.css',
    '@mdi/font/css/materialdesignicons.css'
  ],
  modules: ['vuetify-nuxt-module', '@pinia/nuxt'],
  vuetify: {
    moduleOptions: {
      /* module specific options */
    },
    vuetifyOptions: {
      /* vuetify options */
      icons: {
        defaultSet: 'mdi'
      },
      theme: {
        defaultTheme: 'light',
        themes: {
          light: {
            dark: false,
            colors: {
              primary: '#4a6fa5',
              secondary: '#6b8cae',
              accent: '#166088',
              error: '#d32f2f',
              info: '#2196F3',
              success: '#388e3c',
              warning: '#FB8C00',
              background: '#f5f5f5'
            }
          }
        }
      }
    }
  }
})
