<template>
  <div :class="mapClass">
    <client-only>
      <l-map
        id="schoolDetailsMap"
        ref="schoolMap"
        :zoom="map.zoom"
        :min-zoom="map.minZoom"
        :center="map.center"
        :use-global-leaflet="false"
        @click="openLocationDialog"
      >
        <l-tile-layer :url="map.url" />
        <l-marker :lat-lng="map.latLng">
          <LIcon
            :icon-url="map.schoolIcon"
            :icon-size="[64, 64]"
            :icon-anchor="[16, 32]"
          />
        </l-marker>
      </l-map>
      <div>{{ mapClass }}</div>
    </client-only>
  </div>

  <SelectLocationDialog
    v-model="showSelectLocationDialog"
    :content-data="contentData"
    :map="map"
    :map-submit-loader="mapSubmitLoader"
    @update="handleSelectLocationUpdate"
  />
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import SelectLocationDialog from '@/components/common/SelectLocationDialog.vue'

const props = defineProps({
  class: {
    type: String,
    required: false,
    default: '',
  },
  content: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['location-updated'])
const schoolMap = ref(null)
const nuxtApp = useNuxtApp()
const route = useRoute()
const contentData = ref(props.content)
const showSelectLocationDialog = ref(false)
const mapSubmitLoader = ref(false)
const mapMarkerData = ref({})
const map = reactive({
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  zoom: 10,
  minZoom: 2,
  center: [0, 0],
  latLng: [0, 0],
  object: null,
  boundingBox: {},
  schoolIcon: '/images/school-marker.png',
})
const mapClass = ref(props.class)

function openLocationDialog() {
  showSelectLocationDialog.value = true
  setTimeout(() => {
    // Implement with template refs if needed
    window.dispatchEvent(new Event('resize'))
  }, 500)
}
function handleSelectLocationUpdate(payload) {
  mapMarkerData.value = payload
  handleUpdate()
}
function handleUpdate() {
  const formData = {
    latitude: mapMarkerData.value.lat,
    longitude: mapMarkerData.value.lng,
  }

  if (mapMarkerData.value?.countryId) {
    formData.countryId = mapMarkerData.value.countryId
  }
  if (mapMarkerData.value?.stateId) {
    formData.stateId = mapMarkerData.value.stateId
  }
  if (mapMarkerData.value?.cityId) {
    formData.cityId = mapMarkerData.value.cityId
  }

  mapSubmitLoader.value = true
  useApiService
    .post(`/api/v2/schools/${route.params.id}/contributions`, formData)
    .then(async (response) => {
      if (response.succeeded) {
        showSelectLocationDialog.value = false
        nuxtApp.$toast?.success(
          'Your contribution has been successfully submitted',
        )
        // Emit the updated location data
        emit('location-updated', {
          countryId: mapMarkerData.value?.countryId,
          stateId: mapMarkerData.value?.stateId,
          cityId: mapMarkerData.value?.cityId,
          countryTitle: mapMarkerData.value?.countryTitle,
          stateTitle: mapMarkerData.value?.stateTitle,
          cityTitle: mapMarkerData.value?.cityTitle,
        })
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

watch(
  () => props.class,
  (val) => {
    mapClass.value = val
  },
)

watch(
  () => props.content,
  (newContent) => {
    contentData.value = newContent
    if (newContent?.latitude && newContent?.longitude) {
      map.center = [newContent.latitude, newContent.longitude]
      map.latLng = [newContent.latitude, newContent.longitude]
    }
  },
  { deep: true },
)

onMounted(() => {
  if (contentData.value.latitude && contentData.value.longitude) {
    map.center = [contentData.value.latitude, contentData.value.longitude]
    map.latLng = [contentData.value.latitude, contentData.value.longitude]
  }
})
</script>

<style scoped>
#schoolDetailsMap {
  border-radius: 0.6rem;
  height: 28.1rem !important;
  max-height: 28.1rem;
  width: 100%;
}
.center-image {
  position: absolute;
  top: 0;
  left: 0 !important;
  margin: auto;
  z-index: 3;
  right: 0 !important;
  width: 70% !important;
  max-height: 26.4rem;
  overflow: hidden;
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
}

.center-image.enter-img-holder,
.center-image.position-relative {
  border-right: 1px solid white;
  border-left: 1px solid white;
}

.under-image-left,
.under-image-right {
  position: absolute;
  top: 0;
  max-height: 26.4rem;
  width: 80% !important;
}

.under-image-left {
  left: -32%;
  z-index: 1;
}

.under-image-left.enter-img-holder p,
.under-image-left.position-relative p {
  max-width: 2rem;
}

.under-image-right {
  right: -32%;
  z-index: 2;
}

.under-image-right.enter-img-holder p,
.under-image-right.position-relative p {
  max-width: 2rem;
}
</style>
