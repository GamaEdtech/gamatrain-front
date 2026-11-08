<template>
  <div
    class="dashboard-card pa-4 d-flex flex-column ga-1"
  >
    <p class="text-body-1 text-sm-h6 font-weight-bold text-grey900 mb-0">
      Exams Progress
    </p>

    <v-alert
      v-if="notParticipatedTotal > 0"
      type="warning"
      variant="tonal"
      density="comfortable"
      class="mt-4"
    >
      You have not participated in {{ notParticipatedTotal }} out of {{ examData?.total || 0 }} tests
    </v-alert>

    <div
      v-if="examData?.lessons?.length"
      class="d-flex flex-column ga-4 mt-4"
    >
      <div
        v-for="item in examData.lessons"
        :key="item.id"
      >
        <div class="d-flex justify-space-between mb-1">
          <span class="text-body-1 font-weight-bold text-grey700">{{ item.title }}</span>
          <span class="text-body-1 text-grey500">{{ item.participated }} of {{ item.total }} done</span>
        </div>
        <v-progress-linear
          :model-value="item.total ? (item.participated / Number(item.total)) * 100 : 0"
          :color="Number(item.participated) >= Number(item.total) ? 'success' : 'warning'"
          height="7"
          rounded
          bg-color="grey200"
        />
      </div>
    </div>

    <v-divider class="my-4" />

    <div class="d-flex justify-space-between text-body-1 font-weight-bold text-grey900">
      <span>Total</span>
      <span>{{ examData?.participated || 0 }} participated · {{ notParticipatedTotal }} not participated</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DashboardExamSuggestionsDTO } from '@/types'

interface IExamSection {
  examData: DashboardExamSuggestionsDTO
}
const props = defineProps<IExamSection>()

const notParticipatedTotal = computed(() => Math.max((props.examData?.total || 0) - (props.examData?.participated || 0), 0))
</script>

<style scoped>
.dashboard-card {
  border-radius: 0.625rem;
  border: 1px solid rgb(var(--v-theme-grey200));
}
</style>
