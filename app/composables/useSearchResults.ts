import type { ApiResult, ProfileListResponseDTO } from '@/types'
import type { SearchListDTO, SearchQuery, SearchResultItem, SearchResultsOptions, SearchServiceCounts } from '@/types/search'
import { useProfileListApi } from '@/composables/api/profile/useProfileList.api'
import { useSearchApi } from '@/composables/api/search/useSearch.api'
import { useSearchServiceCounts } from '@/composables/useSearchServiceCounts'
import {
  buildSearchParams,
  getLegacySearchType,
  normalizeSearchService,
} from '@/utils/searchServices'

export const useSearchResults = async ({
  activeService,
  beforeReplaceResults,
}: SearchResultsOptions) => {
  const route = useRoute()
  const router = useRouter()
  const { getResults } = useSearchApi()
  const { fetchServiceCounts } = useSearchServiceCounts()
  const { getProfiles } = useProfileListApi()

  const querySearch = ref<SearchQuery & { page: number }>({
    ...route.query,
    type: normalizeSearchService(route.query.type),
    page: Number(route.query.page) || 1,
  })
  const isInitialDataLoading = ref(false)
  const isPaginationDataLoading = ref(false)
  const isPreviousLoading = ref(false)
  const data = ref<SearchResultItem[]>([])
  const isAllDataLoaded = ref(false)
  const totalDataFind = ref<number | string>(0)
  const serviceResultCounts = ref<SearchServiceCounts>({})
  const perPage = 10
  const perPageProfiles = 5
  const perPageServerSide = 5
  const firstLoadedPageNumber = ref(Number(route.query.page) || 1)
  const latestLoadedPageNumber = ref(Number(route.query.page) || 1)
  const lastRequestedService = ref(activeService.value)
  let serviceCountRequestId = 0

  const getDataList = async (): Promise<SearchResultItem[]> => {
    if (isAllDataLoaded.value) return []

    try {
      const typeRoute = getLegacySearchType(querySearch.value.type)
      const pageSize = typeRoute == 'teacher' ? perPageProfiles : perPage
      let list: SearchResultItem[]

      if (typeRoute == 'teacher') {
        const query = {
          'PagingDto.PageFilter.Size': pageSize,
          'PagingDto.PageFilter.Skip': (querySearch.value.page - 1) * pageSize,
          'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
          'FullName': String(querySearch.value.title ?? ''),
        }
        const response = await getProfiles(query)
        if (!response.data) throw new Error('Teacher search returned no data')
        totalDataFind.value = response.data.totalRecordsCount || 0
        list = response.data.list ?? []
      }
      else {
        const params = buildSearchParams(querySearch.value, querySearch.value.page, pageSize)
        const response = await getResults(params, { public: true })
        if (!response.data) throw new Error('Resource search returned no data')
        totalDataFind.value = response.data.num || 0
        list = response.data.list ?? []
      }

      if (list.length < pageSize) {
        isAllDataLoaded.value = true
      }

      return list
    }
    catch (err) {
      console.error(err)
      return []
    }
    finally {
      isPaginationDataLoading.value = false
      isInitialDataLoading.value = false
      isPreviousLoading.value = false
    }
  }

  const loadNextPageData = async () => {
    latestLoadedPageNumber.value += 1
    querySearch.value.page = latestLoadedPageNumber.value
    const query: SearchQuery = { ...route.query }

    query.page = querySearch.value.page
    router.replace({ query })
    isPaginationDataLoading.value = true
    const responseList = await getDataList()
    data.value = [...data.value, ...responseList]
  }

  const loadPreviousPageData = async () => {
    firstLoadedPageNumber.value -= 1
    querySearch.value.page = firstLoadedPageNumber.value
    const query: SearchQuery = { ...route.query }

    query.page = querySearch.value.page
    router.replace({ query })
    isPreviousLoading.value = true
    const responseList = await getDataList()
    data.value = [...responseList, ...data.value]
  }

  const refreshServiceResultCounts = async (query: SearchQuery) => {
    const requestId = ++serviceCountRequestId
    const counts = await fetchServiceCounts(query)

    if (requestId !== serviceCountRequestId) return

    serviceResultCounts.value = {
      ...serviceResultCounts.value,
      ...counts,
    }
  }

  const reloadResultsForFilters = async (query: SearchQuery) => {
    lastRequestedService.value = normalizeSearchService(query.type)
    isAllDataLoaded.value = false
    isInitialDataLoading.value = true
    firstLoadedPageNumber.value = 1
    latestLoadedPageNumber.value = 1
    querySearch.value = { ...query, page: 1 }
    const countsRequest = refreshServiceResultCounts(query)
    await beforeReplaceResults?.()
    const responseList = await getDataList()
    data.value = responseList
    await countsRequest
  }

  const initialDataRequest = useAsyncData<ApiResult<SearchListDTO | ProfileListResponseDTO>>(
    'dataSearchSSR',
    () => {
      const pageNumber = Number(route.query.page) || 1
      if (getLegacySearchType(route.query.type) == 'teacher') {
        const query = {
          'PagingDto.PageFilter.Size': perPageServerSide,
          'PagingDto.PageFilter.Skip': (pageNumber - 1) * perPageServerSide,
          'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
          'FullName': String(route.query.title ?? ''),
        }
        return getProfiles(query)
      }

      const params = buildSearchParams(route.query, pageNumber, perPageServerSide)
      return getResults(params, { public: true })
    },
  )
  const initialData = initialDataRequest.data

  watchEffect(() => {
    if (initialData.value?.data) {
      data.value = initialData.value.data.list ?? []
    }
  })

  watch(activeService, async (service) => {
    if (service === lastRequestedService.value) return

    lastRequestedService.value = service
    isAllDataLoaded.value = false
    isInitialDataLoading.value = true
    firstLoadedPageNumber.value = 1
    latestLoadedPageNumber.value = 1
    querySearch.value = { ...route.query, type: service, page: 1 }
    await beforeReplaceResults?.()
    data.value = await getDataList()
  })

  onMounted(() => {
    refreshServiceResultCounts(route.query)
  })

  await initialDataRequest

  if (initialData.value?.data) {
    data.value = initialData.value.data.list ?? []
    if (getLegacySearchType(route.query.type) == 'teacher') {
      totalDataFind.value = 'totalRecordsCount' in initialData.value.data
        ? initialData.value.data.totalRecordsCount || 0
        : 0
    }
    else {
      totalDataFind.value = 'num' in initialData.value.data ? initialData.value.data.num || 0 : 0
    }
    isInitialDataLoading.value = false
    isPaginationDataLoading.value = false
  }

  return {
    data,
    firstLoadedPageNumber,
    isAllDataLoaded,
    isInitialDataLoading,
    isPaginationDataLoading,
    isPreviousLoading,
    loadNextPageData,
    loadPreviousPageData,
    reloadResultsForFilters,
    serviceResultCounts,
    totalDataFind,
  }
}
