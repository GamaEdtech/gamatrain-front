<template>
  <div>
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
    <template v-else>
      <div
        v-if="dashboardInfo"
        class="d-flex flex-column ga-5"
      >
        <user-dashboard-general-info
          :user-data="dashboardInfo.user"
          :progress-data="dashboardInfo.profileCompletion"
          @update-username="updateUsername"
        />
        <user-dashboard-subscription-banner />
        <user-dashboard-badges-strip :earned-badge-ids="[]" />
        <user-dashboard-statistics
          :score="dashboardInfo.user.scoreCheckInfo || 0"
          :unread-message="dashboardInfo.unreadMessages.total || 0"
          :roles="dashboardInfo.user.roles"
        />
        <v-row>
          <v-col
            v-if="dashboardInfo.user.roles.includes('Student')"
            cols="12"
            md="8"
          >
            <user-dashboard-exam-section :exam-data="dashboardInfo.examSuggestions" />
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <user-dashboard-support-widget />
          </v-col>
        </v-row>

        <div>
          <p class="text-h5 text-sm-h4 font-weight-bold text-grey900 mb-4">
            {{ dashboardInfo.user.roles.includes('Teacher') ? 'Create & Share' : 'Get Involved' }}
          </p>
          <user-dashboard-create-content-button
            :data="dashboardInfo.stats"
            :roles="dashboardInfo.user.roles"
          />
        </div>
      </div>
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
