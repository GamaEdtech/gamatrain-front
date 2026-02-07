<template>
  <div class="w-100 d-flex flex-column">
    <div class="wallet-chart-div bg-grey100 rounded-lg pa-2 d-flex flex-column flex-sm-row flex-md-column align-center justify-space-between ga-2">
      <user-wallet-balance-card />
      <user-wallet-transaction-chart />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard-layout',
})

useHead({
  title: 'Wallet',
  meta: [
    { name: 'description', content: 'Manage your GET tokens and view transaction history' },
  ],
})
</script>

<style scoped>
.wallet-chart-div{
  max-width: 370px;
}

@media screen and (max-width: 960px) {
  .wallet-chart-div{
  max-width: 100%;
}
}
</style>
