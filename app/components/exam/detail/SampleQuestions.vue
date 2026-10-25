<template>
  <section
    v-if="questions.length"
    aria-labelledby="exam-samples-title"
  >
    <h2
      id="exam-samples-title"
      class="gama-text-h4 text-brandNavy"
    >
      Sample questions from {{ subject }}
    </h2>
    <p class="text-h5 text-grey500 mt-1 mb-4">
      The first {{ questions.length }} of {{ total || questions.length }} questions. Pick an answer to check it right here.
    </p>

    <ol class="sample-list d-flex flex-column ga-3 pa-0">
      <li
        v-for="(question, index) in questions"
        :key="question.id"
      >
        <v-card
          rounded="xl"
          border
          elevation="0"
          class="pa-4 pa-sm-5"
        >
          <exam-detail-sample-question
            :question="question"
            :number="index + 1"
          />
        </v-card>
      </li>
    </ol>

    <v-btn
      v-if="canStart"
      color="primary"
      size="large"
      rounded="lg"
      class="mt-4 text-none"
      @click="startExam"
    >
      Start the full {{ total || '' }}-question test for your score and rank
    </v-btn>
  </section>
</template>

<script setup lang="ts">
import type { ExamSampleQuestionDTO } from '@/types'

const props = defineProps<{
  examId: string
  questions: ExamSampleQuestionDTO[]
  /** What the questions come from, e.g. "Accounting 0452/11 Oct Nov 2024". */
  subject: string
  total: number
  canStart: boolean
}>()

const { startExam } = useExamStart(() => props.examId)
</script>

<style scoped>
.sample-list {
  list-style: none;
}
</style>
