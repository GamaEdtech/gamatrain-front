<template>
  <!-- The paper's actions in the exam details card's layout: take it online (when an online test was made from it),
       download its files on the shared download rows, then save/share/report. -->
  <v-card
    class="action-card"
    rounded="lg"
    border
    elevation="0"
  >
    <div
      v-if="onlineExamId"
      class="bg-quizFill px-6 py-5 d-flex flex-wrap align-center justify-space-between ga-4"
    >
      <div>
        <p class="text-h6 text-white opacity-90">
          Take it online
        </p>
        <p class="gama-text-h4 text-white">
          Instant score
          <span class="text-h6 font-weight-semibold opacity-90">· with the correct answers</span>
        </p>
      </div>
      <v-btn
        color="primary"
        size="x-large"
        rounded="lg"
        flat
        class="start-button text-h5 font-weight-heavy text-none"
        prepend-icon="md:play_arrow"
        @click="startExam"
      >
        Start quiz
      </v-btn>
    </div>

    <section
      id="paper-downloads"
      class="downloads bg-softGold px-6 pt-5 pb-3"
      aria-labelledby="paper-downloads-title"
    >
      <h2
        id="paper-downloads-title"
        class="text-h4 font-weight-heavy text-brandNavy"
      >
        Download this {{ isPaper ? 'paper' : 'file' }}
      </h2>
      <p
        v-if="rows.length > 1"
        class="text-h6 text-grey600 mt-1"
      >
        {{ rows.length }} files, each downloaded on its own
      </p>

      <div class="file-rows mt-3">
        <common-download-file-row
          v-for="row in rows"
          :key="row.key"
          :badge="row.badge"
          :color="row.color"
          :label="row.label"
          :points="row.points"
          :owned="isOwned(row)"
          :summary="row.summary"
          :status="rowStatus(row)"
          :busy="isDownloading(row.type, row.extraId)"
          :progress="getDownloadProgress(row.type, row.extraId)"
          @click="handleDownloadClick(row)"
        />
      </div>
      <p
        v-if="!rows.length"
        class="text-h5 text-grey600"
      >
        No files are available for this paper yet.
      </p>

      <p
        v-if="answersInFile"
        class="d-flex align-center ga-1 text-h6 font-weight-bold text-success500 mt-3"
      >
        <v-icon
          size="16"
          aria-hidden="true"
        >
          md:check
        </v-icon>
        Answers are at the end of the question paper file
      </p>

      <div class="d-flex justify-end flex-wrap ga-2 text-h6 text-grey600 py-2 mt-1">
        <nuxt-link
          to="/user/subscription"
          class="font-weight-bold text-generalSearchQuiz text-no-wrap"
        >Compare plans</nuxt-link>
      </div>
    </section>

    <div class="d-flex align-center justify-space-around px-6 py-3 text-grey600">
      <common-bookmark-button
        :id="id"
        type="papers"
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
  ApiResult,
  BillingInterval,
  DownloadResponseDTO,
  FilesDTO,
  UpgradeSuggestionsDTO,
} from '@/types'
import { buildPaperFileRows } from '@/utils/downloadFileRows'
import type { DownloadFileRowData } from '@/utils/downloadFileRows'

const props = defineProps<{
  id: string
  title: string
  titleUrl: string
  files: FilesDTO
  isPaper: boolean
  /** Page count of the question file. */
  qFilePages?: string | number | null
  /** The paper's published online test, when there is one. */
  onlineExamId?: string
  /** The answers sit at the end of the question file rather than in a file of their own. */
  answersInFile?: boolean
}>()

const emit = defineEmits<{
  share: []
  report: []
}>()

const { startExam } = useExamStart(() => props.onlineExamId ?? '')

const rows = computed(() => buildPaperFileRows(props.files, props.isPaper, props.qFilePages))

// Which files the signed-in viewer already owns (downloading them again is free), asked per user after load: the page
// itself is cached for everyone, so it can't carry this. gama-api only reports pdf/word/answer, not the extra files.
const { isAuthenticatedUi } = useAuth()
const { user } = useUser()
const owned = ref<Partial<Record<'pdf' | 'word' | 'answer', boolean>>>({})
const isOwned = (row: DownloadFileRowData) => owned.value[row.type as 'pdf' | 'word' | 'answer'] === true

const loadOwnership = async () => {
  if (!isAuthenticatedUi.value || !props.id) {
    owned.value = {}
    return
  }
  try {
    const response = await useApiService.get<ApiResult<{ pdf: boolean, word: boolean, answer: boolean }>>(
      `/api/v2/downloads/papers/${props.id}/owned`,
    )
    owned.value = response.succeeded && response.data ? response.data : {}
  }
  catch {
    owned.value = {}
  }
}

onMounted(loadOwnership)
// Signing in (or out) through the dialog keeps the page, so ask again.
watch(user, loadOwnership)

const showCoinPaymentModal = ref(false)
const showCoinAnimation = ref(false)
const isStartWalletAnimation = ref(false)
const priceFile = ref(0)
const pendingDownload = ref<DownloadFileRowData | null>(null)
const paymentPlans = ref<UpgradeSuggestionsDTO[]>([])
const billingInterval = ref<BillingInterval[]>([])
const currentPlanTitle = ref<string | null>(null)
const currentPlanId = ref<number | null>(null)
const downloadIssue = ref(false)
const downloadIssueLink = ref('')

const { getDownloadProgress, isDownloading, startDownload } = useDownloadWithProgress({
  contentType: 'PastPaper',
  id: props.id,
  trackPayload: () => ({
    file_type: 'past_paper',
    file_name: props.title,
    file_url: props.titleUrl,
  }),
  onDownloaded: (data) => {
    // Just bought, so it is owned now.
    if (pendingDownload.value && pendingDownload.value.type !== 'extra') {
      owned.value = { ...owned.value, [pendingDownload.value.type]: true }
    }
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

const rowStatus = (row: DownloadFileRowData) => {
  if (!isDownloading(row.type, row.extraId)) return null
  return { text: `Downloading ${Math.round(getDownloadProgress(row.type, row.extraId))}%`, color: 'text-grey600' }
}

const handleDownloadClick = (row: DownloadFileRowData) => {
  if (isDownloading(row.type, row.extraId)) return
  priceFile.value = row.points
  pendingDownload.value = row
  startDownload({ type: row.type, extraId: row.extraId })
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
  if (pendingDownload.value) {
    startDownload({ type: pendingDownload.value.type, extraId: pendingDownload.value.extraId })
  }
}
</script>

<style scoped lang="scss">
@use 'sass:map';
@use 'vuetify/settings' as vuetify;

.action-card {
  box-shadow: 0 12px 32px -12px rgba(var(--v-theme-brandNavy), 0.18) !important;
}
.downloads {
  border-top: 2px solid rgb(var(--v-theme-primary));
}
.file-rows {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 8px;
}
@media #{map.get(vuetify.$display-breakpoints, 'xs')} {
  .start-button {
    width: 100%;
  }
}
</style>
