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
          <span class="text-h4">{{ titleModal }}</span>
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

      <div class="w-100 d-flex flex-column align-center justify-center mt-8">
        <img
          width="100"
          height="100"
          src="/images/gama-coin.svg"
          alt="GAMA coin"
        >
        <span class="font-weight-bold text-h4 mt-4">Earn Coins for Free:</span>
        <div class="w-100 d-flex justify-space-between mt-4">
          <div
            class="earn-free d-flex flex-column align-center justify-start ga-2"
          >
            <v-icon color="#98A2B3">
              md:language
            </v-icon>
            <span class="text-primary text-h6 font-weight-bold">Browse Website</span>
            <span class="primary-gray-500 text-h6 text-center">Explore pages and discover content</span>
          </div>

          <div class="line-seperator" />

          <div
            class="earn-free d-flex flex-column align-center justify-start ga-2"
          >
            <v-icon color="#98A2B3">
              md:psychology
            </v-icon>
            <span class="text-primary text-h6 font-weight-bold">Take Quizzes</span>
            <span class="primary-gray-500 text-h6 text-center">Test your knowledge and learn</span>
          </div>

          <div class="line-seperator" />

          <div
            class="earn-free d-flex flex-column align-center justify-start ga-2"
          >
            <v-icon color="#98A2B3">
              md:stadia_controller
            </v-icon>
            <span class="text-primary text-h6 font-weight-bold">Play Games</span>
            <span class="primary-gray-500 text-h6 text-center">Have fun while earning rewards</span>
          </div>
        </div>
      </div>

      <div
        class="w-100 d-flex align-center justify-center position-relative mt-8"
      >
        <div class="line-or" />
        <span
          class="primary-gray-500 font-weight-bold text-h5 position-absolute"
        >OR</span>
      </div>

      <div class="w-100 d-flex flex-column align-center justify-center mt-8">
        <span class="font-weight-bold text-h4">Quick Recharge</span>

        <span class="primary-gray-500 text-h6 text-center mt-4">Don't have time? Recharge your wallet instantly.Select your
          pack!</span>
      </div>

      <div class="w-100 d-flex align-center justify-center mt-6 recharge-input">
        <v-btn
          color="#344054"
          max-width="40"
          min-width="40"
          height="40"
          rounded="lg"
          flat
          :disabled="loadingPayment"
          @click="decreaseAmount"
        >
          <div class="circle-div d-flex align-center justify-center bg-white">
            <v-icon
              color="#344054"
              size="22"
            >
              md:remove
            </v-icon>
          </div>
        </v-btn>

        <v-text-field
          v-model="formattedAmount"
          class="w-100 mx-4 text-center"
          variant="outlined"
          hide-details
          density="comfortable"
          rounded="lg"
          color="#ffb300"
          :disabled="loadingPayment"
          @input="onAmountInput"
        >
          <template #prepend-inner>
            <img
              width="20"
              height="20"
              :src="selectedCurrency.logoURI"
              alt="Coin Logo"
              class="rounded-circle"
            >
          </template>
        </v-text-field>

        <v-btn
          color="#344054"
          max-width="40"
          min-width="40"
          height="40"
          rounded="lg"
          flat
          :disabled="loadingPayment"
          @click="increaseAmount"
        >
          <div class="circle-div d-flex align-center justify-center bg-white">
            <v-icon
              color="#344054"
              size="20"
            >
              md:add
            </v-icon>
          </div>
        </v-btn>
      </div>

      <div class="w-100 d-flex justify-center align-center ga-2 mt-6">
        <v-btn
          v-for="currency in currencies"
          :key="currency.name"
          :color="selectedCurrency.name === currency.name ? 'primary' : 'white'"
          :class="`text-h5 font-weight-bold ${
            selectedCurrency.name === currency.name ? `` : `border-btn`
          }`"
          rounded="pill"
          flat
          width="100"
          height="38"
          :disabled="loadingPayment"
          @click="selectCurrency(currency)"
        >
          {{ currency.name }}
        </v-btn>
      </div>

      <v-btn
        v-if="!isWalletConnected"
        color="primary"
        flat
        rounded="lg"
        max-width="250"
        min-width="250"
        class="font-weight-bold text-h5 mt-4 mx-auto"
        @click="showWalletModal = true"
      >
        Connect Wallet
      </v-btn>

      <div class="w-100 d-flex ga-2 align-center justify-center">
        <v-btn
          v-if="isWalletConnected"
          color="error"
          flat
          variant="outlined"
          rounded="lg"
          max-width="200"
          class="w-50 font-weight-bold text-h5 mt-4 mx-auto"
          @click="showDisconnectModal = true"
        >
          Disconnect
        </v-btn>
        <v-btn
          v-if="isWalletConnected"
          :loading="loadingPayment"
          :disabled="disablePayment"
          color="success"
          flat
          rounded="lg"
          max-width="200"
          class="w-50 font-weight-bold text-h5 mt-4 mx-auto"
          @click="startProccessPayment"
        >
          Pay
        </v-btn>
      </div>

      <v-dialog
        v-model="showWalletModal"
        max-width="500"
      >
        <div
          class="d-flex flex-column align-center justify-center pa-6 bg-white rounded-lg"
        >
          <span class="text-h4 font-weight-bold w-100 text-start">Connect Your Wallet</span>
          <span class="text-h6 font-weight-normal w-100 text-start mt-2">Choose a wallet to connect</span>
          <div class="d-flex w-100 align-center justify-center mt-6">
            <ClientOnly>
              <WalletMultiButton />
            </ClientOnly>
          </div>

          <v-btn
            width="100"
            class="mt-4 text-h5 font-weight-bold rounded-lg"
            color="grey"
            flat
            @click="showWalletModal = false"
          >
            Cancel
          </v-btn>
        </div>
      </v-dialog>

      <v-dialog
        v-model="showDisconnectModal"
        max-width="500"
      >
        <div
          class="d-flex flex-column align-center justify-center pa-6 bg-white rounded-lg"
        >
          <span class="text-h4 font-weight-bold w-100 text-start">Disconnect Wallet</span>
          <span class="text-h6 font-weight-normal w-100 text-start mt-2">
            Are you sure you want to disconnect your wallet? This will clear all
            your current swap data.</span>
          <div class="w-100 d-flex ga-2 align-center justify-center mt-6">
            <v-btn
              class="text-h5 font-weight-bold"
              variant="text"
              flat
              @click="showDisconnectModal = false"
            >
              Cancel
            </v-btn>
            <v-btn
              class="text-h5 font-weight-bold rounded-lg"
              variant="elevated"
              color="error"
              flat
              @click="handleDisconnect"
            >
              Disconnect Wallet
            </v-btn>
          </div>
        </div>
      </v-dialog>
    </div>
  </v-dialog>
</template>

<script setup>
import { useDisplay } from 'vuetify'
import { ref, computed } from 'vue'
// import { TOKEN_DECIMALS, TOKEN_MINTS } from "~/composables/useJupiterSwap";
import { TOKEN_DECIMALS } from '~/composables/useJupiterSwap'
import { useSolanaClient } from '~/composables/useSolanaClient'
import { SystemProgram, Transaction, PublicKey } from '@solana/web3.js'

const auth = useAuth()
const { $toast } = useNuxtApp()
const router = useRouter()
const { mdAndUp } = useDisplay()

const props = defineProps({
  titleModal: {
    type: String,
    required: true,
  },
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

const closeModal = () => {
  emit('update:showDialog', false)
}

const clickOnOverlay = () => {
  if (!mdAndUp.value) {
    emit('update:showDialog', false)
  }
}

const clickOnModal = (event) => {
  event.stopPropagation()
}

const formatNumber = (value) => {
  if (value === null || value === undefined || value === '') return ''
  if (isNaN(value)) return value
  const parts = value.toString().split('.')
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const decimalPart = parts[1] ? '.' + parts[1] : ''
  return integerPart + decimalPart
}

const onAmountInput = (event) => {
  const val = event.target.value
  const decimals = selectedCurrency.value.decimals

  let cleanVal = val.toString().replace(/,/g, '')

  if (cleanVal === '.') {
    formattedAmount.value = '0.'
    amount.value = 0
    event.target.value = formattedAmount.value
    return
  }

  if (/^\d+\.$/.test(cleanVal)) {
    formattedAmount.value = cleanVal
    amount.value = parseFloat(cleanVal) || 0
    event.target.value = formattedAmount.value
    return
  }

  if (cleanVal.includes('.')) {
    const [intPart, decPart = ''] = cleanVal.split('.')
    if (decPart.length > decimals) {
      cleanVal = intPart + '.' + decPart.slice(0, decimals)
    }
  }

  if (!/^\d*\.?\d*$/.test(cleanVal)) {
    return
  }

  const numeric = parseFloat(cleanVal)
  amount.value = isNaN(numeric) ? 0 : numeric

  formattedAmount.value = formatNumber(cleanVal)
  event.target.value = formattedAmount.value
}

const amount = ref(1000)
const formattedAmount = ref('1,000')

const increaseAmount = () => {
  const step = selectedCurrency.value.step
  amount.value = parseFloat(
    (parseFloat(amount.value) + step).toFixed(selectedCurrency.value.decimals),
  )
  formattedAmount.value = formatNumber(amount.value)
}

const decreaseAmount = () => {
  const step = selectedCurrency.value.step
  amount.value = Math.max(
    0,
    parseFloat(
      (parseFloat(amount.value) - step).toFixed(selectedCurrency.value.decimals),
    ),
  )
  formattedAmount.value = formatNumber(amount.value)
}

const currencies = ref([
  {
    name: 'GET',
    step: 1000,
    decimals: TOKEN_DECIMALS.GET,
    logoURI: '/images/gama-coin.svg',
    // devnet mint
    mint: 'test',
    // mainnet mint
    // mint : TOKEN_MINTS.GET
  },
  {
    name: 'SOL',
    step: 0.001,
    decimals: TOKEN_DECIMALS.SOL,
    logoURI: '/images/solana-coin.png',
    // devnet mint
    mint: 'So11111111111111111111111111111111111111112',
    // mainnet mint
    // mint : TOKEN_MINTS.SOL
  },
  {
    name: 'USDC',
    step: 1,
    decimals: TOKEN_DECIMALS.USDC,
    logoURI: '/images/usdc-coin.png',
    // devnet mint
    mint: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
    // mainnet mint
    // mint : TOKEN_MINTS.USDC
  },
])
const selectedCurrency = ref(currencies.value[0])

const selectCurrency = (currency) => {
  selectedCurrency.value = currency
  amount.value = parseFloat(currency.step)
  formattedAmount.value = formatNumber(amount.value)
}

const splTokenLib = ref(null)
const wallet = ref(null)
const showWalletModal = ref(false)
const showDisconnectModal = ref(false)
// Dynamic component import for WalletMultiButton
const WalletMultiButton = defineAsyncComponent(async () => {
  if (import.meta.client) {
    const { WalletMultiButton } = await import('solana-wallets-vue')
    return WalletMultiButton
  }
  return { template: '<div>Loading...</div>' }
})
// Initialize wallet on client side
onMounted(async () => {
  if (import.meta.client) {
    try {
      const { useWallet } = await import('solana-wallets-vue')
      wallet.value = useWallet()
      console.log('Wallet initialized:', wallet.value)
      console.log('Initial connection state:', wallet.value?.connected)
    }
    catch (error) {
      console.error('Failed to initialize wallet:', error)
    }

    try {
      if (!window.Buffer) {
        const { Buffer } = await import('buffer')
        window.Buffer = Buffer
      }

      const {
        getAssociatedTokenAddress,
        createTransferInstruction,
        createAssociatedTokenAccountInstruction,
      } = await import('@solana/spl-token')

      splTokenLib.value = {
        getAssociatedTokenAddress,
        createTransferInstruction,
        createAssociatedTokenAccountInstruction,
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

// Handle wallet disconnect
const handleDisconnect = async () => {
  try {
    const w = wallet.value
    if (w?.disconnect) {
      await w.disconnect()
      console.log('Wallet disconnected successfully')
    }
    else {
      console.warn('Wallet does not support disconnect method')
      // For wallets that don't have disconnect method, we can try to reset the wallet reference
      wallet.value = null
    }

    // Reset all state
  }
  catch (error) {
    console.error('Failed to disconnect wallet:', error)
    errorMessage.value = 'Failed to disconnect wallet. Please try again.'
    // Clear error message after 5 seconds
    setTimeout(() => {
      errorMessage.value = null
    }, 10000)
  }
  showDisconnectModal.value = false
}

const loadingPayment = ref(false)
const disablePayment = ref(false)
const paymentId = ref(null)
const transactionId = ref(null)

const startProccessPayment = async () => {
  if (!wallet.value?.connected || !wallet.value.publicKey) {
    $toast.info(
      'Wallet connection required. Please connect your wallet to proceed.',
    )
    showWalletModal.value = true
    return
  }
  const payAmount = parseFloat(amount.value)
  if (isNaN(payAmount) || payAmount <= 0) {
    $toast.info('The amount you entered is not valid. Please try again.')
    return
  }
  if (auth.isAuthenticated.value) {
    try {
      loadingPayment.value = true
      const params = {
        amount: amount.value,
        currency: selectedCurrency.value.name,
      }
      console.log('params', params)
      const responsePayment = await useApiService.post(
        '/api/v2/payments',
        params,
      )
      console.log('responsePayment', responsePayment)
      if (responsePayment.succeeded) {
        paymentId.value = responsePayment.data
        await sendTransactionInChain()
      }
      else {
        disablePayment.value = true
        loadingPayment.value = false
        paymentId.value = null
        $toast.error(
          'We’re unable to process your payment at the moment. Please try again in a few minutes',
        )
      }
    }
    catch (error) {
      console.log(error)

      disablePayment.value = true
      loadingPayment.value = false
      paymentId.value = null
      $toast.error(
        'We’re unable to process your payment at the moment. Please try again in a few minutes',
      )
    }
  }
  else {
    router.push({})
    setTimeout(() => {
      router.push({ query: { auth_form: 'login', auth_noredirect: 'true' } })
    }, 100)
  }
}

const config = useRuntimeConfig()

const sendTransactionInChain = async () => {
  try {
    const { getConnection } = useSolanaClient()
    const connection = await getConnection()

    const destination = new PublicKey(config.public.gamaedtechWalletAddress)
    const sender = wallet.value.publicKey
    console.log(
      'amount * 10 ** selectToken.value.decimals',
      amount.value * 10 ** selectedCurrency.value.decimals,
    )
    const rawAmount = BigInt(
      Math.round(amount.value * 10 ** selectedCurrency.value.decimals),
    )

    const transaction = new Transaction()

    if (selectedCurrency.value.name === 'SOL') {
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: sender,
          toPubkey: destination,
          lamports: rawAmount,
        }),
      )
    }
    else {
      const mintPubkey = new PublicKey(selectedCurrency.value.mint)
      const fromTokenAccount
        = await splTokenLib.value.getAssociatedTokenAddress(mintPubkey, sender)
      const toTokenAccount = await splTokenLib.value.getAssociatedTokenAddress(
        mintPubkey,
        destination,
      )
      const toTokenAccountInfo = await connection.getAccountInfo(
        toTokenAccount,
      )

      if (!toTokenAccountInfo) {
        transaction.add(
          splTokenLib.value.createAssociatedTokenAccountInstruction(
            sender,
            toTokenAccount,
            destination,
            mintPubkey,
          ),
        )
      }

      transaction.add(
        splTokenLib.value.createTransferInstruction(
          fromTokenAccount,
          toTokenAccount,
          sender,
          rawAmount,
        ),
      )
    }

    const signature = await wallet.value.sendTransaction(
      transaction,
      connection,
    )

    await connection.confirmTransaction(signature, 'confirmed')

    console.log('✅ Transaction sent:', signature)
    transactionId.value = signature
    await sendConfirmPaymentRequest()
  }
  catch (error) {
    console.error('❌ Payment failed:', error)
    disablePayment.value = true
    loadingPayment.value = false
    paymentId.value = null
    transactionId.value = null
    $toast.error(
      'The Solana network is currently experiencing an issue. Please try again later.',
    )
  }
}

const sendConfirmPaymentRequest = async () => {
  try {
    const params = {
      id: paymentId.value,
      transactionId: transactionId.value,
      currency: selectedCurrency.value.name,
    }
    console.log('params', params)
    const responsePaymentConfirmed = await useApiService.post(
      '/api/v2/payments/verify',
      params,
    )
    console.log('responsePaymentConfirmed', responsePaymentConfirmed)
    if (responsePaymentConfirmed.succeeded) {
      loadingPayment.value = false
    }
    else {
      // disablePayment.value = true;
      // loadingPayment.value = false;
      // paymentId.value = null;
      // $toast.error(
      //   "We’re unable to process your payment at the moment. Please try again in a few minutes"
      // );
    }
  }
  catch (error) {
    console.log(error)

    // disablePayment.value = true;
    // loadingPayment.value = false;
    // paymentId.value = null;
    // $toast.error(
    //   "We’re unable to process your payment at the moment. Please try again in a few minutes"
    // );
  }
}
</script>

<style>
.earn-free {
  width: 32%;
}
.line-seperator {
  width: 2px;
  height: 100px;
  background-color: #f2f4f7;
}
.line-or {
  width: 100%;
  height: 2px;
  background-color: #f2f4f7;
}
.circle-div {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}
.border-btn {
  border: 1px solid #cbccce;
}
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
