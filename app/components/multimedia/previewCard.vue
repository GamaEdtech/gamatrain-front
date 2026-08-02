<template>
  <div class="w-100 container-slider-button bg-grey100 rounded-lg d-flex">
    <div
      class="button-div d-flex flex-column align-center justify-center ga-8 px-4"
    >
      <div
        v-if="views"
        class="d-flex flex-column align-center justify-center ga-1 primary-gray-700 cursor-pointer text-no-wrap"
      >
        <v-icon color="primary-gray-700">
          md:visibility
        </v-icon>
        {{ views }}
      </div>
      <div
        v-if="score"
        class="d-flex flex-column align-center justify-center ga-1 primary-gray-700 cursor-pointer text-no-wrap"
      >
        <v-icon color="primary-gray-700">
          md:star
        </v-icon>
        {{ score }}
      </div>
      <div
        v-if="pageCount"
        class="d-flex flex-column align-center justify-center ga-1 primary-gray-700 cursor-pointer text-no-wrap"
      >
        <v-icon color="primary-gray-700">
          md:book_ribbon
        </v-icon>
        {{ pageCount }}
      </div>
      <div
        v-if="hasShare"
        class="d-flex flex-column align-center justify-center ga-1 primary-gray-700 cursor-pointer text-no-wrap"
        @click="shareContent"
      >
        <v-icon color="primary-gray-700">
          md:share
        </v-icon>
        Share
      </div>
    </div>

    <div
      class="w-100 d-flex justify-center align-center position-relative"
    >
      <template v-if="previewData && previewData.preview && previewData.preview.length > 0">
        <video
          v-if="previewData.type == 'video'"
          class="main-image-paper"
          height="200"
          controls
          :src="previewData.preview[0]"
          :alt="title"
        />
        <v-carousel
          v-if="previewData.type == 'slide'"
          height="400"
          hide-delimiters
          show-arrows
        >
          <template #prev="{ props }">
            <v-btn
              color="grey700"
              variant="outlined"
              size="24"
              flat
              icon
              @click="props.onClick"
            >
              <v-icon>md:chevron_left</v-icon>
            </v-btn>
          </template>
          <template #next="{ props }">
            <v-btn
              color="grey700"
              variant="outlined"
              size="24"
              flat
              icon
              @click="props.onClick"
            >
              <v-icon>md:chevron_right</v-icon>
            </v-btn>
          </template>
          <v-carousel-item
            v-for="(slide, i) in previewData.preview"
            :key="i"
          >
            <div class="w-100 h-100 d-flex align-center">
              <img
                :src="slide"
                class="main-image-paper"
                height="200"
                :alt="title"
                :preload="i == 0"
                :fetchpriority="i == 0 ? `high`:`low`"
                :loading="i == 0 ? `eager` : `lazy`"
              >
            </div>
          </v-carousel-item>
        </v-carousel>

        <img
          v-if="previewData.type == 'pdf'"
          width="170"
          :src="previewData.preview[0]"
          :alt="title"
          class="w-100 h-100 cover-image"
          preload
          fetchpriority="high"
          loading="eager"
        >
      </template>

      <span
        v-else
        class="text-h5 text-center font-weight-bold text-grey700"
      >
        No visual preview available
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MultimediaPreviewDataDTO } from '@/types'

interface IPreviewCard {
  id: string
  title: string
  views?: number | string
  score?: string | number
  pageCount?: string | number
  hasShare?: boolean
  previewData: MultimediaPreviewDataDTO
}

withDefaults(defineProps<IPreviewCard>(), {
  hasShare: true,
})
const emit = defineEmits(['share'])

const shareContent = () => {
  emit('share')
}
</script>

<style scoped>
.container-slider-button {
  border: 1px solid rgb(var(--v-theme-grey300));
  max-width: 360px;
  height: 100%;
  min-height: 400px;
  max-height: 400px;
}
.button-div {
  min-width: 60px;
  border: 1px solid rgb(var(--v-theme-grey300));
}

.main-image-paper {
  max-width : 100%
}
.cover-image {
  object-fit: cover;
}
</style>
