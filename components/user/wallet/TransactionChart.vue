<template>
  <div class="chart-container">
    <div class="text-h5 primary-gray-700 font-weight-bold pb-2">
      Transaction History
    </div>

    <div
      v-if="loading"
      class="chart-loading d-flex justify-center align-center"
    >
      <v-progress-circular
        indeterminate
        color="primary"
      />
    </div>

    <div
      v-else
      class="chart-wrapper"
    >
      <LineChart
        :data="chartData"
        :options="chartOptions"
        style="min-height: 240px"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useApiService } from '~/composables/useApiService'
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

// Composables
const auth = useAuth()
const { $toast: _toast } = useNuxtApp()

// Reactive state
const loading = ref(false)
const selectedPeriod = ref('MonthOfYear')
const token = ref('')

const _periodOptions = [
  { text: 'Monthly', value: 'MonthOfYear' },
  { text: 'Weekly', value: 'DayOfWeek' },
]

const chartData = reactive({
  labels: [],
  datasets: [
    {
      label: 'Spent',
      data: [],
      borderColor: 'rgb(235, 77, 75)',
      backgroundColor: 'rgb(235, 77, 75)',
      tension: 0.4,
      pointRadius: 0,
      borderWidth: 2,
      fill: false,
    },
    {
      label: 'Earned',
      data: [],
      borderColor: 'rgb(46, 213, 115)',
      backgroundColor: 'rgb(46, 213, 115)',
      tension: 0.4,
      pointRadius: 0,
      borderWidth: 2,
      fill: false,
    },
  ],
})

const chartOptions = reactive({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      align: 'end',
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 25,
        boxWidth: 10,
        boxHeight: 10,
        color: '#666',
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      backgroundColor: 'white',
      titleColor: '#333',
      bodyColor: '#666',
      borderColor: '#eee',
      borderWidth: 1,
      padding: 10,
      displayColors: true,
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || ''
          if (label) {
            label += ': '
          }
          label += context.parsed.y + ' $GET'
          return label
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
        color: '#999',
        font: {
          size: 12,
        },
        padding: 10,
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 50,
        callback: function (value) {
          return value
        },
        color: '#999',
        font: {
          size: 12,
        },
        padding: 10,
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
        borderDash: [3],
        drawBorder: false,
      },
    },
  },
})

// Methods
const getToken = () => {
  if (import.meta.client) {
    token.value = localStorage.getItem('v2_token') || ''
  }
}

const fetchChartData = async () => {
  loading.value = true

  try {
    const response = await useApiService('/api/v2/transactions/statistics', {
      method: 'GET',
      params: {
        Period: selectedPeriod.value,
      },
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    })

    if (response.succeeded && response.data) {
      updateChartWithData(response.data)
    }
  }
  catch (err) {
    if (err.response && err.response.status === 403) {
      auth.logout()
    }
    console.error('Error fetching chart data:', err)
  }
  finally {
    loading.value = false
  }
}

const updateChartWithData = (data) => {
  // Filter out the empty record
  const filteredData = data.filter(item => item.name !== '')

  // Extract labels and values
  const labels = filteredData.map(item => item.name)
  const debitValues = filteredData.map(item => item.debitValue)
  const creditValues = filteredData.map(item => item.creditValue)

  // Calculate max value for Y axis
  const maxValue = Math.max(
    ...debitValues,
    ...creditValues,
    50, // Minimum value to show on the chart
  )

  // Update chart data
  chartData.labels = labels
  chartData.datasets[0].data = debitValues
  chartData.datasets[1].data = creditValues

  // Update Y axis scale
  chartOptions.scales.y.suggestedMax = Math.ceil(maxValue * 1.1) // Add 10% padding
}

// Lifecycle hooks
onMounted(() => {
  getToken()
  fetchChartData()
})
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
}

.transaction-title {
  font-size: 16px;
}

.chart-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.chart-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.period-selector {
  max-width: 150px;
}

.legend-item {
  font-size: 12px;
}
.transaction-chart {
  margin-bottom: 0 !important;
}
.chart-loading {
  height: 200px;
}
</style>
