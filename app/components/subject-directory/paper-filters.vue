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
      <SubjectDirectoryFilterOptionRow
        v-for="filter in inlineFilters"
        :key="filter.key"
        :filter="filter"
        :board-id="boardId"
        compact-row
        @select="emit('select', filter.key, $event)"
        @retry="emit('retry', filter.key)"
      />
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
      :error-message="activeFilter.error"
      :has-search="!activeFilter.inline"
      compact-result-count
      :inline-options="Boolean(activeFilter.inline)"
      inline-allow-clear
      :inline-items-per-row="getDirectoryFilterColumns(activeFilter.key, boardId)"
      :item-title="item => getDirectoryFilterOptionTitle(activeFilter.key, item)"
      @retry="emit('retry', activeFilter.key)"
      @change-selected-item="selectPickerItem"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { getDirectoryFilterColumns, getDirectoryFilterOptionTitle } from '~/constants/pastpaper/directory'

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
  itemTitle: item => getDirectoryFilterOptionTitle(filter.key, item),
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
/* px sizes: the app's 10px root font size makes Vuetify's rem-based button text too small */
.directory-filter-clear {
  font-size: 12px;
  letter-spacing: normal;
}
</style>
