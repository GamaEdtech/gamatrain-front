<template>
  <section class="token-purchase-bg">
    <div class="token-purchase-container">
      <div class="token-purchase-content">
        <h2 class="main-heading">
          Join the Movement
        </h2>
        <h3 class="sub-heading">
          Buy <span class="head-yellow">$GET</span> Today
        </h3>
        <p class="token-purchase__description">
          Empower education. Power the Gama ecosystem.
        </p>

        <!-- Swap Interface -->
        <div class="swap-container mt-8">
          <!-- Current Price Display -->
          <div class="price-display mb-4">
            <div class="price-label">
              Current $GET Price
            </div>
            <div class="price-value">
              ${{ formatPrice(currentPrice) }}
              <span
                v-if="priceChange !== null"
                :class="priceChangeClass"
              >
                {{ priceChange > 0 ? '+' : '' }}{{ priceChange.toFixed(2) }}%
              </span>
            </div>
          </div>

          <!-- Swap Form -->
          <v-card
            class="swap-card"
            elevation="8"
          >
            <v-card-text class="pa-6">
              <!-- GET Token Amount Input -->
              <div class="token-input-section mb-4">
                <div class="input-label">
                  Amount of GET tokens to buy
                </div>
                <div class="token-input-container">
                  <v-text-field
                    v-model="getTokenAmount"
                    type="number"
                    placeholder="1000"
                    variant="outlined"
                    hide-details
                    class="amount-input"
                    @input="calculateEquivalentCost"
                  />
                  <div class="token-selector">
                    <div class="token-option get-token">
                      <img
                        src="/images/token/Buy/token-get2.png"
                        alt="GET"
                        class="token-logo"
                      >
                      GET
                    </div>
                  </div>
                </div>
                <div
                  v-if="getTokenBalance !== null"
                  class="balance-info"
                >
                  Balance: {{ formatBalance(getTokenBalance) }} GET
                </div>
              </div>

              <!-- Payment Token Selector -->
              <div class="token-input-section mb-6">
                <div class="input-label">
                  Pay with
                </div>
                <div class="payment-token-selector">
                  <v-select
                    v-model="selectedPayToken"
                    :items="payTokenOptions"
                    item-title="symbol"
                    item-value="mint"
                    variant="outlined"
                    hide-details
                    class="token-select"
                    @update:model-value="calculateEquivalentCost"
                  >
                    <template #selection="{ item }">
                      <div class="token-option">
                        <img
                          :src="item.raw.logoURI"
                          :alt="item.raw.symbol"
                          class="token-logo"
                        >
                        {{ item.raw.symbol }}
                      </div>
                    </template>
                    <template #item="{ item, props }">
                      <v-list-item v-bind="props">
                        <template #prepend>
                          <img
                            :src="item.raw.logoURI"
                            :alt="item.raw.symbol"
                            class="token-logo"
                          >
                        </template>
                        <v-list-item-title>{{ item.raw.symbol }}</v-list-item-title>
                        <v-list-item-subtitle>{{ item.raw.name }}</v-list-item-subtitle>
                      </v-list-item>
                    </template>
                  </v-select>
                </div>
                <div
                  v-if="payTokenBalance !== null"
                  class="balance-info"
                >
                  Balance: {{ formatBalance(payTokenBalance) }} {{ getSelectedPayToken()?.symbol }}
                </div>
              </div>

              <!-- Swap Button -->
              <v-btn
                :disabled="!canSwap"
                :loading="swapping"
                block
                size="large"
                class="swap-btn"
                @click="handleSwap"
              >
                {{ swapButtonText }}
              </v-btn>

              <!-- Success Message -->
              <v-alert
                v-if="successMessage"
                type="success"
                class="mt-4"
                closable
                @click:close="successMessage = null"
              >
                {{ successMessage }}
              </v-alert>

              <!-- Error Message -->
              <v-alert
                v-if="errorMessage"
                type="error"
                class="mt-4"
                closable
                @click:close="errorMessage = null"
              >
                {{ errorMessage }}
              </v-alert>

              <!-- Transaction Details -->
              <div
                v-if="swapQuote"
                class="swap-details mt-4"
              >
                <div class="detail-row">
                  <span>Rate</span>
                  <span>1 {{ getSelectedPayToken()?.symbol }} = {{ formatPrice(swapQuote.rate) }} GET</span>
                </div>
                <div class="detail-row">
                  <span>Price Impact</span>
                  <span :class="priceImpactClass">{{ swapQuote.priceImpact }}%</span>
                </div>
                <div class="detail-row">
                  <span>Minimum Received</span>
                  <span>{{ formatBalance(swapQuote.minimumReceived) }} GET</span>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Fallback Jupiter Link -->
          <div class="jupiter-fallback mt-4">
            <div class="fallback-text">
              Or trade on Jupiter directly:
            </div>
            <a
              target="_blank"
              href="https://jup.ag/swap/So11111111111111111111111111111111111111112-GeutGuhcTYRf4rkbZmWDMEgjt5jHyJN4nHko38GJjQhv"
              rel="noopener noreferrer"
              class="jupiter-link"
            >
              <img
                src="/images/token/CTA/jupiter.png"
                alt="Jupiter exchange logo"
                class="jupiter-logo"
              >
              <span>Trade on Jupiter</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Wallet Connection Modal -->
      <Teleport to="body">
        <v-dialog
          v-model="showWalletModal"
          max-width="400"
          :z-index="1000"
        >
          <v-card class="wallet-modal">
            <v-card-title class="text-center pa-6">
              <h3>Connect Your Wallet</h3>
              <p class="text-body-2 mt-2 mb-0">
                Choose a wallet to connect and buy $GET tokens
              </p>
            </v-card-title>

            <v-card-text class="pa-6">
              <ClientOnly>
                <div class="wallet-connection-container">
                  <WalletMultiButton />
                </div>
              </ClientOnly>
            </v-card-text>

            <v-card-actions class="pa-6 pt-0">
              <v-spacer />
              <v-btn
                variant="text"
                @click="showWalletModal = false"
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </Teleport>

      <figure>
        <img
          src="/images/token/CTA/CTA_People_Mobile.svg"
          alt="People holding Gama tokens illustration"
          class="token-purchase__illustration d-none d-md-block"
        >
        <img
          src="/images/token/CTA/CTA_People_Tablet.svg"
          alt="People holding Gama tokens illustration for tablet"
          class="token-purchase__illustration d-none d-sm-block d-md-none"
        >
        <img
          src="/images/token/CTA/CTA_People_Mobile.svg"
          alt="People holding Gama tokens illustration for mobile"
          class="token-purchase__illustration d-sm-none"
        >
      </figure>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { SolanaWallet, SwapQuoteDetails, TokenConfig } from '~/composables/useJupiterSwap'
