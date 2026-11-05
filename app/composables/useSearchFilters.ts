import type {
  BoardDTO,
  ClassificationDTO,
  ExtraTypeFilePastPaperCreateDTO,
  GradeDTO,
  SubjectDTO,
  TopicDTO,
} from '@/types'
import type {
  SearchFilterDefinition,
  SearchFilterKey,
  SearchFilterOption,
  SearchFilterOptions,
  SearchFilterResult,
  SearchFilterSelections,
  SearchFilterState,
  SearchServiceId,
} from '@/types/search'
import {
  ALL_SEARCH_MONTHS,
  DEFAULT_SEARCH_SERVICE,
  SEARCH_BOARD_ICON_BY_TITLE,
  SEARCH_FILTERS_BY_SERVICE,
  SEARCH_MONTHS_BY_LEVEL,
  SEARCH_SERVICE_OPTIONS,
} from '@/constants'
import { normalizeSearchService } from '@/utils/searchServices'

const BASE_FILTER_KEYS: SearchFilterKey[] = ['section', 'base', 'lesson', 'type']
const QUERY_FILTER_KEYS: SearchFilterKey[] = [
  'section',
  'base',
  'lesson',
  'type',
  'topic',
  'edu_year',
  'edu_month',
  'test_type',
  'variant',
  'exam_type',
  'content_type',
]

const getResponseDataList = <T>(data: T[] | unknown): T[] =>
  Array.isArray(data) ? data : []

const toSearchOption = (
  item: BoardDTO | GradeDTO | SubjectDTO | ClassificationDTO | TopicDTO | ExtraTypeFilePastPaperCreateDTO,
): SearchFilterOption => ({
  id: item.id,
  title: item.title,
  code: 'code' in item ? item.code : undefined,
  icon: 'icon' in item ? SEARCH_BOARD_ICON_BY_TITLE[item.title] || item.icon : undefined,
  apiIcon: 'icon' in item ? item.icon : undefined,
  is_paper: 'is_paper' in item ? item.is_paper : undefined,
  list_order: 'list_order' in item ? item.list_order : undefined,
})

const sortByListOrder = (items: SearchFilterOption[]) =>
  [...items].sort((a, b) => Number(a.list_order ?? 0) - Number(b.list_order ?? 0))

