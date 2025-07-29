/* eslint-disable nuxt/nuxt-config-keys-order */

import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { defineNuxtConfig } from 'nuxt/config'
import glsl from 'vite-plugin-glsl'

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      GOOGLE_ADSENSE: process.env.NUXT_GOOGLE_ADSENSE_ID,
    },
  },

  // Modules
  modules: [
    'dayjs-nuxt',
    '@nuxtjs/leaflet',
    '@nuxt/eslint',
    'nuxt-gtag',
    '@nuxt/image',
    '@vite-pwa/nuxt',
    '@nuxtjs/google-adsense',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],

  // Plugins
  plugins: [
    { src: 'plugins/helper.js' },
    { src: 'plugins/img-cropper', mode: 'client' },
    { src: 'plugins/vuedraggable', mode: 'client' },
  ],

  // SSR configuration
  ssr: true,

  // Auto import components
  components: true,

  imports: {
    autoImport: true,
  },

  // Development modules
  devtools: { enabled: true },

  // Global page headers
  app: {
    head: {
      titleTemplate: '%s | Gamatrain',
      title:
        'GamaTrain: Smart K12 Learning with AI, Community, and Personalized Education',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { charset: 'utf-8' },
        { 'http-equiv': 'Content-Type' },
        {
          name: 'viewport',
          content:
            'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0',
        },
        {
          name: 'description',
          content:
            'Discover GamaTrain, an innovative K12 learning platform transforming education with AI-powered instruction, a vibrant community, and personalized learning experiences.',
        },
        { name: 'format-detection', content: 'telephone=no' },
        {
          name: 'apple-mobile-web-app-title',
          content:
            'GamaTrain: Smart K12 Learning with AI, Community, and Personalized Education',
        },
        {
          property: 'og:title',
          content:
            'GamaTrain: Smart K12 Learning with AI, Community, and Personalized Education',
        },
        { property: 'og:site_name', content: 'GamaTrain' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        {
          name: 'apple-mobile-web-app-status-bar-style',
          content: 'black-translucent',
        },
      ],
      link: [
        { rel: 'manifest', href: '/manifest.webmanifest' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon-dark.ico' },
        { rel: 'stylesheet', href: '/assets/css/all.min.css' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon-light.png' },
      ],
      script: [
        {
          src: 'https://accounts.google.com/gsi/client',
          defer: true,
          async: true,
        },
      ],
    },
  },

  // Global CSS
  css: [
    'vuetify/lib/styles/main.css',
    '@/assets/scss/app.scss',
    '@mdi/font/css/materialdesignicons.min.css',
    '@/assets/css/gama6/styles.css',
  ],

  experimental: {
    payloadExtraction: false,
    appManifest: false,
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Gamatrain',
      short_name: 'Gamatrain',
      description:
        'Discover GamaTrain, an innovative K12 learning platform transforming education with AI-powered instruction, a vibrant community, and personalized learning experiences.',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/',
      icons: [
        {
          src: '/favicon-16x16-light.png',
          sizes: '16x16',
          type: 'image/png',
        },
        {
          src: '/favicon-32x32-light.png',
          sizes: '32x32',
          type: 'image/png',
        },
        {
          src: '/android-chrome-192x192-light.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/android-chrome-512x512-light.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
      screenshots: [
        {
          src: '/screenshots/home-desktop.png',
          sizes: '1280x720',
          type: 'image/png',
          form_factor: 'wide',
        },
        {
          src: '/screenshots/home-mobile.png',
          sizes: '540x720',
          type: 'image/png',
          form_factor: 'narrow',
        },
      ],
      launch_handler: {
        client_mode: 'focus-existing',
      },
      lang: 'en',
      orientation: 'any',
      categories: [
        'books',
        'education',
        'games',
        'productivity',
      ],
      dir: 'ltr',
      prefer_related_applications: false,
      // related_applications: [
      //   {
      //     platform: "play",
      //     url: "https://play.google.com/store/apps/details?id=com.example.app",
      //     id: "com.example.app"
      //   }
      // ],
      display_override: ['window-controls-overlay', 'standalone', 'fullscreen'],
      window_controls_overlay: true,
    },
    meta: {
      theme_color: '#ffffff',
      mobileAppIOS: true,
      appleStatusBarStyle: 'black-translucent',
      name: 'Gamatrain',
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: [],
      globIgnores: [
        '**/_payload.json',
        '_nuxt/builds/**/*.json',
        '**/node_modules/**/*',
      ],
    },
    devOptions: {
      enabled: false,
      type: 'module',
    },
  },

  googleAdsense: {
    id: process.env.NUXT_GOOGLE_ADSENSE_ID,
    pageLevelAds: true,
  },

  // Module configurations
  leaflet: {
    markerCluster: true,
  },

  image: {
    domains: ['core.gamatrain.com'],
  },

  gtag: {
    id: 'G-VLSLZJR0WK',
  },

  // Build configuration
  build: {
    transpile: [
      'vuetify',
      'vue-chartjs',
      'defu',
      '@ckeditor/ckeditor5-vue',
      'vue3-emoji-picker',
    ],
  },

  routeRules: {
    '/test-maker/**': { ssr: false, prerender: true },
    '/api/v1/**': {
      proxy: process.env.NUXT_PROXY_API_BASE_URL,
    },
    '/api/v2/**': {
      proxy: process.env.NUXT_PROXY_API2_BASE_URL,
    },
    '/uploads/**': {
      proxy: process.env.NUXT_PROXY_UPLOAD_URL,
    },
  },

  // Development server configuration
  devServer: {
    port: 3002,
  },
  compatibilityDate: '2024-04-03',

  // Vite configuration
  vite: {
    plugins: [glsl()],
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router'],
            vuetify: ['vuetify'],
            charts: ['vue-chartjs', 'chart.js'],
            ckeditor: [
              '@ckeditor/ckeditor5-vue',
              '@ckeditor/ckeditor5-build-classic',
            ],
          },
        },
      },
    },
    define: {
      global: 'globalThis',
    },
  },

  // toast config
  toast: {
    position: 'top-center',
    duration: 3000,
    register: [
      // Register custom toasts
      {
        name: 'my-error',
        message: 'Oops...Something went wrong',
        options: {
          type: 'error',
        },
      },
    ],
  },
})
