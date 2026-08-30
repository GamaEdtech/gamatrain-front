<template>
  <v-card
    flat
    class="dashboard-card pa-4"
  >
    <div class="d-flex justify-space-between align-center mb-4">
      <p class="gama-text-caption text-uppercase font-weight-bold text-grey500 mb-0">
        Your Achievements
      </p>
      <span class="gama-text-caption text-grey500">
        More badges coming soon
      </span>
    </div>
    <div class="d-flex flex-wrap ga-6">
      <div
        v-for="badge in badges"
        :key="badge.id"
        class="d-flex flex-column align-center ga-2"
        style="width: 84px;"
      >
        <v-avatar
          :color="isEarned(badge.id) ? badge.color : 'grey100'"
          size="56"
          :variant="isEarned(badge.id) ? 'tonal' : 'flat'"
        >
          <v-icon
            :color="isEarned(badge.id) ? badge.color : 'grey400'"
            :icon="isEarned(badge.id) ? badge.icon : 'mdi-lock-outline'"
          />
        </v-avatar>
        <span
          class="gama-text-caption text-center font-weight-medium"
          :class="isEarned(badge.id) ? 'text-grey700' : 'text-grey400'"
        >
          {{ badge.label }}
        </span>
      </div>
    </div>
  </v-card>
</template>

<script setup>
// There is no achievements/badges API yet. Badges default to locked so we
// never claim a user earned something we can't verify — pass earnedBadgeIds
// once a real endpoint exists.
const props = defineProps({
  earnedBadgeIds: {
    type: Array,
    default: () => [],
  },
})

const badges = [
  { id: 'school-guide', label: 'School Guide', icon: 'mdi-image-multiple-outline', color: 'primary' },
  { id: 'exam-geek', label: 'Exam Geek', icon: 'mdi-school-outline', color: 'success' },
  { id: 'forum-helper', label: 'Forum Helper', icon: 'mdi-forum-outline', color: 'info' },
  { id: 'content-creator', label: 'Content Creator', icon: 'mdi-pencil-box-outline', color: 'primary' },
  { id: 'quiz-master', label: 'Quiz Master', icon: 'mdi-lightbulb-on-outline', color: 'success' },
  { id: 'top-scorer', label: 'Top Scorer', icon: 'mdi-trophy-outline', color: 'primary' },
]

const isEarned = id => props.earnedBadgeIds.includes(id)
</script>

<style scoped>
.dashboard-card {
  border-radius: 1rem;
  border: 1px solid #E4E7EC;
}
</style>
