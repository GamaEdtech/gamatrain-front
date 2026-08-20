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
import type { Chart, ChartOptions } from 'chart.js'
import type { UserCommissionDTO } from '@/types'
import dayjs from 'dayjs'
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
const {
  data,
  getData,
} = useCommission()

const loading = ref(true)
const chartData = reactive({
  labels: [] as string[],
  datasets: [
    {
      label: 'Income',
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
      text: 'Commission Income',
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

const getMonthKey = (date: string) => {
  return dayjs(date).format('MMM YYYY')
}

const updateChartWithData = (items: UserCommissionDTO[]) => {
  const groupedData = items.reduce<Record<string, number>>((result, item) => {
    const key = getMonthKey(item.creationDate)
    result[key] = (result[key] ?? 0) + item.amountUsd

    return result
  }, {})

  const labels = Object.keys(groupedData)
  const values = Object.values(groupedData)
  const maxValue = Math.max(...values, 0)

  chartData.labels = labels
  chartData.datasets[0]!.data = values
  chartOptions.scales!.y!.suggestedMax = Math.ceil(maxValue * 1.1)
}

onMounted(async () => {
  loading.value = true
  await getData({
    page: 1,
    pageSize: 200,
    startDate: '',
    endDate: '',
  })
  updateChartWithData(data.value)
  loading.value = false
})
</script>

<style scoped>
.chart-loading {
  min-height: 260px;
  max-width: 340px;
}
</style>
