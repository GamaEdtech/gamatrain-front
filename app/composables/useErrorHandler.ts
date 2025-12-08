/**
 * Error Handler Composable
 * Centralized error handling with toast notifications
 */

export const useErrorHandler = () => {
  const { $toast } = useNuxtApp()

  /**
   * Handle errors with toast notification
   * @param error - The error object
   * @param fallbackMessage - Default message if error message is not available
   * @param showToast - Whether to show toast notification (default: true)
   */
  const handleError = (
    error: unknown,
    fallbackMessage: string,
    showToast = true,
  ): string => {
    // Log error to console for debugging
    console.error(error)

    // Extract error message
    let message = fallbackMessage

    if (error instanceof Error) {
      message = error.message
    }
    else if (typeof error === 'string') {
      message = error
    }
    else if (error && typeof error === 'object' && 'message' in error) {
      message = String(error.message)
    }

    // Show toast notification if enabled
    if (showToast) {
      $toast.error(message)
    }

    return message
  }

  /**
   * Handle success with toast notification
   * @param message - Success message
   * @param showToast - Whether to show toast notification (default: true)
   */
  const handleSuccess = (message: string, showToast = true): void => {
    if (showToast) {
      $toast.success(message)
    }
  }

  /**
   * Handle warning with toast notification
   * @param message - Warning message
   * @param showToast - Whether to show toast notification (default: true)
   */
  const handleWarning = (message: string, showToast = true): void => {
    if (showToast) {
      if ($toast.warning) {
        $toast.warning(message)
      }
      else if ($toast.info) {
        $toast.info(message)
      }
    }
  }

  /**
   * Handle info with toast notification
   * @param message - Info message
   * @param showToast - Whether to show toast notification (default: true)
   */
  const handleInfo = (message: string, showToast = true): void => {
    if (showToast) {
      $toast.info?.(message)
    }
  }

  /**
   * Wrap async function with error handling
   * @param fn - Async function to wrap
   * @param fallbackMessage - Default error message
   * @returns Wrapped function
   */
  const withErrorHandling = <T extends (...args: unknown[]) => Promise<unknown>>(
    fn: T,
    fallbackMessage: string,
  ): T => {
    return (async (...args: unknown[]) => {
      try {
        return await fn(...args)
      }
      catch (error) {
        handleError(error, fallbackMessage)
        throw error
      }
    }) as T
  }

  return {
    handleError,
    handleSuccess,
    handleWarning,
    handleInfo,
    withErrorHandling,
  }
}
