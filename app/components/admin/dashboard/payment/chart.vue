<template>
  <div class="w-100 d-flex flex-column align-center justify-center">
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
        :data="chartData"
        :options="chartOptions"
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

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  LinearScale,
  CategoryScale,
)

const theme = useTheme()
const { paymentSummary, loadingPaymentSummary } = usePayment()

const BORDERRADIUS = 10
const OPACITYCOLOR = 0.5

const hexToRgba = (hex: string, opacity: number) => {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)

  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}
const chartData = computed(() => {
  return {
    labels: paymentSummary.value.map(item => item.date),

    datasets: [
      {
        label: 'Paid Amount',
        data: paymentSummary.value.map(item => item.paidAmount),
        borderColor: theme.current.value.colors.success,
        backgroundColor: hexToRgba(
          theme.current.value.colors.success,
          OPACITYCOLOR,
        ),
        borderRadius: BORDERRADIUS,
        stack: 'payments',
      },

      {
        label: 'Pending Amount',
        data: paymentSummary.value.map(item => item.pendingAmount),
        borderColor: theme.current.value.colors.warning,
        backgroundColor: hexToRgba(
          theme.current.value.colors.warning,
          OPACITYCOLOR,
        ),
        borderRadius: BORDERRADIUS,
        stack: 'payments',
      },

      {
        label: 'Failed Amount',
        data: paymentSummary.value.map(item => item.failedAmount),
        borderColor: theme.current.value.colors.error,
        backgroundColor: hexToRgba(
          theme.current.value.colors.error,
          OPACITYCOLOR,
        ),
        borderRadius: BORDERRADIUS,
        stack: 'payments',
      },
    ],
  }
})

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

          if (!item)
            return ''

          if (datasetLabel === 'Paid Amount') {
            return [
              `Paid Amount: ${item.paidAmount}`,
              `Paid Count: ${item.paidCount}`,
            ]
          }

          if (datasetLabel === 'Pending Amount') {
            return [
              `Pending Amount: ${item.pendingAmount}`,
              `Pending Count: ${item.pendingCount}`,
            ]
          }

          if (datasetLabel === 'Failed Amount') {
            return [
              `Failed Amount: ${item.failedAmount}`,
              `Failed Count: ${item.failedCount}`,
            ]
          }

          return ''
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
</script>

<style scoped>
.container-chart{
  height: 400px;
}
</style>
