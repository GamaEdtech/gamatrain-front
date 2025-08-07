import type { Connection, TransactionInstruction } from '@solana/web3.js'
import { PublicKey, VersionedTransaction, TransactionMessage, AddressLookupTableAccount } from '@solana/web3.js'
import { Buffer } from 'buffer'

// Wallet interface for proper typing
interface SolanaWallet {
  connected: boolean
  publicKey: {
    value: PublicKey
  }
  signTransaction: (transaction: VersionedTransaction) => Promise<VersionedTransaction>
}

// Route plan information from Jupiter API
interface RouteInfo {
  swapInfo: {
    ammKey: string
    label: string
    inputMint: string
    outputMint: string
    inAmount: string
    outAmount: string
    feeAmount: string
    feeMint: string
  }
  percent: number
  bps: number
}

// Jupiter Quote Response (matches actual API response structure)
interface JupiterQuoteResponse {
  inputMint: string
  inAmount: string
  outputMint: string
  outAmount: string
  otherAmountThreshold: string
  swapMode: string
  slippageBps: number
  platformFee: null | unknown
  priceImpactPct: string
  routePlan: RouteInfo[]
  contextSlot: number
  timeTaken: number
  swapUsdValue: string
  simplerRouteUsed: boolean
  mostReliableAmmsQuoteReport?: {
    info: Record<string, string>
  }
  useIncurredSlippageForQuoting: null | unknown
  otherRoutePlans: null | unknown
  aggregatorVersion: null | unknown
}

// Jupiter Swap Response
interface JupiterSwapResponse {
  swapTransaction: string
  lastValidBlockHeight: number
}

// Jupiter Swap Instructions Response (from /swap-instructions endpoint)
interface JupiterSwapInstructionsResponse {
  tokenLedgerInstruction?: unknown // If using useTokenLedger = true
  computeBudgetInstructions: unknown[] // Instructions to setup compute budget
  setupInstructions: unknown[] // Setup missing ATA for users
  swapInstruction: unknown // The actual swap instruction
  cleanupInstruction?: unknown // Unwrap SOL if wrapAndUnwrapSol = true
  addressLookupTableAddresses: string[] // Lookup table addresses for versioned transactions
  error?: string
}

// Enhanced swap response that includes memo support
interface JupiterSwapWithMemoResponse {
  transaction: VersionedTransaction
  lastValidBlockHeight: number
  memo?: string
  signature?: string
}

// Swap options interface for enhanced functionality
interface SwapOptions {
  memo?: string
  slippageBps?: number
  wrapAndUnwrapSol?: boolean
  dynamicComputeUnitLimit?: boolean
  prioritizationFeeLamports?: string | number
  useInstructions?: boolean // Whether to use instructions endpoint instead of serialized transaction
}

// Processed swap quote for UI display
interface SwapQuoteDetails {
  rate: number
  priceImpact: string
  minimumReceived: number
  quoteResponse: JupiterQuoteResponse
}

// Token configuration
interface TokenConfig {
  mint: string
  symbol: string
  name: string
  logoURI: string
  decimals: number
}

// Token decimal constants
export const TOKEN_DECIMALS = {
  SOL: 9,
  USDC: 6,
  USDT: 6,
  GET: 6,
} as const

// Token mint addresses
export const TOKEN_MINTS = {
  SOL: 'So11111111111111111111111111111111111111112',
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  GET: 'GeutGuhcTYRf4rkbZmWDMEgjt5jHyJN4nHko38GJjQhv',
} as const

// Utility functions for amount conversion and decimal handling
export const convertToTokenUnits = (amount: number, decimals: number): number => {
  return Math.floor(amount * Math.pow(10, decimals))
}

export const convertFromTokenUnits = (amount: string, decimals: number): number => {
  return parseInt(amount) / Math.pow(10, decimals)
}

export const formatTokenAmount = (amount: number, decimals: number = 6): string => {
  return amount.toFixed(decimals)
}

export const formatDisplayAmount = (amount: number, maxDecimals: number = 6): string => {
  // Remove trailing zeros and unnecessary decimal points
  return parseFloat(amount.toFixed(maxDecimals)).toString()
}

