import type {
  ApiResult,
  CommissionBalanceDTO,
  CommissionPayoutDTO,
  GetCommissionPayoutsParams,
  RequestCommissionPayoutBody,
  ResponseListDTO,
} from '@/types'

const BASE_URL = '/api/v2/commissions'

const emptyBalance = (): CommissionBalanceDTO => ({
  totalEarnedUsd: 0,
  paidOutUsd: 0,
  reservedUsd: 0,
  availableUsd: 0,
  payoutThresholdUsd: 100,
  openPayoutId: null,
})

/** The signed-in content owner's commission payouts: balance, request, history, cancel. */
export const useCommissionPayout = () => {
  const { $toast } = useNuxtApp()
  const { handleApiResponseError, handleApiCatchError, createApiFailure } = useApiErrorHandler()

  const balance = ref<CommissionBalanceDTO>(emptyBalance())
  const loadingBalance = ref(false)
  const payouts = ref<CommissionPayoutDTO[]>([])
  const loadingPayouts = ref(false)
  const totalCount = ref(0)
  const pageCount = ref(0)
  const loadingRequest = ref(false)
  const loadingCancel = ref(false)

  const getBalance = async () => {
    loadingBalance.value = true
    try {
      const response = await useApiService.get<ApiResult<CommissionBalanceDTO>>(`${BASE_URL}/balance`)
      if (response.succeeded && response.data) {
        balance.value = response.data
      }
      else {
        handleApiResponseError(response)
      }
      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)
      return createApiFailure<CommissionBalanceDTO>(err)
    }
    finally {
      loadingBalance.value = false
    }
  }

  const getPayouts = async (params: GetCommissionPayoutsParams) => {
    const { page, pageSize, status } = params
    loadingPayouts.value = true
    try {
      const response = await useApiService.get<ApiResult<ResponseListDTO<CommissionPayoutDTO>>>(
        `${BASE_URL}/payouts`,
        {
          'PagingDto.PageFilter.Size': pageSize,
          'PagingDto.PageFilter.Skip': (page - 1) * pageSize,
          'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
          'Status': status || null,
        },
      )
      if (response.succeeded && response.data) {
        payouts.value = response.data.list
        totalCount.value = response.data.totalRecordsCount
        pageCount.value = Math.ceil(totalCount.value / pageSize)
      }
      else {
        payouts.value = []
        totalCount.value = 0
        pageCount.value = 0
        handleApiResponseError(response)
      }
      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)
      payouts.value = []
      totalCount.value = 0
      pageCount.value = 0
      return createApiFailure<ResponseListDTO<CommissionPayoutDTO>>(err)
    }
    finally {
      loadingPayouts.value = false
    }
  }

  const requestPayout = async (body: RequestCommissionPayoutBody) => {
    loadingRequest.value = true
    try {
      const response = await useApiService.post<ApiResult<number>>(`${BASE_URL}/payouts`, { ...body })
      if (response.succeeded) {
        $toast.success('Payout request sent. We\'ll email you when the money is on its way.')
      }
      else {
        handleApiResponseError(response)
      }
      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)
      return createApiFailure<number>(err)
    }
    finally {
      loadingRequest.value = false
    }
  }

  const cancelPayout = async (id: number) => {
    loadingCancel.value = true
    try {
      const response = await useApiService.patch<ApiResult<boolean>>(`${BASE_URL}/payouts/${id}/cancel`, {})
      if (response.succeeded) {
        $toast.success('Payout request cancelled.')
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
      loadingCancel.value = false
    }
  }

  return {
    balance,
    loadingBalance,
    getBalance,
    payouts,
    loadingPayouts,
    totalCount,
    pageCount,
    getPayouts,
    loadingRequest,
    requestPayout,
    loadingCancel,
    cancelPayout,
  }
}
