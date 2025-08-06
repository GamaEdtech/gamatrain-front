<template>
  <div class="figma-purchase-container">
    <!-- Horizontal Input Container matching Figma -->
    <div class="figma-horizontal-inputs">
      <!-- GET Token Input -->
      <div class="figma-input-section">
        <input
          :value="formattedGetTokenAmount"
          type="text"
          placeholder="100"
          class="figma-dark-input"
          @input="handleAmountInput"
          @focus="handleInputFocus"
          @blur="handleInputBlur"
        >
        <div class="figma-token-label">
          GET
        </div>
      </div>

      <!-- Swap Arrow -->
      <div class="figma-swap-arrow">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M8 2L8 14M8 14L12 10M8 14L4 10"
            stroke="#9CA3AF"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>

      <!-- Payment Token Input -->
      <div class="figma-input-section">
        <input
          :value="formattedEquivalentCost"
          type="text"
          readonly
          class="figma-dark-input readonly"
        >
        <div class="figma-token-dropdown">
          <select
            v-model="selectedPayToken"
            class="figma-dropdown-select"
            @change="calculateEquivalentCost"
          >
            <option
              v-for="token in payTokenOptions"
              :key="token.mint"
              :value="token.mint"
            >
              {{ token.symbol }}
            </option>
          </select>
          <svg
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            class="figma-dropdown-arrow"
          >
            <path
              d="M1 1L6 6L11 1"
              stroke="#9CA3AF"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- Green Buy Button matching Figma -->
    <button
      :disabled="!canSwap"
      :class="['figma-green-buy-btn', { loading: swapping }]"
      @click="handleSwap"
    >
      {{ swapping ? 'Processing...' : 'Buy GET' }}
    </button>

    <!-- Disconnect Button - Only show when wallet is connected -->
    <v-btn
      v-if="isWalletConnected"
      variant="outlined"
      color="red"
      class="disconnect-btn"
      @click="showDisconnectModal = true"
    >
      Disconnect wallet
    </v-btn>

    <!-- You Receive Text -->
    <div
      v-if="getTokenAmount && parseFloat(getTokenAmount) > 0"
      class="figma-receive-text"
    >
      You receive {{ formatNumber(parseFloat(getTokenAmount)) }} GET
    </div>

    <!-- Error Message -->
    <div
      v-if="errorMessage"
      class="figma-error-message"
    >
      {{ errorMessage }}
    </div>

    <!-- Success Message -->
    <div
      v-if="successMessage"
      class="figma-success-message"
    >
      {{ successMessage }}
    </div>

    <!-- Wallet Connection Modal -->
    <Teleport to="body">
      <div
        v-if="showWalletModal"
        class="figma-modal-overlay"
        @click="showWalletModal = false"
      >
        <div
          class="figma-modal"
          @click.stop
        >
          <div class="figma-modal-header">
            <h3>Connect Your Wallet</h3>
            <p>Choose a wallet to connect and buy GET tokens</p>
          </div>

          <div class="figma-modal-content">
            <ClientOnly>
              <div class="wallet-connection-container">
                <WalletMultiButton />
              </div>
            </ClientOnly>
          </div>

          <div class="figma-modal-actions">
            <button
              class="figma-cancel-button"
              @click="showWalletModal = false"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Disconnect Confirmation Modal -->
    <Teleport to="body">
      <div
        v-if="showDisconnectModal"
        class="figma-modal-overlay"
        @click="showDisconnectModal = false"
      >
        <div
          class="figma-modal"
          @click.stop
        >
          <div class="figma-modal-header">
            <h3>Disconnect Wallet</h3>
            <p>Are you sure you want to disconnect your wallet? This will clear all your current swap data.</p>
          </div>

          <div class="figma-modal-actions">
            <v-btn
              variant="tonal"
              @click="showDisconnectModal = false"
            >
              Cancel
            </v-btn>
            <v-btn
              variant="elevated"
              color="error"
              @click="handleDisconnect"
            >
              Disconnect Wallet
            </v-btn>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { VersionedTransaction } from '@solana/web3.js'
import type { SolanaWallet, SwapQuoteDetails, TokenConfig } from '~/composables/useJupiterSwap'
import { TOKEN_MINTS } from '~/composables/useJupiterSwap'

// Constants
const GET_TOKEN_MINT = TOKEN_MINTS.GET
const SOL_MINT = TOKEN_MINTS.SOL
const USDC_MINT = TOKEN_MINTS.USDC
const USDT_MINT = TOKEN_MINTS.USDT

