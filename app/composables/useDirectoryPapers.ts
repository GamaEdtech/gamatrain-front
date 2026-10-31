import { computed, reactive, ref, watch } from 'vue'
import { navigateTo, useAsyncData, useRoute } from '#app'
import { useSubjectDirectoryApi } from '~/composables/api/subject-directory/useSubjectDirectory.api'
import { useApiService } from '~/composables/useApiService'
import { DIRECTORY_FILTERS, DIRECTORY_PAGE_SIZE, DIRECTORY_YEAR_OPTIONS, getDirectorySessions } from '~/constants/pastpaper/directory'
import { PAPER_VARIANT_OPTIONS } from '~/constants/search'
import { appendDirectoryPapers, createDirectoryPaperList, groupDirectoryPapers } from '~/utils/directoryPapers'
import { getDirectoryStructuredData, serializeDirectoryStructuredData } from '~/utils/directorySeo'
import type { DirectoryStructuredDataPaper } from '~/utils/directorySeo'
import type { DirectoryFilterOption, DirectoryPaperContext, DirectoryPaperQuery, DirectoryPaperResponse, DirectorySelection } from '~/types/subject-directory'

const readQuery = (value: unknown) => String((Array.isArray(value) ? value[0] : value) ?? '') || undefined

// The subject's papers, newest first, grouped into years and sessions. The filters
// live in the URL like Search's, so the first page of any URL renders on the server;
// "Load older papers" appends the next page.
export const useDirectoryPapers = async (context: DirectoryPaperContext & { selection?: DirectorySelection | null }) => {
  const route = useRoute()
  const { fetchPapers } = useSubjectDirectoryApi()
  const query = computed<DirectoryPaperQuery>(() => ({
    lesson: context.subjectId,
    ...Object.fromEntries(DIRECTORY_FILTERS.map(filter => [filter.queryKey, readQuery(route.query[filter.queryKey])])),
  }))
  const queryKey = computed(() => JSON.stringify(query.value))

  const firstPage = useAsyncData(() => `directory-papers:${queryKey.value}`, () => context.subjectId
    ? fetchPapers({ ...query.value, page: 1, perpage: DIRECTORY_PAGE_SIZE })
    : Promise.resolve(null))
  // Paper types depend on the board; Year, Session and Variant are fixed lists.
  const paperTypes = useAsyncData(() => `directory-paper-types:${context.boardId}`, () => context.boardId
    ? useApiService.get<{ data: DirectoryFilterOption[] }>('/api/v1/types/list', { type: 'test_type', section_id: context.boardId }, { public: true })
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

  const list = reactive(createDirectoryPaperList())
  const years = computed(() => groupDirectoryPapers(list.items, getDirectorySessions(context.gradeId)))
  const expandedYears = ref<number[]>([])
  const expandedSessions = reactive<Record<number, number[]>>({})
  const expandSessions = (year: number, months: number[]) => {
    expandedSessions[year] = months
  }

  const addPage = (response: DirectoryPaperResponse) => {
    try {
      appendDirectoryPapers(list, response, DIRECTORY_PAGE_SIZE)
    }
    catch {
      list.error = true
    }
  }

  // Show a new first page and open only its newest session.
  let shownKey = ''
  const showFirstPage = () => {
    shownKey = queryKey.value
    Object.assign(list, createDirectoryPaperList(), { error: Boolean(firstPage.error.value) })
    if (firstPage.data.value) addPage(firstPage.data.value)
    const year = years.value[0]
    for (const key of Object.keys(expandedSessions)) Reflect.deleteProperty(expandedSessions, key)
    expandedYears.value = year ? [year.id] : []
    if (year?.sessions[0]) expandedSessions[year.id] = [year.sessions[0].id]
  }
  watch(firstPage.data, showFirstPage)

  // A page that arrives after the subject or filters changed is ignored.
  const loadMore = async () => {
    const key = shownKey
    list.loading = true
    list.error = false
    try {
      const response = await fetchPapers({ ...query.value, page: list.page + 1, perpage: DIRECTORY_PAGE_SIZE })
      if (key === shownKey) addPage(response)
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
    loading: computed(() => firstPage.status.value === 'pending' || list.loading),
    selectFilter, clearFilters, expandSessions, loadMore,
    refreshPaperTypes: paperTypes.refresh,
    retry: () => list.loaded ? loadMore() : firstPage.refresh(),
  }
}
