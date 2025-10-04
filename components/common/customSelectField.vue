<template>
  <div
    id="gombo-box"
    class="gombo-box"
  >
    <v-text-field
      v-model="inputText"
      rounded="lg"
      readonly
      variant="outlined"
      hide-details
      append-inner-icon="mdi-chevron-down"
      :disabled="disabled"
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

defineProps({
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
  searchLoading: {
    type: Boolean,
    default: false,
  },
  dataLoading: {
    type: Boolean,
    default: true,
  },
  hasSearch: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['changeSelectedItem'])

const isShowSelectModal = ref(false)
const inputText = ref('')

const openSelectModal = () => {
  isShowSelectModal.value = true
}

const clearValue = () => {
  emit('changeSelectedItem', null)
  inputText.value = ''
}

const onFilterUpdate = (itemSelected) => {
  emit('changeSelectedItem', itemSelected)
  inputText.value = itemSelected.title
  isShowSelectModal.value = false
}

onMounted(() => {
  //   if (props.items.length > 0) {
  //     const foundObj = props.items.find(
  //       x => x[props.itemValue] == Number(props.modelValue),
  //     )
  //     inputText.value = foundObj ? foundObj[props.itemTitle] : ''
  //   }
})
</script>

<style>
.gombo-box-list {
  border-radius: 24px 24px 0 0 !important;
  height: 400px !important;
  position: fixed !important;
  z-index: 1800;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  box-shadow: 2px -6px 24px 0px rgba(16, 24, 40, 0.05);
  overflow-y: hidden !important;
}

.data-list {
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 20px;
  height: 240px;
  text-align: left;
}

.gombo-box .v-field--variant-outlined {
  background: var(--White, #fff) !important;
}

.gombo-box .v-input__append-inner {
  margin: auto !important;
  padding-right: 1rem;
}

#search-btn {
  height: 36px !important;
}

#search-btn .v-btn__content {
  color: black;
  text-transform: none;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 22px;
}

.size-lable {
  font-size: 16px;
}
.v-field-label {
  font-size: 16px !important;
}
</style>
