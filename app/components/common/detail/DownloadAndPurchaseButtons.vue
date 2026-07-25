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
    <lazy-modals-coin-payment-modal
      v-if="showCoinPaymentModal"
      v-model:show-dialog="showCoinPaymentModal"
      :is-processing="isLoading || isProcessingPayment"
      :user-balance="balance"
      :amount-to-pay="5"
      @close="handleCoinPaymentClose"
    />

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

const { $toast } = useNuxtApp()
const { trackFileDownload } = useGtmEvents()
const auth = useAuth()
const router = useRouter()
const { xs } = useDisplay()

const { balance, isLoading } = useCoinBalance()
const { downloadFile } = useDownload()
const showCoinPaymentModal = ref(false)
const showCoinAnimation = ref(false)
const isProcessingPayment = ref(false)
const isStartWalletAnimation = ref(false)
const priceFile = ref(0)
const pendingDownload = ref<{
  type: TypeFile
  extraId?: string
} | null>(null)
const openModalDownloadMobile = ref(false)

const handleDownloadClick = async (type: TypeFile, price: number, extraId?: string) => {
  const downloadKey = extraId ? `${type}-${extraId}` : type
  priceFile.value = price

  // Set loading state and progress tracking
  downloadingItems.value.add(downloadKey)
  downloadProgress.value[downloadKey] = 0
  if (auth.isAuthenticated.value) {
    startDownload(type, extraId)
  }
  else {
    downloadingItems.value.delete(downloadKey)
    Reflect.deleteProperty(downloadProgress.value, downloadKey)
    router.push({})
    setTimeout(() => {
      router.push({ query: { auth_form: 'login', auth_noredirect: 'true' } })
    }, 100)
  }
}

// Track download progress for each button
const downloadProgress = ref<Record<string, number>>({})
const downloadingItems = ref<Set<string>>(new Set())

const getDownloadProgress = (type: TypeFile, extraId?: string) => {
  const key = extraId ? `${type}-${extraId}` : type
  return downloadProgress.value[key] || 0
}

const isDownloading = (type: TypeFile, extraId?: string) => {
  const key = extraId ? `${type}-${extraId}` : type
  return downloadingItems.value.has(key)
}

const startDownload = async (type: TypeFile, extraId?: string) => {
  trackFileDownload({
    file_type: 'past_paper',
    file_name: props.title,
    file_url: props.titleUrl,
  })

  const downloadKey = extraId ? `${type}-${extraId}` : type
  let progressInterval: ReturnType<typeof setInterval> | null = null

  try {
    // Simulate progressive loading for API call
    progressInterval = setInterval(() => {
      const currentProgress = downloadProgress.value[downloadKey] ?? 0
      if (currentProgress < 50) {
        downloadProgress.value[downloadKey] = currentProgress + Math.random() * 15
      }
    }, 100)

    const response = await downloadFile({
      contentType: 'PastPaper',
      fileType: type,
      id: Number(props.id),
      extraId: extraId ? Number(extraId) : undefined,
    })

    // Update progress to 60% after API response
    downloadProgress.value[downloadKey] = 60
    clearInterval(progressInterval)
    progressInterval = null

    // Create a custom fetch with progress tracking
    if (response.succeeded && response.data) {
      if (response.data.url) {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', response.data.url, true)
        xhr.responseType = 'blob'

        xhr.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = 60 + (event.loaded / event.total) * 40
            downloadProgress.value[downloadKey] = Math.min(percentComplete, 100)
          }
        }

        xhr.onload = () => {
          if (xhr.status === 200) {
            downloadProgress.value[downloadKey] = 100

            const blob = xhr.response
            const url = window.URL.createObjectURL(blob)

            const a = document.createElement('a')
            a.href = url
            a.download = response.data?.name || 'file.pdf'
            document.body.appendChild(a)
            a.click()

            a.remove()
            window.URL.revokeObjectURL(url)
            downloadIssueLink.value = response.data?.url || ''
            if (response.data?.spent) {
              showCoinAnimation.value = true
            }
            else {
              downloadIssue.value = true
            }

            setTimeout(() => {
              downloadingItems.value.delete(downloadKey)
              Reflect.deleteProperty(downloadProgress.value, downloadKey)
            }, 1000)
          }
        }

        xhr.onerror = () => {
          downloadingItems.value.delete(downloadKey)
          Reflect.deleteProperty(downloadProgress.value, downloadKey)
          $toast.error('Download failed. Please try again.')
        }

        xhr.send()
      }
      if (response.data.upgradeSuggestions && response.data.upgradeSuggestions.length > 0) {
        showCoinPaymentModal.value = true
      }
    }
    else {
      if (response.errors && response.errors.length > 0) {
        const messgage = response.errors[0].message
        if (messgage == 'InsufficientBalance') {
          showCoinPaymentModal.value = true
        }
      }
      downloadingItems.value.delete(downloadKey)
      Reflect.deleteProperty(downloadProgress.value, downloadKey)
    }
  }
  catch (error: unknown) {
    console.error('Download failed:', error)
    downloadingItems.value.delete(downloadKey)
    Reflect.deleteProperty(downloadProgress.value, downloadKey)
    $toast.error('Download failed. Please try again.')
  }
  finally {
    if (progressInterval) {
      clearInterval(progressInterval)
    }
  }
}

const handleCoinPaymentClose = () => {
  showCoinPaymentModal.value = false
  if (pendingDownload.value) {
    const downloadKey = pendingDownload.value.extraId
      ? `${pendingDownload.value.type}-${pendingDownload.value.extraId}`
      : pendingDownload.value.type
    downloadingItems.value.delete(downloadKey)
    Reflect.deleteProperty(downloadProgress.value, downloadKey)
  }
  pendingDownload.value = null
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
