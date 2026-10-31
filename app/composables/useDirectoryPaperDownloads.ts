import { computed, ref } from 'vue'
import type { DownloadResponseDTO } from '~/types'
import type { DirectoryPaper, DirectoryPaperDownload } from '~/types/subject-directory'
import { useDownloadWithProgress } from '~/composables/useDownloadWithProgress'
import { contentPath } from '~/utils/contentPath'

type PaperFile = { paper: DirectoryPaper, file: DirectoryPaperDownload }

// The original table's download flow: progress, the gem-spend animation, and the
// membership dialog when the user's plan doesn't cover the file.
export const useDirectoryPaperDownloads = () => {
  const active = ref<PaperFile | null>(null)
  const last = ref<PaperFile | null>(null)
  const upgrade = ref<DownloadResponseDTO | null>(null)
  const showPayment = ref(false)
  const showCoinAnimation = ref(false)
  const isStartWalletAnimation = ref(false)
  const showDownload = ref(false)
  const downloadLink = ref('')

  const params = (file: DirectoryPaperDownload) => file.extraId
    ? { type: 'extra' as const, extraId: file.extraId }
    : { type: file.type as 'pdf' | 'answer' }

  const { getDownloadProgress, startDownload } = useDownloadWithProgress({
    contentType: 'PastPaper',
    get id() { return active.value?.paper.id || 0 },
    trackPayload: () => ({
      file_type: 'past_paper',
      file_name: active.value?.paper.test_type_title || active.value?.paper.title || '',
      file_url: active.value ? contentPath('paper', active.value.paper.id, active.value.paper.title_url) : '',
    }),
    onDownloaded: (data) => {
      downloadLink.value = data.url || ''
      if (data.spent) showCoinAnimation.value = true
      else showDownload.value = true
    },
    onInsufficientBalance: () => {
      showPayment.value = true
    },
    onUpgradeSuggestions: (data) => {
      upgrade.value = data
      showPayment.value = true
    },
  })

  const download = async (paper: DirectoryPaper, file: DirectoryPaperDownload) => {
    if (active.value) return
    active.value = last.value = { paper, file }
    try {
      await startDownload(params(file))
    }
    finally {
      active.value = null
    }
  }

  const isActive = (paper: DirectoryPaper, file: DirectoryPaperDownload) =>
    active.value?.paper.id === paper.id && active.value.file.type === file.type
  const progress = (paper: DirectoryPaper, file: DirectoryPaperDownload) =>
    isActive(paper, file) ? getDownloadProgress(params(file).type, file.extraId) : 0

  return {
    active, isActive, progress, download, upgrade, showPayment, showCoinAnimation, isStartWalletAnimation,
    showDownload, downloadLink,
    price: computed(() => last.value?.file.price ?? 0),
    // After a plan upgrade, retry the file that needed it.
    retryAfterUpgrade: () => {
      showPayment.value = false
      if (last.value) download(last.value.paper, last.value.file)
    },
    onCoinAnimationDone: () => {
      showCoinAnimation.value = false
      isStartWalletAnimation.value = true
    },
    onWalletAnimationDone: () => {
      showDownload.value = true
      isStartWalletAnimation.value = false
    },
  }
}
