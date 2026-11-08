<template>
  <v-card
    v-if="topicList.length"
    rounded="xl"
    border
    elevation="0"
    class="pa-5"
  >
    <h2 class="text-body-1 font-weight-heavy text-brandNavy mb-2">
      Topics covered
    </h2>
    <ul class="topics">
      <li
        v-for="(topic, index) in topicList"
        :key="topic.id"
      >
        <!-- Opens the QuizHub list of this subject's quizzes on the same topic. -->
        <nuxt-link
          :to="topic.to"
          class="topic-link d-flex align-center ga-3 py-2 px-2 mx-n2 rounded-lg text-body-1 font-weight-semibold text-grey700 text-decoration-none"
        >
          <span
            class="topic-index d-flex align-center justify-center rounded bg-generalSearchQuizActive text-generalSearchQuiz font-weight-heavy"
            aria-hidden="true"
          >{{ index + 1 }}</span>
          <span class="flex-grow-1">{{ topic.title }}</span>
          <v-icon
            class="topic-arrow"
            size="18"
            color="grey400"
            aria-hidden="true"
          >md:chevron_right</v-icon>
        </nuxt-link>
      </li>
    </ul>
  </v-card>
</template>

<script setup lang="ts">
import type { ExamDetaiDTO } from '@/types'
import { quizhubSearchPath } from '@/utils/quizhubSearchPath'

const props = defineProps<{
  exam: ExamDetaiDTO
}>()

const topicList = computed(() => {
  const { section, base, lesson } = props.exam
  return (props.exam.topics ?? [])
    .map(topic => ({
      id: topic.id,
      title: topic.title?.trim(),
      to: quizhubSearchPath({ section, base, lesson, topic: topic.id }),
    }))
    .filter(topic => topic.title)
})
</script>

<style scoped>
.topics {
  list-style: none;
}
.topic-link:hover,
.topic-link:focus-visible {
  background-color: rgb(var(--v-theme-grey100));
}
.topic-link:hover .topic-arrow {
  color: rgb(var(--v-theme-generalSearchQuiz)) !important;
}
.topic-index {
  flex: none;
  width: 24px;
  height: 24px;
  font-size: 0.6875rem;
}
</style>
