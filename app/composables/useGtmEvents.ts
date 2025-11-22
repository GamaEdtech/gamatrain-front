interface FileDownloadEvent {
  file_type: 'multimedia' | 'past_paper' | 'quiz' | 'exam'
  file_name: string
  file_url: string
  subject_name?: string
  subject_code?: string
}

export const useGtmEvents = () => {
  const { $gtm } = useNuxtApp()

  const trackFileDownload = (payload: FileDownloadEvent) => {
    if (!$gtm) {
      console.warn('[GTM] Not initialized')
      return
    }

    $gtm.push('file_download_click', payload)
    console.log('[GTM] file_download_click', payload)
  }

  return {
    trackFileDownload,
  }
}
