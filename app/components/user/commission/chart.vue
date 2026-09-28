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
import type { CommissionStatisticDTO } from '@/types'
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

type CommissionChartMetric = 'amountUsd' | 'points'

const props = withDefaults(defineProps<{
  items: CommissionStatisticDTO[]
  loading: boolean
  metric: CommissionChartMetric
  title: string
  label: string
  color?: string
}>(), {
  color: 'success',
})

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

const chartColor = computed(() => theme.current.value.colors[props.color] ?? props.color)

const chartData = reactive({
  labels: [] as string[],
  datasets: [
    {
      label: props.label,
      data: [] as number[],
      borderColor: chartColor.value,
      backgroundColor: chartColor.value,
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
      text: props.title,
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

const updateChartWithData = () => {
  const filteredData = props.items.filter(item => item.name !== '')
  const labels = filteredData.map(item => item.name)
  const values = filteredData.map(item => item[props.metric])
  const maxValue = Math.max(...values, 0)

  chartData.labels = labels
  chartData.datasets[0]!.label = props.label
  chartData.datasets[0]!.data = values
  chartData.datasets[0]!.borderColor = chartColor.value
  chartData.datasets[0]!.backgroundColor = chartColor.value
  chartOptions.plugins!.title!.text = props.title
  chartOptions.scales!.y!.suggestedMax = Math.ceil(maxValue * 1.1)
}

watch(
  () => [props.items, props.metric, props.label, props.title, chartColor.value],
  updateChartWithData,
  { immediate: true, deep: true },
)
</script>

<style scoped>
.chart-loading {
  min-height: 260px;
  max-width: 340px;
}
</style>
