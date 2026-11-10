<template>
  <div class="finder mt-16">
    <div class="finder__split">
      <section
        ref="mainRef"
        class="finder__main"
      >
        <div class="finder__inner">
          <v-breadcrumbs
            :items="crumbs"
            density="compact"
            class="px-0 pt-0 text-caption text-grey600 finder__crumbs"
          >
            <template #divider>
              <span class="text-grey400">/</span>
            </template>
          </v-breadcrumbs>

          <h1 class="text-h5 font-weight-bold text-grey900 ma-0">
            {{ heading }}
          </h1>
          <p class="text-body-2 text-grey600 mt-1 mb-0">
            <span v-if="summary">{{ summary }} · </span>
            <nuxt-link
              to="/school/add"
              class="text-grey700"
            >Add a missing school</nuxt-link>
          </p>

          <form
            role="search"
            class="mt-4"
            @submit.prevent
          >
            <v-text-field
              v-model="keyword"
              variant="solo-filled"
              flat
              rounded="lg"
              density="comfortable"
              hide-details
              clearable
              single-line
              prepend-inner-icon="md:search"
              placeholder="Search a school by name"
              spellcheck="false"
              aria-label="Search a school by name"
            >
              <template #append-inner>
                <!-- Sort sits at the end of the search box: one control row instead of two. -->
                <v-menu location="bottom end">
                  <template #activator="{ props: menu }">
                    <v-btn
                      v-bind="menu"
                      variant="text"
                      size="small"
                      color="grey700"
                      class="text-none px-2"
                      append-icon="md:expand_more"
                      :aria-label="`Sort: ${sortTitle}`"
                    >
                      <v-icon
                        size="18"
                        class="mr-1"
                      >
                        md:swap_vert
                      </v-icon>
                      <span class="d-none d-sm-inline">{{ sortTitle }}</span>
                    </v-btn>
                  </template>
                  <v-list
                    density="compact"
                    min-width="220"
                  >
                    <v-list-subheader>Sort by</v-list-subheader>
                    <v-list-item
                      v-for="item in sortItems"
                      :key="item.value"
                      :title="item.title"
                      :subtitle="item.props.subtitle"
                      :active="filters.sort === item.value"
                      color="primaryStrong"
                      @click="pickSort(item.value)"
                    />
                  </v-list>
                </v-menu>
              </template>
            </v-text-field>
          </form>

          <!-- Filters stay pinned while the list scrolls, and sit right above the map on a phone. -->
          <!-- Where the pinned toolbar sits in the page; the toolbar itself reports its pinned position. -->
          <div
            ref="toolbarAnchor"
            aria-hidden="true"
          />
          <div class="finder__toolbar mt-2">
            <school-finder-filter-bar
              :filters="filters"
              :facets="facets"
              :has-home="!!home"
              :can-clear="canClear"
              :area-name="placeParts[0]"
              @update="update"
              @clear="clearFilters"
            />

            <!-- Phones and tablets: the list and the map share the screen width, so one shows at a time. -->
            <v-btn-toggle
              :model-value="filters.view"
              mandatory
              density="compact"
              divided
              variant="outlined"
              color="grey800"
              rounded="lg"
              class="mt-2 d-flex d-lg-none finder__toggle"
              @update:model-value="setView"
            >
              <v-btn
                value="list"
                class="flex-grow-1 text-none"
                prepend-icon="md:view_list"
              >
                List
              </v-btn>
              <v-btn
                value="map"
                class="flex-grow-1 text-none"
                prepend-icon="md:map"
              >
                Map
              </v-btn>
            </v-btn-toggle>
          </div>

          <div
            v-if="showMobileMap"
            class="finder__mobile-map"
          >
            <school-finder-map
              :params="mapParams"
              :home="home"
              :home-radius-km="filters.within"
              :selected-id="highlightId"
              :frame="regionPoints"
              @view-change="onMapView"
              @select="onSelect"
            >
              <v-chip
                class="finder__map-status"
                color="surface"
                variant="flat"
                elevation="1"
                size="small"
              >
                {{ mapStatus }}
              </v-chip>
            </school-finder-map>
            <school-finder-map-preview
              v-if="selectedPoint"
              :point="selectedPoint"
              @close="selectedPoint = null"
            />
          </div>

          <div
            class="d-flex align-center ga-2 mt-4 pb-2 finder__count"
            aria-live="polite"
          >
            <p class="ma-0 text-body-2 text-grey600 flex-grow-1">
              <template v-if="pending && !shown.length">
                Searching...
              </template>
              <template v-else>
                <strong class="text-grey900">{{ formatCount(shownTotal) }} {{ shownTotal === 1 ? 'school' : 'schools' }}</strong>
                {{ areaBounds ? 'in the map area' : '' }}
              </template>
            </p>
            <v-btn
              v-if="areaBounds"
              variant="text"
              size="small"
              color="primaryStrong"
              class="text-none px-1"
              prepend-icon="md:undo"
              @click="leaveArea"
            >
              {{ placeName ? `Back to ${placeParts[0]}` : 'Back to the list' }}
            </v-btn>
          </div>

          <v-alert
            v-if="needsHome"
            variant="text"
            density="compact"
            class="px-0 text-body-2 text-grey700"
            icon="md:info"
          >
            Set your home above to sort or filter by distance.
          </v-alert>

          <template v-if="pending && !shown.length">
            <v-skeleton-loader
              v-for="item in 5"
              :key="item"
              type="list-item-two-line"
              class="px-0"
            />
          </template>

          <school-finder-result-card
            v-for="school in shown"
            :id="`school-${school.id}`"
            :key="school.id"
            :school="school"
            :picked="compare.has(school.id)"
            :active="school.id === highlightId"
            :bus-tag-id="busTagId"
            @mouseenter="hoveredId = school.id"
            @mouseleave="hoveredId = null"
            @toggle-compare="compare.toggle({ id: school.id, name: school.name, slug: school.slug })"
          />

          <v-empty-state
            v-if="!pending && !shown.length"
            icon="md:travel_explore"
            title="No schools match"
            text="Try a wider area or remove a filter."
            size="64"
          >
            <template #actions>
              <v-btn
                v-if="canClear"
                variant="text"
                color="primaryStrong"
                class="text-none"
                @click="clearFilters"
              >
                Clear filters
              </v-btn>
            </template>
          </v-empty-state>

          <!-- "Show more" is also a link to the next page, so crawlers (and visitors without JS) reach every school. -->
          <div
            v-if="hasMore"
            class="d-flex justify-center mt-4"
          >
            <v-btn
              :href="areaBounds ? undefined : pageHref(lastLoadedPage + 1)"
              :loading="loadingMore"
              variant="outlined"
              color="grey800"
              rounded="pill"
              class="text-none px-6"
              @click.prevent="loadMore"
            >
              Show more
            </v-btn>
          </div>

          <nav
            v-if="!areaBounds && pageCount > 1"
            aria-label="Pages"
            class="d-flex flex-wrap justify-center align-center ga-1 mt-3"
          >
            <template
              v-for="item in pageLinks"
              :key="item.key"
            >
              <span
                v-if="item.gap"
                class="px-1 text-grey500"
              >…</span>
              <v-btn
                v-else
                :to="item.to"
                variant="text"
                :color="item.current ? 'grey900' : 'grey600'"
                :class="{ 'font-weight-bold': item.current }"
                :aria-current="item.current ? 'page' : undefined"
                size="small"
                min-width="32"
                class="text-none px-1"
              >
                {{ item.page }}
              </v-btn>
            </template>
          </nav>

          <section
            v-if="facets?.regions?.length"
            aria-labelledby="nearby-areas"
            class="mt-12"
          >
            <h2
              id="nearby-areas"
              class="text-subtitle-1 font-weight-bold text-grey900 mb-3"
            >
              {{ regionsHeading }}
            </h2>
            <ul class="finder__areas">
              <li
                v-for="region in facets.regions"
                :key="region.id"
              >
                <nuxt-link
                  :to="regionLink(region.id)"
                  class="text-body-2 text-grey800"
                >{{ region.title }}</nuxt-link>
                <span class="text-caption text-grey500 ml-1">{{ formatCount(region.count) }}</span>
              </li>
            </ul>
          </section>

          <section
            v-if="facets && facets.total"
            aria-labelledby="about-schools"
            class="mt-12"
          >
            <h2
              id="about-schools"
              class="text-subtitle-1 font-weight-bold text-grey900 mb-2"
            >
              About schools in {{ placeName || 'this list' }}
            </h2>
            <p class="text-body-2 text-grey700 mb-4">
              {{ aboutText }}
            </p>
            <v-expansion-panels
              variant="accordion"
              flat
              static
              class="finder__faq"
            >
              <v-expansion-panel
                v-for="item in faq"
                :key="item.question"
                :title="item.question"
                :text="item.answer"
              />
            </v-expansion-panels>
          </section>
        </div>
      </section>

      <!-- Desktop: the map stays beside the list; moving it shows the schools of the area in the list. -->
      <aside
        class="finder__map d-none d-lg-block"
        aria-label="Map"
      >
        <school-finder-map
          v-if="showDesktopMap"
          :params="mapParams"
          :home="home"
          :home-radius-km="filters.within"
          :selected-id="highlightId"
          :frame="regionPoints"
          @view-change="onMapView"
          @select="onSelect"
        >
          <v-chip
            class="finder__map-status"
            color="surface"
            variant="flat"
            elevation="1"
            size="small"
          >
            {{ mapStatus }}
          </v-chip>
        </school-finder-map>
        <school-finder-map-preview
          v-if="selectedPoint && showDesktopMap"
          :point="selectedPoint"
          @close="selectedPoint = null"
        />
      </aside>
    </div>

    <school-finder-compare-tray />
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'
import type { SchoolFacetsDTO, SchoolListDTO, SchoolMapPointDTO } from '@/types'
import type { SchoolFinderFilters, SchoolFinderSort } from '@/composables/useSchoolFinder'
import type { FinderMapView } from '@/components/school/finder/Map.client.vue'

