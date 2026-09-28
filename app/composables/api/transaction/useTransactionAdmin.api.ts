import type {
  AdminTransactionDTO,
  ApiResult,
  GetAdminTransactionsParams,
  ResponseListDTO,
  AddTransactionAdminDTO,
  ResponseAddTransactionAdminDTO,
} from '@/types'
import dayjs from 'dayjs'

const data = ref<AdminTransactionDTO[]>([])
const loadingGetData = ref(true)
const loadingAddItem = ref(false)
const totalCount = ref(0)
const pageCount = ref(0)

export const useTransactionAdmin = () => {
  const { $toast } = useNuxtApp()
  const { handleApiResponseError, handleApiCatchError, createApiFailure } = useApiErrorHandler()

  const getData = async (params: GetAdminTransactionsParams) => {
    const { page, pageSize, isDebit, userId, name, email, identifierId, startDate, endDate } = params
    loadingGetData.value = true
    try {
      const query: Record<string, string | number | boolean | null> = {
        'PagingDto.PageFilter.Size': pageSize,
        'PagingDto.PageFilter.Skip': (page - 1) * pageSize,
        'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
        'IsDebit': isDebit !== null ? isDebit : null,
        'UserId': userId,
        'Name': name,
        'Email': email,
        'IdentifierId': identifierId,
        'StartDate': startDate ? dayjs(startDate).toISOString() : null,
        'EndDate': endDate ? dayjs(endDate).toISOString() : null,
      }

      const response = await useApiService.get<
        ApiResult<ResponseListDTO<AdminTransactionDTO>>
      >('/api/v2/admin/transactions', query)

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
    }
    catch (err: unknown) {
      data.value = []
      totalCount.value = 0
      pageCount.value = 0
      handleApiCatchError(err)

      return createApiFailure<ResponseListDTO<AdminTransactionDTO>>(err)
    }
    finally {
      loadingGetData.value = false
    }
  }

  const addItem = async (item: AddTransactionAdminDTO) => {
    try {
      loadingAddItem.value = true
      const response = await useApiService.post<
        ApiResult<ResponseAddTransactionAdminDTO>
      >(
        '/api/v2/admin/transactions',
        { ...item },
      )
      if (response.succeeded) {
        $toast.success('The user wallet was successfully recharged!')
      }
      else {
        handleApiResponseError(response)
      }
      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<ResponseAddTransactionAdminDTO>(err)
    }
    finally {
      loadingAddItem.value = false
    }
  }

  return {
    getData,
    data,
    loadingGetData,
    totalCount,
    pageCount,
    addItem,
    loadingAddItem,
  }
}
