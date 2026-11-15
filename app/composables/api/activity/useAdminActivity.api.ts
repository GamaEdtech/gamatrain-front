import type { ApiResult, PostActivityDTO, UserActivityItemDTO } from '@/types'
import type { SearchParameters } from '@/composables/useApiService'

/** Admin only: reads and podcast listens (personal reading history, so not delegated to post editors). */
export const useAdminActivity = () => {
  const { handleApiResponseError, handleApiCatchError, createApiFailure } = useApiErrorHandler()

  const loadingTopPosts = ref(false)
  const loadingUserActivity = ref(false)

  /** The posts with the most readers in the last `days` days. */
  const getTopPosts = async (params: { days: number, size?: number }) => {
    loadingTopPosts.value = true
    try {
      const query: Record<string, string> = { Days: String(params.days), Size: String(params.size ?? 20) }
      const response = await useApiService.get<ApiResult<PostActivityDTO[]>>('/api/v2/admin/activities/posts', query as unknown as SearchParameters)
      if (!response.succeeded) handleApiResponseError(response)
      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)
      return createApiFailure<PostActivityDTO[]>(err)
    }
    finally {
      loadingTopPosts.value = false
    }
  }

  /** One user's reads and listens in the last `days` days, newest first. */
  const getUserActivity = async (params: { userId: number, days: number }) => {
    loadingUserActivity.value = true
    try {
      const response = await useApiService.get<ApiResult<UserActivityItemDTO[]>>(
        `/api/v2/admin/activities/users/${params.userId}`,
        { days: String(params.days) } as unknown as SearchParameters,
      )
      if (!response.succeeded) handleApiResponseError(response)
      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)
      return createApiFailure<UserActivityItemDTO[]>(err)
    }
    finally {
      loadingUserActivity.value = false
    }
  }

  return { loadingTopPosts, loadingUserActivity, getTopPosts, getUserActivity }
}