interface ListResponse {
  data?: { list?: SchoolListDTO[] | null, totalRecordsCount?: number | null }
  filters?: { key: string, value: string | null }[]
}

// The site header is fixed and 64 px tall.
const HEADER_HEIGHT = 64

const route = useRoute()
const router = useRouter()
const compare = useSchoolCompare()
const { home } = useSchoolHome()
const { lgAndUp } = useDisplay()

const filters = computed(() => parseSchoolFinderQuery(route.query))
const formatCount = (value: number) => (value ?? 0).toLocaleString('en-US')

const go = (next: SchoolFinderFilters) => router.replace({ query: schoolFinderQuery(next) })

/** Any filter change starts the list over at page 1. */
const update = (patch: Partial<SchoolFinderFilters>) => go({ ...filters.value, ...patch, page: 1 })

const clearFilters = () => update({ keyword: '', types: [], facilities: [], photos: false, rated: false, within: null, sort: 'best' })

const toolbarAnchor = ref<HTMLElement | null>(null)

// Switching views starts the new view at the top: the pinned filters, then the map (or the first school).
const setView = async (view: 'list' | 'map') => {
  await go({ ...filters.value, view })
  await nextTick()
  const anchor = toolbarAnchor.value
  if (!anchor) return
  const top = anchor.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
}

