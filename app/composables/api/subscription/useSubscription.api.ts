import type {
  ApiResult,
  ResponseGetPlanDTO,
  PaymentSubscriptionResponseDTO,
  PayloadPaymentSubscriptionDTO,
  UserSubscriptionDTO,
} from '@/types'

export const useSubscription = () => {
  const { handleApiResponseError, handleApiCatchError, createApiFailure } = useApiErrorHandler()

  const data = ref<ResponseGetPlanDTO | null>(null)
  const userSubscription = ref<UserSubscriptionDTO | null>(null)
  const loadingGetData = ref(true)
  const loadingStartPaymentSubscription = ref(false)
  const loadingGetUserSubscription = ref(false)

  const getData = async () => {
    loadingGetData.value = true
    try {
      const response = await useApiService.get<
        ApiResult<ResponseGetPlanDTO>
      >(`/api/v2/subscriptions/plans`)

      if (response.succeeded && response.data) {
        data.value = response.data
      }
      else {
        data.value = null
        handleApiResponseError(response)
      }
    }
    catch (err: unknown) {
      data.value = null
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

  const getUserSubscription = async () => {
    loadingGetUserSubscription.value = true
    try {
      const response = await useApiService.get<
        ApiResult<UserSubscriptionDTO>
      >(`/api/v2/subscriptions/me`)

      if (response.succeeded && response.data) {
        userSubscription.value = response.data
      }
      else {
        data.value = null
        handleApiResponseError(response)
      }

      return response
    }
    catch (err: unknown) {
      data.value = null
      handleApiCatchError(err)

      return createApiFailure<UserSubscriptionDTO>(err)
    }
    finally {
      loadingGetUserSubscription.value = false
    }
  }

  return { loadingGetData, data, getData, startPaymentSubscription, loadingStartPaymentSubscription, userSubscription, loadingGetUserSubscription, getUserSubscription }
}
