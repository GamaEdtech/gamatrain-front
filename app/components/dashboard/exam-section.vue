<template>
  <v-card
    v-if="userType === 6"
    flat
    class="dashboard-card pa-4"
  >
    <div class="d-flex justify-space-between align-center">
      <p class="gama-text-h6 font-weight-bold text-grey900 mb-0">
        Exams &amp; Progress
      </p>
      <NuxtLink
        to="/leader-board"
        class="gama-text-body2 font-weight-bold text-decoration-none d-flex align-center ga-1"
      >
        See leaderboard
        <v-icon size="16">
          mdi-chevron-right
        </v-icon>
      </NuxtLink>
    </div>

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
          <span class="gama-text-body1 font-weight-bold text-grey700">{{ item.title }}</span>
          <span class="gama-text-caption text-grey500">{{ item.participated }} of {{ item.total }} done</span>
        </div>
        <v-progress-linear
          :model-value="item.total ? (item.participated / item.total) * 100 : 0"
          :color="item.participated >= item.total ? 'success' : 'warning'"
          height="7"
          rounded
          bg-color="grey200"
        />
      </div>
    </div>

    <v-divider class="my-4" />

    <div class="d-flex justify-space-between gama-text-body2 font-weight-bold text-grey900">
      <span>Total</span>
      <span>{{ examData?.participated || 0 }} participated · {{ notParticipatedTotal }} not participated</span>
    </div>
  </v-card>
</template>

<script setup>
const props = defineProps({
  examData: {
    type: Object,
    default: () => ({}),
  },
})

const { user } = useUser()
const userType = computed(() => user.value?.group)

const notParticipatedTotal = computed(() => Math.max((props.examData?.total || 0) - (props.examData?.participated || 0), 0))
</script>

<style scoped>
.dashboard-card {
  border-radius: 1rem;
  border: 1px solid #E4E7EC;
}
</style>
