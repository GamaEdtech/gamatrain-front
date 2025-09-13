/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/**
 * GA4 Custom Event Tracking Plugin
 * Tracks clicks on elements with data-action-id attributes
 */

export default defineNuxtPlugin(() => {
  // Only run on client side
  if (typeof window === 'undefined') return

  // Function to track custom events
  const trackCustomEvent = (actionId, buttonText, pagePath) => {
    if (window.gtag) {
      window.gtag('event', 'custom_action_click', {
        action_id: actionId,
        button_text: buttonText,
        page_path: pagePath,
        event_category: 'user_interaction',
        event_label: actionId,
      })

      // Log for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('GA4 Custom Event:', {
          event: 'custom_action_click',
          action_id: actionId,
          button_text: buttonText,
          page_path: pagePath,
        })
      }
    }
  }

  // Function to handle click events
  const handleActionClick = (event) => {
    const target = event.target.closest('[data-action-id]')
    if (!target) return

    const actionId = target.getAttribute('data-action-id')
    const buttonText = target.textContent?.trim() || target.getAttribute('aria-label') || 'Unknown Button'
    const pagePath = window.location.pathname

    // Track the custom event
    trackCustomEvent(actionId, buttonText, pagePath)
  }

  // Add event listener when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      document.addEventListener('click', handleActionClick, true)
    })
  }
  else {
    document.addEventListener('click', handleActionClick, true)
  }

  // Also handle Vue router navigation for programmatic clicks
  const router = useRouter()
  if (router) {
    router.afterEach((to) => {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        // Re-attach listeners for dynamically added content
        document.addEventListener('click', handleActionClick, true)
      }, 100)
    })
  }
})
