import type {
  AdminAppSettingsDTO,
  ApiResult,
  AppError,
} from '@/types'

type AppSettingsPayload = Record<string, string | number | undefined>

const loadingGetSettings = ref(true)
const loadingUpdateSettings = ref(false)

export const useAppSettingAdmin = () => {
  const { $toast } = useNuxtApp()

  const handleError = (err: unknown) => {
    const error = err as AppError

    if (error.response?.status === 400) {
      $toast.error(error.response.data?.message || '')
    }
  }

  const getSettings = async () => {
    loadingGetSettings.value = true

    try {
      const response = await useApiService.get<ApiResult<AdminAppSettingsDTO>>(
        '/api/v2/admin/applicationsettings',
      )

      return response
    }
    catch (err: unknown) {
      handleError(err)

      return {
        succeeded: false,
        status: 0,
        data: null,
      }
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

      if (response.data) {
        $toast.success('Your settings have been changed successfully.')
      }
      else {
        $toast.error('The operation failed. Please try again later.')
      }

      return response
    }
    catch (err: unknown) {
      handleError(err)

      return {
        succeeded: false,
        status: 0,
        data: false,
      }
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