import { TOKEN_MINTS } from '~/composables/useJupiterSwap'

// Constants
const GET_TOKEN_MINT = TOKEN_MINTS.GET
const SOL_MINT = TOKEN_MINTS.SOL
const USDC_MINT = TOKEN_MINTS.USDC
const USDT_MINT = TOKEN_MINTS.USDT

// RPC Configuration - using custom QuickNode endpoint
const _RPC_ENDPOINTS = [
  'https://hidden-bold-road.solana-mainnet.quiknode.pro/d83cca6a22c6e04d9fab113e56ca82bbb9c87a23', // Custom QuickNode RPC
  'https://api.mainnet-beta.solana.com', // Official Solana RPC (fallback)
]

// Wallet integration with proper typing
const wallet = ref<SolanaWallet | null>(null)

// State
const getTokenAmount = ref('')
const equivalentCost = ref('')
const selectedPayToken = ref(SOL_MINT)
const swapping = ref(false)
const currentPrice = ref(0)
const priceChange = ref<number | null>(null)
const swapQuote = ref<SwapQuoteDetails | null>(null)
const payTokenBalance = ref<number | null>(null)
const getTokenBalance = ref<number | null>(null)
const isCalculating = ref(false)
const showWalletModal = ref(false)
const errorMessage = ref<string | null>(null)
const successMessage = ref<string | null>(null)

// Dynamic component import for WalletMultiButton
const WalletMultiButton = defineAsyncComponent(async () => {
  if (import.meta.client) {
    const { WalletMultiButton } = await import('solana-wallets-vue')
    return WalletMultiButton
  }
  return { template: '<div>Loading...</div>' }
})

