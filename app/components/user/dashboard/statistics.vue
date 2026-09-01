<template>
  <div class="w-100 d-flex flex-column flex-sm-row ga-3">
    <div
      class="dashboard-card w-100 pa-4 d-flex align-center ga-4"
    >
      <v-avatar
        color="info"
        variant="tonal"
        rounded="lg"
        size="48"
      >
        <v-icon>md:mail_outlined</v-icon>
      </v-avatar>
      <div>
        <p class="text-h5 font-weight-medium text-grey500 mb-0">
          Messages
        </p>
        <p class="text-h4 font-weight-bold text-grey900 mb-0">
          {{ unreadMessage || 0 }}
        </p>
      </div>
    </div>

    <div
      class="dashboard-card w-100 pa-4 d-flex align-center ga-4"
    >
      <v-avatar
        color="primary"
        variant="tonal"
        rounded="lg"
        size="48"
      >
        <v-icon>md:star_outlined</v-icon>
      </v-avatar>
      <div>
        <p class="text-h5 font-weight-medium text-grey500 mb-0">
          Score
        </p>
        <p class="text-h4 font-weight-bold text-grey900 mb-0">
          {{ formatNumber(score || 0) }}
        </p>
      </div>
    </div>

    <nuxt-link
      v-if="userType === UserGroup.Teacher"
      class="dashboard-card w-100 bg-grey700 pa-4 d-flex align-center justify-space-between"
      to="/user/commission"
    >
      <div>
        <p class="text-h5 font-weight-medium text-grey300 mb-0">
          Sell Report
        </p>
        <p class="text-h4 font-weight-bold text-white mb-0">
          View earnings
        </p>
      </div>
      <v-avatar
        color="white"
        rounded="lg"
        size="36"
      >
        <v-icon color="primary">
          md:arrow_right_alt
        </v-icon>
      </v-avatar>
    </nuxt-link>
  </div>
</template>

<script setup lang="ts">
import { UserGroup } from '@/types'

interface IStatistics {
  score: string | number | null
  unreadMessage: number | null
}

defineProps<IStatistics>()

const { user } = useUser()
const userType = computed(() => user.value?.group)
const { formatNumber } = useFormatNumber()
</script>

<style scoped>
.dashboard-card {
  border-radius: 1rem;
  border: 1px solid rgb(var(--v-theme-grey200));
}
</style>
