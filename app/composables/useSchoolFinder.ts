import type { LocationQuery } from 'vue-router'
import type { SchoolHome } from './useSchoolHome'

export type SchoolFinderSort = 'best' | 'nearest' | 'rating' | 'recent'

export const SCHOOL_FINDER_SORTS: { value: SchoolFinderSort, title: string }[] = [
  { value: 'best', title: 'Best match' },
  { value: 'nearest', title: 'Nearest to home' },
  { value: 'rating', title: 'Top rated' },
  { value: 'recent', title: 'Recently updated' },
]

/** Distances (km) the "from home" filter offers. */
export const SCHOOL_FINDER_DISTANCES = [1, 3, 5, 10]

/** "Nearest to home" without a distance filter still searches a bounded area around home. */
const NEAREST_DEFAULT_RADIUS_KM = 50

export const SCHOOL_FINDER_PAGE_SIZE = 20

export const SCHOOL_TYPE_LABELS: Record<string, string> = {
  Public: 'Public',
  Private: 'Private',
  Religious: 'Religious',
  FirstNation: 'First Nation',
  PrivateNonProfit: 'Private non-profit',
  Government: 'Government',
  Community: 'Community',
}

/** The facility tag that means the school runs its own transport. */
export const SCHOOL_BUS_TAG_NAME = 'Transport Services'

export const schoolTypeLabel = (value: unknown): string => {
  const name = typeof value === 'string' ? value : (value as { name?: string } | null)?.name
  return name ? (SCHOOL_TYPE_LABELS[name] ?? name) : ''
}

export interface SchoolFinderFilters {
  country: number | null
  state: number | null
  city: number | null
  keyword: string
  types: string[]
  facilities: number[]
  photos: boolean
  rated: boolean
  within: number | null
  sort: SchoolFinderSort
  page: number
  view: 'list' | 'map'
}

const first = (value: LocationQuery[string]) => String((Array.isArray(value) ? value[0] : value) ?? '').trim()
const positiveInt = (value: LocationQuery[string]) => {
  const number = Number.parseInt(first(value), 10)
  return Number.isFinite(number) && number > 0 ? number : null
}
const list = (value: LocationQuery[string]) => first(value).split(',').map(item => item.trim()).filter(Boolean)

/** The finder's state from the URL. Unknown or legacy values (old `sort`, `lat`/`lng`/`distance`) fall back to defaults. */
export const parseSchoolFinderQuery = (query: LocationQuery): SchoolFinderFilters => {
  const sort = first(query.sort) as SchoolFinderSort
  const within = positiveInt(query.within)
  return {
    country: positiveInt(query.country),
    state: positiveInt(query.state),
    city: positiveInt(query.city),
    keyword: first(query.keyword),
    types: list(query.type).filter(type => type in SCHOOL_TYPE_LABELS),
    facilities: list(query.facility).map(Number).filter(id => Number.isInteger(id) && id > 0),
    photos: first(query.photos) === '1',
    rated: first(query.rated) === '1',
    within: within && SCHOOL_FINDER_DISTANCES.includes(within) ? within : null,
    sort: SCHOOL_FINDER_SORTS.some(item => item.value === sort) ? sort : 'best',
    page: positiveInt(query.page) ?? 1,
    view: first(query.view) === 'map' ? 'map' : 'list',
  }
}

/** The URL query for a state; defaults stay out so each list has one URL. */
export const schoolFinderQuery = (filters: SchoolFinderFilters): Record<string, string> => {
  const query: Record<string, string> = {}
  if (filters.country) query.country = String(filters.country)
  if (filters.state) query.state = String(filters.state)
  if (filters.city) query.city = String(filters.city)
  if (filters.keyword) query.keyword = filters.keyword
  if (filters.types.length) query.type = filters.types.join(',')
  if (filters.facilities.length) query.facility = filters.facilities.join(',')
  if (filters.photos) query.photos = '1'
  if (filters.rated) query.rated = '1'
  if (filters.within) query.within = String(filters.within)
  if (filters.sort !== 'best') query.sort = filters.sort
  if (filters.page > 1) query.page = String(filters.page)
  if (filters.view === 'map') query.view = 'map'
  return query
}

type ApiParams = Record<string, string | number | boolean | (string | number)[] | undefined>

/**
 * The API filters for a state, shared by the list, the facet counts and the map tiles. Home-based filters need the
 * visitor's home, which only the browser knows: without it (and always on the server) they are left out.
 */
export const schoolFinderFilterParams = (filters: SchoolFinderFilters, home: SchoolHome | null): ApiParams => {
  const params: ApiParams = {
    CountryId: filters.country ?? undefined,
    StateId: filters.state ?? undefined,
    CityId: filters.city ?? undefined,
    Name: filters.keyword || undefined,
    SchoolTypes: filters.types.length ? filters.types : undefined,
    Tags: filters.facilities.length ? filters.facilities : undefined,
    HasImage: filters.photos || undefined,
    HasRating: filters.rated || undefined,
  }
  if (home && (filters.within || filters.sort === 'nearest')) {
    params['Location.Latitude'] = home.lat
    params['Location.Longitude'] = home.lng
    params['Location.Radius'] = (filters.within ?? NEAREST_DEFAULT_RADIUS_KM) * 1000
  }
  return params
}

/** The API order for a sort. "Nearest" without a home falls back to the default order. */
export const schoolFinderSortParams = (sort: SchoolFinderSort, hasHome: boolean): ApiParams => {
  const columns: [string, 'Asc' | 'Desc'][] = sort === 'rating'
    ? [['rating', 'Desc'], ['reviewCount', 'Desc']]
    : sort === 'recent'
      ? [['lastModifyDate', 'Desc']]
      : sort === 'nearest' && hasHome
        ? [['distance', 'Asc']]
        : [['hasImage', 'Desc'], ['lastModifyDate', 'Desc']]
  const params: ApiParams = {}
  columns.forEach(([column, type], index) => {
    params[`PagingDto.SortFilter[${index}].column`] = column
    params[`PagingDto.SortFilter[${index}].sortType`] = type
  })
  return params
}

export const schoolFinderPageParams = (page: number, size = SCHOOL_FINDER_PAGE_SIZE): ApiParams => ({
  'PagingDto.PageFilter.Skip': (page - 1) * size,
  'PagingDto.PageFilter.Size': size,
  'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
})

/** Whether anything narrows the list beyond its location (for "Clear all" and the canonical). */
export const hasSchoolFinderRefinements = (filters: SchoolFinderFilters) =>
  !!(filters.keyword || filters.types.length || filters.facilities.length || filters.photos || filters.rated || filters.within)
