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
  const loadingCancelSubscription = ref(false)
  const loadingResumeSubscription = ref(false)

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

      // data is legitimately null on success when the user has no active subscription (not an error) -
      // only a non-succeeded response is a real failure worth toasting.
      if (response.succeeded) {
        userSubscription.value = response.data ?? null
      }
      else {
        userSubscription.value = null
        handleApiResponseError(response)
      }

      return response
    }
    catch (err: unknown) {
      userSubscription.value = null
      handleApiCatchError(err)

      return createApiFailure<UserSubscriptionDTO>(err)
    }
    finally {
      loadingGetUserSubscription.value = false
    }
  }

  const cancelSubscription = async () => {
    loadingCancelSubscription.value = true
    try {
      const response = await useApiService.post<
        ApiResult<boolean>
      >(`/api/v2/subscriptions/me/cancel`)

      if (!response.succeeded || !response.data) {
        handleApiResponseError(response)
      }

      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<boolean>(err, false)
    }
    finally {
      loadingCancelSubscription.value = false
    }
  }

  const resumeSubscription = async () => {
    loadingResumeSubscription.value = true
    try {
      const response = await useApiService.post<
        ApiResult<boolean>
      >(`/api/v2/subscriptions/me/resume`)

      if (!response.succeeded || !response.data) {
        handleApiResponseError(response)
      }

      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<boolean>(err, false)
    }
    finally {
      loadingResumeSubscription.value = false
    }
  }

  return { loadingGetData, data, getData, startPaymentSubscription, loadingStartPaymentSubscription, userSubscription, loadingGetUserSubscription, getUserSubscription, resumeSubscription, loadingResumeSubscription, loadingCancelSubscription, cancelSubscription }
}
