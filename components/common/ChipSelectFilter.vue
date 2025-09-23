<template>
  <v-btn
    append-icon="mdi-chevron-down"
    :class="`text-h5 primary-gray-700 ${
      isShowSelectModal || selectedItem ? `open-style-btn` : ``
    }`"
    variant="outlined"
    rounded="xl"
    value="board"
    :disabled="disabled"
    :loading="loading"
    @click="isShowSelectModal = !isShowSelectModal"
  >
    {{ selectedItem ? selectedItem.title : title }}
  </v-btn>

  <search-select-dialog
    v-model:show-dialog="isShowSelectModal"
    :title-modal="title"
    :items="items"
    :selected-item="selectedItem"
    :has-search="hasSearch"
    @change-selected-item="onFilterUpdate"
  />
</template>

<script setup>
import { ref } from 'vue'

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
})

const emit = defineEmits(['UpdateSelectedItem'])

const items = ref([...props.staticList])
const isShowSelectModal = ref(false)
const loading = ref(false)

const onFilterUpdate = (itemSelected) => {
  isShowSelectModal.value = false
  emit('UpdateSelectedItem', itemSelected)
}

const getItems = async (extraIdParam = '') => {
  try {
    loading.value = true
    if (props.api) {
      items.value = []
      const url
        = extraIdParam.toString().length > 0
          ? props.api + '/' + extraIdParam
          : props.api

      const response = await useApiService.get(url, {
        'PagingDto.PageFilter.Skip': props.pageFilterSkip,
        'PagingDto.PageFilter.Size': props.pageFilterSize,
        'PagingDto.PageFilter.ReturnTotalRecordsCount':
          props.returnTotalRecordsCount,
        ...props.extraApiParams,
      })
      if (response.succeeded || response.status == 1) {
        const list = response.data.list || response.data
        if (props.title == 'School') {
          items.value = list.map(s => ({
            title: s.name,
            id: s.id,
          }))
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
    loading.value = false
  }
}

const getItemById = async (id) => {
  if (!items.value.length) {
    await getItems()
  }
  return items.value.find(x => x.id == id) || null
}

defineExpose({
  getItems,
  getItemById,
})
</script>

<style>
.open-style-btn {
  background-color: #fff8e8;
  border: 1px solid #ffebb9;
}
</style>
