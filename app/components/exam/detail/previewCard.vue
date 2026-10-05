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
        <v-tooltip
          activator="parent"
          location="top"
        >
          Views
        </v-tooltip>
        {{ views }}
      </div>
      <div
        v-if="questionNumber"
        class="d-flex flex-column align-center justify-center ga-1 primary-gray-700 cursor-pointer text-no-wrap"
      >
        <v-icon color="primary-gray-700">
          md:question_mark
        </v-icon>
        <v-tooltip
          activator="parent"
          location="top"
        >
          Number of questions
        </v-tooltip>
        {{ questionNumber }}
      </div>
      <div
        v-if="level"
        class="d-flex flex-column align-center justify-center ga-1 primary-gray-700 cursor-pointer text-no-wrap"
      >
        <v-icon color="primary-gray-700">
          md:device_thermostat
        </v-icon>
        <v-tooltip
          activator="parent"
          location="top"
        >
          Difficulty level
        </v-tooltip>
        {{ level }}
      </div>
      <common-bookmark-button
        v-if="hasSave"
        :id="id"
        type="exams"
      />
      <div
        v-if="hasShare"
        class="d-flex flex-column align-center justify-center ga-1 primary-gray-700 cursor-pointer text-no-wrap"
        @click="shareContent"
      >
        <v-icon color="primary-gray-700">
          md:share
        </v-icon>
        <v-tooltip
          activator="parent"
          location="top"
        >
          Share
        </v-tooltip>
      </div>
    </div>

    <div
      class="w-100 d-flex justify-center align-center position-relative"
    >
      <template v-if="thumbPic">
        <img
          width="170"
          :src="thumbPic"
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
interface IPreviewCard {
  id: string
  title: string
  views?: number | string
  hasShare?: boolean
  hasSave?: boolean
  questionNumber?: number | string
  level?: number | string
  thumbPic: string
}

withDefaults(defineProps<IPreviewCard>(), {
  hasShare: true,
  hasSave: true,
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
