import type {
  AdminSchoolContributionBriefDTO,
  ApiResult,
  GetAdminSchoolContributionParams,
  ResponseListDTO,
} from '@/types'

const data = ref<AdminSchoolContributionBriefDTO[]>([])
const totalCount = ref(0)
const pageCount = ref(0)
const loadingGetData = ref(true)

export const useSchoolContributionAdmin = () => {
  const { handleApiResponseError, handleApiCatchError, createApiFailure } = useApiErrorHandler()

  const getData = async (params: GetAdminSchoolContributionParams) => {
    loadingGetData.value = true

    try {
      const { page, status, pageSize, sort } = params

      const query: Record<string, string | number | boolean | null> = {
        'PagingDto.PageFilter.Size': pageSize,
        'PagingDto.PageFilter.Skip': (page - 1) * pageSize,
        'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
        'Status': status === 'All' ? '' : status,
      }

      if (sort?.length > 0) {
        sort.forEach((sortOption, index) => {
          query[`PagingDto.SortFilter[${index}].sortType`] = 'Asc'
          query[`PagingDto.SortFilter[${index}].column`] = sortOption
        })
      }

      const response = await useApiService.get<
        ApiResult<ResponseListDTO<AdminSchoolContributionBriefDTO>>
      >('/api/v2/admin/schools/contributions', query)
      if (response.succeeded && response.data) {
        data.value = response.data.list ?? []
        totalCount.value = response.data.totalRecordsCount
        pageCount.value = Math.ceil(totalCount.value / pageSize)
      }
      else {
        resetData()
        handleApiResponseError(response)
      }

      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)
      resetData()

      return createApiFailure<ResponseListDTO<AdminSchoolContributionBriefDTO>>(err)
    }
    finally {
      loadingGetData.value = false
    }
  }

  const resetData = () => {
    data.value = []
    totalCount.value = 0
    pageCount.value = 0
  }

  return {
    loadingGetData,
    data,
    totalCount,
    pageCount,
    getData,
    resetData,
  }
}
