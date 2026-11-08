<template>
  <v-card
    rounded="xl"
    border
    elevation="0"
    class="pa-5"
  >
    <h2 class="text-body-1 font-weight-heavy text-brandNavy mb-3">
      About this quiz
    </h2>
    <dl class="about-list text-body-1">
      <template
        v-for="item in items"
        :key="item.label"
      >
        <dt class="text-grey500">
          {{ item.label }}
        </dt>
        <dd class="text-grey900 font-weight-semibold">
          <nuxt-link
            v-if="item.to"
            :to="item.to"
            class="about-link text-grey900 text-decoration-none"
          >
            {{ item.value }}
          </nuxt-link>
          <template v-else>
            {{ item.value }}
          </template>
        </dd>
      </template>
    </dl>
  </v-card>
</template>

<script setup lang="ts">
import type { ExamDetaiDTO } from '@/types'
import { quizhubSearchPath } from '@/utils/quizhubSearchPath'

const props = defineProps<{
  exam: ExamDetaiDTO
}>()

// Only facts the quiz actually has: an empty field leaves its row out instead of printing "-".
// Board, level, subject and quiz type open the QuizHub list narrowed down to them (the year filter is not
// supported by the search yet, so it stays plain text).
const items = computed(() => {
  const exam = props.exam
  const { section, base, lesson } = exam
  return [
    { label: 'Board', value: exam.section_title?.trim(), to: section && quizhubSearchPath({ section }) },
    { label: 'Level', value: exam.base_title?.trim(), to: base && quizhubSearchPath({ section, base }) },
    { label: 'Subject', value: exam.lesson_title?.trim(), to: lesson && quizhubSearchPath({ section, base, lesson }) },
    {
      label: 'Quiz type',
      value: exam.azmoon_type_title?.trim(),
      to: exam.azmoon_type && quizhubSearchPath({ section, base, lesson, exam_type: exam.azmoon_type }),
    },
    { label: 'Negative marking', value: exam.negative_point ? 'Yes' : 'No' },
    { label: 'Year', value: exam.edu_year?.trim() },
  ].filter(item => item.value)
})
</script>

<style scoped>
.about-list {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px 20px;
}
.about-link:hover,
.about-link:focus-visible {
  color: rgb(var(--v-theme-generalSearchQuiz)) !important;
  text-decoration: underline !important;
}
</style>
