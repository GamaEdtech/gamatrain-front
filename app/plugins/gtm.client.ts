// How long after the page has loaded GTM is loaded when the visitor hasn't scrolled or clicked yet.
const GTM_IDLE_DELAY_MS = 4000

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const gtmId = config.public.gtmId

  if (!gtmId) {
    console.warn('[GTM] Missing NUXT_PUBLIC_GTM_ID in .env')
    return
  }

  if (document.getElementById('gtm-script')) return

  let isLoaded = false
  const queue: Record<string, unknown>[] = []

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
  // A visitor who neither scrolls nor clicks (a landing page read without touching it, the payment page
  // after the Stripe redirect) would otherwise never load GTM, so their visit and events were never counted.
  // Load it a few seconds after the page has loaded instead: still well after the page is painted.
  const loadWhenIdle = () => setTimeout(trigger, GTM_IDLE_DELAY_MS)
  if (document.readyState === 'complete') loadWhenIdle()
  else window.addEventListener('load', loadWhenIdle, { once: true })

  const gtm = {
    push(event: string, data: Record<string, unknown> = {}) {
      if (typeof window === 'undefined') return
      const payload = { event, ...data }

      // Before GTM loads, window.dataLayer doesn't exist yet: queue the event (it used to be dropped here,
      // so e.g. a payment confirmed before the first scroll or click was never sent).
      if (!isLoaded || !window.dataLayer) {
        queue.push(payload)
        return
      }

      window.dataLayer?.push(payload)
    },
  }

  nuxtApp.provide('gtm', gtm)
})
