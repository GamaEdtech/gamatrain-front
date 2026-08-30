<template>
  <div
    class="buttons-downlaod-div w-100 d-flex flex-wrap align-start justify-center mt-4"
  >
    <div
      v-if="xs && openModalDownloadMobile"
      class="overlay-div"
      @click="openModalDownloadMobile = false"
    />
    <div
      :class="`w-100 d-flex flex-column flex-sm-row flex-wrap align-start justify-start justify-sm-space-between ga-2 py-8 px-4 pa-sm-0 ${
        xs ? `mobile-style-bottom-sheet` : ``
      } ${openModalDownloadMobile ? `set-bottom` : ``}`"
    >
      <div
        class="d-flex d-sm-none w-100 align-center justify-center position-relative mb-6"
      >
        <div class="line-bottom-sheet" />
        <v-icon
          color="grey400"
          size="30"
          class="position-absolute right-0 cursor-pointer"
          @click="openModalDownloadMobile = false"
        >
          md:close
        </v-icon>
      </div>
      <v-btn
        v-if="files.pdf"
        rounded="pill"
        class="width-btn btn-pdf d-flex align-center justify-center"
        flat
        height="42"
        :loading="isDownloading('pdf')"
        @click="handleDownloadClick('pdf', files.pdf.price ?? 0)"
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
        <span class="text-pdf text-h5 font-weight-bold mt-1 mx-2">Download PDF</span>

        <span
          v-if="files.pdf.price && files.pdf.price != 0"
          class="text-pdf text-h5 font-weight-bold mt-1"
        >{{ files.pdf.price }}
          <v-icon
            size="20"
            color="lightError"
          >
            md:diamond_outlined
          </v-icon>
        </span>
      </v-btn>

      <v-btn
        v-if="files.participation"
        rounded="pill"
        class="width-btn btn-begin-quiz d-flex align-center justify-center"
        color="#5500e835"
        flat
        height="42"
        :to="`/exam/start/${id}`"
      >
        <template v-if="examUserData && (examUserData as ExamUserDataExamDetaiDTO)?.status == '1'">
          <span class="text-begin-quiz text-h5 font-weight-bold mt-1 mx-2">
            Show result</span>
        </template>
        <template v-else>
          <span class="text-begin-quiz text-h5 font-weight-bold mt-1 mx-2">
            Start Exam</span>
          <span
            v-if="files.participation.price && files.participation.price != 0"
            class="text-begin-quiz text-h5 font-weight-bold mt-1"
          >{{ files.participation.price }}
            <v-icon
              size="20"
              color="#5500e835"
            >
              md:diamond_outlined
            </v-icon>
          </span>
        </template>
      </v-btn>
    </div>

    <div
      class="cursor-pointer d-flex justify-space-between align-center d-sm-none w-100 rounded-pill button-mobile-download bg-primary px-4"
      @click="openModalDownloadMobile = !openModalDownloadMobile"
    >
      <span class="text-h5 font-weight-bold">
        <v-icon
          color="black"
          size="20"
        >md:download</v-icon>
        Download
      </span>
      <v-icon color="black">
        md:keyboard_arrow_down
      </v-icon>
    </div>

    <!-- Coin Payment Modal -->
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

    <!-- Coin Consumption Animation -->
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
</template>

<script setup lang="ts">
import type {
  PriceExamDetaiDTO,
  ExamUserDataExamDetaiDTO,
  DownloadResponseDTO,
  UpgradeSuggestionsDTO,
  BillingInterval,
} from '@/types'
import { useDisplay } from 'vuetify'

interface IDownloadButtons {
  files: PriceExamDetaiDTO
  id: string
  title: string
  titleUrl: string
  examUserData: ExamUserDataExamDetaiDTO | boolean
}

const props = defineProps<IDownloadButtons>()

const { xs } = useDisplay()

const showCoinPaymentModal = ref(false)
const showCoinAnimation = ref(false)
const isStartWalletAnimation = ref(false)
const priceFile = ref(0)
const pendingDownload = ref<{
  type: string
  extraId?: string
} | null>(null)
const openModalDownloadMobile = ref(false)
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
  id: props.id,
  trackPayload: () => ({
    file_type: 'quiz',
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
.width-btn {
  width: 48%;
}
.btn-begin-quiz {
  border: 1px solid #5600e8;
}
.text-begin-quiz {
  color: #5600e8;
}
.btn-pdf {
  background-color : rgb(var(--v-theme-lightError), 0.25);
  border: 1px solid rgb(var(--v-theme-lightError));
}
.text-pdf {
    color: rgb(var(--v-theme-lightError));
}
.button-mobile-download {
  height: 46px;
}
.button-mobile-download:hover {
  opacity: 0.9;
}
.line-bottom-sheet {
  width: 80px;
  height: 6px;
  border-radius: 20px;
  background-color: rgb(var(--v-theme-grey300));
}

@media only screen and (max-width: 600px) {
  .overlay-div {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.32);
    z-index: 1005;
  }
  .mobile-style-bottom-sheet {
    position: fixed;
    left: 0;
    bottom: -300px;
    min-height: 200px;
    background-color: white;
    border-radius: 24px 24px 0 0;
    z-index: 1006;
    transition: all 0.5s;
  }
  .set-bottom {
    bottom: 0;
  }
  .width-btn {
    width: 100%;
  }
}
</style>
