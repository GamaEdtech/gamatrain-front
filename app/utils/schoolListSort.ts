/** Sort options of the school list, in the order they are shown. */
export const SCHOOL_SORT_OPTIONS = [
  { value: 'hasImage', title: 'Photos first' },
  { value: 'lastModifyDate', title: 'Recently Updated' },
  { value: 'score', title: 'Highest score' },
]

/**
 * The list's default order: schools with a photo first, each group by latest activity. It is kept out of the URL
 * (one URL per list for search engines), so a list URL without `sort` means this order.
 */
export const DEFAULT_SCHOOL_SORT = ['hasImage', 'lastModifyDate']

/**
 * The sort values for a `sort` query value. No `sort` gives the default; an explicit one is kept (so unticking
 * "Photos first" survives a reload), with "Recently Updated" always part of the order.
 */
export const parseSchoolSort = (raw: unknown): string[] => {
  const list = (Array.isArray(raw) ? raw.map(String) : raw ? String(raw).split(',') : []).filter(Boolean)
  if (!list.length) return [...DEFAULT_SCHOOL_SORT]
  return list.includes('lastModifyDate') ? list : ['lastModifyDate', ...list]
}

export const isDefaultSchoolSort = (sort: string[]) =>
  sort.length === DEFAULT_SCHOOL_SORT.length && DEFAULT_SCHOOL_SORT.every(value => sort.includes(value))

/**
 * The API's SortFilter parameters. "Photos first" always leads, whatever order the boxes were ticked in; the backend
 * serves both "photos first, then recent" and "recent" from an index.
 */
export const schoolSortParams = (sort: string[]): Record<string, string> => {
  const ordered = [...sort.filter(value => value === 'hasImage'), ...sort.filter(value => value !== 'hasImage')]
  const params: Record<string, string> = {}
  ordered.forEach((value, index) => {
    params[`PagingDto.SortFilter[${index}].sortType`] = value === 'distance' ? 'Asc' : 'Desc'
    params[`PagingDto.SortFilter[${index}].column`] = value
  })
  return params
}
