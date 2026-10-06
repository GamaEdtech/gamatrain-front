<template>
  <div
    v-if="inlineOptions"
    class="inline-filter-selector w-100 pt-3"
    :class="{ 'opacity-40': disabled }"
  >
    <div class="inline-filter-label text-brandNavy font-weight-semibold ms-9 mb-2">
      {{ title }}
    </div>
    <CommonFilterOptionChips
      class="inline-filter-options pa-0 ms-9 mb-3"
      :items="items"
      :selected-item="selectedItem"
      :allow-clear="inlineAllowClear"
      :items-per-row="inlineItemsPerRow"
      :disabled="disabled"
      :item-title="itemTitle"
      compact
      @select="onFilterUpdate"
    />
    <v-divider
      v-if="inlineDividerAfter"
      class="inline-filter-divider mx-n4"
      color="surfaceTertiary"
      :opacity="1"
    />
  </div>
  <!-- Filter panel row (search sidebar and mobile filter sheet) -->
  <v-list-item
    v-else-if="boxed"
    class="search-filter-control text-brandNavy border-b border-surfaceTertiary border-opacity-100"
    :class="{
      'search-filter-selected bg-borderSubtle': selectedItem,
      'search-filter-empty': !selectedItem,
    }"
    min-height="56"
    prepend-gap="8"
    rounded="0"
    :disabled="disabled"
    @click="isShowSelectModal = !isShowSelectModal"
  >
    <template #prepend>
      <!-- Rendered even without an icon so every row's text lines up -->
      <v-avatar
        size="28"
        rounded="0"
        variant="text"
        :class="{ 'pa-1': controlIconPadded }"
      >
        <CommonFilterControlIcon
          v-if="showItemIcon || controlIcon"
          :selected-item="selectedItem"
          :show-item-icon="showItemIcon"
          :icon-src="iconSrc"
          :fallback-icon="fallbackIcon"
          :fallback-icon-padding="fallbackIconPadding"
          :control-icon="controlIcon"
          :icon-size="controlIconPadded ? 20 : null"
        />
      </v-avatar>
    </template>

    <v-list-item-title
      class="search-filter-label"
      :class="selectedItem ? 'font-weight-medium' : 'font-weight-semibold'"
    >
      {{ title }}
    </v-list-item-title>
    <v-list-item-subtitle
      v-if="selectedItem"
      class="search-filter-value d-block font-weight-bold opacity-100 text-truncate"
      :title="selectedItem.title"
    >
      {{ selectedItem.title }}
    </v-list-item-subtitle>

    <template #append>
      <v-progress-circular
        v-if="loading"
        indeterminate
        size="16"
        width="2"
        class="mr-2"
      />
      <v-btn
        v-if="showClear && selectedItem"
        class="search-filter-clear-icon mr-1"
        icon
        variant="text"
        density="comfortable"
        size="small"
        color="grey500"
        :aria-label="`Clear ${title}`"
        @click.stop="emit('clear')"
      >
        <v-icon size="18">
          md:cancel
        </v-icon>
      </v-btn>
      <v-icon :color="selectedItem ? 'brandNavy' : 'grey500'">
        md:keyboard_arrow_down
      </v-icon>
    </template>
  </v-list-item>

  <!-- Compact pill (filter bars such as the leader board) -->
  <v-chip
    v-else
    class="text-h5"
    :variant="selectedItem ? 'flat' : 'outlined'"
    :color="selectedItem ? 'borderSubtle' : isShowSelectModal ? 'brandNavy' : 'grey200'"
    size="large"
    :disabled="disabled"
    @click="isShowSelectModal = !isShowSelectModal"
  >
    <v-progress-circular
      v-if="loading"
      indeterminate
      size="16"
      width="2"
      class="mr-2"
    />
    <span :class="selectedItem ? 'text-brandNavy' : 'text-grey700'">
      {{ selectedItem ? selectedItem.title : title }}
    </span>
    <template #append>
      <v-icon
        class="ml-1"
        :color="selectedItem ? 'brandNavy' : 'grey500'"
      >
        md:keyboard_arrow_down
      </v-icon>
    </template>
  </v-chip>

  <search-select-dialog
    v-model:show-dialog="isShowSelectModal"
    :title-modal="title"
    :items="items"
    :selected-item="selectedItem"
    :has-search="hasSearch && !inlineOptions"
    :compact-result-count="boxed"
    :show-item-icon="showItemIcon"
    :icon-src="iconSrc"
    :fallback-icon="fallbackIcon"
    :inline-options="inlineOptions"
    :inline-allow-clear="inlineAllowClear"
    :inline-items-per-row="inlineItemsPerRow"
    :item-title="itemTitle"
    @change-selected-item="onFilterUpdate"
  />
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  hasSearch: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  api: {
    type: [String, null],
    required: true,
  },
  pageFilterSkip: {
    type: Number,
    default: 0,
  },
  pageFilterSize: {
    type: Number,
    default: 1000,
  },
  returnTotalRecordsCount: {
    type: Boolean,
    default: true,
  },
  extraApiParams: {
    type: Object,
    default: () => {},
  },
  selectedItem: {
    type: Object,
    default: () => {},
  },
  staticList: {
    type: Array,
    default: () => [],
  },
  itemFilter: {
    type: Function,
    default: null,
  },
  itemTransform: {
    type: Function,
    default: null,
  },
  itemSort: {
    type: Function,
    default: null,
  },
  listTransform: {
    type: Function,
    default: null,
  },
  showItemIcon: {
    type: Boolean,
    default: false,
  },
  iconSrc: {
    type: Function,
    default: null,
  },
  fallbackIcon: {
    type: String,
    default: 'md:school',
  },
  fallbackIconPadding: {
    type: Number,
    default: 0,
  },
  boxed: {
    type: Boolean,
    default: false,
  },
  showClear: {
    type: Boolean,
    default: false,
  },
  controlIcon: {
    type: String,
    default: '',
  },
  controlIconPadded: {
    type: Boolean,
    default: false,
  },
  inlineOptions: {
    type: Boolean,
    default: false,
  },
  inlineAllowClear: {
    type: Boolean,
    default: false,
  },
  inlineItemsPerRow: {
    type: Number,
    default: 3,
  },
  inlineDividerAfter: {
    type: Boolean,
    default: false,
  },
  itemTitle: {
    type: Function,
    default: null,
  },
})

