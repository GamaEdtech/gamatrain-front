<template>
  <div>
    <v-text-field
      ref="textFieldRef"
      :model-value="selectedItem?.title || ''"
      rounded="lg"
      readonly
      variant="outlined"
      append-inner-icon="md:keyboard_arrow_down"
      :disabled="disabled"
      :rules="rules"
      clearable
      color="#ffb300"
      density="compact"
      @click="openSelectModal"
      @click:clear="clearValue"
    >
      <template #label>
        <span class="primary-gray-700 font-weight-medium size-lable">{{
          label
        }}</span>
      </template>
      <template #prepend-inner>
        <v-progress-circular
          v-if="loading"
          indeterminate
          size="20"
          color="#ffb300"
          class="mr-2"
        />
      </template>
    </v-text-field>

    <search-select-dialog
      v-model:show-dialog="isShowSelectModal"
      :title-modal="label"
      :items="items"
      :selected-item="selectedItem"
      :has-search="hasSearch"
      @change-selected-item="onFilterUpdate"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  items: {
    type: Array,
    default: () => [],
  },
  selectedItem: {
    type: [Object, null],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  hasSearch: {
    type: Boolean,
    default: true,
  },
  rules: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['changeSelectedItem'])

const textFieldRef = ref()
const isShowSelectModal = ref(false)

const openSelectModal = () => {
  isShowSelectModal.value = true
}

const clearValue = () => {
  emit('changeSelectedItem', null, false)
  if (textFieldRef.value) {
    textFieldRef.value.blur()
  }
}

const onFilterUpdate = (itemSelected) => {
  emit('changeSelectedItem', itemSelected, false)
  isShowSelectModal.value = false
}

watch(
  () => props.items,
  (newValue) => {
    if (newValue.length > 0 && props.selectedItem) {
      const foundObj = props.items.find(
        x => x.id.toString() == props.selectedItem.id.toString(),
      )
      emit('changeSelectedItem', foundObj, true)
    }
  },
)

watch(
  () => props.selectedItem,
  (newValue) => {
    if (newValue && props.items.length > 0) {
      const foundObj = props.items.find(
        x => x.id.toString() == props.selectedItem.id.toString(),
      )
      emit('changeSelectedItem', foundObj, true)
    }
  },
)

onMounted(() => {
  if (props.items.length > 0 && props.selectedItem) {
    const foundObj = props.items.find(
      x => x.id.toString() == props.selectedItem.id.toString(),
    )
    emit('changeSelectedItem', foundObj, true)
  }
})
</script>

<style></style>
