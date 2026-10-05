import type {
  FilterConfiguration,
  FilterControlHandle,
  FilterControllerOptions,
  FilterId,
  FilterItem,
  FilterState,
  FilterTitles,
  SearchQuery,
} from '@/types/search'

export const useFilterController = ({
  filterList,
  hasKeywordSearch,
  hasServicesNavigation,
  onChangeFilter,
}: FilterControllerOptions) => {
  const route = useRoute()
  const router = useRouter()

  const hasFilterValue = <T>(value: T): value is Exclude<T, undefined | null | ''> =>
    value !== undefined && value !== null && value !== ''

  const getActiveFilterCount = (query: SearchQuery) => filters.value.filter(filter =>
    filter.queryKey
    && hasFilterValue(query[filter.queryKey])
    && !(hasServicesNavigation.value && filter.queryKey === 'type'),
  ).length

  const createFilterState = (filter: FilterConfiguration): FilterState => ({
    ...filter,
    dependencies: filter.dependencies ?? [],
    extraApiParams: filter.extraApiParams ?? {},
  })

  const filters = ref(filterList.value.map(createFilterState))
  const countFilterSelect = ref(getActiveFilterCount(route.query))
  const textSearch = ref(route.query.title ? route.query.title : '')
  const filterDataLoads = new WeakMap<FilterState, { key: string, promise: Promise<void> }>()
  const timer = ref<ReturnType<typeof setTimeout> | null>(null)
  let pendingServiceChange = false
  let filterListSyncVersion = 0

  const setFilterRef = (filter: FilterState, element: FilterControlHandle | null) => {
    filter.refElement = element
  }

  const isCurrentFilterSync = (syncVersion?: number) =>
    syncVersion === undefined || syncVersion === filterListSyncVersion

  const resetDescendants = (indexFilter: number) => {
    const filterParent = filters.value[indexFilter]
    if (!filterParent) return

    if (filterParent.childrenForGetStaticData) {
      for (const childIndex of filterParent.childrenForGetStaticData) {
        const child = filters.value[childIndex]
        if (!child) continue
        const readyForGetStatic
          = child.dependenciesForGetStaticData?.includes(indexFilter)

        if (readyForGetStatic && child.getStaticList) {
          const staticList = child.getStaticList('reset')
          child.refElement?.setStaticItem(staticList)
          child.selectedItem = null
        }
      }
    }

    if (!filterParent.children || filterParent.children.length == 0) return

    for (const childIndex of filterParent.children) {
      const child = filters.value[childIndex]
      if (!child) continue

      child.selectedItem = null
      child.disabled = true
      resetDescendants(childIndex)
    }
  }

  const getFilterDataLoadKey = (filter: FilterState, parentId: FilterId = '') => JSON.stringify({
    api: filter.api,
    parentId: filter.idInParams ? parentId : '',
    params: filter.extraApiParams || {},
  })

  const loadFilterItems = async (filter: FilterState, parentId: FilterId = '') => {
    if (!filter.api || filter.staticList?.length || !filter.refElement) return

    const loadKey = getFilterDataLoadKey(filter, parentId)
    const existingLoad = filterDataLoads.get(filter)
    if (existingLoad?.key === loadKey) {
      await existingLoad.promise
      return
    }

    const loadPromise = filter.refElement.getItems(filter.idInParams ? parentId : '')
    filterDataLoads.set(filter, { key: loadKey, promise: loadPromise })

    try {
      await loadPromise
    }
    catch (error) {
      if (filterDataLoads.get(filter)?.promise === loadPromise)
        filterDataLoads.delete(filter)
      throw error
    }
  }

  const enableReadyChildren = async (indexFilter: number, syncVersion?: number) => {
    const filterParent = filters.value[indexFilter]
    if (!filterParent) return

    if (filterParent.childrenForGetStaticData) {
      for (const childIndex of filterParent.childrenForGetStaticData) {
        const child = filters.value[childIndex]
        if (!child) continue
        const readyForGetStatic
          = child.dependenciesForGetStaticData?.includes(indexFilter)

        if (
          readyForGetStatic
          && child.getStaticList
          && filterParent.selectedItem
          && hasFilterValue(filterParent.selectedItem.id)
        ) {
          const staticList = child.getStaticList(filterParent.selectedItem.id)
          child.refElement?.setStaticItem(staticList)
        }
      }
    }

    if (!filterParent.children || filterParent.children.length == 0) return

    for (const childIndex of filterParent.children) {
      const child = filters.value[childIndex]
      if (!child) continue

      const ready = child.dependencies.every(
        dep => !!filters.value[dep.parent]?.selectedItem,
      )

      if (ready) {
        const disableValue = child.dependencies.some((dep) => {
          const selectedItem = filters.value[dep.parent]?.selectedItem
          return selectedItem && dep.disableIds?.includes(selectedItem.id)
        })

        if (disableValue) {
          child.disabled = true
          continue
        }

        child.disabled = false
        if (child.api && !child.staticList?.length) {
          if (!child.idInParams) {
            child.dependencies.forEach((dep) => {
              const parentNode = filters.value[dep.parent]
              child.extraApiParams[dep.targetKey]
                = parentNode?.selectedItem?.[dep.sourceKey] ?? null
            })
          }
          await loadFilterItems(child, filterParent.selectedItem?.id)
          if (!isCurrentFilterSync(syncVersion)) return
        }

        await enableReadyChildren(childIndex, syncVersion)
        if (!isCurrentFilterSync(syncVersion)) return
      }
    }
  }

  const updateQueryFromFilters = async () => {
    const query: SearchQuery = { ...route.query }
    const filterQuery: SearchQuery = {}
    const titles: FilterTitles = {}

    filters.value.forEach((filter) => {
      if (filter.queryKey) Reflect.deleteProperty(query, filter.queryKey)

      const selectedItem = filter.selectedItem
      if (!selectedItem || !filter.queryKey) return

      if (hasFilterValue(selectedItem.code)) {
        filterQuery[filter.queryKey] = selectedItem.code
        titles[filter.queryKey] = selectedItem.title
      }
      else if (hasFilterValue(selectedItem.id)) {
        filterQuery[filter.queryKey] = selectedItem.id
        titles[filter.queryKey] = selectedItem.title
      }
    })

    delete query.page
    Object.assign(query, filterQuery)

    countFilterSelect.value = getActiveFilterCount(filterQuery)
    router.replace({ query })
    onChangeFilter(query, titles, { serviceChange: pendingServiceChange })
  }

  const updateSelectedItem = async (itemSelected: FilterItem | null, index: number) => {
    const filter = filters.value[index]
    if (!filter) return
    filter.selectedItem = itemSelected

    resetDescendants(index)
    await enableReadyChildren(index)
    updateQueryFromFilters()
  }

  const selectService = (serviceId: FilterId) => {
    const index = filters.value.findIndex(filter => filter.queryKey === 'type')
    const filter = filters.value[index]
    const service = filter?.staticList?.find(item => item.id === serviceId)
    if (!filter || !service || filter.selectedItem?.id === serviceId) return

    pendingServiceChange = true
    filter.selectedItem = service
    resetDescendants(index)

    try {
      return updateQueryFromFilters()
    }
    finally {
      pendingServiceChange = false
    }
  }

  const clearFilter = (index: number) => {
    const filter = filters.value[index]
    if (!filter) return
    filter.selectedItem = null

    resetDescendants(index)
    updateQueryFromFilters()
  }

  const fetchDataRequireFilter = async (syncVersion?: number) => {
    for (const filter of filters.value) {
      if (!isCurrentFilterSync(syncVersion)) return

      if (!filter.dependencies?.length) {
        if (filter.api && !filter.staticList?.length) {
          await loadFilterItems(filter)
          if (!isCurrentFilterSync(syncVersion)) return
        }
      }
      if (filter.getStaticList) {
        const staticList = filter.getStaticList()
        filter.refElement?.setStaticItem(staticList)
      }
    }
  }

  const fetchFilterAvailableInQuery = async (syncVersion?: number) => {
    for (const [index, filter] of filters.value.entries()) {
      if (!isCurrentFilterSync(syncVersion)) return

      const queryValue = route.query[filter.queryKey]
      const filterKey = filter.queryKey == 'section' ? 'code' : 'id'

      if (!hasFilterValue(queryValue)) {
        if (filter.defaultValue) {
          filter.selectedItem = filter.defaultValue
          await enableReadyChildren(index, syncVersion)
          if (!isCurrentFilterSync(syncVersion)) return

          const query: SearchQuery = { ...route.query }
          query[filter.queryKey] = filter.defaultValue.id
          router.replace({ query })
        }
        else {
          filter.selectedItem = null
        }
        continue
      }

      const ready = filter.dependencies?.every(
        dependency => filters.value[dependency.parent]?.selectedItem,
      )

      if (!ready && filter.dependencies?.length) {
        filter.selectedItem = null
        continue
      }

      if (filter.staticList?.length) {
        const selected = filter.staticList.find(
          item => String(item[filterKey]) === String(queryValue),
        )
        filter.selectedItem = selected || null
        if (!selected) continue
        await enableReadyChildren(index, syncVersion)
        if (!isCurrentFilterSync(syncVersion)) return
      }
      else {
        const selected = await filter.refElement?.getItemById(queryValue, filterKey)
        filter.selectedItem = selected || null
        if (!selected) continue
        await enableReadyChildren(index, syncVersion)
        if (!isCurrentFilterSync(syncVersion)) return
      }
    }
  }

  const syncFiltersFromQuery = async () => {
    const syncVersion = ++filterListSyncVersion

    await nextTick()
    if (!isCurrentFilterSync(syncVersion)) return

    await fetchDataRequireFilter(syncVersion)
    if (!isCurrentFilterSync(syncVersion)) return

    await fetchFilterAvailableInQuery(syncVersion)
  }

  const getFilterIdentity = (filter: FilterConfiguration) => `${filter.queryKey ?? ''}:${filter.title ?? ''}`

  const reconcileFilterConfiguration = (filterConfiguration: FilterConfiguration[]) => {
    const existingFilters = new Map(
      filters.value.map(filter => [getFilterIdentity(filter), filter]),
    )

    return filterConfiguration.map((filterConfig) => {
      const existingFilter = existingFilters.get(getFilterIdentity(filterConfig))
      if (!existingFilter) return createFilterState(filterConfig)

      const runtimeState = {
        selectedItem: existingFilter.selectedItem,
        disabled: existingFilter.disabled,
        refElement: existingFilter.refElement,
      }

      Object.assign(existingFilter, filterConfig, runtimeState, {
        dependencies: filterConfig.dependencies ?? [],
        extraApiParams: filterConfig.extraApiParams ?? {},
      })

      return existingFilter
    })
  }

  const debouncedSearchText = () => {
    if (timer.value) {
      clearTimeout(timer.value)
      timer.value = null
    }
    timer.value = setTimeout(() => {
      onChangeFilter(route.query)
    }, 800)
  }

  const changeTextSearch = () => {
    if (!hasKeywordSearch.value) return

    const query = { ...route.query }
    if (textSearch.value.length == 0) {
      delete query.title
    }
    else {
      query.title = textSearch.value
    }
    router.replace({ query })
    debouncedSearchText()
  }

  const clearAllFilter = async () => {
    for (const [index, filter] of filters.value.entries()) {
      if (filter.selectedItem && !filter.defaultValue) {
        filter.selectedItem = null
        resetDescendants(index)
      }
    }
    updateQueryFromFilters()
  }

  watch(
    filterList,
    async (filterConfiguration) => {
      filters.value = reconcileFilterConfiguration(filterConfiguration)
      await syncFiltersFromQuery()
    },
    { flush: 'post' },
  )

  watch(
    () => route.query,
    () => syncFiltersFromQuery(),
    { deep: true },
  )

  // A pending keyword search must not fire after the page using it is gone.
  onScopeDispose(() => {
    if (timer.value) clearTimeout(timer.value)
  })

  return {
    changeTextSearch,
    clearAllFilter,
    clearFilter,
    countFilterSelect,
    filters,
    getFilterIdentity,
    selectService,
    setFilterRef,
    syncFiltersFromQuery,
    textSearch,
    updateSelectedItem,
  }
}
