import type { ApiResult, AuthenticatorSetupDTO, TwoFactorStatusDTO } from '@/types'

const BASE_URL = '/api/v2/admin/twofactor'

/** The signed-in admin's authenticator-app (TOTP) second factor, required for sensitive actions like payout decisions. */
export const useTwoFactorAdmin = () => {
  const { $toast } = useNuxtApp()
  const { handleApiResponseError, handleApiCatchError, createApiFailure } = useApiErrorHandler()

  const enabled = ref(false)
  const loadingStatus = ref(true)
  const setup = ref<AuthenticatorSetupDTO | null>(null)
  const loadingSetup = ref(false)
  const loadingAction = ref(false)

  const getStatus = async () => {
    loadingStatus.value = true
    try {
      const response = await useApiService.get<ApiResult<TwoFactorStatusDTO>>(BASE_URL)
      if (response.succeeded && response.data) {
        enabled.value = response.data.enabled
      }
      else {
        handleApiResponseError(response)
      }
      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)
      return createApiFailure<TwoFactorStatusDTO>(err)
    }
    finally {
      loadingStatus.value = false
    }
  }

  const beginSetup = async () => {
    loadingSetup.value = true
    try {
      const response = await useApiService.post<ApiResult<AuthenticatorSetupDTO>>(`${BASE_URL}/setup`, {})
      if (response.succeeded && response.data) {
        setup.value = response.data
      }
      else {
        handleApiResponseError(response)
      }
      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)
      return createApiFailure<AuthenticatorSetupDTO>(err)
    }
    finally {
      loadingSetup.value = false
    }
  }

  const runAction = async (url: string, code: string, successMessage: string) => {
    loadingAction.value = true
    try {
      const response = await useApiService.post<ApiResult<boolean>>(url, { code })
      if (response.succeeded) {
        $toast.success(successMessage)
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
      loadingAction.value = false
    }
  }

  const enable = async (code: string) => {
    const response = await runAction(`${BASE_URL}/enable`, code, 'Two-factor authentication is on.')
    if (response.succeeded) {
      enabled.value = true
      setup.value = null
    }
    return response
  }

  const disable = async (code: string) => {
    const response = await runAction(`${BASE_URL}/disable`, code, 'Two-factor authentication is off.')
    if (response.succeeded) enabled.value = false
    return response
  }

  const resetUser = (userId: number, code: string) =>
    runAction(`${BASE_URL}/users/${userId}/reset`, code, `Two-factor authentication reset for user #${userId}.`)

  return {
    enabled,
    loadingStatus,
    getStatus,
    setup,
    loadingSetup,
    beginSetup,
    loadingAction,
    enable,
    disable,
    resetUser,
  }
}