const pickSort = (sort: SchoolFinderSort) => update({ sort })

// Typing waits for a pause before it searches, so one search is one URL (and one page view), not one per letter.
const keyword = ref(filters.value.keyword)
let keywordTimer: ReturnType<typeof setTimeout> | null = null
watch(keyword, (value) => {
  if (keywordTimer) clearTimeout(keywordTimer)
  keywordTimer = setTimeout(() => {
    const next = (value ?? '').trim()
    if (next !== filters.value.keyword) update({ keyword: next })
  }, 600)
})
watch(() => filters.value.keyword, (value) => {
  if (value !== (keyword.value ?? '').trim()) keyword.value = value
})

const needsHome = computed(() => !home.value && (filters.value.sort === 'nearest' || !!filters.value.within))

// ---- API parameters ----
const filterParams = computed(() => schoolFinderFilterParams(filters.value, home.value))
// The map's tiles are the area: a home radius would only make every visitor's tiles different (and uncacheable).
const mapParams = computed(() => schoolFinderFilterParams(filters.value, null))
const sortParams = computed(() => schoolFinderSortParams(filters.value.sort, !!home.value))

// ---- The list of the area in the URL (server-rendered; "Show more" appends pages) ----
const listSignature = computed(() => JSON.stringify([filterParams.value, sortParams.value]))
const listCache = useState<{ key: string, items: SchoolListDTO[], lastPage: number, total: number, titles: Record<string, string> } | null>(
  'school-finder-list-cache',
  () => null,
)

