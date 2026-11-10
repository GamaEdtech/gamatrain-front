<template>
  <div class="finder-map">
    <div
      ref="mapElement"
      class="finder-map__canvas"
    />
    <slot v-if="!placing" />

    <!-- Adding a school: the pin stays in the middle and the map moves under it, the way map apps pick a place. -->
    <template v-if="placing">
      <svg
        class="finder-map__place-pin"
        width="44"
        height="56"
        viewBox="0 0 40 50"
        aria-hidden="true"
      >
        <path
          d="M20 48S6 33 6 21a14 14 0 0 1 28 0c0 12-14 27-14 27z"
          fill="#FFB300"
          stroke="#1E2A44"
          stroke-width="2.5"
        />
        <path
          d="M12 22.5 20 18l8 4.5-8 4.5zM15 25v3.5c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5V25"
          fill="none"
          stroke="#1E2A44"
          stroke-width="2"
          stroke-linejoin="round"
        />
      </svg>
      <span
        class="finder-map__place-dot"
        aria-hidden="true"
      />

      <v-card
        class="finder-map__place-card"
        rounded="lg"
        elevation="6"
        role="dialog"
        aria-label="Add a missing school"
      >
        <v-card-text class="pb-2">
          <div class="text-body-1 font-weight-bold text-grey900">
            Where is the school?
          </div>
          <div class="text-body-2 text-grey700 mt-1">
            Move the map until the pin sits on the school.
          </div>
          <div
            class="text-caption text-grey600 mt-2 d-flex align-center ga-1 finder-map__place-address"
          >
            <v-icon size="16">
              md:location_on
            </v-icon>
            <span class="text-truncate">{{ placeAddress || 'Finding the address...' }}</span>
          </div>
        </v-card-text>
        <v-card-actions class="px-4 pb-3 pt-0">
          <v-btn
            variant="text"
            color="grey700"
            class="text-none"
            @click="stopPlacing"
          >
            Cancel
          </v-btn>
          <v-spacer />
          <v-btn
            variant="flat"
            color="grey900"
            rounded="pill"
            class="text-none px-4"
            @click="confirmPlace"
          >
            Add school here
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>

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
        text="Add a missing school"
        location="start"
        :open-on-focus="false"
      >
        <template #activator="{ props: tip }">
          <v-btn
            v-bind="tip"
            icon="md:add_location_alt"
            size="small"
            :color="placing ? 'grey900' : 'surface'"
            elevation="2"
            aria-label="Add a missing school"
            :aria-pressed="placing"
            @click="placing ? stopPlacing() : startPlacing()"
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

// The brand's location pin (public/images/gama-location.svg) marks a school; the same pin in green, with a house, marks
// home, so the visitor's own point reads as different at a glance.
const PIN_OUTLINE = 'M32 4C45.25 4 56 14.75 56 28C56 41.25 38 60 32 60C26 60 8 41.25 8 28C8 14.75 18.75 4 32 4ZM32 14C24.27 14 18 20.27 18 28C18 35.73 24.27 42 32 42C39.73 42 46 35.73 46 28C46 20.27 39.73 14 32 14Z'
const GAMA_MARK = 'M33.27 26.83C34.52 28.32 35.61 31.82 36.02 35.33C36.19 36.83 37.91 37.53 39.02 36.54L39.04 36.53C40.39 35.31 40.42 24.36 38.46 22.03C36.51 19.7 26.04 18.22 24.68 19.44L24.59 19.53C23.53 20.53 23.97 22.35 25.35 22.74C28.72 23.67 32.01 25.33 33.27 26.83Z'
const HOUSE = 'M23 29.5 32 21.5l9 8V39a1.5 1.5 0 0 1-1.5 1.5H35V34h-6v6.5h-4.5A1.5 1.5 0 0 1 23 39z'

const pinSvg = (size: number, color: string, inner: string, outline = '') =>
  `<svg class="finder-map__brand-pin" width="${size}" height="${size}" viewBox="0 0 64 64" aria-hidden="true">
    <ellipse cx="32" cy="28" rx="15" ry="16" fill="#fff"/>
    <path d="${PIN_OUTLINE}" fill="${color}"${outline ? ` stroke="${outline}" stroke-width="3"` : ''}/>
    ${inner}
  </svg>`

const SCHOOL_PIN = pinSvg(34, '#FFB600', `<path d="${GAMA_MARK}" fill="#FFB600"/>`)
const SCHOOL_PIN_SELECTED = pinSvg(46, '#FFB600', `<path d="${GAMA_MARK}" fill="#FFB600"/>`, '#1E2A44')
const HOME_PIN = pinSvg(48, '#1E9E5A', `<path d="${HOUSE}" fill="#1E9E5A"/>`)

const goHome = () => {
  if (!map || !props.home) return
  movedByUser = true
  map.flyTo([props.home.lat, props.home.lng], Math.max(15, map.getZoom()))
}

// ---- Adding a missing school ----
const placing = ref(false)
const placeAddress = ref('')
let addressTimer: ReturnType<typeof setTimeout> | null = null

