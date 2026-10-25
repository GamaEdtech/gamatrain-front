<template>
  <div class="w-100 d-flex flex-column ga-4">
    <v-skeleton-loader
      v-if="loading && !report"
      height="120"
      class="rounded-xl"
    />

    <template v-else-if="report">
      <v-card
        border
        flat
        rounded="xl"
        class="pa-4 pa-md-5"
      >
        <v-row dense>
          <v-col
            v-for="(step, index) in funnel"
            :key="step.label"
            cols="6"
            sm="4"
            md=""
            class="d-flex align-center justify-space-between ga-2"
          >
            <div class="d-flex flex-column ga-1">
              <span class="text-subtitle-1 text-grey500">{{ step.label }}</span>
              <span class="text-h3 font-weight-bold text-grey800">{{ step.value }}</span>
              <span
                v-if="step.rate"
                class="text-subtitle-1 text-grey500"
              >{{ step.rate }}</span>
            </div>
            <v-icon
              v-if="index < funnel.length - 1"
              class="d-none d-md-flex"
              color="grey300"
            >
              md:chevron_right
            </v-icon>
          </v-col>
        </v-row>
      </v-card>

      <v-alert
        v-if="report.sharedNetworkSignUps"
        type="warning"
        variant="tonal"
        density="compact"
        rounded="xl"
        class="text-h6"
      >
        {{ report.sharedNetworkSignUps }} invited sign-up{{ report.sharedNetworkSignUps === 1 ? '' : 's' }} in this period came from a network
        the inviting teacher also used. That can be a self-invite, or just a shared school or family network: check before acting.
      </v-alert>

      <v-row dense>
        <v-col
          cols="12"
          lg="6"
        >
          <v-card
            border
            flat
            rounded="xl"
            class="h-100 pa-4 pa-md-5"
          >
            <span class="d-block text-h5 font-weight-bold text-grey700">Top teachers</span>
            <span class="d-block text-subtitle-1 text-grey500">All time, by earnings then sign-ups</span>
            <div
              v-if="!report.topTeachers.length"
              class="text-h6 text-grey500 text-center py-6"
            >
              No teacher has joined yet.
            </div>
            <v-list
              v-else
              lines="two"
              class="pa-0 mt-2"
            >
              <template
                v-for="(teacher, index) in report.topTeachers"
                :key="teacher.userId"
              >
                <v-divider v-if="index" />
                <v-list-item class="px-0">
                  <template #prepend>
                    <v-avatar
                      color="primary"
                      variant="tonal"
                      size="28"
                      class="text-h6 font-weight-bold"
                    >
                      {{ index + 1 }}
                    </v-avatar>
                  </template>
                  <v-list-item-title class="text-h6 font-weight-bold text-grey800">
                    {{ teacher.name || `User #${teacher.userId}` }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-subtitle-1">
                    {{ teacher.percent ?? '–' }}% · joined {{ formatLocal(teacher.joinedDate, 'D MMM YYYY') }}
                  </v-list-item-subtitle>
                  <template #append>
                    <div class="d-flex flex-column align-end">
                      <span class="text-h6 font-weight-bold text-success">{{ usd(teacher.earnedUsd) }}</span>
                      <span class="text-subtitle-1 text-grey500">{{ teacher.invited }} signed up · {{ teacher.paying }} paying</span>
                    </div>
                  </template>
                </v-list-item>
              </template>
            </v-list>
          </v-card>
        </v-col>

        <v-col
          cols="12"
          lg="6"
        >
          <v-card
            border
            flat
            rounded="xl"
            class="h-100 pa-4 pa-md-5"
          >
            <span class="d-block text-h5 font-weight-bold text-grey700">Recent invited sign-ups</span>
            <span class="d-block text-subtitle-1 text-grey500">In this period, newest first</span>
            <div
              v-if="!report.recentSignUps.length"
              class="text-h6 text-grey500 text-center py-6"
            >
              No one signed up through an invite link in this period.
            </div>
            <v-list
              v-else
              lines="two"
              class="pa-0 mt-2"
            >
              <template
                v-for="(item, index) in report.recentSignUps"
                :key="item.userId"
              >
                <v-divider v-if="index" />
                <v-list-item class="px-0">
                  <v-list-item-title class="text-h6 font-weight-bold text-grey800">
                    {{ item.name || `User #${item.userId}` }}
                    <v-chip
                      v-if="item.sharedNetwork"
                      size="x-small"
                      color="warning"
                      variant="flat"
                      class="ml-2 font-weight-bold"
                    >
                      Same network
                    </v-chip>
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-subtitle-1">
                    invited by {{ item.inviterName || `User #${item.inviterUserId}` }} · {{ formatLocal(item.signedUpDate, 'D MMM, HH:mm') }}
                  </v-list-item-subtitle>
                  <template #append>
                    <div class="d-flex flex-column align-end">
                      <span :class="['text-h6 font-weight-bold', item.payments ? 'text-success' : 'text-grey400']">
                        {{ item.payments ? usd(item.earnedUsd) : 'Not paid yet' }}
                      </span>
                      <span
                        v-if="item.payments"
                        class="text-subtitle-1 text-grey500"
                      >{{ item.payments }} {{ item.payments === 1 ? 'payment' : 'payments' }}</span>
                    </div>
                  </template>
                </v-list-item>
              </template>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { AdminReferralReportDTO } from '@/types'

const props = defineProps<{
  report: AdminReferralReportDTO | null
  loading: boolean
}>()

const { formatLocal } = useDateTime()

const usd = (value: number) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const rate = (part: number, whole: number) => (whole > 0 ? `${Math.round((part / whole) * 100)}% of previous` : '')

const funnel = computed(() => {
  const r = props.report
  if (!r) return []
  return [
    { label: 'Offers emailed', value: r.offersEmailed.toLocaleString('en-US'), rate: '' },
    { label: 'Teachers joined', value: r.teachersJoined.toLocaleString('en-US'), rate: rate(r.teachersJoined, r.offersEmailed) },
    { label: 'Invited sign-ups', value: r.invitedSignUps.toLocaleString('en-US'), rate: '' },
    { label: 'Paying invitees', value: r.payingInvitees.toLocaleString('en-US'), rate: rate(r.payingInvitees, r.invitedSignUps) },
    { label: 'Teachers earned', value: usd(r.earnedUsd), rate: '' },
  ]
})
</script>