export const getTokenDecimals = (mint: string): number => {
  switch (mint) {
    case TOKEN_MINTS.SOL:
      return TOKEN_DECIMALS.SOL
    case TOKEN_MINTS.USDC:
      return TOKEN_DECIMALS.USDC
    case TOKEN_MINTS.USDT:
      return TOKEN_DECIMALS.USDT
    case TOKEN_MINTS.GET:
      return TOKEN_DECIMALS.GET
    default:
      return 6 // Default to 6 decimals for unknown tokens
  }
}

// Utility function to deserialize Jupiter instruction format
const deserializeInstruction = (instruction: unknown): TransactionInstruction => {
  return new TransactionInstruction({
    programId: new PublicKey(instruction.programId),
    keys: instruction.accounts.map((key: unknown) => ({
      pubkey: new PublicKey(key.pubkey),
      isSigner: key.isSigner,
      isWritable: key.isWritable,
    })),
    data: Buffer.from(instruction.data, 'base64'),
  })
}

// Utility function to get address lookup table accounts
const getAddressLookupTableAccounts = async (
  keys: string[],
  connection: Connection,
): Promise<AddressLookupTableAccount[]> => {
  if (!keys || keys.length === 0) {
    return []
  }

  try {
    const addressLookupTableAccountInfos = await connection.getMultipleAccountsInfo(
      keys.map(key => new PublicKey(key)),
    )

    return addressLookupTableAccountInfos.reduce((acc, accountInfo, index) => {
      const addressLookupTableAddress = keys[index]
      if (accountInfo) {
        const addressLookupTableAccount = new AddressLookupTableAccount({
          key: new PublicKey(addressLookupTableAddress),
          state: AddressLookupTableAccount.deserialize(accountInfo.data),
        })
        acc.push(addressLookupTableAccount)
      }
      return acc
    }, new Array<AddressLookupTableAccount>())
  }
  catch (error) {
    console.warn('Failed to get address lookup table accounts, proceeding without them:', error)
    // Return empty array to continue without lookup tables
    // This is acceptable as the transaction can still work without them
    return []
  }
}

