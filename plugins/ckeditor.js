import { CkeditorPlugin } from '@ckeditor/ckeditor5-vue'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(CkeditorPlugin)
})
