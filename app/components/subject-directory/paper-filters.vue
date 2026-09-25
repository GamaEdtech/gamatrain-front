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
      <div class="mobile-quick-filter-bar__trigger">
        <CommonFilterTrigger
          :count="activeCount"
          label="Filters"
          @click="showPanel = true"
        />
      </div>
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

    <v-dialog
      v-model="showPanel"
      transition="dialog-bottom-transition"
      fullscreen
      scrim="white"
    >
      <div class="mobile-filter-modal w-100 h-100 d-flex flex-column position-relative">
        <v-container class="mobile-filter-modal__container flex-column">
          <section class="mobile-filter-panel">
            <div class="mobile-filter-panel__header d-flex align-center justify-space-between">
              <span class="mobile-filter-panel__title d-flex align-center ga-2">
                <v-icon size="18">md:filter_list</v-icon>
                Filters
              </span>
              <div class="d-flex align-center ga-1">
                <v-btn
                  variant="text"
                  class="filter-clear"
                  @click="emit('clear')"
                >
                  Clear
                </v-btn>
                <v-btn
                  icon
                  variant="text"
                  class="mobile-filter-panel__close"
                  aria-label="Close filters"
                  @click="showPanel = false"
                >
                  <v-icon size="20">
                    md:close
                  </v-icon>
                </v-btn>
              </div>
            </div>
            <div class="mobile-filter-control-list">
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
            </div>
            <div class="mobile-inline-filter-group">
              <SubjectDirectoryFilterOptionRow
                v-for="filter in inlineFilters"
                :key="filter.key"
                :filter="filter"
                :board-id="boardId"
                @select="emit('select', filter.key, $event)"
                @retry="emit('retry', filter.key)"
              />
            </div>
          </section>
        </v-container>
        <div class="mobile-filter-modal__footer w-100 d-flex align-center justify-center position-fixed bottom-0">
          <v-btn
            color="academicGold"
            rounded="xl"
            height="40"
            class="mobile-filter-modal__show-results text-h5 text-grey800"
            @click="showPanel = false"
          >
            Show papers
          </v-btn>
        </div>
      </div>
    </v-dialog>

    <CommonFilterSelectDialog
      v-model:show-dialog="showPicker"
      :title-modal="activeFilter.title"
      :items="pickerItems"
      :selected-item="activeFilter.selectedItem || (activeFilter.inline ? null : pickerItems[0])"
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
import { useDisplay } from 'vuetify'
import { getDirectoryFilterColumns, getDirectoryFilterOptionTitle } from '~/constants/pastpaper/directory'

const props = defineProps({
  filters: { type: Array, required: true },
  boardId: { type: [String, Number], default: '' },
  contextKey: { type: String, default: '' },
})
const emit = defineEmits(['select', 'clear', 'retry'])
const { mdAndUp } = useDisplay()
const showPanel = ref(false)
const showPicker = ref(false)
const activeKey = ref('year')
const selectFilters = computed(() => props.filters.filter(filter => !filter.inline))
const inlineFilters = computed(() => props.filters.filter(filter => filter.inline))
const activeCount = computed(() => props.filters.filter(filter => filter.selectedItem).length)
const activeFilter = computed(() => props.filters.find(filter => filter.key === activeKey.value) || props.filters[0])
const pickerItems = computed(() => activeFilter.value.inline
  ? activeFilter.value.items
  : [{ id: '', title: activeFilter.value.allTitle }, ...activeFilter.value.items])

