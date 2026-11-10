<template>
  <div class="finder-map">
    <div
      ref="mapElement"
      class="finder-map__canvas"
    />
    <slot />

    <!-- Map tools: where am I, back home, and add a school that is missing here. -->
    <div class="finder-map__tools d-flex flex-column ga-2">
      <v-tooltip
        text="My location"
        location="start"
        :open-on-focus="false"
      >
        <template #activator="{ props: tip }">
          <v-btn
            v-bind="tip"
            icon="md:my_location"
            size="small"
            color="surface"
            elevation="2"
            aria-label="Go to my location"
            :loading="locating"
            @click="goToMyLocation"
          />
        </template>
      </v-tooltip>
      <v-tooltip
        v-if="home"
        text="Back to home"
        location="start"
        :open-on-focus="false"
      >
        <template #activator="{ props: tip }">
          <v-btn
            v-bind="tip"
            icon="md:home"
            size="small"
            color="surface"
            elevation="2"
            aria-label="Back to home"
            @click="goHome"
          />
        </template>
      </v-tooltip>
      <v-tooltip
        text="Add a missing school here"
        location="start"
        :open-on-focus="false"
      >
        <template #activator="{ props: tip }">
          <v-btn
            v-bind="tip"
            icon="md:add_location_alt"
            size="small"
            color="surface"
            elevation="2"
            aria-label="Add a missing school at the centre of the map"
            @click="addSchoolHere"
          />
        </template>
      </v-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SchoolMapPointDTO, SchoolMapTileDTO } from '@/types'
import type { SchoolHome } from '@/composables/useSchoolHome'

export interface FinderMapView {
  south: number
  west: number
  north: number
  east: number
  /** Matching schools in the loaded tiles (a little more than the visible area). */
  total: number
  /** True when every school in view is shown one by one (no clusters). */
  complete: boolean
  loading: boolean
  /** The visitor moved or zoomed the map (not the map framing the list by itself). */
  byUser: boolean
}

type Leaflet = typeof import('leaflet')
type ApiValue = string | number | boolean | (string | number)[] | undefined

const props = withDefaults(defineProps<{
  /** The list's filters (see schoolFinderFilterParams); the map adds the area itself. */
  params: Record<string, ApiValue>
  home?: SchoolHome | null
  /** Radius (km) drawn around home. */
  homeRadiusKm?: number | null
  selectedId?: number | null
  /** Frame these points when the map opens (the listed schools). */
  frame?: { lat: number, lng: number }[]
}>(), {
  home: null,
  homeRadiusKm: null,
  selectedId: null,
  frame: () => [],
})

const emit = defineEmits<{
  'select': [point: SchoolMapPointDTO | null]
  'view-change': [view: FinderMapView]
}>()

const MAX_LATITUDE = 85.0511
// Tiles are asked one zoom level up (512 px on screen), which keeps a full-screen map at about a dozen requests.
const TILE_ZOOM_OFFSET = 1

const mapElement = ref<HTMLElement | null>(null)
const { fetchLocation } = useCurrentLocation()
const locating = ref(false)
let youLayer: import('leaflet').LayerGroup | null = null

const goToMyLocation = async () => {
  locating.value = true
  try {
    const position = await fetchLocation()
    if (!position || !L || !map || !youLayer) return
    youLayer.clearLayers()
    youLayer.addLayer(L.circleMarker([position.lat, position.lng], { radius: 8, color: '#fff', weight: 3, fillColor: '#175CD3', fillOpacity: 1, interactive: false }))
    movedByUser = true
    map.flyTo([position.lat, position.lng], 14)
  }
  catch {
    // useCurrentLocation already told the visitor why.
  }
  finally {
    locating.value = false
  }
}

const goHome = () => {
  if (!map || !props.home) return
  movedByUser = true
  map.flyTo([props.home.lat, props.home.lng], 14)
}

// The add form starts with the location the visitor was looking at.
const addSchoolHere = () => {
  const center = map?.getCenter()
  navigateTo(center ? `/school/add?lat=${center.lat.toFixed(6)}&lng=${center.lng.toFixed(6)}` : '/school/add')
}
let L: Leaflet | null = null
let map: import('leaflet').Map | null = null
let schoolLayer: import('leaflet').LayerGroup | null = null
let homeLayer: import('leaflet').LayerGroup | null = null
const tileCache = new Map<string, Promise<SchoolMapTileDTO | null>>()
let renderToken = 0
// Set while the map frames the list by itself, so that move doesn't count as the visitor's.
let framing = false
let movedByUser = false

const paramsKey = computed(() => JSON.stringify(props.params))

const fetchTile = (z: number, x: number, y: number) => {
  const key = `${paramsKey.value}|${z}/${x}/${y}`
  let tile = tileCache.get(key)
  if (!tile) {
    tile = useApiService.get<{ data?: SchoolMapTileDTO }>(`/api/v2/schools/map/${z}/${x}/${y}`, props.params, { public: true })
      .then(response => response?.data ?? null)
      .catch(() => {
        tileCache.delete(key)
        return null
      })
    tileCache.set(key, tile)
  }
  return tile
}

