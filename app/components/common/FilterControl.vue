<template>
  <!-- A read-only Vuetify field used as a dialog trigger: the label moves up once a value is chosen -->
  <v-text-field
    class="filter-control flex-0-0"
    :model-value="selectedItem?.title || ''"
    :label="title"
    readonly
    variant="filled"
    density="compact"
    rounded="lg"
    hide-details
    min-width="132"
    max-width="220"
    :bg-color="selectedItem ? 'surfaceTertiary' : 'grey25'"
    color="brandNavy"
    :class="['border border-opacity-100', open ? 'border-brandNavy' : 'border-borderSubtle']"
    :prepend-inner-icon="icon || undefined"
    append-inner-icon="md:keyboard_arrow_down"
    :clearable="clearable"
    clear-icon="md:cancel"
    :persistent-clear="clearable"
    :loading="loading"
    :disabled="disabled || loading"
    role="button"
    aria-haspopup="dialog"
    :aria-expanded="open"
    :aria-label="selectedItem ? `${title}: ${selectedItem.title}` : title"
    @click:control="emit('click')"
    @keydown.enter.prevent="emit('click')"
    @keydown.space.prevent="emit('click')"
    @click:clear.stop="emit('clear')"
  />
</template>

<script setup lang="ts">
defineProps({
  title: { type: String, required: true },
  selectedItem: { type: Object, default: null },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  open: { type: Boolean, default: false },
  icon: { type: String, default: '' },
  clearable: { type: Boolean, default: true },
})
const emit = defineEmits(['click', 'clear'])
</script>

<style scoped>
/* px sizes: the app's 10px root font size makes Vuetify's rem-based field text too small */
.filter-control :deep(.v-field) {
  font-size: 14px;
  color: rgb(var(--v-theme-brandNavy));
  cursor: pointer;
}

.filter-control :deep(input) {
  cursor: pointer;
  font-weight: 650;
}

.filter-control :deep(.v-label) {
  font-size: 14px;
  font-weight: 600;
  color: rgb(var(--v-theme-brandNavy));
  opacity: 1;
}

.filter-control :deep(.v-field-label--floating) {
  font-size: 11px;
  font-weight: 500;
}

/* The control is outlined by the border utility, not the filled variant's underline */
.filter-control :deep(.v-field__outline) {
  display: none;
}

.filter-control :deep(.v-field__clearable .v-icon) {
  font-size: 18px;
  color: rgb(var(--v-theme-grey500));
  opacity: 1;
}
</style>