// query parameters
const queryRoute = useRoute().query

// RPC Configuration - using environment variable
const getSolanaRpcUrl = () => {
  const config = useRuntimeConfig()
  return config.public.solanaRpcUrl || 'https://api.mainnet-beta.solana.com'
}

// Wallet integration with proper typing
const wallet = ref<SolanaWallet | null>(null)

// State
const getTokenAmount = ref('')
const equivalentCost = ref('')
const selectedPayToken = ref(SOL_MINT)
const swapping = ref(false)
const currentPrice = ref(0)
const _priceChange = ref<number | null>(null)
const swapQuote = ref<SwapQuoteDetails | null>(null)
const payTokenBalance = ref<number | null>(null)
const getTokenBalance = ref<number | null>(null)
const isCalculating = ref(false)
const showWalletModal = ref(false)
const showDisconnectModal = ref(false)
const errorMessage = ref<string | null>(null)
const successMessage = ref<string | null>(null)

// Memo-related state (only keeping memoText for URL parameter extraction)
const memoText = ref('')

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

// Enhanced memo extraction and validation function
const extractAndValidateMemo = (refParam: string | string[] | undefined): string => {
  try {
    // Extract memo from URL parameter
    let rawMemo = ''
    if (typeof refParam === 'string') {
      rawMemo = refParam
    }
    else if (Array.isArray(refParam) && refParam.length > 0) {
      rawMemo = refParam[0]
    }

    console.log('🔍 Extracting memo from URL parameter:', { rawMemo, type: typeof refParam })

    // If no memo parameter, return empty string
    if (!rawMemo || !rawMemo.trim()) {
      console.log('📝 No memo parameter found, proceeding without memo')
      return ''
    }

    // Trim whitespace
    const trimmedMemo = rawMemo.trim()

    // Validate memo length (Solana memo constraint: max 566 bytes)
    const memoBytes = new TextEncoder().encode(trimmedMemo).length
    if (memoBytes > 566) {
      console.warn('⚠️ Memo too long, truncating:', { originalLength: memoBytes, memo: trimmedMemo })
      // Truncate to fit within 566 bytes
      let truncatedMemo = trimmedMemo
      while (new TextEncoder().encode(truncatedMemo).length > 566) {
        truncatedMemo = truncatedMemo.slice(0, -1)
      }
      console.log('✂️ Memo truncated to:', { newLength: new TextEncoder().encode(truncatedMemo).length, memo: truncatedMemo })
      return truncatedMemo
    }

    // Basic sanitization - remove potentially problematic characters
    // eslint-disable-next-line no-control-regex
    const sanitizedMemo = trimmedMemo.replace(/[\u0000-\u001F\u007F]/g, '') // Remove control characters

    if (sanitizedMemo !== trimmedMemo) {
      console.warn('🧹 Memo sanitized, removed control characters:', { original: trimmedMemo, sanitized: sanitizedMemo })
    }

    // Final validation
    if (!sanitizedMemo) {
      console.warn('⚠️ Memo became empty after sanitization, proceeding without memo')
      return ''
    }

    console.log('✅ Memo extracted and validated successfully:', {
      memo: sanitizedMemo,
      byteLength: new TextEncoder().encode(sanitizedMemo).length,
      source: 'url',
    })

    return sanitizedMemo
  }
  catch (error) {
    console.error('❌ Error processing memo from URL parameter:', error)
    console.log('🔄 Falling back to no memo due to processing error')
    return ''
  }
}

// Initialize wallet on client side
onMounted(async () => {
  // Enhanced memo extraction with validation and logging
  const extractedMemo = extractAndValidateMemo(queryRoute?.ref)
  memoText.value = extractedMemo

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
          // Clear any previous error messages when wallet connects
          errorMessage.value = null
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

  // Enhanced logging for memo processing
  if (extractedMemo) {
    console.log('📋 Memo processing summary:', {
      extracted: extractedMemo,
      byteLength: new TextEncoder().encode(extractedMemo).length,
      maxBytes: 566,
      source: 'url_parameter',
      queryParam: queryRoute?.ref,
    })
  }
  else {
    console.log('📋 No memo will be used for transactions')
  }
})

// Computed properties
const isWalletConnected = computed(() => {
  return wallet.value?.connected || false
})