const openPicker = (filter) => {
  if (filter.disabled) return
  activeKey.value = filter.key
  showPicker.value = true
}
const selectPickerItem = (item) => {
  emit('select', activeKey.value, item)
  showPicker.value = false
}
watch(mdAndUp, (desktop) => {
  if (desktop) showPanel.value = false
})
watch(() => props.contextKey, () => {
  showPicker.value = false
  showPanel.value = false
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
    padding: 6px 12px;
    overflow: hidden;
    background: rgb(var(--v-theme-grey25));
    border-bottom: 1px solid rgb(var(--v-theme-directoryButtonBorder));
  }

  .mobile-quick-filter-bar__trigger {
    position: relative;
    z-index: 1;
    display: flex;
    width: 108px;
    min-width: 108px;
    height: 52px;
    flex: 0 0 108px;
    align-items: stretch;
    justify-content: flex-start;
    box-shadow: 4px 0 8px -4px rgba(var(--v-theme-directoryInk), 0.18);
    transition: background-color 160ms ease;
  }

  .mobile-quick-filter-bar__trigger:hover {
    background: rgb(var(--v-theme-surfaceSecondary));
  }

  .mobile-quick-filter-bar__trigger :deep(.height-badge) {
    width: 100%;
    height: 100%;
  }

  .mobile-quick-filter-bar__trigger :deep(.filter-trigger) {
    width: 100%;
    height: 100% !important;
    min-width: 0;
    justify-content: flex-start;
    padding-inline: 12px;
    background: rgb(var(--v-theme-grey25));
    border: 0 !important;
    border-radius: 0 !important;
    box-shadow: none;
  }

  .mobile-quick-filter-bar__trigger :deep(.filter-trigger:hover) {
    background: transparent !important;
  }

  .mobile-quick-filter-bar__trigger :deep(.filter-trigger .v-btn__overlay) {
    opacity: 0 !important;
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

  .mobile-filter-modal {
    height: 100dvh !important;
    overflow: hidden !important;
    color: rgb(var(--v-theme-directoryInk));
    background: rgb(var(--v-theme-surfaceSecondary));
  }

  .mobile-filter-modal__container {
    display: block;
    width: 100%;
    max-width: none;
    height: 100%;
    min-height: 0;
    flex: 1 1 auto;
    padding: 0 0 calc(88px + env(safe-area-inset-bottom));
    margin: 0;
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
  }

  .mobile-filter-panel {
    width: 100%;
    min-height: calc(100dvh - 88px);
    overflow: visible;
    background: rgb(var(--v-theme-grey25));
    border: 0;
    border-radius: 0;
    box-shadow: none;
  }

  .mobile-filter-panel__header {
    min-height: 64px;
    padding: 16px;
    border-bottom: 1px solid rgb(var(--v-theme-directoryButtonBorder));
  }

  .mobile-filter-panel__title {
    color: rgb(var(--v-theme-directoryInk));
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
  }

  .mobile-filter-panel__close {
    width: 32px !important;
    height: 32px !important;
    color: rgb(var(--v-theme-grey500));
  }

  .mobile-filter-control-list :deep(.filter-control) {
    width: 100%;
    min-width: 0;
    height: 56px !important;
    justify-content: stretch !important;
    padding-inline: 16px;
    direction: ltr;
    color: rgb(var(--v-theme-directoryInk));
    text-align: left;
    background: rgb(var(--v-theme-grey25));
    border: 0 !important;
    border-bottom: 1px solid rgb(var(--v-theme-directoryAnswer)) !important;
    border-radius: 0 !important;
    box-shadow: none;
  }

  .mobile-filter-control-list :deep(.filter-control:not(:has(.filter-control__icon))) {
    padding-left: 52px;
  }

  .mobile-filter-control-list :deep(.filter-control .v-btn__content) {
    justify-content: flex-start !important;
  }

  .mobile-filter-control-list :deep(.filter-control__copy) {
    align-items: flex-start;
    text-align: left;
  }

  .mobile-filter-control-list :deep(.filter-control:hover) {
    background: rgb(var(--v-theme-surfaceSecondary));
  }

  .mobile-filter-control-list :deep(.filter-control--selected) {
    background: rgb(var(--v-theme-directoryButtonBorder));
    border-color: transparent !important;
  }

  .mobile-filter-control-list :deep(.filter-control__value) {
    max-width: min(190px, 48vw);
  }

  .mobile-inline-filter-group {
    padding: 0 16px 0 52px;
    background: rgb(var(--v-theme-grey25));
  }
  .mobile-filter-modal__footer {
    z-index: 2;
    padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
    background: rgb(var(--v-theme-grey25));
    border-top: 1px solid rgb(var(--v-theme-directoryButtonBorder));
  }

  .mobile-filter-modal__show-results {
    width: 100%;
    max-width: 448px;
  }

}
</style>
