<template>
  <div class="w-100 px-2 d-flex ga-1">
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
        color="grey700"
      />
    </div>
    <div class="d-flex flex-column">
      <span class="text-h6 text-grey700 font-weight-bold">
        {{ filter.title }}
      </span>
      <div class="d-flex align-center flex-wrap ga-2 mt-2">
        <div
          :class="[
            filter.selected ? 'bg-white text-grey700' : 'bg-grey700 text-white',
            filter.disabled ? 'opacity-50' : 'cursor-pointer',
            'text-h6 font-weight-bold button-filter rounded-lg d-flex justify-center align-center px-1',
          ]"
          :aria-disabled="filter.disabled"
          @click="selectOption(null)"
        >
          All
        </div>

        <div
          v-for="option in filter.options"
          :key="option.id"
          :class="[
            filter.selected?.id === option.id ? 'bg-grey700 text-white' : 'bg-white text-grey700',
            filter.disabled ? 'opacity-50' : 'cursor-pointer',
            'text-h6 font-weight-bold button-filter rounded-lg d-flex justify-center align-center px-1',
          ]"
          :aria-disabled="filter.disabled"
          @click="selectOption(option)"
        >
          {{ getOptionTitle(option) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SearchFilterOption, SearchFilterState } from '@/types/search'

const props = defineProps<{
  filter: SearchFilterState
}>()

const emit = defineEmits<{
  select: [option: SearchFilterOption | null]
}>()

const selectOption = (option: SearchFilterOption | null) => {
  if (props.filter.disabled) return

  emit('select', option)
}

const getOptionTitle = (option: SearchFilterOption) => {
  if (props.filter.key !== 'test_type' || props.filter.title !== 'Paper') return option.title

  return option.title.replace(/\bpaper\b/gi, '').replace(/\s+/g, ' ').trim() || option.title
}
</script>

<style scoped>
.button-filter{
  height : 30px;
  min-width : 30px;
  border : 1px solid rgb(var(--v-theme-grey300))
}
.search-filter-icon-space {
  width: 28px;
  height: 28px;
}
</style>
