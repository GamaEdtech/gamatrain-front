import type {
  BodyRequestDownloadDTO,
  ContentTypeDownload,
  DownloadResponseDTO,
} from '@/types'

type DownloadType = string

interface DownloadTrackingPayload {
  file_type: 'multimedia' | 'past_paper' | 'quiz' | 'exam'
  file_name: string
  file_url: string
}

interface UseDownloadWithProgressOptions {
  contentType: ContentTypeDownload
  id: string | number
  trackPayload: () => DownloadTrackingPayload
  onDownloaded?: (data: DownloadResponseDTO) => void
  onInsufficientBalance?: () => void
  onUpgradeSuggestions?: (data: DownloadResponseDTO) => void
}

interface StartDownloadParams {
  type: DownloadType
  extraId?: string
}

const getDownloadKey = (type: DownloadType, extraId?: string) =>
  extraId ? `${type}-${extraId}` : type

const getDownloadErrorMessage = (status: number) => {
  switch (status) {
    case 400:
      return 'Invalid request.'
    case 401:
      return 'You are not authorized.'
    case 403:
      return 'Access denied.'
    case 404:
      return 'File not found.'
    case 429:
      return 'Too many requests. Please try again later.'
    case 500:
      return 'Server error. Please try again later.'
    case 502:
    case 503:
    case 504:
      return 'Server is temporarily unavailable.'
    default:
      return `Download failed. Error code: ${status}`
  }
}

export const useDownloadWithProgress = (options: UseDownloadWithProgressOptions) => {
  const { $toast } = useNuxtApp()
  const auth = useAuth()
  const router = useRouter()
  const { trackFileDownload } = useGtmEvents()
  const { downloadFile } = useDownload()

  const downloadProgress = ref<Record<string, number>>({})
  const downloadingItems = ref<Set<string>>(new Set())

  const clearDownload = (type: DownloadType, extraId?: string) => {
    const key = getDownloadKey(type, extraId)
    downloadingItems.value.delete(key)
    Reflect.deleteProperty(downloadProgress.value, key)
  }

  const getDownloadProgress = (type: DownloadType, extraId?: string) =>
    downloadProgress.value[getDownloadKey(type, extraId)] || 0

  const isDownloading = (type: DownloadType, extraId?: string) =>
    downloadingItems.value.has(getDownloadKey(type, extraId))

  const redirectToLogin = () => {
    router.push({})
    setTimeout(() => {
      router.push({ query: { auth_form: 'login', auth_noredirect: 'true' } })
    }, 100)
  }

  const saveBlobWithProgress = (
    fileUrl: string,
    fileName: string,
    onProgress: (progress: number) => void,
  ) =>
    new Promise<void>((resolve, reject: (error: { status?: number }) => void) => {
      const xhr = new XMLHttpRequest()
      xhr.open('GET', fileUrl, true)
      xhr.responseType = 'blob'

      xhr.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = 60 + (event.loaded / event.total) * 40
          onProgress(Math.min(percentComplete, 100))
        }
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const blob = xhr.response
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = fileName || 'file.pdf'
          document.body.appendChild(a)
          a.click()
          a.remove()
          window.URL.revokeObjectURL(url)
          resolve()
          return
        }

        reject({ status: xhr.status })
      }

      xhr.onerror = () => reject({})
      xhr.send()
    })

  const startDownload = async ({ type, extraId }: StartDownloadParams) => {
    const downloadKey = getDownloadKey(type, extraId)
    downloadingItems.value.add(downloadKey)
    downloadProgress.value[downloadKey] = 0

    if (!auth.isAuthenticated.value) {
      clearDownload(type, extraId)
      redirectToLogin()
      return
    }

    trackFileDownload(options.trackPayload())

    let progressInterval: ReturnType<typeof setInterval> | null = null

    try {
      progressInterval = setInterval(() => {
        const currentProgress = downloadProgress.value[downloadKey] ?? 0
        if (currentProgress < 50) {
          downloadProgress.value[downloadKey] = currentProgress + Math.random() * 15
        }
      }, 100)

      const request: BodyRequestDownloadDTO = {
        contentType: options.contentType,
        fileType: type,
        id: Number(options.id),
        extraId: extraId ? Number(extraId) : undefined,
      }
      const response = await downloadFile(request)

      downloadProgress.value[downloadKey] = 60
      clearInterval(progressInterval)
      progressInterval = null

      if (response.succeeded && response.data) {
        const hasDownloadUrl = Boolean(response.data.url)
        if (hasDownloadUrl) {
          await saveBlobWithProgress(response.data.url, response.data.name, (progress) => {
            downloadProgress.value[downloadKey] = progress
          })

          downloadProgress.value[downloadKey] = 100
          options.onDownloaded?.(response.data)

          setTimeout(() => {
            clearDownload(type, extraId)
          }, 1000)
        }

        if (!hasDownloadUrl) {
          clearDownload(type, extraId)
        }

        return
      }

      if (response.data && response.data.upgradeSuggestions && response.data.upgradeSuggestions.length > 0) {
        options.onUpgradeSuggestions?.(response.data)
        clearDownload(type, extraId)
        return
      }

      const message = response.errors?.[0]?.message
      if (message === 'InsufficientBalance') {
        options.onInsufficientBalance?.()
      }
      clearDownload(type, extraId)
    }
    catch (error: unknown) {
      clearDownload(type, extraId)
      const status = (error as { status?: number }).status
      $toast.error(status ? getDownloadErrorMessage(status) : 'Download failed. Please try again.')
    }
    finally {
      if (progressInterval) {
        clearInterval(progressInterval)
      }
    }
  }

  return {
    clearDownload,
    getDownloadProgress,
    isDownloading,
    startDownload,
  }
}
