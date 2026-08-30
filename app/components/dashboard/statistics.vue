<template>
  <v-row class="dashboard-statistic">
    <v-col
      cols="12"
      :sm="userType === 5 ? 4 : 6"
    >
      <v-card
        flat
        class="dashboard-card pa-4 d-flex align-center ga-4"
      >
        <v-avatar
          color="info"
          variant="tonal"
          rounded="lg"
          size="48"
        >
          <v-icon>mdi-email-outline</v-icon>
        </v-avatar>
        <div>
          <p class="gama-text-body2 text-grey500 mb-0">
            Messages
          </p>
          <p class="gama-text-h5 font-weight-bold text-grey900 mb-0">
            {{ userInfo?.unreadMessages?.total || 0 }}
          </p>
        </div>
      </v-card>
    </v-col>
    <v-col
      cols="12"
      :sm="userType === 5 ? 4 : 6"
    >
      <v-card
        flat
        class="dashboard-card pa-4 d-flex align-center ga-4"
      >
        <v-avatar
          color="primary"
          variant="tonal"
          rounded="lg"
          size="48"
        >
          <v-icon>mdi-star-outline</v-icon>
        </v-avatar>
        <div>
          <p class="gama-text-body2 text-grey500 mb-0">
            Score
          </p>
          <p class="gama-text-h5 font-weight-bold text-grey900 mb-0">
            {{ formatNumber(userInfo?.user?.score || 0) }}
          </p>
        </div>
      </v-card>
    </v-col>
    <v-col
      v-if="userType === 5"
      cols="12"
      sm="4"
    >
      <v-card
        flat
        class="dashboard-card bg-grey900 pa-4 d-flex align-center justify-space-between"
        style="border: none;"
        to="/user/sell-report"
      >
        <div>
          <p class="gama-text-body2 text-grey400 mb-0">
            Sell Report
          </p>
          <p class="gama-text-h6 font-weight-bold text-white mb-0">
            View earnings
          </p>
        </div>
        <v-avatar
          color="secondary"
          rounded="lg"
          size="36"
        >
          <v-icon color="grey900">
            mdi-arrow-right
          </v-icon>
        </v-avatar>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
const _props = defineProps({
  userInfo: {
    type: Object,
    required: true,
  },
})

const { user } = useUser()
const userType = computed(() => user.value?.group)
const { formatNumber } = useFormatNumber()
</script>

<style scoped>
.dashboard-card {
  border-radius: 1rem;
  border: 1px solid #E4E7EC;
}
</style>