const tileX = (lng: number, n: number) => Math.min(n - 1, Math.max(0, Math.floor(((lng + 180) / 360) * n)))
const tileY = (lat: number, n: number) => {
  const rad = (Math.max(-MAX_LATITUDE, Math.min(MAX_LATITUDE, lat)) * Math.PI) / 180
  return Math.min(n - 1, Math.max(0, Math.floor(((1 - Math.log(Math.tan(rad) + (1 / Math.cos(rad))) / Math.PI) / 2) * n)))
}

const escapeHtml = (text: string) => text.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;' }[char] as string))

const formatCount = (count: number) => (count >= 10000 ? `${Math.round(count / 1000)}k` : count >= 1000 ? `${(count / 1000).toFixed(1)}k` : String(count))

const render = async () => {
  if (!L || !map || !schoolLayer) return
  const token = ++renderToken
  const bounds = map.getBounds()
  const south = Math.max(-MAX_LATITUDE, bounds.getSouth())
  const north = Math.min(MAX_LATITUDE, bounds.getNorth())
  const west = Math.max(-180, bounds.getWest())
  const east = Math.min(180, bounds.getEast())
  const view = { south, west, north, east }
  const byUser = movedByUser
  emit('view-change', { ...view, total: 0, complete: false, loading: true, byUser })

  const z = Math.max(0, Math.min(18, Math.round(map.getZoom()) - TILE_ZOOM_OFFSET))
  const n = 2 ** z
  const requests: Promise<SchoolMapTileDTO | null>[] = []
  for (let x = tileX(west, n); x <= tileX(east, n); x++) {
    for (let y = tileY(north, n); y <= tileY(south, n); y++) {
      requests.push(fetchTile(z, x, y))
    }
  }

  const tiles = await Promise.all(requests)
  // The map moved on while these were loading.
  if (token !== renderToken || !L || !schoolLayer) return

  schoolLayer.clearLayers()
  let total = 0
  let complete = true
  for (const tile of tiles) {
    if (!tile) {
      complete = false
      continue
    }
    total += tile.total
    if (tile.clusters?.length) complete = false
    for (const cluster of tile.clusters ?? []) {
      const size = Math.round(Math.min(64, 30 + (Math.log10(cluster.count + 1) * 10)))
      const marker = L.marker([cluster.lat, cluster.lng], {
        icon: L.divIcon({
          className: 'finder-map__cluster-wrap',
          html: `<span class="finder-map__cluster" style="width:${size}px;height:${size}px">${formatCount(cluster.count)}</span>`,
          iconSize: [size, size],
        }),
        keyboard: true,
        title: `${cluster.count} schools`,
        alt: `${cluster.count} schools, zoom in`,
      })
      marker.on('click', () => map?.flyTo([cluster.lat, cluster.lng], Math.min(18, map.getZoom() + 2)))
      schoolLayer.addLayer(marker)
    }
    for (const point of tile.schools ?? []) {
      const selected = point.id === props.selectedId
      const label = point.rating ? `&#9733; ${point.rating.toFixed(1)}` : ''
      const marker = L.marker([point.lat, point.lng], {
        icon: L.divIcon({
          className: 'finder-map__pin-wrap',
          html: `<span class="finder-map__pin${selected ? ' finder-map__pin--selected' : ''}${label ? '' : ' finder-map__pin--dot'}">${label}</span>`,
          iconSize: label ? [52, 28] : [18, 18],
          iconAnchor: label ? [26, 28] : [9, 9],
        }),
        keyboard: true,
        title: point.name,
        alt: escapeHtml(point.name),
        zIndexOffset: selected ? 1000 : 0,
      })
      marker.on('click', () => emit('select', point))
      schoolLayer.addLayer(marker)
    }
  }

  emit('view-change', { ...view, total, complete, loading: false, byUser })
}

const drawHome = () => {
  if (!L || !map || !homeLayer) return
  homeLayer.clearLayers()
  if (!props.home) return
  homeLayer.addLayer(L.marker([props.home.lat, props.home.lng], {
    icon: L.divIcon({ className: 'finder-map__pin-wrap', html: '<span class="finder-map__home">Home</span>', iconSize: [58, 26], iconAnchor: [29, 13] }),
    interactive: false,
    zIndexOffset: 2000,
  }))
  if (props.homeRadiusKm) {
    homeLayer.addLayer(L.circle([props.home.lat, props.home.lng], {
      radius: props.homeRadiusKm * 1000,
      color: '#1E2A44',
      weight: 2,
      dashArray: '6 6',
      fill: false,
      interactive: false,
    }))
  }
}

