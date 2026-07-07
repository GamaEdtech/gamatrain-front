import type {
  ApiResult,
  AppError,
  PDFResponseDTO,
} from '@/types'

type PastPaperDownloadType = 'q_word' | 'q_pdf' | 'a_file' | 'extra' | 'multimedia'

const loadingDownloadPastPaperFile = ref(false)

export const usePastPaperDownload = () => {
  const { $toast } = useNuxtApp()

  const getDownloadUrl = (
    paperId: string | number,
    type: PastPaperDownloadType,
    extraId?: string | number,
  ) => {
    if (type === 'multimedia') return `/api/v1/files/download/${paperId}`
    if (type === 'q_word') return `/api/v1/tests/download/${paperId}/word`
    if (type === 'q_pdf') return `/api/v1/tests/download/${paperId}/pdf`
    if (type === 'a_file') return `/api/v1/tests/download/${paperId}/answer`

    return `/api/v1/tests/download/${paperId}/extra/${extraId}`
  }

  const downloadFile = async (
    paperId: string | number,
    type: PastPaperDownloadType,
    extraId?: string | number,
  ) => {
    loadingDownloadPastPaperFile.value = true

    try {
      const response = await useApiService.get<ApiResult<PDFResponseDTO>>(
        getDownloadUrl(paperId, type, extraId),
      )

      if (response.data?.url) {
        const FileSaver = await import('file-saver')
        FileSaver.saveAs(response.data.url, response.data.name)
      }
    }
    catch (err: unknown) {
      const error = err as AppError

      if (
        error.response?.status === 400
        && error.response.data?.status === 0
        && error.response.data?.error === 'creditNotEnough'
      ) {
        $toast.info('No enough credit')
      }
    }
    finally {
      loadingDownloadPastPaperFile.value = false
    }
  }

  return {
    downloadFile,
    loadingDownloadPastPaperFile,
  }
}
