import type { ApiResult, WeeklyReportPreviewDTO, WeeklyReportSettingsDTO } from '@/types'
import type { SearchParameters } from '@/composables/useApiService'

/** The weekly report email (a plan feature): the user's setting, the email's unsubscribe link and the admin preview. */
export const useWeeklyReport = () => {
  const { handleApiResponseError, handleApiCatchError, createApiFailure } = useApiErrorHandler()

  const loadingSettings = ref(false)
  const savingSettings = ref(false)
  const loadingUnsubscribe = ref(false)
  const loadingPreview = ref(false)

  const getSettings = async () => {
    loadingSettings.value = true
    try {
      const response = await useApiService.get<ApiResult<WeeklyReportSettingsDTO>>('/api/v2/weekly-reports/settings')
      if (!response.succeeded) handleApiResponseError(response)
      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)
      return createApiFailure<WeeklyReportSettingsDTO>(err)
    }
    finally {
      loadingSettings.value = false
    }
  }

  const setSubscription = async (subscribed: boolean) => {
    savingSettings.value = true
    try {
      const response = await useApiService.put<ApiResult<boolean>>(`/api/v2/weekly-reports/settings?subscribed=${subscribed}`, {})
      if (!response.succeeded) handleApiResponseError(response)
      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)
      return createApiFailure<boolean>(err, false)
    }
    finally {
      savingSettings.value = false
    }
  }

  /** The link in every report: anonymous, the token is the credential. */
  const unsubscribe = async (params: { userId: string, token: string }) => {
    loadingUnsubscribe.value = true
    try {
      return await useApiService.get<ApiResult<boolean>>('/api/v2/weekly-reports/unsubscribe', params as unknown as SearchParameters)
    }
    catch (err: unknown) {
      handleApiCatchError(err)
      return createApiFailure<boolean>(err, false)
    }
    finally {
      loadingUnsubscribe.value = false
    }
  }

  /** Admin only: the user's email for the week holding `weekOf` (yyyy-MM-dd, UTC; empty for last week). Sends nothing. */
  const getPreview = async (params: { userId: number, weekOf?: string }) => {
    loadingPreview.value = true
    try {
      const query: Record<string, string> = { UserId: String(params.userId) }
      if (params.weekOf) query.WeekOf = params.weekOf
      const response = await useApiService.get<ApiResult<WeeklyReportPreviewDTO>>('/api/v2/admin/weekly-reports/preview', query as unknown as SearchParameters)
      if (!response.succeeded) handleApiResponseError(response)
      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)
      return createApiFailure<WeeklyReportPreviewDTO>(err)
    }
    finally {
      loadingPreview.value = false
    }
  }

  return { loadingSettings, savingSettings, loadingUnsubscribe, loadingPreview, getSettings, setSubscription, unsubscribe, getPreview }
}
