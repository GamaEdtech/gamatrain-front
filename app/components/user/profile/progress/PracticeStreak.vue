<template>
  <v-card
    flat
    rounded="lg"
    border
    tag="section"
    class="pa-4 practice-streak"
    aria-labelledby="practice-streak-title"
  >
    <div class="d-flex justify-space-between align-baseline ga-2">
      <h2
        id="practice-streak-title"
        class="text-h6 font-weight-bold text-grey900"
      >
        Practice streak
      </h2>
      <span
        v-if="practice.best"
        class="text-body-2 text-grey600"
      >Best: {{ practice.best }} {{ practice.best === 1 ? 'day' : 'days' }}</span>
    </div>

    <div
      class="practice-streak__days mt-3"
      role="img"
      :aria-label="summary"
    >
      <div
        v-for="(day, i) in days"
        :key="i"
        class="d-flex flex-column align-center ga-1"
      >
        <div
          class="practice-streak__cell"
          :class="[day.practised ? 'bg-primary' : 'bg-surfaceTertiary', { 'practice-streak__cell--today': day.isToday }]"
        />
        <span
          class="text-caption"
          :class="day.isToday ? 'font-weight-bold text-grey900' : 'text-grey600'"
        >{{ day.label }}</span>
      </div>
    </div>

    <p class="ma-0 mt-3 text-body-2 text-grey700">
      {{ message }}
    </p>
    <v-btn
      to="/search?type=quizhub"
      variant="text"
      color="info"
      class="text-none px-1 mt-1"
      append-icon="mdi-arrow-right"
    >
      Practise on QuizHub
    </v-btn>
  </v-card>
</template>

<script setup lang="ts">
import type { PracticeStreakDTO } from '@/types'

const props = defineProps<{ practice: PracticeStreakDTO }>()

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

/** The last 7 days, oldest first. The backend counts UTC days, so the labels use UTC too. */
const days = computed(() => {
  const today = new Date()
  return props.practice.lastSevenDays.map((practised, i) => {
    const date = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - (6 - i)))
    return { practised, isToday: i === 6, label: i === 6 ? 'Today' : WEEKDAYS[date.getUTCDay()] }
  })
})

const summary = computed(() =>
  `Practised on ${props.practice.lastSevenDays.filter(Boolean).length} of the last 7 days${props.practice.practisedToday ? ', including today' : ''}`)

const message = computed(() => {
  const { current, practisedToday } = props.practice
  if (current === 0) return 'Answer one practice question a day to start a streak.'
  if (!practisedToday) return `Answer a question today to keep your ${current}-day streak going.`
  return `${current} ${current === 1 ? 'day' : 'days'} in a row. Come back tomorrow to keep it going.`
})
</script>

<style scoped>
.practice-streak {
  border-color: rgb(var(--v-theme-borderSubtle)) !important;
}

.practice-streak__days {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 6px;
}

.practice-streak__cell {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
}

.practice-streak__cell--today {
  outline: 2px solid rgb(var(--v-theme-grey900));
  outline-offset: 2px;
}
</style>
