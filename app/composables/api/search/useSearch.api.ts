import type { ApiResult } from '@/types'
import type { SearchParameters } from '@/composables/useApiService'
import type {
  SearchListDTO,
  SearchTypesStatsDTO,
} from '@/types/search'

// gama-api's search through the new backend, which caches it (Redis and Cloudflare). It is the same for every
// visitor, so no token or cookie is sent: that keeps one cached copy valid for everyone.
const publicRequest = { public: true, credentials: 'omit' } as const

export const useSearchApi = () => {
  const getResults = (params: SearchParameters) =>
    useApiService.get<ApiResult<SearchListDTO>>('/api/v2/search', params, publicRequest)

  const getTypesStats = (params: SearchParameters) =>
    useApiService.get<ApiResult<SearchTypesStatsDTO | { types_stats: SearchTypesStatsDTO }>>(
      '/api/v2/search/typesstats',
      params,
      publicRequest,
    )

  return { getResults, getTypesStats }
}
