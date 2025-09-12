/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-explicit-any */
export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  const config = useRuntimeConfig()
  const gtmId = config.public.gtmId
  if (!gtmId) return

  // Inject GTM <script> in head
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`
  document.head.appendChild(script)

  // Initialize dataLayer
  ;(window as any).dataLayer = (window as any).dataLayer || []
  ;(window as any).dataLayer.push({ 'gtm.start': new Date().getTime(), 'event': 'gtm.js' })

  // Inject GTM <noscript> after body open
  const noscript = document.createElement('noscript')
  noscript.innerHTML = `<iframe src=\"https://www.googletagmanager.com/ns.html?id=${gtmId}\" height=\"0\" width=\"0\" style=\"display:none;visibility:hidden\"></iframe>`
  document.body.prepend(noscript)
})
