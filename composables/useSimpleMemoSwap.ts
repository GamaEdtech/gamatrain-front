import { PublicKey, VersionedTransaction, TransactionMessage, TransactionInstruction } from '@solana/web3.js'

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
): Promise<{ transaction: VersionedTransaction, memo: string } | null> => {
  try {
    console.log('🚀 Creating simple memo swap with QuickNode RPC')
    console.log('📝 Memo:', memo)

    // Create connection using environment configuration
    const { Connection } = await import('@solana/web3.js')
    const connection = new Connection(getSolanaRpcUrl(), 'confirmed')

    const payerPublicKey = new PublicKey(userPublicKey)

    // Get Jupiter swap instructions
    const instructionsResponse = await $fetch<JupiterInstructionsResponse>('https://quote-api.jup.ag/v6/swap-instructions', {
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
    const deserializeInstruction = (instruction: JupiterInstruction): TransactionInstruction => {
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
    const instructions: TransactionInstruction[] = []

    // 1. Add compute budget instructions
    if (instructionsResponse.computeBudgetInstructions?.length > 0) {
      instructions.push(...instructionsResponse.computeBudgetInstructions.map(deserializeInstruction))
    }

    // 2. Add setup instructions
    if (instructionsResponse.setupInstructions?.length > 0) {
      instructions.push(...instructionsResponse.setupInstructions.map(deserializeInstruction))
    }

    // 3. Add memo instruction
    const { createValidatedMemoInstruction } = useSolanaMemo()
    const memoResult = createValidatedMemoInstruction(memo, payerPublicKey)

    if (!memoResult.success) {
      throw new Error(`Memo validation failed: ${memoResult.errorMessage}`)
    }

    if (memoResult.instruction) {
      instructions.push(memoResult.instruction)
      console.log('✅ Memo instruction added successfully')
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
      hasMemo: true,
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
 * Main composable for simple memo swap
 */
export const useSimpleMemoSwap = () => {
  return {
    createSimpleMemoSwap,
    getSolanaRpcUrl,
  }
}
