// Comprehensive error handling for memo functionality

// Memo-specific error types
export enum MemoSwapError {
  MEMO_VALIDATION_FAILED = 'MEMO_VALIDATION_FAILED',
  MEMO_INSTRUCTION_FAILED = 'MEMO_INSTRUCTION_FAILED',
  MEMO_TRANSACTION_BUILD_FAILED = 'MEMO_TRANSACTION_BUILD_FAILED',
  MEMO_TRANSACTION_EXECUTION_FAILED = 'MEMO_TRANSACTION_EXECUTION_FAILED',
  MEMO_PROGRAM_UNAVAILABLE = 'MEMO_PROGRAM_UNAVAILABLE',
  SWAP_WITH_MEMO_FAILED = 'SWAP_WITH_MEMO_FAILED',
}

// Error result interface
export interface MemoErrorResult {
  type: MemoSwapError
  message: string
  originalError?: Error
  canFallback: boolean
  userMessage: string
}

/**
 * Creates a standardized memo error result
 * @param type - The type of memo error
 * @param message - Technical error message
 * @param originalError - Original error object if available
 * @param canFallback - Whether the operation can fallback to non-memo swap
 * @returns MemoErrorResult object
 */
export const createMemoError = (
  type: MemoSwapError,
  message: string,
  originalError?: Error,
  canFallback: boolean = true,
): MemoErrorResult => {
  return {
    type,
    message,
    originalError,
    canFallback,
    userMessage: getUserFriendlyMemoError(type, message),
  }
}

/**
 * Converts technical memo errors to user-friendly messages
 * @param type - The memo error type
 * @param technicalMessage - Technical error message
 * @returns User-friendly error message
 */
export const getUserFriendlyMemoError = (
  type: MemoSwapError,
  _technicalMessage: string,
): string => {
  switch (type) {
    case MemoSwapError.MEMO_VALIDATION_FAILED:
      return 'Your memo/tag format is invalid. Please check the length and characters used.'

    case MemoSwapError.MEMO_INSTRUCTION_FAILED:
      return 'Failed to create memo instruction. Please try again or proceed without memo.'

    case MemoSwapError.MEMO_TRANSACTION_BUILD_FAILED:
      return 'Failed to build transaction with memo. Trying without memo...'

    case MemoSwapError.MEMO_TRANSACTION_EXECUTION_FAILED:
      return 'Transaction with memo failed to execute. Please try again.'

    case MemoSwapError.MEMO_PROGRAM_UNAVAILABLE:
      return 'Memo program is currently unavailable. Proceeding without memo.'

    case MemoSwapError.SWAP_WITH_MEMO_FAILED:
      return 'Swap with memo failed. You can try again or proceed without memo.'

    default:
      return 'An error occurred with memo functionality. Please try again.'
  }
}

/**
 * Handles memo-related errors with fallback logic
 * @param error - The error to handle
 * @param context - Additional context about where the error occurred
 * @returns MemoErrorResult with handling recommendations
 */
export const handleMemoError = (
  error: unknown,
  context: string,
): MemoErrorResult => {
  const errorMessage = error instanceof Error ? error.message : String(error)

  // Determine error type based on error message and context
  let errorType: MemoSwapError
  let canFallback = true

  if (context.includes('validation')) {
    errorType = MemoSwapError.MEMO_VALIDATION_FAILED
    canFallback = false // Validation errors should be fixed, not bypassed
  }
  else if (context.includes('instruction')) {
    errorType = MemoSwapError.MEMO_INSTRUCTION_FAILED
  }
  else if (context.includes('build') || context.includes('transaction')) {
    errorType = MemoSwapError.MEMO_TRANSACTION_BUILD_FAILED
  }
  else if (context.includes('execution') || context.includes('submit')) {
    errorType = MemoSwapError.MEMO_TRANSACTION_EXECUTION_FAILED
  }
  else if (errorMessage.includes('program') || errorMessage.includes('unavailable')) {
    errorType = MemoSwapError.MEMO_PROGRAM_UNAVAILABLE
  }
  else {
    errorType = MemoSwapError.SWAP_WITH_MEMO_FAILED
  }

  return createMemoError(
    errorType,
    errorMessage,
    error instanceof Error ? error : undefined,
    canFallback,
  )
}