const schools = ref<SchoolListDTO[]>([])
const total = ref(0)
const lastRegionPage = ref(filters.value.page)
const placeTitles = ref<Record<string, string>>({})
const loadingMore = ref(false)

const fetchListPage = (page: number, extra: Record<string, number> = {}) => useApiService.get<ListResponse>('/api/v2/schools', {
  ...(Object.keys(extra).length ? mapParams.value : filterParams.value),
  ...sortParams.value,
  ...schoolFinderPageParams(page),
  ...extra,
}, { public: true })

const { data: listData, status: listStatus } = await useAsyncData(
  'school-finder-list',
  async () => {
    // Coming back to the list (e.g. from a school page) restores the schools already shown, so the scroll position holds.
    const cacheKey = `${listSignature.value}|${filters.value.page}`
    if (import.meta.client && listCache.value?.key === cacheKey) {
      const cached = listCache.value
      return { items: cached.items, total: cached.total, lastPage: cached.lastPage, titles: cached.titles }
    }
    const response = await fetchListPage(filters.value.page)
    const titles: Record<string, string> = {}
    response?.filters?.forEach((item) => {
      if (item.value) titles[item.key] = item.value
    })
    return { items: response?.data?.list ?? [], total: response?.data?.totalRecordsCount ?? 0, lastPage: filters.value.page, titles }
  },
  { watch: [listSignature, () => filters.value.page] },
)

watch(listData, (value) => {
  if (!value) return
  schools.value = [...value.items]
  total.value = value.total
  lastRegionPage.value = value.lastPage
  placeTitles.value = value.titles
}, { immediate: true })

// The desktop list scrolls in its own column, which the router's scroll restore doesn't know: keep its position too.
const mainRef = ref<HTMLElement | null>(null)
const listScroll = useState('school-finder-list-scroll', () => ({ key: '', top: 0 }))
onBeforeUnmount(() => {
  if (mainRef.value) listScroll.value = { key: `${listSignature.value}|${filters.value.page}`, top: mainRef.value.scrollTop }
})
onMounted(() => {
  if (listScroll.value.key === `${listSignature.value}|${filters.value.page}` && mainRef.value) {
    nextTick(() => mainRef.value?.scrollTo({ top: listScroll.value.top }))
  }
})

const rememberList = () => {
  listCache.value = {
    key: `${listSignature.value}|${filters.value.page}`,
    items: schools.value,
    lastPage: lastRegionPage.value,
    total: total.value,
    titles: placeTitles.value,
  }
}

// ---- The list of the map area (after the visitor moves the map) ----
const areaBounds = ref<FinderMapView | null>(null)
const area = reactive({ items: [] as SchoolListDTO[], total: 0, page: 1, loading: false })
let areaRequest = 0

