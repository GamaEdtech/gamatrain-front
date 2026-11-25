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

// GA4's recommended event names, so they can be marked as key events (conversions) in GA4 as they are.
interface SignUpEvent {
  method: 'email' | 'google'
}

interface PurchaseEvent {
  // Our payment id: GA4 counts one purchase per transaction_id, so a reload of the verify page isn't a second sale.
  transaction_id: string
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

  const trackSignUp = (payload: SignUpEvent) => {
    if (!$gtm) {
      console.warn('[GTM] Not initialized')
      return
    }

    $gtm.push('sign_up', payload)
  }

  const trackPurchase = (payload: PurchaseEvent) => {
    if (!$gtm) {
      console.warn('[GTM] Not initialized')
      return
    }

    $gtm.push('purchase', payload)
  }

  return {
    trackFileDownload,
    trackPayment,
    trackVerifyPayment,
    trackSignUp,
    trackPurchase,
  }
}
