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
          color="#98A2B3"
          size="30"
          class="position-absolute right-0 cursor-pointer"
          @click="openModalDownloadMobile = false"
        >
          md:close
        </v-icon>
      </div>
      <v-btn
        v-if="files.pdf.exist"
        rounded="pill"
        class="width-btn btn-pdf d-flex align-center justify-center"
        color="#f0443835"
        flat
        height="42"
        :loading="isDownloading('pdf')"
        @click="handleDownloadClick('pdf', files.pdf.price)"
      >
        <template #loader>
          <v-progress-circular
            :model-value="getDownloadProgress('pdf')"
            color="#f04438"
            size="24"
            width="3"
          />
        </template>
        <v-icon
          color="#f04438"
          size="20"
        >
          md:picture_as_pdf_outlined
        </v-icon>
        <span class="text-pdf text-h5 font-weight-bold mt-1 mx-2">Download {{ isPaper ? 'Question Paper' : 'PDF' }}</span>

        <span
          v-if="files.pdf.price && files.pdf.price != 0"
          class="text-pdf text-h5 font-weight-bold mt-1"
        >{{ files.pdf.price }} <span class="text-h6 font-weight-normal">GEM</span></span>
      </v-btn>

      <v-btn
        v-if="files.word.exist"
        rounded="pill"
        class="width-btn btn-word d-flex align-center justify-center"
        color="#2e90fa35"
        flat
        height="42"
        :loading="isDownloading('word')"
        @click="handleDownloadClick('word', files.word.price)"
      >
        <template #loader>
          <v-progress-circular
            :model-value="getDownloadProgress('word')"
            color="#2e90fa"
            size="24"
            width="3"
          />
        </template>
        <v-icon
          color="#2e90fa"
          size="20"
        >
          md:description_outlined
        </v-icon>
        <span class="text-word text-h5 font-weight-bold mt-1 mx-2">Download {{ isPaper ? 'Question Doc': 'DOC' }}</span>

        <span
          v-if="files.word.price && files.word.price !=0"
          class="text-word text-h5 font-weight-bold mt-1"
        >{{ files.word.price }} <span class="text-h6 font-weight-normal">GEM</span></span>
      </v-btn>

      <v-btn
        v-if="files.answer.exist"
        rounded="pill"
        class="width-btn btn-answer d-flex align-center justify-center"
        color="#00808035"
        flat
        height="42"
        :loading="isDownloading('answer')"
        @click="handleDownloadClick('answer', files.answer.price)"
      >
        <template #loader>
          <v-progress-circular
            :model-value="getDownloadProgress('answer')"
            color="#008080"
            size="24"
            width="3"
          />
        </template>

        <span class="text-answer text-h5 font-weight-bold mt-1 mx-2">{{
          files.answer.ext == `word`
            ? `Download Answer Doc`
            : `Download Mark Scheme`
        }}</span>

        <span
          v-if="files.answer.price && files.answer.price != 0"
          class="text-answer text-h5 font-weight-bold mt-1"
        >{{ files.answer.price }} <span class="text-h6 font-weight-normal">GEM</span></span>
      </v-btn>

      <template v-if="files.extra && files.extra.length > 0">
        <v-btn
          v-for="(extra, index) in files.extra"
          :key="index"
          rounded="pill"
          class="width-btn btn-extra d-flex align-center justify-center"
          color="#ff03d635"
          flat
          height="42"
          :loading="isDownloading('extra', extra.id)"
          @click="handleDownloadClick('extra', extra.price, extra.id)"
        >
          <template #loader>
            <v-progress-circular
              :model-value="getDownloadProgress('extra', extra.id)"
              color="#ff03d6"
              size="24"
              width="3"
            />
          </template>

          <v-icon
            color="#ff03d6"
            size="20"
          >
            md:stock_media_outlined
          </v-icon>

          <span class="text-extra text-h5 font-weight-bold mt-1 mx-2">Download {{ extra.type_title ? extra.type_title : "Extra" }}</span>

          <span
            v-if="extra.price && extra.price != 0"
            class="text-extra text-h5 font-weight-bold mt-1"
          >{{ extra.price }} <span class="text-h6 font-weight-normal">GEM</span></span>
        </v-btn>
      </template>

      <v-btn
        v-if="exams && exams[0]?.status == `1`"
        rounded="pill"
        class="width-btn btn-begin-quiz d-flex align-center justify-center"
        color="#5500e835"
        flat
        height="42"
        @click="startExam"
      >
        <span class="text-begin-quiz text-h5 font-weight-bold mt-1 mx-2">
          Begin Quiz</span>
      </v-btn>

      <!-- <v-btn
        v-else
        :to="`/test-maker/create?board=${section}&grade=${base}&subject=${lesson}&paperId=${id}`"
        rounded="pill"
        class="width-btn btn-create-quiz d-flex align-center justify-center"
        color="#ffb60035"
        flat
        height="42"
      >
        <span class="text-primary text-h5 font-weight-bold mt-1 mx-2">
          Create Quiz</span>
      </v-btn> -->
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
  FilesDTO,
  DownloadResponseDTO,
  UpgradeSuggestionsDTO,
  BillingInterval,
} from '@/types'
import { useDisplay } from 'vuetify'

const downloadIssue = ref(false)
const downloadIssueLink = ref('')
interface IDownloadAndPurchaseButtons {
  files: FilesDTO
  id: string
  year: string | number
  title: string
  titleUrl: string
  exams?: {
    id: string
    status: string
  }[]
  section: string
  base: string
  lesson: string
  testType: string
  isPaper: boolean
}

type TypeFile = 'word' | 'pdf' | 'answer' | 'extra'

const props = defineProps<IDownloadAndPurchaseButtons>()

const auth = useAuth()
const router = useRouter()
const { xs } = useDisplay()

const showCoinPaymentModal = ref(false)
const showCoinAnimation = ref(false)
const isStartWalletAnimation = ref(false)
const priceFile = ref(0)
const pendingDownload = ref<{
  type: TypeFile
  extraId?: string
} | null>(null)
const openModalDownloadMobile = ref(false)
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
  contentType: 'PastPaper',
  id: props.id,
  trackPayload: () => ({
    file_type: 'past_paper',
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

const handleDownloadClick = async (type: TypeFile, price: number, extraId?: string) => {
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

const startExam = () => {
  if (auth.isAuthenticated.value) {
    if (props.exams && props.exams.length > 0) {
      router.push(`/exam/start/${props.exams[0]?.id}`)
    }
  }
  else {
    router.push({})
    setTimeout(() => {
      router.push({ query: { auth_form: 'login', auth_noredirect: 'true' } })
    }, 100)
  }
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
.btn-word {
  border: 1px solid #2e90fa;
}
.text-word {
  color: #2e90fa;
}
.btn-pdf {
  border: 1px solid #f04438;
}
.text-pdf {
  color: #f04438;
}

.btn-answer {
  border: 1px solid teal;
}
.text-answer {
  color: #008080;
}

.btn-begin-quiz {
  border: 1px solid #5600e8;
}
.text-begin-quiz {
  color: #5600e8;
}
.btn-create-quiz {
  border: 1px solid #ffb600;
}

.btn-extra {
  border: 1px solid #ff03d6;
}
.text-extra {
  color: #ff03d6;
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
  background-color: #d0d5dd;
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
