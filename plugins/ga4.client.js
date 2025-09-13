/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/**
 * Google Analytics 4 (GA4) tracking plugin
 * Loads GA4 script and initializes tracking
 */

export default defineNuxtPlugin(() => {
  // Only run on client side
  if (typeof window === 'undefined') return

  const config = useRuntimeConfig()
  const ga4Id = 'G-F4X87M3W8P' // Your GA4 Measurement ID

  if (!ga4Id) {
    console.warn('GA4 Measurement ID not found')
    return
  }

  // Load GA4 script
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`
  document.head.appendChild(script)

  // Initialize gtag
  window.dataLayer = window.dataLayer || []
  function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag = gtag

  // Configure GA4
  gtag('js', new Date())
  gtag('config', ga4Id, {
    send_page_view: true,
  })

  // Log for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log('GA4 initialized with ID:', ga4Id)
  }
})
