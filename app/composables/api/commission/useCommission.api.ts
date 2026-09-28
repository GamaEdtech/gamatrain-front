import dayjs from 'dayjs'
import type {
  UserCommissionDTO,
  ApiResult,
  GetUserCommissionParams,
  CommissionStatisticsParams,
  CommissionStatisticsResponseDTO,
  ResponseListDTO,
} from '@/types'

const BASE_URL = '/api/v2/commissions'

export const useCommission = () => {
  const { handleApiResponseError, handleApiCatchError, createApiFailure } = useApiErrorHandler()

  const data = ref<UserCommissionDTO[]>([])
  const loadingGetData = ref(true)
  const loadingGetStatistics = ref(true)
  const totalCount = ref(0)
  const pageCount = ref(0)
  const statistics = ref<CommissionStatisticsResponseDTO>({
    statistics: [],
    totalAmountUsd: 0,
    totalPoints: 0,
  })

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

        return response.data
      }
      else {
        data.value = []
        totalCount.value = 0
        pageCount.value = 0
        handleApiResponseError(response)

        return {
          list: [] as UserCommissionDTO[],
          totalRecordsCount: 0,
          num: 0,
        }
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

  const getStatistics = async (params: CommissionStatisticsParams) => {
    const { period, startDate, endDate } = params
    loadingGetStatistics.value = true

    try {
      const response = await useApiService.get<ApiResult<CommissionStatisticsResponseDTO>>(
        `${BASE_URL}/statistics`,
        {
          Period: period,
          StartDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : null,
          EndDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : null,
        },
      )

      if (response.succeeded && response.data) {
        statistics.value = response.data

        return response.data
      }

      statistics.value = {
        statistics: [],
        totalAmountUsd: 0,
        totalPoints: 0,
      }
      handleApiResponseError(response)

      return statistics.value
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      statistics.value = {
        statistics: [],
        totalAmountUsd: 0,
        totalPoints: 0,
      }

      return createApiFailure<CommissionStatisticsResponseDTO>(err).data ?? statistics.value
    }
    finally {
      loadingGetStatistics.value = false
    }
  }

  return {
    getData,
    getStatistics,
    data,
    loadingGetData,
    loadingGetStatistics,
    totalCount,
    pageCount,
    statistics,
  }
}
