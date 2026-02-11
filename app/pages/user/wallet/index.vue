<template>
  <div class="w-100 d-flex flex-column flex-md-row ga-2">
    <div class="wallet-chart-div w-100 bg-grey100 rounded-lg pa-2 d-flex flex-column flex-sm-row flex-md-column align-center justify-space-between ga-2">
      <user-wallet-balance-card />
      <user-wallet-transaction-chart v-if="!xs || isShowChart" />
    </div>
    <div class="w-100">
      <user-wallet-transaction-history @show-chart="changeStatusChart" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

definePageMeta({
  layout: 'dashboard-layout',
})

useHead({
  title: 'Wallet',
  meta: [
    { name: 'description', content: 'Manage your GET tokens and view transaction history' },
  ],
})

const { xs } = useDisplay()
const isShowChart = ref(false)

const changeStatusChart = () => {
  isShowChart.value = !isShowChart.value
}
</script>

<style scoped>
.wallet-chart-div{
  max-width: 370px;
  min-width: 300px;
  height : fit-content
}

@media screen and (max-width: 960px) {
  .wallet-chart-div{
    max-width: 100%;
  }
}
</style>
