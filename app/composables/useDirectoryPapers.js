import { onScopeDispose } from 'vue'
import { useAsyncData } from '#app'
import { useApiService } from '~/composables/useApiService'
import { DIRECTORY_FILTERS } from '~/constants/pastpaper/directory'
import { getDirectoryPaperSessions, PAST_PAPER_YEAR_OPTIONS } from '~/constants/pastpaper/sessions'
import { createDirectoryPaperLoader } from '~/utils/directoryPaperLoader'
import { getDirectorySessionKey } from '~/utils/directoryPapers'

export const useDirectoryPapers = async (context) => {
  const filters = reactive({ year: '', series: '', paper: '', variant: '' })
  const expandedYears = ref([])
  const expandedSessions = reactive({})
  const activeFilter = ref(null)
  const showFilterDialog = ref(false)
  const optionsLoading = ref(false)
  const optionsError = ref('')
  const catalogues = reactive({})
  const optionRequests = new Map()
  let optionsVersion = 0

  const loader = createDirectoryPaperLoader((params, signal) =>
    useApiService.get('/api/v1/tests/search', params, { public: true, signal }),
  { makeState: reactive })

  const sessions = computed(() => getDirectoryPaperSessions(context.gradeId))
  const visibleYears = computed(() => filters.year
    ? PAST_PAPER_YEAR_OPTIONS.filter(item => String(item.id) === filters.year)
    : PAST_PAPER_YEAR_OPTIONS)
  const visibleSessions = computed(() => filters.series
    ? sessions.value.filter(item => String(item.id) === filters.series)
    : sessions.value)
  const firstSession = () => (visibleSessions.value.find(item => item.id === 6) || visibleSessions.value[0])?.id

  const paperCatalogueKey = computed(() => `papers:${context.boardId}`)
  const optionLists = computed(() => ({
    year: PAST_PAPER_YEAR_OPTIONS,
    series: sessions.value,
    paper: catalogues[paperCatalogueKey.value] || [],
    variant: catalogues.variants || [],
  }))
  const filterButtons = computed(() => DIRECTORY_FILTERS.map(filter => ({
    ...filter,
    selection: optionLists.value[filter.key].find(item => String(item.id) === filters[filter.key])?.title || filter.allTitle,
  })))
  const modalFilter = computed(() => DIRECTORY_FILTERS.find(item => item.key === activeFilter.value) || DIRECTORY_FILTERS[0])
  const modalItems = computed(() => [
    { id: '', title: modalFilter.value.allTitle },
    ...optionLists.value[modalFilter.value.key],
  ])
  const selectedModalItem = computed(() => modalItems.value.find(item => String(item.id) === filters[modalFilter.value.key]))

  const fetchOptions = async () => {
    const version = ++optionsVersion
    const filter = activeFilter.value
    if (!['paper', 'variant'].includes(filter)) return
    const key = filter === 'paper' ? paperCatalogueKey.value : 'variants'
    if (catalogues[key]) return
    optionsLoading.value = true
    optionsError.value = ''
    try {
      if (!optionRequests.has(key)) {
        const params = filter === 'paper'
          ? { type: 'test_type', section_id: context.boardId }
          : { type: 'variant' }
        optionRequests.set(key, useApiService.get('/api/v1/types/list', params, { public: true }))
      }
      const response = await optionRequests.get(key)
      if (Number(response?.status) !== 1 || !Array.isArray(response.data)) throw new Error('Invalid options')
      catalogues[key] = filter === 'paper'
        ? response.data.filter(item => item.is_paper === true || item.is_paper === '1' || item.is_paper === 1)
        : response.data.map(item => ({ ...item, title: item.title === 'nv' ? 'No variant' : item.title }))
    }
    catch {
      if (version === optionsVersion) optionsError.value = 'Unable to load options. Please try again.'
    }
    finally {
      optionRequests.delete(key)
      if (version === optionsVersion) optionsLoading.value = false
    }
  }

  const openFilter = (key) => {
    activeFilter.value = key
    showFilterDialog.value = true
    optionsLoading.value = false
    optionsError.value = ''
    fetchOptions()
  }

  const selectFilter = (item) => {
    filters[modalFilter.value.key] = String(item.id)
    showFilterDialog.value = false
    optionsVersion++
  }

  const sessionQuery = (year, month) => ({
    lesson: context.subjectId,
    edu_year: year,
    edu_month: month,
    test_type: filters.paper || undefined,
    variant: filters.variant || undefined,
  })
  const sessionKey = (year, month) => getDirectorySessionKey(sessionQuery(year, month))
  const sessionState = (year, month) => loader.getState(sessionQuery(year, month))
  const loadSession = (year, month) => loader.load(sessionQuery(year, month))
  const isSessionOpen = (year, month) => expandedYears.value.includes(year)
    && (expandedSessions[year] || []).includes(month)

  const expandYears = (years) => {
    expandedYears.value = years
    for (const year of years) {
      if (!expandedSessions[year]) expandedSessions[year] = firstSession() == null ? [] : [firstSession()]
    }
  }

  watch(() => [context.subjectId, context.gradeId, context.boardId].map(value => String(value || '')).join(':'), () => {
    loader.clear()
    Object.assign(filters, { year: '', series: '', paper: '', variant: '' })
    showFilterDialog.value = false
    optionsVersion++
    for (const year of Object.keys(expandedSessions)) delete expandedSessions[year]
    expandYears(context.subjectId ? [PAST_PAPER_YEAR_OPTIONS[0].id] : [])
  }, { immediate: true })

  watch(() => [filters.year, filters.series, filters.paper, filters.variant], () => {
    loader.cancelPending()
    const validYears = new Set(visibleYears.value.map(item => item.id))
    const years = expandedYears.value.filter(year => validYears.has(year))
    if (!years.length && visibleYears.value.length) years.push(visibleYears.value[0].id)
    expandYears(years)
    for (const year of years) {
      const allowed = new Set(visibleSessions.value.map(item => item.id))
      const months = (expandedSessions[year] || []).filter(month => allowed.has(month))
      expandedSessions[year] = months.length ? months : firstSession() == null ? [] : [firstSession()]
    }
  })

  onScopeDispose(() => loader.clear())

  // Hydrate the first batch from Nuxt's payload, preserving server-rendered
  // paper links without repeating the initial request in the browser.
  if (context.subjectId && firstSession() != null) {
    const query = sessionQuery(PAST_PAPER_YEAR_OPTIONS[0].id, firstSession())
    const { data } = await useAsyncData(`directory-papers:${getDirectorySessionKey(query)}`, () =>
      useApiService.get('/api/v1/tests/search', {
        ...query, is_paper: true, directory: true, page: 1, perpage: 20,
      }, { public: true }))
    if (Number(data.value?.status) === 1 && Array.isArray(data.value?.data?.list)) {
      loader.seed(query, data.value)
    }
  }

  return {
    filters, filterButtons, visibleYears, visibleSessions, expandedYears, expandedSessions,
    modalFilter, modalItems, selectedModalItem, showFilterDialog, optionsLoading, optionsError,
    openFilter, selectFilter, fetchOptions, expandYears, sessionKey, sessionState, loadSession, isSessionOpen,
  }
}
