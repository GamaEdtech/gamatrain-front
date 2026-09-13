<template>
  <div class="w-100 h-100 d-flex flex-column align-start justify-start px-2 pa-md-0">
    <template v-if="loadingGetItemById">
      <user-exam-result-header-skeleton />
      <user-exam-result-overview-skeleton />
      <user-exam-result-summary-skeleton />
      <user-exam-result-answers-skeleton />
    </template>
    <template v-else>
      <user-exam-result-header
        :content-data="contentData"
      />

      <user-exam-result-overview
        :content-data="contentData"
      />

      <user-exam-result-summary
        :answer-stats="contentData?.answerStats"
        :rank="contentData?.rank"
      />

      <user-exam-result-answers
        :questions="contentData?.result"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import type {
  ExamResultDetailDTO,
} from '@/types'

definePageMeta({
  layout: 'dashboard-layout',
  middleware: ['auth'],
})

useSeoMeta({
  title: 'Exam Result',
})

const route = useRoute()

const {
  getItemById,
  loadingGetItemById,
} = useExamResult()

const resultId = computed(() => String(route.params.id))
const contentData = ref<ExamResultDetailDTO | null>(null)

const fetchResult = async () => {
  const response = await getItemById(resultId.value)
  if (response.status == 1 && response.data) {
    contentData.value = response.data
  }
}

onMounted(() => {
  fetchResult()
})
</script>
