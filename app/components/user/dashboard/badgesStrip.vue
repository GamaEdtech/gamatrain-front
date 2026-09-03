<template>
  <div
    class="dashboard-card pa-4 d-flex flex-column ga-4 w-100"
  >
    <div class="d-flex justify-space-between align-center">
      <p class="text-h5 text-sm-h4 font-weight-bold text-grey900 ">
        Your Achievements
      </p>
      <span class="text-subtitle-1 text-sm-h5 text-grey500 font-weight-medium">
        More badges coming soon
      </span>
    </div>
    <div class="d-flex flex-wrap ga-6">
      <div
        v-for="badge in badges"
        :key="badge.id"
        class="d-flex flex-column align-center ga-2 container-badge"
      >
        <v-avatar
          :color="isEarned(badge.id) ? badge.color : 'grey100'"
          :size="smAndUp ? 56 : 46"
          :variant="isEarned(badge.id) ? 'tonal' : 'flat'"
        >
          <v-icon
            :color="isEarned(badge.id) ? badge.color : 'grey400'"
            :icon="isEarned(badge.id) ? badge.icon : 'md:lock_outlined'"
          />
        </v-avatar>
        <span
          class="text-h6 text-sm-h5 text-center font-weight-medium"
          :class="isEarned(badge.id) ? 'text-grey700' : 'text-grey400'"
        >
          {{ badge.label }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

interface IBadgeStrip {
  earnedBadgeIds: string[]
}
const props = defineProps<IBadgeStrip>()

const { smAndUp } = useDisplay()

const badges = [
  { id: 'school-guide', label: 'School Guide', icon: 'md:photo_library_outlined', color: 'primary' },
  { id: 'exam-geek', label: 'Exam Geek', icon: 'md:school_outlined', color: 'success' },
  { id: 'forum-helper', label: 'Forum Helper', icon: 'md:forum_outlined', color: 'info' },
  { id: 'content-creator', label: 'Content Creator', icon: 'md:edit_square_outlined', color: 'primary' },
  { id: 'quiz-master', label: 'Quiz Master', icon: 'md:lightbulb_outlined', color: 'success' },
  { id: 'top-scorer', label: 'Top Scorer', icon: 'md:trophy_outlined', color: 'primary' },
]

const isEarned = (id: string) => props.earnedBadgeIds.includes(id)
</script>

<style scoped>
.dashboard-card {
  border-radius: 1rem;
  border: 1px solid rgb(var(--v-theme-grey200));
}
.container-badge{
  width: 84px
}
@media screen and (max-width: 600px) {
  .container-badge{
    width: 64px
 }
}
</style>
