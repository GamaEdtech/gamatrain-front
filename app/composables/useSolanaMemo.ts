/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */

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
  isClientSide?: boolean
}

/**
 * Creates a Solana memo program instruction (async version)
 */
export const createMemoInstructionAsync = async (
  memo: string,
  signerPublicKey: PublicKey,
): Promise<MemoInstructionResult> => {
  try {
    // Check if we're running on the client side
    if (!import.meta.client) {
      return {
        success: false,
        error: MemoInstructionError.INSTRUCTION_CREATION_FAILED,
        errorMessage: 'Memo instructions can only be created on the client side',
        isClientSide: false,
      }
    }

    // Validate inputs
    if (!memo || typeof memo !== 'string') {
      return {
        success: false,
        error: MemoInstructionError.INVALID_MEMO,
        errorMessage: 'Memo must be a non-empty string',
        isClientSide: true,
      }
    }

    // Avoid runtime dependency on PublicKey instanceof; accept objects with toString
    if (!signerPublicKey || typeof (signerPublicKey as any).toString !== 'function') {
      return {
        success: false,
        error: MemoInstructionError.INVALID_SIGNER,
        errorMessage: 'Signer public key must be a valid PublicKey-like object',
        isClientSide: true,
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

    // Dynamically import Solana web3.js on client side
    const { TransactionInstruction, PublicKey } = await import('@solana/web3.js')

    const instruction = new TransactionInstruction({
      keys,
      programId: new PublicKey(MEMO_PROGRAM_ID),
      data: Buffer.from(memoData),
    })

    logMemoInstructionSuccess('creation', { memo: memo.substring(0, 20) + '...', signerKey: signerPublicKey.toString().substring(0, 8) + '...' })

    return {
      success: true,
      instruction,
      isClientSide: true,
    }
  }
  catch (error) {
    logMemoInstructionError('creation', error, { memo: memo.substring(0, 20) + '...', signerKey: signerPublicKey?.toString?.()?.substring(0, 8) + '...' })

    return {
      success: false,
      error: MemoInstructionError.INSTRUCTION_CREATION_FAILED,
      errorMessage: error instanceof Error ? error.message : 'Failed to create memo instruction',
      isClientSide: import.meta.client,
    }
  }
}

/**
 * Creates a Solana memo program instruction (legacy sync version - deprecated)
 * @deprecated Use createMemoInstructionAsync instead for better SSR compatibility
 */
export const createMemoInstruction = (
  memo: string,
  signerPublicKey: PublicKey,
): MemoInstructionResult => {
  // Check if we're running on the client side
  if (!import.meta.client) {
    return {
      success: false,
      error: MemoInstructionError.INSTRUCTION_CREATION_FAILED,
      errorMessage: 'Memo instructions can only be created on the client side. Use createMemoInstructionAsync instead.',
      isClientSide: false,
    }
  }

  try {
    // Validate inputs
    if (!memo || typeof memo !== 'string') {
      return {
        success: false,
        error: MemoInstructionError.INVALID_MEMO,
        errorMessage: 'Memo must be a non-empty string',
        isClientSide: true,
      }
    }

    // Avoid runtime dependency on PublicKey instanceof; accept objects with toString
    if (!signerPublicKey || typeof (signerPublicKey as any).toString !== 'function') {
      return {
        success: false,
        error: MemoInstructionError.INVALID_SIGNER,
        errorMessage: 'Signer public key must be a valid PublicKey-like object',
        isClientSide: true,
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

    // Try to use require as fallback for sync operation (may fail in some environments)
    try {
      const mod = require('@solana/web3.js') as typeof import('@solana/web3.js')
      const instruction = new mod.TransactionInstruction({
        keys,
        programId: new mod.PublicKey(MEMO_PROGRAM_ID),
        data: Buffer.from(memoData),
      })
      return {
        success: true,
        instruction,
        isClientSide: true,
      }
    }
    catch {
      // Fallback: cannot require in this environment
      throw new Error('Synchronous memo instruction creation failed. Use createMemoInstructionAsync instead.')
    }
  }
  catch (error) {
    return {
      success: false,
      error: MemoInstructionError.INSTRUCTION_CREATION_FAILED,
      errorMessage: error instanceof Error ? error.message : 'Failed to create memo instruction',
      isClientSide: true,
    }
  }
}

/**
 * Creates a memo instruction with validation (async version)
 */
export const createValidatedMemoInstructionAsync = async (
  memo: string,
  signerPublicKey: PublicKey,
): Promise<MemoInstructionResult> => {
  // Check if we're running on the client side
  if (!import.meta.client) {
    return {
      success: false,
      error: MemoInstructionError.INSTRUCTION_CREATION_FAILED,
      errorMessage: 'Memo instructions can only be created on the client side',
      isClientSide: false,
    }
  }

  const { validateMemo } = useMemoValidation()
  const validation = validateMemo(memo)
  if (!validation.isValid) {
    return {
      success: false,
      error: MemoInstructionError.INVALID_MEMO,
      errorMessage: validation.errorMessage || 'Invalid memo format',
      isClientSide: true,
    }
  }
  return await createMemoInstructionAsync(memo, signerPublicKey)
}

/**
 * Creates a memo instruction with validation (legacy sync version - deprecated)
 * @deprecated Use createValidatedMemoInstructionAsync instead for better SSR compatibility
 */
export const createValidatedMemoInstruction = (
  memo: string,
  signerPublicKey: PublicKey,
): MemoInstructionResult => {
  // Check if we're running on the client side
  if (!import.meta.client) {
    return {
      success: false,
      error: MemoInstructionError.INSTRUCTION_CREATION_FAILED,
      errorMessage: 'Memo instructions can only be created on the client side. Use createValidatedMemoInstructionAsync instead.',
      isClientSide: false,
    }
  }

  const { validateMemo } = useMemoValidation()
  const validation = validateMemo(memo)
  if (!validation.isValid) {
    return {
      success: false,
      error: MemoInstructionError.INVALID_MEMO,
      errorMessage: validation.errorMessage || 'Invalid memo format',
      isClientSide: true,
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
 * Creates multiple memo instructions for batch operations (async version)
 */
export const createMultipleMemoInstructionsAsync = async (
  memos: string[],
  signerPublicKey: PublicKey,
): Promise<MemoInstructionResult[]> => {
  // Check if we're running on the client side
  if (!import.meta.client) {
    return memos.map(() => ({
      success: false,
      error: MemoInstructionError.INSTRUCTION_CREATION_FAILED,
      errorMessage: 'Memo instructions can only be created on the client side',
      isClientSide: false,
    }))
  }

  const results = await Promise.all(
    memos.map(memo => createValidatedMemoInstructionAsync(memo, signerPublicKey)),
  )
  return results
}

/**
 * Creates multiple memo instructions for batch operations (legacy sync version - deprecated)
 * @deprecated Use createMultipleMemoInstructionsAsync instead for better SSR compatibility
 */
export const createMultipleMemoInstructions = (
  memos: string[],
  signerPublicKey: PublicKey,
): MemoInstructionResult[] => {
  // Check if we're running on the client side
  if (!import.meta.client) {
    return memos.map(() => ({
      success: false,
      error: MemoInstructionError.INSTRUCTION_CREATION_FAILED,
      errorMessage: 'Memo instructions can only be created on the client side. Use createMultipleMemoInstructionsAsync instead.',
      isClientSide: false,
    }))
  }

  return memos.map(memo => createValidatedMemoInstruction(memo, signerPublicKey))
}

/**
 * Formats memo instruction error for user display
 */
export const formatMemoInstructionError = (result: MemoInstructionResult): string => {
  if (result.success) return ''

  // Add environment context to error messages
  const envContext = result.isClientSide === false ? ' (Server-side environment detected)' : ''

  switch (result.error) {
    case MemoInstructionError.INVALID_MEMO:
      return `Invalid memo format. Please check your memo text.${envContext}`
    case MemoInstructionError.INVALID_SIGNER:
      return `Invalid wallet connection. Please reconnect your wallet.${envContext}`
    case MemoInstructionError.INSTRUCTION_CREATION_FAILED:
      if (!result.isClientSide) {
        return 'Memo instructions require client-side execution. Please ensure you are running in a browser environment.'
      }
      return `Failed to create memo instruction. Please try again.${envContext}`
    default:
      return result.errorMessage || `Unknown error occurred while creating memo instruction.${envContext}`
  }
}

/**
 * Enhanced error logging for memo instruction operations
 */
export const logMemoInstructionError = (operation: string, error: any, context?: any) => {
  const errorInfo = {
    operation,
    error: error instanceof Error ? error.message : String(error),
    isClient: import.meta.client,
    timestamp: new Date().toISOString(),
    context,
  }

  console.error(`❌ Memo instruction ${operation} failed:`, errorInfo)

  // Additional debugging information
  if (!import.meta.client) {
    console.warn('⚠️ Memo instruction operation attempted on server-side. Use client-side execution instead.')
  }
}

/**
 * Enhanced success logging for memo instruction operations
 */
export const logMemoInstructionSuccess = (operation: string, details?: any) => {
  const successInfo = {
    operation,
    isClient: import.meta.client,
    timestamp: new Date().toISOString(),
    details,
  }

  console.log(`✅ Memo instruction ${operation} successful:`, successInfo)
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
  // Only validate on client side
  if (!import.meta.client) {
    return false
  }
  return !!publicKey && typeof (publicKey as any).toString === 'function'
}

/**
 * Checks if the current environment supports memo instruction creation
 */
export const canCreateMemoInstructions = (): boolean => {
  return import.meta.client
}

/**
 * Gets environment information for debugging
 */
export const getMemoEnvironmentInfo = () => {
  return {
    isClient: import.meta.client,
    canCreateInstructions: canCreateMemoInstructions(),
    programId: MEMO_PROGRAM_ID,
    timestamp: new Date().toISOString(),
  }
}

export const useSolanaMemo = () => {
  return {
    // Async functions (recommended)
    createMemoInstructionAsync,
    createValidatedMemoInstructionAsync,
    createCustomMemoInstructionAsync,
    createMultipleMemoInstructionsAsync,
    // Legacy sync functions (deprecated)
    createMemoInstruction,
    createValidatedMemoInstruction,
    createCustomMemoInstruction,
    createMultipleMemoInstructions,
    // Utility functions
    extractMemoFromInstruction,
    isMemoInstruction,
    formatMemoInstructionError,
    getMemoProgramInfo,
    isValidMemoSigner,
    canCreateMemoInstructions,
    getMemoEnvironmentInfo,
    // Logging functions
    logMemoInstructionError,
    logMemoInstructionSuccess,
    // Constants
    MEMO_PROGRAM_ID,
    MemoInstructionError,
  }
}

/**
 * Creates a memo instruction with custom account configuration (async version)
 */
export const createCustomMemoInstructionAsync = async (
  memo: string,
  accounts: AccountMeta[],
): Promise<MemoInstructionResult> => {
  try {
    // Check if we're running on the client side
    if (!import.meta.client) {
      return {
        success: false,
        error: MemoInstructionError.INSTRUCTION_CREATION_FAILED,
        errorMessage: 'Memo instructions can only be created on the client side',
        isClientSide: false,
      }
    }

    if (!memo || typeof memo !== 'string') {
      return {
        success: false,
        error: MemoInstructionError.INVALID_MEMO,
        errorMessage: 'Memo must be a non-empty string',
        isClientSide: true,
      }
    }

    if (!accounts || accounts.length === 0) {
      return {
        success: false,
        error: MemoInstructionError.INVALID_SIGNER,
        errorMessage: 'At least one account must be provided',
        isClientSide: true,
      }
    }

    const encoder = new TextEncoder()
    const memoData = encoder.encode(memo)

    // Dynamically import Solana web3.js on client side
    const { TransactionInstruction, PublicKey } = await import('@solana/web3.js')

    const instruction = new TransactionInstruction({
      keys: accounts,
      programId: new PublicKey(MEMO_PROGRAM_ID),
      data: Buffer.from(memoData),
    })

    return {
      success: true,
      instruction,
      isClientSide: true,
    }
  }
  catch (error) {
    return {
      success: false,
      error: MemoInstructionError.INSTRUCTION_CREATION_FAILED,
      errorMessage: error instanceof Error ? error.message : 'Failed to create custom memo instruction',
      isClientSide: import.meta.client,
    }
  }
}

/**
 * Creates a memo instruction with custom account configuration (legacy sync version - deprecated)
 * @deprecated Use createCustomMemoInstructionAsync instead for better SSR compatibility
 */
export const createCustomMemoInstruction = (
  memo: string,
  accounts: AccountMeta[],
): MemoInstructionResult => {
  try {
    // Check if we're running on the client side
    if (!import.meta.client) {
      return {
        success: false,
        error: MemoInstructionError.INSTRUCTION_CREATION_FAILED,
        errorMessage: 'Memo instructions can only be created on the client side. Use createCustomMemoInstructionAsync instead.',
        isClientSide: false,
      }
    }

    if (!memo || typeof memo !== 'string') {
      return {
        success: false,
        error: MemoInstructionError.INVALID_MEMO,
        errorMessage: 'Memo must be a non-empty string',
        isClientSide: true,
      }
    }

    if (!accounts || accounts.length === 0) {
      return {
        success: false,
        error: MemoInstructionError.INVALID_SIGNER,
        errorMessage: 'At least one account must be provided',
        isClientSide: true,
      }
    }

    const encoder = new TextEncoder()
    const memoData = encoder.encode(memo)

    // Try to use require as fallback for sync operation (may fail in some environments)
    try {
      const mod = require('@solana/web3.js') as typeof import('@solana/web3.js')
      const instruction = new mod.TransactionInstruction({
        keys: accounts,
        programId: new mod.PublicKey(MEMO_PROGRAM_ID),
        data: Buffer.from(memoData),
      })

      return {
        success: true,
        instruction,
        isClientSide: true,
      }
    }
    catch {
      throw new Error('Synchronous custom memo instruction creation failed. Use createCustomMemoInstructionAsync instead.')
    }
  }
  catch (error) {
    return {
      success: false,
      error: MemoInstructionError.INSTRUCTION_CREATION_FAILED,
      errorMessage: error instanceof Error ? error.message : 'Failed to create custom memo instruction',
      isClientSide: true,
    }
  }
}
