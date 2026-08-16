import type {
  ApiResult,
  ResponseListDTO,
  CommnetBlogAdminDTO,
  CommnetBlogDetailAdminDTO,
  GetCommentBlogAdminParams,
} from '@/types'

const data = ref<CommnetBlogAdminDTO[]>([])
const totalCount = ref(0)
const pageCount = ref(0)
const loadingGetData = ref(true)
const loadingGetItemById = ref(false)
const loadingConfirm = ref(false)
const loadingReject = ref(false)

const NAME = 'Comment'

export const useBlogCommentAdmin = () => {
  const { $toast } = useNuxtApp()
  const { handleApiResponseError, handleApiCatchError, createApiFailure } = useApiErrorHandler()

  const getData = async (params: GetCommentBlogAdminParams) => {
    loadingGetData.value = true
    try {
      const query: Record<string, string | number | boolean | null> = {
        'PagingDto.PageFilter.Size': params.pageSize,
        'PagingDto.PageFilter.Skip': (params.page - 1) * params.pageSize,
        'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
        'StartDate': params.startDate,
        'EndDate': params.endDate,
        'CommenterEmail': params.commenterEmail,
        'CommenterName': params.commenterName,
        'Status': params.status ?? '',
      }
      const response = await useApiService.get<
        ApiResult<ResponseListDTO<CommnetBlogAdminDTO>>
      >(`/api/v2/admin/blogs/posts/comments/contributions`, query)
      if (response.succeeded && response.data) {
        data.value = response.data.list
        totalCount.value = response.data.totalRecordsCount
        pageCount.value = Math.ceil(totalCount.value / params.pageSize)
      }
      else {
        data.value = []
        handleApiResponseError(response)
      }
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<ResponseListDTO<CommnetBlogAdminDTO>>(err)
    }
    finally {
      loadingGetData.value = false
    }
  }

  const getItemById = async (id: string) => {
    loadingGetItemById.value = true
    try {
      const response = await useApiService.get<
        ApiResult<CommnetBlogDetailAdminDTO>
      >(`/api/v2/admin/blogs/posts/comments/contributions/${id}`)

      if (!response.succeeded) {
        handleApiResponseError(response)
      }

      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<CommnetBlogDetailAdminDTO>(err)
    }
    finally {
      loadingGetItemById.value = false
    }
  }

  const confirm = async (id: string) => {
    try {
      loadingConfirm.value = true
      const response = await useApiService.patch<
        ApiResult<boolean>
      >(
        `/api/v2/admin/blogs/posts/comments/contributions/${id}/confirm`,
        {},
      )
      if (response.succeeded) {
        $toast.success(`${NAME} confirm successfully!`)
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

  const reject = async (id: string, comment: string) => {
    try {
      loadingReject.value = true
      const response = await useApiService.patch<
        ApiResult<boolean>
      >(
        `/api/v2/admin/blogs/posts/comments/contributions/${id}/reject`,
        {
          comment,
        },
      )
      if (response.succeeded) {
        $toast.success(`${NAME} reject successfully!`)
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

  return { loadingGetData, data, getData, totalCount, pageCount,
    getItemById, loadingGetItemById, confirm, loadingConfirm, reject, loadingReject,
  }
}
