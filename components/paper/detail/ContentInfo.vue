<template>
  <v-card
    flat
    class="content_main_info"
  >
    <v-row class="d-flex align-center mb-2 ga-1">
      <!-- <NuxtImg
        width="48px"
        height="48px"
        :src="contentData?.avatar"
        placeholder
        class="d-inline-block user-avatar"
        alt="user profile"
      /> -->
      <v-img
        width="48"
        height="48"
        :src="contentData?.avatar"
        class="user-avatar"
        alt="user profile"
      />
      <p class="creator_title">
        {{ contentData?.first_name }} {{ contentData?.last_name }}
      </p>
    </v-row>
    <v-divider class="my-2" />
    <v-row>
      <v-col
        cols="12"
        class="pb-0"
      >
        <v-icon class="mr-1">
          mdi-folder-outline
        </v-icon>
        Classification: {{ contentData?.test_type_title }}
      </v-col>
      <v-col
        cols="12"
        class="pb-0"
      >
        <v-icon class="mr-1">
          mdi-book-open-blank-variant
        </v-icon>
        Page count: {{ contentData?.q_file_pages }}
      </v-col>
      <v-col
        cols="12"
        class="pb-0"
      >
        <v-icon class="mr-1">
          mdi-eye
        </v-icon>
        Viewed: {{ contentData?.views }}
      </v-col>
      <v-col
        cols="12"
        class="pb-0"
      >
        <v-icon class="mr-1">
          mdi-calendar-month-outline
        </v-icon>
        Last update: {{ $dayjs(contentData?.up_date).fromNow() }}
      </v-col>
      <v-col
        cols="12"
        class="pb-0"
      >
        <div
          class="pointer"
          @click="openCrashReport"
        >
          <v-icon class="mr-1">
            mdi-bug-outline
          </v-icon>
          Crash report
        </div>
      </v-col>
      <v-col
        cols="12"
        class="pb-0"
      >
        <slot name="share-dialog" />
      </v-col>
    </v-row>

    <div class="text-center mt-4">
      <v-rating
        v-model="rating"
        hover
        background-color="grey-darken-1"
        color="yellow-darken-3"
        size="35"
        half-increments
      />
    </div>
    <v-divider class="d-none d-md-block" />

    <v-row class="mt-1 d-none d-md-block">
      <v-col
        cols="12"
        class="pb-0"
      >
        <div v-if="contentData?.files?.word.exist">
          <v-btn
            class="mb-2 text-h5 position-relative"
            block
            size="large"
            variant="flat"
            color="primary"
            :loading="qWordFileDownloadLoading && !isDownloading('q_word')"
            @click="handleDownloadClick('q_word')"
          >
            <template v-if="isDownloading('q_word')">
              <v-progress-circular
                :model-value="getDownloadProgress('q_word')"
                size="24"
                width="3"
                color="white"
                class="position-absolute"
                style="z-index: 2"
              />
            </template>
            <v-icon
              size="x-large"
              class="btn-icon"
              :class="{ 'text-transparent': isDownloading('q_word') }"
            >
              mdi-file-word-box
            </v-icon>
            <span :class="{ 'text-transparent': isDownloading('q_word') }">
              {{ getButtonText("Download Question Doc") }}
            </span>
            <template
              v-if="
                requiresCoinPaymentForFile('q_word')
                  && contentData?.files?.word.price === 0
              "
            >
              <v-icon
                size="small"
                color="orange"
                :class="{ 'text-transparent': isDownloading('q_word') }"
              >
                mdi-coin
              </v-icon>
            </template>
            <template v-else-if="contentData?.files?.word.price > 0">
              <span :class="{ 'text-transparent': isDownloading('q_word') }">
                | ${{ contentData?.files?.word.price }}
              </span>
            </template>
          </v-btn>
        </div>
        <div v-if="contentData?.files.pdf.exist">
          <v-btn
            class="mb-2 text-h5 text-white font-weight-bold position-relative"
            block
            variant="flat"
            size="large"
            color="#E60012"
            :loading="qPdfFileDownloadLoading && !isDownloading('q_pdf')"
            @click="handleDownloadClick('q_pdf')"
          >
            <template v-if="isDownloading('q_pdf')">
              <v-progress-circular
                :model-value="getDownloadProgress('q_pdf')"
                size="24"
                width="3"
                color="white"
                class="position-absolute"
                style="z-index: 2"
              />
            </template>
            <v-icon
              size="x-large"
              class="btn-icon"
              :class="{ 'text-transparent': isDownloading('q_pdf') }"
            >
              mdi-file-pdf-box
            </v-icon>
            <span :class="{ 'text-transparent': isDownloading('q_pdf') }">
              {{ getButtonText("Download Question Paper") }}
            </span>
            <template
              v-if="
                requiresCoinPaymentForFile('q_pdf')
                  && contentData?.files?.pdf.price === 0
              "
            >
              <v-icon
                size="small"
                color="orange"
                :class="{ 'text-transparent': isDownloading('q_pdf') }"
              >
                mdi-coin
              </v-icon>
            </template>
            <!-- <template v-else-if="contentData?.files?.pdf.price > 0">
              | ${{ contentData?.files?.pdf.price }}
            </template> -->
          </v-btn>
        </div>
        <div v-if="contentData?.files.answer.exist">
          <v-btn
            v-show="contentData?.files.answer.ext == 'pdf'"
            class="mb-2 text-h5 font-weight-bold position-relative"
            block
            variant="flat"
            size="large"
            color="teal accent-3"
            :loading="answerFileDownloadLoading && !isDownloading('a_file')"
            @click="handleDownloadClick('a_file')"
          >
            <template v-if="isDownloading('a_file')">
              <v-progress-circular
                :model-value="getDownloadProgress('a_file')"
                size="24"
                width="3"
                color="white"
                class="position-absolute"
                style="z-index: 2"
              />
            </template>
            <v-icon
              size="x-large"
              class="btn-icon"
              :class="{ 'text-transparent': isDownloading('a_file') }"
            >
              mdi-file-pdf-box
            </v-icon>
            <span :class="{ 'text-transparent': isDownloading('a_file') }">
              {{ getButtonText("Download Mark Scheme") }}
            </span>
            <template
              v-if="
                requiresCoinPaymentForFile('a_file')
                  && contentData?.files?.answer.price === 0
              "
            >
              <v-icon
                size="small"
                color="orange"
                :class="{ 'text-transparent': isDownloading('a_file') }"
              >
                mdi-coin
              </v-icon>
            </template>
            <template v-else-if="contentData?.files?.answer.price > 0">
              <span :class="{ 'text-transparent': isDownloading('a_file') }">
                | ${{ contentData?.files?.answer.price }}
              </span>
            </template>
          </v-btn>
          <v-btn
            v-show="contentData?.files.answer.ext == 'word'"
            class="mb-2 text-h5 position-relative"
            block
            color="primary"
            variant="flat"
            size="large"
            :loading="answerFileDownloadLoading && !isDownloading('a_file')"
            @click="handleDownloadClick('a_file')"
          >
            <template v-if="isDownloading('a_file')">
              <v-progress-circular
                :model-value="getDownloadProgress('a_file')"
                size="24"
                width="3"
                color="white"
                class="position-absolute"
                style="z-index: 2"
              />
            </template>
            <v-icon
              size="x-large"
              class="btn-icon"
              :class="{ 'text-transparent': isDownloading('a_file') }"
            >
              mdi-file-word-box
            </v-icon>
            <span :class="{ 'text-transparent': isDownloading('a_file') }">
              {{ getButtonText("Download Answer Doc") }}
            </span>
            <template
              v-if="
                requiresCoinPaymentForFile('a_file')
                  && contentData?.files?.answer.price === 0
              "
            >
              <v-icon
                size="small"
                color="orange"
                :class="{ 'text-transparent': isDownloading('a_file') }"
              >
                mdi-coin
              </v-icon>
            </template>
            <template v-else-if="contentData?.files?.answer.price > 0">
              <span :class="{ 'text-transparent': isDownloading('a_file') }">
                | ${{ contentData?.files?.answer.price }}
              </span>
            </template>
          </v-btn>
        </div>
        <div
          v-if="contentData?.files.extra && contentData.files.extra.length > 0"
        >
          <v-btn
            v-for="(extra, index) in contentData.files.extra"
            :key="index"
            class="mb-2 text-h5 font-weight-bold position-relative"
            block
            color="blue"
            variant="flat"
            size="large"
            :loading="
              extraFileDownloadLoading && !isDownloading('extra', extra.id)
            "
            @click="handleDownloadClick('extra', extra.id)"
          >
            <template v-if="isDownloading('extra', extra.id)">
              <v-progress-circular
                :model-value="getDownloadProgress('extra', extra.id)"
                size="24"
                width="3"
                color="white"
                class="position-absolute"
                style="z-index: 2"
              />
            </template>
            <template v-if="extra?.ext == 'mp3'">
              <v-icon
                size="x-large"
                class="btn-icon"
                :class="{
                  'text-transparent': isDownloading('extra', extra.id),
                }"
              >
                mdi-volume-high
              </v-icon>
            </template>
            <template v-if="extra?.ext == 'pdf'">
              <v-icon
                size="x-large"
                class="btn-icon"
                :class="{
                  'text-transparent': isDownloading('extra', extra.id),
                }"
              >
                mdi-file-pdf-box
              </v-icon>
            </template>
            <span
              :class="{ 'text-transparent': isDownloading('extra', extra.id) }"
            >
              {{
                getButtonText(
                  `Download ${extra.type_title ? extra.type_title : "Extra"}`,
                )
              }}
            </span>
            <template
              v-if="
                requiresCoinPaymentForFile('extra', extra.id)
                  && extra.price === 0
              "
            >
              <v-icon
                size="small"
                color="orange"
                :class="{
                  'text-transparent': isDownloading('extra', extra.id),
                }"
              >
                mdi-coin
              </v-icon>
            </template>
            <template v-else-if="extra.price > 0">
              <span
                :class="{
                  'text-transparent': isDownloading('extra', extra.id),
                }"
              >
                | ${{ extra.price }}
              </span>
            </template>
          </v-btn>
        </div>
        <v-btn
          v-if="contentData?.exams && contentData?.exams[0]?.status != 7"
          block
          color="#5600e8"
          size="large"
          variant="flat"
          class="mb-2 text-h5 text-white font-weight-bold"
          @click="startExam"
        >
          Begin Quiz
        </v-btn>
        <v-btn
          v-else
          :to="`/test-maker/create?board=${contentData?.section}&grade=${contentData?.base}&subject=${contentData?.lesson}&paperId=${contentData?.id}`"
          block
          variant="flat"
          outlined
          size="large"
          color="primary"
          class="mb-2 text-h5 text-white font-weight-bold"
        >
          Create Quiz
        </v-btn>
      </v-col>
    </v-row>
    <common-crash-report ref="crash_report" />
  </v-card>
  <!-- Mobile order section -->
  <paper-detail-mobile-order
    :content-data="contentData"
    :is-logged-in="auth.isAuthenticated.value"
    :user-credit="user?.user.value && user?.user.value?.credit"
    :is-free="isFree"
    :q-word-file-download-loading="qWordFileDownloadLoading"
    :q-pdf-file-download-loading="qPdfFileDownloadLoading"
    :answer-file-download-loading="answerFileDownloadLoading"
    :extra-file-download-loading="extraFileDownloadLoading"
    :requires-coin-payment-for-file="requiresCoinPaymentForFile"
    :is-downloading="isDownloading"
    :get-download-progress="getDownloadProgress"
    @download="handleDownloadClick"
    @start-exam-mobile="startExam"
  />
  <!-- End mobile order section -->

  <!-- Coin Payment Modal -->
  <modals-coin-payment-modal
    v-model:is-open="showCoinPaymentModal"
    :user-balance="coinBalance.balance.value"
    :is-processing="coinBalance.isLoading.value || isProcessingPayment"
    @confirm="handleCoinPaymentConfirm"
    @close="handleCoinPaymentClose"
  />

  <!-- Coin Consumption Animation -->
  <common-coin-consumption-animation
    :is-visible="showCoinAnimation"
    @animation-complete="handleAnimationComplete"
  />
