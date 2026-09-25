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
        color="academicGold"
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
    <CommonFilterOptions
      v-else
      :label="filter.title"
      :items="filter.items"
      :selected-id="filter.selectedItem?.id"
      :columns="getDirectoryFilterColumns(filter.key, boardId)"
      :item-title="item => getDirectoryFilterOptionTitle(filter.key, item)"
      :disabled="filter.disabled"
      compact
      :single-line="compactRow"
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
  overflow-x: auto;
}
.directory-option-row + .directory-option-row {
  border-top: 1px solid rgb(var(--v-theme-directoryAnswer));
}
.directory-option-row__label {
  display: block;
  margin-bottom: 8px;
  font-family: Inter;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: rgb(var(--v-theme-directoryInk));
}
.directory-option-row--compact {
  box-sizing: border-box;
  display: flex;
  height: 52px;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  overflow: visible;
  background: rgb(var(--v-theme-grey25));
  border: 1px solid rgb(var(--v-theme-directoryButtonBorder));
  border-radius: 12px;
}
.directory-option-row--compact + .directory-option-row--compact {
  border-top: 1px solid rgb(var(--v-theme-directoryButtonBorder));
}
.directory-option-row--compact .directory-option-row__label {
  margin-bottom: 0;
}
</style>
