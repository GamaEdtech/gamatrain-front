interface FileDownloadEvent {
  file_type: 'multimedia' | 'past_paper' | 'quiz' | 'exam'
  file_name: string
  file_url: string
  subject_name?: string
  subject_code?: string
}

export const useGtmEvents = () => {
  const gtm = useGtm()

  const trackFileDownload = (payload: FileDownloadEvent) => {
    if (!gtm) {
      console.warn('GTM is not available.')
      return
    }

    // Send a custom event to DataLayer
    gtm.push({
      event: 'file_download_click', // Custom event name
      ...payload,
    })

    console.log('GTM Event Sent: file_download_click', payload)
  }

  return {
    trackFileDownload,
  }
}
