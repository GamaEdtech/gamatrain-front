<template>
  <div class="search-results-list w-100 d-flex flex-column align-center justify-start mt-4 ga-4">
    <template v-if="isInitialLoading">
      <search-card-skeleton
        v-for="(item, index) in 4"
        :key="index"
      />
    </template>

    <template v-if="isPreviousLoading">
      <search-card-skeleton />
    </template>
    <div
      v-if="firstLoadedPageNumber != 1 && !isInitialLoading && !isPreviousLoading"
      class="w-100 d-flex align-center justify-center"
    >
      <v-btn
        class="text-h5 font-weight-bold"
        height="36"
        variant="outlined"
        color="primary"
        rounded="xl"
        @click="loadPreviousPage"
      >
        Load Previous Data
      </v-btn>
    </div>

    <template v-if="!isInitialLoading">
      <template
        v-for="(item, index) in dataList"
        :key="item.id || index"
      >
        <search-card-profile
          v-if="isProfileMode"
          :information="item"
        />
        <search-card
          v-else
          :information="item"
        />
      </template>
    </template>

    <div
      ref="lineSpecifierLoadMoreRef"
      class="line-specifier-load-more"
    />
    <template v-if="isPaginationLoading">
      <search-card-skeleton />
    </template>

    <div
      v-if="!isInitialLoading && dataList.length == 0"
      class="w-100 text-h4 text-center mt-4"
    >
      Opps! no data found
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  dataList: {
    type: Array,
    required: true,
  },
  isInitialLoading: {
    type: Boolean,
    required: true,
  },
  isPaginationLoading: {
    type: Boolean,
    required: true,
  },
  isPreviousLoading: {
    type: Boolean,
    required: true,
  },
  isAllDataLoaded: {
    type: Boolean,
    required: true,
  },
  firstLoadedPageNumber: {
    type: Number,
    required: true,
  },
  isProfileMode: {
    type: Boolean,
  },
})
const emit = defineEmits(['loadNextPage', 'loadPreviousPage'])

const lineSpecifierLoadMoreRef = ref(null)
let scrollContainer = null

onMounted(() => {
  setupScrollListener()
})

onUnmounted(() => {
  const scrollTarget = scrollContainer || window
  scrollTarget.removeEventListener('scroll', handleScrollListener)
})

const setupScrollListener = () => {
  const candidate = lineSpecifierLoadMoreRef.value?.closest('.search-results-scroll-region')
  const candidateOverflow = candidate ? window.getComputedStyle(candidate).overflowY : ''
  scrollContainer = candidate && ['auto', 'scroll'].includes(candidateOverflow)
    ? candidate
    : window
  scrollContainer.addEventListener('scroll', handleScrollListener)
}

const handleScrollListener = () => {
  const targetDiv = lineSpecifierLoadMoreRef.value
  if (!targetDiv) return
  const rect = targetDiv.getBoundingClientRect()
  const viewport = scrollContainer === window
    ? { top: 0, bottom: window.innerHeight }
    : scrollContainer.getBoundingClientRect()
  const isDivInView = rect.top >= viewport.top && rect.bottom <= viewport.bottom

  if (
    isDivInView
    && !props.isInitialLoading
    && !props.isPaginationLoading
    && !props.isAllDataLoaded
  ) {
    emit('loadNextPage')
  }
}

const loadPreviousPage = () => {
  if (props.firstLoadedPageNumber > 1) {
    emit('loadPreviousPage')
  }
}
</script>

<style scoped>
.line-specifier-load-more {
  width: 100%;
  height: 6px;
}
</style>
