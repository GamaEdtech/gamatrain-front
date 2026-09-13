<template>
  <div class="w-100 h-100 d-flex flex-column align-start justify-start px-2 pa-md-0">
    <div v-if="loadingGetItemById">
      loading
    </div>
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
    </template>

    <!-- <div
      ref="contentRef"
      class="w-100 d-flex flex-column align-start justify-start"
    >
      <v-card
        v-if="contentData"
        class="w-100 mt-4 mb-8 pa-4"
        flat
        rounded="lg"
        border
      >
        <div class="w-100 d-flex align-center justify-space-between ga-2 flex-wrap">
          <div class="d-flex align-center ga-2">
            <v-icon
              color="primary"
              size="24"
            >
              md:quiz
            </v-icon>
            <span class="text-h5 text-grey700 font-weight-bold">Questions</span>
          </div>

          <span class="text-grey500 text-h6">
            {{ contentData.result.length }} items
          </span>
        </div>

        <div class="w-100 d-flex flex-column ga-3 mt-4">
          <v-card
            v-for="(question, index) in contentData.result"
            :key="question.id"
            class="w-100 pa-4"
            color="grey50"
            flat
            rounded="lg"
            border
          >
            <div class="w-100 d-flex align-center justify-space-between ga-2 flex-wrap">
              <div class="d-flex align-center ga-2 min-w-0">
                <v-avatar
                  color="primary"
                  rounded="lg"
                  size="32"
                  class="text-grey800 text-h6 font-weight-bold"
                >
                  {{ index + 1 }}
                </v-avatar>
                <div class="min-w-0">
                  <div class="text-grey800 text-h6 font-weight-bold text-truncate">
                    {{ question.lesson_title }}
                  </div>
                  <div class="text-grey500 text-h6 text-truncate">
                    {{ question.topics_title }}
                  </div>
                </div>
              </div>

              <v-chip
                :color="getQuestionChipColor(question)"
                variant="flat"
                size="small"
                class="font-weight-bold"
              >
                {{ getQuestionStatusText(question) }}
              </v-chip>
            </div>

            <div
              class="text-grey700 text-h5 font-weight-semibold mt-4"
              :dir="question.direction"
              v-html="question.question"
            />
            <img
              v-if="isValidFile(question.q_file)"
              class="w-100 mt-2 rounded-lg"
              :src="question.q_file || ''"
              alt="Question Image"
            >

            <div class="w-100 d-flex flex-column align-start justify-start mt-4 ga-4">
              <div
                v-for="answer in getAnswers(question)"
                :key="answer.key"
                class="w-100 d-flex flex-column align-start ga-2"
              >
                <div class="w-100 d-flex flex-nowrap align-start ga-3">
                  <v-avatar
                    rounded="lg"
                    size="28"
                    :color="getChoiceColor(question, answer.key)"
                    class="flex-shrink-0 border-md border-solid border-opacity-100"
                  >
                    <span
                      v-if="getChoiceStatus(question, answer.key) === 'default'"
                      class="text-grey800 text-h6 font-weight-bold"
                    >
                      {{ answer.key }}
                    </span>
                    <v-icon
                      v-else-if="getChoiceStatus(question, answer.key) === 'success'"
                      color="white"
                      size="20"
                    >
                      md:check
                    </v-icon>
                    <v-icon
                      v-else-if="getChoiceStatus(question, answer.key) === 'error'"
                      color="white"
                      size="20"
                    >
                      md:close
                    </v-icon>
                    <v-icon
                      v-else
                      color="success"
                      size="20"
                    >
                      md:radio_button_unchecked
                    </v-icon>
                  </v-avatar>

                  <div
                    class="flex-grow-1 text-grey800 text-h5 font-weight-regular overflow-x-auto overflow-y-hidden"
                    v-html="answer.text"
                  />
                </div>
                <img
                  v-if="isValidFile(answer.file)"
                  class="w-100 mt-1 rounded-lg"
                  :src="answer.file || ''"
                  alt="Answer Image"
                >
              </div>
            </div>
          </v-card>
        </div>
      </v-card>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import type {
  ExamResultDetailDTO,
  // ExamResultQuestionDTO
} from '@/types'

// interface AnswerItem {
//   key: string
//   text: string
//   file: string | null
// }

definePageMeta({
  layout: 'dashboard-layout',
  middleware: ['auth'],
})

useSeoMeta({
  title: 'Exam Result',
})

const route = useRoute()
// const { $renderMathInElement, $ensureMathJaxReady } = useNuxtApp()
const {
  getItemById,
  loadingGetItemById,
} = useExamResult()

const resultId = computed(() => String(route.params.id))
// const contentRef = ref<HTMLElement>()
const contentData = ref<ExamResultDetailDTO | null>(null)

const fetchResult = async () => {
  const response = await getItemById(resultId.value)
  if (response.status == 1 && response.data) {
    contentData.value = response.data
  }
}

// const isValidFile = (file?: string | null) => {
//   return Boolean(file && file !== '0')
// }

// const getAnswers = (question: ExamResultQuestionDTO): AnswerItem[] => {
//   return [
//     { key: '1', text: question.answer_a, file: question.a_file },
//     { key: '2', text: question.answer_b, file: question.b_file },
//     { key: '3', text: question.answer_c, file: question.c_file },
//     { key: '4', text: question.answer_d, file: question.d_file },
//   ].filter(answer => answer.text || isValidFile(answer.file))
// }

// const getChoiceStatus = (question: ExamResultQuestionDTO, choice: string) => {
//   if (question.true_answer === choice && question.user_answer === choice) return 'success'
//   if (question.user_answer === choice && question.true_answer !== choice) return 'error'
//   if (question.true_answer === choice) return 'correct'

//   return 'default'
// }

// const getChoiceColor = (question: ExamResultQuestionDTO, choice: string) => {
//   const status = getChoiceStatus(question, choice)

//   if (status === 'success') return 'success'
//   if (status === 'error') return 'error'
//   if (status === 'correct') return 'successLight'

//   return 'white'
// }

// const getQuestionStatusText = (question: ExamResultQuestionDTO) => {
//   if (!question.user_answer || question.user_answer === '0') return 'No answer'
//   return question.user_answer === question.true_answer ? 'Correct' : 'Wrong'
// }

// const getQuestionChipColor = (question: ExamResultQuestionDTO) => {
//   if (!question.user_answer || question.user_answer === '0') return 'grey300'
//   return question.user_answer === question.true_answer ? 'success' : 'error'
// }

// const startDownload = async () => {
//   const examId = contentData.value?.exam.id
//   if (!examId) return

// const response = await downloadAnswerKey(examId)
// if (response.succeeded && response.data) {
//   const FileSaver = await import('file-saver')
//   FileSaver.saveAs(response.data.url, response.data.name)
// }
// }

// const renderMath = async () => {
//   if (!import.meta.client || !contentRef.value) return

//   await nextTick()
//   await $ensureMathJaxReady?.()
//   $renderMathInElement?.(contentRef.value)
// }

// watch(
//   () => contentData.value,
//   () => {
//     renderMath()
//   },
//   { immediate: true },
// )

onMounted(() => {
  fetchResult()
})
</script>
