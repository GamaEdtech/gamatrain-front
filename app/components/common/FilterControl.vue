<template>
  <div
    class="filter-control-group position-relative d-inline-flex"
    :class="{ 'filter-control-group--large': large }"
  >
    <v-btn
      ref="trigger"
      class="filter-control text-none text-start"
      type="button"
      :class="{
        'filter-control--selected': selectedItem,
        'filter-control--open': open,
        'filter-control--large': large,
      }"
      variant="outlined"
      rounded="lg"
      :disabled="disabled || loading"
      :loading="loading"
      aria-haspopup="dialog"
      :aria-expanded="open"
      :aria-label="selectedItem ? `${title}: ${selectedItem.title}` : title"
      @click="emit('click')"
    >
      <span
        v-if="imageSrc"
        class="filter-control__image mr-2"
      >
        <v-img
          :src="imageSrc"
          :alt="imageAlt || selectedItem?.title || title"
          contain
        />
      </span>
      <span
        v-else-if="icon"
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
          v-if="clearable && selectedItem"
          class="filter-control__clear-space mr-1"
          aria-hidden="true"
        />
        <v-icon
          class="mt-1"
          color="grey500"
          size="24"
        >
          md:keyboard_arrow_down
        </v-icon>
      </template>
    </v-btn>
    <v-btn
      v-if="clearable && selectedItem"
      class="filter-control__clear"
      :class="{ 'opacity-0': loading }"
      type="button"
      variant="text"
      rounded="sm"
      :ripple="false"
      :disabled="disabled || loading"
      :aria-label="`Clear ${title}`"
      @click="clearSelection"
    >
      <v-icon size="18">
        md:cancel
      </v-icon>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VBtn } from 'vuetify/components'

defineProps({
  title: { type: String, required: true },
  selectedItem: { type: Object, default: null },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  open: { type: Boolean, default: false },
  icon: { type: String, default: '' },
  imageSrc: { type: String, default: '' },
  imageAlt: { type: String, default: '' },
  clearable: { type: Boolean, default: true },
  large: { type: Boolean, default: false },
})
const emit = defineEmits(['click', 'clear'])
const trigger = ref<InstanceType<typeof VBtn> | null>(null)
const clearSelection = () => {
  trigger.value?.$el.focus()
  emit('clear')
}
</script>

<style scoped>
.filter-control-group {
  --filter-control-padding: 16px;
  --filter-control-chevron-size: 24px;
  --filter-control-clear-size: 18px;
  /* Vuetify's default-size append slot extends 4px into the end padding. */
  --filter-control-append-overhang: 4px;
  min-width: 0;
}
.filter-control-group--large {
  --filter-control-padding: 20px;
  width: 100%;
}
.filter-control {
  flex: 1 1 auto;
  min-width: 152px;
  height: 52px !important;
  justify-content: space-between;
  padding-inline: var(--filter-control-padding);
  color: rgb(var(--v-theme-brandNavy));
  background: rgb(var(--v-theme-grey25));
  border-color: rgb(var(--v-theme-borderSubtle)) !important;
  border-radius: 12px !important;
  letter-spacing: normal;
  transition: background-color 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
}
.filter-control-group:hover .filter-control:not(.v-btn--disabled) {
  background: rgb(var(--v-theme-surfaceSecondary));
  border-color: rgb(var(--v-theme-borderSubtle)) !important;
}
.filter-control-group :deep(.v-btn__overlay) {
  opacity: 0 !important;
}
.filter-control:focus-visible {
  box-shadow: 0 0 0 3px rgba(var(--v-theme-primary), 0.28);
}
.filter-control--selected,
.filter-control-group:hover .filter-control--selected:not(.v-btn--disabled) {
  background: rgb(var(--v-theme-surfaceTertiary));
  border-color: rgb(var(--v-theme-borderSubtle)) !important;
}
.filter-control--open:not(.filter-control--selected) {
  border-color: rgb(var(--v-theme-brandNavy)) !important;
}
.filter-control__icon,
.filter-control__image {
  box-sizing: border-box;
  display: inline-flex;
  width: 28px;
  height: 28px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
}
.filter-control__image :deep(.v-img) {
  width: 100%;
  height: 100%;
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
  color: rgb(var(--v-theme-brandNavy));
}
.filter-control__value {
  max-width: 190px;
  overflow: hidden;
  font-size: 14px;
  font-weight: 650;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.filter-control--large {
  width: 100%;
  min-width: 200px;
  height: 60px !important;
}
.filter-control--large.filter-control--selected .filter-control__label {
  font-size: 14px;
}
.filter-control--large .filter-control__value {
  max-width: 240px;
  font-size: 16px;
}
.filter-control :deep(.v-btn__content) {
  flex: 1;
  justify-content: flex-start;
  overflow: hidden;
}
.filter-control__clear-space {
  width: var(--filter-control-clear-size);
  height: var(--filter-control-clear-size);
}
.filter-control__clear {
  position: absolute;
  inset-inline-end: calc(var(--filter-control-padding) + var(--filter-control-chevron-size) + 4px + 1px - var(--filter-control-append-overhang));
  top: 50%;
  margin-top: calc(var(--filter-control-clear-size) / -2);
  min-width: 0;
  width: var(--filter-control-clear-size);
  height: var(--filter-control-clear-size);
  padding: 0;
  letter-spacing: normal;
  color: rgb(var(--v-theme-grey500)) !important;
}
.filter-control__clear :deep(.v-icon) {
  width: var(--filter-control-clear-size);
  height: var(--filter-control-clear-size);
  font-size: var(--filter-control-clear-size);
}
.filter-control__clear:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}
.filter-control__clear:hover {
  color: rgb(var(--v-theme-errorStrong)) !important;
}
@media (prefers-reduced-motion: reduce) {
  .filter-control { transition: none; }
}
</style>
