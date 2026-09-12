<template>
  <div class="w-100 d-flex align-center justify-space-between ga-2 mt-4 flex-wrap">
    <div class="d-flex flex-column align-start">
      <h1 class="text-h4 text-grey700 font-weight-regular">
        Exam Result
      </h1>
      <span
        v-if="contentData?.exam.title"
        class="text-grey500 text-h6 mt-1"
      >
        {{ contentData?.exam.title }}
      </span>
    </div>

    <v-btn
      v-if="contentData?.exam.file_pdf"
      rounded="pill"
      color="primary"
      flat
      height="36"
    >
      <v-icon
        color="grey800"
        size="20"
      >
        md:download
      </v-icon>
      <span class="text-grey800 font-weight-bold text-h6">
        {{ downloadButtonText }}
      </span>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import type { ExamResultDetailDTO } from '@/types'

const props = defineProps<{
  contentData: ExamResultDetailDTO | null
}>()

const downloadButtonText = computed(() => {
  const price = props.contentData?.price.price || 0
  return `Download key | ${price > 0 ? `$${price}` : 'Free'}`
})
</script>