const canSwap = computed(() => {
  // Never allow interaction while swapping
  if (swapping.value) {
    return false
  }

  // If wallet is not connected, allow clicking to show connection modal
  if (!isWalletConnected.value) {
    return true
  }

  // If wallet is connected, require valid GET token amount
  return getTokenAmount.value
    && parseFloat(getTokenAmount.value) > 0
})

// Import number formatting utility
const { formatNumber } = useFormatNumber()

// Computed for formatted GET token amount display
const formattedGetTokenAmount = computed(() => {
  if (!getTokenAmount.value) return ''
  const numValue = parseFloat(getTokenAmount.value)
  if (isNaN(numValue)) return getTokenAmount.value
  return formatNumber(numValue)
})

// Computed for formatted equivalent cost
const formattedEquivalentCost = computed(() => {
  if (!equivalentCost.value) return '0.1'
  const parts = equivalentCost.value.split(' ')
  const amount = parseFloat(parts[0])
  if (isNaN(amount)) return '0.1'

  // Format with appropriate decimal places based on amount size
  if (amount >= 1000) {
    return formatNumber(Math.round(amount))
  }
  else if (amount >= 1) {
    return amount.toFixed(2)
  }
  else {
    return amount.toFixed(6)
  }
})

// Handle amount input with Figma-exact formatting
const handleAmountInput = (event: Event) => {
  const target = event.target as HTMLInputElement

  // Remove existing commas and get raw value
  let value = target.value.replace(/,/g, '')

  // Only allow numbers and decimal points
  value = value.replace(/[^0-9.]/g, '')

  // Prevent multiple decimal points
  const decimalCount = (value.match(/\./g) || []).length
  if (decimalCount > 1) {
    value = value.substring(0, value.lastIndexOf('.'))
  }

  // Limit decimal places to 6 for better precision
  const decimalIndex = value.indexOf('.')
  if (decimalIndex !== -1 && value.length - decimalIndex > 7) {
    value = value.substring(0, decimalIndex + 7)
  }

  // Update the model value (store raw number without formatting)
  getTokenAmount.value = value

  // Calculate equivalent cost
  calculateEquivalentCost()
}

// Handle input focus - show raw value for editing
const handleInputFocus = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (getTokenAmount.value) {
    target.value = getTokenAmount.value
  }
}

// Handle input blur - show formatted value
const handleInputBlur = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (getTokenAmount.value && !isNaN(parseFloat(getTokenAmount.value))) {
    const numValue = parseFloat(getTokenAmount.value)
    target.value = formatNumber(numValue)
  }
}

const _priceImpactClass = computed(() => {
  if (!swapQuote.value) return ''
  const impact = parseFloat(swapQuote.value.priceImpact)
  if (impact > 5) return 'impact-high'
  if (impact > 2) return 'impact-medium'
  return 'impact-low'
})

// Methods
const _formatPrice = (price: number | string | null): string => {
  if (!price) return '0.000000'
  return parseFloat(price.toString()).toFixed(6)
}

