import type { ApiResult, ProfileProgressDTO } from '@/types'

/**
 * The signed-in user's progress for the profile page (level and quests, points and rank, practice streak, school goal).
 * Shared per request (useState, not a module ref, which the server would share between users), so the page's panel and
 * its dialogs see the same numbers after a refresh.
 */
export const useProfileProgress = () => {
  const progress = useState<ProfileProgressDTO | null>('profile-progress', () => null)
  const loadingProgress = useState('profile-progress-loading', () => false)
  const { handleApiResponseError, handleApiCatchError } = useApiErrorHandler()

  /** Loads the progress; returns the previous value, so a caller can tell when a level was reached. */
  const getProgress = async () => {
    const previous = progress.value
    loadingProgress.value = true
    try {
      const response = await useApiService.get<ApiResult<ProfileProgressDTO>>('/api/v2/identities/profiles/progress')
      if (response.succeeded && response.data) {
        progress.value = response.data
      }
      else {
        handleApiResponseError(response)
      }
    }
    catch (err: unknown) {
      handleApiCatchError(err)
    }
    finally {
      loadingProgress.value = false
    }

    return previous
  }

  return { progress, loadingProgress, getProgress }
}
