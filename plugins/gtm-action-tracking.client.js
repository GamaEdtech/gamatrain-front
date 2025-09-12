/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/**
 * Global GTM action tracking plugin
 * Automatically tracks clicks on elements with data-action-id attributes
 */

export default defineNuxtPlugin(() => {
  // Only run on client side
  if (typeof window === 'undefined') return

  // Import the tracking composable
  const { trackActionClick } = useGtmTracking()

  // Function to handle click events
  const handleActionClick = (event) => {
    const target = event.target.closest('[data-action-id]')
    if (!target) return

    const actionId = target.getAttribute('data-action-id')
    const buttonText = target.textContent?.trim() || target.getAttribute('aria-label') || 'Unknown Button'
    const pagePath = window.location.pathname

    // Track the action click
    trackActionClick(actionId, buttonText, pagePath, {
      element_tag: target.tagName.toLowerCase(),
      element_class: target.className,
      element_id: target.id || null,
    })
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