</template>

<script setup>
import { useGtmEvents } from '~/composables/useGtmEvents'
import FileSaver from 'file-saver'

const { trackFileDownload } = useGtmEvents()

const props = defineProps({
  contentData: {
    type: Object,
    required: true,
  },
})
const { $toast } = useNuxtApp()
const auth = useAuth()
const user = useUser()
const router = useRouter()
const rating = ref(4.5)
const crash_report = ref(null)

// Coin system
const coinBalance = useCoinBalance()
const showCoinPaymentModal = ref(false)
const showCoinAnimation = ref(false)
const isProcessingPayment = ref(false)
const pendingDownload = ref(null)

const qPdfFileDownloadLoading = ref(false)
const qWordFileDownloadLoading = ref(false)
const answerFileDownloadLoading = ref(false)
const extraFileDownloadLoading = ref(false)

// Check if this content requires coin payment (2025 files)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const requiresCoinPayment = computed(() => {
  return coinBalance.requiresCoinPayment(props.contentData)
})

const isFree = computed(() => {
  if (!props.contentData) return true
  if (
    props.contentData.files.answer.price > 0
    && props.contentData.files.pdf.price > 0
    && props.contentData.files.word.price > 0
  )
    return false
  else return true
})

// All buttons should be enabled - authentication check happens on click

