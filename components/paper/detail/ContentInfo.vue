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
            class="mb-2 text-h5"
            block
            size="large"
            variant="flat"
            color="primary"
            :loading="qWordFileDownloadLoading"
            @click="handleDownloadClick('q_word')"
          >
            <v-icon
              size="x-large"
              class="btn-icon"
            >
              mdi-file-word-box
            </v-icon>
            Download Question Doc
            <template v-if="requiresCoinPaymentForFile('q_word') && contentData?.files?.word.price === 0">
              <v-icon
                size="small"
                color="orange"
              >
                mdi-coin
              </v-icon>
            </template>
            <template v-else-if="contentData?.files?.word.price > 0">
              | ${{ contentData?.files?.word.price }}
            </template>
          </v-btn>
        </div>
        <div v-if="contentData?.files.pdf.exist">
          <v-btn
            class="mb-2 text-h5 text-white font-weight-bold"
            block
            variant="flat"
            size="large"
            color="#E60012"
            :loading="qPdfFileDownloadLoading"
            @click="handleDownloadClick('q_pdf')"
          >
            <v-icon
              size="x-large"
              class="btn-icon"
            >
              mdi-file-pdf-box
            </v-icon>
            Download Question Paper
            <template v-if="requiresCoinPaymentForFile('q_pdf') && contentData?.files?.pdf.price === 0">
              <v-icon
                size="small"
                color="orange"
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
            class="mb-2 text-h5 font-weight-bold"
            block
            variant="flat"
            size="large"
            color="teal accent-3"
            :loading="answerFileDownloadLoading"
            @click="handleDownloadClick('a_file')"
          >
            <v-icon
              size="x-large"
              class="btn-icon"
            >
              mdi-file-pdf-box
            </v-icon>
            Download Mark Scheme
            <template v-if="requiresCoinPaymentForFile('a_file') && contentData?.files?.answer.price === 0">
              <v-icon
                size="small"
                color="orange"
              >
                mdi-coin
              </v-icon>
            </template>
            <template v-else-if="contentData?.files?.answer.price > 0">
              | ${{ contentData?.files?.answer.price }}
            </template>
          </v-btn>
          <v-btn
            v-show="contentData?.files.answer.ext == 'word'"
            class="mb-2 text-h5"
            block
            color="primary"
            variant="flat"
            size="large"
            :loading="answerFileDownloadLoading"
            @click="handleDownloadClick('a_file')"
          >
            <v-icon
              size="x-large"
              class="btn-icon"
            >
              mdi-file-word-box
            </v-icon>
            Download Answer Doc
            <template v-if="requiresCoinPaymentForFile('a_file') && contentData?.files?.answer.price === 0">
              <v-icon
                size="small"
                color="orange"
              >
                mdi-coin
              </v-icon>
            </template>
            <template v-else-if="contentData?.files?.answer.price > 0">
              | ${{ contentData?.files?.answer.price }}
            </template>
          </v-btn>
        </div>
        <div
          v-if="contentData?.files.extra && contentData.files.extra.length > 0"
        >
          <v-btn
            v-for="(extra, index) in contentData.files.extra"
            :key="index"
            class="mb-2 text-h5 font-weight-bold"
            block
            color="blue"
            variant="flat"
            size="large"
            :loading="extraFileDownloadLoading"
            @click="handleDownloadClick('extra', extra.id)"
          >
            <template v-if="extra?.ext == 'mp3'">
              <v-icon
                size="x-large"
                class="btn-icon"
              >
                mdi-volume-high
              </v-icon>
            </template>
            <template v-if="extra?.ext == 'pdf'">
              <v-icon
                size="x-large"
                class="btn-icon"
              >
                mdi-file-pdf-box
              </v-icon>
            </template>
            Download {{ extra.type_title ? extra.type_title : "Extra" }}
            <template v-if="requiresCoinPaymentForFile('extra', extra.id) && extra.price === 0">
              <v-icon
                size="small"
                color="orange"
              >
                mdi-coin
              </v-icon>
            </template>
            <template v-else-if="extra.price > 0">
              | ${{ extra.price }}
            </template>
          </v-btn>
        </div>
        <v-btn
          v-if="contentData?.exams && contentData?.exams[0]?.status != 7"
          :to="`/exam/${contentData?.exams[0].id}`"
          block
          color="#5600e8"
          size="large"
          variant="flat"
          class="mb-2 text-h5 text-white font-weight-bold"
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
    @download="handleDownloadClick"
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
    :coin-count="5"
    @animation-complete="handleAnimationComplete"
  />
</template>

<script setup>
const props = defineProps({
  contentData: {
    type: Object,
    required: true,
  },
})
const { $toast } = useNuxtApp()
const auth = useAuth()
const user = useUser()
const rating = ref(4.5)
const crash_report = ref(null)
const _emits = defineEmits(['crash-report'])

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

// Fetch coin balance on component mount
onMounted(async () => {
  if (auth.isAuthenticated.value && requiresCoinPayment.value) {
    await coinBalance.fetchBalance()
    console.log('user balance:', coinBalance)
  }
})

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
      // Check if user is authenticated
      if (!auth.isAuthenticated.value) {
        $toast.info('Please login to download 2025 premium files')
        return
      }

      // Check if file has a price (paid files don't require coins)
      const fileHasPrice = checkFileHasPrice(type, extraId)
      if (!fileHasPrice) {
        // Store the download request for later
        pendingDownload.value = { type, extraId }

        // Fetch latest balance and show payment modal
        await coinBalance.fetchBalance()
        showCoinPaymentModal.value = true
        return
      }
    }

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
    const extra = props.contentData?.files?.extra?.find(e => e.id === extraId)
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
    const extra = props.contentData?.files?.extra?.find(e => e.id === extraId)
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
    await startDownload(pendingDownload.value.type, pendingDownload.value.extraId)
    pendingDownload.value = null
  }
}

const startDownload = async (type, extraId) => {
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
    const response = await useApiService.get(apiUrl)
    console.log('Download response:', response.data)

    const FileSaver = await import('file-saver')

    // Use FileSaver.js the same way as other parts of the codebase
    console.log('Starting download with FileSaver:', response.data.url, response.data.name)
    FileSaver.saveAs(response.data.url, response.data.name)

    // Show success message for coin payments
    if (requiresCoinPaymentForFile(type, extraId) && !checkFileHasPrice(type, extraId)) {
      $toast.success('Download started! 5 coins deducted from your balance.')
    }
  }
  catch (err) {
    if (err.response?.status == 400) {
      if (
        err.response.data.status == 0
        && err.response.data.error == 'creditNotEnough'
      ) {
        $toast.info('No enough credit')
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
</style>