const emit = defineEmits(['UpdateSelectedItem', 'clear'])

const items = ref([...props.staticList])
const isShowSelectModal = ref(false)
const loading = ref(false)

const onFilterUpdate = (itemSelected) => {
  isShowSelectModal.value = false
  emit('UpdateSelectedItem', itemSelected)
}

// Only the latest request may update the list, so a slow response for a
// previously selected parent cannot overwrite the current options.
let itemsRequestId = 0

const getItems = async (extraIdParam = '') => {
  const requestId = ++itemsRequestId
  try {
    loading.value = true
    if (props.api) {
      items.value = []
      const url
        = extraIdParam.toString().length > 0
          ? props.api + '/' + extraIdParam
          : props.api
      const params = {
        ...props.extraApiParams,
      }
      if (props.title == 'School' || props.title == 'Country' || props.title == 'State' || props.title == 'City') {
        params['PagingDto.PageFilter.Skip'] = props.pageFilterSkip
        params['PagingDto.PageFilter.Size'] = props.pageFilterSize
        params['PagingDto.PageFilter.ReturnTotalRecordsCount'] = props.returnTotalRecordsCount
      }

      const response = await useApiService.get(url, params, { public: true })
      if (requestId !== itemsRequestId) return

      if (response.succeeded || response.status == 1) {
        const responseList = response.data.list || response.data
        let transformedList = props.itemTransform
          ? responseList.map(props.itemTransform)
          : responseList
        if (props.listTransform) {
          transformedList = await props.listTransform(transformedList)
          if (requestId !== itemsRequestId) return
        }
        const filteredList = props.itemFilter
          ? transformedList.filter(props.itemFilter)
          : transformedList
        const list = props.itemSort
          ? [...filteredList].sort(props.itemSort)
          : filteredList
        if (props.title == 'School') {
          if (list && list.length > 0) {
            items.value = list.map(s => ({
              title: s.name,
              id: s.id,
            }))
          }
        }
        else {
          items.value = list
        }
      }
    }
  }
  catch (error) {
    console.log('error', error)
  }
  finally {
    if (requestId === itemsRequestId) loading.value = false
  }
}

const getItemById = (id, filterKey) => {
  if (id === undefined || id === null || id === '') return null

  const searchField = filterKey === 'code' ? 'code' : 'id'

  return items.value.find(item =>
    String(item[searchField]) === String(id),
  ) || null
}

const openSelectModal = () => {
  isShowSelectModal.value = true
}

const openInlineOptionsModal = () => {
  isShowSelectModal.value = true
}

const setStaticItem = (staticItem) => {
  items.value = staticItem
}

const getCurrentItems = () => items.value

defineExpose({
  getItems,
  getItemById,
  getCurrentItems,
  openInlineOptionsModal,
  openSelectModal,
  setStaticItem,
})
</script>

<style scoped>
/* px sizes: the app's 10px root font size makes Vuetify's rem-based list typography too small */
/* Line-heights too: Vuetify's are rem-based (1rem = 10px here), which collapses long values */
.search-filter-label {
  font-size: 12px;
  line-height: 16px;
}

.search-filter-empty .search-filter-label {
  font-size: 16px;
  line-height: 24px;
}

.search-filter-value {
  font-size: 14px;
  line-height: 20px;
}

.inline-filter-label {
  font-size: 16px;
  line-height: 24px;
}
</style>
