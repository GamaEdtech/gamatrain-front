<template>
  <div
    ref="mapElement"
    :style="{
      height: '100%',
      width: '100%',
      borderRadius: borderRadius + 'px',
      backgroundColor: '#f2f4f7',
    }"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  initialCenter: {
    type: Array,
    default: () => [39.90973623453719, -81.12304687500001],
  },
  initialZoom: {
    type: Number,
    default: 6,
  },
  useCluster: {
    type: Boolean,
    default: false,
  },
  enableUserLocation: {
    type: Boolean,
    default: false,
  },
  showHighlightLocation: {
    type: Boolean,
    default: false,
  },
  highlightLocation: {
    type: Array,
    default: () => [],
  },
  borderRadius: {
    type: Number,
    default: 0,
  },
  zoomEnabled: {
    type: Boolean,
    default: true,
  },
  iconUrl: {
    type: String,
    default: '/images/school-marker.png',
  },
  useForSelectLocation: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'mapMoved',
  'mapMoveStart',
  'userLocationFound',
  'school-marker-clicked',
  'school-marker-click-error',
  'clickOnMap',
  'locationSelectedUpdate',
])

const mapElement = ref(null)
const markerCluster = ref(null)
let L = null
const map = ref(null)
const zoom = ref(props?.initialZoom)
const minZoom = ref(2)
const center = ref(props?.initialCenter)
const schoolIcon = ref(null)
const highlightMarker = ref(null)

onMounted(async () => {
  L = await loadLeaflet()
  map.value = L.map(mapElement.value, {
    center: center.value,
    zoom: zoom.value,
    minZoom: minZoom.value,
    zoomControl: props.zoomEnabled,
    scrollWheelZoom: props.zoomEnabled,
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors',
  }).addTo(map.value)

  schoolIcon.value = L.icon({
    iconUrl: props.iconUrl,
    iconSize: [40, 40],
    iconAnchor: [12, 25],
    popupAnchor: [1, -25],
  })

  map.value.on('movestart', onMoveStart)
  map.value.on('moveend', onMoveEnd)
  map.value.on('click', clickOnMap)
  map.value.on('move', onMove)

  if (props.enableUserLocation) {
    getUserLocation()
  }
  if (props.showHighlightLocation && props.highlightLocation.length > 0) {
    addHighlightMarker(props.highlightLocation)
  }
})
onBeforeUnmount(() => {
  if (map.value) {
    map.value.remove()
    map.value = null
  }
})

const loadLeaflet = async () => {
  if (!L) {
    const leaflet = await import('leaflet')
    await import('leaflet/dist/leaflet.css')

    delete leaflet.Icon.Default.prototype._getIconUrl
    globalThis.L = leaflet

    if (props.useCluster) {
      await import('leaflet.markercluster')
      await import('leaflet.markercluster/dist/MarkerCluster.css')
      await import('leaflet.markercluster/dist/MarkerCluster.Default.css')
    }

    L = leaflet
  }
  return L
}

const addHighlightMarker = (location) => {
  if (!L || !map.value) return
  highlightMarker.value = L.marker([location[0], location[1]], {
    icon: schoolIcon.value,
  })
  highlightMarker.value.addTo(map.value)
  map.value.setView([location[0], location[1]], zoom.value)
}

// Validate marker data before creating markers
const validateMarkerData = (schoolData) => {
  if (!schoolData) return false

  const requiredFields = ['id', 'name', 'lat', 'long']
  const hasAllRequired = requiredFields.every(
    field =>
      schoolData[field] !== undefined
      && schoolData[field] !== null
      && schoolData[field] !== '',
  )

  return hasAllRequired
}

