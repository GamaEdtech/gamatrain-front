<template>
  <div class="main-balance-card-div w-100 d-flex flex-column align-center justify-center ga-2">
    <span
      class="text-h5 font-weight-regular text-grey400 cursor-pointer"
      @click="toggleBalanceVisibility"
    >
      Main balance
      <v-icon
        color="grey400"
        size="14"
        class="ml-1"
      >{{ showBalance ? `md:visibility`:`md:visibility_off` }}</v-icon>
    </span>

    <div
      v-if="isLoading"
      class="d-flex align-center my-3"
    >
      <v-skeleton-loader
        width="160"
        height="30"
        class="rounded-lg"
        color="grey400"
      />
    </div>

    <div
      v-else-if="!showBalance"
      class="d-flex align-center my-3 container-dot"
    >
      <span
        v-for="i in 4"
        :key="i"
        class="dot mx-1 rounded-circle bg-grey400"
      />
    </div>
    <div
      v-else
      class="d-flex align-end position-relative my-3"
    >
      <span class="text-h6 font-weight-semibold text-primary mr-1">¢</span>
      <span class="text-h3 font-weight-bold text-white">{{ $numberFormat((Math.floor(balance))) }}</span>
      <img
        class="sign-wallet-amount position-absolute"
        src="@/assets/images/wallet/wallet-amount.png"
        alt="Wallet Amount"
      >
    </div>

    <div class="d-flex align-center justify-center">
      <div
        class="d-flex flex-column align-center justify-center ga-1 cursor-pointer"
        @click="showChargeWalletModal = true"
      >
        <v-icon
          color="grey400"
          size="20"
        >
          md:upload
        </v-icon>
        <span class="text-h6 font-weight-regular text-primary">Top up</span>
      </div>
      <v-divider
        :thickness="3"
        color="grey900"
        vertical
        class="mx-3"
      />
      <!-- Temporarily disable this area. To enable it again, add this event to the div -->
      <!-- @click="showWithdrawModal = true" -->
      <div
        class="d-flex flex-column align-center justify-center ga-1 opacity-60"
      >
        <v-icon
          color="grey400"
          size="20"
        >
          md:download
        </v-icon>
        <span class="text-h6 font-weight-regular text-primary">Withdraw</span>
      </div>
      <v-divider
        :thickness="3"
        color="grey900"
        vertical
        class="mx-3"
      />
      <div class="d-flex flex-column align-center justify-center ga-1 opacity-60">
        <v-icon
          color="grey400"
          size="20"
        >
          md:sync_alt
        </v-icon>
        <span class="text-h6 font-weight-regular text-primary">Transfer</span>
      </div>
    </div>

    <modals-coin-payment-modal
      v-model:show-dialog="showChargeWalletModal"
      :is-processing="isLoading"
      :user-balance="balance"
      :amount-to-pay="Infinity"
      @confirm="chargeComplete"
    />

    <modals-withdraw
      v-model:show-dialog="showWithdrawModal"
      :user-balance="balance"
      @update-balance="fetchBalance"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const { $numberFormat } = useNuxtApp()
const { balance, isLoading, fetchBalance } = useCoinBalance()
const showBalance = ref(true)
const showWithdrawModal = ref(false)
const showChargeWalletModal = ref(false)

const toggleBalanceVisibility = () => {
  showBalance.value = !showBalance.value
}

const chargeComplete = () => {
  showChargeWalletModal.value = false
  fetchBalance()
}

onMounted(() => {
  fetchBalance()
})
</script>

<style scoped>
.main-balance-card-div{
   background-image: url("@/assets/images/wallet/wallet-background.png");
   background-size: 100% 100%;
   height: 190px;
   max-width : 340px;
   border-radius: 16px;
}
.sign-wallet-amount{
  width: 14px;
  height: 14px;
  right: -14px;
  top: 4px;
}
.dot {
  width: 10px;
  height: 10px;
}
.container-dot{
  height : 32px
}
</style>
