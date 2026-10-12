import type {
  LegacySearchType,
  SearchQuery,
  SearchRequestParams,
  SearchServiceId,
  SearchTypeAlias,
} from '@/types/search'

const SEARCH_SERVICE_BY_TYPE = {
  'test': 'paper',
  'learnfiles': 'multimedia',
  'azmoon': 'quizhub',
  'question': 'forum',
  'dars': 'tutorial',
  'paper': 'paper',
  'study-materials': 'study-materials',
  'multimedia': 'multimedia',
  'quizhub': 'quizhub',
  'forum': 'forum',
  'tutorial': 'tutorial',
  'teacher': 'teacher',
} satisfies Record<SearchTypeAlias, SearchServiceId>

const LEGACY_TYPE_BY_SEARCH_SERVICE = {
  'paper': 'test',
  'study-materials': 'test',
  'multimedia': 'learnfiles',
  'quizhub': 'azmoon',
  'forum': 'question',
  'tutorial': 'dars',
  'test': 'test',
  'learnfiles': 'learnfiles',
  'azmoon': 'azmoon',
  'question': 'question',
  'dars': 'dars',
  'teacher': 'teacher',
} satisfies Record<SearchTypeAlias, LegacySearchType>

const isSearchTypeAlias = (type: string): type is SearchTypeAlias =>
  Object.prototype.hasOwnProperty.call(SEARCH_SERVICE_BY_TYPE, type)

export const normalizeSearchService = (type: unknown): SearchServiceId => {
  const key = String(type ?? '')
  return isSearchTypeAlias(key) ? SEARCH_SERVICE_BY_TYPE[key] : 'paper'
}

export const getLegacySearchType = (type: unknown): LegacySearchType => {
  const key = String(type ?? '')
  return isSearchTypeAlias(key) ? LEGACY_TYPE_BY_SEARCH_SERVICE[key] : 'test'
}

export const buildSearchParams = (query: SearchQuery, page: number, perpage: number): SearchRequestParams => {
  const frontendType = normalizeSearchService(query.type)
  const params: SearchRequestParams = {
    page,
    perpage,
    noTypesStats: 1,
    title: query.title,
    section: query.section,
    base: query.base,
    lesson: query.lesson,
    type: getLegacySearchType(frontendType),
  }

  if (frontendType === 'paper') {
    params.is_paper = true
    params.test_type = query.test_type
    params.variant = query.variant
    params.edu_year = query.edu_year
    params.edu_month = query.edu_month
  }
  else if (frontendType === 'study-materials') {
    params.is_paper = false
    params.test_type = query.test_type
    params.topic = query.topic
  }
  else if (frontendType === 'quizhub') {
    params.exam_type = query.exam_type
    params.topic = query.topic
    params.edu_year = query.edu_year
    params.edu_month = query.edu_month
  }
  else if (frontendType === 'tutorial') {
    params.topic = query.topic
  }

  return params
}
