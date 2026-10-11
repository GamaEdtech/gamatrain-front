<template>
  <div class="w-100 d-flex align-center justify-space-between ga-2 mt-4 flex-wrap">
    <div class="d-flex flex-column align-start">
      <h1 class="text-h4 text-grey700 font-weight-regular">
        Exam Result
      </h1>
      <span
        v-if="contentData?.exam.title"
        class="text-grey500 text-h6 mt-1"
      >
        {{ contentData?.exam.title }}
      </span>
    </div>

    <v-btn
      rounded="pill"
      class="width-btn btn-pdf d-flex align-center justify-center"
      flat
      height="42"
      width="280"
      @click="startExport(exportFileType)"
    >
      <!-- Generating: the server is building the file (before any byte arrives). -->
      <template v-if="getPhase(exportFileType) === 'cooking'">
        <span class="text-lightError text-h5 font-weight-bold mt-1 ml-2">Cooking for you</span>
        <v-icon
          class="heart-blink ml-1"
          color="lightError"
          size="20"
        >
          md:favorite
        </v-icon>
      </template>

      <!-- Streaming the finished file, with real progress. -->
      <template v-else-if="getPhase(exportFileType) === 'downloading'">
        <v-progress-circular
          :model-value="getProgress(exportFileType)"
          color="lightError"
          size="24"
          width="3"
        />
        <span class="text-lightError text-h5 font-weight-bold mt-1 mx-2">
          Downloading {{ getProgress(exportFileType) }}%
        </span>
      </template>

      <template v-else>
        <span
          class="text-lightError icon-pdf icon-size mt-1"
          aria-hidden="true"
        />
        <span class="text-lightError text-h5 font-weight-bold mt-1 mx-2">Download key</span>

        <span
          v-if="getPrice(exportFileType)?.purchased"
          class="text-lightError text-h6 font-weight-bold mt-1"
        >Owned</span>
        <common-price-with-gem
          v-else-if="getPrice(exportFileType)"
          class="text-lightError text-h5 font-weight-bold mt-1"
          :price="getPrice(exportFileType)?.points"
          color="lightError"
        />
      </template>
    </v-btn>

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

    <lazy-common-modal-base
      v-model:show-dialog="downloadIssue"
      :max-width="600"
      title="Download"
    >
      <lazy-common-modal-download-file
        :link="downloadIssueLink"
        @close="downloadIssue = false"
      />
    </lazy-common-modal-base>
  </div>
</template>

<script setup lang="ts">
import type { ExamResultDetailDTO,
  DownloadResponseDTO,
  ExamExportFileType,
  UpgradeSuggestionsDTO,
  BillingInterval } from '@/types'

const props = defineProps<{
  contentData: ExamResultDetailDTO
}>()

const exportFileType: ExamExportFileType = 'Pdf'

const showCoinPaymentModal = ref(false)
const showCoinAnimation = ref(false)
const isStartWalletAnimation = ref(false)
const priceFile = ref(0)
const downloadIssue = ref(false)
const downloadIssueLink = ref('')
const paymentPlans = ref<UpgradeSuggestionsDTO[]>([])
const billingInterval = ref<BillingInterval[]>([])
const currentPlanTitle = ref<string | null>(null)
const currentPlanId = ref<number | null>(null)

// "Show file in new tab" opens the file that was just generated, kept as an object URL.
const setDownloadIssueLink = (file?: Blob) => {
  if (downloadIssueLink.value) {
    window.URL.revokeObjectURL(downloadIssueLink.value)
  }
  downloadIssueLink.value = file ? window.URL.createObjectURL(file) : ''
}

// The same generated export as the exam details page (gamatrain-back exams/export),
// not the file saved with the exam.
const {
  fetchPrices,
  getPrice,
  getPhase,
  getProgress,
  startExport,
} = useExamExportDownload({
  examId: props.contentData.exam.id,
  title: props.contentData.exam.title || '',
  titleUrl: props.contentData.exam.title || '',
  onDownloaded: (points, file) => {
    setDownloadIssueLink(file)
    if (points > 0) {
      priceFile.value = points
      showCoinAnimation.value = true
    }
    else {
      downloadIssue.value = true
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

const handleAnimationComplete = async () => {
  // Close everything immediately when animation completes
  showCoinAnimation.value = false
  isStartWalletAnimation.value = true
}

const completeWalletAnimation = () => {
  downloadIssue.value = true
  isStartWalletAnimation.value = false
}

const upgradePlanSuccessfully = async () => {
  showCoinPaymentModal.value = false
  startExport(exportFileType)
}

onMounted(() => {
  fetchPrices()
})

onBeforeUnmount(() => {
  setDownloadIssueLink()
})
</script>

<style scoped>
.btn-pdf {
  background-color : rgb(var(--v-theme-lightError), 0.25);
  border: 1px solid rgb(var(--v-theme-lightError));
}
.icon-size{
  font-size : 24px;
}
/* "Cooking" phase: a blinking (pulsing) heart while the server generates the file. */
.heart-blink {
  animation: heart-blink 1s ease-in-out infinite;
}
@keyframes heart-blink {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.25;
    transform: scale(0.8);
  }
}
</style>
