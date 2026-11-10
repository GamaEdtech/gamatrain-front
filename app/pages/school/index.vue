<template>
  <div class="school-finder mt-16">
    <!-- List view: the default. Server-rendered, so search engines and first paint get the schools, not a map. -->
    <v-container
      v-if="!isMapView"
      class="finder-container pt-4 pb-16"
    >
      <v-breadcrumbs
        :items="crumbs"
        density="compact"
        class="px-0 text-caption text-grey600 finder-crumbs"
      >
        <template #divider>
          <v-icon size="16">
            md:chevron_right
          </v-icon>
        </template>
      </v-breadcrumbs>

      <div class="d-flex flex-wrap align-end ga-3">
        <div class="finder-title">
          <h1 class="text-h5 text-md-h4 font-weight-bold text-grey900 ma-0">
            {{ heading }}
          </h1>
          <p
            v-if="summary"
            class="text-body-1 text-grey600 mt-1 mb-0"
          >
            {{ summary }}
          </p>
        </div>
        <v-btn
          to="/school/add"
          variant="outlined"
          color="grey700"
          rounded="pill"
          class="text-none"
          prepend-icon="md:add"
        >
          <span class="text-grey800">Add a missing school</span>
        </v-btn>
      </div>

      <school-finder-home-bar class="mt-4" />

      <div class="finder-layout mt-4">
        <aside
          class="finder-layout__filters d-none d-lg-block"
          aria-label="Filters"
        >
          <v-card
            variant="flat"
            border
            rounded="lg"
            class="pa-4"
          >
            <school-finder-filters
              :filters="filters"
              :facets="facets"
              :has-home="!!home"
              :can-clear="canClear"
              @update="update"
              @clear="clearFilters"
            />
          </v-card>
        </aside>

        <section
          id="results"
          class="finder-layout__results d-flex flex-column ga-3"
          aria-label="Schools"
        >
          <form
            role="search"
            class="d-flex ga-2 align-center"
            @submit.prevent
          >
            <v-text-field
              v-model="keyword"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              hide-details
              clearable
              single-line
              bg-color="surface"
              prepend-inner-icon="md:search"
              label="Search a school by name"
              spellcheck="false"
            />
            <v-btn
              class="d-lg-none text-none"
              variant="outlined"
              color="grey700"
              rounded="lg"
              height="48"
              prepend-icon="md:tune"
              @click="filtersOpen = true"
            >
              <span class="text-grey800">Filters{{ activeChips.length ? ` · ${activeChips.length}` : '' }}</span>
            </v-btn>
          </form>

          <div class="d-flex flex-wrap align-center justify-space-between ga-2">
            <p
              class="ma-0 text-body-2 text-grey600"
              aria-live="polite"
            >
              <template v-if="listPending && !schools.length">
                Searching...
              </template>
              <template v-else>
                <strong class="text-grey800">{{ formatCount(total) }} {{ total === 1 ? 'school' : 'schools' }}</strong>
                <template v-if="schools.length && total > schools.length">
                  · showing {{ formatCount(firstShown) }}–{{ formatCount(lastShown) }}
                </template>
              </template>
            </p>
            <v-select
              :model-value="filters.sort"
              :items="sortItems"
              label="Sort by"
              density="compact"
              variant="outlined"
              hide-details
              rounded="lg"
              max-width="220"
              @update:model-value="pickSort"
            />
          </div>

          <div
            v-if="activeChips.length"
            class="d-flex flex-wrap ga-2"
          >
            <v-chip
              v-for="chip in activeChips"
              :key="chip.key"
              closable
              color="primaryStrong"
              variant="tonal"
              :close-label="`Remove ${chip.label}`"
              @click:close="chip.remove()"
            >
              {{ chip.label }}
            </v-chip>
            <v-btn
              variant="text"
              color="primaryStrong"
              class="text-none"
              @click="clearFilters"
            >
              Clear all
            </v-btn>
          </div>

          <v-alert
            v-if="needsHome"
            type="info"
            variant="tonal"
            density="compact"
            rounded="lg"
          >
            Set your home above to sort or filter by distance.
          </v-alert>

          <template v-if="listPending && !schools.length">
            <v-skeleton-loader
              v-for="item in 4"
              :key="item"
              type="list-item-avatar-three-line"
              class="rounded-lg"
            />
          </template>

          <school-finder-result-card
            v-for="school in schools"
            :key="school.id"
            :school="school"
            :picked="compare.has(school.id)"
            :tag-names="tagNames"
            :bus-tag-id="busTagId"
            @toggle-compare="compare.toggle({ id: school.id, name: school.name, slug: school.slug })"
          />

          <v-empty-state
            v-if="!listPending && !schools.length"
            icon="md:travel_explore"
            title="No schools match these filters"
            text="Try a wider area or remove a filter."
          >
            <template #actions>
              <v-btn
                v-if="canClear"
                color="primary"
                rounded="pill"
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
            class="d-flex justify-center mt-2"
          >
            <v-btn
              :href="pageHref(lastLoadedPage + 1)"
              :loading="loadingMore"
              color="grey800"
              variant="flat"
              rounded="pill"
              size="large"
              class="text-none px-8"
              @click.prevent="loadMore"
            >
              Show {{ Math.min(SCHOOL_FINDER_PAGE_SIZE, total - lastShown) }} more
            </v-btn>
          </div>

          <nav
            v-if="pageCount > 1"
            aria-label="Pages"
            class="d-flex flex-wrap justify-center align-center ga-1"
          >
            <template
              v-for="item in pageLinks"
              :key="item.key"
            >
              <span
                v-if="item.gap"
                class="px-1 text-grey600"
              >…</span>
              <v-btn
                v-else
                :to="item.to"
                :variant="item.current ? 'flat' : 'text'"
                :color="item.current ? 'grey800' : 'grey700'"
                :aria-current="item.current ? 'page' : undefined"
                size="small"
                min-width="36"
                rounded="lg"
                class="text-none"
              >
                {{ item.page }}
              </v-btn>
            </template>
          </nav>
        </section>

        <aside
          class="finder-layout__map d-none d-xl-block"
          aria-label="Map"
        >
          <v-card
            variant="flat"
            border
            rounded="lg"
            class="finder-side-map"
          >
            <school-finder-map
              v-if="sideMapReady"
              :params="mapParams"
              :home="home"
              :home-radius-km="filters.within"
              :frame="listPoints"
            >
              <v-btn
                class="finder-side-map__expand text-none"
                color="surface"
                rounded="pill"
                prepend-icon="md:open_in_full"
                @click="setView('map')"
              >
                Expand map
              </v-btn>
            </school-finder-map>
            <div
              v-else
              class="d-flex align-center justify-center fill-height"
            >
              <v-btn
                color="surface"
                rounded="pill"
                class="text-none"
                prepend-icon="md:map"
                @click="sideMapReady = true"
              >
                Show map
              </v-btn>
            </div>
          </v-card>
        </aside>
      </div>

      <section
        v-if="facets?.regions?.length"
        aria-labelledby="nearby-areas"
        class="mt-12"
      >
        <h2
          id="nearby-areas"
          class="text-h6 font-weight-bold text-grey900 mb-3"
        >
          {{ regionsHeading }}
        </h2>
        <div class="finder-areas">
          <v-btn
            v-for="region in facets.regions"
            :key="region.id"
            :to="regionLink(region.id)"
            variant="outlined"
            color="grey300"
            rounded="lg"
            class="text-none finder-areas__item"
          >
            <span class="text-grey800 text-truncate">{{ region.title }}</span>
            <span class="text-grey600 ml-2">{{ formatCount(region.count) }}</span>
          </v-btn>
        </div>
      </section>

      <section
        v-if="facets && facets.total"
        aria-labelledby="about-schools"
        class="mt-12 finder-about"
      >
        <div>
          <h2
            id="about-schools"
            class="text-h6 font-weight-bold text-grey900 mb-2"
          >
            About schools in {{ placeName || 'this list' }}
          </h2>
          <p class="text-body-1 text-grey700 ma-0">
            {{ aboutText }}
          </p>
        </div>
        <v-expansion-panels variant="accordion">
          <v-expansion-panel
            v-for="item in faq"
            :key="item.question"
            :title="item.question"
            :text="item.answer"
            elevation="0"
            class="border"
          />
        </v-expansion-panels>
      </section>
    </v-container>

    <!-- Map view: the list beside (desktop) or under (phone) a map that searches the area it shows. -->
    <div
      v-else
      class="finder-mapview"
    >
      <h1 class="d-sr-only">
        {{ heading }} on the map
      </h1>
      <aside
        class="finder-mapview__panel d-none d-md-flex"
        aria-label="Schools in this area"
      >
        <div class="pa-4 border-b">
          <div class="text-subtitle-1 font-weight-bold text-grey800">
            {{ mapPanelTitle }}
          </div>
          <div class="text-caption text-grey600">
            {{ mapPanelSubtitle }}
          </div>
          <v-switch
            v-model="searchAsMove"
            color="primaryStrong"
            density="compact"
            hide-details
            inset
            label="Search as I move the map"
          />
        </div>
        <div class="finder-mapview__list pa-3 d-flex flex-column ga-2">
          <v-skeleton-loader
            v-if="mapList.loading && !mapList.items.length"
            type="list-item-two-line@4"
          />
          <school-finder-result-card
            v-for="school in mapList.items"
            :key="school.id"
            :school="school"
            :picked="compare.has(school.id)"
            :active="school.id === selectedPoint?.id"
            :tag-names="tagNames"
            :bus-tag-id="busTagId"
            heading-tag="h3"
            @toggle-compare="compare.toggle({ id: school.id, name: school.name, slug: school.slug })"
          />
          <v-btn
            v-if="mapList.items.length < mapList.total"
            :loading="mapList.loading"
            variant="outlined"
            color="grey700"
            rounded="pill"
            class="text-none align-self-center"
            @click="loadMapList(true)"
          >
            <span class="text-grey800">Show more</span>
          </v-btn>
        </div>
      </aside>

      <div class="finder-mapview__map">
        <school-finder-map
          :params="mapParams"
          :home="home"
          :home-radius-km="filters.within"
          :selected-id="selectedPoint?.id ?? null"
          :frame="listPoints"
          @view-change="onMapView"
          @select="selectedPoint = $event"
        >
          <div class="finder-mapview__top">
            <v-chip
              color="surface"
              variant="flat"
              elevation="2"
              class="font-weight-medium"
            >
              <v-icon
                start
                size="10"
                :color="mapView?.complete ? 'success' : 'primary'"
              >
                md:circle
              </v-icon>
              {{ mapStatus }}
            </v-chip>
            <v-btn
              v-if="!searchAsMove && mapDirty"
              color="surface"
              rounded="pill"
              elevation="2"
              class="text-none ml-2"
              @click="loadMapList(false)"
            >
              Search this area
            </v-btn>
          </div>

          <v-card
            v-if="selectedPoint"
            class="finder-mapview__preview"
            rounded="lg"
            elevation="8"
          >
            <v-card-item>
              <v-card-title class="text-subtitle-1 font-weight-bold text-wrap">
                {{ selectedPoint.name }}
              </v-card-title>
              <v-card-subtitle class="text-wrap">
                {{ selectedSubtitle }}
              </v-card-subtitle>
              <template #append>
                <v-btn
                  icon="md:close"
                  variant="text"
                  size="small"
                  aria-label="Close"
                  @click="selectedPoint = null"
                />
              </template>
            </v-card-item>
            <v-card-actions class="pt-0 px-4 pb-3 flex-wrap ga-2">
              <v-btn
                :to="`/school/${selectedPoint.id}/${selectedPoint.slug}`"
                color="primary"
                variant="flat"
                rounded="pill"
                class="text-none font-weight-bold"
              >
                Open school
              </v-btn>
              <v-btn
                variant="outlined"
                color="grey700"
                rounded="pill"
                class="text-none"
                :prepend-icon="compare.has(selectedPoint.id) ? 'md:check' : 'md:add'"
                @click="compare.toggle({ id: selectedPoint.id, name: selectedPoint.name, slug: selectedPoint.slug })"
              >
                <span class="text-grey800">Compare</span>
              </v-btn>
              <v-btn
                :href="`https://www.google.com/maps/dir/?api=1&destination=${selectedPoint.lat},${selectedPoint.lng}`"
                target="_blank"
                rel="noopener nofollow"
                variant="text"
                rounded="pill"
                class="text-none"
                prepend-icon="md:directions"
              >
                Directions
              </v-btn>
            </v-card-actions>
          </v-card>
        </school-finder-map>

        <!-- Phones: the schools in view as a swipeable row over the map. -->
        <v-sheet
          class="finder-mapview__sheet d-md-none"
          rounded="t-xl"
          elevation="8"
        >
          <div class="d-flex align-center px-4 pt-3 pb-2">
            <strong class="flex-grow-1 text-grey800">{{ mapPanelTitle }}</strong>
            <v-btn
              variant="text"
              color="primaryStrong"
              class="text-none px-1"
              @click="setView('list')"
            >
              See as list
            </v-btn>
          </div>
          <v-slide-group
            v-if="mapList.items.length"
            class="pb-3"
          >
            <v-slide-group-item
              v-for="school in mapSheetItems"
              :key="school.id"
            >
              <v-card
                :to="`/school/${school.id}/${school.slug}`"
                variant="flat"
                border
                rounded="lg"
                width="260"
                class="ml-3"
                :class="{ 'border-primary': school.id === selectedPoint?.id }"
              >
                <v-card-item>
                  <v-card-title class="text-body-1 font-weight-bold text-wrap">
                    {{ school.name }}
                  </v-card-title>
                  <v-card-subtitle>
                    {{ sheetSubtitle(school) }}
                  </v-card-subtitle>
                </v-card-item>
              </v-card>
            </v-slide-group-item>
          </v-slide-group>
        </v-sheet>
      </div>
    </div>

    <!-- One switch, always in the same place, so moving between the list and the map is one tap each way. -->
    <v-btn
      class="finder-view-toggle text-none"
      :class="{
        'finder-view-toggle--list': !isMapView,
        'finder-view-toggle--map': isMapView,
        'finder-view-toggle--raised': !isMapView && compare.items.value.length > 0,
      }"
      color="grey800"
      rounded="pill"
      size="large"
      elevation="6"
      :prepend-icon="isMapView ? 'md:view_list' : 'md:map'"
      @click="setView(isMapView ? 'list' : 'map')"
    >
      {{ isMapView ? 'List' : 'Map' }}
    </v-btn>

    <v-dialog
      v-model="filtersOpen"
      fullscreen
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          color="surface"
          density="comfortable"
          border="b"
        >
          <v-btn
            icon="md:close"
            aria-label="Close filters"
            @click="filtersOpen = false"
          />
          <v-toolbar-title class="text-subtitle-1 font-weight-bold">
            Filters
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text class="pa-4">
          <school-finder-filters
            :filters="filters"
            :facets="facets"
            :has-home="!!home"
            :can-clear="canClear"
            @update="update"
            @clear="clearFilters"
          />
        </v-card-text>
        <v-card-actions class="pa-4 border-t">
          <v-btn
            block
            color="primary"
            variant="flat"
            rounded="pill"
            size="large"
            class="text-none font-weight-bold"
            @click="filtersOpen = false"
          >
            Show {{ formatCount(total) }} schools
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <school-finder-compare-tray />
  </div>
