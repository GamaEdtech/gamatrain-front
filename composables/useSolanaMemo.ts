/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { PublicKey, TransactionInstruction, AccountMeta } from '@solana/web3.js'
import { Buffer } from 'buffer'

// SPL Memo Program ID - official Solana memo program (string form to avoid runtime import on SSR)
export const MEMO_PROGRAM_ID = 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'

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

    // Avoid runtime dependency on PublicKey instanceof; accept objects with toString
    if (!signerPublicKey || typeof (signerPublicKey as any).toString !== 'function') {
      return {
        success: false,
        error: MemoInstructionError.INVALID_SIGNER,
        errorMessage: 'Signer public key must be a valid PublicKey-like object',
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

    // Create the memo instruction (lazy import to keep SSR safe)
    const createInstruction = (): Promise<TransactionInstruction> =>
      import('@solana/web3.js').then(({ TransactionInstruction, PublicKey }) => new TransactionInstruction({
        keys,
        programId: new PublicKey(MEMO_PROGRAM_ID),
        data: Buffer.from(memoData),
      }))

    // Although this function is sync by type, we can throw on sync path if needed.
    // To keep sync signature, use deopt: build instruction via de-sugared promise (unsafe to await here).
    // Consumers of this function use returned "instruction" synchronously, so we must block. Instead, we
    // use a synchronous require fallback if available, else throw a helpful error.
    try {
      // Try sync require (bundlers replace this on client)

      const mod = require('@solana/web3.js') as typeof import('@solana/web3.js')
      const instruction = new mod.TransactionInstruction({
        keys,
        programId: new mod.PublicKey(MEMO_PROGRAM_ID),
        data: Buffer.from(memoData),
      })
      return { success: true, instruction }
    }
    catch {
      // Fallback: cannot require in this environment
      throw new Error('Memo instruction needs client/runtime web3.js. Ensure this runs on client.')
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
 */
export const createValidatedMemoInstruction = (
  memo: string,
  signerPublicKey: PublicKey,
): MemoInstructionResult => {
  const { validateMemo } = useMemoValidation()
  const validation = validateMemo(memo)
  if (!validation.isValid) {
    return {
      success: false,
      error: MemoInstructionError.INVALID_MEMO,
      errorMessage: validation.errorMessage || 'Invalid memo format',
    }
  }
  return createMemoInstruction(memo, signerPublicKey)
}

/**
 * Extracts memo data from a memo instruction
 */
export const extractMemoFromInstruction = (instruction: TransactionInstruction): string | null => {
  try {
    // Compare programId via string to avoid constructing PublicKey at module scope
    // @ts-expect-error programId is PublicKey at runtime
    if (instruction.programId?.toString?.() !== MEMO_PROGRAM_ID) {
      return null
    }
    const decoder = new TextDecoder('utf-8', { fatal: false })
    return decoder.decode(instruction.data)
  }
  catch {
    return null
  }
}

/**
 * Checks if a transaction instruction is a memo instruction
 */
export const isMemoInstruction = (instruction: TransactionInstruction): boolean => {
  // @ts-expect-error programId is PublicKey at runtime
  return instruction.programId?.toString?.() === MEMO_PROGRAM_ID
}

/**
 * Creates multiple memo instructions for batch operations
 */
export const createMultipleMemoInstructions = (
  memos: string[],
  signerPublicKey: PublicKey,
): MemoInstructionResult[] => {
  return memos.map(memo => createValidatedMemoInstruction(memo, signerPublicKey))
}

/**
 * Formats memo instruction error for user display
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

/** Info helpers */
export const getMemoProgramInfo = () => ({
  programId: MEMO_PROGRAM_ID,
  programName: 'SPL Memo Program',
  description: 'Official Solana program for adding memo data to transactions',
  maxMemoLength: 566,
  encoding: 'UTF-8',
})

export const isValidMemoSigner = (publicKey: unknown): publicKey is PublicKey => {
  return !!publicKey && typeof (publicKey as any).toString === 'function'
}

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

    // lazy import

    const mod = require('@solana/web3.js') as typeof import('@solana/web3.js')
    const instruction = new mod.TransactionInstruction({
      keys: accounts,
      programId: new mod.PublicKey(MEMO_PROGRAM_ID),
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
