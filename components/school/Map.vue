<template>
  <div style="height: 100%; width: 100%">
    <ClientOnly>
      <LMap
        ref="map"
        :zoom="zoom"
        :min-zoom="minZoom"
        :center="center"
        :use-global-leaflet="true"
        @movestart="onMoveStart"
        @moveend="onMoveEnd"
        @ready="onMapReady"
      >
        <LTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
          layer-type="base"
          name="OpenStreetMap"
        />
      </LMap>
    </ClientOnly>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  initialCenter: {
    type: Array,
    default: () => [39.90973623453719, -81.12304687500001],
  },
  initialZoom: {
    type: Number,
    default: 6,
  },
})

const emit = defineEmits([
  'mapMoved',
  'mapMoveStart',
  'userLocationFound',
  'school-marker-clicked',
  'school-marker-click-error',
])

const map = ref(null)
const zoom = ref(props?.initialZoom)
const minZoom = ref(2)
const center = ref(props?.initialCenter)
const schoolIcon = ref(null)
const isMapReady = ref(false)
const isModuleImport = ref(false)

onMounted(() => {
  getUserLocation()

  const L = window.L
  schoolIcon.value = L.icon({
    iconUrl: '/images/school-marker.png',
    iconSize: [40, 40],
    iconAnchor: [12, 25],
    popupAnchor: [1, -25],
  })

  isModuleImport.value = true
  if (isMapReady.value) {
    map.value.leafletObject.setView(center.value)
    setMarkers()
  }
})

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

    const { markers } = await useLMarkerCluster({
      leafletObject: map.value.leafletObject,
      markers: mapItems,
    })

    // Enhanced marker click handling with complete data passing
    markers.forEach((marker, index) => {
      // Store school data directly on marker for reliable access
      marker.schoolData = mapItems[index].schoolData

      marker.on('click', (e) => {
        try {
          // Get school data from marker (more reliable than searching props.items)
          const schoolData = e.target.schoolData

          if (validateMarkerData(schoolData)) {
            emit('school-marker-clicked', schoolData)
          }
          else {
            // Emit error event with school ID for fallback handling
            console.warn('Invalid school data in marker click:', schoolData)
            emit('school-marker-click-error', {
              id: e.target.options.alt,
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
            id: e.target.options?.alt,
            error: error.message,
            context: {
              zoom: map.value?.leafletObject?.getZoom(),
              center: map.value?.leafletObject?.getCenter(),
            },
          })
        }
      })
    })
  }
  catch (error) {
    console.error('Error creating map markers:', error)
  }
}

async function onMapReady() {
  isMapReady.value = true
  if (isModuleImport.value) {
    map.value.leafletObject.setView(center.value)
    setMarkers()
  }
}

const onMoveStart = () => {
  emit('mapMoveStart')
}

const onMoveEnd = (event) => {
  const bounds = event.target.getBounds()
  const newCenter = event.target.getCenter()
  const ne = bounds.getNorthEast()
  const distance = calculateDistance(newCenter, ne)
  emit('mapMoved', {
    center: [newCenter.lat, newCenter.lng],
    distance: distance,
  })
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
    if (isMapReady.value) {
      setMarkers()
    }
  },
)
</script>
