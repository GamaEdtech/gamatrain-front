<template>
  <v-card
    border
    flat
    rounded="xl"
    class="pa-4 pa-md-5 d-flex flex-column ga-4"
  >
    <div class="d-flex align-center justify-space-between flex-wrap ga-2">
      <div class="d-flex flex-column">
        <h2 class="text-h6 font-weight-bold text-grey700">
          Exam participation
        </h2>
        <span class="text-caption text-grey500">Attempts started in this period</span>
      </div>
      <v-btn
        variant="tonal"
        rounded="pill"
        size="small"
        to="/admin/exam-participations"
        append-icon="md:arrow_forward"
        class="text-caption font-weight-medium"
      >
        All participants
      </v-btn>
    </div>

    <v-skeleton-loader
      v-if="loading && !overview"
      type="table-tbody"
    />
    <template v-else-if="overview">
      <v-row dense>
        <v-col
          v-for="stat in stats"
          :key="stat.title"
          cols="12"
          sm="4"
        >
          <div class="d-flex flex-column ga-1 pa-3 rounded-lg bg-grey50">
            <span class="text-caption font-weight-medium text-grey500">{{ stat.title }}</span>
            <span class="text-h5 font-weight-bold text-grey800">{{ stat.value }}</span>
            <span class="text-caption text-grey500">{{ stat.hint }}</span>
          </div>
        </v-col>
      </v-row>

      <v-table
        v-if="overview.topExams.length"
        density="compact"
      >
        <thead>
          <tr>
            <th>Most taken</th>
            <th class="text-end">
              Attempts
            </th>
            <th class="text-end">
              Finished
            </th>
            <th class="text-end">
              People
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="exam in overview.topExams"
            :key="exam.examId"
          >
            <td class="text-truncate exam-title">
              <nuxt-link :to="`/admin/exam-participations?examId=${exam.examId}`">
                {{ exam.title || `#${exam.examId}` }}
              </nuxt-link>
            </td>
            <td class="text-end">
              {{ number(exam.attempts) }}
            </td>
            <td class="text-end">
              {{ number(exam.finished) }}
            </td>
            <td class="text-end">
              {{ number(exam.participants) }}
            </td>
          </tr>
        </tbody>
      </v-table>
      <span
        v-else
        class="text-body-2 text-grey500"
      >No exam was started in this period.</span>
    </template>
  </v-card>
</template>

<script setup lang="ts">
import type { AdminDashboardOverviewDTO } from '@/types'

const props = defineProps<{
  overview: AdminDashboardOverviewDTO | null
  loading: boolean
}>()

const number = (value: number) => value.toLocaleString('en-US')
const percent = (part: number, whole: number) => (whole ? Math.round((part / whole) * 100) : 0)

const stats = computed(() => {
  const o = props.overview
  if (!o) return []
  return [
    { title: 'Attempts', value: number(o.examAttempts), hint: `${number(o.examsFinished)} finished` },
    { title: 'Finish rate', value: `${percent(o.examsFinished, o.examAttempts)}%`, hint: 'of attempts started' },
    { title: 'People', value: number(o.examParticipants), hint: 'took at least one exam' },
  ]
})
</script>

<style scoped>
.exam-title {
  max-width: 320px;
}
</style>
