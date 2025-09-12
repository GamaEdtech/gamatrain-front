/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Google Tag Manager tracking composable for action button clicks
 * Sends action_click events to GA4 with button details
 */

export const useGtmTracking = () => {
  /**
   * Track action button clicks
   * @param buttonId - Unique identifier for the button
   * @param buttonText - Display text of the button
   * @param pagePath - Current page path
   * @param additionalData - Additional data to send with the event
   */
  const trackActionClick = (
    buttonId: string,
    buttonText: string,
    pagePath?: string,
    additionalData?: Record<string, any>,
  ) => {
    // Ensure we're in browser environment
    if (typeof window === 'undefined') return

    // Get current page path if not provided
    const currentPath = pagePath || window.location.pathname

    // Prepare event data
    const eventData = {
      event: 'action_click',
      button_id: buttonId,
      button_text: buttonText,
      page_path: currentPath,
      timestamp: new Date().toISOString(),
      ...additionalData,
    }

    // Send to Google Tag Manager
    if (window.dataLayer) {
      window.dataLayer.push(eventData)
    }

    // Also send to gtag if available (GA4 direct)
    if (window.gtag) {
      window.gtag('event', 'action_click', {
        button_id: buttonId,
        button_text: buttonText,
        page_path: currentPath,
        ...additionalData,
      })
    }

    // Log for debugging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('GTM Action Click Event:', eventData)
    }
  }

  /**
   * Track download button clicks
   * @param fileType - Type of file being downloaded
   * @param fileName - Name of the file
   * @param pagePath - Current page path
   */
  const trackDownloadClick = (
    fileType: string,
    fileName?: string,
    pagePath?: string,
  ) => {
    trackActionClick(
      `download_${fileType}`,
      `Download ${fileType.toUpperCase()}`,
      pagePath,
      {
        file_type: fileType,
        file_name: fileName,
        action_type: 'download',
      },
    )
  }

  /**
   * Track payment/start exam button clicks
   * @param actionType - Type of action (start_exam, payment, etc.)
   * @param buttonText - Display text of the button
   * @param pagePath - Current page path
   * @param price - Price if applicable
   */
  const trackPaymentClick = (
    actionType: string,
    buttonText: string,
    pagePath?: string,
    price?: number,
  ) => {
    trackActionClick(
      `payment_${actionType}`,
      buttonText,
      pagePath,
      {
        action_type: 'payment',
        payment_type: actionType,
        price: price || 0,
      },
    )
  }

  /**
   * Track quiz/exam start button clicks
   * @param examId - ID of the exam
   * @param buttonText - Display text of the button
   * @param pagePath - Current page path
   */
  const trackQuizStartClick = (
    examId: string,
    buttonText: string,
    pagePath?: string,
  ) => {
    trackActionClick(
      `quiz_start_${examId}`,
      buttonText,
      pagePath,
      {
        action_type: 'quiz_start',
        exam_id: examId,
      },
    )
  }

  return {
    trackActionClick,
    trackDownloadClick,
    trackPaymentClick,
    trackQuizStartClick,
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}