/**
 * Attempts to execute a memo operation with fallback to non-memo version
 * @param memoOperation - Function that performs the memo operation
 * @param fallbackOperation - Function that performs the fallback operation
 * @param context - Context description for error handling
 * @returns Result of memo operation or fallback operation
 */
export const executeWithMemoFallback = async <T>(
  memoOperation: () => Promise<T>,
  fallbackOperation: () => Promise<T>,
  context: string,
): Promise<{ result: T, usedFallback: boolean, error?: MemoErrorResult }> => {
  try {
    const result = await memoOperation()
    return { result, usedFallback: false }
  }
  catch (error) {
    const memoError = handleMemoError(error, context)

    if (memoError.canFallback) {
      console.warn(`Memo operation failed in ${context}, falling back to standard operation:`, memoError.message)

      try {
        const fallbackResult = await fallbackOperation()
        return {
          result: fallbackResult,
          usedFallback: true,
          error: memoError,
        }
      }
      catch {
        // If fallback also fails, throw the original memo error
        throw error
      }
    }
    else {
      // If fallback is not allowed, throw the memo error
      throw error
    }
  }
}

/**
 * Validates memo before proceeding with swap operations
 * @param memo - The memo to validate
 * @returns Validation result with error details if invalid
 */
export const validateMemoForSwap = (memo: string): { isValid: boolean, error?: MemoErrorResult } => {
  if (!memo || memo.trim().length === 0) {
    return { isValid: true } // Empty memo is valid
  }

  try {
    const { validateMemo } = useMemoValidation()
    const validation = validateMemo(memo)

    if (!validation.isValid) {
      return {
        isValid: false,
        error: createMemoError(
          MemoSwapError.MEMO_VALIDATION_FAILED,
          validation.errorMessage || 'Memo validation failed',
          undefined,
          false, // Validation errors should not fallback
        ),
      }
    }

    return { isValid: true }
  }
  catch (error) {
    return {
      isValid: false,
      error: handleMemoError(error, 'memo validation'),
    }
  }
}

/**
 * Logs memo-related errors for debugging and monitoring
 * @param error - The memo error to log
 * @param additionalContext - Additional context for logging
 */
export const logMemoError = (error: MemoErrorResult, additionalContext?: Record<string, unknown>) => {
  console.error('Memo Error:', {
    type: error.type,
    message: error.message,
    userMessage: error.userMessage,
    canFallback: error.canFallback,
    originalError: error.originalError,
    context: additionalContext,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Determines if an error is memo-related
 * @param error - The error to check
 * @returns True if the error is memo-related
 */
export const isMemoRelatedError = (error: unknown): boolean => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    return message.includes('memo')
      || message.includes('memosq4gqabaxkb96qnh8tysnc') // Memo program ID
      || (message.includes('instruction') && message.includes('memo'))
  }
  return false
}

/**
 * Creates a user notification for memo errors
 * @param error - The memo error
 * @param showFallbackOption - Whether to show fallback option to user
 * @returns Notification object
 */
/**
 * Main composable function for memo error handling
 */
export const useMemoErrorHandling = () => {
  return {
    createMemoError,
    getUserFriendlyMemoError,
    handleMemoError,
    executeWithMemoFallback,
    validateMemoForSwap,
    logMemoError,
    isMemoRelatedError,
    createMemoErrorNotification,
    MemoSwapError,
  }
}

export const createMemoErrorNotification = (
  error: MemoErrorResult,
  showFallbackOption: boolean = true,
) => {
  return {
    type: 'error' as const,
    title: 'Memo Error',
    message: error.userMessage,
    actions: showFallbackOption && error.canFallback
      ? [
          {
            label: 'Try without memo',
            action: 'fallback',
          },
          {
            label: 'Retry with memo',
            action: 'retry',
          },
        ]
      : [
          {
            label: 'OK',
            action: 'dismiss',
          },
        ],
    duration: 8000,
  }
}
