import type { ApiResult } from '@/types'
import type { SearchParameters } from '@/composables/useApiService'
import type {
  SearchListDTO,
  SearchRequestOptions,
  SearchTypesStatsDTO,
} from '@/types/search'

export const useSearchApi = () => {
  const getResults = (params: SearchParameters, options?: SearchRequestOptions) =>
    useApiService.get<ApiResult<SearchListDTO>>('/api/v1/search', params, options)

  const getTypesStats = (params: SearchParameters) =>
    useApiService.get<ApiResult<SearchTypesStatsDTO | { types_stats: SearchTypesStatsDTO }>>(
      '/api/v1/search/typesstats',
      params,
      { public: true },
    )

  return { getResults, getTypesStats }
}
