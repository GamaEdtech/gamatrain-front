import { defineNuxtPlugin } from '#app'
import { reactive } from 'vue'

export default defineNuxtPlugin((nuxtApp) => {
  // Create reactive snackbar state that will be available globally
  const snackbar = reactive({
    show: false,
    text: '',
    color: 'success',
    timeout: 3000,
  })

  // Create toast methods
  const toast = {
    show(text, options = {}) {
      snackbar.text = text
      snackbar.color = options.color || 'primary'
      snackbar.timeout = options.timeout || 3000
      snackbar.show = true
    },
    success(text, options = {}) {
      this.show(text, { color: 'success', ...options })
    },
    error(text, options = {}) {
      this.show(text, { color: 'error', ...options })
    },
    info(text, options = {}) {
      this.show(text, { color: 'info', ...options })
    },
    warning(text, options = {}) {
      this.show(text, { color: 'warning', ...options })
    },
  }

  // Provide both the reactive snackbar state and the toast methods
  nuxtApp.provide('snackbar', snackbar)
  nuxtApp.provide('toast', toast)
})
