import type {
  AdminSchoolCommentDTO,
  AdminSchoolCommentDetailDTO,
  ApiResult,
  AppError,
  GetAdminSchoolCommentParams,
  ResponseListDTO,
} from '@/types'

const data = ref<AdminSchoolCommentDTO[]>([])
const totalCount = ref(0)
const pageCount = ref(0)
const loadingGetData = ref(true)
const loadingGetItemById = ref(false)
const loadingConfirm = ref(false)
const loadingReject = ref(false)

const NAME = 'Comment'

export const useSchoolCommentAdmin = () => {
  const { $toast } = useNuxtApp()

  const handleError = (err: unknown) => {
    const error = err as AppError

    if (error.response?.status === 400) {
      $toast.error(error.response.data?.message || '')
    }
  }

  const showResponseError = (response: ApiResult<unknown>) => {
    if (response.errors && response.errors.length > 0) {
      $toast.error(response.errors[0].message || '')
    }
    else {
      $toast.error('The operation failed. Please try again later.')
    }
  }

  const getData = async (params: GetAdminSchoolCommentParams) => {
    loadingGetData.value = true

    try {
      const response = await useApiService.get<
        ApiResult<ResponseListDTO<AdminSchoolCommentDTO>>
      >(
        '/api/v2/admin/schools/comments/contributions',
        {
          'PagingDto.PageFilter.Size': params.pageSize,
          'PagingDto.PageFilter.Skip': (params.page - 1) * params.pageSize,
          'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
          'StartDate': params.startDate,
          'EndDate': params.endDate,
          'CommenterEmail': params.commenterEmail,
          'CommenterName': params.commenterName,
          'Status': params.status,
        },
      )

      if (response.data) {
        data.value = response.data.list
        totalCount.value = response.data.totalRecordsCount
        pageCount.value = Math.ceil(totalCount.value / params.pageSize)
      }
      else {
        data.value = []
        totalCount.value = 0
        pageCount.value = 0
      }

      return response
    }
    catch (err: unknown) {
      handleError(err)

      data.value = []
      totalCount.value = 0
      pageCount.value = 0

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

  const getItemById = async (id: string | number) => {
    loadingGetItemById.value = true

    try {
      const response = await useApiService.get<ApiResult<AdminSchoolCommentDetailDTO>>(
        `/api/v2/admin/schools/comments/contributions/${id}`,
      )

      return response
    }
    catch (err: unknown) {
      handleError(err)

      return {
        succeeded: false,
        status: 0,
        data: null,
      }
    }
    finally {
      loadingGetItemById.value = false
    }
  }

  const confirm = async (id: string | number) => {
    loadingConfirm.value = true

    try {
      const response = await useApiService.patch<ApiResult<boolean>>(
        `/api/v2/admin/schools/comments/contributions/${id}/confirm`,
        {},
      )

      if (response.succeeded) {
        $toast.success(`${NAME} approved successfully!`)
      }
      else {
        showResponseError(response)
      }

      return response
    }
    catch (err: unknown) {
      handleError(err)

      return {
        succeeded: false,
        status: 0,
        data: false,
      }
    }
    finally {
      loadingConfirm.value = false
    }
  }

  const reject = async (id: string | number, comment: string) => {
    loadingReject.value = true

    try {
      const response = await useApiService.patch<ApiResult<boolean>>(
        `/api/v2/admin/schools/comments/contributions/${id}/reject`,
        { comment },
      )

      if (response.succeeded) {
        $toast.success(`${NAME} rejected successfully!`)
      }
      else {
        showResponseError(response)
      }

      return response
    }
    catch (err: unknown) {
      handleError(err)

      return {
        succeeded: false,
        status: 0,
        data: false,
      }
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
