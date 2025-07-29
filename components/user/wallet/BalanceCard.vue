<template>
  <div
    class="balance-card rounded-lg h-full"
    dark
  >
    <div class="balance-card-content pb-5 pt-6">
      <div
        class="balance-title d-flex align-center mb-4 cursor-pointer"
        @click="toggleBalanceVisibility"
      >
        <span class="text-xl-h4 gray--text">Main balance</span>
        <v-icon class="ml-2 gray--text">
          {{ showBalance ? "mdi-eye" : "mdi-eye-off" }}
        </v-icon>
      </div>

      <div
        v-if="loading"
        class="balance-amount d-flex align-center"
      >
        <v-skeleton-loader
          type="image"
          width="100"
          height="30"
          class="my-2"
          color="grey"
        />
      </div>

      <div
        v-else-if="!showBalance"
        class="balance-amount d-flex align-center"
      >
        <div class="hidden-balance">
          <span
            v-for="n in 4"
            :key="n"
            class="dot mx-1"
          />
        </div>
      </div>

      <div
        v-else
        class="balance-amount d-flex align-center mb-8"
      >
        <span class="currency mr-2 mt-3 yellow--text-darken">$GET</span>
        <span class="amount text-white">{{ Math.floor(balance) }}</span>
        <span class="decimal text-white">.{{ getDecimal(balance) }}</span>
        <img
          class="mr-4 mb-4"
          src="/images/wallet/wallet-amount.png"
        >
      </div>

      <div class="balance-actions d-flex justify-space-between">
        <div class="action-btn text-center">
          <v-icon
            small
            class="gray--text"
          >
            mdi-tray-arrow-up
          </v-icon>
          <div class="text-lg-h6 yellow--text-darken mt-2">
            Top up
          </div>
        </div>
        <div class="vertical-divider" />
        <div class="action-btn text-center">
          <v-icon
            small
            class="gray--text"
          >
            mdi-tray-arrow-down
          </v-icon>
          <div class="text-lg-h6 yellow--text-darken mt-2">
            Withdraw
          </div>
        </div>
        <div class="vertical-divider" />
        <div class="action-btn text-center">
          <v-icon
            small
            class="gray--text"
          >
            mdi-swap-horizontal
          </v-icon>
          <div class="text-lg-h6 yellow--text-darken mt-2">
            Transfer
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useApiService } from '~/composables/useApiService'

// Composables
const auth = useAuth()
const { $toast: _toast } = useNuxtApp()

// Reactive state
const balance = ref(0)
const loading = ref(true)
const showBalance = ref(true)
const token = ref('')

// Methods
const getToken = () => {
  if (import.meta.client) {
    token.value = localStorage.getItem('v2_token') || ''
  }
}

const fetchBalance = async () => {
  loading.value = true
  try {
    const response = await useApiService('/api/v2/transactions/balance', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    })

    if (response.succeeded) {
      balance.value = response.data
    }
  }
  catch (err) {
    if (err.response && err.response.status === 403) {
      auth.logout()
    }
    console.error('Error fetching balance:', err)
  }
  finally {
    loading.value = false
  }
}

const getDecimal = (num) => {
  return Math.floor((num % 1) * 100)
    .toString()
    .padStart(2, '0')
}

const toggleBalanceVisibility = () => {
  showBalance.value = !showBalance.value
}

// Lifecycle hooks
onMounted(() => {
  getToken()
  fetchBalance()
})
</script>

<style scoped>
.balance-card {
  background: url("/images/wallet/wallet-background.png"),
    radial-gradient(circle at top left, #2a3040, #1e2631);
  background-size: cover;
  background-position: center;
  color: white;
  border-radius: 16px !important;
  max-height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.balance-card-content {
  width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}

.balance-title {
  font-size: 14px;
}

.balance-amount {
  margin-top: 10px;
}

.currency {
  font-size: 12px;
  font-weight: bold;
}

.amount {
  font-size: 4rem;
  font-weight: bold;
}

.decimal {
  font-size: 18px;
  align-self: flex-start;
  margin-top: 16px;
}

.action-btn {
  cursor: pointer;
}

/* Hidden Balance Style */
.hidden-balance {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
}

.hidden-balance .dot {
  width: 10px;
  height: 10px;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
}

/* Skeleton Loading Styles */
:deep(.v-skeleton-loader__text) {
  background: rgba(255, 255, 255, 0.1) !important;
  border-radius: 8px;
}

.vertical-divider {
  width: 1px;
  height: 40px;
  background-color: #101828;
  margin: 0 10px;
}

.balance-actions {
  width: 100%;
  align-items: center;
}

.action-btn {
  cursor: pointer;
  flex: 1;
}
</style>
