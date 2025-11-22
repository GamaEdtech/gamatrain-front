<template>
  <Pie
    :data="chartData"
    :options="chartOptions"
    :style="{ height: height + 'px', width: width + 'px' }"
  />
</template>

<script lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  ArcElement,
  CategoryScale,
} from 'chart.js'
import { Pie } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, ArcElement, CategoryScale)

export default {
  name: 'PieChart',
  components: {
    Pie,
  },
  props: {
    width: {
      type: Number,
      default: 220,
    },
    height: {
      type: Number,
      default: 220,
    },
    chartData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    }
  },
}
</script>
