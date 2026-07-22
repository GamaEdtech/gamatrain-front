import type {
  AdminSchoolContributionBriefDTO,
  ApiResult,
  AppError,
  GetAdminSchoolContributionParams,
  ResponseListDTO,
} from '@/types'

const data = ref<AdminSchoolContributionBriefDTO[]>([])
const totalCount = ref(0)
const pageCount = ref(0)
const loadingGetData = ref(true)

export const useSchoolContributionAdmin = () => {
  const { $toast } = useNuxtApp()

  const handleError = (err: unknown) => {
    const error = err as AppError

    if (error.response?.status === 400) {
      $toast.error(error.response.data?.message || '')
    }
  }

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
      if (response.data) {
        data.value = response.data.list ?? []
        totalCount.value = response.data.totalRecordsCount
        pageCount.value = Math.ceil(totalCount.value / pageSize)
      }
      else {
        resetData()
      }

      return response
    }
    catch (err: unknown) {
      handleError(err)
      resetData()

      return {
        succeeded: false,
        status: 0,
        data: null,
      }
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
