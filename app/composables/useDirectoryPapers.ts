import { computed, reactive, ref, watch } from 'vue'
import { navigateTo, useAsyncData, useRoute } from '#app'
import { useSubjectDirectoryApi } from '~/composables/api/subject-directory/useSubjectDirectory.api'
import { useApiService } from '~/composables/useApiService'
import { DIRECTORY_FILTERS, DIRECTORY_PAGE_SIZE, DIRECTORY_YEAR_OPTIONS, getDirectorySessions } from '~/constants/pastpaper/directory'
import { PAPER_VARIANT_OPTIONS } from '~/constants/search'
import { appendDirectoryPapers, createDirectoryPaperList, groupDirectoryPapers } from '~/utils/directoryPapers'
import { getDirectoryStructuredData, serializeDirectoryStructuredData } from '~/utils/directorySeo'
import type { DirectoryStructuredDataPaper } from '~/utils/directorySeo'
import type { DirectoryFilterOption, DirectoryPaperContext, DirectoryPaperList, DirectoryPaperQuery, DirectoryPaperResponse, DirectorySelection, DirectoryYearGroup } from '~/types/subject-directory'

const readQuery = (value: unknown) => String((Array.isArray(value) ? value[0] : value) ?? '') || undefined

// The first load: the years with their counts and the newest year's first page, or (a backend without the facet) the list.
interface DirectoryFirstLoad {
  years?: { year: number, count: number }[]
  newest?: DirectoryPaperResponse
  list?: DirectoryPaperResponse
}

// The years facet's answer ({num, years: [{edu_year, num}]}), or null when the backend answered the list instead.
const readYears = (response: DirectoryPaperResponse): { year: number, count: number }[] | null => {
  const years = (response?.data as { years?: unknown } | undefined)?.years
  if (!Array.isArray(years)) return null
  return years
    .map(item => ({ year: Number((item as { edu_year?: unknown }).edu_year), count: Number((item as { num?: unknown }).num) || 0 }))
    .filter(item => item.year > 0)
}