// Token options for payment
const payTokenOptions = ref<TokenConfig[]>([
  {
    mint: SOL_MINT,
    symbol: 'SOL',
    name: 'Solana',
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
    decimals: 9,
  },
  {
    mint: USDC_MINT,
    symbol: 'USDC',
    name: 'USD Coin',
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
    decimals: 6,
  },
  {
    mint: USDT_MINT,
    symbol: 'USDT',
    name: 'Tether USD',
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png',
    decimals: 6,
  },
])

// Initialize wallet on client side
onMounted(async () => {
  if (import.meta.client) {
    try {
      const { useWallet } = await import('solana-wallets-vue')
      wallet.value = useWallet() as SolanaWallet

      console.log('Wallet initialized:', wallet.value)
      console.log('Initial connection state:', wallet.value?.connected)

      // Watch for wallet connection changes
      watch(() => wallet.value?.connected, (connected) => {
        console.log('Wallet connection changed:', connected)
        if (connected) {
          showWalletModal.value = false // Close modal when connected
          fetchBalances()
        }
      }, { immediate: true })

      // Fetch initial data
      await fetchCurrentPrice()
      if (isWalletConnected.value) {
        await fetchBalances()
      }

      // Set up price refresh interval
      setInterval(() => {
        fetchCurrentPrice()
      }, 30000)
    }
    catch (error) {
      console.error('Failed to initialize wallet:', error)
    }
  }
})

// Computed properties
const isWalletConnected = computed(() => {
  return wallet.value?.connected || false
})

const canSwap = computed(() => {
  // If wallet is not connected, allow clicking to show connection modal
  if (!isWalletConnected.value) {
    return !swapping.value
  }

  // If wallet is connected, require valid GET token amount
  return getTokenAmount.value
    && parseFloat(getTokenAmount.value) > 0
    && !swapping.value
})

const swapButtonText = computed(() => {
  console.log('Computing button text - isWalletConnected:', isWalletConnected.value)
  if (!isWalletConnected.value) {
    return 'Connect Wallet to Buy $GET'
  }
  if (swapping.value) {
    return 'Swapping...'
  }
  if (!getTokenAmount.value || parseFloat(getTokenAmount.value) <= 0) {
    return 'Enter Amount'
  }
  if (equivalentCost.value) {
    return `Buy $GET Now (${equivalentCost.value})`
  }
  return `Buy $GET Now`
})

const priceChangeClass = computed(() => {
  if (priceChange.value === null) return ''
  return priceChange.value > 0 ? 'price-up' : 'price-down'
})

const priceImpactClass = computed(() => {
  if (!swapQuote.value) return ''
  const impact = parseFloat(swapQuote.value.priceImpact)
  if (impact > 5) return 'impact-high'
  if (impact > 2) return 'impact-medium'
  return 'impact-low'
})

// Methods
const formatPrice = (price: number | string | null): string => {
  if (!price) return '0.000000'
  return parseFloat(price.toString()).toFixed(6)
}

const formatBalance = (balance: number | null): string => {
  if (!balance) return '0.00'
  return parseFloat(balance.toString()).toFixed(4)
}

const getSelectedPayToken = () => {
  return payTokenOptions.value.find(token => token.mint === selectedPayToken.value)
}

const fetchCurrentPrice = async () => {
  try {
    const response = await $fetch<{ data: Record<string, { price: number }> }>(`https://lite-api.jup.ag/price/v2?ids=${GET_TOKEN_MINT}`)
    if (response?.data && response.data[GET_TOKEN_MINT]) {
      currentPrice.value = response.data[GET_TOKEN_MINT].price
      // You can also fetch 24h change if available in the API
    }
  }
  catch (error) {
    console.error('Failed to fetch GET token price:', error)
  }
}

const fetchBalances = async () => {
  if (!wallet.value?.publicKey?.value) return

  try {
    // This would require implementing balance fetching logic
    // For now, we'll set placeholder values
    payTokenBalance.value = 0.0
    getTokenBalance.value = 0.0
  }
  catch (error) {
    console.error('Failed to fetch balances:', error)
  }
}

