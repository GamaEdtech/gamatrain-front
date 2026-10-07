import type {
  ApiResult,
  CommissionPayoutDTO,
  CommissionPayoutDecision,
  GetAdminCommissionPayoutsParams,
  ResponseListDTO,
} from '@/types'

const BASE_URL = '/api/v2/admin/commissions/payouts'

const SUCCESS_MESSAGES: Record<CommissionPayoutDecision, string> = {
  // A Stripe payout is also sent at this point; the list then shows it as Paid.
  approve: 'Payout approved.',
  reject: 'Payout rejected.',
  paid: 'Payout marked as paid. The owner gets an email.',
}

/** Admin payout queue: list every owner's requests and decide them. Every decision needs the admin's authenticator code. */
export const useCommissionPayoutAdmin = () => {
  const { $toast } = useNuxtApp()
  const { handleApiResponseError, handleApiCatchError, createApiFailure } = useApiErrorHandler()

  const data = ref<CommissionPayoutDTO[]>([])
  const loadingGetData = ref(true)
  const totalCount = ref(0)
  const pageCount = ref(0)
  const loadingDecision = ref(false)

  const getData = async (params: GetAdminCommissionPayoutsParams) => {
    const { page, pageSize, status, userId } = params
    loadingGetData.value = true
    try {
      const response = await useApiService.get<ApiResult<ResponseListDTO<CommissionPayoutDTO>>>(BASE_URL, {
        'PagingDto.PageFilter.Size': pageSize,
        'PagingDto.PageFilter.Skip': (page - 1) * pageSize,
        'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
        'Status': status || null,
        'UserId': userId || null,
      })
      if (response.succeeded && response.data) {
        data.value = response.data.list
        totalCount.value = response.data.totalRecordsCount
        pageCount.value = Math.ceil(totalCount.value / pageSize)
      }
      else {
        data.value = []
        totalCount.value = 0
        pageCount.value = 0
        handleApiResponseError(response)
      }
      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)
      data.value = []
      totalCount.value = 0
      pageCount.value = 0
      return createApiFailure<ResponseListDTO<CommissionPayoutDTO>>(err)
    }
    finally {
      loadingGetData.value = false
    }
  }

  /** approve: { twoFactorCode }; reject: + reason; paid: + transferReference. */
  const decide = async (id: number, decision: CommissionPayoutDecision, body: { twoFactorCode: string, reason?: string, transferReference?: string }) => {
    loadingDecision.value = true
    try {
      const response = await useApiService.patch<ApiResult<boolean>>(`${BASE_URL}/${id}/${decision}`, { ...body })
      if (response.succeeded) {
        $toast.success(SUCCESS_MESSAGES[decision])
      }
      else {
        handleApiResponseError(response)
      }
      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)
      return createApiFailure<boolean>(err, false)
    }
    finally {
      loadingDecision.value = false
    }
  }

  return {
    data,
    loadingGetData,
    totalCount,
    pageCount,
    getData,
    loadingDecision,
    decide,
  }
}
