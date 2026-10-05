<template>
  <div class="w-100 d-flex flex-column align-center justify-center">
    <div
      v-if="paymentSummary.length && !loadingPaymentSummary"
      class="w-100 d-flex justify-end mb-2"
    >
      <v-btn-toggle
        v-model="viewMode"
        color="primary"
        density="compact"
        rounded="lg"
        mandatory
        variant="outlined"
      >
        <v-btn
          value="status"
          size="small"
          class="text-h6"
        >
          By Status
        </v-btn>
        <v-btn
          value="kind"
          size="small"
          class="text-h6"
        >
          By Kind
        </v-btn>
      </v-btn-toggle>
    </div>

    <div
      v-if="loadingPaymentSummary"
      class="w-100 d-flex justify-center align-center"
    >
      <v-skeleton-loader
        class="w-100 rounded-lg"
        height="400"
      />
    </div>

    <div
      v-else-if="!paymentSummary.length"
      class="w-100 text-center text-h4 font-weight-bold text-grey500 mt-16"
    >
      No payment data found
    </div>

    <div
      v-else
      class="w-100 container-chart"
    >
      <BarChart
        ref="barChartRef"
        :data="chartData"
        :options="chartOptions"
        @click="handleChartClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LinearScale,
  CategoryScale,
  type ChartOptions,
} from 'chart.js'
import { Bar as BarChart } from 'vue-chartjs'
import { useTheme } from 'vuetify'
import type { PaymentSummaryDTO } from '@/types'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  LinearScale,
  CategoryScale,
)

const emit = defineEmits(['selectBar'])

const theme = useTheme()
const { paymentSummary, loadingPaymentSummary } = usePayment()

const barChartRef = ref()
const BORDERRADIUS = 10
const OPACITYCOLOR = 0.5

// "status" (Paid/Pending/Failed - unchanged, default) vs. "kind" (New subscription/Renewal/Plan
// switch/Points top-up - new, see docs/business/payments-and-points.md "Payment.Kind" on the
// backend). Two independent pivots of the same underlying rows, not meant to be stacked together
// in one bar - hence a toggle rather than adding a fifth+ series alongside the existing three.
const viewMode = ref<'status' | 'kind'>('kind')

const hexToRgba = (hex: string, opacity: number) => {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)

  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

const buildDataset = (label: string, colorHex: string, data: number[]) => ({
  label,
  data,
  borderColor: colorHex,
  backgroundColor: hexToRgba(colorHex, OPACITYCOLOR),
  borderRadius: BORDERRADIUS,
  stack: 'payments',
})

const statusDatasets = computed(() => [
  buildDataset('Paid Amount', theme.current.value.colors.success, paymentSummary.value.map(item => item.paidAmount)),
  buildDataset('Pending Amount', theme.current.value.colors.warning, paymentSummary.value.map(item => item.pendingAmount)),
  buildDataset('Failed Amount', theme.current.value.colors.error, paymentSummary.value.map(item => item.failedAmount)),
])

const kindDatasets = computed(() => [
  buildDataset('New Subscription', theme.current.value.colors.info, paymentSummary.value.map(item => item.newSubscriptionAmount)),
  buildDataset('Renewal', theme.current.value.colors.secondary, paymentSummary.value.map(item => item.renewalAmount)),
  buildDataset('Plan Switch', theme.current.value.colors.primary, paymentSummary.value.map(item => item.planSwitchAmount)),
  buildDataset('Points Top-Up', theme.current.value.colors.blueGray300, paymentSummary.value.map(item => item.pointsTopUpAmount)),
])

const chartData = computed(() => ({
  labels: paymentSummary.value.map(item => item.date),
  datasets: viewMode.value === 'kind' ? kindDatasets.value : statusDatasets.value,
}))

const TOOLTIP_LABELS: Record<string, { amountKey: keyof PaymentSummaryDTO, countKey: keyof PaymentSummaryDTO }> = {
  'Paid Amount': { amountKey: 'paidAmount', countKey: 'paidCount' },
  'Pending Amount': { amountKey: 'pendingAmount', countKey: 'pendingCount' },
  'Failed Amount': { amountKey: 'failedAmount', countKey: 'failedCount' },
  'New Subscription': { amountKey: 'newSubscriptionAmount', countKey: 'newSubscriptionCount' },
  'Renewal': { amountKey: 'renewalAmount', countKey: 'renewalCount' },
  'Plan Switch': { amountKey: 'planSwitchAmount', countKey: 'planSwitchCount' },
  'Points Top-Up': { amountKey: 'pointsTopUpAmount', countKey: 'pointsTopUpCount' },
}

const chartOptions = computed<ChartOptions<'bar'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,

  elements: {
    bar: {
      borderWidth: 2,
      categoryPercentage: 0.7,
      barPercentage: 0.9,
    },
  },

  interaction: {
    intersect: false,
  },

  plugins: {
    legend: {
      display: true,
      position: 'top',
      align: 'end',
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 15,
        boxWidth: 10,
        boxHeight: 10,
        color: theme.current.value.colors.grey500,
        font: {
          size: 12,
        },
      },
    },

    tooltip: {
      callbacks: {
        label(context) {
          const dataIndex = context.dataIndex
          const datasetLabel = context.dataset.label
          const item = paymentSummary.value[dataIndex]

          if (!item || !datasetLabel)
            return ''

          const mapping = TOOLTIP_LABELS[datasetLabel]
          if (!mapping)
            return ''

          return [
            `${datasetLabel}: ${item[mapping.amountKey]}`,
            `Count: ${item[mapping.countKey]}`,
          ]
        },
      },
    },
  },

  scales: {
    x: {
      stacked: true,

      ticks: {
        color: theme.current.value.colors.grey500,
        font: {
          size: 12,
        },
        padding: 10,
      },
      grid: {
        display: false,
      },
    },

    y: {
      stacked: true,
      beginAtZero: true,
      ticks: {
        color: theme.current.value.colors.grey500,
        font: {
          size: 12,
        },
        padding: 10,
      },

      grid: {
        color: theme.current.value.colors.grey200,
      },
    },
  },
}))

const handleChartClick = (event: MouseEvent) => {
  const chart = barChartRef.value?.chart

  if (!chart)
    return

  const elements = chart.getElementsAtEventForMode(
    event,
    'nearest',
    { intersect: true },
    true,
  )

  if (!elements.length)
    return

  const firstElement = elements[0]
  const dataIndex = firstElement.index
  const item = paymentSummary.value[dataIndex]

  emit('selectBar', item)
}
</script>

<style scoped>
.container-chart{
  height: 400px;
}
</style>
