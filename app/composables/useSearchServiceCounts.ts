import type { SearchParameters } from '@/composables/useApiService'
import type { SearchServiceCounts, SearchTypesStatsDTO } from '@/types/search'
import { useSearchApi } from '@/composables/api/search/useSearch.api'

const filterKeys = [
  'title',
  'section',
  'base',
  'lesson',
  'topic',
  'test_type',
  'variant',
  'exam_type',
  'content_type',
  'edu_year',
  'edu_month',
] as const

const getCount = (stats: SearchTypesStatsDTO, ...keys: (keyof SearchTypesStatsDTO)[]) => {
  const value = keys
    .map(key => stats[key])
    .find(candidate => candidate !== undefined && candidate !== null)
  const count = Number.parseInt(String(value), 10)
  return Number.isFinite(count) ? count : 0
}

export const useSearchServiceCounts = () => {
  const { getTypesStats } = useSearchApi()

  const buildParams = (query: SearchParameters, isPaper: number): SearchParameters => {
    const params: SearchParameters = { is_paper: isPaper }
    filterKeys.forEach((key) => {
      if (key in query) params[key] = query[key]
    })
    return params
  }

  type StatsResponse = Awaited<ReturnType<typeof getTypesStats>>

  const getStats = (result: PromiseSettledResult<StatsResponse>): SearchTypesStatsDTO | null => {
    if (result.status !== 'fulfilled' || !result.value.data) return null
    const data = result.value.data
    return 'types_stats' in data ? data.types_stats : data
  }

  // Counts depend only on the filter keys above (not on the selected service tab), so switching
  // tabs or toggling back to an earlier filter reuses the request instead of refetching.
  const countsByFilters = new Map<string, Promise<SearchServiceCounts>>()

  const fetchServiceCounts = (query: SearchParameters): Promise<SearchServiceCounts> => {
    const key = JSON.stringify(buildParams(query, 1))
    const cached = countsByFilters.get(key)
    if (cached) return cached

    const request = requestServiceCounts(query)
    countsByFilters.set(key, request)
    // Don't keep a failed lookup; let the next call try again.
    request.then((counts) => {
      if (!Object.keys(counts).length) countsByFilters.delete(key)
    })
    return request
  }

  const requestServiceCounts = async (query: SearchParameters): Promise<SearchServiceCounts> => {
    const [paperResult, studyMaterialsResult] = await Promise.allSettled([
      getTypesStats(buildParams(query, 1)),
      getTypesStats(buildParams(query, 0)),
    ])

    const paperStats = getStats(paperResult)
    const studyMaterialsStats = getStats(studyMaterialsResult)
    const sharedStats = paperStats || studyMaterialsStats
    const counts: SearchServiceCounts = {}

    if (paperStats) counts.paper = getCount(paperStats, 'papers')
    if (studyMaterialsStats) counts['study-materials'] = getCount(studyMaterialsStats, 'papers')
    if (sharedStats) {
      counts.quizhub = getCount(sharedStats, 'exams', 'azmoon')
      counts.tutorial = getCount(sharedStats, 'tutorials', 'dars')
    }

    return counts
  }

  return { fetchServiceCounts }
}
