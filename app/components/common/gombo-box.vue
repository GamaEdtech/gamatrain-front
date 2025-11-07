<template>
  <div
    id="gombo-box"
    class="gombo-box"
  >
    <v-text-field
      v-model="inputText"
      rounded
      readonly
      variant="outlined"
      hide-details
      append-inner-icon="mdi-chevron-down"
      :dense="dense"
      :disabled="disabled"
      clearable
      class="gombo-box-input"
      color="#ffb300"
      @click="getList"
      @click:clear="clearValue"
    >
      <template #label>
        <span class="primary-gray-700 font-weight-medium size-lable">{{
          label
        }}</span>
      </template>
    </v-text-field>

    <v-bottom-sheet v-model="sheet">
      <v-card
        v-if="sheet"
        class="gombo-box-list"
      >
        <v-row>
          <v-col cols="12">
            <div class="px-5 mt-4">
              <v-list v-if="dataLoading">
                <v-list-subheader class="gtext-h5 mb-4">
                  {{
                    label
                  }}
                </v-list-subheader>
                <v-text-field
                  id="search-field"
                  v-model="keyword"
                  prepend-inner-icon="mdi-magnify"
                  hide-details
                  label="Search anything..."
                  dense
                  variant="outlined"
                  rounded
                  autocomplete="off"
                  color="#ffb300"
                >
                  <template #append-inner>
                    <v-btn
                      id="search-btn"
                      size="large"
                      class="primary"
                      :loading="searchLoading"
                      rounded
                      color="#ffb300"
                    >
                      Search
                    </v-btn>
                  </template>
                </v-text-field>
                <div class="data-list">
                  <v-list-item
                    v-for="(item, index) in filteredItems"
                    :key="index"
                    class="pointer"
                  >
                    <v-list-item-title
                      class="gtext-t5"
                      @click="setValue(item[itemValue], item[itemTitle])"
                    >
                      {{ item[itemTitle] }}
                    </v-list-item-title>
                  </v-list-item>
                </div>
              </v-list>
              <div
                v-else
                class="text-center pt-8"
              >
                <v-progress-circular
                  indeterminate
                  :width="3"
                  color="primary"
                />
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  items: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: [String, Number],
  },
  itemTitle: {
    type: String,
    default: 'title',
  },
  itemValue: {
    type: String,
    default: 'id',
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
})

const emit = defineEmits(['update:modelValue'])

const sheet = ref(false)
const keyword = ref('')
const inputText = ref('')
const dense = ref(false)

const filteredItems = computed(() => {
  const filterTextLower = keyword.value.toLowerCase().trim()
  return props.items.filter(item =>
    item[props.itemTitle].toLowerCase().includes(filterTextLower),
  )
})

watch(
  () => props.items,
  (newValue) => {
    if (newValue.length > 0) {
      const foundObj = props.items.find(
        x => x[props.itemValue] == Number(props.modelValue),
      )
      if (foundObj) inputText.value = foundObj[props.itemTitle]
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
      const foundObj = props.items.find(
        x => x[props.itemValue] == Number(newValue),
      )
      inputText.value = foundObj ? foundObj[props.itemTitle] : ''
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

const setValue = (val, title) => {
  emit('update:modelValue', val.toString())
  inputText.value = title
  sheet.value = false
}

onMounted(() => {
  if (props.items.length > 0) {
    const foundObj = props.items.find(
      x => x[props.itemValue] == Number(props.modelValue),
    )
    inputText.value = foundObj ? foundObj[props.itemTitle] : ''
  }
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
