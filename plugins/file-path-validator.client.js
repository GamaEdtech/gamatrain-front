/**
 * Client-side plugin to validate image paths in development mode
 * This helps catch case sensitivity issues during development
 */
import { defineNuxtPlugin, useRouter } from '#app'

export default defineNuxtPlugin(() => {
  // Only run in development mode
  if (process.env.NODE_ENV !== 'development') {
    return
  }

  // Function to validate image src attributes
  const validateImagePaths = () => {
    const images = document.querySelectorAll('img[src]')
    const issues = []

    images.forEach((img) => {
      const src = img.getAttribute('src')

      // Skip external URLs and data URLs
      if (!src || src.startsWith('http') || src.startsWith('data:') || src.startsWith('//')) {
        return
      }

      // Check if image loads successfully
      const testImg = new Image()
      testImg.onerror = () => {
        issues.push({
          element: img,
          src: src,
          issue: 'Failed to load - possible case sensitivity issue',
        })

        console.warn(`🚨 Image path issue detected:`, {
          src: src,
          element: img,
          suggestion: 'Check if file exists with exact case match',
        })
      }

      testImg.src = src
    })

    if (issues.length > 0) {
      console.group('🔍 File Path Validation Issues')
      issues.forEach((issue) => {
        console.warn(`❌ ${issue.src}: ${issue.issue}`)
      })
      console.groupEnd()
    }
  }

  // Run validation after DOM is loaded
  if (import.meta.client) {
    // Initial validation
    setTimeout(validateImagePaths, 1000)

    // Re-validate on route changes
    const router = useRouter()
    router.afterEach(() => {
      setTimeout(validateImagePaths, 500)
    })
  }
})