async function setMarkers() {
  try {
    if (!L || !map.value) return

    // Filter and validate school items before creating markers
    const validSchools
      = props?.items?.filter(
        item => item.lat && item.long && validateMarkerData(item),
      ) || []

    const mapItems = validSchools.map(item => ({
      lat: item.lat,
      lng: item.long,
      name: item.name,
      id: item.id,
      schoolData: item, // Store complete school data
      options: {
        icon: schoolIcon.value,
        alt: item.id,
      },
    }))

    if (mapItems.length === 0) {
      console.warn('No valid school markers to display on map')
      return
    }

    const markers = mapItems.map((item) => {
      return L.marker([item.lat, item.lng], {
        icon: schoolIcon.value,
        alt: item.id,
      })
    })

    // markerCluster.value = L.markerClusterGroup({ animate: false });
    if (!markerCluster.value) {
      markerCluster.value = L.markerClusterGroup({ animate: false })
      map.value.addLayer(markerCluster.value)
    }

    // Enhanced marker click handling with complete data passing
    markers.forEach((marker, index) => {
      const exists = markerCluster.value
        .getLayers()
        .some(m => m.options.alt === marker.options.alt)
      if (!exists) {
        marker.schoolData = mapItems[index].schoolData
        marker.on('click', (e) => {
          handleClickMarker(e)
        })
        markerCluster.value.addLayer(marker)
      }
    })
  }
  catch (error) {
    console.error('Error creating map markers:', error)
  }
}

const handleClickMarker = (event) => {
  try {
    // Get school data from marker (more reliable than searching props.items)
    const schoolData = event.target.schoolData

    if (validateMarkerData(schoolData)) {
      emit('school-marker-clicked', schoolData)
    }
    else {
      // Emit error event with school ID for fallback handling
      console.warn('Invalid school data in marker click:', schoolData)
      emit('school-marker-click-error', {
        id: event.target.options.alt,
        error: 'Invalid school data',
        context: {
          zoom: map.value?.leafletObject?.getZoom(),
          center: map.value?.leafletObject?.getCenter(),
        },
      })
    }
  }
  catch (error) {
    console.error('Error handling marker click:', error)
    emit('school-marker-click-error', {
      id: event.target.options?.alt,
      error: error.message,
      context: {
        zoom: map.value?.leafletObject?.getZoom(),
        center: map.value?.leafletObject?.getCenter(),
      },
    })
  }
}

const onMoveStart = () => {
  emit('mapMoveStart')
}

const onMoveEnd = () => {
  if (!map.value) return

  const leafletMap = map.value.leafletObject || map.value
  const bounds = leafletMap.getBounds()
  const newCenter = leafletMap.getCenter()
  const ne = bounds.getNorthEast()

  const distance = calculateDistance(newCenter, ne)
  emit('mapMoved', {
    center: [newCenter.lat, newCenter.lng],
    distance: distance,
  })
}

const onMove = () => {
  if (props.useForSelectLocation) {
    if (!map.value) return

    const leafletMap = map.value.leafletObject || map.value
    const newCenter = leafletMap.getCenter()
    highlightMarker.value.setLatLng(newCenter)
    emit('locationSelectedUpdate', newCenter)
  }
}

const clickOnMap = () => {
  emit('clickOnMap')
}

const calculateDistance = (point1, point2) => {
  const R = 6371000
  const lat1 = point1.lat * (Math.PI / 180)
  const lon1 = point1.lng * (Math.PI / 180)
  const lat2 = point2.lat * (Math.PI / 180)
  const lon2 = point2.lng * (Math.PI / 180)

  const dLat = lat2 - lat1
  const dLon = lon2 - lon1

  const a
    = Math.sin(dLat / 2) ** 2
      + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return formatNumber(R * c)
}

const formatNumber = (number) => {
  // Remove latest zero from number to avoid error from api side
  const roundedNumber = parseFloat(number.toFixed(6))
  const formattedString = roundedNumber.toString()
  const trimmedString = formattedString.replace(/\.?0+$/, '')
  return parseFloat(trimmedString)
}

const getUserLocation = () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        center.value = [position.coords.latitude, position.coords.longitude]
        if (map.value) {
          map.value.setView(center.value, zoom.value)
        }
        emit('userLocationFound', center.value)
      },
      (error) => {
        console.error('Error getting user location:', error)
      },
    )
  }
}
watch(
  () => props.items,
  () => {
    if (props.useCluster) {
      setMarkers()
    }
  },
)

const setView = (lat, lng, zoom = 8) => {
  if (!map.value) return

  map.value.setView([lat, lng], zoom)
  if (highlightMarker.value) {
    highlightMarker.value.setLatLng([lat, lng])
    emit('locationSelectedUpdate', { lat, lng })
  }
}

defineExpose({ setView })
</script>

<style scoped>
.custom-tooltip {
  background-color: white;
  color: black;
  border: 1px solid #333;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 18px;
  font-weight: bold;
}
</style>