// Get button text - always show original text since buttons are always enabled

const startExam = () => {
  if (auth.isAuthenticated.value) {
    router.push(`/exam/start/${props.contentData?.exams[0].id}`)
  }
  else {
    router.push({ query: null })
    setTimeout(() => {
      router.push({ query: { auth_form: 'login', auth_noredirect: true } })
    }, 100)
  }
}

const getButtonText = (originalText) => {
  return originalText
}

const openCrashReport = () => {
  crash_report.value.dialog = true
  crash_report.value.form.type = 'test'
}

const handleDownloadClick = async (type, extraId) => {
  // Set loading state immediately
  setLoadingState(type, true)

  try {
    // Check if this specific file type requires coin payment
    const fileRequiresCoins = requiresCoinPaymentForFile(type, extraId)

    if (fileRequiresCoins) {
      // Check if file has a price (paid files don't require coins)
      const fileHasPrice = checkFileHasPrice(type, extraId)
      if (!fileHasPrice) {
        // Store the download request for later
        pendingDownload.value = { type, extraId }

        // Fetch latest balance and show payment modal
        const balanceResult = await coinBalance.fetchBalance()
        if (balanceResult === 0 && coinBalance.error.value) {
          $toast.error('Failed to fetch balance. Please try again.')
          setLoadingState(type, false)
          return
        }

        showCoinPaymentModal.value = true
        return
      }
    }
    trackFileDownload({
      file_type: 'past_paper',
      file_name: props.contentData?.title,
      file_url: props.contentData?.title_url,
    })
    // console.log(props?.contentData)
    // Proceed with normal download
    await startDownload(type, extraId)
  }
  catch (error) {
    console.error('Error in handleDownloadClick:', error)
    $toast.error('An error occurred. Please try again.')
  }
  finally {
    // Reset loading state if not going through coin payment flow
    if (!showCoinPaymentModal.value) {
      setLoadingState(type, false)
    }
  }
}