export const useJupiterSwap = () => {
  const getQuote = async (
    inputMint: string,
    outputMint: string,
    amount: number,
    inputDecimals: number,
    slippageBps: number = 50,
  ): Promise<JupiterQuoteResponse | null> => {
    try {
      // Convert display amount to token units using proper decimals
      const amountInTokenUnits = convertToTokenUnits(amount, inputDecimals)

      const response = await $fetch<JupiterQuoteResponse>('https://quote-api.jup.ag/v6/quote', {
        query: {
          inputMint,
          outputMint,
          amount: amountInTokenUnits.toString(),
          slippageBps,
          onlyDirectRoutes: false,
          asLegacyTransaction: false,
        },
      })

      return response || null
    }
    catch (error) {
      console.error('Failed to get Jupiter quote:', error)
      console.error('Error details:', {
        inputMint,
        outputMint,
        amount,
        inputDecimals,
        amountInTokenUnits: convertToTokenUnits(amount, inputDecimals),
        slippageBps,
        error: error instanceof Error ? error.message : error,
      })
      return null
    }
  }

  const getSwapTransaction = async (
    quote: JupiterQuoteResponse,
    userPublicKey: string,
    options: SwapOptions = {},
  ): Promise<JupiterSwapResponse | null> => {
    try {
      const response = await $fetch<JupiterSwapResponse>('https://quote-api.jup.ag/v6/swap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          quoteResponse: quote,
          userPublicKey,
          wrapAndUnwrapSol: options.wrapAndUnwrapSol ?? true,
          dynamicComputeUnitLimit: options.dynamicComputeUnitLimit ?? true,
          prioritizationFeeLamports: options.prioritizationFeeLamports ?? 'auto',
        },
      })

      return response
    }
    catch (error) {
      console.error('Failed to get swap transaction:', error)
      console.error('Error details:', {
        userPublicKey,
        inputMint: quote.inputMint,
        outputMint: quote.outputMint,
        inAmount: quote.inAmount,
        error: error instanceof Error ? error.message : error,
      })
      return null
    }
  }

  const getSwapInstructions = async (
    quote: JupiterQuoteResponse,
    userPublicKey: string,
    options: SwapOptions = {},
  ): Promise<JupiterSwapInstructionsResponse | null> => {
    try {
      const response = await $fetch<JupiterSwapInstructionsResponse>('https://quote-api.jup.ag/v6/swap-instructions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          quoteResponse: quote,
          userPublicKey,
          wrapAndUnwrapSol: options.wrapAndUnwrapSol ?? true,
          dynamicComputeUnitLimit: options.dynamicComputeUnitLimit ?? true,
          prioritizationFeeLamports: options.prioritizationFeeLamports ?? 'auto',
        },
      })

      if (response.error) {
        throw new Error(`Jupiter API error: ${response.error}`)
      }

      return response
    }
    catch (error) {
      console.error('Failed to get swap instructions:', error)
      console.error('Error details:', {
        userPublicKey,
        inputMint: quote.inputMint,
        outputMint: quote.outputMint,
        inAmount: quote.inAmount,
        error: error instanceof Error ? error.message : error,
      })
      return null
    }
  }

  const buildTransactionWithMemo = async (
    quote: JupiterQuoteResponse,
    userPublicKey: string,
    connection: Connection,
    options: SwapOptions = {},
  ): Promise<JupiterSwapWithMemoResponse | null> => {
    try {
      const payerPublicKey = new PublicKey(userPublicKey)

      // Get swap instructions from Jupiter
      const instructionsResponse = await getSwapInstructions(quote, userPublicKey, options)
      if (!instructionsResponse) {
        throw new Error('Failed to get swap instructions from Jupiter')
      }

      const {
        computeBudgetInstructions,
        setupInstructions,
        swapInstruction: swapInstructionPayload,
        cleanupInstruction,
        addressLookupTableAddresses,
      } = instructionsResponse

      // Get address lookup table accounts
      const addressLookupTableAccounts = await getAddressLookupTableAccounts(
        addressLookupTableAddresses,
        connection,
      )

      // Build instructions array in proper order
      const instructions: TransactionInstruction[] = []

      // 1. Add compute budget instructions (if any)
      if (computeBudgetInstructions && computeBudgetInstructions.length > 0) {
        instructions.push(...computeBudgetInstructions.map(deserializeInstruction))
      }

      // 2. Add setup instructions (if any)
      if (setupInstructions && setupInstructions.length > 0) {
        instructions.push(...setupInstructions.map(deserializeInstruction))
      }

      // 3. Add memo instruction (if memo is provided)
      if (options.memo && options.memo.trim().length > 0) {
        const { createValidatedMemoInstruction } = useSolanaMemo()
        const memoResult = createValidatedMemoInstruction(options.memo, payerPublicKey)

        if (!memoResult.success) {
          throw new Error(`Memo validation failed: ${memoResult.errorMessage}`)
        }

        if (memoResult.instruction) {
          instructions.push(memoResult.instruction)
        }
      }

      // 4. Add the main swap instruction
      if (swapInstructionPayload) {
        instructions.push(deserializeInstruction(swapInstructionPayload))
      }

      // 5. Add cleanup instructions (if any)
      if (cleanupInstruction) {
        instructions.push(deserializeInstruction(cleanupInstruction))
      }

      // Get recent blockhash
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()

      // Build the versioned transaction
      const messageV0 = new TransactionMessage({
        payerKey: payerPublicKey,
        recentBlockhash: blockhash,
        instructions,
      }).compileToV0Message(addressLookupTableAccounts)

      const transaction = new VersionedTransaction(messageV0)

      return {
        transaction,
        lastValidBlockHeight,
        memo: options.memo,
      }
    }
    catch (error) {
      console.error('Failed to build transaction with memo:', error)
      console.error('Error details:', {
        userPublicKey,
        memo: options.memo,
        inputMint: quote.inputMint,
        outputMint: quote.outputMint,
        error: error instanceof Error ? error.message : error,
      })
      return null
    }
  }

  const executeSwap = async (
    swapTransactionBase64: string,
    wallet: SolanaWallet,
    connection: Connection,
  ): Promise<string | null> => {
    try {
      // Deserialize the transaction
      const swapTransactionBuf = Buffer.from(swapTransactionBase64, 'base64')
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf)

      // Sign and send the transaction
      const signedTransaction = await wallet.signTransaction(transaction)
      const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
        skipPreflight: true,
        maxRetries: 2,
      })

      // Confirm the transaction using the updated method
      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash: transaction.message.recentBlockhash,
        lastValidBlockHeight: await connection.getLatestBlockhash().then(res => res.lastValidBlockHeight),
      }, 'confirmed')

      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${confirmation.value.err}`)
      }

      console.log('Swap transaction successful:', signature)
      return signature
    }
    catch (error) {
      console.error('Failed to execute swap:', error)
      console.error('Error details:', {
        walletConnected: wallet.connected,
        walletPublicKey: wallet.publicKey.value.toString(),
        error: error instanceof Error ? error.message : error,
      })
      throw error
    }
  }

  const executeSwapWithTransaction = async (
    transaction: VersionedTransaction,
    wallet: SolanaWallet,
    connection: Connection,
    memo?: string,
  ): Promise<string | null> => {
    try {
      console.log('Executing swap with transaction', memo ? `(memo: ${memo})` : '')

      // Sign and send the transaction
      const signedTransaction = await wallet.signTransaction(transaction)
      const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
        skipPreflight: true,
        maxRetries: 2,
      })

      // Confirm the transaction using the updated method
      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash: transaction.message.recentBlockhash,
        lastValidBlockHeight: await connection.getLatestBlockhash().then(res => res.lastValidBlockHeight),
      }, 'confirmed')

      if (confirmation.value.err) {
        const errorMsg = confirmation.value.err.toString()
        if (memo && errorMsg.includes('memo')) {
          throw new Error(`Transaction failed due to memo issue: ${errorMsg}`)
        }
        throw new Error(`Transaction failed: ${errorMsg}`)
      }

      console.log('Swap transaction successful:', signature)
      if (memo) {
        console.log('Transaction included memo:', memo)
      }
      return signature
    }
    catch (error) {
      console.error('Failed to execute swap with transaction:', error)
      console.error('Error details:', {
        walletConnected: wallet.connected,
        walletPublicKey: wallet.publicKey.value.toString(),
        hasMemo: !!memo,
        memo: memo,
        error: error instanceof Error ? error.message : error,
      })
      throw error
    }
  }

  // Convenience function that automatically handles token decimals
  const getQuoteWithDecimals = async (
    inputMint: string,
    outputMint: string,
    amount: number,
    slippageBps: number = 50,
  ): Promise<JupiterQuoteResponse | null> => {
    const inputDecimals = getTokenDecimals(inputMint)
    return getQuote(inputMint, outputMint, amount, inputDecimals, slippageBps)
  }

  // Helper function to calculate display amounts from quote response
  const calculateDisplayAmounts = (quote: JupiterQuoteResponse) => {
    const inputDecimals = getTokenDecimals(quote.inputMint)
    const outputDecimals = getTokenDecimals(quote.outputMint)

    const inputAmount = convertFromTokenUnits(quote.inAmount, inputDecimals)
    const outputAmount = convertFromTokenUnits(quote.outAmount, outputDecimals)
    const minimumReceived = convertFromTokenUnits(quote.otherAmountThreshold, outputDecimals)

    return {
      inputAmount,
      outputAmount,
      minimumReceived,
      rate: outputAmount / inputAmount,
      priceImpact: parseFloat(quote.priceImpactPct),
    }
  }

  return {
    getQuote,
    getQuoteWithDecimals,
    getSwapTransaction,
    getSwapInstructions,
    buildTransactionWithMemo,
    executeSwap,
    executeSwapWithTransaction,
    calculateDisplayAmounts,
  }
}

// Export interfaces for use in other components
export type {
  SolanaWallet,
  JupiterQuoteResponse,
  JupiterSwapResponse,
  JupiterSwapInstructionsResponse,
  JupiterSwapWithMemoResponse,
  SwapOptions,
  SwapQuoteDetails,
  TokenConfig,
  RouteInfo,
}
