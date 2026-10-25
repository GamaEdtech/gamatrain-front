<template>
  <v-card
    v-if="topicTitles.length"
    rounded="xl"
    border
    elevation="0"
    class="pa-5"
  >
    <h2 class="text-h5 font-weight-heavy text-brandNavy mb-2">
      Topics covered
    </h2>
    <ul class="topics">
      <li
        v-for="(topic, index) in topicTitles"
        :key="index"
        class="d-flex align-center ga-3 py-2 text-h5 font-weight-semibold text-grey700"
      >
        <span
          class="topic-index d-flex align-center justify-center rounded bg-generalSearchQuizActive text-generalSearchQuiz font-weight-heavy"
          aria-hidden="true"
        >{{ index + 1 }}</span>
        {{ topic }}
      </li>
    </ul>
  </v-card>
</template>

<script setup lang="ts">
import type { TopicExamDetaiDTO } from '@/types'

const props = defineProps<{
  topics?: TopicExamDetaiDTO[]
}>()

const topicTitles = computed(() =>
  (props.topics ?? []).map(topic => topic.title?.trim()).filter(Boolean),
)
</script>

<style scoped>
.topics {
  list-style: none;
}
.topic-index {
  flex: none;
  width: 24px;
  height: 24px;
  font-size: 1.1rem;
}
</style>
