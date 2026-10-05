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
      v-if="contentData?.exam.file_pdf"
      rounded="pill"
      class="width-btn btn-pdf d-flex align-center justify-center"
      flat
      height="42"
      width="280"
      :loading="isDownloading('pdf')"
      @click="handleDownloadClick('pdf', contentData?.price.price ?? 0)"
    >
      <template #loader>
        <v-progress-circular
          :model-value="getDownloadProgress('pdf')"
          color="lightError"
          size="24"
          width="3"
        />
      </template>
      <v-icon
        color="lightError"
        size="20"
      >
        md:picture_as_pdf_outlined
      </v-icon>
      <span class="text-lightError text-h5 font-weight-bold mt-1 mx-2">Download key</span>

      <common-price-with-gem
        class="text-lightError text-h5 font-weight-bold mt-1"
        :price="contentData?.price.price"
        color="lightError"
      />
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
  UpgradeSuggestionsDTO,
  BillingInterval } from '@/types'

const props = defineProps<{
  contentData: ExamResultDetailDTO
}>()

const showCoinPaymentModal = ref(false)
const showCoinAnimation = ref(false)
const isStartWalletAnimation = ref(false)
const priceFile = ref(0)
const pendingDownload = ref<{
  type: string
  extraId?: string
} | null>(null)
const downloadIssue = ref(false)
const downloadIssueLink = ref('')
const paymentPlans = ref<UpgradeSuggestionsDTO[]>([])
const billingInterval = ref<BillingInterval[]>([])
const currentPlanTitle = ref<string | null>(null)
const currentPlanId = ref<number | null>(null)

const {
  // clearDownload,
  getDownloadProgress,
  isDownloading,
  startDownload,
} = useDownloadWithProgress({
  contentType: 'Exam',
  id: Number(props.contentData.exam.id),
  trackPayload: () => ({
    file_type: 'quiz',
    file_name: props.contentData.exam.title || '',
    file_url: props.contentData.exam.title || '',
  }),
  onDownloaded: (data) => {
    downloadIssueLink.value = data.url || ''
    if (data.spent) {
      showCoinAnimation.value = true
    }
    else {
      downloadIssue.value = true
    }
    pendingDownload.value = null
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

const handleDownloadClick = async (type: string, price: number, extraId?: string) => {
  priceFile.value = price
  pendingDownload.value = {
    type,
    extraId,
  }

  startDownload({ type, extraId })
}

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
  if (pendingDownload.value) {
    startDownload({ type: pendingDownload.value.type, extraId: pendingDownload.value.extraId })
  }
}
</script>

<style scoped>
.btn-pdf {
  background-color : rgb(var(--v-theme-lightError), 0.25);
  border: 1px solid rgb(var(--v-theme-lightError));
}
</style>
