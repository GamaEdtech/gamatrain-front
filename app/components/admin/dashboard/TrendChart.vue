<template>
  <v-card
    border
    flat
    rounded="xl"
    class="h-100 pa-4 pa-md-5 d-flex flex-column ga-3"
  >
    <div class="d-flex align-center justify-space-between flex-wrap ga-2">
      <span class="text-h5 font-weight-bold text-grey700">Daily trends</span>
      <v-btn-toggle
        v-model="metric"
        mandatory
        density="compact"
        rounded="pill"
        variant="outlined"
        color="primary"
      >
        <v-btn
          value="activity"
          size="small"
          class="text-h6"
        >
          Activity
        </v-btn>
        <v-btn
          value="revenue"
          size="small"
          class="text-h6"
        >
          Revenue
        </v-btn>
      </v-btn-toggle>
    </div>

    <v-skeleton-loader
      v-if="loading && !daily.length"
      height="280"
      class="rounded-lg"
    />
    <LineChart
      v-else
      :data="chartData"
      :options="chartOptions"
    />
  </v-card>
</template>

<script setup lang="ts">
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type ChartOptions,
} from 'chart.js'
import dayjs from 'dayjs'
import { Line as LineChart } from 'vue-chartjs'
import { useDisplay, useTheme } from 'vuetify'
import type { AdminDashboardOverviewDTO } from '@/types'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const props = defineProps<{
  daily: AdminDashboardOverviewDTO['daily']
  loading: boolean
}>()

// Chart.js draws on a canvas, so it needs real colors: they come from the Vuetify theme, not hard-coded.
const theme = useTheme()
const { smAndDown } = useDisplay()
const color = (name: string) => theme.current.value.colors[name] as string

const metric = ref<'activity' | 'revenue'>('activity')

// With only a few days (the start of a month) a line has little to draw: show each day's point, and centre the days.
const fewDays = computed(() => props.daily.length <= 7)

const series = (label: string, colorName: string, data: number[], fill = false) => ({
  label,
  data,
  borderColor: color(colorName),
  backgroundColor: fill ? `${color(colorName)}22` : color(colorName),
  fill,
  tension: 0.35,
  pointRadius: fewDays.value ? 3 : 0,
  pointHoverRadius: 4,
  borderWidth: 2,
})

const chartData = computed(() => ({
  labels: props.daily.map(t => dayjs(t.date).format('D MMM')),
  datasets: metric.value === 'revenue'
    ? [series('Revenue (USD)', 'success500', props.daily.map(t => t.revenueUsd), true)]
    : [
        series('Sign-ups', 'blue500', props.daily.map(t => t.signUps), true),
        series('Paid payments', 'success500', props.daily.map(t => t.paidPayments)),
        series('Invited sign-ups', 'primary', props.daily.map(t => t.invitedSignUps)),
        series('Teachers joined invite program', 'generalSearchQuiz', props.daily.map(t => t.inviteJoins)),
      ],
}))

const chartOptions = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  // The canvas keeps this width:height ratio, so no CSS height is needed.
  aspectRatio: smAndDown.value ? 1.4 : 2.6,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, padding: 16 } },
    tooltip: {
      callbacks: metric.value === 'revenue'
        ? { label: ctx => ` $${Number(ctx.parsed.y).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` }
        : {},
    },
  },
  scales: {
    x: { grid: { display: false }, offset: fewDays.value, ticks: { maxTicksLimit: 10 } },
    y: {
      beginAtZero: true,
      grid: { color: color('surfaceTertiary') },
      ticks: {
        precision: metric.value === 'revenue' ? undefined : 0,
        callback: value => (metric.value === 'revenue' ? `$${value}` : value),
      },
    },
  },
}))
</script>
