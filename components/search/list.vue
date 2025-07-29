<template>
  <div class="w-100 d-flex flex-column align-center justify-start mt-4 ga-4">
    <template v-if="isInitialLoading">
      <search-card-skeleton
        v-for="(item, index) in 4"
        :key="index"
      />
    </template>

    <template v-if="!isInitialLoading">
      <template
        v-for="(item, index) in dataList"
        :key="item.id || index"
      >
        <search-card :information="item" />
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
      class="w-100 text-h4 text-center"
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
  isAllDataLoaded: {
    type: Boolean,
    required: true,
  },
})
const emit = defineEmits(['loadNextPage'])

const lineSpecifierLoadMoreRef = ref(null)

onMounted(() => {
  setupScrollListener()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScrollListener)
})

const setupScrollListener = () => {
  window.addEventListener('scroll', handleScrollListener)
}

const handleScrollListener = () => {
  const targetDiv = lineSpecifierLoadMoreRef.value
  const rect = targetDiv.getBoundingClientRect()
  const isDivInView = rect.top >= 0 && rect.bottom <= window.innerHeight

  if (
    isDivInView
    && !props.isInitialLoading
    && !props.isPaginationLoading
    && !props.isAllDataLoaded
  ) {
    emit('loadNextPage')
  }
}
</script>

<style scoped>
.line-specifier-load-more {
  width: 100%;
  height: 6px;
}
</style>