const requiresCoinPaymentForFile = (type, extraId) => {
  // Only apply coin payment to 2025 files
  if (!coinBalance.requiresCoinPayment(props.contentData)) {
    return false
  }

  // For 2025 files, only these file types require coins:
  // - Mark schemes/answer files (a_file)
  // - Extra files (audio, additional resources)
  // - Question papers (q_word, q_pdf) remain FREE

  if (type === 'a_file') {
    // Mark schemes require coins for 2025
    return props.contentData?.files?.answer.price === 0
  }

  if (type === 'extra') {
    // Extra files (audio, etc.) require coins for 2025
    const extra = props.contentData?.files?.extra?.find(
      e => e.id === extraId,
    )
    return extra?.price === 0
  }

  // Question papers (q_word, q_pdf) are FREE for 2025
  return false
}

const checkFileHasPrice = (type, extraId) => {
  if (type === 'q_word') return props.contentData?.files?.word.price > 0
  if (type === 'q_pdf') return props.contentData?.files?.pdf.price > 0
  if (type === 'a_file') return props.contentData?.files?.answer.price > 0
  if (type === 'extra') {
    const extra = props.contentData?.files?.extra?.find(
      e => e.id === extraId,
    )
    return extra?.price > 0
  }
  return false
}

const setLoadingState = (type, loading) => {
  if (type === 'q_word') qWordFileDownloadLoading.value = loading
  if (type === 'q_pdf') qPdfFileDownloadLoading.value = loading
  if (type === 'a_file') answerFileDownloadLoading.value = loading
  if (type === 'extra') extraFileDownloadLoading.value = loading
}

