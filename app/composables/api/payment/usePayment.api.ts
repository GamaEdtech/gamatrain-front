import type {
  ApiResult,
  AppError,
  PayloadPaymentDTO,
  PaymentDTO,
} from '~/types/api'

const KEY = 'redirect_after_payment'
const loadingPayment = ref(false)
const loadingVerifyPayment = ref(false)

export const usePayment = () => {
  const { $toast } = useNuxtApp()

  const startPayment = async (payload: PayloadPaymentDTO) => {
    try {
      loadingPayment.value = true
      const response = await useApiService.post<
        ApiResult<PaymentDTO>
      >(
        '/api/v2/payments',
        { ...payload },
      )
      if (!response.succeeded) {
        $toast.error('The operation failed. Please try again later.')
      }

      return response
    }
    catch (err: unknown) {
      const error = err as AppError
      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }
      return {
        succeeded: false,
        data: undefined,
        message: 'The operation failed. Please try again later.',
      }
    }
    finally {
      loadingPayment.value = false
    }
  }

  const verifyPayment = async (id: string, transactionId: string) => {
    try {
      loadingVerifyPayment.value = true
      const response = await useApiService.post<
        ApiResult<boolean>
      >(
        `/api/v2/payments/${id}/verify`,
        {
          transactionId: transactionId,
        },
      )
      return response
    }
    catch (err: unknown) {
      const error = err as AppError
      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }
      return {
        succeeded: false,
        data: undefined,
        message: 'The operation failed. Please try again later.',
      }
    }
    finally {
      loadingVerifyPayment.value = false
    }
  }

  const savePathRedirect = (path: string) => {
    localStorage.setItem(KEY, path)
  }

  const getPathRedirect = () => {
    const val = localStorage.getItem(KEY)
    return val
  }

  const removePathRedirect = () => {
    localStorage.removeItem(KEY)
  }

  return { startPayment, loadingPayment, savePathRedirect, getPathRedirect, removePathRedirect, verifyPayment, loadingVerifyPayment }
}
