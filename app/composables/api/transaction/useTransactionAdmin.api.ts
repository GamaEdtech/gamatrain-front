import type {
  AdminTransactionDTO,
  ApiResult,
  AppError,
  GetAdminTransactionsParams,
  ResponseListDTO,
} from '@/types'
import dayjs from 'dayjs'

const data = ref<AdminTransactionDTO[]>([])
const loadingGetData = ref(true)
const totalCount = ref(0)
const pageCount = ref(0)

export const useTransactionAdmin = () => {
  const { $toast } = useNuxtApp()

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

      if (response.data) {
        data.value = response.data.list
        totalCount.value = response.data.totalRecordsCount
        pageCount.value = Math.ceil(totalCount.value / pageSize)
      }
      else {
        data.value = []
      }
    }
    catch (err: unknown) {
      const error = err as AppError
      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }
    }
    finally {
      loadingGetData.value = false
    }
  }

  return {
    getData,
    data,
    loadingGetData,
    totalCount,
    pageCount,
  }
}
