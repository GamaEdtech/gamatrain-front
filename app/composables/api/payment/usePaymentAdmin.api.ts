import type {
  ApiResult,
  AppError,
  PaymentAdminExportParams,
} from '@/types'

const loadingExportPayments = ref(false)

export const usePaymentAdmin = () => {
  const { $toast } = useNuxtApp()

  const exportPayments = async (params?: PaymentAdminExportParams) => {
    loadingExportPayments.value = true
    try {
      const query: Record<string, string | null> = {
        StartDate: params?.startDate ?? null,
        EndDate: params?.endDate ?? null,
        Gateway: params?.gateway ?? null,
        Status: params?.status ?? null,
      }

      const response = await useApiService.get<ApiResult<string>>(
        '/api/v2/admin/payments/export',
        query,
      )
      // if (response.succeeded) {
      //   $toast.success(`Payment data export successfully!`)
      // }
      // else {
      //   if (response.errors && response.errors.length > 0) {
      //     $toast.error(response.errors[0].message || '')
      //   }
      //   else {
      //     $toast.error('The operation failed. Please try again later.')
      //   }
      // }
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
      loadingExportPayments.value = false
    }
  }

  return {
    exportPayments,
    loadingExportPayments,
  }
}
