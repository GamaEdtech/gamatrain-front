import type { ApiResult, ProfileListParams, ProfileListResponseDTO } from '@/types'

export const useProfileListApi = () => {
  const getProfiles = (params: ProfileListParams) =>
    useApiService.get<ApiResult<ProfileListResponseDTO>>(
      '/api/v2/identities/profiles/list',
      params,
      { public: true },
    )

  return { getProfiles }
}
