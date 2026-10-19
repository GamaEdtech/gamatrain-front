import type { Ref } from 'vue'
import type { SearchParameters } from '@/composables/useApiService'

export type SearchServiceId
  = | 'paper'
    | 'study-materials'
    // | 'multimedia'
    | 'quizhub'
    | 'forum'
    | 'tutorial'
    // | 'teacher'

export type LegacySearchType
  = | 'test'
    // | 'learnfiles'
    | 'azmoon'
    | 'question'
    | 'dars'
    // | 'teacher'

export type SearchTypeAlias = SearchServiceId | LegacySearchType

export type SearchCountService = 'paper' | 'study-materials' | 'quizhub' | 'tutorial'

export type SearchServiceCounts = Partial<Record<SearchCountService, number>>

export interface SearchTypesStatsDTO {
  papers?: number | string | null
  exams?: number | string | null
  azmoon?: number | string | null
  tutorials?: number | string | null
  dars?: number | string | null
  [key: string]: number | string | null | undefined
}

export type SearchFilterKey
  = | 'section'
    | 'base'
    | 'lesson'
    | 'type'
    | 'topic'
    | 'edu_year'
    | 'edu_month'
    | 'test_type'
    | 'variant'
    | 'exam_type'
    | 'content_type'

export type SearchConditionalFilter
  = | 'year'
    | 'session'
    | 'paper'
    | 'variant'
    | 'material'
    | 'topic'
    | 'exam-type'
    | 'content-type'

export interface SearchFilterOption {
  id: string | number
  title: string
  code?: string | number | null
  icon?: string | null
  apiIcon?: string | null
  is_paper?: boolean
  list_order?: string | number
}

export interface SearchServiceOption extends SearchFilterOption {
  id: SearchServiceId
  legacyApiType: LegacySearchType
  shortTitle: string
  isPaper: boolean | null
}

export interface SearchFilterDependency {
  key: SearchFilterKey
  sourceKey: 'id' | 'code'
}

export interface SearchFilterDefinition {
  key: SearchFilterKey
  title: string
  icon?: string
  dependsOn?: SearchFilterDependency[]
  staticOptions?: SearchFilterOption[]
  disabledUntilReady?: boolean
}

export interface SearchFilterState extends SearchFilterDefinition {
  loading: boolean
  disabled: boolean
  options: SearchFilterOption[]
  selected: SearchFilterOption | null
}

export type SearchFilterSelections = Partial<Record<SearchFilterKey, SearchFilterOption | undefined>>

export interface SearchFilterOptions {
  initialService?: SearchServiceId
  syncRouteQuery?: boolean
}

export interface SearchFilterResult {
  activeService: Ref<SearchServiceId>
  filters: Ref<SearchFilterState[]>
  selections: SearchFilterSelections
  setService: (service: SearchServiceId) => Promise<void>
  selectFilter: (key: SearchFilterKey, option: SearchFilterOption | null) => Promise<void>
  loadFilterOptions: (key: SearchFilterKey) => Promise<SearchFilterOption[]>
  resetFilters: () => Promise<void>
}

export interface SearchRequestOptions {
  public?: boolean
}

export interface SearchListDTO {
  num: number | string
  list: SearchResourceItem[]
}

export interface SearchResourceItem {
  id: number | string
  title?: string | null
  title_url?: string | null
  description?: string | null
  summary?: string | null
  lesson_pic?: string | null
  avatar?: string | null
  first_name?: string | null
  last_name?: string | null
  username?: string | null
  section_title?: string | null
  base_title?: string | null
  lesson_title?: string | null
  test_type_title?: string | null
  azmoon_type_title?: string | null
  is_paper?: boolean | null
  [key: string]: unknown
}

export interface SearchCardItem extends SearchResourceItem {
  q_file?: boolean | string | null
  a_file?: boolean | string | null
  q_file_word?: boolean | string | null
  referee_score?: number | string | null
  ref_score?: number | string | null
  tests_num?: number | string | null
  views?: number | string | null
  subdate?: string | null
  level?: number | string | null
}

export type SearchQueryValue = string | number | boolean | null | undefined | string[] | number[]
export type SearchQuery = Record<string, SearchQueryValue>

export interface SearchRequestParams extends SearchParameters {
  page: number
  perpage: number
  noTypesStats: number
  type: LegacySearchType
  is_paper?: boolean
  title?: SearchQueryValue
  section?: SearchQueryValue
  base?: SearchQueryValue
  lesson?: SearchQueryValue
  test_type?: SearchQueryValue
  variant?: SearchQueryValue
  edu_year?: SearchQueryValue
  edu_month?: SearchQueryValue
  topic?: SearchQueryValue
  exam_type?: SearchQueryValue
  content_type?: SearchQueryValue
}