const calculateEquivalentCost = async () => {
  if (!getTokenAmount.value || parseFloat(getTokenAmount.value) <= 0) {
    equivalentCost.value = ''
    swapQuote.value = null
    isCalculating.value = false
    errorMessage.value = null
    return
  }

  try {
    isCalculating.value = true
    errorMessage.value = null // Clear any previous errors
    const desiredGetAmount = parseFloat(getTokenAmount.value)
    const payToken = getSelectedPayToken()
    if (!payToken) {
      isCalculating.value = false
      return
    }

    const { getQuoteWithDecimals, calculateDisplayAmounts } = useJupiterSwap()

    // For reverse quote logic, we need to get the actual quote for the desired GET amount
    // We'll use a more accurate approach by getting a quote for a reasonable input amount
    // and then calculating the exact required input

    // Start with a reasonable estimate based on typical token prices
    let estimatedInputAmount = 1.0 // Start with 1 token as base

    // If SOL is selected, use a smaller amount since SOL is more expensive
    if (payToken.symbol === 'SOL') {
      estimatedInputAmount = 0.1
    }

    // Get quote from Jupiter API to establish the rate
    const quoteResponse = await getQuoteWithDecimals(
      selectedPayToken.value,
      GET_TOKEN_MINT,
      estimatedInputAmount,
      50, // 0.5% slippage
    )

    if (quoteResponse) {
      // Use the helper function to calculate display amounts
      const displayAmounts = calculateDisplayAmounts(quoteResponse)

      // Calculate the rate: how much input needed per GET token
      const inputPerGetToken = estimatedInputAmount / displayAmounts.outputAmount

      // Calculate the required input amount for desired GET tokens
      const requiredInputAmount = desiredGetAmount * inputPerGetToken

      // Add a small buffer (1%) to account for price fluctuations
      const bufferedAmount = requiredInputAmount * 1.01

      // Format the equivalent cost for display
      const payTokenSymbol = payToken.symbol
      equivalentCost.value = `${bufferedAmount.toFixed(6)} ${payTokenSymbol}`

      // Create properly typed swap quote details with the actual required amount
      swapQuote.value = {
        rate: 1 / inputPerGetToken, // GET tokens per input token
        priceImpact: displayAmounts.priceImpact.toFixed(2),
        minimumReceived: desiredGetAmount * 0.995, // Account for slippage
        quoteResponse,
      }
    }
    else {
      equivalentCost.value = ''
      swapQuote.value = null
    }
  }
  catch (error) {
    console.error('Failed to get swap quote:', error)
    equivalentCost.value = ''
    swapQuote.value = null
    errorMessage.value = 'Failed to get quote. Please try again.'

    // Clear error message after 5 seconds
    setTimeout(() => {
      errorMessage.value = null
    }, 5000)
  }
  finally {
    isCalculating.value = false
  }
}

