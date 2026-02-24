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
          <span class="text-h4 text-grey700">Connect</span>
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

      <span class="text-h4 font-weight-bold w-100 text-center mt-4 text-grey700">Connect Your Wallet</span>
      <span class="text-h5 font-weight-normal w-100 text-center mt-4 text-grey500">Choose a wallet to connect and participate</span>
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
          color="grey400"
          flat
          rounded="lg"
          max-width="150"
          class="w-50 font-weight-bold text-h5 mt-4 mx-auto"
          @click="closeModal"
        >
          Cancel
        </v-btn>
      </div>
    </div>
  </v-dialog>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'
import { computed } from 'vue'

const { mdAndUp } = useDisplay()

const props = defineProps({
  showDialog: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:showDialog'])

const dialogModel = computed({
  get: () => props.showDialog,
  set: value => emit('update:showDialog', value),
})

const wallet = ref()
const config = useRuntimeConfig()
const walletInitialized = ref(false)

const closeModal = () => {
  emit('update:showDialog', false)
}

const clickOnOverlay = () => {
  if (!mdAndUp.value) {
    emit('update:showDialog', false)
  }
}

const clickOnModal = (event: Event) => {
  event.stopPropagation()
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

onMounted(() => {
  initSolanaWallet()
})
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
