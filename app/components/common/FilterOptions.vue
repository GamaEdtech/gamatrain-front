<template>
  <div
    class="filter-options"
    :class="{
      'filter-options--compact': compact,
      'filter-options--single-line': singleLine,
    }"
    role="group"
    :aria-label="label"
  >
    <v-btn
      variant="outlined"
      class="filter-option"
      :class="{ 'filter-option--selected': !selectedId }"
      :aria-pressed="!selectedId"
      :disabled="disabled"
      @click="emit('select', null)"
    >
      All
    </v-btn>
    <div
      class="filter-options__items"
      :class="`filter-options__items--${columns}`"
    >
      <v-btn
        v-for="item in items"
        :key="item.id"
        variant="outlined"
        class="filter-option"
        :class="{ 'filter-option--selected': String(selectedId) === String(item.id) }"
        :aria-pressed="String(selectedId) === String(item.id)"
        :disabled="disabled"
        @click="emit('select', item)"
      >
        {{ itemTitle ? itemTitle(item) : item.title }}
      </v-btn>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  items: { type: Array, default: () => [] },
  selectedId: { type: [String, Number], default: '' },
  columns: { type: Number, default: 3 },
  compact: { type: Boolean, default: false },
  singleLine: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  itemTitle: { type: Function, default: null },
})
const emit = defineEmits(['select'])
</script>

<style scoped>
.filter-options {
  display: flex;
  max-width: 100%;
  align-items: flex-start;
  gap: 8px;
}
.filter-options__items {
  display: grid;
  min-width: 0;
  grid-template-columns: repeat(3, max-content);
  gap: 8px;
}
.filter-options__items--2 { grid-template-columns: repeat(2, max-content); }
.filter-options__items--4 { grid-template-columns: repeat(4, max-content); }
.filter-options--single-line .filter-options__items {
  display: flex;
  flex-wrap: nowrap;
}
.filter-option {
  width: auto;
  min-width: 0;
  max-width: none;
  height: auto !important;
  padding: 8px 12px !important;
  border-radius: 12px !important;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: normal;
  text-transform: none;
  color: rgb(var(--v-theme-directoryInk));
  background: rgb(var(--v-theme-grey25));
  border-color: rgb(var(--v-theme-directoryButtonBorder)) !important;
  transition: background-color 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
}
.filter-option--selected {
  color: rgb(var(--v-theme-white)) !important;
  background: rgb(var(--v-theme-directoryInk)) !important;
  border-color: rgb(var(--v-theme-directoryInk)) !important;
  box-shadow: 0 1px 2px rgba(var(--v-theme-directoryInk), 0.16);
}
.filter-options--compact,
.filter-options--compact .filter-options__items { gap: 6px; }
.filter-options--compact .filter-option {
  min-height: 28px;
  padding: 3px 8px !important;
  border-radius: 8px !important;
  font-size: 12px;
  line-height: 18px;
}
@media (prefers-reduced-motion: reduce) {
  .filter-option { transition: none; }
}
</style>
