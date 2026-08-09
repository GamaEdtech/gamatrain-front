import type {
  ApiResult,
  UpgradeSuggestionsDTO,
  PaymentSubscriptionResponseDTO,
  PayloadPaymentSubscriptionDTO,
} from '@/types'

export const useSubscription = () => {
  const { handleApiResponseError, handleApiCatchError, createApiFailure } = useApiErrorHandler()

  const data = ref<UpgradeSuggestionsDTO[]>([])
  const loadingGetData = ref(true)
  const loadingStartPaymentSubscription = ref(false)

  const getData = async () => {
    loadingGetData.value = true
    try {
      const response = await useApiService.get<
        ApiResult<UpgradeSuggestionsDTO[]>
      >(`/api/v2/subscriptions/plans`)

      if (response.succeeded && response.data) {
        data.value = response.data
      }
      else {
        data.value = []
        handleApiResponseError(response)
      }
    }
    catch (err: unknown) {
      data.value = []
      handleApiCatchError(err)
    }
    finally {
      loadingGetData.value = false
    }
  }

  const startPaymentSubscription = async (payload: PayloadPaymentSubscriptionDTO, id: string | number) => {
    loadingStartPaymentSubscription.value = true
    try {
      const response = await useApiService.post<
        ApiResult<PaymentSubscriptionResponseDTO>
      >(`/api/v2/subscriptions/plans/${id}/purchase`, { ...payload })

      if (!response.succeeded) {
        handleApiResponseError(response)
      }

      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<PaymentSubscriptionResponseDTO>(err)
    }
    finally {
      loadingStartPaymentSubscription.value = false
    }
  }

  return { loadingGetData, data, getData, startPaymentSubscription, loadingStartPaymentSubscription }
}