const _formatBalance = (balance: number | null): string => {
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

    // Enhanced memo validation before proceeding
    if (memoText.value.trim()) {
      try {
        console.log('🔍 Validating memo before swap:', { memo: memoText.value.trim(), source: 'url_parameter' })

        const { validateMemoForSwap } = useMemoErrorHandling()
        const memoValidation = validateMemoForSwap(memoText.value.trim())

        if (!memoValidation.isValid && memoValidation.error) {
          console.warn('⚠️ Memo validation failed, proceeding without memo:', {
            memo: memoText.value.trim(),
            error: memoValidation.error.userMessage,
            fallback: 'standard_swap',
          })
          // Don't show error to user, just proceed without memo
          memoText.value = ''
        }
        else {
          console.log('✅ Memo validation successful:', { memo: memoText.value.trim() })
        }
      }
      catch (error) {
        console.error('❌ Error during memo validation, proceeding without memo:', error)
        memoText.value = ''
      }
    }

    // Prepare swap options with enhanced memo logging
    const finalMemo = memoText.value.trim() || undefined
    const swapOptions = {
      memo: finalMemo,
      slippageBps: 50,
      wrapAndUnwrapSol: true,
      dynamicComputeUnitLimit: true,
      prioritizationFeeLamports: 'auto',
    }

    // Enhanced logging for transaction preparation
    if (finalMemo) {
      console.log('🚀 Preparing swap transaction with memo:', {
        memo: finalMemo,
        byteLength: new TextEncoder().encode(finalMemo).length,
        source: 'url_parameter',
        swapOptions: { ...swapOptions, memo: '[REDACTED]' },
      })
    }
    else {
      console.log('🚀 Preparing standard swap transaction (no memo)')
    }

    let transaction: VersionedTransaction
    let signature: string | null = null

    // Use memo-enabled transaction builder with fallback
    const { executeWithMemoFallback } = useMemoErrorHandling()

    const memoOperation = async () => {
      if (!swapOptions.memo) {
        throw new Error('No memo provided for memo operation')
      }

      console.log('🚀 Building transaction with memo using QuickNode:', {
        memo: swapOptions.memo,
        byteLength: new TextEncoder().encode(swapOptions.memo).length,
        source: 'url_parameter',
      })

      try {
        // Use simplified memo swap for better reliability
        const { createSimpleMemoSwap } = useSimpleMemoSwap()
        const memoSwapResponse = await createSimpleMemoSwap(
          freshQuote,
          publicKeyString,
          swapOptions.memo,
        )

        if (!memoSwapResponse?.transaction) {
          throw new Error('Failed to build transaction with memo')
        }

        // Verify the transaction contains memo before returning
        const { logTransactionMemoDetails } = useMemoVerification()
        logTransactionMemoDetails(memoSwapResponse.transaction, swapOptions.memo)

        console.log('✅ Memo transaction built successfully:', {
          memo: swapOptions.memo,
          transactionSize: memoSwapResponse.transaction.serialize().length,
        })

        return memoSwapResponse.transaction
      }
      catch (error) {
        console.error('❌ Failed to build memo transaction:', {
          memo: swapOptions.memo,
          error: error.message,
          fallback: 'will_use_standard_transaction',
        })
        throw error
      }
    }

    const fallbackOperation = async () => {
      console.log('🔄 Using standard swap transaction (fallback):', {
        reason: 'memo_transaction_failed_or_not_provided',
        originalMemo: swapOptions.memo || 'none',
      })

      try {
        const swapResponse = await getSwapTransaction(
          freshQuote,
          publicKeyString,
          { ...swapOptions, memo: undefined }, // Remove memo for fallback
        )

        if (!swapResponse?.swapTransaction) {
          throw new Error('Failed to get swap transaction from Jupiter')
        }

        // Deserialize the transaction
        const { VersionedTransaction } = await import('@solana/web3.js')
        const swapTransactionBuf = Buffer.from(swapResponse.swapTransaction, 'base64')
        const transaction = VersionedTransaction.deserialize(swapTransactionBuf)

        console.log('✅ Standard transaction built successfully:', {
          transactionSize: transaction.serialize().length,
          memoIncluded: false,
        })

        return transaction
      }
      catch (error) {
        console.error('❌ Failed to build standard transaction:', error)
        throw error
      }
    }

    // Execute with fallback if memo is provided, otherwise use standard flow
    if (swapOptions.memo) {
      const result = await executeWithMemoFallback(
        memoOperation,
        fallbackOperation,
        'transaction building',
      )

      transaction = result.result

      // Enhanced logging for fallback scenarios
      if (result.usedFallback && result.error) {
        console.warn('⚠️ Memo transaction failed, using standard transaction:', {
          originalMemo: swapOptions.memo,
          error: result.error.message,
          fallbackReason: 'memo_transaction_build_failed',
          userImpact: 'transaction_will_proceed_without_memo',
        })
        // Update swap options to reflect that memo was not used
        swapOptions.memo = undefined
      }
      else if (swapOptions.memo) {
        console.log('✅ Memo transaction will be used:', {
          memo: swapOptions.memo,
          source: 'url_parameter',
        })
      }
    }
    else {
      transaction = await fallbackOperation()
    }

    // Execute the swap using wallet's sendTransaction method
    console.log('Executing swap transaction through wallet')

    // Use wallet's sendTransaction method if available (bypasses RPC issues)
    signature = null

    if (wallet.value.sendTransaction) {
      console.log('Using wallet sendTransaction method')
      // Create a minimal connection object for the wallet
      const dummyConnection = {
        rpcEndpoint: getSolanaRpcUrl(),
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
          const connection = new Connection(getSolanaRpcUrl())
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
      // Show success message with memo if provided
      console.log('Swap successful!', signature)

      // Verify memo submission
      if (swapOptions.memo) {
        const { createMemoVerificationUrl } = useMemoVerification()
        const explorerUrl = createMemoVerificationUrl(signature)

        console.log('✅ Transaction with memo submitted successfully!')
        console.log('📝 Memo:', swapOptions.memo)
        console.log('🔗 Verify on Solana Explorer:', explorerUrl)

        // Try to verify memo after a short delay (to allow transaction to be processed)
        setTimeout(async () => {
          try {
            const { Connection } = await import('@solana/web3.js')
            const connection = new Connection(getSolanaRpcUrl())
            const { extractMemoFromTransaction } = useMemoVerification()

            const extractedMemo = await extractMemoFromTransaction(signature, connection)
            if (extractedMemo === swapOptions.memo) {
              console.log('✅ Memo verified on-chain:', extractedMemo)
            }
            else {
              console.warn('⚠️ Memo verification failed. Expected:', swapOptions.memo, 'Found:', extractedMemo)
            }
          }
          catch (error) {
            console.warn('Could not verify memo on-chain:', error)
          }
        }, 5000)
      }

      let message = `Swap successful! Transaction: ${signature.slice(0, 8)}...`
      if (swapOptions.memo) {
        message += ` | Memo: ${swapOptions.memo}`
      }
      successMessage.value = message

      // Clear success message after 10 seconds
      setTimeout(() => {
        successMessage.value = null
      }, 10000)

      // Reset form and refresh balances
      getTokenAmount.value = ''
      equivalentCost.value = ''
      swapQuote.value = null
      memoText.value = '' // Clear memo field
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

// Handle wallet disconnect
const handleDisconnect = async () => {
  try {
    if (wallet.value && wallet.value.disconnect) {
      await wallet.value.disconnect()
      console.log('Wallet disconnected successfully')

      // Reset all state
      getTokenAmount.value = ''
      equivalentCost.value = ''
      swapQuote.value = null
      memoText.value = ''
      payTokenBalance.value = null
      getTokenBalance.value = null
      errorMessage.value = null
      successMessage.value = null
    }
    else {
      console.warn('Wallet does not support disconnect method')
      // For wallets that don't have disconnect method, we can try to reset the wallet reference
      wallet.value = null
    }
  }
  catch (error) {
    console.error('Failed to disconnect wallet:', error)
    errorMessage.value = 'Failed to disconnect wallet. Please try again.'

    // Clear error message after 5 seconds
    setTimeout(() => {
      errorMessage.value = null
    }, 5000)
  }
  showDisconnectModal.value = false
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

// // Refresh price every 30 seconds (client-side only)
// onMounted(() => {
//   if (import.meta.client) {
//     setInterval(() => {
//       fetchCurrentPrice()
//     }, 30000)
//   }
// })
</script>

<style scoped>
/* === FIGMA-EXACT DARK THEME PURCHASE STYLES === */

.figma-purchase-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

/* Horizontal Input Container matching Figma */
.figma-horizontal-inputs {
  display: flex;
  align-items: center;
  background: rgba(45, 55, 65, 0.8);
  border-radius: 50px;
  padding: 12px 20px;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(54, 58, 63, 1);
  outline: invert
}

/* Input Section */
.figma-input-section {
  display: flex;
  align-items: center;
  flex: 1;
}

/* Dark Input matching Figma */
.figma-dark-input {
  background: transparent;
  border: none;
  outline: none;
  color: #FFFFFF;
  font-size: 24px;
  font-weight: 600;
  font-family: inherit;
  width: 100%;
  text-align: left;
}

.figma-dark-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
}

.figma-dark-input.readonly {
  color: rgba(255, 255, 255, 0.8);
  cursor: not-allowed;
}

/* Token Label */
.figma-token-label {
  color: #FFC107;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
  user-select: none;
}

/* Token Dropdown */
.figma-token-dropdown {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 8px 16px;
  cursor: pointer;
}

.figma-dropdown-select {
  background: transparent;
  border: none;
  outline: none;
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  appearance: none;
  padding-right: 20px;
}

.figma-dropdown-select option {
  background: #2D3741;
  color: #FFFFFF;
  padding: 4px 8px !important;
}

.figma-dropdown-arrow {
  position: absolute;
  right: 8px;
  pointer-events: none;
}

/* Swap Arrow */
.figma-swap-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  margin: 0 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.figma-swap-arrow:hover {
  background: rgba(255, 255, 255, 0.2);
}

.figma-swap-arrow:hover svg path {
  stroke: #FFC107;
}

/* Disconnect Button */
.disconnect-btn {
  width: 100%;
  margin-top: 12px;
  margin-bottom: 16px;
  height: 48px;
  font-weight: 600;
  text-transform: none;
  border-radius: 12px;
}

/* Green Buy Button matching Figma */
.figma-green-buy-btn {
  width: 100%;
  height: 56px;
  background: rgba(2, 183, 25, 1);
  border: none;
  border-radius: 28px;
  font-size: 18px;
  font-weight: 700;
  color: #FFFFFF;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 16px;
  box-shadow: 0 4px 20px rgba(0, 212, 170, 0.3);
}

.figma-green-buy-btn:hover:not(:disabled) {
  background: rgba(2, 183, 25, 1);
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(0, 212, 170, 0.4);
}

.figma-green-buy-btn:disabled {
  background: rgba(18, 183, 106, 0.4);
  color: rgba(255, 255, 255, 0.5);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.figma-green-buy-btn.loading {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
  cursor: wait;
}

.disconnect-btn{
  width: 100%;
  border-radius: 28px;
  font-size: 15px;
  font-weight: 700;
  color: #FFFFFF;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* You Receive Text matching Figma */
.figma-receive-text {
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 12px;
}

/* Error Message */
.figma-error-message {
  background: #F8D7DA;
  color: #721C24;
  border: 1px solid #F5C6CB;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  text-align: center;
  margin-top: 12px;
}

/* Success Message */
.figma-success-message {
  background: #D4EDDA;
  color: #155724;
  border: 1px solid #C3E6CB;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  text-align: center;
  margin-top: 12px;
}

/* Modal Styles */
.figma-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.figma-modal {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 32px;
  max-width: 400px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.figma-modal-header h3 {
  font-size: 24px;
  font-weight: 700;
  color: #212529;
  margin-bottom: 8px;
}

.figma-modal-header p {
  font-size: 16px;
  color: #6C757D;
  margin-bottom: 24px;
}

.figma-modal-content {
  margin-bottom: 24px;
}

.wallet-connection-container {
  display: flex;
  justify-content: center;
}

.figma-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap:5px;
}

.figma-cancel-button {
  background: #6C757D;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.figma-cancel-button:hover {
  background: #5A6268;
}

/* === RESPONSIVE DESIGN === */

/* Mobile (default) */
@media (max-width: 599px) {
  .figma-horizontal-inputs {
    flex-direction: column;
    gap: 16px;
    padding: 20px;
    border-radius: 20px;
  }

  .figma-input-section {
    width: 100%;
    justify-content: space-between;
  }

  .figma-swap-arrow {
    margin: 0;
    transform: rotate(90deg);
  }

  .figma-dark-input {
    font-size: 20px;
  }

  .figma-green-buy-btn {
    height: 48px;
    font-size: 16px;
  }
}

/* Tablet (600px - 1199px) */
@media (min-width: 600px) and (max-width: 1199px) {
  .figma-horizontal-inputs {
    max-width: 600px;
    padding: 16px 24px;
  }

  .figma-dark-input {
    font-size: 22px;
  }

  .figma-green-buy-btn {
    height: 52px;
    font-size: 17px;
  }
}

/* Desktop (1200px+) */
@media (min-width: 1200px) {
  .figma-horizontal-inputs {
    max-width: 800px;
    padding: 12px 20px;
  }

  .figma-dark-input {
    font-size: 24px;
  }

  .figma-green-buy-btn {
    height: 56px;
    font-size: 18px;
  }
}

/* Legacy styles for compatibility */
.token-purchase-bg { position: relative; overflow: hidden }
.token-purchase-container { display: flex; flex-direction: column; justify-content: center; align-items: center; max-width: 1200px; margin: 0 auto; width: 100%; position: relative; }
.token-purchase-content { position: relative; z-index: 3; max-width: 1200px; margin: 0 auto; width: 100%; margin-bottom: 0; }
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

.price-display {
  text-align: center;
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
  max-width: 50%;

}

.amount-input :deep(.v-field__input) {
  background: rgba(54, 58, 63, 1);
  font-size: 18px;
  font-weight: 600;
  overflow: hidden;
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

  .amount-input :deep(.v-field__input) {
    font-size: 12px;
    border-radius: 50%;
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
