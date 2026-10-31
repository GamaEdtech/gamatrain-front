import { onMounted, onScopeDispose } from 'vue'
import { useNuxtData } from '#app'
import { useDirectoryPapersApi } from '~/composables/api/subject-directory/useDirectoryPapers.api'
import { useDirectoryFilterOptions } from '~/composables/useDirectoryFilterOptions'
import { DIRECTORY_FILTERS } from '~/constants/pastpaper/directory'
import { getDirectoryPaperSessions, PAST_PAPER_YEAR_OPTIONS } from '~/constants/pastpaper/sessions'
import { createDirectoryPaperLoader } from '~/utils/directoryPaperLoader'
import { getDirectorySessionKey } from '~/utils/directoryPapers'
import { createDirectorySessionAvailability } from '~/utils/directorySessionAvailability'
import { createDirectoryLatestSessionExpansion } from '~/utils/directoryPaperExpansion'
import { getDirectoryInitialPapersKey } from '~/utils/directoryInitialPapers'
import { useDirectoryInitialPapers } from '~/composables/useDirectoryInitialPapers'

export const useDirectoryPapers = async (context) => {
  const filters = reactive({ year: '', series: '', paper: '', variant: '' })
  const expandedYears = ref([])
  const expandedSessions = reactive({})
  const { optionLists, optionLoading, optionErrors, fetchOptions, ready: optionsReady } = useDirectoryFilterOptions(context)

  const { fetchPapers } = useDirectoryPapersApi()
  const loader = createDirectoryPaperLoader(fetchPapers, { makeState: reactive })
  const availability = createDirectorySessionAvailability(fetchPapers, { makeState: reactive })
  let availabilityReady = false
  let resettingSubjectFilters = false

  const sessions = computed(() => getDirectoryPaperSessions(context.gradeId))
  const visibleYears = computed(() => filters.year
    ? PAST_PAPER_YEAR_OPTIONS.filter(item => String(item.id) === filters.year)
    : PAST_PAPER_YEAR_OPTIONS)
  const visibleSessions = computed(() => filters.series
    ? sessions.value.filter(item => String(item.id) === filters.series)
    : sessions.value)

  const filterButtons = computed(() => DIRECTORY_FILTERS.map(filter => ({
    ...filter,
    selectedItem: optionLists.value[filter.key].find(item => String(item.id) === filters[filter.key]) || null,
    items: optionLists.value[filter.key],
    disabled: !context.subjectId || (filter.key === 'paper' && !context.boardId),
    loading: Boolean(optionLoading.value[filter.key]),
    error: optionErrors.value[filter.key] || '',
  })))

  const selectFilter = (key, item) => {
    if (Object.hasOwn(filters, key)) filters[key] = item ? String(item.id) : ''
  }
  const clearFilters = () => {
    Object.assign(filters, { year: '', series: '', paper: '', variant: '' })
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
  const availabilityState = (year, month) => availability.getState(sessionQuery(year, month))
  const displayedSessions = year => visibleSessions.value.filter((session) => {
    const status = availabilityState(year, session.id).status
    return status === 'available' || status === 'error'
  })
  const yearAvailabilityLoading = year => visibleSessions.value.some((session) => {
    const status = availabilityState(year, session.id).status
    return status === 'idle' || status === 'loading'
  })

  const ensureYearAvailability = async (year) => {
    if (!context.subjectId) return
    const queries = visibleSessions.value.map(session => sessionQuery(year, session.id))
    const runKey = queries.map(getDirectorySessionKey).join('|')
    await Promise.all(queries.map((query) => {
      const paperState = loader.getState(query)
      if (paperState.loaded) {
        availability.seed(query, paperState.total > 0 || paperState.items.length > 0)
        return Promise.resolve()
      }
      return availability.check(query)
    }))

    const currentKey = visibleSessions.value
      .map(session => getDirectorySessionKey(sessionQuery(year, session.id)))
      .join('|')
    if (runKey !== currentKey || !expandedYears.value.includes(year)) return

    const available = displayedSessions(year)
    const allowed = new Set(available.map(session => session.id))
    const selected = (expandedSessions[year] || []).filter(month => allowed.has(month))
    expandedSessions[year] = selected
  }

  const automaticExpansion = createDirectoryLatestSessionExpansion({
    years: () => context.subjectId ? visibleYears.value : [],
    sessions: () => visibleSessions.value,
    checkYear: ensureYearAvailability,
    status: (year, month) => availabilityState(year, month).status,
    open: (year, month) => {
      expandedYears.value = [year]
      expandedSessions[year] = [month]
    },
  })

  const expandYears = (years) => {
    automaticExpansion.cancel()
    const previousYears = expandedYears.value
    expandedYears.value = years
    for (const year of years) {
      if (!previousYears.includes(year) || !expandedSessions[year]) expandedSessions[year] = []
      if (availabilityReady) ensureYearAvailability(year)
    }
  }

  const expandSessions = (year, months) => {
    automaticExpansion.cancel()
    expandedSessions[year] = months
  }

  watch(() => [context.subjectId, context.gradeId, context.boardId].map(value => String(value || '')).join(':'), () => {
    automaticExpansion.cancel()
    loader.clear()
    availability.clear()
    resettingSubjectFilters = Object.values(filters).some(Boolean)
    Object.assign(filters, { year: '', series: '', paper: '', variant: '' })
    for (const year of Object.keys(expandedSessions)) delete expandedSessions[year]
    expandYears(context.subjectId ? [PAST_PAPER_YEAR_OPTIONS[0].id] : [])
    if (availabilityReady) automaticExpansion.openLatest()
  }, { immediate: true })

  watch(() => [filters.year, filters.series, filters.paper, filters.variant], (values, previous) => {
    if (resettingSubjectFilters && values.every(value => !value)) {
      resettingSubjectFilters = false
      return
    }
    resettingSubjectFilters = false
    automaticExpansion.cancel()
    // Year and Session only change what is shown; Paper and Variant change the
    // session queries, so only those make in-flight requests obsolete.
    if (values[2] !== previous[2] || values[3] !== previous[3]) {
      loader.cancelPending()
      availability.cancelPending()
    }
    if (values[0] !== previous[0]) {
      for (const year of Object.keys(expandedSessions)) expandedSessions[year] = []
    }
    const validYears = new Set(visibleYears.value.map(item => item.id))
    const years = expandedYears.value.filter(year => validYears.has(year))
    if (!years.length && visibleYears.value.length) years.push(visibleYears.value[0].id)
    expandYears(years)
    for (const year of years) {
      const allowed = new Set(visibleSessions.value.map(item => item.id))
      const months = (expandedSessions[year] || []).filter(month => allowed.has(month))
      expandedSessions[year] = months
    }
  })

  onMounted(() => {
    availabilityReady = true
    if (!context.subjectId) return
    // Finish what the first render skipped: older years beyond its limit, or
    // everything when its payload is missing. Checked sessions are cached.
    const hasOpenSession = expandedYears.value.some(year => expandedSessions[year]?.length)
    if (hasOpenSession) expandedYears.value.forEach(year => ensureYearAvailability(year))
    else automaticExpansion.openLatest()
  })

  onScopeDispose(() => {
    automaticExpansion.cancel()
    loader.clear()
    availability.clear()
  })

  if (context.subjectId) {
    const subjectId = context.subjectId
    const gradeId = context.gradeId
    const initialContext = { subjectId, gradeId }
    // The page starts this request alongside Resources. Consume its SSR payload
    // directly; retain standalone loading for other paper-table consumers.
    const cached = useNuxtData(getDirectoryInitialPapersKey(initialContext))
    const { data } = cached.data.value ? cached : await useDirectoryInitialPapers(initialContext)
    if (data.value && context.subjectId === subjectId && context.gradeId === gradeId) {
      for (const session of data.value.sessions) {
        Object.assign(loader.getState(session.query), session.papers, { items: [...session.papers.items] })
        availability.getState(session.query).status = session.availability
      }
      if (data.value.selected) {
        const { year, month } = data.value.selected
        expandedYears.value = [year]
        expandedSessions[year] = [month]
      }
    }
  }

  // Awaited last: an await inside a composable drops the component and Nuxt
  // context that the hooks and data composables above rely on.
  await optionsReady

  return {
    filters, filterButtons, visibleYears, visibleSessions, expandedYears, expandedSessions,
    selectFilter, clearFilters, fetchOptions, expandYears, expandSessions, sessionKey, sessionState, loadSession, isSessionOpen,
    displayedSessions, yearAvailabilityLoading,
  }
}
