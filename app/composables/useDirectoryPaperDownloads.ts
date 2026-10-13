import { ref } from 'vue'
import type { BillingInterval, UpgradeSuggestionsDTO } from '~/types'
import type { DirectoryPaper } from '~/types/subject-directory/paperFiles'
import { getDirectoryDownloadParams, getDirectoryPaperDownloads } from '~/utils/directoryPaperFiles'
import { useDownloadWithProgress } from '~/composables/useDownloadWithProgress'

// Reuses the original table's download, membership and wallet flow.
export const useDirectoryPaperDownloads = () => {
  const isBusy = ref(false)
  const showCoinPaymentModal = ref(false)
  const showCoinAnimation = ref(false)
  const isStartWalletAnimation = ref(false)
  const downloadIssue = ref(false)
  const downloadIssueLink = ref('')
  const paymentPlans = ref<UpgradeSuggestionsDTO[]>([])
  const billingInterval = ref<BillingInterval[]>([])
  const currentDownloadPaper = ref<DirectoryPaper | null>(null)
  const activeDownloadKey = ref('')
  const priceFile = ref(0)
  const pendingDownload = ref<string | null>(null)
  const currentPlanTitle = ref<string | null>(null)
  const currentPlanId = ref<number | null>(null)

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
    get id() { return currentDownloadPaper.value?.id || 0 },
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

  const handleDownload = async (type: string, item: DirectoryPaper) => {
    if (isBusy.value) return
    const downloadParams = getDirectoryDownloadParams(type, item)
    if (!downloadParams) return
    isBusy.value = true
    currentDownloadPaper.value = item
    priceFile.value = getDirectoryPaperDownloads(item).find(file => file.type === type)?.price ?? 0
    activeDownloadKey.value = getTableDownloadKey(item, type)
    pendingDownload.value = type

    try {
      await startDownload(downloadParams)
    }
    finally {
      isBusy.value = false
    }
  }

  const upgradePlanSuccessfully = async () => {
    showCoinPaymentModal.value = false
    if (pendingDownload.value && currentDownloadPaper.value) {
      await handleDownload(pendingDownload.value, currentDownloadPaper.value)
    }
  }

  const getTableDownloadKey = (item: DirectoryPaper, type: string) => `${item.id}-${type}`

  const isDownloading = (item: DirectoryPaper, type: string) => {
    const downloadParams = getDirectoryDownloadParams(type, item)
    if (!downloadParams) return false
    return activeDownloadKey.value === getTableDownloadKey(item, type)
      && isDownloadingByType(downloadParams.type, downloadParams.extraId)
  }

  const getDownloadProgress = (item: DirectoryPaper, type: string) => {
    const downloadParams = getDirectoryDownloadParams(type, item)
    if (!downloadParams) return 0
    return getDownloadProgressByType(downloadParams.type, downloadParams.extraId)
  }

  return {
    isBusy,
    priceFile,
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
