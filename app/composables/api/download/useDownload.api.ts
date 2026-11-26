import type {
  ApiResult,
  AppError,
  DownloadResponseDTO,
  BodyRequestDownloadDTO,
} from '@/types'

const loadingDownload = ref(false)

// Out of gems: the caller opens the plans dialog, which says so. A toast of the raw "InsufficientBalance" on top of it
// only added noise (as the exam export and analysis already do).
const isPaymentRefusal = (response: ApiResult<DownloadResponseDTO>) =>
  !!response.data?.upgradeSuggestions?.length || response.errors?.[0]?.message === 'InsufficientBalance'

export const useDownload = () => {
  const { $toast } = useNuxtApp()

  const downloadFile = async (
    params: BodyRequestDownloadDTO,
    shouldDownload = false,
  ) => {
    loadingDownload.value = true

    try {
      const response = await useApiService.post<ApiResult<DownloadResponseDTO>>(
        '/api/v2/downloads',
        { ...params },
      )

      if (response.succeeded && response.data?.url) {
        if (shouldDownload) {
          const FileSaver = await import('file-saver')
          FileSaver.saveAs(response.data.url, response.data.name)
        }
      }
      else if (!isPaymentRefusal(response)) {
        if (response.errors && response.errors.length > 0) {
          $toast.error(response.errors[0].message || '')
        }
        else {
          $toast.error('The operation failed. Please try again later.')
        }
      }

      return response
    }
    catch (err: unknown) {
      const error = err as AppError
      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }
      return {
        succeeded: false,
        message: 'The operation failed. Please try again later.',
        data: null,
        errors: [
          {
            message: 'The operation failed. Please try again later.',
          },
        ],
      }
    }
    finally {
      loadingDownload.value = false
    }
  }

  return {
    downloadFile,
    loadingDownload,
  }
}
