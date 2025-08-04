import type { Connection, PublicKey } from '@solana/web3.js'
import { VersionedTransaction } from '@solana/web3.js'

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
          wrapAndUnwrapSol: true,
          dynamicComputeUnitLimit: true,
          prioritizationFeeLamports: 'auto',
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
    executeSwap,
    calculateDisplayAmounts,
  }
}

// Export interfaces for use in other components
export type {
  SolanaWallet,
  JupiterQuoteResponse,
  JupiterSwapResponse,
  SwapQuoteDetails,
  TokenConfig,
  RouteInfo,
}