</template>

<script setup lang="ts">
import type { SchoolFacetsDTO, SchoolListDTO, SchoolMapPointDTO } from '@/types'
import type { SchoolFinderFilters, SchoolFinderSort } from '@/composables/useSchoolFinder'
import type { FinderMapView } from '@/components/school/finder/Map.client.vue'

interface ListResponse {
  data?: { list?: SchoolListDTO[] | null, totalRecordsCount?: number | null }
  filters?: { key: string, value: string | null }[]
}

const route = useRoute()
const router = useRouter()
const compare = useSchoolCompare()
const { home, tripFromHome } = useSchoolHome()

const filters = computed(() => parseSchoolFinderQuery(route.query))
const isMapView = computed(() => filters.value.view === 'map')
const formatCount = (value: number) => (value ?? 0).toLocaleString('en-US')

const go = (next: SchoolFinderFilters, push = false) => {
  const location = { query: schoolFinderQuery(next) }
  return push ? router.push(location) : router.replace(location)
}

/** Any filter change starts the list over at page 1. */
const update = (patch: Partial<SchoolFinderFilters>) => go({ ...filters.value, ...patch, page: 1 })

const clearFilters = () => update({ keyword: '', types: [], facilities: [], photos: false, rated: false, within: null, sort: 'best' })

