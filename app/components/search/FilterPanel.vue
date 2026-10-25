<template>
  <v-sheet
    rounded="lg"
    class="py-4 px-2 bg-white elevation-1 main-sheet-filter"
  >
    <div class="d-flex align-center justify-space-between mb-4">
      <button
        type="button"
        class="d-flex align-center ga-2 pa-0 bg-transparent border-0 text-left"
        @click="openMobileDialog"
      >
        <v-icon
          size="20"
          color="grey700"
        >
          md:tune
        </v-icon>
        <span class="text-subtitle-1 font-weight-bold text-grey800">Filters</span>
      </button>

      <v-btn
        variant="text"
        color="lightError"
        size="small"
        class="text-none text-subtitle-1"
        @click="resetFilters"
      >
        Clear
      </v-btn>
    </div>

    <div class="d-none d-md-flex flex-column ga-3">
      <template
        v-for="filter in visibleFilters"
        :key="filter.key"
      >
        <search-filter-button-options
          v-if="usesButtonOptions(filter)"
          :filter="filter"
          @select="selectFilter(filter.key, $event)"
        />
        <search-filter-trigger
          v-else
          :filter="filter"
          @select="selectFilter(filter.key, $event)"
          @clear="clearFilter(filter.key)"
        />
      </template>
    </div>

    <div class="mobile-filter-scroller d-flex d-md-none ga-2 overflow-x-auto pb-1">
      <div
        v-for="filter in visibleFilters"
        :key="filter.key"
        class="mobile-filter-item flex-shrink-0"
      >
        <search-filter-trigger
          :filter="filter"
          @select="selectFilter(filter.key, $event)"
          @clear="clearFilter(filter.key)"
        />
      </div>
    </div>

    <v-dialog
      v-model="isMobileDialogOpen"
      fullscreen
      transition="dialog-bottom-transition"
    >
      <v-card class="bg-grey25">
        <v-toolbar
          color="white"
          density="comfortable"
          flat
        >
          <v-toolbar-title class="text-h5 font-weight-bold text-grey800">
            Filters
          </v-toolbar-title>

          <v-btn
            variant="text"
            color="lightError"
            class="text-none text-h6 pa-0"
            @click="resetFilters"
          >
            Clear
          </v-btn>
          <v-btn
            variant="text"
            color="grey600"
            size="20"
            @click="isMobileDialogOpen = false"
          >
            <v-icon>md:close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="pa-4">
          <div class="d-flex flex-column ga-3">
            <template
              v-for="filter in visibleFilters"
              :key="`modal-${filter.key}`"
            >
              <search-filter-button-options
                v-if="usesButtonOptions(filter)"
                :filter="filter"
                @select="selectFilter(filter.key, $event)"
              />
              <search-filter-trigger
                v-else
                :filter="filter"
                @select="selectFilter(filter.key, $event)"
                @clear="clearFilter(filter.key)"
              />
            </template>
          </div>
        </v-card-text>

        <v-card-actions class="pa-4 bg-white">
          <v-btn
            block
            color="primary"
            rounded="xl"
            height="44"
            class="text-none font-weight-bold"
            :loading="resultsLoading"
            @click="isMobileDialogOpen = false"
          >
            Show results ({{ formattedResultsCount }})
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-sheet>
</template>

<script setup lang="ts">
import type { SearchFilterKey, SearchFilterOption, SearchFilterState } from '@/types/search'
import { useDisplay } from 'vuetify'

const emit = defineEmits<{
  selectFilter: [key: SearchFilterKey, option: SearchFilterOption | null]
  reset: []
}>()

const props = withDefaults(defineProps<{
  filters: SearchFilterState[]
  resultsCount?: number | string
  resultsLoading?: boolean
}>(), {
  resultsCount: 0,
  resultsLoading: false,
})

const { mdAndUp } = useDisplay()
const { $numberFormat } = useNuxtApp()
const visibleFilters = computed(() => props.filters.filter(filter => filter.key !== 'type'))
const formattedResultsCount = computed(() => $numberFormat(props.resultsCount || 0))
const isMobileDialogOpen = ref(false)

const usesButtonOptions = (filter: SearchFilterState) =>
  filter.key === 'variant' || (filter.key === 'test_type' && filter.title === 'Paper')

const selectFilter = (key: SearchFilterKey, option: SearchFilterOption | null) => {
  emit('selectFilter', key, option)
}

const clearFilter = (key: SearchFilterKey) => {
  emit('selectFilter', key, null)
}

const resetFilters = () => {
  emit('reset')
}

const openMobileDialog = () => {
  if (mdAndUp.value) return

  isMobileDialogOpen.value = true
}
</script>

<style scoped>
.main-sheet-filter{
  border : 1px solid rgb(var(--v-theme-grey200))
}

@media (min-width: 960px) {
  .main-sheet-filter {
    max-height: calc(100dvh - 74px);
    overflow-y: auto;
    scrollbar-color: rgb(var(--v-theme-grey300)) transparent;
    scrollbar-width: thin;
  }

  .main-sheet-filter::-webkit-scrollbar {
    width: 4px;
  }

  .main-sheet-filter::-webkit-scrollbar-thumb {
    background: rgb(var(--v-theme-grey300));
    border-radius: 999px;
  }

  .main-sheet-filter::-webkit-scrollbar-track {
    background: transparent;
  }
}

.mobile-filter-item {
  width: 180px;
}

.mobile-filter-scroller {
  scrollbar-color: rgb(var(--v-theme-grey300)) transparent;
  scrollbar-width: thin;
}

.mobile-filter-scroller::-webkit-scrollbar {
  height: 4px;
}

.mobile-filter-scroller::-webkit-scrollbar-thumb {
  background: rgb(var(--v-theme-grey300));
  border-radius: 999px;
}

.mobile-filter-scroller::-webkit-scrollbar-track {
  background: transparent;
}
</style>
