<template>
  <section
    v-if="loading || quizzes.length"
    aria-labelledby="exam-related-title"
  >
    <h2
      id="exam-related-title"
      class="gama-text-h4 text-brandNavy"
    >
      More {{ subject || 'related' }} quizzes
    </h2>
    <p class="text-h5 text-grey500 mt-1 mb-4">
      Keep going with the next unit.
    </p>

    <v-row dense>
      <template v-if="loading">
        <v-col
          v-for="index in 4"
          :key="index"
          cols="6"
          md="3"
        >
          <v-skeleton-loader
            type="card"
            height="150"
            class="rounded-xl"
          />
        </v-col>
      </template>
      <v-col
        v-for="quiz in quizzes"
        v-else
        :key="quiz.id"
        cols="6"
        md="3"
      >
        <v-card
          :to="contentPath('exam', quiz.id, quiz.title_url)"
          rounded="xl"
          border
          elevation="0"
          class="pa-4 h-100 d-flex flex-column"
        >
          <span
            class="quiz-icon d-flex align-center justify-center rounded-lg bg-generalSearchQuizActive mb-3"
            aria-hidden="true"
          >
            <v-icon
              color="generalSearchQuiz"
              size="20"
            >md:quiz</v-icon>
          </span>
          <span class="text-h5 font-weight-bold text-brandNavy two-lines">{{ quiz.title.trim() }}</span>
          <span
            v-if="Number(quiz.tests_num)"
            class="text-h6 text-grey500 mt-auto pt-2"
          >{{ quiz.tests_num }} questions</span>
        </v-card>
      </v-col>
    </v-row>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  id: string
  /** The subject's name for the heading, e.g. "Mathematics 5". */
  subject?: string
}>()

// The same request as the page's other related rows (one call, server-rendered so the links reach crawlers).
// The recommendation already leaves the quiz itself out; the filter is a safety net.
const { data: related, status } = useRelatedContent('exam', () => props.id)
const quizzes = computed(() =>
  (related.value?.exams ?? []).filter(exam => String(exam.id) !== String(props.id)).slice(0, 8),
)
const loading = computed(() => status.value === 'pending' || status.value === 'idle')
</script>

<style scoped>
.quiz-icon {
  width: 40px;
  height: 40px;
}
.two-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