onMounted(async () => {
  const module = await import('leaflet')
  await import('leaflet/dist/leaflet.css')
  L = (module.default ?? module) as Leaflet
  if (!mapElement.value) return

  map = L.map(mapElement.value, { zoomControl: true, minZoom: 2, worldCopyJump: true })
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map)
  schoolLayer = L.layerGroup().addTo(map)
  homeLayer = L.layerGroup().addTo(map)
  youLayer = L.layerGroup().addTo(map)

  frameMap()

  // A drag or a zoom by the visitor (not a fitBounds by code) makes the next search "this area".
  map.on('dragstart zoomstart', () => {
    if (!framing) movedByUser = true
  })
  map.on('moveend', () => {
    framing = false
    render().finally(() => {
      movedByUser = false
    })
  })
  map.on('click', () => emit('select', null))
  drawHome()
  render()
})

function frameMap() {
  if (!L || !map) return
  framing = true
  if (props.frame.length) {
    map.fitBounds(L.latLngBounds(props.frame.map(point => [point.lat, point.lng] as [number, number])), { padding: [32, 32], maxZoom: 14 })
  }
  else if (props.home) {
    map.setView([props.home.lat, props.home.lng], 13)
  }
  else {
    map.setView([15, 20], 2)
  }
}

onBeforeUnmount(() => {
  map?.remove()
  map = null
})

watch(paramsKey, () => {
  tileCache.clear()
  render()
})

watch(() => props.selectedId, () => render())

// A new list (other area or filters) is framed again; the visitor's own moves never are.
watch(() => JSON.stringify(props.frame), (value, old) => {
  if (value !== old && props.frame.length) frameMap()
})

watch(() => [props.home, props.homeRadiusKm], drawHome, { deep: true })

defineExpose({
  flyTo: (lat: number, lng: number, zoom = 14) => map?.flyTo([lat, lng], zoom),
  reframe: frameMap,
  invalidateSize: () => map?.invalidateSize(),
})
</script>

<style scoped>
.finder-map {
  position: relative;
  width: 100%;
  height: 100%;
}

.finder-map__tools {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 500;
}

.finder-map__canvas {
  width: 100%;
  height: 100%;
  background: rgb(var(--v-theme-grey100));
}

/* Dark theme: OpenStreetMap has no dark tiles, so the light ones are inverted (hue-rotate keeps water blue, parks green). */
.v-theme--dark .finder-map :deep(.leaflet-tile-pane) {
  filter: invert(1) hue-rotate(180deg) brightness(0.95) contrast(0.9);
}

.v-theme--dark .finder-map :deep(.leaflet-container) {
  background: rgb(var(--v-theme-surface));
}

.v-theme--dark .finder-map :deep(.leaflet-bar a) {
  background-color: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-grey900));
  border-bottom-color: rgb(var(--v-theme-borderSubtle));
}

.v-theme--dark .finder-map :deep(.leaflet-control-attribution) {
  background-color: rgba(var(--v-theme-surface), 0.8);
  color: rgb(var(--v-theme-grey700));
}

.v-theme--dark .finder-map :deep(.leaflet-control-attribution a) {
  color: rgb(var(--v-theme-info));
}
</style>

<style>
/* Leaflet builds the markers itself, outside this component's scope. */
.finder-map__cluster-wrap,
.finder-map__pin-wrap {
  background: none;
  border: none;
}

.finder-map__cluster {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(30, 42, 68, 0.9);
  border: 3px solid #fff;
  color: #fff;
  font: 700 13px/1 Inter, system-ui, sans-serif;
  box-shadow: 0 2px 8px rgba(16, 24, 40, 0.3);
  cursor: pointer;
}

.finder-map__pin {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  height: 26px;
  padding: 0 8px;
  border-radius: 999px;
  background: #fff;
  border: 2px solid #fff;
  color: #1e2a44;
  font: 700 12px/1 Inter, system-ui, sans-serif;
  box-shadow: 0 2px 6px rgba(16, 24, 40, 0.35);
  cursor: pointer;
  white-space: nowrap;
}

.finder-map__pin--dot {
  min-width: 0;
  width: 16px;
  height: 16px;
  padding: 0;
  background: #1e2a44;
}

.finder-map__pin--selected {
  background: #ffb300;
}

.v-theme--dark .finder-map__pin {
  background: #161b26;
  border-color: #161b26;
  color: #ececed;
}

.v-theme--dark .finder-map__pin--dot {
  background: #ececed;
  border-color: #161b26;
}

.v-theme--dark .finder-map__pin--selected {
  background: #ffb300;
  color: #1e2a44;
}

.v-theme--dark .finder-map__cluster {
  background: rgba(236, 236, 237, 0.92);
  border-color: #161b26;
  color: #161b26;
}

.finder-map__home {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  background: #1e2a44;
  border: 2px solid #fff;
  color: #fff;
  font: 600 12px/1 Inter, system-ui, sans-serif;
}
</style>
