interface FileDownloadEvent {
  file_type: 'multimedia' | 'past_paper' | 'quiz' | 'exam'
  file_name: string
  file_url: string
  subject_name?: string
  subject_code?: string
}

interface PaymentEvent {
  route: string
}

interface PaymentVerifyEvent {
  status: string
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

  const trackPayment = (payload: PaymentEvent) => {
    if (!$gtm) {
      console.warn('[GTM] Not initialized')
      return
    }

    $gtm.push('payment', payload)
    console.log('[GTM] payment', payload)
  }

  const trackVerifyPayment = (payload: PaymentVerifyEvent) => {
    if (!$gtm) {
      console.warn('[GTM] Not initialized')
      return
    }

    $gtm.push('stripe_payment_complete', payload)
    console.log('[GTM] verify payment', payload)
  }

  return {
    trackFileDownload,
    trackPayment,
    trackVerifyPayment,
  }
}
