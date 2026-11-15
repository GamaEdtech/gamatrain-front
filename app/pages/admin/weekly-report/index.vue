<template>
  <v-container class="d-flex flex-column ga-4 weekly-report-admin">
    <div>
      <h1 class="text-h5 font-weight-bold text-grey900">
        Weekly report preview
      </h1>
      <p class="ma-0 mt-1 text-body-2 text-grey600">
        See the email a user gets for a week, exactly as the Monday job would send it, and whether it would be sent.
        Nothing is sent from here. Only plans that include the Weekly reports feature get it.
      </p>
    </div>

    <v-card
      flat
      rounded="lg"
      border
      tag="section"
      class="pa-4 weekly-report-admin__card"
      aria-labelledby="weekly-status-title"
    >
      <v-skeleton-loader
        v-if="!status"
        type="list-item-two-line"
      />
      <template v-else>
        <div class="d-flex flex-wrap align-center justify-space-between ga-3">
          <div class="weekly-report-admin__status-text">
            <h2
              id="weekly-status-title"
              class="text-h6 font-weight-bold text-grey900"
            >
              Send weekly reports
            </h2>
            <p class="ma-0 mt-1 text-body-2 text-grey700">
              Turning it off pauses the report for everyone from the next Monday run. Nothing else changes: plans and each
              user's own setting stay as they are.
            </p>
          </div>
          <v-switch
            :model-value="!status.paused"
            :loading="savingStatus"
            :disabled="savingStatus"
            color="secondary"
            inset
            hide-details
            class="flex-grow-0"
            aria-labelledby="weekly-status-title"
            @update:model-value="togglePaused"
          />
        </div>
        <v-alert
          v-if="!status.enabledOnServer"
          type="info"
          variant="tonal"
          density="compact"
          class="mt-3"
        >
          This server never sends weekly reports (its WeeklyReport:Enabled setting is off). Only production sends them.
        </v-alert>
      </template>
    </v-card>

    <v-card
      flat
      rounded="lg"
      border
      class="pa-4 weekly-report-admin__card"
    >
      <v-form
        class="d-flex flex-wrap align-start ga-4"
        @submit.prevent="preview"
      >
        <v-text-field
          v-model.number="userId"
          label="User id"
          type="number"
          variant="outlined"
          density="comfortable"
          hide-details="auto"
          class="weekly-report-admin__field"
          :rules="[v => (Number(v) > 0) || 'Enter a user id']"
        />
        <v-text-field
          v-model="weekOf"
          label="Any day of the week (UTC)"
          type="date"
          variant="outlined"
          density="comfortable"
          hint="Empty: last week"
          persistent-hint
          clearable
          class="weekly-report-admin__field"
        />
        <v-btn
          type="submit"
          color="primary"
          size="large"
          class="text-none font-weight-bold"
          :loading="loadingPreview"
          :disabled="!(Number(userId) > 0)"
        >
          Preview
        </v-btn>
      </v-form>
    </v-card>

    <v-card
      v-if="result"
      flat
      rounded="lg"
      border
      class="pa-4 weekly-report-admin__card"
    >
      <div class="d-flex flex-wrap align-center ga-2">
        <v-chip
          :color="result.wouldSend ? 'success' : 'grey700'"
          variant="tonal"
          size="small"
        >
          {{ result.wouldSend ? 'Would be sent' : 'Would not be sent' }}
        </v-chip>
        <v-chip
          v-if="result.kind"
          variant="tonal"
          size="small"
        >
          {{ result.kind === 'Reminder' ? 'Quiet-week reminder' : 'Report' }}
        </v-chip>
        <v-chip
          variant="tonal"
          size="small"
        >
          {{ result.hasActivity ? 'Had activity' : 'No activity' }}
        </v-chip>
      </div>
      <p
        v-if="result.notSentReason"
        class="ma-0 mt-3 text-body-2 text-grey800"
      >
        {{ result.notSentReason }}
      </p>
      <p class="ma-0 mt-3 text-body-1">
        <span class="text-grey600">Subject:</span> <strong>{{ result.subject }}</strong>
      </p>
      <!-- Fully sandboxed: no scripts, no same-origin access; the email is shown, never run. -->
      <iframe
        v-if="result.html"
        :srcdoc="result.html"
        sandbox=""
        title="Weekly report email preview"
        class="mt-3 weekly-report-admin__frame"
      />
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import type { WeeklyReportPreviewDTO, WeeklyReportStatusDTO } from '@/types'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

useHead({
  title: 'Weekly report preview',
})

const { getPreview, loadingPreview, getStatus, setPaused, savingStatus } = useWeeklyReport()
const { $toast } = useNuxtApp()

const status = ref<WeeklyReportStatusDTO | null>(null)

async function togglePaused(on: boolean | null) {
  if (!status.value) return
  const paused = !on
  const response = await setPaused(paused)
  if (response.succeeded) {
    status.value = { ...status.value, paused }
    $toast.success(paused ? 'Weekly reports paused for everyone.' : 'Weekly reports resumed.')
  }
}

onMounted(async () => {
  const response = await getStatus()
  if (response.succeeded && response.data) status.value = response.data
})

const userId = ref<number | null>(null)
const weekOf = ref<string | null>(null)
const result = ref<WeeklyReportPreviewDTO | null>(null)

async function preview() {
  if (!(Number(userId.value) > 0)) return
  const response = await getPreview({ userId: Number(userId.value), weekOf: weekOf.value || undefined })
  result.value = response.succeeded && response.data ? response.data : null
}
</script>

<style scoped>
.weekly-report-admin {
  max-width: 1000px;
}

.weekly-report-admin__card {
  border-color: rgb(var(--v-theme-borderSubtle)) !important;
}

.weekly-report-admin__status-text {
  flex: 1 1 320px;
  min-width: 0;
}

.weekly-report-admin__field {
  flex: 1 1 220px;
  min-width: 0;
}

.weekly-report-admin__frame {
  width: 100%;
  height: 1100px;
  border: 1px solid rgb(var(--v-theme-borderSubtle));
  border-radius: 8px;
  background: rgb(var(--v-theme-white));
}
</style>
