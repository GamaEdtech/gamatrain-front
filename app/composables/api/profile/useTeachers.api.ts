import type {
  ApiResult,
  GetTeacherProfilesParams,
  ResponseListDTO,
  TeacherProfileDTO,
} from '@/types'

export const useTeachers = () => {
  const { handleApiResponseError, handleApiCatchError, createApiFailure } = useApiErrorHandler()

  const data = ref<TeacherProfileDTO[]>([])
  const totalCount = ref(0)
  const pageCount = ref(0)
  const loadingGetData = ref(true)

  const getData = async (params: GetTeacherProfilesParams) => {
    loadingGetData.value = true

    try {
      const query: Record<string, string | number | boolean | null> = {
        'PagingDto.PageFilter.Size': params.pageSize,
        'PagingDto.PageFilter.Skip': (params.page - 1) * params.pageSize,
        'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
        'FullName': params.fullName || null,
        'Skill': params.skill || null,
      }

      params.sortFilter?.forEach((sortOption, index) => {
        query[`PagingDto.SortFilter[${index}].sortType`] = sortOption.sortType
        query[`PagingDto.SortFilter[${index}].column`] = sortOption.column
      })

      const response = await useApiService.get<
        ApiResult<ResponseListDTO<TeacherProfileDTO>>
      >('/api/v2/identities/profiles/list', query)

      if (response.succeeded && response.data) {
        data.value = response.data.list
        totalCount.value = response.data.totalRecordsCount
        pageCount.value = Math.ceil(totalCount.value / params.pageSize)
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
      data.value = []
      totalCount.value = 0
      pageCount.value = 0
      handleApiCatchError(err)

      return createApiFailure<ResponseListDTO<TeacherProfileDTO>>(err)
    }
    finally {
      loadingGetData.value = false
    }
  }

  return {
    data,
    totalCount,
    pageCount,
    loadingGetData,
    getData,
  }
}
