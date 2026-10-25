<template>
  <v-row dense>
    <v-col
      v-for="i in (loading && !overview ? 4 : 0)"
      :key="`skeleton-${i}`"
      cols="6"
      lg="3"
    >
      <v-skeleton-loader
        height="118"
        class="rounded-xl"
      />
    </v-col>
    <v-col
      v-for="tile in tiles"
      :key="tile.title"
      cols="6"
      lg="3"
    >
      <v-card
        border
        flat
        rounded="xl"
        class="h-100 pa-4 d-flex flex-column ga-2"
      >
        <div class="d-flex align-center justify-space-between ga-2">
          <span class="text-h6 font-weight-medium text-grey500 text-truncate">{{ tile.title }}</span>
          <v-avatar
            :color="tile.color"
            variant="tonal"
            rounded="lg"
            size="32"
          >
            <v-icon size="18">
              {{ tile.icon }}
            </v-icon>
          </v-avatar>
        </div>
        <span class="text-h3 font-weight-bold text-grey800">{{ tile.value }}</span>
        <span class="text-subtitle-1 text-grey500">{{ tile.hint }}</span>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { AdminDashboardOverviewDTO } from '@/types'

const props = defineProps<{
  overview: AdminDashboardOverviewDTO | null
  loading: boolean
}>()

const number = (value: number) => value.toLocaleString('en-US')
const usd = (value: number) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const tiles = computed(() => {
  const o = props.overview
  if (!o) return []
  return [
    { title: 'Revenue', value: usd(o.revenueUsd), hint: `${number(o.revenue.reduce((sum, t) => sum + t.count, 0))} paid payments`, icon: 'md:payments', color: 'success' },
    { title: 'New subscriptions', value: number(o.newSubscriptions), hint: `${number(o.expiredSubscriptions)} expired this period`, icon: 'md:workspace_premium', color: 'primary' },
    { title: 'Active subscriptions', value: number(o.activeSubscriptions), hint: o.cancellingSubscriptions ? `${number(o.cancellingSubscriptions)} set to cancel` : 'none set to cancel', icon: 'md:verified', color: 'info' },
    { title: 'Sign-ups', value: number(o.signUps), hint: `${number(o.teacherSignUps)} teachers · ${number(o.studentSignUps)} students`, icon: 'md:person_add', color: 'blue500' },
  ]
})
</script>