const handleSwap = async () => {
  // Show wallet selection modal if not connected
  if (!isWalletConnected.value) {
    showWalletModal.value = true
    return
  }

  if (!canSwap.value || !swapQuote.value) {
    console.warn('Cannot swap: missing requirements', {
      canSwap: canSwap.value,
      hasSwapQuote: !!swapQuote.value,
    })
    return
  }

  try {
    swapping.value = true
    errorMessage.value = null // Clear any previous errors
    successMessage.value = null // Clear any previous success messages

    const { getSwapTransaction } = useJupiterSwap()

    // Validate wallet connection with detailed debugging
    console.log('Wallet validation debug:', {
      walletExists: !!wallet.value,
      walletConnected: wallet.value?.connected,
      publicKeyExists: !!wallet.value?.publicKey,
      publicKeyValue: wallet.value?.publicKey?.value,
      publicKeyToString: wallet.value?.publicKey?.toString?.(),
      fullWallet: wallet.value,
    })

    // Try different wallet object structures
    let publicKeyString = null
    if (wallet.value?.publicKey?.value) {
      publicKeyString = wallet.value.publicKey.value.toString()
    }
    else if (wallet.value?.publicKey?.toString) {
      publicKeyString = wallet.value.publicKey.toString()
    }
    else if (wallet.value?.publicKey) {
      publicKeyString = wallet.value.publicKey.toString()
    }

    if (!publicKeyString) {
      throw new Error('Wallet public key not accessible')
    }

    // We need to get a fresh quote for the actual swap amount
    // Parse the equivalent cost to get the actual input amount needed
    const costParts = equivalentCost.value.split(' ')
    const actualInputAmount = parseFloat(costParts[0])

    if (!actualInputAmount || actualInputAmount <= 0) {
      throw new Error('Invalid input amount calculated')
    }

    // Check if user has enough balance (including buffer for fees)
    const payToken = getSelectedPayToken()
    if (payToken?.symbol === 'SOL') {
      // For SOL, ensure user has enough for swap + network fees (at least 0.01 SOL buffer)
      const requiredSol = actualInputAmount + 0.01
      if (payTokenBalance.value !== null && payTokenBalance.value < requiredSol) {
        throw new Error(`Insufficient SOL balance. Need at least ${requiredSol.toFixed(4)} SOL (including fees)`)
      }
    }

    // Get a fresh quote for the actual input amount
    const { getQuoteWithDecimals } = useJupiterSwap()
    const freshQuote = await getQuoteWithDecimals(
      selectedPayToken.value,
      GET_TOKEN_MINT,
      actualInputAmount,
      50, // 0.5% slippage
    )

    if (!freshQuote) {
      throw new Error('Failed to get fresh quote for swap')
    }

    // Get swap transaction from Jupiter using the fresh quote
    const swapResponse = await getSwapTransaction(
      freshQuote,
      publicKeyString,
    )

    if (!swapResponse?.swapTransaction) {
      throw new Error('Failed to get swap transaction from Jupiter')
    }

    // Execute the swap using wallet's sendTransaction method
    console.log('Executing swap transaction through wallet')

    // Deserialize the transaction
    const { VersionedTransaction } = await import('@solana/web3.js')
    const swapTransactionBuf = Buffer.from(swapResponse.swapTransaction, 'base64')
    const transaction = VersionedTransaction.deserialize(swapTransactionBuf)

    // Use wallet's sendTransaction method if available (bypasses RPC issues)
    let signature = null

    if (wallet.value.sendTransaction) {
      console.log('Using wallet sendTransaction method')
      // Create a minimal connection object for the wallet
      const dummyConnection = {
        rpcEndpoint: 'https://hidden-bold-road.solana-mainnet.quiknode.pro/d83cca6a22c6e04d9fab113e56ca82bbb9c87a23',
        commitment: 'confirmed',
      }
      signature = await wallet.value.sendTransaction(transaction, dummyConnection)
    }
    else {
      console.log('Using signTransaction and manual submission')
      // Sign the transaction
      const signedTransaction = await wallet.value.signTransaction(transaction)

      // Try to submit via wallet's connection or fallback
      try {
        // If wallet has a connection, use it
        if (wallet.value.connection) {
          signature = await wallet.value.connection.sendRawTransaction(signedTransaction.serialize())
        }
        else {
          // Last resort: use our own connection with minimal config
          const { Connection } = await import('@solana/web3.js')
          const connection = new Connection('https://hidden-bold-road.solana-mainnet.quiknode.pro/d83cca6a22c6e04d9fab113e56ca82bbb9c87a23')
          signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
            skipPreflight: true,
            maxRetries: 3,
          })
        }
      }
      catch (rpcError) {
        console.error('RPC submission failed:', rpcError)
        throw new Error(`Transaction submission failed: ${rpcError.message}`)
      }
    }

    if (signature) {
      // Show success message
      console.log('Swap successful!', signature)
      successMessage.value = `Swap successful! Transaction: ${signature.slice(0, 8)}...`

      // Clear success message after 10 seconds
      setTimeout(() => {
        successMessage.value = null
      }, 10000)

      // Reset form and refresh balances
      getTokenAmount.value = ''
      equivalentCost.value = ''
      swapQuote.value = null
      await fetchBalances()
    }
    else {
      throw new Error('Transaction execution failed')
    }
  }
  catch (error) {
    console.error('Swap failed:', error)

    const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred'
    errorMessage.value = `Swap failed: ${errorMsg}`

    // Clear error message after 10 seconds
    setTimeout(() => {
      errorMessage.value = null
    }, 10000)
  }
  finally {
    swapping.value = false
  }
}

