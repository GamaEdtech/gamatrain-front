<template>
  <v-dialog
    v-model="dialogModel"
    max-width="500"
    :fullscreen="!mdAndUp"
    persistent
    @click="clickOnOverlay"
  >
    <div
      class="w-100 d-flex flex-wrap flex-column bg-white pa-6 rounded-xl mobile-style"
      @click="clickOnModal"
    >
      <v-row class="d-flex align-center">
        <v-col cols="10">
          <span class="text-h4">Withdraw</span>
        </v-col>
        <v-col
          cols="2"
          class="d-flex align-center justify-end ga-2"
        >
          <v-icon
            size="x-large"
            color="grey400"
            @click="closeModal"
          >
            md:close
          </v-icon>
        </v-col>
      </v-row>

      <template v-if="step == 1">
        <span class="w-100 text-h5 text-start mt-4">
          Enter the amount you want to withdraw from the account.
        </span>

        <div class="w-100 d-flex flex-wrap align-start justify-start mt-6">
          <div class="w-100 d-flex align-center justify-start mb-1">
            <span class="text-h6 text-grey400">Your Balance :<span class="text-grey600 font-weight-bold">{{
              Math.floor(userBalance) / 1000000
            }}</span>

            </span>
          </div>
          <v-text-field
            v-model="withdrawValue"
            class="w-100"
            variant="outlined"
            density="comfortable"
            rounded="lg"
            color="primary"
            :error="!!withdrawError"
            :error-messages="withdrawError"
            type="Number"
            hide-spin-buttons
            hint="The minimum withdrawal amount is 100,000 $GET."
            persistent-hint
          >
            <template #prepend-inner>
              <img
                width="20"
                height="20"
                src="/images/gama-coin.svg"
                alt="Coin Logo"
                class="rounded-circle"
              >
            </template>
          </v-text-field>
          <div class="w-100 d-flex align-center justify-start ga-2 mt-4">
            <v-btn
              flat
              color="info"
              width="70"
              max-height="26"
              rounded="pill"
              variant="tonal"
              class="text-h5 font-weight-bold"
              @click="selectMaximumBalance"
            >
              Max
            </v-btn>
            <v-btn
              flat
              color="info"
              width="70"
              max-height="26"
              rounded="pill"
              variant="tonal"
              class="text-h5 font-weight-bold"
              @click="selectHalfBalance"
            >
              Half
            </v-btn>
          </div>
        </div>

        <div class="w-100 d-flex align-center justify-center mt-4">
          <v-btn
            :disabled="disableFistStep"
            color="success"
            flat
            rounded="lg"
            max-width="200"
            class="w-50 font-weight-bold text-h5 mt-4 mx-auto"
            @click="goToSecondStep"
          >
            Next Step
          </v-btn>
        </div>
      </template>

      <template v-if="step == 2">
        <span class="text-h4 font-weight-bold w-100 text-center mt-4">Connect Your Wallet</span>
        <span class="text-h5 font-weight-normal w-100 text-center mt-4">Amount to withdraw : <span class="font-weight-bold">{{ Number(withdrawValue) }}</span></span>
        <div class="wallet-button-container d-flex w-100 align-center justify-center mt-6">
          <ClientOnly>
            <WalletMultiButton v-if="walletInitialized" />
            <v-skeleton-loader
              v-else
              width="175"
              height="48"
              class="rounded-lg"
            />
          </ClientOnly>
        </div>

        <div class="w-100 d-flex align-center justify-center mt-4">
          <v-btn
            :disabled="!wallet?.connected"
            :loading="loadingWithdrawProcess"
            color="success"
            flat
            rounded="lg"
            max-width="200"
            class="w-50 font-weight-bold text-h5 mt-4 mx-auto"
            @click="confirmWithdraw"
          >
            Confirm
          </v-btn>
        </div>
      </template>
    </div>
  </v-dialog>
</template>

<script setup lang="ts">
import type { ApiResult } from '~/types/api'
import { useDisplay } from 'vuetify'
import { computed } from 'vue'

interface ErrorWithdraw {
  statusMessage: string
  statusCode: number
}

const { mdAndUp } = useDisplay()
const { $toast } = useNuxtApp()
const auth = useAuth()

