<template>
  <!-- Sticky, horizontally scrolling filter bar shown below the md breakpoint -->
  <v-sheet
    color="grey25"
    height="64"
    class="mobile-quick-filter-bar d-flex d-md-none align-center position-sticky top-0 w-100 px-3 py-1 overflow-hidden border-b border-borderSubtle border-opacity-100"
  >
    <slot name="prepend" />

    <div
      ref="scroller"
      class="mobile-quick-filter-bar__scroller d-flex flex-1-1 h-100 overflow-x-auto"
      aria-label="Quick filters"
    >
      <div
        v-for="(filter, index) in filters"
        :key="itemKey(filter)"
        class="d-flex flex-0-0 align-center"
        :class="{ 'border-s border-surfaceTertiary border-opacity-100': index > 0 }"
      >
        <v-btn
          variant="text"
          rounded="0"
          height="52"
          :width="filter.selectedItem && filter.closable ? 118 : 112"
          :ripple="false"
          class="mobile-quick-filter__control text-none text-brandNavy px-3"
          aria-haspopup="dialog"
          :aria-expanded="activeKey === undefined ? undefined : activeKey === itemKey(filter)"
          :aria-label="getAriaLabel(filter)"
          :aria-pressed="Boolean(filter.selectedItem)"
          :disabled="filter.disabled"
          @click="emit('open', filter)"
        >
          <template
            v-if="filter.showItemIcon || filter.controlIcon"
            #prepend
          >
            <CommonFilterControlIcon
              :selected-item="filter.selectedItem"
              :show-item-icon="filter.showItemIcon"
              :icon-src="filter.iconSrc"
              :fallback-icon="filter.fallbackIcon"
              :fallback-icon-padding="filter.fallbackIconPadding"
              :control-icon="filter.controlIcon"
              :icon-size="20"
            />
          </template>

          <span class="d-flex flex-column flex-1-1 align-start overflow-hidden">
            <span
              class="mobile-quick-filter__label d-block w-100 text-truncate"
              :class="{ 'mobile-quick-filter__label--selected': filter.selectedItem }"
            >{{ filter.title }}</span>
            <span
              v-if="filter.selectedItem"
              class="mobile-quick-filter__value d-block w-100 text-truncate"
            >{{ getValue(filter) }}</span>
          </span>
        </v-btn>

        <v-btn
          v-if="filter.selectedItem && filter.closable"
          icon
          variant="text"
          size="24"
          color="grey500"
          class="me-3"
          :aria-label="`Clear ${filter.title} filter`"
          @click.stop="emit('clear', filter)"
        >
          <v-icon size="18">
            md:cancel
          </v-icon>
        </v-btn>
      </div>
    </div>
  </v-sheet>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface QuickFilterItem {
  id?: string | number
  title?: string
  icon?: string
  contentIcon?: string
}

export interface MobileQuickFilter {
  title: string
  selectedItem?: QuickFilterItem | null
  disabled?: boolean
  closable?: boolean
  itemTitle?: ((item: QuickFilterItem) => string | undefined) | null
  showItemIcon?: boolean
  iconSrc?: ((item: QuickFilterItem) => string | undefined) | null
  fallbackIcon?: string
  fallbackIconPadding?: number
  controlIcon?: string
}

withDefaults(defineProps<{
  filters: MobileQuickFilter[]
  itemKey?: (filter: MobileQuickFilter) => string
  // Set when the dialog state is known, to expose aria-expanded on each control.
  activeKey?: string | null
}>(), {
  itemKey: (filter: MobileQuickFilter) => filter.title,
  activeKey: undefined,
})

const emit = defineEmits<{
  open: [filter: MobileQuickFilter]
  clear: [filter: MobileQuickFilter]
}>()

const scroller = ref<HTMLElement | null>(null)

const getValue = (filter: MobileQuickFilter) => filter.selectedItem
  ? filter.itemTitle?.(filter.selectedItem) || filter.selectedItem.title || ''
  : ''

const getAriaLabel = (filter: MobileQuickFilter) => {
  const value = getValue(filter)
  return value ? `${filter.title}: ${value}` : filter.title
}

defineExpose({
  resetScroll: () => {
    if (scroller.value) scroller.value.scrollLeft = 0
  },
})
</script>

<style scoped>
/* Only what Vuetify has no prop or utility for: stacking, a hidden scrollbar,
   left-aligned button content, and px font sizes (the app's 10px root font
   size shrinks Vuetify's rem-based typography classes). */
.mobile-quick-filter-bar {
  z-index: 10;
}

.mobile-quick-filter-bar__scroller {
  min-width: 0;
  scrollbar-width: none;
}

.mobile-quick-filter-bar__scroller::-webkit-scrollbar {
  display: none;
}

.mobile-quick-filter__control :deep(.v-btn__content) {
  min-width: 0;
  flex: 1 1 auto;
  justify-content: flex-start;
}

.mobile-quick-filter__label {
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
}

.mobile-quick-filter__label--selected {
  font-size: 11px;
  font-weight: 500;
  line-height: 14px;
  opacity: 0.68;
}

.mobile-quick-filter__value {
  font-size: 14px;
  font-weight: 650;
  line-height: 18px;
}
</style>
