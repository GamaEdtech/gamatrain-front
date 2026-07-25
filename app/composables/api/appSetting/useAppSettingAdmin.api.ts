import type {
  AdminAppSettingsDTO,
  ApiResult,
} from '@/types'

type AppSettingsPayload = Record<string, string | number | undefined>

const loadingGetSettings = ref(true)
const loadingUpdateSettings = ref(false)

export const useAppSettingAdmin = () => {
  const { $toast } = useNuxtApp()
  const { handleApiResponseError, handleApiCatchError, createApiFailure } = useApiErrorHandler()

  const getSettings = async () => {
    loadingGetSettings.value = true

    try {
      const response = await useApiService.get<ApiResult<AdminAppSettingsDTO>>(
        '/api/v2/admin/applicationsettings',
      )

      if (response.succeeded && response.data) {
        return response
      }

      handleApiResponseError(response)
      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<AdminAppSettingsDTO>(err)
    }
    finally {
      loadingGetSettings.value = false
    }
  }

  const updateSettings = async (payload: AppSettingsPayload) => {
    loadingUpdateSettings.value = true

    try {
      const response = await useApiService.put<ApiResult<boolean>>(
        '/api/v2/admin/applicationsettings',
        payload,
      )

      if (response.succeeded && response.data) {
        $toast.success('Your settings have been changed successfully.')
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
      loadingUpdateSettings.value = false
    }
  }

  return {
    getSettings,
    loadingGetSettings,
    updateSettings,
    loadingUpdateSettings,
  }
}
