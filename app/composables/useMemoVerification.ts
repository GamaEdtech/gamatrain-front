import type { Connection, VersionedTransaction } from '@solana/web3.js'
import { Buffer } from 'buffer'

/**
 * Utility functions to verify memo submission in transactions
 */

/**
 * Extracts memo from a transaction signature by fetching transaction details
 * @param signature - Transaction signature
 * @param connection - Solana connection
 * @returns Promise<string | null> - The memo text or null if not found
 */
export const extractMemoFromTransaction = async (
  signature: string,
  connection: Connection,
): Promise<string | null> => {
  try {
    // Get transaction details
    const transaction = await connection.getTransaction(signature, {
      commitment: 'confirmed',
      maxSupportedTransactionVersion: 0,
    })

    if (!transaction) {
      console.warn('Transaction not found:', signature)
      return null
    }

    // Look for memo program instructions
    const { MEMO_PROGRAM_ID } = useSolanaMemo()
    const memoInstructions = transaction.transaction.message.compiledInstructions.filter(
      (instruction, _index) => {
        const programId = transaction.transaction.message.staticAccountKeys[instruction.programIdIndex]
        return programId.equals(MEMO_PROGRAM_ID)
      },
    )

    if (memoInstructions.length === 0) {
      return null
    }

    // Decode the first memo instruction
    const memoInstruction = memoInstructions[0]
    const memoData = Buffer.from(memoInstruction.data)
    const decoder = new TextDecoder('utf-8', { fatal: false })
    return decoder.decode(memoData)
  }
  catch (error) {
    console.error('Failed to extract memo from transaction:', error)
    return null
  }
}

/**
 * Verifies if a transaction contains a memo instruction
 * @param transaction - The versioned transaction to check
 * @returns boolean - True if transaction contains memo instruction
 */
export const transactionContainsMemo = (transaction: VersionedTransaction): boolean => {
  try {
    const { MEMO_PROGRAM_ID } = useSolanaMemo()

    // Check if any instruction uses the memo program
    const message = transaction.message
    const accountKeys = message.staticAccountKeys

    for (const instruction of message.compiledInstructions) {
      const programId = accountKeys[instruction.programIdIndex]
      if (programId.equals(MEMO_PROGRAM_ID)) {
        return true
      }
    }

    return false
  }
  catch (error) {
    console.error('Failed to check transaction for memo:', error)
    return false
  }
}

/**
 * Logs transaction details for debugging memo submission
 * @param transaction - The transaction to analyze
 * @param memo - The expected memo text
 */
export const logTransactionMemoDetails = (transaction: VersionedTransaction, memo?: string) => {
  try {
    const hasMemo = transactionContainsMemo(transaction)
    const instructionCount = transaction.message.compiledInstructions.length

    console.log('Transaction Memo Analysis:', {
      hasMemo,
      expectedMemo: memo,
      instructionCount,
      accountKeysCount: transaction.message.staticAccountKeys.length,
      addressTableLookupsCount: transaction.message.addressTableLookups?.length || 0,
    })

    // Log all program IDs used in the transaction
    const programIds = transaction.message.compiledInstructions.map((instruction) => {
      const programId = transaction.message.staticAccountKeys[instruction.programIdIndex]
      return programId.toString()
    })

    console.log('Programs used in transaction:', programIds)

    const { MEMO_PROGRAM_ID } = useSolanaMemo()
    console.log('Memo program ID:', MEMO_PROGRAM_ID.toString())
    console.log('Memo program included:', programIds.includes(MEMO_PROGRAM_ID.toString()))
  }
  catch (error) {
    console.error('Failed to analyze transaction memo details:', error)
  }
}

/**
 * Creates a simple memo verification URL for Solana Explorer
 * @param signature - Transaction signature
 * @returns string - URL to view transaction on Solana Explorer
 */
export const createMemoVerificationUrl = (signature: string): string => {
  return `https://explorer.solana.com/tx/${signature}?cluster=mainnet-beta`
}

/**
 * Main composable for memo verification
 */
export const useMemoVerification = () => {
  return {
    extractMemoFromTransaction,
    transactionContainsMemo,
    logTransactionMemoDetails,
    createMemoVerificationUrl,
  }
}
