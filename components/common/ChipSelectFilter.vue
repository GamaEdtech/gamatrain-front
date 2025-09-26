<template>
  <v-btn
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
    <template #append>
      <v-icon class="primary-gray-700 mt-1">
        md:keyboard_arrow_down
      </v-icon>
    </template>
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
import cieIcon from '~/assets/images/boards/CIE.svg'
import edexcelIcon from '~/assets/images/boards/Edexcel.svg'
import AQAIcon from '~/assets/images/boards/AQA.svg'
import OCRIcon from '~/assets/images/boards/OCR.svg'
import GamaIcon from '~/assets/images/boards/Gama.svg'
import ScientificIcon from '~/assets/images/boards/Scientific Competition.svg'

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
const boardImgs = [
  cieIcon,
  edexcelIcon,
  AQAIcon,
  OCRIcon,
  GamaIcon,
  ScientificIcon,
]

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
          if (list && list.length > 0) {
            items.value = list.map(s => ({
              title: s.name,
              id: s.id,
            }))
          }
        }
        else if (props.title == 'Board') {
          items.value = list.map((item, index) => ({
            ...item,
            img: boardImgs[index % boardImgs.length],
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
  if (!id) return

  const item = items.value.find(x => x.id.toString() == id.toString())

  if (item) return item
}

const openSelectModal = () => {
  isShowSelectModal.value = true
}

defineExpose({
  getItems,
  getItemById,
  openSelectModal,
})
</script>

<style>
.open-style-btn {
  background-color: #fff8e8;
  border: 1px solid #ffebb9;
}
</style>
