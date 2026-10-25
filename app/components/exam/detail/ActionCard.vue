<template>
  <v-card
    class="action-card"
    rounded="xl"
    border
    elevation="0"
  >
    <template v-if="participation">
      <div class="bg-generalSearchQuiz px-6 py-5">
        <p class="text-h6 text-white opacity-80">
          Take it online
        </p>
        <p class="gama-text-h4 text-white">
          {{ participation.price ? `${participation.price} Gems` : 'Free' }}
          <span class="text-h6 font-weight-semibold opacity-80">· instant score</span>
        </p>
      </div>

      <div class="px-6 pt-5">
        <v-btn
          block
          color="primary"
          size="x-large"
          rounded="lg"
          flat
          class="text-h5 font-weight-heavy text-none text-brandNavy"
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

      <v-card
        v-for="format in examExportFormats"
        :key="format.fileType"
        class="format-row d-flex align-center ga-3 pa-3 mb-2"
        :class="{ 'format-row--owned': getPrice(format.fileType)?.purchased }"
        rounded="lg"
        elevation="0"
        :aria-label="`Download ${format.label}`"
        @click="handleExportClick(format.fileType)"
      >
        <span
          class="file-icon d-flex align-end justify-center pb-1 text-white font-weight-heavy rounded"
          :class="`bg-${format.color}`"
          aria-hidden="true"
        >{{ format.badge }}</span>

        <span class="flex-grow-1 d-flex flex-column overflow-hidden">
          <span class="text-h5 font-weight-heavy text-brandNavy">{{ format.label }}</span>
          <!-- The server is building the file (before any byte arrives). -->
          <span
            v-if="getPhase(format.fileType) === 'cooking'"
            class="text-h6 text-grey600"
          >
            Cooking for you
            <v-icon
              class="heart-blink"
              color="lightError"
              size="14"
            >md:favorite</v-icon>
          </span>
          <span
            v-else-if="getPhase(format.fileType) === 'downloading'"
            class="text-h6 text-grey600"
          >Downloading {{ getProgress(format.fileType) }}%</span>
          <span
            v-else
            class="text-h6 text-grey500"
          >{{ format.summary }}</span>
        </span>

        <span
          v-if="getPrice(format.fileType)?.purchased"
          class="text-h6 font-weight-heavy text-success500"
        >Owned</span>
        <span
          v-else-if="getPrice(format.fileType)"
          class="d-flex align-center ga-1 text-h5 font-weight-heavy text-brandNavy text-no-wrap"
        >
          <v-icon
            size="16"
            color="generalSearchQuiz"
            aria-hidden="true"
          >md:diamond_outlined</v-icon>
          {{ getPrice(format.fileType)?.points }} Gems
        </span>

        <span
          class="go-button d-flex align-center justify-center rounded-lg"
          :class="getPrice(format.fileType)?.purchased ? 'bg-success500' : 'bg-primary'"
          aria-hidden="true"
        >
          <v-progress-circular
            v-if="getPhase(format.fileType)"
            :indeterminate="getPhase(format.fileType) === 'cooking'"
            :model-value="getProgress(format.fileType)"
            size="18"
            width="2"
          />
          <v-icon
            v-else
            size="18"
          >md:download</v-icon>
        </span>
      </v-card>

      <div class="d-flex justify-space-between ga-2 text-h6 text-grey600 py-2">
        <span>Your plan's limit is used first, then Gems.</span>
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
  ExamExportPriceDTO,
  ExamUserDataExamDetaiDTO,
  ParticipationExamDetaiDTO,
  UpgradeSuggestionsDTO,
} from '@/types'

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
  /** The export prices, for the comparison table and the FAQ, which show the same numbers. */
  prices: [prices: ExamExportPriceDTO[]]
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
  prices,
  fetchPrices,
  getPrice,
  getPhase,
  getProgress,
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

watch(prices, value => emit('prices', value), { immediate: true })

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
.format-row {
  border: 1.5px solid rgb(var(--v-theme-primary50));
  cursor: pointer;
}
.format-row--owned {
  border-color: rgb(var(--v-theme-success300));
}
.file-icon {
  position: relative;
  flex: none;
  width: 36px;
  height: 42px;
  font-size: 0.95rem;
}
.file-icon::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border-bottom-left-radius: 5px;
  background: rgba(var(--v-theme-white), 0.45);
}
.go-button {
  flex: none;
  width: 34px;
  height: 34px;
  color: rgb(var(--v-theme-brandNavy));
}
.format-row--owned .go-button {
  color: rgb(var(--v-theme-white));
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
