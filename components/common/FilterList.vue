<template>
  <div class="w-100 d-flex justify-center flex-wrap">
    <v-col
      cols="12"
      class="d-flex d-md-none justify-start"
    >
      <v-badge
        class="mt-1 height-badge"
        offset-x="5"
        offset-y="-5"
        :color="countFilterSelect == 0 ? `transparent` : `#F04438`"
        :content="countFilterSelect == 0 ? `` : countFilterSelect"
      >
        <v-btn
          rounded="xl"
          prepend-icon="mdi-tune-vertical"
          variant="outlined"
          class="primary-gray-700"
          density="comfortable"
          @click="dialogFilterMobileModel = !dialogFilterMobileModel"
        >
          Filter
        </v-btn>
      </v-badge>
    </v-col>

    <div
      class="w-100 d-none d-md-flex justify-center align-center flex-wrap ga-4 mt-2"
    >
      <div class="d-flex w-100 justify-start justify-md-center ga-2">
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
      <div class="justify-space-between d-flex w-100 mt-4">
        <div class="d-flex ga-2">
          <template v-for="(filter, index) in filters">
            <v-chip
              v-if="filter.selectedItem"
              :key="filter.title"
              variant="flat"
              class="text-h5 pl-5 pr-5"
              color="#F2F4F7"
              closable
              @click:close="clearFilter(index)"
            >
              {{ filter.selectedItem?.title }}
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
            <span class="text-h3">Filter</span>

            <v-icon
              size="x-large"
              color="#D0D5DD"
              @click="dialogFilterMobileModel = false"
            >
              mdi-close-circle
            </v-icon>
          </v-col>
          <v-col
            cols="12"
            class="d-flex flex-wrap align-center ga-4"
          >
            <template v-for="(filter, index) in filters">
              <v-chip
                v-if="filter.selectedItem"
                :key="filter.title"
                variant="flat"
                class="text-h5 pl-5 pr-5"
                color="#F2F4F7"
                closable
                @click:close="clearFilter(index)"
              >
                {{ filter.selectedItem?.title }}
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
                :color="filter.selectedItem ? `#F04438` : `#ffffff`"
                dot
                floating
              >
                <span class="text-h4">{{ filter.title }} </span>
              </v-badge>
              <div class="d-flex align-center ga-1">
                <v-chip
                  v-if="filter.selectedItem"
                  variant="flat"
                  class="text-h5 font-weight-bold pl-5 pr-5"
                  color="#F2F4F7"
                >
                  {{ filter.selectedItem.title }}
                </v-chip>

                <v-icon color="#667085">
                  mdi-chevron-down
                </v-icon>
              </div>

              <v-divider
                :thickness="2"
                class="border-opacity-100 mt-4 mb-4"
                color="#F2F4F7"
              />
            </div>
          </v-col>
        </v-container>
        <div
          class="w-100 d-flex align-center justify-center ga-3 box-button position-fixed bottom-0 bg-white"
        >
          <v-btn
            variant="text"
            class="text-h5"
          >
            Clear All
          </v-btn>
          <v-btn
            color="#ffb600"
            rounded="xl"
            height="40"
            width="200"
            class="text-h5"
            @click="dialogFilterMobileModel = false"
          >
            Show {{ $numberFormat(countDataFound) }} Results
          </v-btn>
        </div>
      </div>
    </v-dialog>
    <v-col
      cols="12"
      class="d-flex align-end justify-end ga-2 max-width-container"
    >
      <span class="text-h5 primary-gray-400">Result</span>
      <span class="text-h4 primary-gray-700 font-weight-bold">{{
        $numberFormat(totalDataFind)
      }}</span>
    </v-col>
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
    type: String,
    default: () => '0',
  },
})

const emits = defineEmits(['changeFilter'])

const filters = ref([...props.filterList])

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
  if (!filterParent.children || filterParent.children.length == 0) return

  for (const childIndex of filterParent.children) {
    const child = filters.value[childIndex]

    const ready = child.dependencies.every(
      dep => !!filters.value[dep.parent].selectedItem,
    )

    if (ready) {
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
  const query = { ...route.query }

  filters.value.forEach((f) => {
    if (!f.queryKey) return
    if (f.selectedItem?.id) {
      query[f.queryKey] = f.selectedItem.id
    }
    else {
      //   delete query[f.queryKey]
    }
  })
  router.replace({ query })
  emits('changeFilter')
}

const fetchDataRequireFilter = async () => {
  for (let i = 0; i < filters.value.length; i++) {
    const filter = filters.value[i]
    if (!filter.dependencies?.length) {
      if (filter.api && !filter.staticList?.length) {
        await filter.refElement.getItems()
      }
    }
  }
}

const fetchFilterAvailableInQuery = async () => {
  for (let index = 0; index < filters.value.length; index++) {
    const filter = filters.value[index]
    const qVal = route.query[filter.queryKey]
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

const dialogFilterMobileModel = ref(false)
const countFilterSelect = ref(0)

const openFilterSelectModal = (filter) => {
  filter.refElement.openSelectModal()
}
</script>

<style>
:deep(.height-badge .v-badge__wrapper .v-badge__badge) {
  height: 20px !important;
}
</style>
