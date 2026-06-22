<template>
  <div class="w-100 d-flex flex-column align-start justify-start ga-1">
    <div
      v-if="!defalutLable"
      class="text-h6 text-grey700 ml-2"
    >
      {{ label }}
    </div>
    <v-text-field
      v-model="inputText"
      :rounded="rounded"
      readonly
      variant="outlined"
      hide-details
      append-inner-icon="md:keyboard_arrow_down"
      :dense="dense"
      :disabled="disabled"
      :clearable="clearable"
      class="w-100 text-grey700"
      :base-color="baseColor"
      :color="color"
      :density="density"
      :rules="rules"
      @click="getList"
      @click:clear="clearValue"
    >
      <template
        v-if="defalutLable"
        #label
      >
        <span class="text-grey700 font-weight-medium text-h6">{{
          label
        }}</span>
      </template>
      <template #prepend-inner>
        <v-progress-circular
          v-if="loadingValue || dataLoading"
          indeterminate
          size="20"
          color="primary"
          class="mr-2"
        />
      </template>
    </v-text-field>
    <common-modal-base
      v-model:show-dialog="sheet"
      :title="titleModal ? titleModal : label"
    >
      <common-modal-select
        :title="titleModal ? titleModal : label"
        :items="items"
        :loading-items="dataLoading"
        :loading-value="loadingValue"
        :infinite-loading="infiniteLoading"
        :loading-more="loadingMore"
        :has-more-items="hasMoreItems"
        :selected-item="selectedItem"
        :has-search="hasSearch"
        @change-selected-item="setValue"
        @load-more="emit('loadMore')"
      />
    </common-modal-base>
  </div>
</template>

<script setup lang="ts">
interface IItemGomboBox {
  [key: string]: string | number | undefined
  id: string | number
  title: string
  icon?: string
  contentIcon?: string
  color?: string
}

type Density = 'default' | 'comfortable' | 'compact'
type ValidationRule = (value: string) => boolean | string

interface IGomboBox {
  label?: string
  items?: IItemGomboBox[]
  modelValue?: string | number
  itemTitle?: string
  itemValue?: string
  disabled?: boolean
  dataLoading?: boolean
  baseColor?: string
  color?: string
  density?: Density
  rounded?: string
  defalutLable?: boolean
  rules?: ValidationRule[]
  loadingValue?: boolean
  clearable?: boolean
  hasSearch?: boolean
  infiniteLoading?: boolean
  loadingMore?: boolean
  hasMoreItems?: boolean
  height?: string | number
  titleModal?: string
}

const props = withDefaults(defineProps<IGomboBox>(), {
  label: '',
  items: () => [],
  itemTitle: 'title',
  itemValue: 'id',
  disabled: false,
  dataLoading: false,
  baseColor: 'grey500',
  color: 'primary',
  density: 'default',
  rounded: 'xl',
  defalutLable: true,
  rules: () => [],
  loadingValue: false,
  clearable: true,
  hasSearch: true,
  infiniteLoading: false,
  loadingMore: false,
  hasMoreItems: true,
  titleModal: '',
})

const emit = defineEmits(['update:modelValue', 'loadMore'])

const sheet = ref(false)
const inputText = ref('')
const dense = ref(false)
const selectedItem = ref<IItemGomboBox | null>(null)

const findSelectedItem = (value?: string | number) => {
  return props.items.find((item) => {
    const selectedValue = item[props.itemValue]

    return selectedValue == Number(value) || selectedValue == value
  })
}

const getItemText = (item: IItemGomboBox, key: string) => {
  const value = item[key]

  return value == null ? '' : String(value)
}

watch(
  () => props.items,
  (newValue) => {
    if (newValue.length > 0) {
      const foundObj = findSelectedItem(props.modelValue)
      if (foundObj) {
        inputText.value = getItemText(foundObj, props.itemTitle)
        selectedItem.value = foundObj
      }
      else inputText.value = ''
    }
    else {
      inputText.value = ''
    }
  },
)

watch(
  () => props.modelValue,
  (newValue) => {
    if (props.items.length > 0) {
      const foundObj = findSelectedItem(newValue)
      selectedItem.value = foundObj ? foundObj : null
      inputText.value = foundObj ? getItemText(foundObj, props.itemTitle) : ''
    }
    else {
      inputText.value = ''
    }
  },
)

const getList = () => {
  sheet.value = true
}

const clearValue = () => {
  emit('update:modelValue', '')
  inputText.value = ''
}

const setValue = (item: IItemGomboBox) => {
  emit('update:modelValue', String(item.id ?? ''))
  inputText.value = getItemText(item, 'title')
  selectedItem.value = item
  sheet.value = false
}

onMounted(() => {
  if (props.items.length > 0) {
    const foundObj = findSelectedItem(props.modelValue)
    selectedItem.value = foundObj ? foundObj : null
    inputText.value = foundObj ? getItemText(foundObj, props.itemTitle) : ''
  }
})
</script>

<style>
</style>