const boundsParams = (bounds: FinderMapView) => ({
  'Bounds.South': bounds.south,
  'Bounds.West': bounds.west,
  'Bounds.North': bounds.north,
  'Bounds.East': bounds.east,
})

const loadArea = async (more: boolean) => {
  const bounds = areaBounds.value
  if (!bounds) return
  const page = more ? area.page + 1 : 1
  const request = ++areaRequest
  area.loading = true
  try {
    const response = await fetchListPage(page, boundsParams(bounds))
    if (request !== areaRequest) return
    const items = response?.data?.list ?? []
    area.items = more ? [...area.items, ...items] : items
    area.total = response?.data?.totalRecordsCount ?? 0
    area.page = page
  }
  catch {
    // Keep what is shown; the next move searches again.
  }
  finally {
    if (request === areaRequest) area.loading = false
  }
}

const leaveArea = () => {
  areaBounds.value = null
  area.items = []
  selectedPoint.value = null
}

// New filters apply to the area too.
watch(() => JSON.stringify([mapParams.value, sortParams.value]), () => {
  if (areaBounds.value) loadArea(false)
})

// ---- What the list shows ----
const shown = computed(() => (areaBounds.value ? area.items : schools.value))
const shownTotal = computed(() => (areaBounds.value ? area.total : total.value))
const pending = computed(() => (areaBounds.value ? area.loading : listStatus.value === 'pending'))
const pageCount = computed(() => Math.ceil(total.value / SCHOOL_FINDER_PAGE_SIZE))
const lastLoadedPage = computed(() => (areaBounds.value ? area.page : lastRegionPage.value))
const hasMore = computed(() => (areaBounds.value ? area.items.length < area.total : lastRegionPage.value < pageCount.value))

const loadMore = async () => {
  if (areaBounds.value) {
    await loadArea(true)
    return
  }
  if (loadingMore.value || !hasMore.value) return
  loadingMore.value = true
  try {
    const next = lastRegionPage.value + 1
    const response = await fetchListPage(next)
    const known = new Set(schools.value.map(school => school.id))
    schools.value = [...schools.value, ...(response?.data?.list ?? []).filter(school => !known.has(school.id))]
    lastRegionPage.value = next
    rememberList()
  }
  finally {
    loadingMore.value = false
  }
}

const pageHref = (page: number) => router.resolve({ query: schoolFinderQuery({ ...filters.value, page, view: 'list' }) }).href

const pageLinks = computed(() => {
  const current = filters.value.page
  const last = pageCount.value
  const pages = [...new Set([1, current - 1, current, current + 1, last].filter(page => page >= 1 && page <= last))].sort((a, b) => a - b)
  const items: { key: string, page?: number, to?: string, current?: boolean, gap?: boolean }[] = []
  pages.forEach((page, index) => {
    const previous = pages[index - 1]
    if (previous !== undefined && page - previous > 1) items.push({ key: `gap-${page}`, gap: true })
    items.push({ key: String(page), page, to: pageHref(page), current: page === current })
  })
  return items
})

// ---- Facets (filter counts, nearby areas) ----
const { data: facetsData } = await useAsyncData(
  'school-finder-facets',
  () => useApiService.get<{ data?: SchoolFacetsDTO }>('/api/v2/schools/facets', { ...filterParams.value, IncludeRegions: true }, { public: true })
    .then(response => response?.data ?? null)
    .catch(() => null),
  { watch: [() => JSON.stringify(filterParams.value)] },
)
const facets = computed(() => facetsData.value ?? null)
const busTagId = computed(() => facets.value?.tags.find(tag => tag.name === SCHOOL_BUS_TAG_NAME)?.id ?? null)

// ---- Words for the page ----
const placeParts = computed(() => [placeTitles.value['city-title'], placeTitles.value['state-title'], placeTitles.value['country-title']]
  .filter((part): part is string => !!part))
