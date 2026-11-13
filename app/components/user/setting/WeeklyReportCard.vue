<template>
  <v-card
    flat
    rounded="lg"
    border
    tag="section"
    class="pa-4 pa-sm-6 weekly-report-card"
    aria-labelledby="weekly-report-title"
  >
    <v-skeleton-loader
      v-if="loadingSettings && !settings"
      type="list-item-three-line"
    />

    <template v-else-if="settings">
      <div class="d-flex flex-wrap align-center justify-space-between ga-3">
        <div class="weekly-report-card__text">
          <h2
            id="weekly-report-title"
            class="text-h6 font-weight-bold text-grey900"
          >
            Weekly report
          </h2>
          <p class="ma-0 mt-1 text-body-2 text-grey700">
            Every Monday: your practice, plan use, contributions and school, from the week before. Quiet weeks get at most a
            short reminder every 4 weeks.
          </p>
        </div>
        <v-switch
          :model-value="settings.subscribed"
          :disabled="savingSettings || !settings.includedInPlan"
          :loading="savingSettings"
          color="secondary"
          inset
          hide-details
          class="flex-grow-0"
          aria-labelledby="weekly-report-title"
          @update:model-value="toggle"
        />
      </div>

      <v-alert
        v-if="!settings.includedInPlan"
        type="info"
        variant="tonal"
        density="compact"
        class="mt-4"
      >
        Your plan doesn't include the weekly report.
        <nuxt-link
          to="/user/subscription"
          class="font-weight-bold"
        >See plans</nuxt-link>
      </v-alert>
      <v-alert
        v-else-if="!settings.emailConfirmed"
        type="warning"
        variant="tonal"
        density="compact"
        class="mt-4"
      >
        Reports go only to a confirmed email address. Confirm {{ settings.email || 'your email' }} to get them.
      </v-alert>
      <p
        v-else
        class="ma-0 mt-4 text-body-2 text-grey600"
      >
        Sent to {{ settings.email }}<template v-if="settings.lastSentDate">
          · last one {{ formatDate(settings.lastSentDate) }}
        </template>
      </p>
    </template>
  </v-card>
</template>

<script setup lang="ts">
import type { WeeklyReportSettingsDTO } from '@/types'

const { getSettings, setSubscription, loadingSettings, savingSettings } = useWeeklyReport()
const { $toast } = useNuxtApp()

const settings = ref<WeeklyReportSettingsDTO | null>(null)

const formatDate = (value: string) => new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })

async function toggle(value: boolean | null) {
  if (!settings.value) return
  const subscribed = Boolean(value)
  const response = await setSubscription(subscribed)
  if (response.succeeded) {
    settings.value = { ...settings.value, subscribed }
    $toast.success(subscribed ? 'Weekly report turned on.' : 'Weekly report turned off.')
  }
}

onMounted(async () => {
  const response = await getSettings()
  if (response.succeeded && response.data) settings.value = response.data
})
</script>

<style scoped>
.weekly-report-card {
  border-color: rgb(var(--v-theme-borderSubtle)) !important;
}

.weekly-report-card__text {
  flex: 1 1 320px;
  min-width: 0;
}
</style>
