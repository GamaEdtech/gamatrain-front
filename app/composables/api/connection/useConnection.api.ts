import type {
  ApiResult,
  ConnectionStatusDTO,
  ConnectionStatusResponseDTO,
} from '@/types'

export const useConnection = () => {
  const { $toast } = useNuxtApp()
  const { handleApiResponseError, handleApiCatchError, createApiFailure } = useApiErrorHandler()

  const loadingFollow = ref(false)
  const loadingUnfollow = ref(false)
  const loadingCheckConnectionStatus = ref(false)

  // A 401 already opens the login dialog (useApiService), so an error toast on top of it is only noise.
  const handleConnectionFailure = <T>(err: unknown, data: T | null = null) => {
    const failure = createApiFailure<T>(err, data)
    if (failure.status !== 401) handleApiCatchError(err)

    return failure
  }

  const follow = async (id: number) => {
    loadingFollow.value = true

    try {
      const response = await useApiService.post<ApiResult<boolean>>(
        `/api/v2/connections/users/${id}/follow?idType=CoreId`,
        {
          subscribeToActivityFeed: true,
        },
      )

      if (response.succeeded) {
        $toast.success(`You are now following this user.`)
      }
      else {
        handleApiResponseError(response)
      }

      return response
    }
    catch (err: unknown) {
      return handleConnectionFailure<boolean>(err, false)
    }
    finally {
      loadingFollow.value = false
    }
  }

  const unFollow = async (id: number) => {
    loadingUnfollow.value = true

    try {
      const response = await useApiService.post<ApiResult<boolean>>(
        `/api/v2/connections/users/${id}/unfollow?idType=CoreId`,
        {
          // Only stop following them; the author's own follow of this user is not ours to remove.
          twoWayRevoke: false,
        },
      )

      if (response.succeeded) {
        $toast.success(`You have unfollowed this user.`)
      }
      else {
        handleApiResponseError(response)
      }

      return response
    }
    catch (err: unknown) {
      return handleConnectionFailure<boolean>(err, false)
    }
    finally {
      loadingUnfollow.value = false
    }
  }

  const checkConnectionStatus = async (data: ConnectionStatusDTO) => {
    loadingCheckConnectionStatus.value = true

    try {
      const response = await useApiService.post<ApiResult<ConnectionStatusResponseDTO[]>>(
        `/api/v2/connections/status`,
        { ...data },
      )

      return response
    }
    catch (err: unknown) {
      return handleConnectionFailure<ConnectionStatusResponseDTO[]>(err)
    }
    finally {
      loadingCheckConnectionStatus.value = false
    }
  }

  return {
    loadingUnfollow,
    loadingFollow,
    loadingCheckConnectionStatus,
    follow,
    unFollow,
    checkConnectionStatus,
  }
}
