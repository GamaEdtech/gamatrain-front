import L from 'leaflet'
import 'leaflet.markercluster'

export default defineNuxtPlugin(_nuxtApp => ({
  provide: {
    L,
  },
}))
