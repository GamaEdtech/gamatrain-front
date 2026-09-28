<template>
  <v-container class="mt-16 d-flex flex-column align-start justify-start">
    <template v-if="loadingGetItemById">
      <user-exam-result-header-skeleton />
      <user-exam-result-overview-skeleton />
      <user-exam-result-summary-skeleton />
      <user-exam-result-answers-skeleton />
    </template>
    <template v-else-if="contentData">
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
  </v-container>
</template>

<script setup lang="ts">
import type {
  ExamResultDetailDTO,
} from '@/types'

definePageMeta({
  middleware: ['auth'],
})

useSeoMeta({
  title: 'Exam Result',
})

const route = useRoute()
const { getUserToken } = useAuth()

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

    const authToken = getUserToken() ?? ''
    try {
      await useApiService.post('/api/v2/games/exams/points',
        { id: resultId.value },
        {
          headers: {
            SecretKey: authToken,
          },
        },
      )
    }
    catch (error) {
      console.warn('Fetch failed but continuing...', error)
    }
  }
}

onMounted(() => {
  fetchResult()
})
</script>