const props = defineProps({
  showDialog: {
    type: Boolean,
    default: false,
  },
  userBalance: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['update:showDialog', 'updateBalance'])

const dialogModel = computed({
  get: () => props.showDialog,
  set: value => emit('update:showDialog', value),
})

const withdrawValue = ref()
const loadingWithdrawProcess = ref(false)
const wallet = ref()
const config = useRuntimeConfig()
const walletInitialized = ref(false)
const step = ref(1)

const closeModal = () => {
  if (loadingWithdrawProcess.value) {
    $toast.info('Please wait until the process is complete.')
  }
  else {
    emit('update:showDialog', false)
    withdrawValue.value = null
    step.value = 1
  }
}

const clickOnOverlay = () => {
  if (!mdAndUp.value) {
    if (loadingWithdrawProcess.value) {
      $toast.info('Please wait until the process is complete.')
    }
    else {
      emit('update:showDialog', false)
      withdrawValue.value = null
      step.value = 1
    }
  }
}

const clickOnModal = (event: Event) => {
  event.stopPropagation()
}

const selectMaximumBalance = () => {
  withdrawValue.value = props.userBalance / 1_000_000
}

const selectHalfBalance = () => {
  withdrawValue.value = (props.userBalance / 2) / 1_000_000
}

const userBalanceInCoin = computed(() => {
  return props.userBalance / 1_000_000
})
const withdrawError = computed(() => {
  if (withdrawValue.value == null) {
    return ''
  }
  if (withdrawValue.value <= 0) {
    return 'Amount must be greater than zero'
  }

  if (withdrawValue.value > userBalanceInCoin.value) {
    return 'Amount exceeds your balance'
  }

  return ''
})
const disableFistStep = computed(() => {
  return withdrawError.value !== '' || withdrawValue.value == null || withdrawValue.value == ''
})

const goToSecondStep = async () => {
  step.value = 2
  await initSolanaWallet()
}

const WalletMultiButton = defineAsyncComponent(async () => {
  if (import.meta.client) {
    const { WalletMultiButton } = await import('solana-wallets-vue')
    return WalletMultiButton
  }
  return { template: '<div>Loading...</div>' }
})

const initSolanaWallet = async () => {
  if (walletInitialized.value) return

  try {
    await import('solana-wallets-vue/styles.css')

    const { initWallet, useWallet } = await import('solana-wallets-vue')
    const { WalletAdapterNetwork } = await import('@solana/wallet-adapter-base')
    const adapters = await import('@solana/wallet-adapter-wallets')

    const netStr = config.public?.solanaNetwork?.toLowerCase() || 'mainnet'
    const network
      = netStr === 'devnet'
        ? WalletAdapterNetwork.Devnet
        : netStr === 'testnet'
          ? WalletAdapterNetwork.Testnet
          : WalletAdapterNetwork.Mainnet

    initWallet({
      wallets: [
        new adapters.PhantomWalletAdapter(),
        new adapters.CloverWalletAdapter(),
        new adapters.Coin98WalletAdapter(),
        new adapters.SolflareWalletAdapter({ network }),
      ],
      autoConnect: true,
    })

    wallet.value = useWallet()

    if (!window.Buffer) {
      const { Buffer } = await import('buffer')
      window.Buffer = Buffer
    }
    walletInitialized.value = true
  }
  catch (err) {
    console.error('❌ Solana wallet init failed:', err)
  }
}

const confirmWithdraw = async () => {
  if (!wallet?.value?.publicKey) {
    $toast.error('Wallet is not connected')
    return
  }

  if (!withdrawValue.value || withdrawValue.value <= 0) {
    $toast.error('Invalid withdraw amount')
    return
  }

  const amount = withdrawValue.value * 1_000_000

  try {
    loadingWithdrawProcess.value = true

    const transferResult = await useApiService.post<ApiResult<unknown>>(
      '/api/solana/transfer',
      {
        token: auth.getUserTokenV2(),
        to: wallet.value.publicKey.toBase58(),
        amount,
      },
    )

    if (!transferResult?.succeeded) {
      $toast.error('The operation failed. Please try again later.')
      return
    }

    $toast.success('Withdrawal completed successfully')
    emit('update:showDialog', false)
    emit('updateBalance')
    withdrawValue.value = null
    step.value = 1
  }
  catch (err: unknown) {
    const error = err as ErrorWithdraw
    if (error.statusMessage) {
      $toast.error(error.statusMessage)
    }
    else {
      $toast.error('Unexpected error occurred')
    }
  }
  finally {
    loadingWithdrawProcess.value = false
  }
}
</script>

<style>
.swv-modal {
  z-index: 2410 !important;
}
.wallet-button-container{
  min-height : 48px
}
@media only screen and (max-width: 960px) {
  .mobile-style {
    position: absolute;
    bottom: 0;
    border-radius: 24px 24px 0 0 !important;
  }
}
</style>
