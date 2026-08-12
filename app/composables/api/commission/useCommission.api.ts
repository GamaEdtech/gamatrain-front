import dayjs from 'dayjs'
import type {
  UserCommissionDTO,
  ApiResult,
  GetUserCommissionParams,
  ResponseListDTO,
} from '@/types'

const BASE_URL = '/api/v2/commissions'

export const useCommission = () => {
  const { handleApiResponseError, handleApiCatchError, createApiFailure } = useApiErrorHandler()

  const data = ref<UserCommissionDTO[]>([])
  const loadingGetData = ref(true)
  const totalCount = ref(0)
  const pageCount = ref(0)

  const getData = async (params: GetUserCommissionParams) => {
    const { page, pageSize, startDate, endDate } = params
    loadingGetData.value = true

    try {
      const response = await useApiService.get<
        ApiResult<ResponseListDTO<UserCommissionDTO>>
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
      handleApiCatchError(err)

      data.value = []
      totalCount.value = 0
      pageCount.value = 0

      return createApiFailure<ResponseListDTO<UserCommissionDTO>>(err)
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