const placeName = computed(() => placeParts.value.slice(0, 2).join(', '))
const heading = computed(() => (placeName.value ? `Schools in ${placeName.value}` : 'Find a school near you'))
const summary = computed(() => {
  const f = facets.value
  if (!f) return ''
  const parts = [`${formatCount(f.total)} schools`]
  if (f.withRating) parts.push(`${formatCount(f.withRating)} rated by parents`)
  return parts.join(', ')
})

const regionsHeading = computed(() => {
  if (facets.value?.regionLevel === 'country') return 'Schools by country'
  return placeParts.value[0] ? `Areas in ${placeParts.value[0]}` : 'Areas'
})

const regionLink = (id: number) => {
  const level = facets.value?.regionLevel
  const base: SchoolFinderFilters = { ...filters.value, keyword: '', page: 1 }
  if (level === 'country') return { query: schoolFinderQuery({ ...base, country: id, state: null, city: null }) }
  if (level === 'state') return { query: schoolFinderQuery({ ...base, state: id, city: null }) }
  return { query: schoolFinderQuery({ ...base, city: id }) }
}

const typeSummary = computed(() => [...(facets.value?.schoolTypes ?? [])]
  .filter(item => item.schoolType && item.count)
  .sort((a, b) => b.count - a.count)
  .slice(0, 4)
  .map(item => `${formatCount(item.count)} ${schoolTypeLabel(item.schoolType).toLowerCase()}`))
const busCount = computed(() => facets.value?.tags.find(tag => tag.name === SCHOOL_BUS_TAG_NAME)?.count ?? 0)
const boardingCount = computed(() => facets.value?.tags.find(tag => tag.name === 'Dormitory')?.count ?? 0)

const aboutText = computed(() => {
  const f = facets.value
  if (!f) return ''
  const where = placeName.value || 'This list'
  const sentences = [`${where} has ${formatCount(f.total)} schools listed on Gamatrain${typeSummary.value.length ? `, including ${typeSummary.value.join(', ')}` : ''}.`]
  const extras = [busCount.value ? `${formatCount(busCount.value)} run a school bus` : '', boardingCount.value ? `${formatCount(boardingCount.value)} offer boarding` : '']
    .filter(Boolean)
  if (extras.length) sentences.push(`${extras.join(' and ')}.`)
  if (f.withRating) sentences.push(`Parents have rated ${formatCount(f.withRating)} of them.`)
  return sentences.join(' ')
})

const faq = computed(() => {
  const where = placeName.value || 'my area'
  const items = [
    {
      question: `How do I find the schools nearest to my home in ${where}?`,
      answer: 'Set your home at the top of the list, then sort by "Nearest to home" or pick a distance. Every school then shows how far it is and about how long the walk and the drive take.',
    },
    {
      question: 'How do I compare schools?',
      answer: 'Press "Compare" on up to four schools, then "Compare side by side" at the bottom of the screen. You see distance, school bus, parents\' ratings per topic, facilities and contacts next to each other.',
    },
  ]
  if (busCount.value) {
    items.push({
      question: `Which schools in ${where} have a school bus?`,
      answer: `${formatCount(busCount.value)} schools list a school bus. Pick "School bus" in the filters to see only them.`,
    })
  }
  return items
})

// ---- Breadcrumbs ----
const crumbs = computed(() => {
  const items: { title: string, to?: string, disabled?: boolean }[] = [{ title: 'Schools', to: '/school' }]
  const titles = placeTitles.value
  const f = filters.value
  if (f.country && titles['country-title']) items.push({ title: titles['country-title'], to: `/school?country=${f.country}` })
  if (f.state && titles['state-title']) items.push({ title: titles['state-title'], to: `/school?country=${f.country}&state=${f.state}` })
  if (f.city && titles['city-title']) items.push({ title: titles['city-title'], to: `/school?country=${f.country}&state=${f.state}&city=${f.city}` })
  const last = items[items.length - 1]
  if (last && items.length > 1) last.disabled = true
  return items
})

