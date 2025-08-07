import { PublicKey, TransactionInstruction, type AccountMeta } from '@solana/web3.js'
import { Buffer } from 'buffer'

// SPL Memo Program ID - official Solana memo program
export const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr')

// Memo instruction error types
export enum MemoInstructionError {
  INVALID_MEMO = 'INVALID_MEMO',
  INVALID_SIGNER = 'INVALID_SIGNER',
  INSTRUCTION_CREATION_FAILED = 'INSTRUCTION_CREATION_FAILED',
}

// Memo instruction result interface
export interface MemoInstructionResult {
  success: boolean
  instruction?: TransactionInstruction
  error?: MemoInstructionError
  errorMessage?: string
}

/**
 * Creates a Solana memo program instruction
 * @param memo - The memo text to include in the transaction
 * @param signerPublicKey - The public key of the transaction signer
 * @returns MemoInstructionResult with the created instruction or error details
 */
export const createMemoInstruction = (
  memo: string,
  signerPublicKey: PublicKey,
): MemoInstructionResult => {
  try {
    // Validate inputs
    if (!memo || typeof memo !== 'string') {
      return {
        success: false,
        error: MemoInstructionError.INVALID_MEMO,
        errorMessage: 'Memo must be a non-empty string',
      }
    }

    if (!signerPublicKey || !(signerPublicKey instanceof PublicKey)) {
      return {
        success: false,
        error: MemoInstructionError.INVALID_SIGNER,
        errorMessage: 'Signer public key must be a valid PublicKey instance',
      }
    }

    // Encode memo as UTF-8 bytes
    const encoder = new TextEncoder()
    const memoData = encoder.encode(memo)

    // Create account meta for the signer (required by memo program)
    const keys: AccountMeta[] = [
      {
        pubkey: signerPublicKey,
        isSigner: true,
        isWritable: false,
      },
    ]

    // Create the memo instruction
    const instruction = new TransactionInstruction({
      keys,
      programId: MEMO_PROGRAM_ID,
      data: Buffer.from(memoData),
    })

    return {
      success: true,
      instruction,
    }
  }
  catch (error) {
    return {
      success: false,
      error: MemoInstructionError.INSTRUCTION_CREATION_FAILED,
      errorMessage: error instanceof Error ? error.message : 'Failed to create memo instruction',
    }
  }
}

/**
 * Creates a memo instruction with validation
 * Combines memo validation with instruction creation
 * @param memo - The memo text to validate and include
 * @param signerPublicKey - The public key of the transaction signer
 * @returns MemoInstructionResult with validation and instruction creation results
 */
export const createValidatedMemoInstruction = (
  memo: string,
  signerPublicKey: PublicKey,
): MemoInstructionResult => {
  // Import validation function
  const { validateMemo } = useMemoValidation()

  // First validate the memo
  const validation = validateMemo(memo)
  if (!validation.isValid) {
    return {
      success: false,
      error: MemoInstructionError.INVALID_MEMO,
      errorMessage: validation.errorMessage || 'Invalid memo format',
    }
  }

  // Create the instruction if validation passes
  return createMemoInstruction(memo, signerPublicKey)
}

/**
 * Extracts memo data from a memo instruction
 * @param instruction - The transaction instruction to extract memo from
 * @returns The memo text or null if not a valid memo instruction
 */
export const extractMemoFromInstruction = (instruction: TransactionInstruction): string | null => {
  try {
    // Verify this is a memo program instruction
    if (!instruction.programId.equals(MEMO_PROGRAM_ID)) {
      return null
    }

    // Decode the memo data
    const decoder = new TextDecoder('utf-8', { fatal: false })
    return decoder.decode(instruction.data)
  }
  catch {
    return null
  }
}

/**
 * Checks if a transaction instruction is a memo instruction
 * @param instruction - The instruction to check
 * @returns True if the instruction is a memo instruction
 */
export const isMemoInstruction = (instruction: TransactionInstruction): boolean => {
  return instruction.programId.equals(MEMO_PROGRAM_ID)
}

/**
 * Creates multiple memo instructions for batch operations
 * @param memos - Array of memo texts
 * @param signerPublicKey - The public key of the transaction signer
 * @returns Array of MemoInstructionResult objects
 */
export const createMultipleMemoInstructions = (
  memos: string[],
  signerPublicKey: PublicKey,
): MemoInstructionResult[] => {
  return memos.map(memo => createValidatedMemoInstruction(memo, signerPublicKey))
}

/**
 * Formats memo instruction error for user display
 * @param result - The memo instruction result
 * @returns User-friendly error message
 */
export const formatMemoInstructionError = (result: MemoInstructionResult): string => {
  if (result.success) return ''

  switch (result.error) {
    case MemoInstructionError.INVALID_MEMO:
      return 'Invalid memo format. Please check your memo text.'
    case MemoInstructionError.INVALID_SIGNER:
      return 'Invalid wallet connection. Please reconnect your wallet.'
    case MemoInstructionError.INSTRUCTION_CREATION_FAILED:
      return 'Failed to create memo instruction. Please try again.'
    default:
      return result.errorMessage || 'Unknown error occurred while creating memo instruction.'
  }
}

/**
 * Utility function to get memo program information
 * @returns Object with memo program details
 */
export const getMemoProgramInfo = () => {
  return {
    programId: MEMO_PROGRAM_ID.toString(),
    programName: 'SPL Memo Program',
    description: 'Official Solana program for adding memo data to transactions',
    maxMemoLength: 566, // bytes
    encoding: 'UTF-8',
  }
}

/**
 * Validates that a public key can be used as a memo signer
 * @param publicKey - The public key to validate
 * @returns True if valid, false otherwise
 */
export const isValidMemoSigner = (publicKey: unknown): publicKey is PublicKey => {
  return publicKey instanceof PublicKey && publicKey.toString() !== PublicKey.default.toString()
}

/**
 * Creates a memo instruction with custom account configuration
 * Advanced usage for specific memo program requirements
 * @param memo - The memo text
 * @param accounts - Custom account meta array
 * @returns MemoInstructionResult
 */
/**
 * Main composable function for Solana memo functionality
 */
export const useSolanaMemo = () => {
  return {
    createMemoInstruction,
    createValidatedMemoInstruction,
    extractMemoFromInstruction,
    isMemoInstruction,
    createMultipleMemoInstructions,
    formatMemoInstructionError,
    getMemoProgramInfo,
    isValidMemoSigner,
    createCustomMemoInstruction,
    MEMO_PROGRAM_ID,
    MemoInstructionError,
  }
}

export const createCustomMemoInstruction = (
  memo: string,
  accounts: AccountMeta[],
): MemoInstructionResult => {
  try {
    if (!memo || typeof memo !== 'string') {
      return {
        success: false,
        error: MemoInstructionError.INVALID_MEMO,
        errorMessage: 'Memo must be a non-empty string',
      }
    }

    if (!accounts || accounts.length === 0) {
      return {
        success: false,
        error: MemoInstructionError.INVALID_SIGNER,
        errorMessage: 'At least one account must be provided',
      }
    }

    const encoder = new TextEncoder()
    const memoData = encoder.encode(memo)

    const instruction = new TransactionInstruction({
      keys: accounts,
      programId: MEMO_PROGRAM_ID,
      data: Buffer.from(memoData),
    })

    return {
      success: true,
      instruction,
    }
  }
  catch (error) {
    return {
      success: false,
      error: MemoInstructionError.INSTRUCTION_CREATION_FAILED,
      errorMessage: error instanceof Error ? error.message : 'Failed to create custom memo instruction',
    }
  }
}
