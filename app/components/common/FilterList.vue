<template>
  <div class="w-100 d-flex justify-center flex-wrap">
    <v-col
      :cols="hasKeywordSearch ? `4` : `12`"
      md="12"
      class="d-flex d-md-none justify-start"
    >
      <v-badge
        class="mt-1 height-badge"
        offset-x="5"
        offset-y="-5"
        :color="countFilterSelect == 0 ? `transparent` : `lightError`"
        :content="countFilterSelect == 0 ? `` : countFilterSelect"
      >
        <v-btn
          rounded="xl"
          variant="outlined"
          color="grey300"
          density="comfortable"
          @click="dialogFilterMobileModel = !dialogFilterMobileModel"
        >
          <span class="text-grey700 d-flex align-center ga-2 text-h6 font-weight-bold"><v-icon>md:tune</v-icon> Filter</span>
        </v-btn>
      </v-badge>
    </v-col>
    <v-col
      v-if="hasKeywordSearch"
      cols="8"
      md="12"
      class="d-flex justify-end justify-md-center"
    >
      <v-text-field
        v-model="textSearch"
        label="Search anything...."
        variant="outlined"
        color="primary"
        max-width="330"
        density="compact"
        hide-details
        class="custom-search-text-field"
        @update:model-value="changeTextSearch"
      >
        <template #append>
          <v-btn
            icon
            varient="text"
            color="primary"
            width="50"
            class="rounded-ts rounded-te-xl rounded-be-xl rounded-bs h-100 ml-n2"
            flat
          >
            <v-icon
              size="x-large"
              icon="md:search"
              color="grey800"
            />
          </v-btn>
        </template>
      </v-text-field>
    </v-col>

    <div
      class="w-100 d-none d-md-flex justify-center align-center flex-wrap ga-4 mt-2"
    >
      <div class="d-flex flex-wrap w-100 justify-start justify-md-center ga-2">
        <template
          v-for="(filter, index) in filters"
          :key="filter.title || index"
        >
          <CommonChipSelectFilter
            :ref="(el) => (filters[index].refElement = el)"
            :title="filter.title"
            :api="filter.api"
            :selected-item="filter.selectedItem"
            :extra-api-params="filter.extraApiParams"
            :static-list="filter.staticList"
            :disabled="filter.disabled"
            :has-search="filter.hasSearch"
            @update-selected-item="updateSelectedItem($event, index)"
          />
        </template>
      </div>
      <div class="justify-start d-flex w-100 max-width-container">
        <div class="d-flex flex-wrap ga-2 px-2">
          <template v-for="(filter, index) in filters">
            <v-chip
              v-if="filter.selectedItem && !filter.defaultValue"
              :key="filter.title"
              variant="flat"
              class="text-h5 pl-5 pr-5"
              color="grey100"
            >
              <span class="text-grey500">{{ filter.selectedItem?.title }}</span>
              <template #close>
                <v-icon
                  v-if="filter.closable"
                  color="grey500"
                  @click="clearFilter(index)"
                >
                  md:cancel
                </v-icon>
              </template>
            </v-chip>
          </template>
        </div>
      </div>
    </div>

    <v-dialog
      v-model="dialogFilterMobileModel"
      transition="dialog-bottom-transition"
      fullscreen
      scrim="#ffffff"
    >
      <div
        class="w-100 h-100 d-flex flex-column justify-space-between overflow-y-auto bg-white position-relative"
      >
        <v-container class="flex-column mb-10">
          <v-col
            cols="12"
            class="d-flex justify-space-between align-center"
          >
            <span class="text-h3 text-grey600">Filter</span>

            <v-icon
              size="x-large"
              color="grey300"
              @click="dialogFilterMobileModel = false"
            >
              md:cancel
            </v-icon>
          </v-col>
          <v-col
            cols="12"
            class="d-flex flex-wrap align-center ga-4"
          >
            <template v-for="(filter, index) in filters">
              <v-chip
                v-if="filter.selectedItem && !filter.defaultValue"
                :key="filter.title"
                variant="flat"
                class="text-h5 pl-5 pr-5"
                color="grey100"
              >
                <span class="text-grey500">{{ filter.selectedItem?.title }}</span>
                <template #close>
                  <v-icon
                    v-if="filter.closable"
                    color="grey500"
                    @click="clearFilter(index)"
                  >
                    md:cancel
                  </v-icon>
                </template>
              </v-chip>
            </template>
          </v-col>
          <v-col
            cols="12"
            class="d-flex flex-column justify-start align-center mt-4"
          >
            <div
              v-for="(filter, index) in filters"
              :key="index"
              :class="`w-100 d-flex justify-space-between align-center flex-wrap pt-2 pb-2 ${
                filter.disabled ? `opacity-20 cursor-not-allowed` : ``
              }`"
              @click="openFilterSelectModal(filter)"
            >
              <v-badge
                :color="filter.selectedItem ? `lightError` : `#ffffff`"
                dot
                floating
              >
                <span class="text-h4 text-grey500 font-weight-bold">{{ filter.title }} </span>
              </v-badge>
              <div class="d-flex align-center ga-1">
                <v-chip
                  v-if="filter.selectedItem"
                  variant="flat"
                  class="text-h5 font-weight-bold pl-5 pr-5"
                  color="grey100"
                >
                  <span class="text-grey500">{{ filter.selectedItem?.title }}</span>
                </v-chip>

                <v-icon
                  color="grey500"
                  size="34"
                >
                  md:keyboard_arrow_down
                </v-icon>
              </div>

              <v-divider
                :thickness="2"
                class="border-opacity-100 mt-4 mb-4"
                color="grey100"
              />
            </div>
          </v-col>
        </v-container>
        <div
          class="w-100 d-flex align-center justify-center ga-3 pb-2 box-button position-fixed bottom-0 bg-white"
        >
          <v-btn
            variant="text"
            class="text-h5 text-grey700"
            @click="clearAllFilter"
          >
            Clear All
          </v-btn>
          <v-btn
            color="primary"
            rounded="xl"
            height="40"
            width="200"
            class="text-h5 text-grey800"
            :loading="loading"
            @click="dialogFilterMobileModel = false"
          >
            Show {{ $numberFormat(countDataFound) }} Results
          </v-btn>
        </div>
      </div>
    </v-dialog>
    <v-col
      cols="12"
      class="d-flex align-end justify-end ga-2 mt-1 py-0 px-2 max-width-container"
    >
      <span class="text-h5 text-grey400">Result</span>
      <v-skeleton-loader
        v-if="loading"
        width="100"
        height="20"
        class="rounded-lg"
      />
      <span
        v-else
        class="text-h4 text-grey700 font-weight-bold"
      >{{
        $numberFormat(countDataFound)
      }}</span>
    </v-col>

    <slot />
  </div>
