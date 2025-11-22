export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const gtmId = config.public.gtmId

  if (!gtmId) {
    console.warn('[GTM] Missing NUXT_PUBLIC_GTM_ID in .env')
    return
  }

  // Prevent duplicate injection
  if (document.getElementById('gtm-script')) return

  // Inject GTM script safely
  const script = document.createElement('script')
  script.id = 'gtm-script'
  script.async = true
  script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`
  document.head.appendChild(script)

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    'gtm.start': new Date().getTime(),
    'event': 'gtm.js',
  })

  console.log(`[GTM] Loaded: ${gtmId}`)

  // Provide non-reactive GTM helper
  const gtm = {
    push(event: string, data: Record<string, unknown> = {}) {
      if (typeof window === 'undefined' || !window.dataLayer) return
      window.dataLayer.push({ event, ...data })
    },
  }

  nuxtApp.provide('gtm', gtm)
})
