<template>
  <v-card
    v-if="answerStats"
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
        class="pa-4 d-flex flex-column align-center justify-start ga-3 flex-grow-1"
        color="grey100"
        flat
        rounded="lg"
        border
        min-width="240"
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
        color="grey100"
        flat
        rounded="lg"
        border
        min-width="240"
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
            bg-color="grey200"
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
            v-for="rankItem in rankItems"
            :key="rankItem.label"
            class="pa-3 d-flex flex-column ga-1 flex-grow-1"
            color="white"
            flat
            rounded="lg"
            border
            min-width="150"
          >
            <span class="text-grey500 text-h6 font-weight-medium">{{ rankItem.label }}</span>
            <span class="text-grey800 text-h5 font-weight-bold">{{ rankItem.value }}</span>
          </v-card>
        </div>
      </v-card>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import type { ExamResultAnswerStatsDTO, ExamResultRankDTO } from '@/types'

const props = defineProps<{
  answerStats?: ExamResultAnswerStatsDTO
  rank?: ExamResultRankDTO
}>()

const totalStats = computed(() => {
  return props.answerStats?.total || {
    num: 0,
    true: 0,
    false: 0,
    noAnswer: 0,
    percent: 0,
  }
})

const statItems = computed(() => [
  { label: 'Correct answers', value: totalStats.value.true, color: 'success' },
  { label: 'Wrong answers', value: totalStats.value.false, color: 'lightError' },
  { label: 'No answer', value: totalStats.value.noAnswer, color: 'grey300' },
])

const lessonStats = computed(() => {
  return Object.values(props.answerStats?.lessons || {})
})

const rankItems = computed(() => {
  return [
    { label: 'Country rank', value: formatRank(props.rank?.total) },
    { label: 'State rank', value: formatRank(props.rank?.state) },
    { label: 'Area rank', value: formatRank(props.rank?.area) },
  ]
})

const formatRank = (rank?: { user: number, total: string }) => {
  if (!rank) return '-'
  return `${rank.user} of ${rank.total}`
}
</script>