const selectedPoint = ref<SchoolMapPointDTO | null>(null)

// The view is a step the visitor may want to undo with Back, so it is pushed, not replaced.
const setView = (view: 'list' | 'map') => {
  selectedPoint.value = null
  go({ ...filters.value, view, page: 1 }, true)
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

// ---- List (pages appended by "Show more") ----
const listSignature = computed(() => JSON.stringify([filterParams.value, sortParams.value]))
const listCache = useState<{ key: string, items: SchoolListDTO[], lastPage: number, total: number, titles: Record<string, string> } | null>(
  'school-finder-list-cache',
  () => null,
)

const schools = ref<SchoolListDTO[]>([])
const total = ref(0)
const lastLoadedPage = ref(filters.value.page)
const placeTitles = ref<Record<string, string>>({})
const loadingMore = ref(false)

const fetchListPage = (page: number) => useApiService.get<ListResponse>('/api/v2/schools', {
  ...filterParams.value,
  ...sortParams.value,
  ...schoolFinderPageParams(page),
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

const listPending = computed(() => listStatus.value === 'pending')

watch(listData, (value) => {
  if (!value) return
  schools.value = [...value.items]
  total.value = value.total
  lastLoadedPage.value = value.lastPage
  placeTitles.value = value.titles
}, { immediate: true })

const rememberList = () => {
  listCache.value = {
    key: `${listSignature.value}|${filters.value.page}`,
    items: schools.value,
    lastPage: lastLoadedPage.value,
    total: total.value,
    titles: placeTitles.value,
  }
}

const pageCount = computed(() => Math.ceil(total.value / SCHOOL_FINDER_PAGE_SIZE))
const hasMore = computed(() => lastLoadedPage.value < pageCount.value)
const firstShown = computed(() => ((filters.value.page - 1) * SCHOOL_FINDER_PAGE_SIZE) + 1)
const lastShown = computed(() => Math.min(total.value, firstShown.value + schools.value.length - 1))

const loadMore = async () => {
  if (loadingMore.value || !hasMore.value) return
  loadingMore.value = true
  try {
    const next = lastLoadedPage.value + 1
    const response = await fetchListPage(next)
    const known = new Set(schools.value.map(school => school.id))
    schools.value = [...schools.value, ...(response?.data?.list ?? []).filter(school => !known.has(school.id))]
    lastLoadedPage.value = next
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
const tagNames = computed<Record<number, string>>(() => Object.fromEntries((facets.value?.tags ?? []).map(tag => [tag.id, tag.name])))
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
  if (f.withImage) parts.push(`${formatCount(f.withImage)} with photos`)
  if (f.withRating) parts.push(`${formatCount(f.withRating)} rated by parents`)
  return parts.join(' · ')
})

const regionsHeading = computed(() => {
  if (facets.value?.regionLevel === 'country') return 'Schools by country'
  return placeParts.value[0] ? `Areas in ${placeParts.value[0]}` : 'Areas'
})

const regionLink = (id: number) => {
  const level = facets.value?.regionLevel
  const base: SchoolFinderFilters = { ...filters.value, keyword: '', page: 1, view: 'list' }
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
      answer: 'Set your home in the box at the top of the list, then sort by "Nearest to home" or pick a distance. Every school then shows how far it is and about how long the walk and the drive take.',
    },
    {
      question: 'How do I compare schools?',
      answer: 'Press "Compare" on up to four schools, then "Compare side by side" at the bottom of the screen. You see distance, school bus, parents\' ratings per topic, facilities and contacts next to each other.',
    },
  ]
  if (busCount.value) {
    items.push({
      question: `Which schools in ${where} have a school bus?`,
      answer: `${formatCount(busCount.value)} schools list a school bus. Tick "School bus" in the filters to see only them.`,
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

// ---- Active filter chips ----
const activeChips = computed(() => {
  const f = filters.value
  const chips: { key: string, label: string, remove: () => void }[] = []
  if (f.keyword) chips.push({ key: 'keyword', label: `“${f.keyword}”`, remove: () => update({ keyword: '' }) })
  if (f.within) chips.push({ key: 'within', label: `Within ${f.within} km of home`, remove: () => update({ within: null }) })
  f.types.forEach(type => chips.push({ key: `type-${type}`, label: SCHOOL_TYPE_LABELS[type] ?? type, remove: () => update({ types: f.types.filter(item => item !== type) }) }))
  f.facilities.forEach(id => chips.push({
    key: `tag-${id}`,
    label: id === busTagId.value ? 'School bus' : (tagNames.value[id] ?? 'Facility'),
    remove: () => update({ facilities: f.facilities.filter(item => item !== id) }),
  }))
  if (f.photos) chips.push({ key: 'photos', label: 'Has photos', remove: () => update({ photos: false }) })
  if (f.rated) chips.push({ key: 'rated', label: 'Rated by parents', remove: () => update({ rated: false }) })
  return chips
})
const canClear = computed(() => hasSchoolFinderRefinements(filters.value) || filters.value.sort !== 'best')

const sortItems = computed(() => SCHOOL_FINDER_SORTS.map(item => ({
  ...item,
  props: { subtitle: item.value === 'nearest' && !home.value ? 'Set your home first' : undefined },
})))

const filtersOpen = ref(false)

// ---- Side map (wide screens, list view): loaded after the page settles, so it never delays the list. ----
const sideMapReady = ref(false)
onMounted(() => {
  if (!isMapView.value && window.matchMedia('(min-width: 1920px)').matches) {
    const start = () => {
      sideMapReady.value = true
    }
    if ('requestIdleCallback' in window) window.requestIdleCallback(start, { timeout: 3000 })
    else setTimeout(start, 1500)
  }
})
const listPoints = computed(() => schools.value
  .filter(school => school.lat != null && school.long != null)
  .slice(0, SCHOOL_FINDER_PAGE_SIZE)
  .map(school => ({ lat: school.lat, lng: school.long })))

// ---- Map view ----
const mapView = ref<FinderMapView | null>(null)
const selectedSubtitle = computed(() => {
  const point = selectedPoint.value
  if (!point) return ''
  const trip = tripFromHome(point.lat, point.lng)
  return [
    point.rating ? `★ ${point.rating.toFixed(1)} (${point.reviewCount})` : '',
    trip ? `${trip.distance} from home · ${trip.walk} walk · ${trip.drive} drive` : '',
  ].filter(Boolean).join(' · ')
})
const sheetSubtitle = (school: SchoolListDTO) => {
  const trip = tripFromHome(school.lat, school.long)
  return [schoolTypeLabel(school.schoolType), school.rating ? `★ ${school.rating.toFixed(1)}` : '', trip ? trip.distance : '']
    .filter(Boolean).join(' · ')
}
const searchAsMove = ref(true)
const mapDirty = ref(false)
const mapList = reactive({ items: [] as SchoolListDTO[], total: 0, page: 1, loading: false, bounds: null as FinderMapView | null })
let mapListTimer: ReturnType<typeof setTimeout> | null = null
let mapListRequest = 0

const loadMapList = async (more: boolean) => {
  const bounds = more ? mapList.bounds : mapView.value
  if (!bounds) return
  const page = more ? mapList.page + 1 : 1
  const request = ++mapListRequest
  mapList.loading = true
  try {
    const response = await useApiService.get<ListResponse>('/api/v2/schools', {
      ...mapParams.value,
      ...sortParams.value,
      ...schoolFinderPageParams(page),
      'Bounds.South': bounds.south,
      'Bounds.West': bounds.west,
      'Bounds.North': bounds.north,
      'Bounds.East': bounds.east,
    }, { public: true })
    if (request !== mapListRequest) return
    const items = response?.data?.list ?? []
    mapList.items = more ? [...mapList.items, ...items] : items
    mapList.total = response?.data?.totalRecordsCount ?? 0
    mapList.page = page
    mapList.bounds = bounds
    mapDirty.value = false
  }
  catch {
    // Keep what is shown; the next move searches again.
  }
  finally {
    if (request === mapListRequest) mapList.loading = false
  }
}

const onMapView = (view: FinderMapView) => {
  mapView.value = view
  if (view.loading) return
  if (!searchAsMove.value) {
    mapDirty.value = true
    return
  }
  if (mapListTimer) clearTimeout(mapListTimer)
  mapListTimer = setTimeout(() => loadMapList(false), 400)
}

const mapSheetItems = computed(() => {
  const selected = selectedPoint.value
  if (!selected) return mapList.items
  const match = mapList.items.find(school => school.id === selected.id)
  return match ? [match, ...mapList.items.filter(school => school.id !== selected.id)] : mapList.items
})

const mapPanelTitle = computed(() => {
  if (mapList.loading && !mapList.items.length) return 'Searching this area...'
  return `${formatCount(mapList.total)} ${mapList.total === 1 ? 'school' : 'schools'} in this area`
})
const mapPanelSubtitle = computed(() => SCHOOL_FINDER_SORTS.find(item => item.value === filters.value.sort)?.title ?? '')
const mapStatus = computed(() => {
  const view = mapView.value
  if (!view || view.loading) return 'Loading schools...'
  if (!view.total) return 'No schools here: move or zoom out'
  return view.complete ? `All ${formatCount(mapList.total || view.total)} schools in view` : 'Zoom in to see each school'
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
    // The map view is the same list drawn differently: one indexed page per list is enough.
    { name: 'robots', content: computed(() => (isMapView.value ? 'noindex, follow' : 'index, follow')) },
  ],
  script: [{ key: 'school-finder-ld', type: 'application/ld+json', innerHTML: () => JSON.stringify(jsonLd.value) }],
})
</script>

<style scoped>
.finder-container {
  max-width: 1440px;
}

.finder-crumbs :deep(.v-breadcrumbs-item--link) {
  color: inherit;
}

.finder-title {
  min-width: 0;
  flex: 1 1 420px;
}

.finder-layout {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 24px;
}

.finder-layout__filters {
  flex: 0 0 272px;
  position: sticky;
  top: 80px;
  max-height: calc(100vh - 96px);
  overflow-y: auto;
}

.finder-layout__results {
  flex: 999 1 520px;
  min-width: 0;
}

.finder-layout__map {
  flex: 0 0 400px;
  position: sticky;
  top: 80px;
}

.finder-side-map {
  height: calc(100vh - 112px);
  max-height: 760px;
  overflow: hidden;
}

.finder-side-map__expand {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 500;
}

.finder-areas {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 8px;
}

.finder-areas__item {
  height: 48px !important;
}

.finder-areas__item :deep(.v-btn__content) {
  width: 100%;
  justify-content: space-between;
}

.finder-about {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr));
  gap: 24px;
}

.finder-mapview {
  display: flex;
  height: calc(100dvh - 64px);
}

.finder-mapview__panel {
  flex: 0 0 400px;
  flex-direction: column;
  min-height: 0;
  border-right: 1px solid rgb(var(--v-theme-grey200));
  background: rgb(var(--v-theme-surface));
}

.finder-mapview__list {
  flex: 1;
  overflow-y: auto;
}

/* A scrolling column: cards keep their height instead of shrinking to fit. */
.finder-mapview__list > * {
  flex-shrink: 0;
}

.finder-mapview__map {
  position: relative;
  flex: 1;
  min-width: 0;
}

.finder-mapview__top {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 500;
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.finder-mapview__preview {
  position: absolute;
  left: 16px;
  bottom: 24px;
  width: min(420px, calc(100% - 32px));
  z-index: 600;
}

.finder-mapview__sheet {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 550;
}

.finder-view-toggle {
  position: fixed !important;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  z-index: 1003;
}

.finder-view-toggle--raised {
  bottom: 88px;
}

@media (max-width: 959px) {
  /* On phones the map's school sheet sits at the bottom: the toggle and the preview go above it. */
  .finder-view-toggle--map {
    bottom: 176px;
  }

  .finder-mapview__preview {
    bottom: 196px;
  }
}

/* Wide screens show the map beside the list, so the list view needs no toggle. */
@media (min-width: 1920px) {
  .finder-view-toggle--list {
    display: none;
  }
}
</style>