// The nearest street and area under the pin, so the visitor can tell the pin is in the right place.
const lookUpAddress = () => {
  if (addressTimer) clearTimeout(addressTimer)
  placeAddress.value = ''
  addressTimer = setTimeout(async () => {
    const center = map?.getCenter()
    if (!center || !placing.value) return
    try {
      const result = await $fetch<{ display_name?: string }>('https://nominatim.openstreetmap.org/reverse', {
        params: { lat: center.lat, lon: center.lng, format: 'json', zoom: 17 },
        headers: { 'Accept-Language': 'en' },
      })
      if (placing.value) placeAddress.value = result.display_name?.split(',').slice(0, 3).join(',').trim() || 'No address here'
    }
    catch {
      placeAddress.value = `${center.lat.toFixed(5)}, ${center.lng.toFixed(5)}`
    }
  }, 700)
}

// The whole map, down to its bottom card, must be on screen (above the compare bar) while placing the pin.
const bringMapIntoView = () => {
  const element = mapElement.value?.parentElement
  if (!element) return
  const rect = element.getBoundingClientRect()
  const tray = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--compare-tray-height')) || 0
  const overflow = rect.bottom - (window.innerHeight - tray)
  if (overflow > 0) window.scrollBy({ top: overflow, behavior: 'smooth' })
}

const startPlacing = () => {
  if (!map) return
  placing.value = true
  emit('select', null)
  bringMapIntoView()
  // Street level, so the pin can be put on the right building.
  if (map.getZoom() < 16) map.flyTo(map.getCenter(), 16)
  else lookUpAddress()
}

const stopPlacing = () => {
  placing.value = false
  placeAddress.value = ''
}

const confirmPlace = () => {
  const center = map?.getCenter()
  if (!center) return
  navigateTo(`/school/add?lat=${center.lat.toFixed(6)}&lng=${center.lng.toFixed(6)}`)
}
let L: Leaflet | null = null
let map: import('leaflet').Map | null = null
let schoolLayer: import('leaflet').LayerGroup | null = null
// The school pins on the map by id, so highlighting one (hovering its row) changes two pins, not every marker.
const pinById = new Map<number, import('leaflet').Marker>()
const iconCache = new Map<boolean, import('leaflet').DivIcon>()

const schoolIcon = (selected: boolean) => {
  let icon = iconCache.get(selected)
  if (!icon && L) {
    const size = selected ? 46 : 34
    icon = L.divIcon({
      className: 'finder-map__pin-wrap',
      html: selected ? SCHOOL_PIN_SELECTED : SCHOOL_PIN,
      // The pin's tip (y 60 of 64) sits on the school.
      iconSize: [size, size],
      iconAnchor: [size / 2, Math.round(size * 60 / 64)],
    })
    iconCache.set(selected, icon)
  }
  return icon as import('leaflet').DivIcon
}
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
  // Moving the map to place a new school is not a search: the list stays as it is.
  const byUser = movedByUser && !placing.value
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
  pinById.clear()
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
      const marker = L.marker([point.lat, point.lng], {
        icon: schoolIcon(selected),
        keyboard: true,
        title: point.name,
        alt: escapeHtml(point.name),
        zIndexOffset: selected ? 1000 : 0,
      })
      // Opens the school's card and zooms in on it, so its street and neighbours are readable.
      marker.on('click', () => {
        emit('select', point)
        if (!map) return
        movedByUser = true
        map.flyTo([point.lat, point.lng], Math.max(16, map.getZoom()))
      })
      schoolLayer.addLayer(marker)
      pinById.set(point.id, marker)
    }
  }

  emit('view-change', { ...view, total, complete, loading: false, byUser })
}

const drawHome = () => {
  if (!L || !map || !homeLayer) return
  homeLayer.clearLayers()
  if (!props.home) return
  const homeMarker = L.marker([props.home.lat, props.home.lng], {
    icon: L.divIcon({ className: 'finder-map__pin-wrap', html: HOME_PIN, iconSize: [48, 48], iconAnchor: [24, 45] }),
    keyboard: true,
    title: 'Your home',
    alt: 'Your home: zoom in',
    zIndexOffset: 2000,
  })
  // Tapping home zooms to the streets around it.
  homeMarker.on('click', goHome)
  homeLayer.addLayer(homeMarker)
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
    if (placing.value) lookUpAddress()
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

watch(() => props.selectedId, (id, previous) => {
  const before = previous != null ? pinById.get(previous) : undefined
  before?.setIcon(schoolIcon(false)).setZIndexOffset(0)
  const now = id != null ? pinById.get(id) : undefined
  now?.setIcon(schoolIcon(true)).setZIndexOffset(1000)
})

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

.finder-map__place-pin {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -100%);
  z-index: 550;
  pointer-events: none;
  filter: drop-shadow(0 4px 6px rgba(16, 24, 40, 0.35));
}

.finder-map__place-dot {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 8px;
  height: 4px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: rgba(16, 24, 40, 0.45);
  z-index: 549;
  pointer-events: none;
}

.finder-map__place-card {
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 12px;
  max-width: 420px;
  margin: 0 auto;
  z-index: 600;
}

.finder-map__place-address {
  min-width: 0;
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

.v-theme--dark .finder-map__cluster {
  background: rgba(236, 236, 237, 0.92);
  border-color: #161b26;
  color: #161b26;
}

.finder-map__brand-pin {
  display: block;
  cursor: pointer;
  filter: drop-shadow(0 2px 3px rgba(16, 24, 40, 0.35));
  transition: transform 0.15s ease;
  transform-origin: 50% 94%;
}

.finder-map__brand-pin:hover {
  transform: scale(1.12);
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
