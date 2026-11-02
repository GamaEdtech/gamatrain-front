<template>
  <!-- A question to answer in place, in the exam details sample-question card. It comes from the content's own online
       test when there is one (rendered on the server), otherwise it is a random one from the same subject, shown only
       once one is found: it sits far below the fold, and a placeholder that later vanished would shift the page. -->
  <section
    v-if="question"
    aria-labelledby="practice-question-title"
  >
    <h2
      id="practice-question-title"
      class="gama-text-h4 text-brandNavy"
    >
      {{ heading }}
    </h2>
    <p class="text-h5 text-grey500 mt-1 mb-4">
      Pick an answer to check it right here.
    </p>

    <v-card
      rounded="lg"
      border
      elevation="0"
      class="pa-4 pa-sm-5"
    >
      <exam-detail-sample-question
        :question="question"
        :number="1"
      />
    </v-card>

    <v-btn
      v-if="examId"
      color="primary"
      size="large"
      rounded="lg"
      class="mt-4 text-none"
      @click="startExam"
    >
      Start the full test for your score
    </v-btn>
  </section>
</template>

<script setup lang="ts">
import type { ExamSampleQuestionDTO } from '@/types'

const props = defineProps<{
  /** The content's published online test: its first sample question is used, and Start opens it. */
  examId?: string
  /** For a random question from the subject when there is no test. */
  lesson?: string
  /** The content's own topic, tried first; most papers have none. */
  topic?: string
  /** The subject's name for the heading, e.g. "Mathematics 7". */
  subject?: string
}>()

const { startExam } = useExamStart(() => props.examId ?? '')
const { loadFromExam, loadRandom } = usePracticeQuestion()

const heading = computed(() => {
  if (props.examId) return 'Try a question from this paper'
  return props.subject ? `Try a ${props.subject} question` : 'Try a practice question'
})

// The test's question is the same for every visitor, so it is rendered on the server: crawlers index its text and
// its link with the page, and the card doesn't pop in after load.
const { data: examQuestion } = await useAsyncData(
  () => `practice-question-exam-${props.examId ?? 'none'}`,
  async () => {
    if (!props.examId) return null
    try {
      return await loadFromExam(props.examId)
    }
    catch {
      return null
    }
  },
)

const randomQuestion = ref<ExamSampleQuestionDTO | null>(null)
const question = computed(() => (props.examId ? examQuestion.value ?? null : randomQuestion.value))

// Without a test the question is random: fetched in the browser, so cached page HTML doesn't freeze one pick.
onMounted(async () => {
  if (props.examId || !props.lesson || props.lesson === '0') return
  try {
    randomQuestion.value = await loadRandom(props.lesson, props.topic)
  }
  catch {
    randomQuestion.value = null
  }
})
</script>
