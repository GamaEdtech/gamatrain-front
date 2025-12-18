<template>
  <v-dialog
    v-model="dialogModel"
    max-width="500"
    :fullscreen="!mdAndUp"
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
            color="#D0D5DD"
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
            }}</span></span>
          </div>
          <v-text-field
            v-model="withDrawValue"
            class="w-100"
            variant="outlined"
            density="comfortable"
            rounded="lg"
            color="#ffb300"
            :error="!!withdrawError"
            :error-messages="withdrawError"
            type="Number"
            hide-spin-buttons
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
        <span class="text-h6 font-weight-normal w-100 text-center mt-2">Choose a wallet to connect</span>
        <span class="text-h6 font-weight-normal w-100 text-center mt-2">Amount to withdraw : {{ Number(withDrawValue) }}</span>
        <div class="d-flex w-100 align-center justify-center mt-6">
          <ClientOnly>
            <WalletMultiButton />
          </ClientOnly>
        </div>

        <div class="w-100 d-flex align-center justify-center mt-4">
          <v-btn
            :disabled="!isWalletConnected"
            :loading="loadingWithDrawProcess"
            color="success"
            flat
            rounded="lg"
            max-width="200"
            class="w-50 font-weight-bold text-h5 mt-4 mx-auto"
            @click="confirmWithDraw"
          >
            Confirm
          </v-btn>
        </div>
      </template>
    </div>
  </v-dialog>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import type { PublicKey } from '@solana/web3.js'
import type { SignerWalletAdapterProps } from '@solana/wallet-adapter-base'
import { useDisplay } from 'vuetify'
import { computed } from 'vue'

interface WalletStore {
  publicKey: Ref<PublicKey | null>
  connected: Ref<boolean>
  signTransaction: Ref<SignerWalletAdapterProps['signTransaction'] | undefined>
  signAllTransactions: Ref<
    SignerWalletAdapterProps['signAllTransactions'] | undefined
  >
};

const { mdAndUp } = useDisplay()

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

const emit = defineEmits(['update:showDialog'])

const dialogModel = computed({
  get: () => props.showDialog,
  set: value => emit('update:showDialog', value),
})

const closeModal = () => {
  emit('update:showDialog', false)
  withDrawValue.value = 0
  step.value = 1
}

const clickOnOverlay = () => {
  if (!mdAndUp.value) {
    emit('update:showDialog', false)
    withDrawValue.value = 0
    step.value = 1
  }
}

const clickOnModal = (event: Event) => {
  event.stopPropagation()
}

const withDrawValue = ref()

const selectMaximumBalance = () => {
  withDrawValue.value = props.userBalance / 1_000_000
}

const selectHalfBalance = () => {
  withDrawValue.value = (props.userBalance / 2) / 1_000_000
}

const userBalanceInCoin = computed(() => {
  return props.userBalance / 1_000_000
})
const withdrawError = computed(() => {
  if (withDrawValue.value <= 0) {
    return 'Amount must be greater than zero'
  }

  if (withDrawValue.value > userBalanceInCoin.value) {
    return 'Amount exceeds your balance'
  }

  return ''
})
const disableFistStep = computed(() => {
  return withdrawError.value !== ''
})

const step = ref(1)
const goToSecondStep = () => {
  step.value = 2
}

const wallet = ref<WalletStore>()
const config = useRuntimeConfig()

const WalletMultiButton = defineAsyncComponent(async () => {
  if (import.meta.client) {
    const { WalletMultiButton } = await import('solana-wallets-vue')
    return WalletMultiButton
  }
  return { template: '<div>Loading...</div>' }
})
onMounted(async () => {
  if (import.meta.client) {
    try {
      await import('solana-wallets-vue/styles.css')

      const { default: SolanaWallets } = await import('solana-wallets-vue')
      const { WalletAdapterNetwork } = await import(
        '@solana/wallet-adapter-base'
      )
      const adapters = await import('@solana/wallet-adapter-wallets')

      const netStr = config.public?.solanaNetwork?.toLowerCase() || 'mainnet'
      const network
        = netStr === 'devnet'
          ? WalletAdapterNetwork.Devnet
          : netStr === 'testnet'
            ? WalletAdapterNetwork.Testnet
            : WalletAdapterNetwork.Mainnet

      const walletOptions = {
        wallets: [
          new adapters.PhantomWalletAdapter(),
          new adapters.CloverWalletAdapter(),
          new adapters.Coin98WalletAdapter(),
          new adapters.SolflareWalletAdapter({ network }),
        ],
        autoConnect: false,
      }

      const nuxtApp = useNuxtApp()
      nuxtApp.vueApp.use(SolanaWallets, walletOptions)
    }
    catch (err) {
      console.error('❌ Failed to load Solana wallet libraries:', err)
    }

    try {
      const { useWallet } = await import('solana-wallets-vue')
      wallet.value = useWallet()
    }
    catch (error) {
      console.error('Failed to initialize wallet:', error)
    }

    try {
      if (!window.Buffer) {
        const { Buffer } = await import('buffer')
        window.Buffer = Buffer
      }
    }
    catch (err) {
      console.error('Failed to spl token:', err)
    }
  }
})

const isWalletConnected = computed(() => {
  const connected = wallet.value?.connected
  return connected
})

const loadingWithDrawProcess = ref(false)
const confirmWithDraw = () => {

}
</script>

<style>
.swv-modal {
  z-index: 2410 !important;
}
@media only screen and (max-width: 960px) {
  .mobile-style {
    position: absolute;
    bottom: 0;
    border-radius: 24px 24px 0 0 !important;
  }
}
</style>
