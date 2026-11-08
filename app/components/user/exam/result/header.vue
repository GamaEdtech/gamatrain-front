<template>
  <div class="w-100 d-flex flex-column ga-4 mt-4">
    <div class="d-flex flex-column align-start">
      <h1 class="text-h6 text-grey700 font-weight-regular">
        Exam Result
      </h1>
      <span
        v-if="contentData?.exam.title"
        class="text-grey500 text-caption font-weight-medium mt-1"
      >
        {{ contentData?.exam.title }}
      </span>
    </div>

    <div class="d-flex flex-column flex-md-row ga-2">
      <exam-export-format-row
        v-for="format in examExportFormats"
        :key="format.fileType"
        class="flex-grow-1"
        :format="format"
        :price="getPrice(format.fileType)"
        :phase="getPhase(format.fileType)"
        :progress="getProgress(format.fileType)"
        :retry="getRetry(format.fileType)"
        @click="handleExportClick(format.fileType)"
      />
    </div>

    <lazy-common-modal-base
      v-model:show-dialog="showCoinPaymentModal"
      :max-width="900"
      title="Get Membership. Unlock Premium Downloads."
      subtitle="Join +50,000 Students"
    >
      <common-modal-payment
        :plans="paymentPlans"
        :billing-interval="billingInterval"
        :current-plan-id="currentPlanId"
        :current-plan-title="currentPlanTitle"
        @dismiss="showCoinPaymentModal = false"
        @switch-successfully="upgradePlanSuccessfully"
      />
    </lazy-common-modal-base>

    <lazy-common-coin-consumption-animation
      v-model:is-visible="showCoinAnimation"
      @animation-complete="handleAnimationComplete"
    />

    <lazy-test-counting-wallet-animation
      :is-start-animation="isStartWalletAnimation"
      :direction="-1"
      :delta-price="priceFile"
      @complete-animation="completeWalletAnimation"
    />
  </div>
</template>

<script setup lang="ts">
import type { ExamResultDetailDTO,
  DownloadResponseDTO,
  ExamExportFileType,
  UpgradeSuggestionsDTO,
  BillingInterval } from '@/types'
import { examExportFormats } from '@/utils/examExportFormats'

const props = defineProps<{
  contentData: ExamResultDetailDTO
}>()

const showCoinPaymentModal = ref(false)
const showCoinAnimation = ref(false)
const isStartWalletAnimation = ref(false)
const priceFile = ref(0)
const paymentPlans = ref<UpgradeSuggestionsDTO[]>([])
const billingInterval = ref<BillingInterval[]>([])
const currentPlanTitle = ref<string | null>(null)
const currentPlanId = ref<number | null>(null)
const pendingExport = ref<ExamExportFileType | null>(null)

// The same generated export as the exam details page (gamatrain-back exams/export),
// not the file saved with the exam.
const {
  fetchPrices,
  getPrice,
  getPhase,
  getProgress,
  getRetry,
  startExport,
} = useExamExportDownload({
  examId: props.contentData.exam.id,
  title: props.contentData.exam.title || '',
  titleUrl: props.contentData.exam.title || '',
  onDownloaded: (points) => {
    pendingExport.value = null
    if (points > 0) {
      priceFile.value = points
      showCoinAnimation.value = true
    }
  },
  onInsufficientBalance: () => {
    showCoinPaymentModal.value = true
  },
  onUpgradeSuggestions: (data: DownloadResponseDTO) => {
    paymentPlans.value = data.upgradeSuggestions || []
    billingInterval.value = data.availableBillingIntervals || []
    currentPlanTitle.value = data.currentPlanTitle
    currentPlanId.value = data.currentPlanId
    showCoinPaymentModal.value = true
  },
})

const handleExportClick = (fileType: ExamExportFileType) => {
  pendingExport.value = fileType
  startExport(fileType)
}

const handleAnimationComplete = async () => {
  // Close everything immediately when animation completes
  showCoinAnimation.value = false
  isStartWalletAnimation.value = true
}

const completeWalletAnimation = () => {
  isStartWalletAnimation.value = false
}

const upgradePlanSuccessfully = async () => {
  showCoinPaymentModal.value = false
  if (pendingExport.value) {
    startExport(pendingExport.value)
  }
}

onMounted(() => {
  fetchPrices()
})
</script>
