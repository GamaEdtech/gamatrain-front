<template>
  <!-- The file on the shared download row, in the same gold section as the exam and past paper pages. -->
  <section
    v-if="files?.exist"
    class="downloads bg-softGold w-100 rounded-lg px-5 pt-4 pb-2 mt-4"
    aria-labelledby="multimedia-downloads-title"
  >
    <h2
      id="multimedia-downloads-title"
      class="text-h4 font-weight-heavy text-brandNavy mb-3"
    >
      Download this file
    </h2>

    <common-download-file-row
      :badge="row.badge"
      :color="row.color"
      :label="row.label"
      :points="files.paid ? null : row.points"
      :owned="files.paid"
      :summary="row.summary"
      :status="status"
      :busy="isDownloading(files.ext)"
      :progress="getDownloadProgress(files.ext)"
      @click="handleDownloadClick"
    />

    <div class="d-flex justify-end flex-wrap ga-2 text-h6 text-grey600 py-2">
      <nuxt-link
        to="/user/subscription"
        class="font-weight-bold text-generalSearchQuiz text-no-wrap"
      >Compare plans</nuxt-link>
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
  </section>
</template>

<script setup lang="ts">
import type {
  MultimediaFileInfoDTO,
  DownloadResponseDTO,
  UpgradeSuggestionsDTO,
  BillingInterval,
} from '@/types'
import { buildMultimediaFileRow } from '@/utils/downloadFileRows'

interface IDownloadButtons {
  files: MultimediaFileInfoDTO
  id: string
  title: string
  titleUrl: string
}

const props = defineProps<IDownloadButtons>()

const row = computed(() => buildMultimediaFileRow(props.files.ext, props.files.size, props.files.pages, props.files.price))

const downloadIssue = ref(false)
const downloadIssueLink = ref('')
const showCoinPaymentModal = ref(false)
const showCoinAnimation = ref(false)
const isStartWalletAnimation = ref(false)
const priceFile = ref(0)
const paymentPlans = ref<UpgradeSuggestionsDTO[]>([])
const billingInterval = ref<BillingInterval[]>([])
const currentPlanTitle = ref<string | null>(null)
const currentPlanId = ref<number | null>(null)

const { getDownloadProgress, isDownloading, startDownload } = useDownloadWithProgress({
  contentType: 'Multimedia',
  id: props.id,
  trackPayload: () => ({
    file_type: 'multimedia',
    file_name: props.title,
    file_url: props.titleUrl,
  }),
  onDownloaded: (data) => {
    downloadIssueLink.value = data.url || ''
    if (data.spent) {
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

const status = computed(() => (isDownloading(props.files.ext)
  ? { text: `Downloading ${Math.round(getDownloadProgress(props.files.ext))}%`, color: 'text-grey600' }
  : null))

const handleDownloadClick = () => {
  if (isDownloading(props.files.ext)) return
  priceFile.value = props.files.price ?? 0
  startDownload({ type: props.files.ext })
}

const handleAnimationComplete = () => {
  showCoinAnimation.value = false
  isStartWalletAnimation.value = true
}

const completeWalletAnimation = () => {
  downloadIssue.value = true
  isStartWalletAnimation.value = false
}

const upgradePlanSuccessfully = () => {
  showCoinPaymentModal.value = false
  startDownload({ type: props.files.ext })
}
</script>

<style scoped>
.downloads {
  border-top: 2px solid rgb(var(--v-theme-primary));
}
</style>
