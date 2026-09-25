<template>
  <div class="directory-paper-filters mb-4">
    <div class="d-none d-md-block">
      <div class="desktop-filter-row d-flex align-center ga-2">
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
          class="filter-clear"
          @click="emit('clear')"
        >
          Clear
        </v-btn>
      </div>
    </div>

    <div class="mobile-quick-filter-bar d-flex d-md-none">
      <div
        class="mobile-quick-filter-bar__scroller"
        aria-label="Quick filters"
      >
        <div
          v-for="filter in filters"
          :key="filter.key"
          class="mobile-quick-filter"
          :class="{
            'mobile-quick-filter--selected': filter.selectedItem,
            'mobile-quick-filter--disabled': filter.disabled,
          }"
        >
          <button
            type="button"
            class="mobile-quick-filter__control"
            :aria-label="filter.selectedItem ? `${filter.title}: ${filter.selectedItem.title}` : filter.title"
            :aria-pressed="Boolean(filter.selectedItem)"
            :disabled="filter.disabled"
            @click="openPicker(filter)"
          >
            <span
              v-if="filter.icon"
              class="mobile-quick-filter__icon"
            >
              <v-icon
                :icon="filter.icon"
                size="20"
              />
            </span>
            <span class="mobile-quick-filter__copy">
              <span class="mobile-quick-filter__label">{{ filter.title }}</span>
              <span
                v-if="filter.selectedItem"
                class="mobile-quick-filter__value"
              >
                {{ getDirectoryFilterOptionTitle(filter.key, filter.selectedItem) }}
              </span>
            </span>
          </button>
          <button
            v-if="filter.selectedItem"
            type="button"
            class="mobile-quick-filter__clear"
            :aria-label="`Clear ${filter.title} filter`"
            @click.stop="emit('select', filter.key, null)"
          >
            <v-icon size="18">
              md:cancel
            </v-icon>
          </button>
        </div>
      </div>
    </div>

    <CommonFilterSelectDialog
      v-model:show-dialog="showPicker"
      :title-modal="activeFilter.title"
      :items="pickerItems"
      :selected-item="activeFilter.selectedItem"
      :is-loading="activeFilter.loading"
      :error-message="activeFilter.error"
      :has-search="!activeFilter.inline"
      :inline-options="Boolean(activeFilter.inline)"
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
.desktop-filter-row {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  scrollbar-width: thin;
}
.desktop-filter-row > * {
  flex: 0 0 auto;
}
.filter-clear {
  min-width: 0;
  height: 32px !important;
  padding: 0 8px !important;
  color: rgb(var(--v-theme-errorStrong));
  font-size: 12px;
  font-weight: 650;
  letter-spacing: 0;
  text-transform: none;
}
@media (max-width: 959px) {
  .mobile-quick-filter-bar {
    position: sticky;
    z-index: 10;
    top: 0;
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    height: 64px;
    align-items: center;
    gap: 0;
    padding: 6px 0;
    overflow: hidden;
    background: rgb(var(--v-theme-grey25));
    border-bottom: 1px solid rgb(var(--v-theme-directoryButtonBorder));
  }

  .mobile-quick-filter-bar__scroller {
    display: flex;
    min-width: 0;
    height: 52px;
    flex: 1 1 auto;
    align-items: stretch;
    overflow-x: auto;
    overflow-y: hidden;
    overscroll-behavior-inline: contain;
    scrollbar-width: none;
    touch-action: pan-x pan-y;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
  }

  .mobile-quick-filter-bar__scroller::-webkit-scrollbar {
    display: none;
  }

  .mobile-quick-filter {
    position: relative;
    display: flex;
    width: 112px;
    min-width: 104px;
    height: 52px;
    flex: 0 0 auto;
    align-items: stretch;
    overflow: hidden;
    color: rgb(var(--v-theme-directoryInk));
    background: rgb(var(--v-theme-grey25));
    border-left: 1px solid rgb(var(--v-theme-directoryAnswer));
    transition: background-color 160ms ease;
  }

  .mobile-quick-filter:first-child {
    border-left: 0;
  }

  .mobile-quick-filter--selected {
    box-sizing: border-box;
    width: 148px;
    max-width: 160px;
    height: 100%;
    padding-right: 12px;
    background: transparent;
    border-radius: 0;
  }

  .mobile-quick-filter--disabled {
    color: rgba(var(--v-theme-directoryInk), 0.38);
  }

  .mobile-quick-filter--disabled .mobile-quick-filter__control {
    cursor: default;
  }

  .mobile-quick-filter--disabled .mobile-quick-filter__icon,
  .mobile-quick-filter--disabled .mobile-quick-filter__copy {
    opacity: 0.38;
  }

  .mobile-quick-filter--disabled .mobile-quick-filter__control:hover,
  .mobile-quick-filter--disabled .mobile-quick-filter__control:active {
    background: transparent;
  }

  .mobile-quick-filter__control {
    display: flex;
    min-width: 0;
    min-height: 44px;
    flex: 1 1 auto;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    overflow: hidden;
    color: inherit;
    font: inherit;
    text-align: left;
    background: transparent;
    border: 0;
    border-radius: inherit;
    cursor: pointer;
  }

  .mobile-quick-filter--selected .mobile-quick-filter__control {
    height: 100%;
    padding-right: 4px;
    border-radius: 0;
  }

  .mobile-quick-filter__control:hover {
    background: rgb(var(--v-theme-surfaceSecondary));
  }

  .mobile-quick-filter--selected .mobile-quick-filter__control:hover {
    background: transparent;
  }

  .mobile-quick-filter__control:active {
    background: rgb(var(--v-theme-directoryAnswer));
  }

  .mobile-quick-filter__control:focus-visible,
  .mobile-quick-filter__clear:focus-visible {
    z-index: 1;
    outline: 3px solid rgba(var(--v-theme-academicGold), 0.28);
    outline-offset: -3px;
  }

  .mobile-quick-filter__icon {
    box-sizing: border-box;
    display: inline-flex;
    width: 20px;
    height: 20px;
    flex: 0 0 20px;
    align-items: center;
    justify-content: center;
    color: rgb(var(--v-theme-directoryInk));
  }

  .mobile-quick-filter__icon :deep(.v-img) {
    width: 100%;
    height: 100%;
  }

  .mobile-quick-filter__icon :deep(.v-icon),
  .mobile-quick-filter__icon :deep(.search-filter-content-icon) {
    width: 20px;
    height: 20px;
    min-width: 20px;
    font-size: 20px !important;
    line-height: 20px;
  }

  .mobile-quick-filter__copy {
    display: flex;
    min-width: 0;
    flex: 1 1 auto;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    line-height: 1.2;
  }

  .mobile-quick-filter__label,
  .mobile-quick-filter__value {
    display: block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .mobile-quick-filter__label {
    color: rgb(var(--v-theme-directoryInk));
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
  }

  .mobile-quick-filter--selected .mobile-quick-filter__label {
    color: rgba(var(--v-theme-directoryInk), 0.68);
    font-size: 11px;
    font-weight: 500;
    line-height: 14px;
  }

  .mobile-quick-filter__value {
    color: rgb(var(--v-theme-directoryInk));
    font-size: 14px;
    font-weight: 650;
    line-height: 18px;
  }

  .mobile-quick-filter__clear {
    display: inline-flex;
    width: 18px;
    min-width: 18px;
    min-height: 44px;
    flex: 0 0 18px;
    align-items: center;
    justify-content: center;
    padding: 0;
    color: rgb(var(--v-theme-grey500));
    background: transparent;
    border: 0;
    border-radius: 0;
    cursor: pointer;
  }

  .mobile-quick-filter__clear:hover {
    color: rgb(var(--v-theme-errorStrong));
  }
}
</style>
