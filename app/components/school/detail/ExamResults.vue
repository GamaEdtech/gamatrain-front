<template>
  <v-sheet
    v-if="results"
    tag="section"
    border
    rounded="lg"
    class="d-flex flex-column flex-sm-row align-sm-center ga-3 pa-4 exam-results"
    aria-labelledby="exam-results-title"
  >
    <v-icon
      size="32"
      color="primary"
      aria-hidden="true"
      class="d-none d-sm-flex"
    >
      mdi-school-outline
    </v-icon>
    <div class="flex-grow-1 d-flex flex-column ga-1">
      <h2
        id="exam-results-title"
        class="section-title"
      >
        Exam results
      </h2>
      <p class="ma-0 text-grey700 exam-results__hint">
        {{ results.exams }} results are published by {{ results.board }}.
      </p>
    </div>
    <v-btn
      :href="results.url"
      target="_blank"
      rel="noopener nofollow"
      color="primary"
      variant="flat"
      rounded="lg"
      size="large"
      append-icon="mdi-open-in-new"
      class="text-none gtext-t4 font-weight-bold flex-shrink-0"
    >
      Check {{ results.board }} results
    </v-btn>
  </v-sheet>
</template>

<script setup lang="ts">
import { SCHOOL_EXAM_RESULTS_BY_COUNTRY } from '@/constants/school'

const props = defineProps<{ countryId?: number | null }>()

const results = computed(() => (props.countryId ? SCHOOL_EXAM_RESULTS_BY_COUNTRY[props.countryId] : undefined))
</script>

<style scoped>
.exam-results {
  border-color: rgb(var(--v-theme-grey200)) !important;
}

.exam-results__hint {
  font-size: 14px;
  line-height: 1.5;
}
</style>
