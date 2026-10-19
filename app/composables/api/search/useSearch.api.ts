import type {
  ApiResult,
} from '@/types'
import type { SearchParameters } from '@/composables/useApiService'
import type { SearchListDTO, SearchRequestOptions, SearchResourceItem, SearchTypesStatsDTO } from '@/types/search'

export const useSearchApi = () => {
  const data = ref<SearchResourceItem[]>([])
  const totalCount = ref<number | string>(0)
  const loadingGetData = ref(false)
  const loadingGetTypesStats = ref(false)

  const getData = async (params: SearchParameters, options?: SearchRequestOptions) => {
    loadingGetData.value = true

    try {
      const response = await useApiService.get<ApiResult<SearchListDTO>>(
        '/api/v1/search',
        params,
        options,
      )

      if (response.data) {
        data.value = response.data.list ?? []
        totalCount.value = response.data.num || 0
      }
      else {
        data.value = []
        totalCount.value = 0
      }

      return response
    }
    catch {
      data.value = []
      totalCount.value = 0

      return {
        succeeded: false,
        status: 0,
        errors: [
          {
            message: 'The operation failed. Please try again later.',
            code: '',
            reference: '',
            info: '',
            value: '',
          },
        ],
        data: null,
      }
    }
    finally {
      loadingGetData.value = false
    }
  }

  const resetData = () => {
    data.value = []
    totalCount.value = 0
  }

  const getTypesStats = async (params: SearchParameters) => {
    loadingGetTypesStats.value = true

    try {
      return await useApiService.get<ApiResult<SearchTypesStatsDTO | { types_stats: SearchTypesStatsDTO }>>(
        '/api/v1/search/typesstats',
        params,
        { public: true },
      )
    }
    catch {
      return {
        succeeded: false,
        status: 0,
        errors: [
          {
            message: 'The operation failed. Please try again later.',
            code: '',
            reference: '',
            info: '',
            value: '',
          },
        ],
        data: null,
      }
    }
    finally {
      loadingGetTypesStats.value = false
    }
  }

  return {
    data,
    totalCount,
    loadingGetData,
    loadingGetTypesStats,
    getData,
    getTypesStats,
    resetData,
  }
}