// Watch for GET token amount changes
watch(getTokenAmount, () => {
  if (getTokenAmount.value) {
    calculateEquivalentCost()
  }
  else {
    equivalentCost.value = ''
    swapQuote.value = null
  }
})

// Refresh price every 30 seconds (client-side only)
onMounted(() => {
  if (import.meta.client) {
    setInterval(() => {
      fetchCurrentPrice()
    }, 30000)
  }
})
</script>

<style scoped>
/* === MOBILE (default) === */
.token-purchase-bg { background: linear-gradient(to bottom, #999999, #f2f2f2); position: relative; overflow: hidden; padding-bottom: 3rem; }
.token-purchase-container { display: flex; flex-direction: column; justify-content: center; align-items: center; padding-top: 7rem; max-width: 1200px; margin: 0 auto; width: 100%; position: relative; }
.token-purchase-content { position: relative; z-index: 3; max-width: 1200px; margin: 0 auto; width: 100%; padding: 0 2rem; margin-bottom: 0; }
.token-purchase__illustration { position: static !important; display: block; margin: 2.5rem auto 0 auto; left: unset !important; right: unset !important; bottom: unset !important; transform: none !important; width: 90%; max-width: 800px; z-index: 1; }
.token-purchase__title { color: #000000; font-size: 18px; font-weight: 700; }
.main-heading { font-size: 34px; font-weight: 700; color: #fff; text-align: center; }
.sub-heading { font-size: 34px; font-weight: 700; color: #4e545b; text-align: center; }
.sub-heading .head-yellow { color: #fecd1c; }
.token-purchase__description { color: #6e7781; font-size: 14px; font-weight: 500; text-align: center; }
.token-purchase__btn { background: #000000; display: flex; align-items: center; justify-content: center; height: 48px; width: 160px; border-radius: 6px; font-size: 24px; font-weight: 600; color: #ffffff; }
.token-purchase__btn img { width: 27px; height: 27px; }

/* === TABLET (min-width: 600px and max-width: 1199px) === */
@media (min-width: 600px) and (max-width: 1199px) {
  .token-purchase-bg { padding-bottom: 4rem; }
  .token-purchase-content { margin-bottom: 0; }
  .token-purchase__illustration { max-width: 900px; margin-top: 3rem; }
  .token-purchase__title { color: #161716; font-size: 24px; font-weight: 500; }
  .token-purchase__description { font-size: 20px; padding-top: 2rem; }
  .main-heading { font-size: 56px; font-weight: 700; }
  .sub-heading { font-size: 56px; font-weight: 700; }
}

/* === DESKTOP (min-width: 1200px) === */
@media (min-width: 1200px) {
  .token-purchase-bg { padding-bottom: 5rem; }
  .token-purchase-content { margin-bottom: 0; }
  .token-purchase__illustration { width: 900px; max-width: 100%; margin-top: 1rem; }
  .token-purchase__title { color: #313231; font-size: 24px; font-weight: 600; }
  .main-heading { font-size: 76px; font-weight: 700; margin-bottom: 2rem; }
  .sub-heading { font-size: 64px; font-weight: 700; margin-bottom: 1.5rem; }
  .token-purchase__description { color: #24292f; font-size: 24px; font-weight: 400; text-align: center; margin-bottom: 2rem; }
  .token-purchase__btn { height: 68px; width: 215px; font-size: 32px; font-weight: 600; margin-bottom: 1rem; }
  .token-purchase__btn img { width: 40px; height: 40px; }
}

/* === XL Illustration (min-width: 1100px) === */
@media (min-width: 1100px) {
  .token-purchase__illustration {
    width: 900px;
    max-width: 100%;
  }
}

/* === Swap Interface Styles === */
.swap-container {
  max-width: 480px;
  margin: 0 auto;
}

.price-display {
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  backdrop-filter: blur(10px);
}

.price-label {
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
}

.price-value {
  color: #ffffff;
  font-size: 24px;
  font-weight: 700;
}

.price-up {
  color: #00d4aa;
  margin-left: 8px;
}

.price-down {
  color: #ff6b6b;
  margin-left: 8px;
}

.swap-card {
  background: rgba(255, 255, 255, 0.95) !important;
  border-radius: 16px !important;
  backdrop-filter: blur(10px);
}

.token-input-section {
  position: relative;
}

.input-label {
  color: #666;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
}

.token-input-container {
  display: flex;
  gap: 12px;
  align-items: stretch;
}

.amount-input {
  flex: 1;
}

.amount-input :deep(.v-field__input) {
  font-size: 18px;
  font-weight: 600;
}

.token-selector {
  min-width: 120px;
}

.token-select {
  min-width: 120px;
}

.payment-token-selector {
  width: 100%;
}

.payment-token-selector .token-select {
  width: 100%;
}

.token-option {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  background: #f5f5f5;
  font-weight: 600;
  height: 100%;
}

.get-token {
  background: linear-gradient(135deg, #fecd1c, #f0b90b);
  color: #000;
}

.token-logo {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.balance-info {
  color: #666;
  font-size: 12px;
  margin-top: 4px;
  text-align: right;
}

.swap-arrow-container {
  display: flex;
  justify-content: center;
  margin: 16px 0;
}

.swap-arrow-btn {
  background: #ffffff !important;
  border: 2px solid #e0e0e0 !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
}

.swap-btn {
  background: linear-gradient(135deg, #fecd1c, #f0b90b) !important;
  color: #000 !important;
  font-weight: 700 !important;
  font-size: 16px !important;
  height: 56px !important;
  border-radius: 12px !important;
}

.swap-btn:disabled {
  background: #e0e0e0 !important;
  color: #999 !important;
}

.swap-details {
  border-top: 1px solid #e0e0e0;
  padding-top: 16px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.detail-row span:first-child {
  color: #666;
}

.detail-row span:last-child {
  font-weight: 600;
}

.impact-low {
  color: #00d4aa;
}

.impact-medium {
  color: #ffa500;
}

.impact-high {
  color: #ff6b6b;
}

.jupiter-fallback {
  text-align: center;
}

.fallback-text {
  color: #666;
  font-size: 14px;
  margin-bottom: 12px;
}

.jupiter-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #000;
  color: #fff;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.jupiter-link:hover {
  background: #333;
  transform: translateY(-2px);
}

.jupiter-logo {
  width: 20px;
  height: 20px;
}

/* === Wallet Modal Styles === */
.wallet-modal {
  border-radius: 16px !important;
}

.wallet-modal h3 {
  color: #333;
  font-weight: 700;
  margin-bottom: 0;
}

.wallet-modal .text-body-2 {
  color: #666;
  font-weight: 400;
}

/* === Responsive Swap Styles === */
@media (min-width: 600px) {
  .price-value {
    font-size: 32px;
  }

  .swap-container {
    max-width: 520px;
  }
}

@media (min-width: 1200px) {
  .price-value {
    font-size: 36px;
  }

  .swap-container {
    max-width: 560px;
  }

  .amount-input :deep(.v-field__input) {
    font-size: 20px;
  }
}

/* Wallet modal z-index fixes */
.wallet-modal {
  z-index: 1001 !important;
}

/* Global wallet dropdown z-index fixes */
:global(.wallet-adapter-dropdown) {
  z-index: 9999 !important;
}

:global(.wallet-adapter-dropdown-list) {
  z-index: 9999 !important;
}

:global(.wallet-adapter-modal) {
  z-index: 9999 !important;
}

/* Solana wallets vue component z-index fixes */
:global(.swv-dropdown) {
  z-index: 9999 !important;
}

:global(.swv-dropdown-list) {
  z-index: 9999 !important;
}

:global(.swv-modal) {
  z-index: 9999 !important;
}

:global(.swv-button-dropdown) {
  z-index: 9999 !important;
}

/* Vuetify overlay fixes */
:global(.v-overlay--active) {
  z-index: 9998 !important;
}

:global(.v-menu__content) {
  z-index: 9999 !important;
}

.wallet-connection-container {
  position: relative;
  z-index: 10000;
}

.wallet-connection-container :deep(.wallet-adapter-button) {
  z-index: 10001 !important;
}

.wallet-connection-container :deep(.wallet-adapter-dropdown) {
  z-index: 10002 !important;
  position: fixed !important;
}
</style>
