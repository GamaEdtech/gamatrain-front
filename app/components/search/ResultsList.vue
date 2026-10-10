<template>
  <v-infinite-scroll
    ref="infiniteScroll"
    class="w-100 search-results-infinite"
    mode="intersect"
    side="end"
    margin="80"
    @load="loadNextResults"
  >
    <v-row class="w-100 my-0 mx-0 justify-start flex-0-1">
      <template v-if="isInitialLoading">
        <v-col
          v-for="item in 4"
          :key="item"
          cols="12"
          class="px-0"
        >
          <SearchCardSkeleton />
        </v-col>
      </template>

      <template v-else>
        <v-col
          v-if="firstLoadedPage > 1"
          cols="12"
          class="d-flex justify-center"
        >
          <v-btn
            flat
            rounded="lg"
            color="grey200"
            class="text-grey700"
            :loading="isPreviousLoading"
            @click="emit('loadPrevious')"
          >
            <v-icon
              color="grey500"
              size="20"
              class="mr-1"
            >
              md:keyboard_arrow_up
            </v-icon>
            Load previous results
          </v-btn>
        </v-col>

        <template v-if="isPreviousLoading">
          <v-col
            v-for="item in 2"
            :key="`previous-${item}`"
            cols="12"
            class="px-0"
          >
            <SearchCardSkeleton />
          </v-col>
        </template>

        <v-col
          v-if="items.length === 0 && isAllDataLoaded"
          cols="12"
        >
          <div class="w-100 d-flex flex-column align-center justify-center ga-4 pa-8 rounded-lg empty-results">
            <v-icon
              color="grey300"
              size="48"
            >
              md:search_off
            </v-icon>
            <div class="d-flex flex-column align-center ga-1 text-center">
              <span class="text-h4 font-weight-bold text-grey700">
                No results found
              </span>
              <span class="text-h6 font-weight-regular text-grey500">
                Try changing the selected filters.
              </span>
            </div>
          </div>
        </v-col>

        <v-col
          v-for="item in items"
          :key="item.id"
          cols="12"
          class="px-0"
        >
          <SearchCard :information="item" />
        </v-col>
      </template>
    </v-row>

    <template #loading>
      <v-row
        v-if="items.length > 0 && !isInitialLoading"
        class="w-100 my-1 mx-0 justify-start flex-0-1"
      >
        <v-col
          v-for="item in 2"
          :key="item"
          cols="12"
          class="px-0"
        >
          <SearchCardSkeleton />
        </v-col>
      </v-row>
    </template>

    <template #error="{ props: errorProps }">
      <div class="w-100 d-flex justify-center my-4">
        <v-btn
          v-bind="errorProps"
          flat
          rounded="lg"
          color="grey200"
          class="text-grey700"
        >
          Couldn't load more results. Try again
        </v-btn>
      </div>
    </template>

    <template #empty>
      <div />
    </template>
  </v-infinite-scroll>
</template>

<script setup lang="ts">
import type { SearchResourceItem } from '@/types/search'

type InfiniteScrollStatus = 'ok' | 'empty' | 'loading' | 'error'

interface InfiniteScrollLoadOptions {
  done: (status: InfiniteScrollStatus) => void
}

const infiniteScroll = ref<{ reset: () => void } | null>(null)

const props = defineProps<{
  items: SearchResourceItem[]
  isInitialLoading: boolean
  isPaginationLoading: boolean
  isPreviousLoading: boolean
  isAllDataLoaded: boolean
  firstLoadedPage: number
}>()

const emit = defineEmits<{
  loadNext: [done: (status: InfiniteScrollStatus) => void]
  loadPrevious: []
}>()

const loadNextResults = async ({ done }: InfiniteScrollLoadOptions) => {
  if (props.isInitialLoading || props.isPaginationLoading || props.items.length === 0) {
    done('ok')
    return
  }

  if (props.isAllDataLoaded) {
    done('empty')
    return
  }

  emit('loadNext', done)
}

const reset = () => {
  infiniteScroll.value?.reset()
}

defineExpose({
  reset,
})
</script>

<style scoped>
:deep(.search-results-infinite .v-infinite-scroll__side) {
  padding: 0;
}

.empty-results {
  min-height: 220px;
  border: 1px solid rgb(var(--v-theme-grey200));
}
</style>
