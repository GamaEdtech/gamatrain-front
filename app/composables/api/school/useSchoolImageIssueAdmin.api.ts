import type {
  AdminSchoolImageIssueDTO,
  AdminSchoolImageIssueDetailDTO,
  ApiResult,
  GetAdminSchoolImageIssueParams,
  ResponseListDTO,
} from '@/types'

const data = ref<AdminSchoolImageIssueDTO[]>([])
const totalCount = ref(0)
const pageCount = ref(0)
const loadingGetData = ref(true)
const loadingGetItemById = ref(false)
const loadingConfirm = ref(false)
const loadingReject = ref(false)

const NAME = 'Image issue'

export const useSchoolImageIssueAdmin = () => {
  const { $toast } = useNuxtApp()
  const { handleApiResponseError, handleApiCatchError, createApiFailure } = useApiErrorHandler()

  const getData = async (params: GetAdminSchoolImageIssueParams) => {
    loadingGetData.value = true

    try {
      const response = await useApiService.get<
        ApiResult<ResponseListDTO<AdminSchoolImageIssueDTO>>
      >(
        '/api/v2/admin/schools/images/issues/contributions',
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

      return createApiFailure<ResponseListDTO<AdminSchoolImageIssueDTO>>(err)
    }
    finally {
      loadingGetData.value = false
    }
  }

  const getItemById = async (id: string | number) => {
    loadingGetItemById.value = true

    try {
      const response = await useApiService.get<ApiResult<AdminSchoolImageIssueDetailDTO>>(
        `/api/v2/admin/schools/images/issues/contributions/${id}`,
      )

      if (response.succeeded && response.data) {
        return response
      }

      handleApiResponseError(response)
      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<AdminSchoolImageIssueDetailDTO>(err)
    }
    finally {
      loadingGetItemById.value = false
    }
  }

  const confirm = async (id: string | number) => {
    loadingConfirm.value = true

    try {
      const response = await useApiService.patch<ApiResult<boolean>>(
        `/api/v2/admin/schools/images/issues/contributions/${id}/confirm`,
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
        `/api/v2/admin/schools/images/issues/contributions/${id}/reject`,
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
    getItemById,
    loadingGetItemById,
    confirm,
    loadingConfirm,
    reject,
    loadingReject,
  }
}
