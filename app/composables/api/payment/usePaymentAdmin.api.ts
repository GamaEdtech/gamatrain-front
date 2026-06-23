import type {
  ApiResult,
  AppError,
  AdminPaymentDTO,
  GetAdminPaymentsParams,
  PaymentAdminExportParams,
  ResponseListDTO,
} from '@/types'
import dayjs from 'dayjs'

const data = ref<AdminPaymentDTO[]>([])
const loadingGetData = ref(true)
const totalCount = ref(0)
const pageCount = ref(0)
const loadingExportPayments = ref(false)

export const usePaymentAdmin = () => {
  const { $toast } = useNuxtApp()

  const getData = async (params: GetAdminPaymentsParams) => {
    const { page, pageSize, userId, identifierId, startDate, endDate, gateway, status, sortSelected } = params
    loadingGetData.value = true
    try {
      const query: Record<string, string | number | boolean | null> = {
        'PagingDto.PageFilter.Size': pageSize,
        'PagingDto.PageFilter.Skip': (page - 1) * pageSize,
        'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
        'UserId': userId,
        'IdentifierId': identifierId,
        'StartDate': startDate ? dayjs(startDate).toISOString() : null,
        'EndDate': endDate ? dayjs(endDate).toISOString() : null,
        'Gateway': gateway,
        'Status': status,
      }

      if (sortSelected && sortSelected.length > 0) {
        sortSelected.forEach((sortOption, index) => {
          query[`PagingDto.SortFilter[${index}].sortType`] = 'Asc'
          query[`PagingDto.SortFilter[${index}].column`] = sortOption
        })
      }

      const response = await useApiService.get<
        ApiResult<ResponseListDTO<AdminPaymentDTO>>
      >('/api/v2/admin/payments', query)

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
    getData,
    data,
    loadingGetData,
    totalCount,
    pageCount,
    exportPayments,
    loadingExportPayments,
  }
}
