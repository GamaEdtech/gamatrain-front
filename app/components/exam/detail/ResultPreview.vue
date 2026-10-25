<template>
  <v-card
    rounded="xl"
    border
    elevation="0"
    class="pa-5"
  >
    <h2 class="text-h5 font-weight-heavy text-brandNavy mb-3">
      What you get when you finish
    </h2>
    <ul class="result-list d-flex flex-column ga-3 pa-0 text-h5 text-grey700">
      <li
        v-for="item in items"
        :key="item.text"
        class="d-flex align-start ga-3"
      >
        <v-icon
          :icon="item.icon"
          color="primary"
          size="20"
          class="mt-1"
          aria-hidden="true"
        />
        <span>{{ item.text }}</span>
      </li>
    </ul>
  </v-card>
</template>

<script setup lang="ts">
const props = defineProps<{
  questionCount: number
  participants: number
}>()

// What the result page shows after an attempt (user/exam/result): score, answer counts, ranks and every question
// reviewed. Built from this quiz's own numbers so it isn't the same text on every exam.
const items = computed(() => [
  {
    icon: 'md:task_alt',
    text: props.questionCount
      ? `Your score, with how many of the ${props.questionCount} questions you got right, wrong or left blank`
      : 'Your score, with how many questions you got right, wrong or left blank',
  },
  {
    icon: 'md:leaderboard',
    text: props.participants
      ? `Your rank in your country, state and area, against ${props.participants} ${props.participants === 1 ? 'student' : 'students'} who took it`
      : 'Your rank in your country, state and area',
  },
  { icon: 'md:fact_check', text: 'Every question reviewed, with the correct answer marked' },
  { icon: 'md:history', text: 'Your result saved in your account to come back to' },
])
</script>

<style scoped>
.result-list {
  list-style: none;
}
</style>
