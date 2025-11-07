<template>
  <div :class="`main-list-school-div ${isExpanded ? `` : `closed-list`}`">
    <div
      v-if="pageNumberForLoadPreviousData != 1 && !isInitialLoading"
      class="container-button-load-previous-data"
    >
      <v-btn
        class="text-h5 text-md-h4"
        height="50"
        variant="outlined"
        color="#ffb300"
        rounded="xl"
        @click="loadPreviousPage"
      >
        Load Previous Data
      </v-btn>
    </div>
    <div
      ref="scrollDivRef"
      :class="`container-list-div ${
        pageNumberForLoadPreviousData != 1 ? `adjust-height` : ``
      }`"
    >
      <div class="container-scroll">
        <template v-if="isInitialLoading">
          <CardSchoolSkeleton
            v-for="item in 4"
            :key="item"
          />
        </template>

        <CardSchoolSkeleton v-if="isPaginationPreviousLoading" />

        <template v-for="school in schoolList">
          <CardSchool
            v-if="!isInitialLoading"
            :key="school"
            :school="school"
          />
        </template>

        <div
          ref="lineSpecifierLoadMoreRef"
          class="line-specifier-load-more"
        />

        <CardSchoolSkeleton v-if="isPaginationLoading" />
        <div
          v-if="!isInitialLoading && schoolList.length == 0"
          class="not-found-div"
        >
          Opps! no data found
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import CardSchool from './CardSchool.vue'
import CardSchoolSkeleton from './CardSchoolSkeleton.vue'

const props = defineProps({
  schoolList: {
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
  isPaginationPreviousLoading: {
    type: Boolean,
    required: true,
  },
  isAllDataLoaded: {
    type: Boolean,
    required: true,
  },
  isExpanded: {
    type: Boolean,
    required: true,
  },
  pageNumberForLoadPreviousData: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['loadNextPage', 'loadPreviousPage'])

const lineSpecifierLoadMoreRef = ref(null)
const scrollDivRef = ref(null)

onMounted(() => {
  setupScrollListener()
})

onUnmounted(() => {
  if (scrollDivRef.value) {
    scrollDivRef.value.removeEventListener('scroll', handleScrollListener)
  }
})

const setupScrollListener = () => {
  scrollDivRef.value.addEventListener('scroll', handleScrollListener)
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

const loadPreviousPage = () => {
  emit('loadPreviousPage')
}
</script>

<style scoped>
@import "../../assets/scss/school/list.scss";
</style>
