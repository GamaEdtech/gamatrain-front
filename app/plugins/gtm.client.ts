export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const gtmId = config.public.gtmId

  if (!gtmId) {
    console.warn('[GTM] Missing NUXT_PUBLIC_GTM_ID in .env')
    return
  }

  if (document.getElementById('gtm-script')) return

  let isLoaded = false
  const queue: { event: string }[] = []

  const loadGTM = () => {
    if (isLoaded) return
    isLoaded = true

    const script = document.createElement('script')
    script.id = 'gtm-script'
    script.async = true
    script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []

    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      'event': 'gtm.js',
    })

    queue.forEach(e => window.dataLayer.push(e))
    queue.length = 0

    console.log('[GTM] Loaded')
  }

  const trigger = () => {
    loadGTM()
    window.removeEventListener('scroll', trigger)
    window.removeEventListener('click', trigger)
  }

  window.addEventListener('scroll', trigger, { once: true })
  window.addEventListener('click', trigger, { once: true })

  const gtm = {
    push(event: string, data: Record<string, unknown> = {}) {
      if (typeof window === 'undefined' || !window.dataLayer) return
      const payload = { event, ...data }

      if (!isLoaded) {
        queue.push(payload)
        return
      }

      window.dataLayer?.push(payload)
    },
  }

  nuxtApp.provide('gtm', gtm)
})
