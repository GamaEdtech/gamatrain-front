<template>
  <div class="directory-paper-filters mb-4">
    <div class="d-none d-md-flex w-100 flex-wrap align-center ga-2">
      <CommonFilterControl
        v-for="filter in selectFilters"
        :key="filter.key"
        :title="filter.title"
        :selected-item="filter.selectedItem"
        :disabled="filter.disabled"
        :icon="filter.icon"
        :open="showPicker && activeKey === filter.key"
        @click="openPicker(filter)"
        @clear="emit('select', filter.key, null)"
      />
      <div
        v-for="filter in inlineFilters"
        :key="filter.key"
        class="directory-option-row d-flex flex-wrap align-center ga-2 px-2 py-1 bg-grey25 border border-borderSubtle border-opacity-100"
      >
        <span class="directory-option-row__label text-brandNavy font-weight-bold">{{ filter.title }}</span>
        <v-progress-circular
          v-if="filter.loading"
          indeterminate
          size="20"
          width="2"
          color="primary"
        />
        <v-btn
          v-else-if="filter.error"
          variant="text"
          color="errorStrong"
          class="text-none"
          @click="emit('retry', filter.key)"
        >
          Retry
        </v-btn>
        <CommonFilterOptionChips
          v-else
          role="group"
          :aria-label="filter.title"
          :items="filter.items"
          :selected-item="filter.selectedItem"
          allow-clear
          :items-per-row="filter.key === 'paper' ? getPaperOptionsPerRow(boardId) : 3"
          :item-title="filter.key === 'paper' ? getPaperOptionTitle : undefined"
          :disabled="filter.disabled"
          compact
          @select="emit('select', filter.key, $event)"
        />
      </div>
      <v-btn
        variant="text"
        color="errorStrong"
        height="44"
        class="directory-filter-clear text-none font-weight-bold px-2"
        @click="emit('clear')"
      >
        Clear
      </v-btn>
    </div>

    <CommonMobileQuickFilterBar
      class="px-0"
      :filters="quickFilters"
      :item-key="filter => filter.key"
      :active-key="showPicker ? activeKey : null"
      @open="openPicker"
      @clear="filter => emit('select', filter.key, null)"
    />

    <SearchSelectDialog
      v-model:show-dialog="showPicker"
      :title-modal="activeFilter.title"
      :items="pickerItems"
      :selected-item="activeFilter.selectedItem"
      :is-loading="activeFilter.loading"
      :has-search="!activeFilter.inline"
      compact-result-count
      :inline-options="Boolean(activeFilter.inline)"
      inline-allow-clear
      :inline-items-per-row="activeFilter.key === 'paper' ? getPaperOptionsPerRow(boardId) : 3"
      :item-title="activeFilter.key === 'paper' ? getPaperOptionTitle : undefined"
      @change-selected-item="selectPickerItem"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { getPaperOptionsPerRow, getPaperOptionTitle } from '~/constants/search'

const props = defineProps({
  filters: { type: Array, required: true },
  boardId: { type: [String, Number], default: '' },
  contextKey: { type: String, default: '' },
})
const emit = defineEmits(['select', 'clear', 'retry'])
const showPicker = ref(false)
const activeKey = ref('year')
const selectFilters = computed(() => props.filters.filter(filter => !filter.inline))
const inlineFilters = computed(() => props.filters.filter(filter => filter.inline))
// The mobile bar shows every filter, with the directory's short option titles.
const quickFilters = computed(() => props.filters.map(filter => ({
  ...filter,
  controlIcon: filter.icon,
  closable: true,
  itemTitle: filter.key === 'paper' ? getPaperOptionTitle : undefined,
})))
const activeFilter = computed(() => props.filters.find(filter => filter.key === activeKey.value) || props.filters[0])
const pickerItems = computed(() => activeFilter.value.items)

const openPicker = (filter) => {
  if (filter.disabled) return
  activeKey.value = filter.key
  showPicker.value = true
}
const selectPickerItem = (item) => {
  emit('select', activeKey.value, item)
  showPicker.value = false
}
watch(() => props.contextKey, () => {
  showPicker.value = false
})
</script>

<style scoped>
/* px sizes: the app's 10px root font size makes Vuetify's rem-based text too small */
.directory-filter-clear {
  font-size: 12px;
  letter-spacing: normal;
}

/* Paper and Variant: label and options on one wrapping line, in a bordered box */
.directory-option-row {
  min-height: 44px;
  border-radius: 12px;
}

.directory-option-row__label {
  font-size: 14px;
}

.directory-option-row :deep(.filter-option-chips) {
  --filter-option-gap: 4px;

  flex-wrap: wrap;
}

.directory-option-row :deep(.filter-option-chips__items) {
  display: flex;
  flex-wrap: wrap;
}

.directory-option-row :deep(.inline-filter-option) {
  padding-inline: 6px !important;
  font-size: 13px;
}
</style>
