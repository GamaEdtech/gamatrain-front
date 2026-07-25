import dayjs from 'dayjs'
import type {
  AdminCommissionDTO,
  ApiResult,
  AppError,
  GetAdminCommissionParams,
  ResponseListDTO,
} from '@/types'

const data = ref<AdminCommissionDTO[]>([])
const loadingGetData = ref(true)
const totalCount = ref(0)
const pageCount = ref(0)

const BASE_URL = '/api/v2/admin/commissions'

export const useCommissionAdmin = () => {
  const { $toast } = useNuxtApp()

  const getData = async (params: GetAdminCommissionParams) => {
    const { page, pageSize, startDate, endDate } = params
    loadingGetData.value = true

    try {
      const response = await useApiService.get<
        ApiResult<ResponseListDTO<AdminCommissionDTO>>
      >(
        BASE_URL,
        {
          'PagingDto.PageFilter.Size': pageSize,
          'PagingDto.PageFilter.Skip': (page - 1) * pageSize,
          'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
          'StartDate': startDate ? dayjs(startDate).toISOString() : null,
          'EndDate': endDate ? dayjs(endDate).toISOString() : null,
        },
      )

      if (response.data) {
        data.value = response.data.list
        totalCount.value = response.data.totalRecordsCount
        pageCount.value = Math.ceil(totalCount.value / pageSize)
      }
      else {
        data.value = []
        totalCount.value = 0
        pageCount.value = 0
      }
    }
    catch (err: unknown) {
      const error = err as AppError

      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }

      data.value = []
      totalCount.value = 0
      pageCount.value = 0
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
