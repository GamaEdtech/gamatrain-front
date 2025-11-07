import { defineNuxtPlugin } from '#app'
// This file should be client-side only
export default defineNuxtPlugin((nuxtApp) => {
  // Only run on client-side
  if (import.meta.client) {
    // Dynamically import only on client side
    import('vue3-emoji-picker')
      .then((module) => {
        const EmojiPicker = module.default
        // Register as a global component
        nuxtApp.vueApp.component('EmojiPicker', EmojiPicker)
      })
      .catch((error) => {
        console.error('Failed to load emoji picker:', error)
      })
  }
})
