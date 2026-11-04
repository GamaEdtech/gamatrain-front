<template>
  <!-- Hidden without a location; "Map location" in the "Fill in the gaps" card opens the picker. -->
  <section
    :class="['detail-section', { 'd-none': !hasLocation }]"
    aria-labelledby="location-title"
  >
    <div class="section-head">
      <h2
        id="location-title"
        class="section-title"
      >
        Location
      </h2>
      <v-btn
        variant="text"
        color="info"
        size="small"
        class="text-none gtext-t5 px-2 section-action"
        @click="openLocationDialog"
      >
        Edit location
      </v-btn>
    </div>

    <div
      ref="frameRef"
      class="map-frame"
    >
      <LazyMap
        v-if="showMap"
        ref="mapRef"
        :initial-center="latLng"
        :highlight-location="latLng"
        :show-highlight-location="true"
        :initial-zoom="15"
        :border-radius="12"
      />
      <v-card
        v-else
        flat
        rounded="0"
        class="map-placeholder w-100 h-100 d-flex flex-column align-center justify-center ga-1 text-grey700 font-weight-bold"
        @click="showMap = true"
      >
        <v-icon
          size="28"
          color="primary"
          aria-hidden="true"
        >
          mdi-map-marker
        </v-icon>
        Show map
      </v-card>
    </div>

    <LazySelectLocationDialog
      v-if="dialogMounted"
      v-model="showSelectLocationDialog"
      :content-data="content"
      :map="dialogMap"
      :map-submit-loader="mapSubmitLoader"
      @update="handleSelectLocationUpdate"
    />
  </section>
</template>

<script setup>
const props = defineProps({
  content: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['location-updated'])

// Leaflet and its tiles are the heaviest thing on this page and used to be its LCP, so they load
// only once the map is on screen and the visitor has scrolled or tapped (LCP stops counting then),
// or when they ask for it.
const LazyMap = defineAsyncComponent(() => import('@/components/common/Map.client.vue'))
const LazySelectLocationDialog = defineAsyncComponent(() => import('@/components/common/SelectLocationDialog.vue'))

const nuxtApp = useNuxtApp()
const route = useRoute()
const { requireSignIn } = useContributeGate()
const frameRef = ref(null)
const mapRef = ref(null)
const showMap = ref(false)
const dialogMounted = ref(false)
const showSelectLocationDialog = ref(false)
const mapSubmitLoader = ref(false)

const hasLocation = computed(() => !!(props.content.latitude && props.content.longitude))
const latLng = computed(() => [Number(props.content.latitude), Number(props.content.longitude)])
const dialogMap = computed(() => ({
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  zoom: hasLocation.value ? 15 : 6,
  minZoom: 2,
  center: hasLocation.value ? latLng.value : [0, 0],
  latLng: hasLocation.value ? latLng.value : [0, 0],
}))

let observer = null
let interacted = false
let inView = false
const interactionEvents = ['scroll', 'pointerdown', 'keydown', 'touchstart']

function maybeShowMap() {
  if (interacted && inView) {
    showMap.value = true
    cleanup()
  }
}

function onInteraction() {
  interacted = true
  interactionEvents.forEach(name => window.removeEventListener(name, onInteraction))
  maybeShowMap()
}

function cleanup() {
  observer?.disconnect()
  observer = null
  interactionEvents.forEach(name => window.removeEventListener(name, onInteraction))
}

function watchVisibility() {
  if (!frameRef.value || showMap.value) return
  observer = new IntersectionObserver((entries) => {
    inView = entries.some(entry => entry.isIntersecting)
    maybeShowMap()
  }, { rootMargin: '200px' })
  observer.observe(frameRef.value)
  interactionEvents.forEach(name => window.addEventListener(name, onInteraction, { passive: true }))
}

onMounted(watchVisibility)
onBeforeUnmount(cleanup)

function openLocationDialog() {
  if (!requireSignIn()) return
  dialogMounted.value = true
  showSelectLocationDialog.value = true
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'))
  }, 500)
}

function handleSelectLocationUpdate(payload) {
  const formData = {
    latitude: payload.lat,
    longitude: payload.lng,
  }
  if (payload?.countryId) formData.countryId = payload.countryId
  if (payload?.stateId) formData.stateId = payload.stateId
  if (payload?.cityId) formData.cityId = payload.cityId

  mapSubmitLoader.value = true
  useApiService
    .post(`/api/v2/schools/${route.params.id}/contributions`, formData)
    .then(async (response) => {
      if (response.succeeded) {
        showSelectLocationDialog.value = false
        nuxtApp.$toast?.success('Thank you! Your contribution has been submitted and is pending review.')
        emit('location-updated', {
          latitude: payload.lat,
          longitude: payload.lng,
          countryId: payload?.countryId,
          stateId: payload?.stateId,
          cityId: payload?.cityId,
          countryTitle: payload?.countryTitle,
          stateTitle: payload?.stateTitle,
          cityTitle: payload?.cityTitle,
        })
        await nextTick()
        if (showMap.value) mapRef.value?.setView(payload.lat, payload.lng, 15)
        else watchVisibility()
      }
      else {
        nuxtApp.$toast?.error(response?.errors[0]?.message)
      }
    })
    .catch((err) => {
      if (err?.response?.status == 401 || err?.response?.status == 403) {
        nuxtApp.$toast?.error('Please login to update location')
      }
      else nuxtApp.$toast?.error(err?.response?.data?.message)
    })
    .finally(() => {
      mapSubmitLoader.value = false
    })
}

defineExpose({ openLocationDialog })
</script>

<style scoped>
.map-frame {
  height: 220px;
  border-radius: 12px;
  overflow: hidden;
  background: rgb(var(--v-theme-grey100));
}

.map-placeholder {
  font-size: 14px;
  background:
    repeating-linear-gradient(45deg, rgba(var(--v-theme-grey300), 0.35) 0 10px, transparent 10px 20px),
    rgb(var(--v-theme-grey100));
}
</style>
