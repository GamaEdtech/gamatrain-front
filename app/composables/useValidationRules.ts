/**
 * Centralized validation rules composable
 * Provides reusable validation functions for forms across the application
 */

export const useValidationRules = () => {
  // Basic validation rules
  const required = (v: unknown) => !!v || 'This field is required'

  const requiredWithMessage = (message: string) => (v: unknown) =>
    !!v || message

  // String validation rules
  const maxLength = (max: number) => (v: string) =>
    !v || v.length <= max || `Maximum ${max} characters allowed`

  const minLength = (min: number) => (v: string) =>
    !v || v.length >= min || `Minimum ${min} characters required`

  const exactLength = (length: number) => (v: string) =>
    !v || v.length === length || `Must be exactly ${length} characters`

  // Number validation rules
  const positive = (v: number) => v > 0 || 'Amount must be greater than 0'

  const positiveNumber = (v: number) =>
    v === null || v === undefined || v >= 0 || 'Must be a positive number'

  const nonNegative = (v: number) =>
    v === null || v === undefined || v >= 0 || 'Cannot be negative'

  const min = (minValue: number) => (v: number) =>
    v === null || v === undefined || v >= minValue || `Must be at least ${minValue}`

  const max = (maxValue: number) => (v: number) =>
    v === null || v === undefined || v <= maxValue || `Must be at most ${maxValue}`

  const range = (minValue: number, maxValue: number) => (v: number) =>
    v === null
    || v === undefined
    || (v >= minValue && v <= maxValue)
    || `Must be between ${minValue} and ${maxValue}`

  // Email validation
  const email = (v: string) =>
    !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Email must be valid'

  const emailStrict = (v: string) =>
    !v || /.+@.+\..+/.test(v) || 'E-mail must be valid.'

  // URL validation
  const url = (v: string) =>
    !v
    || /^https?:\/\/.+/.test(v)
    || 'Must be a valid URL starting with http:// or https://'

  const urlStrict = (v: string) =>
    !v
    || /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/.test(
      v,
    )
    || 'Please enter a valid URL'

  // Custom validation with dynamic values
  const maxBalance = (balance: Ref<number> | number) => (v: number) => {
    const maxValue = typeof balance === 'number' ? balance : balance.value
    return (
      v <= maxValue || `Insufficient balance (${maxValue} $GET available)`
    )
  }

  const maxStaked = (staked: Ref<number> | number) => (v: number) => {
    const maxValue = typeof staked === 'number' ? staked : staked.value
    return v <= maxValue || `Cannot unstake more than staked amount`
  }

  // Pattern validation
  const pattern = (regex: RegExp, message: string) => (v: string) =>
    !v || regex.test(v) || message

  const alphanumeric = (v: string) =>
    !v || /^[a-zA-Z0-9]+$/.test(v) || 'Only letters and numbers allowed'

  const alphabetic = (v: string) =>
    !v || /^[a-zA-Z]+$/.test(v) || 'Only letters allowed'

  const numeric = (v: string) =>
    !v || /^[0-9]+$/.test(v) || 'Only numbers allowed'

  // Phone validation
  const phone = (v: string) =>
    !v
    || /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(
      v,
    )
    || 'Phone number must be valid'

  // Password validation
  const password = (v: string) =>
    !v || v.length >= 8 || 'Password must be at least 8 characters'

  const passwordStrong = (v: string) =>
    !v
    || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      v,
    )
    || 'Password must contain uppercase, lowercase, number and special character'

  // Confirmation validation
  const matches = (target: Ref<string> | string, fieldName = 'field') =>
    (v: string) => {
      const targetValue
        = typeof target === 'string' ? target : target.value
      return v === targetValue || `Must match ${fieldName}`
    }

  // Array validation
  const arrayNotEmpty = (v: unknown[]) =>
    (v && v.length > 0) || 'At least one item is required'

  const arrayMinLength = (min: number) => (v: unknown[]) =>
    (v && v.length >= min) || `At least ${min} items required`

  const arrayMaxLength = (max: number) => (v: unknown[]) =>
    !v || v.length <= max || `Maximum ${max} items allowed`

  // File validation
  const fileSize = (maxSizeMB: number) => (v: File | null) =>
    !v
    || v.size <= maxSizeMB * 1024 * 1024
    || `File size must be less than ${maxSizeMB}MB`

  const fileType = (allowedTypes: string[]) => (v: File | null) =>
    !v
    || allowedTypes.includes(v.type)
    || `File type must be one of: ${allowedTypes.join(', ')}`

  // Combine multiple rules
  const combine = (...rules: Array<(v: unknown) => boolean | string>) =>
    (v: unknown) => {
      for (const rule of rules) {
        const result = rule(v)
        if (result !== true) return result
      }
      return true
    }

  return {
    // Basic
    required,
    requiredWithMessage,

    // String
    maxLength,
    minLength,
    exactLength,

    // Number
    positive,
    positiveNumber,
    nonNegative,
    min,
    max,
    range,

    // Email & URL
    email,
    emailStrict,
    url,
    urlStrict,

    // Custom dynamic
    maxBalance,
    maxStaked,

    // Pattern
    pattern,
    alphanumeric,
    alphabetic,
    numeric,

    // Phone
    phone,

    // Password
    password,
    passwordStrong,

    // Confirmation
    matches,

    // Array
    arrayNotEmpty,
    arrayMinLength,
    arrayMaxLength,

    // File
    fileSize,
    fileType,

    // Utility
    combine,
  }
}
