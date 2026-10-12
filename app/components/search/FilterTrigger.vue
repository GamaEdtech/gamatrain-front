<template>
  <div
    class="w-100"
  >
    <v-btn
      block
      :disabled="filter.disabled"
      variant="text"
      :ripple="false"
      height="52"
      class="search-filter-button text-none justify-space-between align-center px-2 text-grey700"
      @click="isDialogOpen = true"
    >
      <div class="d-flex align-center justify-start ga-1">
        <div class="search-filter-icon-space d-flex align-center justify-center flex-shrink-0">
          <v-img
            v-if="filter.selected?.icon"
            :src="`/images/boards/${filter.selected.icon}.svg`"
            :alt="filter.selected.title"
            width="24"
            height="24"
          />
          <v-icon
            v-else-if="filter.icon"
            :icon="filter.icon"
            size="22"
            color="brandNavy"
          />
        </div>

        <span class="d-flex flex-column align-start justify-center flex-grow-1 min-width-0 overflow-hidden">
          <span
            class="d-block text-truncate"
            :class="filter.selected ? 'text-caption text-grey600 font-weight-medium' : 'text-h6 text-brandNavy font-weight-bold'"
          >
            {{ filter.title }}
          </span>
          <span
            v-if="filter.selected"
            class="d-block text-h6 text-grey700 max-width-title font-weight-bold text-truncate"
          >
            {{ filter.selected.title }}
          </span>
        </span>
      </div>

      <div class="d-flex align-center justify-start ga-1">
        <v-progress-circular
          v-if="filter.loading"
          indeterminate
          color="primary"
          size="18"
          width="2"
        />

        <v-btn
          v-if="filter.selected"
          icon
          variant="text"
          size="x-small"
          color="grey500"
          :aria-label="`Clear ${filter.title}`"
          @click.stop="clearItem"
        >
          <v-icon size="18">
            md:cancel
          </v-icon>
        </v-btn>

        <v-icon
          size="22"
          color="grey500"
        >
          md:keyboard_arrow_down
        </v-icon>
      </div>
    </v-btn>

    <SearchSelectDialog
      v-model:show-dialog="isDialogOpen"
      :title-modal="filter.title"
      :items="filter.options"
      :selected-item="filter.selected || undefined"
      :is-loading="filter.loading"
      :has-search="filter.options.length > 8"
      @change-selected-item="selectItem"
    />
  </div>
</template>

<script setup lang="ts">
import type { SearchFilterOption, SearchFilterState } from '@/types/search'

defineProps<{
  filter: SearchFilterState
}>()

const emit = defineEmits<{
  select: [option: SearchFilterOption]
  clear: []
}>()

const isDialogOpen = ref(false)

const selectItem = (option: SearchFilterOption) => {
  isDialogOpen.value = false
  emit('select', option)
}

const clearItem = () => {
  emit('clear')
}
</script>

<style scoped>
.search-filter-button :deep(.v-btn__content) {
  width: 100%;
  justify-content: space-between;
}

.search-filter-icon-space {
  width: 28px;
  height: 28px;
}
.max-width-title{
  max-width : 90px;
}
</style>
