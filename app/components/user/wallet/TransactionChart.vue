<template>
  <div class="w-100 position-relative">
    <div
      v-if="loading"
      class="w-100 d-flex justify-center align-center"
    >
      <v-skeleton-loader
        width="340"
        height="240"
        class="rounded-lg"
      />
    </div>

    <div
      v-else
      class="position-relative w-100 h-100 d-flex justify-center align-center"
    >
      <LineChart
        :data="chartData"
        :options="chartOptions"
        :plugins="[legendMargin]"
        class="chart-loading"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  ApiResult,
  TransactionStatisticDTO,
} from '~/types/api'
import type { ChartOptions, Chart } from 'chart.js'
import { ref, reactive, onMounted } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
} from 'chart.js'
import { Line as LineChart } from 'vue-chartjs'
import { useTheme } from 'vuetify'

// Register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
)

const theme = useTheme()
const loading = ref(true)
const selectedPeriod = ref('MonthOfYear')

const chartData = reactive({
  labels: [] as string[],
  datasets: [
    {
      label: 'Spent',
      data: [] as number[],
      borderColor: theme.current.value.colors['lightError'],
      backgroundColor: theme.current.value.colors['lightError'],
      tension: 0.4,
      pointRadius: 0,
      borderWidth: 2,
      fill: false,
    },
    {
      label: 'Earned',
      data: [] as number[],
      borderColor: theme.current.value.colors['success'],
      backgroundColor: theme.current.value.colors['success'],
      tension: 0.4,
      pointRadius: 0,
      borderWidth: 2,
      fill: false,
    },
  ],
})
const legendMargin = {
  id: 'legendMargin',
  beforeInit(chart: Chart) {
    if (chart.legend) {
      const originalFit = chart.legend.fit

      chart.legend.fit = function fit() {
        originalFit.bind(chart.legend)()

        this.height += 20
      }
    }
  },
}
const chartOptions = reactive<ChartOptions<'line'>>({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: 'Transaction History',
      align: 'start',
      color: theme.current.value.colors['grey500'],
      font: {
        size: 14,
        weight: 'bold',
      },
      padding: {
        top: 6,
        bottom: -28,
      },
    },
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
        color: theme.current.value.colors['grey500'],
        font: {
          size: 12,
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: theme.current.value.colors['grey500'],
        font: {
          size: 12,
        },
        padding: 10,
      },
    },
    y: {
      beginAtZero: true,
      suggestedMax: undefined,
      ticks: {
        stepSize: 50,
        color: theme.current.value.colors['grey500'],
        font: {
          size: 12,
        },
        padding: 10,
      },
      grid: {
        color: theme.current.value.colors['grey200'],
      },
    },
  },
})

const fetchChartData = async () => {
  loading.value = true

  try {
    const response = await useApiService.get<ApiResult<TransactionStatisticDTO[]>>('/api/v2/transactions/statistics', {
      Period: selectedPeriod.value,
    })

    if (response.succeeded && response.data) {
      updateChartWithData(response.data)
    }
  }
  catch (err) {
    console.error('Error fetching chart data:', err)
  }
  finally {
    loading.value = false
  }
}

const updateChartWithData = (data: TransactionStatisticDTO[]) => {
  // Filter out the empty record
  const filteredData = data.filter(item => item.name !== '')

  // Extract labels and values
  const labels = filteredData.map(item => item.name)
  const debitValues = filteredData.map(item => item.debitValue / 1_000_000)
  const creditValues = filteredData.map(item => item.creditValue / 1_000_000)

  // Calculate max value for Y axis
  const maxValue = Math.max(
    ...debitValues,
    ...creditValues,
    0, // Minimum value to show on the chart
  )

  // Update chart data
  chartData.labels = labels
  chartData.datasets[0]!.data = debitValues
  chartData.datasets[1]!.data = creditValues

  // Update Y axis scale
  chartOptions.scales!.y!.suggestedMax = Math.ceil(maxValue * 1.1) // Add 10% padding
}

// Lifecycle hooks
onMounted(() => {
  fetchChartData()
})
</script>

<style scoped>
.chart-loading {
  min-height: 260px;
  max-width : 340px
}
.title-table{
  top : 10px
}
</style>
