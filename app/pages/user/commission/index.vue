<template>
  <div class="w-100 d-flex flex-column ga-2">
    <div
      v-if="!xs || isShowChart"
      class="commission-chart-div w-100 bg-grey100 rounded-lg pa-2 d-flex align-start justify-start"
    >
      <user-commission-chart />
    </div>
    <div class="w-100 mt-4">
      <user-commission-history @show-chart="changeStatusChart" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

definePageMeta({
  layout: 'dashboard-layout',
  middleware: ['auth', 'user-type'],
})

useHead({
  title: 'Commission',
  meta: [
    { name: 'description', content: 'View your commission income and history' },
  ],
})

const { xs } = useDisplay()
const isShowChart = ref(false)

const changeStatusChart = () => {
  isShowChart.value = !isShowChart.value
}
</script>

<style scoped>
.commission-chart-div {
  max-width: 370px;
  min-width: 300px;
  height: fit-content;
  min-height: 280px;
}

@media screen and (max-width: 960px) {
  .commission-chart-div {
    max-width: 100%;
  }
}
</style>