const canClear = computed(() => hasSchoolFinderRefinements(filters.value) || filters.value.sort !== 'best')

const sortTitle = computed(() => SCHOOL_FINDER_SORTS.find(item => item.value === filters.value.sort)?.title ?? '')

const sortItems = computed(() => SCHOOL_FINDER_SORTS.map(item => ({
  ...item,
  props: { subtitle: item.value === 'nearest' && !home.value ? 'Set your home first' : undefined },
})))

// ---- Map ----
// Client-only, and on desktop only after the list has painted, so the map never delays the first view.
const mapAllowed = ref(false)
const mapMounted = ref(false)
onMounted(() => {
  mapMounted.value = true
  const start = () => {
    mapAllowed.value = true
  }
  if ('requestIdleCallback' in window) window.requestIdleCallback(start, { timeout: 1500 })
  else setTimeout(start, 800)
})
const showDesktopMap = computed(() => mapAllowed.value && lgAndUp.value)
// Also only after mounting: the server can't know the screen width, so it renders no map either way.
const showMobileMap = computed(() => mapMounted.value && !lgAndUp.value && filters.value.view === 'map')

// The map frames the schools of the area in the URL, never the map area's own results (that would chase itself).
const regionPoints = computed(() => schools.value
  .filter(school => school.lat != null && school.long != null)
  .slice(0, SCHOOL_FINDER_PAGE_SIZE)
  .map(school => ({ lat: school.lat, lng: school.long })))

const mapView = ref<FinderMapView | null>(null)
const selectedPoint = ref<SchoolMapPointDTO | null>(null)
const hoveredId = ref<number | null>(null)
const highlightId = computed(() => hoveredId.value ?? selectedPoint.value?.id ?? null)
let areaTimer: ReturnType<typeof setTimeout> | null = null

const onMapView = (view: FinderMapView) => {
  mapView.value = view
  if (view.loading || !view.byUser) return
  if (areaTimer) clearTimeout(areaTimer)
  areaTimer = setTimeout(() => {
    areaBounds.value = view
    loadArea(false)
  }, 350)
}

const onSelect = (point: SchoolMapPointDTO | null) => {
  selectedPoint.value = point
  if (point) document.getElementById(`school-${point.id}`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
}

const mapStatus = computed(() => {
  const view = mapView.value
  if (!view || view.loading) return 'Loading schools...'
  if (!view.total) return 'No schools here: move or zoom out'
  return view.complete ? 'Every school in view is shown' : 'Zoom in to see each school'
})

// ---- SEO ----
const host = useRequestURL().host
// One canonical per location and page: sort, filters, keyword and the map view are variants of the same list.
const canonical = computed(() => canonicalListUrl(host, '/school', {
  country: filters.value.country ? String(filters.value.country) : '',
  state: filters.value.state ? String(filters.value.state) : '',
  city: filters.value.city ? String(filters.value.city) : '',
  page: filters.value.page > 1 ? String(filters.value.page) : '',
}, ['country', 'state', 'city', 'page']))

const metaTitle = computed(() => {
  const count = facets.value?.total
  const base = placeName.value ? `Schools in ${placeName.value}` : 'School finder: schools near you'
  const page = filters.value.page > 1 ? ` (page ${filters.value.page})` : ''
  return `${base}${count ? ` - ${formatCount(count)} schools` : ''}${page}`
})
const metaDescription = computed(() => {
  const where = placeName.value || 'your area'
  const count = facets.value?.total ? `${formatCount(facets.value.total)} ` : ''
  return `Compare ${count}schools in ${where}: distance from your home, school bus, parents' ratings, photos and facilities.`
})

const firstShown = computed(() => ((filters.value.page - 1) * SCHOOL_FINDER_PAGE_SIZE) + 1)

const jsonLd = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      'itemListElement': crumbs.value.map((crumb, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': crumb.title,
        'item': `https://${host}${crumb.to ?? '/school'}`,
      })),
    },
    {
      '@type': 'ItemList',
      'name': heading.value,
      'numberOfItems': total.value,
      'itemListElement': schools.value.slice(0, SCHOOL_FINDER_PAGE_SIZE).map((school, index) => ({
        '@type': 'ListItem',
        'position': firstShown.value + index,
        'url': `https://${host}/school/${school.id}/${school.slug}`,
        'name': school.name,
      })),
    },
  ],
}))

