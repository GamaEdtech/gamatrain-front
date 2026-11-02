<template>
  <v-card
    class="action-card"
    rounded="xl"
    border
    elevation="0"
  >
    <template v-if="participation">
      <div class="bg-quizFill px-6 py-5">
        <p class="text-h6 text-white opacity-90">
          Take it online
        </p>
        <p class="gama-text-h4 text-white">
          {{ participation.price ? `${participation.price} Gems` : 'Free' }}
          <span class="text-h6 font-weight-semibold opacity-90">· instant score</span>
        </p>
      </div>

      <div class="px-6 pt-5">
        <v-btn
          block
          color="primary"
          size="x-large"
          rounded="lg"
          flat
          class="text-h5 font-weight-heavy text-none"
          prepend-icon="md:play_arrow"
          @click="startExam"
        >
          {{ hasFinished ? 'Show result' : 'Start quiz' }}
        </v-btn>
        <p
          v-if="!hasFinished"
          class="text-h6 text-grey500 text-center mt-2"
        >
          Sign in to save your result
        </p>
      </div>
    </template>

    <section
      id="exam-downloads"
      class="downloads bg-softGold px-6 pt-5 pb-3"
      :class="{ 'mt-5': participation }"
      aria-labelledby="exam-downloads-title"
    >
      <div class="d-flex align-baseline justify-space-between ga-2">
        <h2
          id="exam-downloads-title"
          class="text-h4 font-weight-heavy text-brandNavy"
        >
          Download this quiz
        </h2>
        <span class="text-h6 font-weight-bold text-grey700 text-no-wrap">
          <v-icon
            size="14"
            color="grey700"
          >md:check</v-icon>
          Pay once
        </span>
      </div>
      <p class="text-h6 text-grey600 mt-1 mb-3">
        Ready-to-use files with all {{ questionCount }} questions
      </p>

      <exam-export-format-row
        v-for="format in examExportFormats"
        :key="format.fileType"
        class="mb-2"
        :format="format"
        :price="getPrice(format.fileType)"
        :phase="getPhase(format.fileType)"
        :progress="getProgress(format.fileType)"
        :retry="getRetry(format.fileType)"
        @click="handleExportClick(format.fileType)"
      />

      <div class="d-flex justify-end ga-2 text-h6 text-grey600 py-2">
        <nuxt-link
          to="/user/subscription"
          class="font-weight-bold text-generalSearchQuiz text-no-wrap"
        >Compare plans</nuxt-link>
      </div>
    </section>

    <div class="d-flex align-center justify-space-around px-6 py-3 text-grey600">
      <common-bookmark-button
        :id="id"
        type="exams"
      />
      <v-btn
        variant="text"
        size="small"
        color="grey600"
        class="text-none text-h6"
        prepend-icon="md:share"
        @click="emit('share')"
      >
        Share
      </v-btn>
      <v-btn
        variant="text"
        size="small"
        color="grey600"
        class="text-none text-h6"
        prepend-icon="md:flag_outlined"
        @click="emit('report')"
      >
        Report
      </v-btn>
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
  </v-card>
</template>

<script setup lang="ts">
import type {
  BillingInterval,
  DownloadResponseDTO,
  ExamExportFileType,
  ExamUserDataExamDetaiDTO,
  ParticipationExamDetaiDTO,
  UpgradeSuggestionsDTO,
} from '@/types'
import { examExportFormats } from '@/utils/examExportFormats'

interface IActionCard {
  id: string
  title: string
  titleUrl: string
  questionCount: number
  /** Missing when the quiz can't be taken online; the card then only sells the files. */
  participation?: ParticipationExamDetaiDTO
  examUserData?: ExamUserDataExamDetaiDTO | boolean
}

const props = defineProps<IActionCard>()

const emit = defineEmits<{
  share: []
  report: []
}>()

// Finished attempts still go through the start page, which sends them on to their result.
const hasFinished = computed(() =>
  typeof props.examUserData === 'object' && props.examUserData?.status == '1',
)

const { startExam } = useExamStart(() => props.id)

const showCoinPaymentModal = ref(false)
const showCoinAnimation = ref(false)
const isStartWalletAnimation = ref(false)
const priceFile = ref(0)
const pendingExport = ref<ExamExportFileType | null>(null)
const paymentPlans = ref<UpgradeSuggestionsDTO[]>([])
const billingInterval = ref<BillingInterval[]>([])
const currentPlanTitle = ref<string | null>(null)
const currentPlanId = ref<number | null>(null)

const {
  fetchPrices,
  getPrice,
  getPhase,
  getProgress,
  getRetry,
  startExport,
} = useExamExportDownload({
  examId: props.id,
  title: props.title,
  titleUrl: props.titleUrl,
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

const handleAnimationComplete = () => {
  showCoinAnimation.value = false
  isStartWalletAnimation.value = true
}

const completeWalletAnimation = () => {
  isStartWalletAnimation.value = false
}

const upgradePlanSuccessfully = () => {
  showCoinPaymentModal.value = false
  if (pendingExport.value) {
    startExport(pendingExport.value)
  }
}

const { user } = useUser()

onMounted(() => {
  fetchPrices()
})
// Logging in through the dialog keeps the page: reload so "Owned" shows the user's purchases (and clears on logout).
watch(user, () => {
  fetchPrices()
})
</script>

<style scoped>
.action-card {
  box-shadow: 0 12px 32px -12px rgba(var(--v-theme-brandNavy), 0.18) !important;
}
.downloads {
  border-top: 2px solid rgb(var(--v-theme-primary));
}
</style>