export const useSearchFilters = (options: SearchFilterOptions = {}): SearchFilterResult => {
  const route = useRoute()
  const router = useRouter()
  const {
    data: boards,
    getData: getBoards,
    getGrades,
    getSubjects,
    getClassification,
    getTopics,
    getExtraTypeFile,
  } = useBoard()

  const syncRouteQuery = options.syncRouteQuery ?? true
  const activeService = ref<SearchServiceId>(
    options.initialService || normalizeSearchService(route.query.type),
  )
  const selections = reactive<SearchFilterSelections>({})
  const filters = ref<SearchFilterState[]>([])

  const makeFilter = (definition: SearchFilterDefinition): SearchFilterState => ({
    ...definition,
    loading: false,
    disabled: Boolean(definition.disabledUntilReady),
    options: definition.staticOptions ? [...definition.staticOptions] : [],
    selected: null,
  })

  const getFilter = (key: SearchFilterKey) =>
    filters.value.find(filter => filter.key === key)

  const getQueryValue = (key: SearchFilterKey) => {
    if (key === 'type') return activeService.value

    const value = route.query[key]
    const normalizedValue = Array.isArray(value) ? value[0] : value

    return normalizedValue == null || normalizedValue === ''
      ? null
      : String(normalizedValue)
  }

  const getOptionValue = (filter: SearchFilterState, option: SearchFilterOption) => {
    if (filter.key === 'section') return option.code ?? option.id
    return option.id
  }

  const findSelectedOptionFromQuery = (filter: SearchFilterState) => {
    const queryValue = getQueryValue(filter.key)
    if (!queryValue) return null

    return filter.options.find(option =>
      String(getOptionValue(filter, option)) === queryValue,
    ) || null
  }

  const getConditionalFilters = (service: SearchServiceId) =>
    SEARCH_FILTERS_BY_SERVICE[service] || []

  const getFilterDefinitions = (service: SearchServiceId): SearchFilterDefinition[] => {
    const conditionalFilters = getConditionalFilters(service)
    const definitions: SearchFilterDefinition[] = [
      {
        key: 'section',
        title: 'Board',
        icon: 'md:school_outlined',
      },
      {
        key: 'base',
        title: 'Level',
        dependsOn: [{ key: 'section', sourceKey: 'code' }],
        disabledUntilReady: true,
      },
      {
        key: 'lesson',
        title: 'Subject',
        dependsOn: [{ key: 'base', sourceKey: 'id' }],
        disabledUntilReady: true,
      },
      {
        key: 'type',
        title: 'Services',
        staticOptions: SEARCH_SERVICE_OPTIONS,
      },
    ]

    conditionalFilters.forEach((filter) => {
      if (filter === 'topic') {
        definitions.push({
          key: 'topic',
          title: 'Topic',
          icon: 'md:sell_outlined',
          dependsOn: [{ key: 'lesson', sourceKey: 'id' }],
          disabledUntilReady: true,
        })
      }

      if (filter === 'year') {
        definitions.push({
          key: 'edu_year',
          title: 'Year',
          icon: 'md:calendar_today_outlined',
          staticOptions: Array.from({ length: 14 }, (_, index) => 2013 + index)
            .reverse()
            .map(year => ({ id: year, title: `${year}` })),
        })
      }

      if (filter === 'session') {
        definitions.push({
          key: 'edu_month',
          title: 'Session',
          dependsOn: [{ key: 'base', sourceKey: 'id' }],
          staticOptions: ALL_SEARCH_MONTHS,
        })
      }

      if (filter === 'paper') {
        definitions.push({
          key: 'test_type',
          title: 'Paper',
          dependsOn: [{ key: 'section', sourceKey: 'code' }],
          disabledUntilReady: true,
        })
      }

      if (filter === 'variant') {
        definitions.push({
          key: 'variant',
          title: 'Variant',
          staticOptions: [
            { id: '7814', title: '1' },
            { id: '7815', title: '2' },
            { id: '7816', title: '3' },
          ],
        })
      }

      if (filter === 'material') {
        definitions.push({
          key: 'test_type',
          title: 'Material Type',
          dependsOn: [{ key: 'section', sourceKey: 'code' }],
          disabledUntilReady: true,
        })
      }

      if (filter === 'exam-type') {
        definitions.push({
          key: 'exam_type',
          title: 'Exam Type',
        })
      }
    })

    return definitions
  }

  const updateRouteQuery = async () => {
    if (!syncRouteQuery) return

    const query = Object.fromEntries(
      Object.entries(route.query).filter(([key]) =>
        key !== 'page' && !QUERY_FILTER_KEYS.includes(key as SearchFilterKey),
      ),
    )

    filters.value.forEach((filter) => {
      if (filter.selected) query[filter.key] = String(filter.selected.code ?? filter.selected.id)
    })

    await router.replace({ query })
  }

  const applyFilterDefinitions = () => {
    const previousSelections = { ...selections }
    const previousFilters = new Map(
      filters.value.map(filter => [`${filter.key}:${filter.title}`, filter]),
    )
    const definitions = getFilterDefinitions(activeService.value)
    const nextFilters = definitions.map((definition) => {
      const nextFilter = makeFilter(definition)
      const previousFilter = previousFilters.get(`${definition.key}:${definition.title}`)

      if (!previousFilter) return nextFilter

      return {
        ...nextFilter,
        loading: previousFilter.loading,
        options: previousFilter.options,
      }
    })
    const nextKeys = new Set(definitions.map(definition => definition.key))

    QUERY_FILTER_KEYS.forEach((key) => {
      selections[key] = undefined
    })

    nextFilters.forEach((filter) => {
      const selected = previousSelections[filter.key]
      if (selected) {
        filter.selected = selected
        selections[filter.key] = selected
      }
      if (filter.key === 'type') {
        const serviceOption: SearchFilterOption = SEARCH_SERVICE_OPTIONS.find(service => service.id === activeService.value)
          ?? DEFAULT_SEARCH_SERVICE
        filter.selected = serviceOption
        selections.type = serviceOption
      }
      filter.disabled = Boolean(filter.disabledUntilReady && !isFilterReady(filter, previousSelections))
    })

    QUERY_FILTER_KEYS.forEach((key) => {
      if (!nextKeys.has(key)) selections[key] = undefined
    })

    filters.value = nextFilters
  }

  const isFilterReady = (
    filter: SearchFilterDefinition,
    currentSelections: SearchFilterSelections = selections,
  ) =>
    !filter.dependsOn?.length || filter.dependsOn.every(dependency => Boolean(currentSelections[dependency.key]))

  const loadStaticOptions = (filter: SearchFilterState) => {
    if (filter.key === 'edu_month') {
      const levelId = selections.base?.id
      filter.options = levelId
        ? SEARCH_MONTHS_BY_LEVEL[Number(levelId)] || ALL_SEARCH_MONTHS
        : ALL_SEARCH_MONTHS
      return filter.options
    }

    filter.options = filter.staticOptions ? [...filter.staticOptions] : []
    return filter.options
  }

  const loadFilterOptions = async (key: SearchFilterKey): Promise<SearchFilterOption[]> => {
    const filter = getFilter(key)
    if (!filter) return []

    if (filter.staticOptions) return loadStaticOptions(filter)
    if (!isFilterReady(filter)) {
      filter.disabled = true
      filter.options = []
      return []
    }

    filter.loading = true
    filter.disabled = false

    try {
      if (key === 'section') {
        if (!boards.value.length) {
          await getBoards()
        }
        filter.options = sortByListOrder(boards.value.map(toSearchOption))
      }

      if (key === 'base' && selections.section) {
        const response = await getGrades(selections.section.code ?? selections.section.id)
        filter.options = sortByListOrder(getResponseDataList<GradeDTO>(response.data).map(toSearchOption))
      }

      if (key === 'lesson' && selections.base) {
        const response = await getSubjects(selections.base.id)
        filter.options = sortByListOrder(getResponseDataList<SubjectDTO>(response.data).map(toSearchOption))
      }

      if (key === 'topic' && selections.lesson) {
        const response = await getTopics(selections.lesson.id)
        filter.options = sortByListOrder(getResponseDataList<TopicDTO>(response.data).map(toSearchOption))
      }

      if (key === 'test_type' && selections.section) {
        const response = await getClassification(selections.section.code ?? selections.section.id)
        const items: SearchFilterOption[] = getResponseDataList<ClassificationDTO>(response.data).map(toSearchOption)
        filter.options = sortByListOrder(
          activeService.value === 'paper'
            ? items.filter(item => item.is_paper === true)
            : items.filter(item => item.is_paper === false),
        )
      }

      if (key === 'exam_type') {
        const response = await getExtraTypeFile('exam_type')
        filter.options = sortByListOrder(
          getResponseDataList<ExtraTypeFilePastPaperCreateDTO>(response.data).map(toSearchOption),
        )
      }

      return filter.options
    }
    finally {
      filter.loading = false
    }
  }

  const resetDependents = (key: SearchFilterKey) => {
    filters.value.forEach((filter) => {
      const dependsOnChangedKey = filter.dependsOn?.some(dependency => dependency.key === key)
      if (!dependsOnChangedKey) return

      filter.selected = null
      filter.options = filter.staticOptions ? [...filter.staticOptions] : []
      filter.disabled = Boolean(filter.disabledUntilReady)
      selections[filter.key] = undefined
      resetDependents(filter.key)
    })

    if (key === 'base') {
      const monthFilter = getFilter('edu_month')
      if (monthFilter) {
        monthFilter.selected = null
        selections.edu_month = undefined
        loadStaticOptions(monthFilter)
      }
    }
  }

  const loadReadyChildren = async (key: SearchFilterKey) => {
    const childFilters = filters.value.filter(filter =>
      filter.dependsOn?.some(dependency => dependency.key === key),
    )

    for (const child of childFilters) {
      if (!isFilterReady(child)) continue
      child.disabled = false
      await loadFilterOptions(child.key)
    }
  }

  const loadReadyFilters = async () => {
    for (const filter of filters.value) {
      if (filter.staticOptions) {
        loadStaticOptions(filter)
        continue
      }

      if (!isFilterReady(filter)) continue
      filter.disabled = false

      if (!filter.options.length) {
        await loadFilterOptions(filter.key)
      }
    }
  }

  const setService = async (service: SearchServiceId) => {
    Object.keys(selections).forEach((key) => {
      if (!BASE_FILTER_KEYS.includes(key as SearchFilterKey)) {
        selections[key as SearchFilterKey] = undefined
      }
    })

    activeService.value = service
    applyFilterDefinitions()
    await updateRouteQuery()

    loadReadyFilters().catch(console.error)
  }

  const selectFilter = async (key: SearchFilterKey, option: SearchFilterOption | null) => {
    if (key === 'type' && option) {
      await setService(option.id as SearchServiceId)
      return
    }

    const filter = getFilter(key)
    if (!filter) return

    filter.selected = option
    if (option) selections[key] = option
    else selections[key] = undefined

    resetDependents(key)
    await updateRouteQuery()
    loadReadyChildren(key).catch(console.error)
  }

  const resetFilters = async () => {
    QUERY_FILTER_KEYS.forEach((key) => {
      selections[key] = undefined
    })
    activeService.value = DEFAULT_SEARCH_SERVICE.id
    applyFilterDefinitions()
    await updateRouteQuery()
    loadFilterOptions('section').catch(console.error)
  }

  const hydrateFiltersFromRoute = async () => {
    activeService.value = normalizeSearchService(route.query.type)

    if (!route.query.type && syncRouteQuery) {
      await router.replace({
        query: {
          ...route.query,
          type: activeService.value,
        },
      })
    }

    applyFilterDefinitions()

    for (const filter of filters.value) {
      await loadFilterOptions(filter.key)

      const selected = findSelectedOptionFromQuery(filter)
      if (!selected) continue

      filter.selected = selected
      filter.disabled = false
      selections[filter.key] = selected
    }
  }

  applyFilterDefinitions()

  onMounted(async () => {
    await hydrateFiltersFromRoute()
  })

  watch(activeService, (service) => {
    const typeFilter = getFilter('type')
    if (!typeFilter) return

    const selectedService = SEARCH_SERVICE_OPTIONS.find(option => option.id === service)
    if (!selectedService) return

    typeFilter.selected = selectedService
    selections.type = selectedService
  })

  return {
    activeService,
    filters,
    selections,
    setService,
    selectFilter,
    loadFilterOptions,
    resetFilters,
  }
}
