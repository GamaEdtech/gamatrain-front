import type {
  ApiResult,
  GetPostListParams,
  PostDTO,
  ResponseListDTO,
  TagDTO,
} from '@/types'

export const usePostList = () => {
  const { handleApiResponseError, handleApiCatchError, createApiFailure } = useApiErrorHandler()

  const getPosts = async (params: GetPostListParams) => {
    try {
      const response = await useApiService.get<ApiResult<ResponseListDTO<PostDTO>>>(
        '/api/v2/posts',
        {
          'PagingDto.PageFilter.Size': params.pageSize,
          'PagingDto.PageFilter.Skip': (params.page - 1) * params.pageSize,
          'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
          'Title': params.title || null,
          'TagId': params.tagId || null,
          'IsFeatured': params.isFeatured ?? null,
        },
      )

      if (!response.succeeded) {
        handleApiResponseError(response)
      }

      return response
    }
    catch (error: unknown) {
      handleApiCatchError(error)
      return createApiFailure<ResponseListDTO<PostDTO>>(error)
    }
  }

  const getCategories = async () => {
    try {
      const response = await useApiService.get<ApiResult<TagDTO[]>>('/api/v2/tags/Post')

      if (!response.succeeded) {
        handleApiResponseError(response)
      }

      return response
    }
    catch (error: unknown) {
      handleApiCatchError(error)
      return createApiFailure<TagDTO[]>(error)
    }
  }

  return { getPosts, getCategories }
}
