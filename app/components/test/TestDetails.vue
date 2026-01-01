<template>
  <div class="w-100 d-flex flex-column align-start justify-start pa-4">
    <div
      v-if="showChips"
      class="w-100 d-flex align-center ga-2 flex-wrap"
    >
      <v-chip
        v-if="contentData.section_title"
        variant="flat"
        class="text-subtitle-1 text-sm-h5 px-3"
        color="grey100"
        :to="`/search?type=paper&section=${contentData.section}`"
      >
        <span class="text-grey500">{{ contentData?.section_title }}</span>
      </v-chip>
      <v-chip
        v-if="contentData.base_title"
        variant="flat"
        class="text-subtitle-1 text-sm-h5 px-3"
        color="grey100"
        :to="`/search?type=paper&section=${contentData.section}&base=${contentData.base}`"
      >
        <span class="text-grey500">{{ contentData?.base_title }}</span>
      </v-chip>
      <v-chip
        v-if="contentData.lesson_title"
        variant="flat"
        class="text-subtitle-1 text-sm-h5 px-3"
        color="grey100"
        :to="`/search?type=paper&section=${contentData.section}&base=${contentData.base}&lesson=${
          contentData.lesson
        }`"
      >
        <span class="text-grey500">{{ contentData.lesson_title }}</span>
      </v-chip>
      <v-chip
        v-if="contentData.topic_title"
        variant="flat"
        class="text-subtitle-1 text-sm-h5 px-3"
        color="grey100"
        :to="`/search?type=paper&section=${contentData.section}&base=${contentData.base}&lesson=${
          contentData.lesson
        }&topic=${contentData.topic}`"
      >
        <span class="text-grey500">{{ contentData.topic_title }}</span>
      </v-chip>
    </div>
    <div
      v-if="showTitle"
      class="text-h4 font-weight-bold text-grey600 mt-4"
    >
      Question:
    </div>

    <div
      ref="textQuestionRef"
      class="container-question w-100 d-flex flex-column align-start justift-start mt-6"
    >
      <div
        class="text-h4 text-grey800"
        v-html="contentData.question"
      />
      <img
        v-if="contentData.q_file && contentData.q_file != '0'"
        class="answer-img mt-1"
        :src="contentData.q_file"
        alt="Question Image"
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QuestionDTO } from '~/types/api'

interface ITestDetail {
  contentData: QuestionDTO
  showChips?: boolean
  showTitle?: boolean
}

const { $renderMathInElement, $ensureMathJaxReady } = useNuxtApp()
const props = defineProps<ITestDetail>()

console.log('props', props.contentData)

const textQuestionRef = ref<HTMLElement>()

onMounted(async () => {
  await $ensureMathJaxReady?.()
  if (textQuestionRef.value) {
    $renderMathInElement?.(textQuestionRef.value)
  }
})
</script>

<style scoped>
.answer-img {
  max-height: 15rem;
  width: auto;
}
</style>
