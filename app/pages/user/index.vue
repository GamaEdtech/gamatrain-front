<template>
  <div class="w-100 d-flex flex-column align-start justify-start ga-5">
    <template v-if="loadingGetDashboardData">
      <v-row>
        <v-col
          cols="12"
          md="12"
        >
          <v-skeleton-loader height="200" />
        </v-col>
        <v-col
          cols="12"
          md="12"
        >
          <v-skeleton-loader height="200" />
        </v-col>
      </v-row>
    </template>
    <template v-else-if="!loadingGetDashboardData && dashboardInfo">
      <user-dashboard-general-info
        :user-data="dashboardInfo.user"
        :progress-data="dashboardInfo.profileCompletion"
        @update-username="updateUsername"
      />
      <user-dashboard-subscription-banner :subscription="dashboardInfo.user.subscription" />
      <user-dashboard-badges-strip :earned-badge-ids="[]" />
      <user-dashboard-statistics
        :score="dashboardInfo.user.scoreCheckInfo || 0"
        :unread-message="dashboardInfo.unreadMessages.total || 0"
        :roles="dashboardInfo.user.roles"
      />
      <v-row class="w-100 ma-0">
        <v-col
          v-if="dashboardInfo.user.roles.includes('Student')"
          cols="12"
          md="8"
          class="pa-0"
        >
          <user-dashboard-exam-section :exam-data="dashboardInfo.examSuggestions" />
        </v-col>
        <v-col
          cols="12"
          md="4"
          class="pa-0"
        >
          <user-dashboard-support-widget />
        </v-col>
      </v-row>

      <p class="text-h5 text-sm-h4 font-weight-bold text-grey900 mb-1 w-100">
        {{ dashboardInfo.user.roles.includes('Teacher') ? 'Create & Share' : 'Get Involved' }}
      </p>
      <user-dashboard-create-content-button
        :data="dashboardInfo.stats"
        :roles="dashboardInfo.user.roles"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { GetDashboardDataDTO } from '@/types'

definePageMeta({
  layout: 'dashboard-layout',
  middleware: ['auth', 'user-type'],
})

useHead({
  title: 'Dashboard',
})

const { getDashboardData, loadingGetDashboardData } = useProfile()

const dashboardInfo = ref<GetDashboardDataDTO | null>()

const updateUsername = (username: string) => {
  if (dashboardInfo.value) {
    dashboardInfo.value = {
      ...dashboardInfo.value,
      user: {
        ...dashboardInfo.value.user,
        handle: username,
      },
    }
  }
}

onMounted(async () => {
  const response = await getDashboardData()
  if (response.succeeded && response.data) {
    dashboardInfo.value = response.data
  }
})
</script>
