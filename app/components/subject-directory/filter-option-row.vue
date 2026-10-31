<template>
  <div
    class="directory-option-row"
    :class="{ 'directory-option-row--compact': compactRow }"
  >
    <span class="directory-option-row__label">{{ filter.title }}</span>
    <div
      v-if="filter.loading"
      class="d-flex align-center ga-2 py-2"
      role="status"
    >
      <v-progress-circular
        indeterminate
        size="20"
        width="2"
        color="primary"
      />
      <span class="text-grey500 text-body-2">Loading {{ filter.title.toLowerCase() }} options…</span>
    </div>
    <v-alert
      v-else-if="filter.error"
      type="error"
      variant="tonal"
      density="compact"
      class="my-2"
    >
      {{ filter.error }}
      <v-btn
        variant="text"
        class="text-none"
        @click="emit('retry')"
      >
        Retry
      </v-btn>
    </v-alert>
    <CommonFilterOptionChips
      v-else
      role="group"
      :aria-label="filter.title"
      :items="filter.items"
      :selected-item="filter.selectedItem"
      allow-clear
      :items-per-row="getDirectoryFilterColumns(filter.key, boardId)"
      :item-title="item => getDirectoryFilterOptionTitle(filter.key, item)"
      :disabled="filter.disabled"
      compact
      @select="emit('select', $event)"
    />
  </div>
</template>

<script setup>
import { getDirectoryFilterColumns, getDirectoryFilterOptionTitle } from '~/constants/pastpaper/directory'

defineProps({
  filter: { type: Object, required: true },
  boardId: { type: [String, Number], default: '' },
  compactRow: { type: Boolean, default: false },
})
const emit = defineEmits(['select', 'retry'])
</script>

<style scoped>
.directory-option-row {
  padding: 12px 0;
  min-width: 0;
}
.directory-option-row + .directory-option-row {
  border-top: 1px solid rgb(var(--v-theme-surfaceTertiary));
}
.directory-option-row__label {
  display: block;
  margin-bottom: 8px;
  font-family: Inter;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: rgb(var(--v-theme-brandNavy));
}
.directory-option-row--compact {
  box-sizing: border-box;
  display: flex;
  min-height: 44px;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  background: rgb(var(--v-theme-grey25));
  border: 1px solid rgb(var(--v-theme-borderSubtle));
  border-radius: 12px;
}
.directory-option-row--compact + .directory-option-row--compact {
  border-top: 1px solid rgb(var(--v-theme-borderSubtle));
}
.directory-option-row--compact .directory-option-row__label {
  margin-bottom: 0;
  font-size: 14px;
}
/* The compact bar lets options flow on one wrapping line instead of the chips' column grid */
.directory-option-row--compact :deep(.filter-option-chips) {
  --filter-option-gap: 4px;

  min-width: 0;
  flex-wrap: wrap;
}
.directory-option-row--compact :deep(.filter-option-chips__items) {
  display: flex;
  flex-wrap: wrap;
}
.directory-option-row--compact :deep(.inline-filter-option) {
  padding-inline: 6px !important;
  font-size: 13px;
}
</style>