const handleCoinPaymentConfirm = async () => {
  if (!pendingDownload.value) return

  console.log('Coin payment confirmed, processing...')
  isProcessingPayment.value = true

  try {
    // Deduct coins
    const success = await coinBalance.deductCoins(5, 'Past paper download')
    console.log('Coin deduction result:', success)

    if (success) {
      // Don't close modal immediately, wait for animation to complete
      console.log('Payment successful, showing animation...')

      // Show coin consumption animation
      showCoinAnimation.value = true
      console.log('showCoinAnimation set to:', showCoinAnimation.value)

      // Wait for animation to complete before starting download
      // The download will be triggered in handleAnimationComplete
    }
    else {
      $toast.error('Failed to process payment. Please try again.')
    }
  }
  catch (error) {
    console.error('Error processing coin payment:', error)
    $toast.error('Payment failed. Please try again.')
  }
  finally {
    isProcessingPayment.value = false
  }
}

const handleCoinPaymentClose = () => {
  showCoinPaymentModal.value = false

  // Reset loading state for the pending download
  if (pendingDownload.value) {
    setLoadingState(pendingDownload.value.type, false)
  }

  pendingDownload.value = null
}

const handleAnimationComplete = async () => {
  console.log('Animation completed!')

  // Close everything immediately when animation completes
  showCoinAnimation.value = false
  showCoinPaymentModal.value = false

  if (pendingDownload.value) {
    console.log('Starting download for:', pendingDownload.value)
    // Start the actual download
    await startDownload(
      pendingDownload.value.type,
      pendingDownload.value.extraId,
    )
    pendingDownload.value = null
  }
}

// Track download progress for each button
const downloadProgress = ref({})
const downloadingItems = ref(new Set())

const getDownloadProgress = (type, extraId) => {
  const downloadKey = extraId ? `${type}-${extraId}` : type
  return downloadProgress.value[downloadKey] || 0
}

const isDownloading = (type, extraId) => {
  const downloadKey = extraId ? `${type}-${extraId}` : type
  return downloadingItems.value.has(downloadKey)
}

