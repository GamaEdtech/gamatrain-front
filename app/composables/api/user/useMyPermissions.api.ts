import type { ApiResult } from '@/types'

export const useMyPermissions = () => {
  /** The signed-in user's own admin endpoint keys (e.g. "Admin.Posts.GetPosts"); empty when the call fails. */
  const getMyPermissions = async (): Promise<string[]> => {
    try {
      const response = await useApiService.get<ApiResult<string[]>>('/api/v2/identities/permissions')
      return response.succeeded ? response.data ?? [] : []
    }
    catch {
      return []
    }
  }

  return { getMyPermissions }
}
