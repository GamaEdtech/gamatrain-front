import type {
  ApiResult,
  AppError,
  ResponseListDTO,
  CommentBlogDTO,
  AddCommnetBlogDTO,
  GetCommentBlogParams,
  AddCommentBlogResponseDTO,
} from '@/types'

const data = ref<CommentBlogDTO[]>([])
const totalCount = ref(0)
const pageCount = ref(0)
const loadingGetData = ref(true)
const loadingAddItem = ref(false)
const loadingLikeItem = ref(false)
const loadingDislikeItem = ref(false)
const NAME = 'Comment'

export const useBlogComment = () => {
  const { $toast } = useNuxtApp()

  const getData = async (params: GetCommentBlogParams) => {
    const { page, pageSize, postId } = params
    loadingGetData.value = true
    try {
      const query: Record<string, string | number | boolean | null> = {
        'PagingDto.PageFilter.Size': pageSize,
        'PagingDto.PageFilter.Skip': (page - 1) * pageSize,
        'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
      }
      const response = await useApiService.get<
        ApiResult<ResponseListDTO<CommentBlogDTO>>
      >(`/api/v2/blogs/posts/${postId}/comments`, query)
      if (response.data) {
        data.value = response.data.list
        totalCount.value = response.data.totalRecordsCount
        pageCount.value = Math.ceil(totalCount.value / pageSize)
      }
      else {
        data.value = []
      }
    }
    catch (err: unknown) {
      const error = err as AppError
      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }
    }
    finally {
      loadingGetData.value = false
    }
  }

  const addItem = async (item: AddCommnetBlogDTO, postId: string) => {
    try {
      loadingAddItem.value = true
      const response = await useApiService.post<
        ApiResult<AddCommentBlogResponseDTO>
      >(
        `/api/v2/blogs/posts/${postId}/comments`,
        { ...item },
      )
      if (response.succeeded) {
        $toast.success(`${NAME} Added successfully!`)
      }
      else {
        $toast.error('The operation failed. Please try again later.')
      }
      return response
    }
    catch (err: unknown) {
      const error = err as AppError
      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }
      return {
        succeeded: false,
        message: 'The operation failed. Please try again later.',
        data: null,
      }
    }
    finally {
      loadingAddItem.value = false
    }
  }

  const like = async (postId: string, commentId: string) => {
    try {
      loadingLikeItem.value = true
      const response = await useApiService.patch<
        ApiResult<boolean>
      >(
        `/api/v2/blogs/posts/${postId}/comments/${commentId}/like`,
        {},
      )
      if (response.succeeded) {
        $toast.success(`${NAME} like successfully!`)
      }
      else {
        $toast.error('The operation failed. Please try again later.')
      }
      return response
    }
    catch (err: unknown) {
      const error = err as AppError
      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }
      return {
        succeeded: false,
        message: 'The operation failed. Please try again later.',
      }
    }
    finally {
      loadingLikeItem.value = false
    }
  }

  const dislike = async (postId: string, commentId: string) => {
    try {
      loadingDislikeItem.value = true
      const response = await useApiService.patch<
        ApiResult<boolean>
      >(
        `/api/v2/blogs/posts/${postId}/comments/${commentId}/dislike`,
        {},
      )
      if (response.succeeded) {
        $toast.success(`${NAME} dislike successfully!`)
      }
      else {
        $toast.error('The operation failed. Please try again later.')
      }
      return response
    }
    catch (err: unknown) {
      const error = err as AppError
      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }
      return {
        succeeded: false,
        message: 'The operation failed. Please try again later.',
      }
    }
    finally {
      loadingDislikeItem.value = false
    }
  }

  return { loadingGetData, data, getData, totalCount, pageCount,
    addItem, loadingAddItem, like, loadingLikeItem, dislike, loadingDislikeItem,
  }
}