const startDownload = async (type, extraId) => {
  const downloadKey = extraId ? `${type}-${extraId}` : type

  // Set loading state and progress tracking
  downloadingItems.value.add(downloadKey)
  downloadProgress.value[downloadKey] = 0

  let apiUrl = ''
  if (type === 'q_word') {
    apiUrl = `/api/v1/tests/download/${props.contentData?.id}/word`
  }
  if (type === 'q_pdf') {
    apiUrl = `/api/v1/tests/download/${props.contentData?.id}/pdf`
  }
  if (type === 'a_file') {
    apiUrl = `/api/v1/tests/download/${props.contentData?.id}/answer`
  }
  if (type === 'extra') {
    apiUrl = `/api/v1/tests/download/${props.contentData?.id}/extra/${extraId}`
  }

  try {
    // Simulate progressive loading for API call
    const progressInterval = setInterval(() => {
      if (downloadProgress.value[downloadKey] < 50) {
        downloadProgress.value[downloadKey] += Math.random() * 15
      }
    }, 100)

    const response = await useApiService.get(apiUrl)
    console.log('Download response:', response.data)

    // Update progress to 60% after API response
    downloadProgress.value[downloadKey] = 60
    clearInterval(progressInterval)

    // Create a custom fetch with progress tracking
    const xhr = new XMLHttpRequest()
    xhr.open('GET', response.data.url, true)
    xhr.responseType = 'blob'

    xhr.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = 60 + (event.loaded / event.total) * 40
        downloadProgress.value[downloadKey] = Math.min(percentComplete, 100)
      }
    }

    console.log(1)
    alert(1)
    xhr.onload = () => {
      console.log(2)
      alert(2)
      if (xhr.status === 200) {
        console.log(3)
        alert(3)
        downloadProgress.value[downloadKey] = 100

        console.log(4)
        alert(4)
        // Use file-saver to save the blob
        // import('file-saver').then(({ saveAs }) => {
        //   console.log(5)
        //   alert(5)
        //   saveAs(xhr.response, response.data.name)
        //   console.log(6)
        //   alert(6)
        // })
        FileSaver.saveAs(xhr.response, response.data.name)

        console.log(7)
        alert(7)
        // Show success message for coin payments
        if (
          requiresCoinPaymentForFile(type, extraId)
          && !checkFileHasPrice(type, extraId)
        ) {
          $toast.success(
            'Download started! 5 coins deducted from your balance.',
          )
        }
        console.log(8)
        alert(8)
        // Clean up after a short delay
        setTimeout(() => {
          console.log(9)
          alert(9)
          downloadingItems.value.delete(downloadKey)
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete downloadProgress.value[downloadKey]
        }, 1000)
      }
    }

    xhr.onerror = () => {
      console.log(10)
      alert(10)
      downloadingItems.value.delete(downloadKey)
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete downloadProgress.value[downloadKey]
      $toast.error('Download failed. Please try again.')
    }

    xhr.send()
  }
  catch (err) {
    console.log(11)
    alert(11)
    // Clean up on error
    downloadingItems.value.delete(downloadKey)
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete downloadProgress.value[downloadKey]

    if (err.response?.status === 403) {
      $toast.error('Access denied. Insufficient permissions.')
    }
    else if (err.response?.status === 400) {
      if (
        err.response.data.status === 0
        && err.response.data.error === 'creditNotEnough'
      ) {
        $toast.info('No enough credit')
      }
      else {
        $toast.error('Invalid request. Please try again.')
      }
    }
    else {
      $toast.error('Download failed. Please try again.')
    }
  }
  finally {
    // Reset loading state
    setLoadingState(type, false)
  }
}

defineExpose({
  crash_report,
})
</script>

<style scoped>
.content_main_info {
  padding: 27px !important;
  background: #f5f5f5 !important;
  border-radius: 6px;
}
.user-avatar {
  width: 48px;
  height: 48px;
  flex: 0 0 auto;
}
.content_main_info .creator_title {
  font-size: 18px;
}

p {
  font-size: 1.3rem !important;
}

.btn-icon {
  position: absolute;
  left: 10px;
}

.text-transparent {
  color: transparent !important;
}

.position-relative {
  position: relative;
}

.position-absolute {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