</template>

<script setup>
const router = useRouter()
const route = useRoute()

const props = defineProps({
  filterList: {
    type: Array,
    default: () => [],
  },
  countDataFound: {
    type: [Number, String],
    default: () => 0,
  },
  hasKeywordSearch: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['changeFilter'])

const filters = ref([...props.filterList])
const dialogFilterMobileModel = ref(false)
const countFilterSelect = ref(Object.keys(route.query).length)
const textSearch = ref(route.query.title ? route.query.title : '')
const timer = ref(null)

onMounted(async () => {
  await fetchDataRequireFilter()
  await fetchFilterAvailableInQuery()
})

const updateSelectedItem = (itemSelected, index) => {
  filters.value[index].selectedItem = itemSelected

  resetDescendants(index)

  enableReadyChildren(index)

  updateQueryFromFilters()
}

const resetDescendants = (indexFilter) => {
  const filterParent = filters.value[indexFilter]

  if (filterParent.childrenForGetStaticData) {
    for (const childIndex of filterParent.childrenForGetStaticData) {
      const child = filters.value[childIndex]
      const readyForGetStatic
        = child.dependenciesForGetStaticData?.includes(indexFilter)

      if (readyForGetStatic) {
        if (child.getStaticList) {
          const staticList = child.getStaticList('reset')
          child.refElement.setStaticItem(staticList)
          child.selectedItem = null
        }
      }
    }
  }

  if (!filterParent.children || filterParent.children.length == 0) return

  for (const childIndex of filterParent.children) {
    const child = filters.value[childIndex]

    child.selectedItem = null
    child.disabled = true
    resetDescendants(childIndex)
  }
}

const enableReadyChildren = async (indexFilter) => {
  const filterParent = filters.value[indexFilter]

  if (filterParent.childrenForGetStaticData) {
    for (const childIndex of filterParent.childrenForGetStaticData) {
      const child = filters.value[childIndex]
      const readyForGetStatic
        = child.dependenciesForGetStaticData?.includes(indexFilter)

      if (readyForGetStatic) {
        if (
          child.getStaticList
          && filterParent.selectedItem
          && filterParent.selectedItem.id
        ) {
          const staticList = child.getStaticList(filterParent.selectedItem.id)
          child.refElement.setStaticItem(staticList)
        }
      }
    }
  }

  if (!filterParent.children || filterParent.children.length == 0) return

  for (const childIndex of filterParent.children) {
    const child = filters.value[childIndex]

    const ready = child.dependencies.every(
      dep => !!filters.value[dep.parent].selectedItem,
    )

    if (ready) {
      const disableValue = child.dependencies.some(dep =>
        dep.disableIds?.includes(filters.value[dep.parent].selectedItem.id),
      )

      if (disableValue) {
        child.disabled = true
        continue
      }

      if (
        child.queryMap
        && child.parentIndexChangeQueryKey
        && filters.value[child.parentIndexChangeQueryKey].selectedItem
      ) {
        const id
          = filters.value[child.parentIndexChangeQueryKey].selectedItem.id
        child.queryKey = child.queryMap[id] ?? child.queryKey
      }

      child.disabled = false
      if (child.api && !child.staticList?.length) {
        if (!child.idInParams) {
          child.dependencies.forEach((dep) => {
            const parentNode = filters.value[dep.parent]
            child.extraApiParams[dep.targetKey]
              = parentNode.selectedItem?.[dep.sourceKey] ?? null
          })
        }
        await child.refElement?.getItems(
          child.idInParams ? filterParent.selectedItem.id : '',
        )
      }

      enableReadyChildren(childIndex)
    }
  }
}

const clearFilter = (index) => {
  filters.value[index].selectedItem = null
  resetDescendants(index)

  updateQueryFromFilters()
}

const updateQueryFromFilters = async () => {
  const query = {}
  const titles = {}

  filters.value.forEach((f) => {
    if (f.queryKey && f.selectedItem?.id) {
      query[f.queryKey] = f.selectedItem.id
      titles[f.queryKey] = f.selectedItem.title
    }
  })

  countFilterSelect.value = Object.keys(query).length
  router.replace({ query })
  emits('changeFilter', query, titles)
}

const fetchDataRequireFilter = async () => {
  for (let i = 0; i < filters.value.length; i++) {
    const filter = filters.value[i]
    if (!filter.dependencies?.length) {
      if (filter.api && !filter.staticList?.length) {
        await filter.refElement.getItems()
      }
    }
    if (filter.getStaticList) {
      const staticList = filter.getStaticList()
      filter.refElement.setStaticItem(staticList)
    }
  }
}

const fetchFilterAvailableInQuery = async () => {
  for (let index = 0; index < filters.value.length; index++) {
    const filter = filters.value[index]
    const qVal = route.query[filter.queryKey]

    if (filter.defaultValue && !qVal) {
      filters.value[index].selectedItem = filter.defaultValue
      await enableReadyChildren(index)

      const query = { ...route.query }
      query[filter.queryKey] = filter.defaultValue.id
      router.replace({ query })
    }
    if (!qVal) continue

    const ready = filter.dependencies?.every(
      dep => filters.value[dep.parent].selectedItem,
    )

    if (!ready && filter.dependencies?.length) continue

    if (filter.staticList?.length) {
      const selected = filter.staticList.find(
        x => String(x.id) === String(qVal),
      )
      filters.value[index].selectedItem = selected
      await enableReadyChildren(index)
    }
    else {
      const selected = await filter.refElement?.getItemById(qVal)
      if (selected) {
        filters.value[index].selectedItem = selected
        await enableReadyChildren(index)
      }
    }
  }
}

const openFilterSelectModal = (filter) => {
  filter.refElement.openSelectModal()
}

const changeTextSearch = () => {
  if (props.hasKeywordSearch) {
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
}

const debouncedSearchText = () => {
  if (timer.value) {
    clearTimeout(timer.value)
    timer.value = null
  }
  timer.value = setTimeout(() => {
    emits('changeFilter', route.query)
  }, 800)
}

const clearAllFilter = async () => {
  for (let i = 0; i < filters.value.length; i++) {
    const filter = filters.value[i]
    if (
      !filter.dependencies?.length
      && filter.selectedItem
      && !filter.defaultValue
    ) {
      filter.selectedItem = null
      resetDescendants(i)
    }
  }
  updateQueryFromFilters()
}
</script>

<style scoped>
:deep(.height-badge .v-badge__wrapper .v-badge__badge) {
  height: 20px !important;
}

:deep(.custom-search-text-field .v-field__outline__start) {
  border-radius: 24px 0 0 24px !important;
  flex: 0 0 30px !important;
}
:deep(.custom-search-text-field .v-field__outline__end) {
  border-radius: 0 4px 4px 0 !important;
}
.max-width-container {
  max-width: 1200px;
}
</style>
