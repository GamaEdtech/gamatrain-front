<template>
  <div class="w-100 d-flex flex-column align-start justify-start ga-5">
    <template v-if="loadingGetDashboardData">
      <v-skeleton-loader
        type="image"
        height="180"
        class="w-100 rounded-lg"
      />
      <user-dashboard-subscription-banner-skeleton />
      <user-dashboard-badges-strip-skeleton />
      <user-dashboard-statistics-skeleton />
      <v-row class="w-100 ma-0">
        <v-col
          cols="12"
          md="8"
          class="pa-0 pr-0 pr-md-2"
        >
          <user-dashboard-exam-section-skeleton />
        </v-col>
        <v-col
          cols="12"
          md="4"
          class="pa-0 mt-4 mt-md-0"
        >
          <user-dashboard-support-widget-skeleton />
        </v-col>
      </v-row>
      <v-skeleton-loader
        height="28"
        width="160"
      />
      <user-dashboard-create-content-button-skeleton />
    </template>
    <template v-else-if="!loadingGetDashboardData && dashboardInfo">
      <!-- One header (name, @username, profile level, points, streak, rank), then the quests, school goal and streak. It used to
           follow a second header card with its own avatar, level and "next steps" (the same items as the quests). The photo, name
           and school quests are edited on the profile page. -->
      <user-profile-progress-panel
        class="w-100"
        @quest="openProfilePage"
      />
      <user-dashboard-subscription-banner :subscription="dashboardInfo.user.subscription" />
      <user-dashboard-badges-strip :earned-badge-ids="[]" />
      <user-dashboard-statistics
        :score="dashboardInfo.user.points || 0"
        :unread-message="dashboardInfo.unreadMessages?.total || 0"
        :roles="dashboardInfo.user.roles || []"
      />
      <v-row class="w-100 ma-0">
        <v-col
          v-if="dashboardInfo.user.roles?.includes('Student')"
          cols="12"
          md="8"
          class="pa-0 pr-0 pr-md-2"
        >
          <user-dashboard-exam-section :exam-data="dashboardInfo.examSuggestions" />
        </v-col>
        <v-col
          cols="12"
          md="4"
          class="pa-0 mt-4 mt-md-0"
        >
          <user-dashboard-support-widget />
        </v-col>
      </v-row>

      <template v-if="!dashboardInfo.user.roles?.includes('Student')">
        <p class="text-body-1 text-sm-h6 font-weight-bold text-grey900 mb-1 w-100">
          {{ dashboardInfo.user.roles?.includes('Teacher') ? 'Create & Share' : 'Get Involved' }}
        </p>
        <user-dashboard-create-content-button :data="dashboardInfo.stats" />
      </template>
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

/** The quests the panel can't open in place (photo, names, school) are fields of the profile page. */
const openProfilePage = () => navigateTo('/user/profile')

onMounted(async () => {
  const response = await getDashboardData()
  if (response.succeeded && response.data) {
    dashboardInfo.value = response.data
  }
})
</script>
