/**
 * `v-safe-html` - a drop-in for `v-html` on content written by users. The value is cleaned by `sanitizeUserHtml`
 * (see utils/safeHtml.ts) on the server render as well as on the client.
 */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('safe-html', {
    // Server render: emit the cleaned HTML, so a stored payload never reaches the browser.
    getSSRProps(binding) {
      return { innerHTML: sanitizeUserHtml(binding.value) }
    },
    created(el, binding) {
      // While hydrating, the element already holds the cleaned server HTML - do not redo the work.
      if (el.childNodes.length === 0) {
        el.innerHTML = sanitizeUserHtml(binding.value)
      }
    },
    updated(el, binding) {
      if (binding.value !== binding.oldValue) {
        el.innerHTML = sanitizeUserHtml(binding.value)
      }
    },
  })
})
