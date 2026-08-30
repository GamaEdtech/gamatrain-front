import type {
  ApiResult,
  GetUserSubscriptionHistoryParams,
  ResponseGetPlanDTO,
  PaymentSubscriptionResponseDTO,
  PayloadPaymentSubscriptionDTO,
  ResponseListDTO,
  UserSubscriptionHistoryDTO,
  UserSubscriptionDTO,
  SwitchSubscriptionPlanDTO,
  SwitchSubscriptionPlanResponseDTO,
} from '@/types'

export const useSubscription = () => {
  const { handleApiResponseError, handleApiCatchError, createApiFailure } = useApiErrorHandler()

  const data = ref<ResponseGetPlanDTO | null>(null)
  const userSubscription = ref<UserSubscriptionDTO | null>(null)
  const userSubscriptionHistory = ref<UserSubscriptionHistoryDTO[]>([])
  const userSubscriptionHistoryTotalCount = ref(0)
  const userSubscriptionHistoryPageCount = ref(0)
  const loadingGetData = ref(true)
  const loadingStartPaymentSubscription = ref(false)
  const loadingGetUserSubscription = ref(false)
  const loadingGetUserSubscriptionHistory = ref(false)
  const loadingCancelSubscription = ref(false)
  const loadingResumeSubscription = ref(false)
  const loadingSwitchSubscriptionPlan = ref(false)

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

      if (response.succeeded) {
        userSubscription.value = response.data ?? null
      }
      else {
        userSubscription.value = null
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

  const getUserSubscriptionHistory = async (params: GetUserSubscriptionHistoryParams) => {
    loadingGetUserSubscriptionHistory.value = true
    try {
      const response = await useApiService.get<
        ApiResult<ResponseListDTO<UserSubscriptionHistoryDTO>>
      >(
        `/api/v2/subscriptions/me/history`,
        {
          'PagingDto.PageFilter.Size': params.pageSize,
          'PagingDto.PageFilter.Skip': (params.page - 1) * params.pageSize,
          'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
        },
      )

      if (response.succeeded && response.data) {
        userSubscriptionHistory.value = response.data.list ?? []
        userSubscriptionHistoryTotalCount.value = response.data.totalRecordsCount
        userSubscriptionHistoryPageCount.value = Math.ceil(response.data.totalRecordsCount / params.pageSize)
      }
      else {
        userSubscriptionHistory.value = []
        userSubscriptionHistoryTotalCount.value = 0
        userSubscriptionHistoryPageCount.value = 0
        handleApiResponseError(response)
      }

      return response
    }
    catch (err: unknown) {
      userSubscriptionHistory.value = []
      userSubscriptionHistoryTotalCount.value = 0
      userSubscriptionHistoryPageCount.value = 0
      handleApiCatchError(err)

      return createApiFailure<ResponseListDTO<UserSubscriptionHistoryDTO>>(err)
    }
    finally {
      loadingGetUserSubscriptionHistory.value = false
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

  // Switches the caller's own Active (Stripe-recurring) subscription to a different plan/interval. Kept for
  // a dedicated "manage my subscription" screen; startPaymentSubscription (plans/{id}/purchase) now handles
  // the same decision on its own for a generic "choose a plan" UI (gamatrain-back#577), so this isn't
  // currently called from subscription/card.vue. An upgrade previews first (response.data.requiresConfirmation,
  // .previewAmount) - resubmit with confirm:true to actually apply/charge it; a downgrade applies straight
  // away, deferred to the current period's end (response.data.immediate === false).
  const switchSubscriptionPlan = async (payload: SwitchSubscriptionPlanDTO) => {
    loadingSwitchSubscriptionPlan.value = true
    try {
      const response = await useApiService.post<
        ApiResult<SwitchSubscriptionPlanResponseDTO>
      >(`/api/v2/subscriptions/me/switch`, { ...payload })

      if (!response.succeeded) {
        handleApiResponseError(response)
      }

      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<SwitchSubscriptionPlanResponseDTO>(err)
    }
    finally {
      loadingSwitchSubscriptionPlan.value = false
    }
  }

  return { loadingGetData, data, getData, startPaymentSubscription, loadingStartPaymentSubscription, userSubscription, loadingGetUserSubscription, getUserSubscription, userSubscriptionHistory, userSubscriptionHistoryTotalCount, userSubscriptionHistoryPageCount, loadingGetUserSubscriptionHistory, getUserSubscriptionHistory, resumeSubscription, loadingResumeSubscription, loadingCancelSubscription, cancelSubscription, switchSubscriptionPlan, loadingSwitchSubscriptionPlan }
}
