<template>
  <v-card
    rounded="xl"
    border
    elevation="0"
    class="pa-5"
  >
    <h2 class="text-h5 font-weight-heavy text-brandNavy mb-3">
      About this quiz
    </h2>
    <dl class="about-list text-h5">
      <template
        v-for="item in items"
        :key="item.label"
      >
        <dt class="text-grey500">
          {{ item.label }}
        </dt>
        <dd class="text-grey900 font-weight-semibold">
          {{ item.value }}
        </dd>
      </template>
    </dl>
  </v-card>
</template>

<script setup lang="ts">
import type { ExamDetaiDTO } from '@/types'

const props = defineProps<{
  exam: ExamDetaiDTO
}>()

// Only facts the quiz actually has: an empty field leaves its row out instead of printing "-".
const items = computed(() => {
  const exam = props.exam
  return [
    { label: 'Board', value: exam.section_title?.trim() },
    { label: 'Level', value: exam.base_title?.trim() },
    { label: 'Subject', value: exam.lesson_title?.trim() },
    { label: 'Quiz type', value: exam.azmoon_type_title?.trim() },
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
</style>
