import type { ApiErrorItem, ApiResult, NormalizedApiError } from '@/types'

const DEFAULT_API_ERROR_MESSAGE = 'The operation failed. Please try again later.'
const DEFAULT_DISCONNECT_MESSAGE = 'Connection failed. Please check your internet connection.'

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

const getString = (value: unknown): string | undefined => {
  return typeof value === 'string' && value.trim() ? value : undefined
}

const getNumber = (value: unknown): number | undefined => {
  return typeof value === 'number' ? value : undefined
}

const getErrorItems = (value: unknown): ApiErrorItem[] => {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .filter(isRecord)
    .map(item => ({
      message: getString(item.message) || DEFAULT_API_ERROR_MESSAGE,
      code: getString(item.code),
      reference: getString(item.reference),
      info: getString(item.info),
      value: getString(item.value),
    }))
}

export const useApiErrorHandler = () => {
  const { $toast } = useNuxtApp()

  const showErrorToast = (message: string, showToast = true) => {
    if (showToast) {
      $toast.error(message)
    }
  }

  const normalizeApiResponseError = (
    response: ApiResult<unknown>,
    fallbackMessage = DEFAULT_API_ERROR_MESSAGE,
  ): NormalizedApiError => {
    const errors = getErrorItems(response.errors)
    const errorMessage = getString(response.error)
    const message = errors[0]?.message || errorMessage || fallbackMessage

    return {
      message: response.status === 0 && !errorMessage ? DEFAULT_DISCONNECT_MESSAGE : message,
      status: response.status === 0 ? 'disconnect' : response.status,
      errors,
      raw: response,
    }
  }

  const normalizeApiCatchError = (
    error: unknown,
    fallbackMessage = DEFAULT_API_ERROR_MESSAGE,
  ): NormalizedApiError => {
    if (typeof error === 'string') {
      return {
        message: error || fallbackMessage,
        status: 'disconnect',
        errors: [],
        raw: error,
      }
    }

    if (!isRecord(error)) {
      return {
        message: fallbackMessage,
        status: 'disconnect',
        errors: [],
        raw: error,
      }
    }

    const response = isRecord(error.response) ? error.response : undefined
    const responseData = response && isRecord(response.data) ? response.data : undefined
    const directData = isRecord(error.data) ? error.data : undefined
    const data = responseData || directData

    const status = getNumber(response?.status)
      ?? getNumber(data?.status)
      ?? getNumber(error.status)
      ?? getNumber(error.statusCode)
      ?? 0

    const errors = getErrorItems(data?.errors)
    const message = errors[0]?.message
      || getString(data?.message)
      || getString(data?.error)
      || getString(error.message)
      || getString(error.statusMessage)
      || fallbackMessage

    return {
      message: status === 0 && message === fallbackMessage ? DEFAULT_DISCONNECT_MESSAGE : message,
      status: status === 0 ? 'disconnect' : status,
      errors,
      raw: error,
    }
  }

  const handleApiResponseError = (
    response: ApiResult<unknown>,
    fallbackMessage = DEFAULT_API_ERROR_MESSAGE,
    showToast = true,
  ) => {
    const normalizedError = normalizeApiResponseError(response, fallbackMessage)
    showErrorToast(normalizedError.message, showToast)
    return normalizedError
  }

  const handleApiCatchError = (
    error: unknown,
    fallbackMessage = DEFAULT_API_ERROR_MESSAGE,
    showToast = true,
  ) => {
    const normalizedError = normalizeApiCatchError(error, fallbackMessage)
    showErrorToast(normalizedError.message, showToast)
    return normalizedError
  }

  const createApiFailure = <T>(
    error: unknown,
    data: T | null = null,
    fallbackMessage = DEFAULT_API_ERROR_MESSAGE,
  ): ApiResult<T> => {
    const normalizedError = normalizeApiCatchError(error, fallbackMessage)

    return {
      data,
      status: normalizedError.status === 'disconnect' ? 0 : normalizedError.status,
      error: normalizedError.message,
      succeeded: false,
      errors: normalizedError.errors,
    }
  }

  return {
    normalizeApiResponseError,
    normalizeApiCatchError,
    handleApiResponseError,
    handleApiCatchError,
    createApiFailure,
  }
}
