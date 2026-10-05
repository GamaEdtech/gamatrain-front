import type { ApiResult } from '@/types'
import type { SearchParameters } from '@/composables/useApiService'

export interface NudgeUnsubscribeParams {
  userId: string
  token: string
}

export const useNudge = () => {
  const { handleApiCatchError, createApiFailure } = useApiErrorHandler()

  const loadingUnsubscribe = ref(false)

  const unsubscribe = async (params: NudgeUnsubscribeParams) => {
    loadingUnsubscribe.value = true

    try {
      const response = await useApiService.get<ApiResult<boolean>>(
        '/api/v2/nudges/unsubscribe',
        params as unknown as SearchParameters,
      )

      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<boolean>(err, false)
    }
    finally {
      loadingUnsubscribe.value = false
    }
  }

  return {
    loadingUnsubscribe,
    unsubscribe,
  }
}