// The subject's papers, newest first, grouped into years and sessions. The filters
// live in the URL like Search's, so any URL renders on the server.
// The backend first answers the years with their paper counts (facet=years); the newest
// year's papers load with them, and another year's only when it is opened. A backend
// without the facet (gama-api) answers the first page of the list instead: then the
// page groups that list and "Load older papers" appends the next page, as before.
export const useDirectoryPapers = async (context: DirectoryPaperContext & { selection?: DirectorySelection | null }) => {
  const route = useRoute()
  const { fetchPapers } = useSubjectDirectoryApi()
  const query = computed<DirectoryPaperQuery>(() => ({
    lesson: context.subjectId,
    ...Object.fromEntries(DIRECTORY_FILTERS.map(filter => [filter.queryKey, readQuery(route.query[filter.queryKey])])),
  }))
  const queryKey = computed(() => JSON.stringify(query.value))

  const fetchYear = (year: number, page: number) => fetchPapers({ ...query.value, edu_year: String(year), page, perpage: DIRECTORY_PAGE_SIZE })
  const firstPage = useAsyncData(() => `directory-papers:${queryKey.value}`, async (): Promise<DirectoryFirstLoad | null> => {
    if (!context.subjectId) return null
    const answer = await fetchPapers({ ...query.value, facet: 'years', page: 1, perpage: DIRECTORY_PAGE_SIZE })
    const years = readYears(answer)
    if (!years) return { list: answer }
    const newest = years[0]
    return { years, newest: newest ? await fetchYear(newest.year, 1) : undefined }
  })
  // Paper types depend on the board; Year, Session and Variant are fixed lists.
  const paperTypes = useAsyncData(() => `directory-paper-types:${context.boardId}`, () => context.boardId
    ? useApiService.get<{ data: DirectoryFilterOption[] }>('/api/v2/search/types', { type: 'test_type', section_id: context.boardId }, { public: true })
        .then(response => response.data.filter(item => item.is_paper === true))
    : Promise.resolve([]))

  const optionLists = computed(() => ({
    year: DIRECTORY_YEAR_OPTIONS,
    series: getDirectorySessions(context.gradeId),
    paper: paperTypes.data.value ?? [],
    variant: PAPER_VARIANT_OPTIONS,
  }))
  const filterButtons = computed(() => DIRECTORY_FILTERS.map((filter) => {
    const items: readonly { id: string | number, title: string }[] = optionLists.value[filter.key]
    return {
      ...filter,
      items,
      selectedItem: items.find(item => String(item.id) === query.value[filter.queryKey]) ?? null,
      disabled: !context.subjectId,
      loading: filter.key === 'paper' && paperTypes.status.value === 'pending',
      error: filter.key === 'paper' && paperTypes.error.value ? 'Unable to load options. Please try again.' : '',
    }
  }))
  const setFilters = (values: Record<string, string | undefined>) => navigateTo({ query: { ...route.query, ...values } })
  const selectFilter = (key: string, item: { id: string | number } | null) => {
    const filter = DIRECTORY_FILTERS.find(entry => entry.key === key)
    if (filter) setFilters({ [filter.queryKey]: item ? String(item.id) : undefined })
  }
  const clearFilters = () => setFilters(Object.fromEntries(DIRECTORY_FILTERS.map(filter => [filter.queryKey, undefined])))

  const sessions = computed(() => getDirectorySessions(context.gradeId))

  // Without the years facet: one list of the newest papers, grouped here.
  const list = reactive(createDirectoryPaperList())
  // With it: every year with its count, and each opened year's own list.
  const yearCounts = ref<{ year: number, count: number }[] | null>(null)
  const yearLists = reactive<Record<number, DirectoryPaperList>>({})

  const years = computed<DirectoryYearGroup[]>(() => {
    if (!yearCounts.value) return groupDirectoryPapers(list.items, sessions.value)
    return yearCounts.value.map(({ year, count }) => {
      const own = yearLists[year]
      return {
        id: year,
        title: String(year),
        count,
        sessions: own ? (groupDirectoryPapers(own.items, sessions.value)[0]?.sessions ?? []) : [],
        list: own ?? null,
      }
    })
  })
  const expandedYears = ref<number[]>([])
  const expandedSessions = reactive<Record<number, number[]>>({})
  const expandSessions = (year: number, months: number[]) => {
    expandedSessions[year] = months
  }
  const openNewestSession = (year: number) => {
    const group = years.value.find(item => item.id === year)
    if (group?.sessions[0] && !expandedSessions[year]?.length) expandedSessions[year] = [group.sessions[0].id]
  }

  const addPage = (target: DirectoryPaperList, response: DirectoryPaperResponse) => {
    try {
      appendDirectoryPapers(target, response, DIRECTORY_PAGE_SIZE)
    }
    catch {
      target.error = true
    }
  }

  // Show a new first load and open only its newest year and session.
  let shownKey = ''
  const showFirstPage = () => {
    shownKey = queryKey.value
    const data = firstPage.data.value
    for (const key of Object.keys(expandedSessions)) Reflect.deleteProperty(expandedSessions, key)
    for (const key of Object.keys(yearLists)) Reflect.deleteProperty(yearLists, key)
    Object.assign(list, createDirectoryPaperList(), { error: Boolean(firstPage.error.value) })
    yearCounts.value = data?.years ? data.years : null
    if (data?.list) addPage(list, data.list)
    if (data?.years?.[0] && data.newest) {
      const newest = data.years[0].year
      yearLists[newest] = createDirectoryPaperList()
      addPage(yearLists[newest], data.newest)
    }
    // No year has papers: "No papers match", and nothing more to load.
    if (data?.years && !data.years.length) Object.assign(list, { loaded: true, hasMore: false })
    const year = years.value[0]
    expandedYears.value = year ? [year.id] : []
    if (year) openNewestSession(year.id)
  }
  watch(firstPage.data, showFirstPage)

  // One more page of a year (its first when it is opened). A page that arrives after
  // the subject or filters changed is ignored.
  const loadYear = async (year: number) => {
    const key = shownKey
    const target = yearLists[year] ??= createDirectoryPaperList()
    if (target.loading) return
    target.loading = true
    target.error = false
    try {
      const response = await fetchYear(year, target.page + 1)
      if (key === shownKey) {
        addPage(target, response)
        openNewestSession(year)
      }
    }
    catch {
      if (key === shownKey) target.error = true
    }
    finally {
      target.loading = false
    }
  }
  // Opening a year loads it once.
  watch(expandedYears, (open) => {
    if (!yearCounts.value) return
    for (const year of open) {
      if (!yearLists[year]) void loadYear(year)
    }
  })

  // Without the years facet: the next page of the one list.
  const loadMore = async () => {
    const key = shownKey
    list.loading = true
    list.error = false
    try {
      const response = await fetchPapers({ ...query.value, page: list.page + 1, perpage: DIRECTORY_PAGE_SIZE })
      if (key === shownKey) addPage(list, response)
    }
    catch {
      if (key === shownKey) list.error = true
    }
    finally {
      if (key === shownKey) list.loading = false
    }
  }

  // CollectionPage + breadcrumb JSON-LD, listing the papers in open sessions.
  const siteConfig = useSiteConfig()
  const openPapers = computed<DirectoryStructuredDataPaper[]>(() => years.value.flatMap(year => year.sessions
    .filter(session => expandedYears.value.includes(year.id) && expandedSessions[year.id]?.includes(session.id))
    .flatMap(session => session.papers.map(paper => ({ paper, year: year.title, session: session.title })))))
  const schema = computed(() => getDirectoryStructuredData(context.selection ?? null, openPapers.value, siteConfig.url))
  useHead(() => ({
    script: schema.value
      ? [{ key: 'directory-structured-data', type: 'application/ld+json', innerHTML: serializeDirectoryStructuredData(schema.value) }]
      : [],
  }))

  // Awaited last: an await inside a composable drops the component and Nuxt context
  // the hooks above rely on. On the server, watchers don't run, so show the page here.
  await Promise.all([firstPage, paperTypes])
  showFirstPage()

  return {
    filterButtons, years, list, expandedYears, expandedSessions,
    byYear: computed(() => yearCounts.value !== null),
    loading: computed(() => firstPage.status.value === 'pending' || list.loading),
    selectFilter, clearFilters, expandSessions, loadMore, loadYear,
    refreshPaperTypes: paperTypes.refresh,
    retry: () => list.loaded ? loadMore() : firstPage.refresh(),
  }
}
