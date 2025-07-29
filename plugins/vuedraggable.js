import { defineNuxtPlugin } from '#app'
import Draggable from 'vuedraggable'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('Draggable', Draggable)
})
