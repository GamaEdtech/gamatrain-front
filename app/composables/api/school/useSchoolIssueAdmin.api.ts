import type {
  AdminSchoolIssueDTO,
  ApiResult,
  GetAdminSchoolIssueParams,
  ResponseListDTO,
} from '@/types'

const data = ref<AdminSchoolIssueDTO[]>([])
const totalCount = ref(0)
const pageCount = ref(0)
const loadingGetData = ref(true)
const loadingConfirm = ref(false)
const loadingReject = ref(false)

const NAME = 'School issue'

export const useSchoolIssueAdmin = () => {
  const { $toast } = useNuxtApp()
  const { handleApiResponseError, handleApiCatchError, createApiFailure } = useApiErrorHandler()

  const getData = async (params: GetAdminSchoolIssueParams) => {
    loadingGetData.value = true

    try {
      const response = await useApiService.get<
        ApiResult<ResponseListDTO<AdminSchoolIssueDTO>>
      >(
        '/api/v2/admin/schools/issues/contributions',
        {
          'PagingDto.PageFilter.Size': params.pageSize,
          'PagingDto.PageFilter.Skip': (params.page - 1) * params.pageSize,
          'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
          'Status': params.status,
        },
      )

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
      handleApiCatchError(err)

      data.value = []
      totalCount.value = 0
      pageCount.value = 0

      return createApiFailure<ResponseListDTO<AdminSchoolIssueDTO>>(err)
    }
    finally {
      loadingGetData.value = false
    }
  }

  const confirm = async (id: string | number) => {
    loadingConfirm.value = true

    try {
      const response = await useApiService.patch<ApiResult<boolean>>(
        `/api/v2/admin/schools/issues/contributions/${id}/confirm`,
        {},
      )

      if (response.succeeded) {
        $toast.success(`${NAME} confirmed successfully!`)
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
      loadingConfirm.value = false
    }
  }

  const reject = async (id: string | number, comment: string) => {
    loadingReject.value = true

    try {
      const response = await useApiService.patch<ApiResult<boolean>>(
        `/api/v2/admin/schools/issues/contributions/${id}/reject`,
        { comment },
      )

      if (response.succeeded) {
        $toast.success(`${NAME} rejected successfully!`)
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
      loadingReject.value = false
    }
  }

  return {
    loadingGetData,
    data,
    getData,
    totalCount,
    pageCount,
    confirm,
    loadingConfirm,
    reject,
    loadingReject,
  }
}
