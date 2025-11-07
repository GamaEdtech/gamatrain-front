<template>
  <div class="wallet-page">
    <div class="wallet-page-container">
      <!-- Balance Card and Chart Section -->
      <v-row>
        <v-col
          cols="12"
          sm="6"
          md="6"
        >
          <user-wallet-balance-card />
        </v-col>

        <v-col
          cols="12"
          sm="6"
          md="6"
          class="d-none d-sm-block"
        >
          <user-wallet-transaction-chart
            class="transaction-chart"
          />
        </v-col>
      </v-row>
    </div>
    <div class="px-4">
      <!-- Mobile Chart (Initially Hidden) -->
      <v-expand-transition>
        <div
          v-if="showMobileChart"
          class="d-block d-sm-none mt-6 mobile-chart-container"
        >
          <div class="pa-4 rounded-lg bg-primary-gray-100">
            <user-wallet-transaction-chart
              class="transaction-chart h-full"
            />
          </div>
        </div>
      </v-expand-transition>

      <!-- Transaction History Section -->
      <user-wallet-transaction-history
        :is-chart-visible="showMobileChart"
        @toggle-chart="toggleMobileChart"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// Page metadata
definePageMeta({
  layout: 'dashboard-layout',
})

// Set page title
useHead({
  title: 'Wallet - Gama',
  meta: [
    { name: 'description', content: 'Manage your GET tokens and view transaction history' },
  ],
})

// Define reactive state
const showMobileChart = ref(false)

// Methods
const toggleMobileChart = () => {
  showMobileChart.value = !showMobileChart.value
}
</script>

<style scoped>
.wallet-page-container {
  background: #f2f4f7 !important;
  padding: 26px 26px;
}
@media only screen and (min-width: 600px) {
  .wallet-page {
    padding: 16px;
  }
  .wallet-page-container {
    background: #f2f4f7 !important;
    border-radius: 16px;
    padding: 20px 20px;
  }
}

.transaction-chart {
  margin-bottom: 16px;
  position: relative;
  width: 100%;
  height: max-content;
}

.mobile-chart-container .transaction-chart {
  height: 250px;
}
</style>
