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
    </template>

    <!-- <div
      ref="contentRef"
      class="w-100 d-flex flex-column align-start justify-start"
    >
      <v-card
        v-if="contentData"
        class="w-100 mt-4 pa-4"
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
              md:donut_large
            </v-icon>
            <span class="text-h5 text-grey700 font-weight-bold">Result Summary</span>
          </div>

          <span class="text-grey500 text-h6">
            {{ totalStats.percent }}% score
          </span>
        </div>

        <div class="w-100 d-flex flex-wrap ga-3 mt-4">
          <v-card
            class="pa-4 d-flex flex-column align-center justify-center ga-3 flex-grow-1"
            color="grey50"
            flat
            rounded="lg"
            border
            min-width="260"
          >
            <v-progress-circular
              :model-value="totalStats.percent"
              :size="150"
              :width="16"
              color="success"
              bg-color="grey200"
            >
              <div class="d-flex flex-column align-center justify-center">
                <span class="text-grey800 text-h3 font-weight-bold">{{ totalStats.percent }}%</span>
                <span class="text-grey500 text-h6">Score</span>
              </div>
            </v-progress-circular>

            <div class="w-100 d-flex flex-column ga-2">
              <div
                v-for="item in statItems"
                :key="item.label"
                class="w-100 d-flex align-center ga-2"
              >
                <v-icon
                  :color="item.color"
                  size="12"
                >
                  md:circle
                </v-icon>
                <span class="text-grey600 text-h6">{{ item.label }}</span>
                <span class="text-grey800 text-h6 font-weight-bold ml-auto">
                  {{ item.value }}
                </span>
              </div>
            </div>
          </v-card>

          <v-card
            class="pa-4 d-flex flex-column ga-4 flex-grow-1"
            color="grey50"
            flat
            rounded="lg"
            border
            min-width="280"
          >
            <div
              v-for="lesson in lessonStats"
              :key="lesson.title"
              class="w-100 d-flex flex-column"
            >
              <div class="d-flex align-center justify-space-between ga-2">
                <span class="text-grey800 text-h6 font-weight-bold">
                  {{ lesson.title }}
                </span>
                <span class="text-grey500 text-h6">
                  {{ lesson.percent }}%
                </span>
              </div>
              <v-progress-linear
                :model-value="lesson.percent"
                color="success"
                bg-color="grey100"
                height="8"
                rounded
                class="mt-2"
              />
              <div class="d-flex align-center flex-wrap ga-2 mt-2 text-grey500 text-h6">
                <span>{{ lesson.num }} Questions</span>
                <span>{{ lesson.true }} Correct</span>
                <span>{{ lesson.false }} Wrong</span>
                <span>{{ lesson.noanswer }} No answer</span>
              </div>
            </div>

            <div class="w-100 d-flex flex-wrap ga-2">
              <v-card
                v-for="rank in rankItems"
                :key="rank.label"
                class="pa-3 d-flex flex-column ga-1 flex-grow-1"
                color="white"
                flat
                rounded="lg"
                border
                min-width="150"
              >
                <span class="text-grey500 text-h6 font-weight-medium">{{ rank.label }}</span>
                <span class="text-grey800 text-h5 font-weight-bold">{{ rank.value }}</span>
              </v-card>
            </div>
          </v-card>
        </div>
      </v-card>

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

// const totalStats = computed(() => {
//   return contentData.value?.answerStats.total || {
//     num: 0,
//     true: 0,
//     false: 0,
//     noAnswer: 0,
//     percent: 0,
//   }
// })

// const statItems = computed(() => [
//   { label: 'Correct answers', value: totalStats.value.true, color: 'success' },
//   { label: 'Wrong answers', value: totalStats.value.false, color: 'error' },
//   { label: 'No answer', value: totalStats.value.noAnswer, color: 'grey300' },
// ])

// const lessonStats = computed(() => {
//   return Object.values(contentData.value?.answerStats.lessons || {})
// })

// const rankItems = computed(() => {
//   const rank = contentData.value?.rank

//   return [
//     { label: 'Country rank', value: formatRank(rank?.total) },
//     { label: 'State rank', value: formatRank(rank?.state) },
//     { label: 'Area rank', value: formatRank(rank?.area) },
//   ]
// })

// const formatRank = (rank?: { user: number, total: string }) => {
//   if (!rank) return '-'
//   return `${rank.user} of ${rank.total}`
// }

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
