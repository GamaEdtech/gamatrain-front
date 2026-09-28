import type {
  ApiResult,
  DownloadResponseDTO,
  ExamExportFileType,
  ExamExportPriceDTO,
  ExamExportPricesDTO,
} from '@/types'

/**
 * Downloads our own exam export (gamatrain-back `GET exams/export`) for the exam details page.
 *
 * One request both builds and returns the file, so the button shows two phases:
 * - 'cooking': the server is generating the file (everything before the response headers arrive);
 * - 'downloading': the file is streaming in, with real progress from Content-Length.
 *
 * The backend charges on the first export of each exam + format (ExamDownload quota, then points) and
 * answers a refused charge with the same JSON as `POST downloads`, so the page's existing
 * insufficient-balance/upgrade modals are reused through the same callbacks.
 */
export type ExamExportPhase = 'cooking' | 'downloading'

interface UseExamExportDownloadOptions {
  examId: string | number
  title: string
  titleUrl: string
  /** A paid export finished: `points` were charged (0 when it was free or already bought). */
  onDownloaded?: (points: number) => void
  onInsufficientBalance?: () => void
  onUpgradeSuggestions?: (data: DownloadResponseDTO) => void
}

const extensions: Record<ExamExportFileType, string> = {
  Pdf: 'pdf',
  Word: 'docx',
  PowerPoint: 'pptx',
}

const fileNameFromDisposition = (disposition: string | null) => {
  if (!disposition) {
    return null
  }

  const encoded = /filename\*=UTF-8''([^;]+)/i.exec(disposition)
  if (encoded?.[1]) {
    return decodeURIComponent(encoded[1])
  }

  return /filename="?([^";]+)"?/i.exec(disposition)?.[1] ?? null
}

const saveBlob = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.URL.revokeObjectURL(url)
}

export const useExamExportDownload = (options: UseExamExportDownloadOptions) => {
  const { $toast } = useNuxtApp()
  const auth = useAuth()
  const router = useRouter()
  const config = useRuntimeConfig()
  const { trackFileDownload } = useGtmEvents()

  const prices = ref<ExamExportPriceDTO[]>([])
  const phases = ref<Partial<Record<ExamExportFileType, ExamExportPhase>>>({})
  const progress = ref<Partial<Record<ExamExportFileType, number>>>({})

  const getPrice = (fileType: ExamExportFileType) => prices.value.find(t => t.fileType === fileType)
  const getPhase = (fileType: ExamExportFileType) => phases.value[fileType]
  const getProgress = (fileType: ExamExportFileType) => progress.value[fileType] ?? 0

  const clear = (fileType: ExamExportFileType) => {
    Reflect.deleteProperty(phases.value, fileType)
    Reflect.deleteProperty(progress.value, fileType)
  }

  const fetchPrices = async () => {
    try {
      const response = await useApiService.get<ApiResult<ExamExportPricesDTO>>(
        '/api/v2/exams/export/prices',
        { id: options.examId },
      )
      prices.value = response.succeeded && response.data ? response.data.items : []
    }
    catch {
      prices.value = []
    }
  }

  const redirectToLogin = () => {
    router.push({})
    setTimeout(() => {
      router.push({ query: { auth_form: 'login', auth_noredirect: 'true' } })
    }, 100)
  }

  /** Reads the body chunk by chunk, reporting progress when the server sent Content-Length. */
  const readWithProgress = async (response: Response, fileType: ExamExportFileType) => {
    const total = Number(response.headers.get('Content-Length')) || 0
    if (!response.body || !total) {
      return await response.blob()
    }

    const reader = response.body.getReader()
    const chunks: BlobPart[] = []
    let received = 0
    for (;;) {
      const { done, value } = await reader.read()
      if (done) {
        break
      }

      chunks.push(value)
      received += value.length
      progress.value[fileType] = Math.min(100, Math.round((received / total) * 100))
    }

    return new Blob(chunks, { type: response.headers.get('Content-Type') || undefined })
  }

  /** A refused charge (or any other error) comes back as JSON instead of the file. */
  const handleJsonResponse = async (response: Response) => {
    const result = await response.json() as ApiResult<DownloadResponseDTO>
    if (result.data?.upgradeSuggestions && result.data.upgradeSuggestions.length > 0) {
      options.onUpgradeSuggestions?.(result.data)
      return
    }

    const message = result.errors?.[0]?.message
    if (message === 'InsufficientBalance') {
      options.onInsufficientBalance?.()
      return
    }

    $toast.error(message || 'Download failed. Please try again.')
  }

  const startExport = async (fileType: ExamExportFileType) => {
    if (phases.value[fileType]) {
      return
    }

    if (!auth.isAuthenticated.value) {
      redirectToLogin()
      return
    }

    trackFileDownload({ file_type: 'exam', file_name: options.title, file_url: options.titleUrl })
    phases.value[fileType] = 'cooking'
    progress.value[fileType] = 0

    try {
      const query = new URLSearchParams({ id: String(options.examId), fileType })
      const response = await fetch(`${config.public.apiV2BaseUrl}/exams/export?${query}`, {
        headers: { Authorization: `Bearer ${auth.getUserToken()}` },
        credentials: 'include',
      })

      if (response.status === 401 || response.status === 403) {
        clear(fileType)
        redirectToLogin()
        return
      }

      if (!response.ok) {
        clear(fileType)
        $toast.error('Download failed. Please try again.')
        return
      }

      if (response.headers.get('Content-Type')?.includes('application/json')) {
        clear(fileType)
        await handleJsonResponse(response)
        return
      }

      phases.value[fileType] = 'downloading'
      const blob = await readWithProgress(response, fileType)
      progress.value[fileType] = 100
      saveBlob(blob, fileNameFromDisposition(response.headers.get('Content-Disposition'))
      ?? `${options.title || 'exam'}.${extensions[fileType]}`)

      options.onDownloaded?.(Number(response.headers.get('X-Export-Points')) || 0)
      await fetchPrices()
      setTimeout(() => clear(fileType), 800)
    }
    catch {
      clear(fileType)
      $toast.error('Download failed. Please try again.')
    }
  }

  return {
    prices,
    fetchPrices,
    getPrice,
    getPhase,
    getProgress,
    startExport,
  }
}
