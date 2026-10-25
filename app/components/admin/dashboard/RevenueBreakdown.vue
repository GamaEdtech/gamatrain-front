<template>
  <v-card
    border
    flat
    rounded="xl"
    class="h-100 pa-4 pa-md-5 d-flex flex-column ga-4"
  >
    <span class="text-h5 font-weight-bold text-grey700">Revenue by type</span>

    <v-skeleton-loader
      v-if="loading && !overview"
      height="200"
      class="rounded-lg"
    />
    <div
      v-else-if="!rows.length"
      class="flex-grow-1 d-flex flex-column align-center justify-center text-center ga-1 py-6"
    >
      <v-icon
        size="36"
        color="grey300"
      >
        md:receipt_long
      </v-icon>
      <span class="text-h6 text-grey500">No paid payments in this period</span>
    </div>
    <template v-else>
      <div
        v-for="row in rows"
        :key="row.label"
        class="d-flex flex-column ga-1"
      >
        <div class="d-flex align-center justify-space-between ga-2">
          <span class="text-h6 font-weight-medium text-grey700">{{ row.label }}</span>
          <span class="text-h6 font-weight-bold text-grey800">{{ usd(row.amountUsd) }}</span>
        </div>
        <v-progress-linear
          :model-value="row.share"
          :color="row.color"
          bg-color="grey100"
          bg-opacity="1"
          height="8"
          rounded
        />
        <span class="text-subtitle-1 text-grey500">{{ row.count }} {{ row.count === 1 ? 'payment' : 'payments' }}</span>
      </div>
      <span
        v-if="overview && overview.paymentsWithoutUsd"
        class="text-subtitle-1 text-grey500"
      >
        {{ overview.paymentsWithoutUsd }} crypto payments without a USD value are counted but not in these totals.
      </span>
    </template>
  </v-card>
</template>

<script setup lang="ts">
import type { AdminDashboardOverviewDTO } from '@/types'
import { PAYMENT_KIND_LABELS } from '~/constants'

const props = defineProps<{
  overview: AdminDashboardOverviewDTO | null
  loading: boolean
}>()

const COLORS: Record<string, string> = {
  NewSubscription: 'primary',
  Renewal: 'success',
  PlanSwitch: 'info',
  PointsTopUp: 'blue500',
}

const usd = (value: number) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const rows = computed(() => {
  const revenue = props.overview?.revenue ?? []
  const max = Math.max(...revenue.map(t => t.amountUsd), 0)
  return revenue.map(t => ({
    label: t.kind ? PAYMENT_KIND_LABELS[t.kind] ?? t.kind : 'Other',
    count: t.count,
    amountUsd: t.amountUsd,
    share: max > 0 ? (t.amountUsd / max) * 100 : 0,
    color: t.kind ? COLORS[t.kind] ?? 'grey500' : 'grey500',
  }))
})
</script>
