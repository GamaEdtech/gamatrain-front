<template>
  <v-container class="margin-top-handle">
    <v-row
      align="center"
      class="bg-white py-2 container-title-input"
    >
      <v-col
        cols="12"
        sm="6"
      >
        <h1 class="text-h5 text-md-h4 font-weight-bold text-grey700">
          {{ metadata.title }}
        </h1>
      </v-col>

      <v-col
        cols="12"
        sm="6"
        class="d-flex justify-md-end py-1"
      >
        <v-text-field
          v-model="keyword"
          label="Search anything...."
          variant="outlined"
          color="primary"
          density="compact"
          hide-details
          class="custom-search-text-field w-100"
          max-width="420"
          @update:model-value="handleKeywordInput"
          @keydown.enter="searchByKeyword"
        >
          <template #append>
            <v-btn
              icon
              color="primary"
              width="50"
              class="rounded-ts rounded-te-xl rounded-be-xl rounded-bs h-100 ml-n2"
              flat
              @click="searchByKeyword"
            >
              <v-icon
                size="x-large"
                icon="md:search"
                color="grey800"
              />
            </v-btn>
          </template>
        </v-text-field>
      </v-col>
    </v-row>

    <v-row align="start">
      <v-col
        cols="12"
        md="3"
        class="container-filter-service bg-white"
      >
        <div class="d-md-none mb-1">
          <search-services-tabs
            :active-service="activeService"
            @change="handleServiceChange"
          />
        </div>

        <search-filter-panel
          :filters="filters"
          @select-filter="handleFilterChange"
          @reset="handleFiltersReset"
        />
      </v-col>

      <v-col
        cols="12"
        md="9"
        class="px-0 px-sm-3"
      >
        <div class="d-none d-md-flex mb-4 py-2 bg-white container-service">
          <search-services-tabs
            :active-service="activeService"
            @change="handleServiceChange"
          />
        </div>
        <div class="w-100 d-flex align-start justify-start pt-1">
          <CommonDetailSubjectDirectoryNav :content-data="results[0]" />
        </div>

        <SearchResultsList
          ref="resultsList"
          :items="results"
          :is-initial-loading="isInitialLoading"
          :is-pagination-loading="isPaginationLoading"
          :is-previous-loading="isPreviousLoading"
          :is-all-data-loaded="isAllDataLoaded"
          :first-loaded-page="firstLoadedPage"
          @load-next="loadNextPage"
          @load-previous="loadPreviousPage"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import type {
  SearchFilterKey,
  SearchFilterOption,
  SearchQuery,
  SearchResourceItem,
  SearchServiceId,
} from '@/types/search'
import { buildSearchParams, normalizeSearchService } from '@/utils/searchServices'

type InfiniteScrollStatus = 'ok' | 'empty' | 'loading' | 'error'

const SEARCH_RESULTS_PER_PAGE = 10
const INPUT_DEBOUNCE_MS = 1000

const route = useRoute()
const router = useRouter()
const { getData } = useSearchApi()
let inputTimer: ReturnType<typeof setTimeout> | null = null

const getQueryString = (value: unknown) => {
  return typeof value === 'string' ? value : ''
}

const keyword = ref(getQueryString(route.query.title))

const {
  activeService,
  filters,
  selectFilter,
  resetFilters,
  setService,
} = useSearchFilters()

const results = ref<SearchResourceItem[]>([])
const isInitialLoading = ref(false)
const isPaginationLoading = ref(false)
const isPreviousLoading = ref(false)
const isAllDataLoaded = ref(false)
const initialPage = getPageNumber(route.query.page)
const firstLoadedPage = ref(initialPage)
const lastLoadedPage = ref(initialPage)
const resultsList = ref<{ reset: () => void } | null>(null)

const normalizeRouteQuery = (): SearchQuery => {
  const normalizedQuery: SearchQuery = {}

  Object.entries(route.query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      normalizedQuery[key] = value.filter(item => item != null)
      return
    }

    normalizedQuery[key] = value ?? undefined
  })

  return {
    ...normalizedQuery,
    type: normalizeSearchService(normalizedQuery.type),
  }
}

function getPageNumber(page: unknown) {
  const parsedPage = Number(page)
  return Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1
}

const updateRoutePage = async (page: number) => {
  await router.replace({
    query: {
      ...route.query,
      page: page > 1 ? page : undefined,
    },
  })
}

