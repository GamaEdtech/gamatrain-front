<template>
  <v-container class="w-100 d-flex flex-column">
    <div class="wallet-chart-div bg-grey100 rounded-lg pa-2 d-flex flex-column align-center justify-center">
      <user-wallet-balance-card />
    </div>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard-layout',
})

useHead({
  title: 'Wallet - Gama',
  meta: [
    { name: 'description', content: 'Manage your GET tokens and view transaction history' },
  ],
})
</script>

<style scoped>
.wallet-chart-div{
  max-width: 370px;
}
</style>
