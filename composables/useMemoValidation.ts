// Memo validation utilities for Solana memo program integration
// Maximum memo length supported by Solana memo program (566 bytes)
export const MEMO_MAX_BYTES = 566

// Memo validation error types
export enum MemoValidationError {
  MEMO_TOO_LONG = 'MEMO_TOO_LONG',
  MEMO_INVALID_ENCODING = 'MEMO_INVALID_ENCODING',
  MEMO_EMPTY = 'MEMO_EMPTY',
}

// Memo validation result interface
export interface MemoValidationResult {
  isValid: boolean
  error?: MemoValidationError
  errorMessage?: string
  byteLength?: number
}

// Memo configuration interface
export interface MemoConfig {
  text: string
  maxLength: number
  encoding: 'utf-8'
}

/**
 * Validates a memo string for Solana memo program compatibility
 * @param memo - The memo string to validate
 * @returns MemoValidationResult with validation status and details
 */
export const validateMemo = (memo: string): MemoValidationResult => {
  // Handle empty memo (valid case)
  if (!memo || memo.trim().length === 0) {
    return {
      isValid: true,
      byteLength: 0,
    }
  }

  try {
    // Check UTF-8 encoding by attempting to encode
    const encoder = new TextEncoder()
    const encodedBytes = encoder.encode(memo)
    const byteLength = encodedBytes.length

    // Check if memo exceeds maximum byte length
    if (byteLength > MEMO_MAX_BYTES) {
      return {
        isValid: false,
        error: MemoValidationError.MEMO_TOO_LONG,
        errorMessage: `Memo exceeds maximum length of ${MEMO_MAX_BYTES} bytes (current: ${byteLength} bytes)`,
        byteLength,
      }
    }

    // Verify the encoded bytes can be decoded back to the original string
    const decoder = new TextDecoder('utf-8', { fatal: true })
    const decodedString = decoder.decode(encodedBytes)

    if (decodedString !== memo) {
      return {
        isValid: false,
        error: MemoValidationError.MEMO_INVALID_ENCODING,
        errorMessage: 'Memo contains invalid UTF-8 characters',
        byteLength,
      }
    }

    return {
      isValid: true,
      byteLength,
    }
  }
  catch {
    return {
      isValid: false,
      error: MemoValidationError.MEMO_INVALID_ENCODING,
      errorMessage: 'Memo contains invalid UTF-8 characters',
    }
  }
}

/**
 * Gets the byte length of a memo string in UTF-8 encoding
 * @param memo - The memo string
 * @returns The byte length of the memo
 */
export const getMemoByteLength = (memo: string): number => {
  if (!memo) return 0
  const encoder = new TextEncoder()
  return encoder.encode(memo).length
}

/**
 * Checks if a memo is within the byte length limit
 * @param memo - The memo string to check
 * @returns True if memo is within limits, false otherwise
 */
export const isMemoWithinLimits = (memo: string): boolean => {
  return getMemoByteLength(memo) <= MEMO_MAX_BYTES
}

/**
 * Truncates a memo to fit within the byte length limit
 * @param memo - The memo string to truncate
 * @returns Truncated memo that fits within byte limits
 */
export const truncateMemoToLimit = (memo: string): string => {
  if (!memo) return ''

  const encoder = new TextEncoder()

  // If already within limits, return as-is
  if (encoder.encode(memo).length <= MEMO_MAX_BYTES) {
    return memo
  }

  // Binary search to find the maximum length that fits
  let left = 0
  let right = memo.length
  let result = ''

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    const substring = memo.substring(0, mid)
    const byteLength = encoder.encode(substring).length

    if (byteLength <= MEMO_MAX_BYTES) {
      result = substring
      left = mid + 1
    }
    else {
      right = mid - 1
    }
  }

  return result
}

/**
 * Formats memo validation error for user display
 * @param result - The memo validation result
 * @returns User-friendly error message
 */
/**
 * Main composable function for memo validation
 */
export const useMemoValidation = () => {
  return {
    validateMemo,
    getMemoByteLength,
    isMemoWithinLimits,
    truncateMemoToLimit,
    formatMemoValidationError,
    createMemoConfig,
    validateMemoFormat,
    MEMO_MAX_BYTES,
    MemoValidationError,
  }
}

export const formatMemoValidationError = (result: MemoValidationResult): string => {
  if (result.isValid) return ''

  switch (result.error) {
    case MemoValidationError.MEMO_TOO_LONG:
      return `Memo is too long (${result.byteLength}/${MEMO_MAX_BYTES} bytes). Please shorten your memo.`
    case MemoValidationError.MEMO_INVALID_ENCODING:
      return 'Memo contains invalid characters. Please use only valid UTF-8 text.'
    case MemoValidationError.MEMO_EMPTY:
      return 'Memo cannot be empty.'
    default:
      return result.errorMessage || 'Invalid memo format.'
  }
}

/**
 * Creates a memo configuration object
 * @param text - The memo text
 * @returns MemoConfig object
 */
export const createMemoConfig = (text: string): MemoConfig => {
  return {
    text: text.trim(),
    maxLength: MEMO_MAX_BYTES,
    encoding: 'utf-8',
  }
}

/**
 * Validates common memo formats (numeric IDs, alphanumeric codes, JSON strings)
 * @param memo - The memo string to validate
 * @param format - Expected format type
 * @returns Validation result with format-specific checks
 */
export const validateMemoFormat = (
  memo: string,
  format: 'numeric' | 'alphanumeric' | 'json' | 'any' = 'any',
): MemoValidationResult => {
  // First run standard memo validation
  const baseValidation = validateMemo(memo)
  if (!baseValidation.isValid) {
    return baseValidation
  }

  // Skip format validation for empty memos
  if (!memo || memo.trim().length === 0) {
    return baseValidation
  }

  // Format-specific validation
  switch (format) {
    case 'numeric':
      if (!/^\d+$/.test(memo.trim())) {
        return {
          isValid: false,
          error: MemoValidationError.MEMO_INVALID_ENCODING,
          errorMessage: 'Memo must contain only numeric characters',
          byteLength: baseValidation.byteLength,
        }
      }
      break

    case 'alphanumeric':
      if (!/^[a-zA-Z0-9]+$/.test(memo.trim())) {
        return {
          isValid: false,
          error: MemoValidationError.MEMO_INVALID_ENCODING,
          errorMessage: 'Memo must contain only alphanumeric characters',
          byteLength: baseValidation.byteLength,
        }
      }
      break

    case 'json':
      try {
        JSON.parse(memo.trim())
      }
      catch {
        return {
          isValid: false,
          error: MemoValidationError.MEMO_INVALID_ENCODING,
          errorMessage: 'Memo must be valid JSON format',
          byteLength: baseValidation.byteLength,
        }
      }
      break

    case 'any':
    default:
      // No additional format validation
      break
  }

  return baseValidation
}