const fetchSearchData = async (
  query: SearchQuery,
  page: number,
  checkAllDataLoaded = true,
) => {
  const response = await getData(
    buildSearchParams(query, page, SEARCH_RESULTS_PER_PAGE),
    { public: true },
  )
  const list = response.data?.list ?? []

  if (checkAllDataLoaded && list.length < SEARCH_RESULTS_PER_PAGE) {
    isAllDataLoaded.value = true
  }

  return list
}

const loadFirstPage = async (
  query = normalizeRouteQuery(),
  page = getPageNumber(route.query.page),
) => {
  isInitialLoading.value = true
  isAllDataLoaded.value = false
  firstLoadedPage.value = page
  lastLoadedPage.value = page

  try {
    const list = await fetchSearchData(query, page)
    results.value = list
    return list
  }
  catch (error) {
    console.error(error)
    results.value = []
    isAllDataLoaded.value = true
    return []
  }
  finally {
    isInitialLoading.value = false
  }
}

const reloadResults = async () => {
  await loadFirstPage(normalizeRouteQuery(), 1)
  resultsList.value?.reset()
}

const updateKeywordQuery = async () => {
  await router.replace({
    query: {
      ...route.query,
      page: undefined,
      title: keyword.value.trim() || undefined,
    },
  })
}

const searchByKeyword = async () => {
  if (inputTimer) {
    clearTimeout(inputTimer)
    inputTimer = null
  }

  await updateKeywordQuery()
  await reloadResults()
}

const handleKeywordInput = () => {
  isInitialLoading.value = true

  if (inputTimer) {
    clearTimeout(inputTimer)
  }

  inputTimer = setTimeout(() => {
    inputTimer = null
    searchByKeyword()
  }, INPUT_DEBOUNCE_MS)
}

const loadNextPage = async (done: (status: InfiniteScrollStatus) => void) => {
  if (isAllDataLoaded.value) {
    done('empty')
    return
  }

  if (isInitialLoading.value || isPaginationLoading.value || isPreviousLoading.value) {
    done('ok')
    return
  }

  const nextPage = lastLoadedPage.value + 1
  isPaginationLoading.value = true

  try {
    const list = await fetchSearchData(normalizeRouteQuery(), nextPage)
    results.value = [...results.value, ...list]
    lastLoadedPage.value = nextPage
    await updateRoutePage(nextPage)
    done(isAllDataLoaded.value ? 'empty' : 'ok')
  }
  catch (error) {
    console.error(error)
    done('error')
  }
  finally {
    isPaginationLoading.value = false
  }
}

const loadPreviousPage = async () => {
  if (
    firstLoadedPage.value <= 1
    || isInitialLoading.value
    || isPaginationLoading.value
    || isPreviousLoading.value
  ) {
    return
  }

  const previousPage = firstLoadedPage.value - 1
  isPreviousLoading.value = true

  try {
    const list = await fetchSearchData(normalizeRouteQuery(), previousPage, false)
    results.value = [...list, ...results.value]
    firstLoadedPage.value = previousPage
    await updateRoutePage(previousPage)
  }
  catch (error) {
    console.error(error)
  }
  finally {
    isPreviousLoading.value = false
  }
}

const handleFilterChange = async (key: SearchFilterKey, option: SearchFilterOption | null) => {
  await selectFilter(key, option)
  await reloadResults()
}

const handleFiltersReset = async () => {
  await resetFilters()
  await reloadResults()
}

const handleServiceChange = async (service: SearchServiceId) => {
  await setService(service)
  await reloadResults()
}

const { data: initialResults } = await useAsyncData(
  `search-results-${route.fullPath}`,
  () => loadFirstPage(),
)

if (initialResults.value) {
  results.value = initialResults.value
  isAllDataLoaded.value = initialResults.value.length < SEARCH_RESULTS_PER_PAGE
}

onBeforeUnmount(() => {
  if (inputTimer) {
    clearTimeout(inputTimer)
  }
})

const { metadata } = useSearchMetadata({
  activeService,
  filters,
  data: results,
})
</script>

<style scoped>
.margin-top-handle {
  margin-top: 64px;
  min-height: calc(100vh - 64px);
}

:deep(.custom-search-text-field .v-field__outline__start) {
  border-radius: 24px 0 0 24px !important;
  flex: 0 0 30px !important;
}

:deep(.custom-search-text-field .v-field__outline__end) {
  border-radius: 0 4px 4px 0 !important;
}

.container-filter-service{
  position: sticky;
  top: 64px;
  z-index : 3;
}
.container-service{
  position: sticky;
  top: 64px;
  z-index: 2;
}
@media (max-width: 600px) {
  .container-filter-service{
    top: 54px;
  }
}
</style>
