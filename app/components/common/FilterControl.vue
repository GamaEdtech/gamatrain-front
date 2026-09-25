<template>
  <v-btn
    class="filter-control text-none text-start"
    :class="{ 'filter-control--selected': selectedItem, 'filter-control--open': open }"
    variant="outlined"
    rounded="lg"
    :disabled="disabled"
    :loading="loading"
    aria-haspopup="dialog"
    :aria-expanded="open"
    :aria-label="selectedItem ? `${title}: ${selectedItem.title}` : title"
    @click="emit('click')"
  >
    <span
      v-if="icon"
      class="filter-control__icon mr-2"
    >
      <v-icon
        :icon="icon"
        size="20"
      />
    </span>
    <span class="filter-control__copy">
      <span class="filter-control__label">{{ title }}</span>
      <span
        v-if="selectedItem"
        class="filter-control__value"
      >{{ selectedItem.title }}</span>
    </span>
    <template #append>
      <span
        v-if="selectedItem"
        class="filter-control__clear mr-1"
        role="button"
        tabindex="0"
        :aria-label="`Clear ${title}`"
        @click.stop="emit('clear')"
        @keydown.enter.stop.prevent="emit('clear')"
        @keydown.space.stop.prevent="emit('clear')"
      >
        <v-icon size="18">
          md:cancel
        </v-icon>
      </span>
      <v-icon
        class="mt-1"
        color="grey500"
        size="24"
      >
        md:keyboard_arrow_down
      </v-icon>
    </template>
  </v-btn>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  selectedItem: { type: Object, default: null },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  open: { type: Boolean, default: false },
  icon: { type: String, default: '' },
})
const emit = defineEmits(['click', 'clear'])
</script>

<style scoped>
.filter-control {
  min-width: 152px;
  height: 52px !important;
  justify-content: space-between;
  padding-inline: 16px;
  color: rgb(var(--v-theme-directoryInk));
  background: rgb(var(--v-theme-grey25));
  border-color: rgb(var(--v-theme-directoryButtonBorder)) !important;
  border-radius: 12px !important;
  letter-spacing: normal;
  transition: background-color 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
}
.filter-control:hover {
  background: rgb(var(--v-theme-surfaceSecondary));
  border-color: rgb(var(--v-theme-directoryButtonBorder)) !important;
}
.filter-control:focus-visible {
  box-shadow: 0 0 0 3px rgba(var(--v-theme-academicGold), 0.28);
}
.filter-control--selected,
.filter-control--selected:hover {
  background: rgb(var(--v-theme-directoryButtonBorder));
  border-color: transparent !important;
}
.filter-control--open:not(.filter-control--selected) {
  border-color: rgb(var(--v-theme-directoryInk)) !important;
}
.filter-control__icon {
  box-sizing: border-box;
  display: inline-flex;
  width: 28px;
  height: 28px;
  flex: 0 0 28px;
  align-items: center;
  justify-content: center;
}
.filter-control__copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.2;
}
.filter-control__label {
  font-size: 16px;
  font-weight: 600;
}
.filter-control--selected .filter-control__label {
  font-size: 12px;
  font-weight: 500;
  color: rgb(var(--v-theme-directoryInk));
}
.filter-control__value {
  max-width: 190px;
  overflow: hidden;
  font-size: 14px;
  font-weight: 650;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.filter-control :deep(.v-btn__content) {
  flex: 1;
  justify-content: flex-start;
  overflow: hidden;
}
.filter-control__clear {
  display: inline-flex;
  align-items: center;
  border-radius: 4px;
  color: rgb(var(--v-theme-grey500)) !important;
}
.filter-control__clear:focus-visible {
  outline: 2px solid rgb(var(--v-theme-academicGold));
  outline-offset: 2px;
}
.filter-control__clear:hover {
  color: rgb(var(--v-theme-errorStrong)) !important;
}
.filter-control:has(.filter-control__clear:hover) {
  --v-hover-opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
  .filter-control { transition: none; }
}
</style>
