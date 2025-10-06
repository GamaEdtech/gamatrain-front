import type { VersionedTransaction as TVersionedTransaction, TransactionInstruction as TTransactionInstruction } from '@solana/web3.js'
import { Buffer } from 'buffer'

// Interfaces for Jupiter API responses
interface JupiterInstruction {
  programId: string
  accounts: Array<{
    pubkey: string
    isSigner: boolean
    isWritable: boolean
  }>
  data: string
}

interface JupiterInstructionsResponse {
  computeBudgetInstructions?: JupiterInstruction[]
  setupInstructions?: JupiterInstruction[]
  swapInstruction?: JupiterInstruction
  cleanupInstruction?: JupiterInstruction
  error?: string
}

/**
 * Simplified memo swap functionality that works reliably with QuickNode
 */

// Get RPC endpoint from environment configuration
const getSolanaRpcUrl = () => {
  const config = useRuntimeConfig()
  return config.public.solanaRpcUrl || 'https://api.mainnet-beta.solana.com'
}

/**
 * Creates a simple swap transaction with memo using Jupiter instructions
 * This version is optimized for reliability with your QuickNode endpoint
 */
export const createSimpleMemoSwap = async (
  quote: unknown,
  userPublicKey: string,
  memo: string,
): Promise<{ transaction: TVersionedTransaction, memo: string } | null> => {
  try {
    // Check if we're running on the client side
    if (!import.meta.client) {
      console.error('❌ Memo swap can only be created on the client side')
      return null
    }

    console.log('🚀 Creating simple memo swap with QuickNode RPC')
    console.log('📝 Memo:', memo)

    const { Connection, PublicKey, TransactionInstruction, TransactionMessage, VersionedTransaction } = await import('@solana/web3.js')

    // Create connection using environment configuration
    const connection = new Connection(getSolanaRpcUrl(), 'confirmed')

    const payerPublicKey = new PublicKey(userPublicKey)

    // Get Jupiter swap instructions
    const instructionsResponse = await $fetch<JupiterInstructionsResponse>('https://lite-api.jup.ag/swap/v1/swap-instructions', {
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

    if (instructionsResponse.error) {
      throw new Error(`Jupiter API error: ${instructionsResponse.error}`)
    }

    // Deserialize instructions
    const deserializeInstruction = (instruction: JupiterInstruction): TTransactionInstruction => {
      return new TransactionInstruction({
        programId: new PublicKey(instruction.programId),
        keys: instruction.accounts.map(key => ({
          pubkey: new PublicKey(key.pubkey),
          isSigner: key.isSigner,
          isWritable: key.isWritable,
        })),
        data: Buffer.from(instruction.data, 'base64'),
      })
    }

    // Build instructions array
    const instructions: TTransactionInstruction[] = []

    // 1. Add compute budget instructions (fix TypeScript issues)
    if (instructionsResponse.computeBudgetInstructions && instructionsResponse.computeBudgetInstructions.length > 0) {
      instructions.push(...instructionsResponse.computeBudgetInstructions.map(deserializeInstruction))
    }

    // 2. Add setup instructions (fix TypeScript issues)
    if (instructionsResponse.setupInstructions && instructionsResponse.setupInstructions.length > 0) {
      instructions.push(...instructionsResponse.setupInstructions.map(deserializeInstruction))
    }

    // 3. Add memo instruction using async version
    const { createValidatedMemoInstructionAsync, canCreateMemoInstructions } = useSolanaMemo()

    // Check if memo instructions can be created
    if (!canCreateMemoInstructions()) {
      console.warn('⚠️ Memo instructions cannot be created in this environment, proceeding without memo')
    }
    else {
      try {
        const memoResult = await createValidatedMemoInstructionAsync(memo, payerPublicKey)

        if (!memoResult.success) {
          console.warn(`⚠️ Memo validation failed: ${memoResult.errorMessage}, proceeding without memo`)
        }
        else if (memoResult.instruction) {
          instructions.push(memoResult.instruction)
          console.log('✅ Memo instruction added successfully')
        }
      }
      catch (memoError) {
        console.warn('⚠️ Failed to create memo instruction, proceeding without memo:', memoError)
      }
    }

    // 4. Add swap instruction
    if (instructionsResponse.swapInstruction) {
      instructions.push(deserializeInstruction(instructionsResponse.swapInstruction))
    }

    // 5. Add cleanup instructions
    if (instructionsResponse.cleanupInstruction) {
      instructions.push(deserializeInstruction(instructionsResponse.cleanupInstruction))
    }

    // Get recent blockhash from your QuickNode endpoint
    const { blockhash } = await connection.getLatestBlockhash('confirmed')

    // Build transaction without address lookup tables for simplicity
    const messageV0 = new TransactionMessage({
      payerKey: payerPublicKey,
      recentBlockhash: blockhash,
      instructions,
    }).compileToV0Message([]) // Empty array for address lookup tables

    const transaction = new VersionedTransaction(messageV0)

    console.log('✅ Simple memo transaction built successfully')
    console.log('📊 Transaction details:', {
      instructionCount: instructions.length,
      hasMemo: instructions.some((inst) => {
        // Check if any instruction is a memo instruction
        try {
          const { isMemoInstruction } = useSolanaMemo()
          return isMemoInstruction(inst)
        }
        catch {
          return false
        }
      }),
      memo: memo,
    })

    return {
      transaction,
      memo,
    }
  }
  catch (error) {
    console.error('❌ Failed to create simple memo swap:', error)
    return null
  }
}

/**
 * Creates a simple swap transaction with enhanced error handling and fallback
 */
export const createSimpleMemoSwapWithFallback = async (
  quote: unknown,
  userPublicKey: string,
  memo: string,
): Promise<{
  transaction: TVersionedTransaction | null
  memo: string | null
  success: boolean
  error?: string
  hasMemo: boolean
}> => {
  try {
    const result = await createSimpleMemoSwap(quote, userPublicKey, memo)

    if (result) {
      return {
        transaction: result.transaction,
        memo: result.memo,
        success: true,
        hasMemo: true,
      }
    }
    else {
      return {
        transaction: null,
        memo: null,
        success: false,
        error: 'Failed to create memo swap transaction',
        hasMemo: false,
      }
    }
  }
  catch (error) {
    console.error('❌ Memo swap creation failed:', error)
    return {
      transaction: null,
      memo: null,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      hasMemo: false,
    }
  }
}

/**
 * Main composable for simple memo swap
 */
export const useSimpleMemoSwap = () => {
  return {
    createSimpleMemoSwap,
    createSimpleMemoSwapWithFallback,
    getSolanaRpcUrl,
  }
}
