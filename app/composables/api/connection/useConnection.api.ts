import type {
  ApiResult,
  ConnectionStatusDTO,
  ConnectionStatusResponseDTO,
} from '@/types'

// const NAME = 'Connection'

export const useConnection = () => {
  const { $toast } = useNuxtApp()
  const { handleApiResponseError, handleApiCatchError, createApiFailure } = useApiErrorHandler()

  const loadingFollow = ref(false)
  const loadingUnfollow = ref(false)
  const loadingCheckConnectionStatus = ref(false)

  const follow = async (id: string) => {
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
      handleApiCatchError(err)

      return createApiFailure<boolean>(err, false)
    }
    finally {
      loadingFollow.value = false
    }
  }

  const unFollow = async (id: string) => {
    loadingUnfollow.value = true

    try {
      const response = await useApiService.post<ApiResult<boolean>>(
        `/api/v2/connections/users/${id}/unfollow?idType=CoreId`,
        {
          twoWayRevoke: true,
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
      handleApiCatchError(err)

      return createApiFailure<boolean>(err, false)
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
      handleApiCatchError(err)

      return createApiFailure<ConnectionStatusResponseDTO[]>(err)
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
