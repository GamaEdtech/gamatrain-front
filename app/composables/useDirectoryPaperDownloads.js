import { getDirectoryDownloadParams } from '~/utils/directoryPapers'
import { useDownloadWithProgress } from '~/composables/useDownloadWithProgress'

// Reuses the original table's download, membership and wallet flow.
export const useDirectoryPaperDownloads = () => {
  const isBusy = ref(false)
  const showCoinPaymentModal = ref(false)
  const showCoinAnimation = ref(false)
  const isStartWalletAnimation = ref(false)
  const downloadIssue = ref(false)
  const downloadIssueLink = ref('')
  const paymentPlans = ref([])
  const billingInterval = ref([])
  const currentDownloadPaper = ref(null)
  const activeDownloadKey = ref('')
  const currentDownloadPaperId = {
    valueOf: () => currentDownloadPaper.value?.id || 0,
  }
  const pendingDownload = ref(null)
  const currentPlanTitle = ref(null)
  const currentPlanId = ref(null)

  const handleAnimationComplete = async () => {
    // Close everything immediately when animation completes
    showCoinAnimation.value = false
    isStartWalletAnimation.value = true
  }

  const completeWalletAnimation = () => {
    downloadIssue.value = true
    isStartWalletAnimation.value = false
  }

  const {
    getDownloadProgress: getDownloadProgressByType,
    isDownloading: isDownloadingByType,
    startDownload,
  } = useDownloadWithProgress({
    contentType: 'PastPaper',
    id: currentDownloadPaperId,
    trackPayload: () => ({
      file_type: 'past_paper',
      file_name: currentDownloadPaper.value?.test_type_title || currentDownloadPaper.value?.title || '',
      file_url: currentDownloadPaper.value ? `/paper/${currentDownloadPaper.value.id}/${currentDownloadPaper.value.title_url}` : '',
    }),
    onDownloaded: (data) => {
      downloadIssueLink.value = data.url || ''
      activeDownloadKey.value = ''
      if (data.spent) {
        showCoinAnimation.value = true
      }
      else {
        downloadIssue.value = true
      }
      pendingDownload.value = null
    },
    onInsufficientBalance: () => {
      activeDownloadKey.value = ''
      showCoinPaymentModal.value = true
    },
    onUpgradeSuggestions: (data) => {
      activeDownloadKey.value = ''
      paymentPlans.value = data.upgradeSuggestions || []
      billingInterval.value = data.availableBillingIntervals || []
      currentPlanTitle.value = data.currentPlanTitle
      currentPlanId.value = data.currentPlanId
      showCoinPaymentModal.value = true
    },
  })

  const handleDownload = async (type, item) => {
    if (isBusy.value) return
    isBusy.value = true
    const downloadParams = getDirectoryDownloadParams(type, item)
    currentDownloadPaper.value = item
    activeDownloadKey.value = getTableDownloadKey(item, type)
    pendingDownload.value = downloadParams

    try {
      await startDownload(downloadParams)
    }
    finally {
      isBusy.value = false
    }
  }

  const upgradePlanSuccessfully = async () => {
    showCoinPaymentModal.value = false
    if (pendingDownload.value) {
      startDownload({ type: pendingDownload.value.type, extraId: pendingDownload.value.extraId })
    }
  }

  const getTableDownloadKey = (item, type) => `${item.id}-${type}`

  const isDownloading = (item, type) => {
    const downloadParams = getDirectoryDownloadParams(type, item)
    return activeDownloadKey.value === getTableDownloadKey(item, type)
      && isDownloadingByType(downloadParams.type, downloadParams.extraId)
  }

  const getDownloadProgress = (item, type) => {
    const downloadParams = getDirectoryDownloadParams(type, item)
    return getDownloadProgressByType(downloadParams.type, downloadParams.extraId)
  }

  return {
    isBusy,
    showCoinPaymentModal,
    showCoinAnimation,
    isStartWalletAnimation,
    downloadIssue,
    downloadIssueLink,
    paymentPlans,
    billingInterval,
    currentPlanTitle,
    currentPlanId,
    handleAnimationComplete,
    completeWalletAnimation,
    handleDownload,
    upgradePlanSuccessfully,
    isDownloading,
    getDownloadProgress,
  }
}