useHead({
  title: metaTitle,
  link: [{ rel: 'canonical', href: canonical }],
  meta: [
    { name: 'description', content: metaDescription },
    { property: 'og:title', content: metaTitle },
    { property: 'og:description', content: metaDescription },
    { property: 'og:site_name', content: 'GamaTrain' },
  ],
  script: [{ key: 'school-finder-ld', type: 'application/ld+json', innerHTML: () => JSON.stringify(jsonLd.value) }],
})
</script>

<style scoped>
.finder__split {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
}

.finder__inner {
  max-width: 760px;
  margin: 0 auto;
  padding: 16px 16px 120px;
}

.finder__crumbs :deep(.v-breadcrumbs-item--link) {
  color: inherit;
}

.finder__toggle {
  width: 100%;
}

.finder__toolbar {
  position: sticky;
  top: 64px;
  z-index: 5;
  margin-left: -16px;
  margin-right: -16px;
  padding: 8px 16px;
  background: rgb(var(--v-theme-background));
}

.finder__count {
  border-bottom: 1px solid rgb(var(--v-theme-grey100));
}

/* The map fills the screen under the header and the pinned filters (about 104 px). */
.finder__mobile-map {
  position: relative;
  height: calc(100dvh - 64px - 104px - var(--compare-tray-height, 0px));
  min-height: 320px;
  margin-left: -16px;
  margin-right: -16px;
  overflow: hidden;
}

.finder__areas {
  list-style: none;
  padding: 0;
  margin: 0;
  columns: 3 180px;
  column-gap: 24px;
}

.finder__areas li {
  padding: 3px 0;
  break-inside: avoid;
}

.finder__areas a {
  text-decoration: none;
}

.finder__areas a:hover {
  text-decoration: underline;
}

.finder__faq :deep(.v-expansion-panel) {
  border-bottom: 1px solid rgb(var(--v-theme-grey100));
  border-radius: 0 !important;
}

.finder__faq :deep(.v-expansion-panel-title) {
  padding-left: 0;
  padding-right: 0;
  font-size: 14px;
  min-height: 48px;
}

.finder__faq :deep(.v-expansion-panel-text__wrapper) {
  padding: 0 0 12px;
  font-size: 14px;
  color: rgb(var(--v-theme-grey700));
}

.finder__map {
  position: relative;
}

:deep(.finder__map-status) {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 500;
}

@media (min-width: 1280px) {
  /* An app view of the screen's size: the list scrolls in its own column, the map fills the rest, no page scroll. */
  .finder__split {
    grid-template-columns: minmax(560px, 46%) minmax(0, 1fr);
    height: calc(100dvh - 64px - var(--compare-tray-height, 0px));
    overflow: hidden;
  }

  .finder__main {
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  .finder__inner {
    max-width: none;
    margin: 0;
    padding: 20px 32px 120px;
  }

  .finder__toolbar {
    top: 0;
    margin-left: -32px;
    margin-right: -32px;
    padding: 8px 32px;
  }

  .finder__map {
    height: 100%;
    border-left: 1px solid rgb(var(--v-theme-grey100));
  }
}
</style>

<style>
/* The desktop finder fills the screen like an app, so the site footer (and the page scroll it adds) is left out. */
@media (min-width: 1280px) {
  body:has(.finder) #footer-container {
    display: none !important;
  }

  html:has(.finder) {
    overflow-y: hidden;
  }
}
</style>
