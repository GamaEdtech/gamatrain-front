<template>
  <div class="w-100 container-slider-button rounded-lg d-flex align-center">
    <div
      class="button-div h-100 d-flex flex-column align-center justify-center ga-8 px-4"
    >
      <div
        v-if="qFilePages"
        class="d-flex flex-column align-center justify-center ga-1 primary-gray-700 cursor-pointer text-no-wrap"
      >
        <v-icon color="primary-gray-700">
          md:contract
        </v-icon>
        <v-tooltip
          activator="parent"
          location="top"
        >
          Number of pages
        </v-tooltip>
        {{ qFilePages }}
      </div>
      <div
        v-if="views"
        class="d-flex flex-column align-center justify-center ga-1 primary-gray-700 cursor-pointer text-no-wrap"
      >
        <v-icon color="primary-gray-700">
          md:visibility
        </v-icon>
        <v-tooltip
          activator="parent"
          location="top"
        >
          Views
        </v-tooltip>
        {{ views }}
      </div>
      <div
        v-if="score"
        class="d-flex flex-column align-center justify-center ga-1 primary-gray-700 cursor-pointer text-no-wrap"
      >
        <v-icon color="primary-gray-700">
          md:star
        </v-icon>
        <v-tooltip
          activator="parent"
          location="top"
        >
          Rating
        </v-tooltip>
        {{ score }}
      </div>
      <common-bookmark-button
        v-if="hasSave"
        :id="id"
        type="papers"
      />
      <div
        v-if="hasShare"
        class="d-flex flex-column align-center justify-center ga-1 primary-gray-700 cursor-pointer text-no-wrap"
        @click="shareContent"
      >
        <v-icon color="primary-gray-700">
          md:share
        </v-icon>
        <v-tooltip
          activator="parent"
          location="top"
        >
          Share
        </v-tooltip>
      </div>
    </div>

    <div
      class="w-100 h-100 d-flex justify-center align-center position-relative"
    >
      <img
        width="170"
        :src="thumbPic"
        :alt="alt"
        class="w-100 h-100 main-image-paper"
        preload
        fetchpriority="high"
        loading="eager"
      >

      <div
        v-if="files?.pdf?.exist && previewPrice"
        class="preview-price-chip position-absolute d-flex align-center justify-center rounded-pill"
      >
        <common-price-with-gem
          :price="previewPrice"
          color="white"
          class="text-white text-h6 font-weight-bold"
        />
      </div>

      <div
        v-if="files?.pdf?.exist"
        class="preview-div cursor-pointer rounded-lg position-absolute d-flex align-center justify-center"
        @click="openWebPDF"
      >
        <v-progress-circular
          v-if="loadingPreview"
          size="18"
          width="2"
          color="white"
          indeterminate
        />
        <v-icon
          v-else
          color="white"
        >
          md:crop_free
        </v-icon>
        <v-tooltip
          activator="parent"
          location="top"
        >
          <span
            v-if="previewPrice"
            class="d-flex align-center ga-1"
          >
            Full preview
            <span class="d-flex align-center">
              {{ previewPrice }}
              <v-icon
                size="16"
                color="white"
                class="ml-1"
              >
                md:diamond_outlined
              </v-icon>
            </span>
          </span>
          <span v-else>Full preview (free)</span>
        </v-tooltip>
      </div>
    </div>

    <client-only>
      <lazy-common-pdf-preview-dialog
        v-model="previewDialog"
        :title="previewTitle"
        :pdf-url="previewPdfUrl"
        :file-name="previewFileName"
      />
    </client-only>

    <!-- Same entitlement/upgrade flow as the Download buttons - preview goes through the
         same gated /api/v2/downloads call, so a user without access sees this instead. -->
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

    <!-- Same "what did this just cost me" feedback as the Download buttons: a coin-spend
         animation followed by the wallet-balance counting overlay - only when the backend
         confirms real coins were actually spent (paidBy: 'Points'), not for a subscription-
         quota-covered or free preview. -->
    <lazy-common-coin-consumption-animation
      v-model:is-visible="showCoinAnimation"
      @animation-complete="handleCoinAnimationComplete"
    />
    <lazy-test-counting-wallet-animation
      :is-start-animation="isStartWalletAnimation"
      :direction="-1"
      :delta-price="previewPrice"
      @complete-animation="isStartWalletAnimation = false"
    />
  </div>
</template>

<script setup lang="ts">
import type { ApiResult, DownloadResponseDTO, FilesDTO, UpgradeSuggestionsDTO, BillingInterval } from '@/types'

interface IPreviewActionCard {
  thumbPic: string
  id: string
  title: string
  alt: string
  files?: FilesDTO
  views?: number | string
  score?: string | number
  qFilePages?: string | number
  hasShare?: boolean
  hasSave?: boolean
}

const props = withDefaults(defineProps<IPreviewActionCard>(), {
  hasShare: true,
  hasSave: true,
})
const emit = defineEmits(['share'])

const auth = useAuth()
const router = useRouter()
const { downloadFile } = useDownload()

const previewDialog = ref(false)
const previewPdfUrl = ref('')
const previewFileName = ref('')
const previewTitle = ref('')
const loadingPreview = ref(false)
const previewPrice = computed(() => props.files?.pdf?.price ?? 0)

const showCoinPaymentModal = ref(false)
const paymentPlans = ref<UpgradeSuggestionsDTO[]>([])
const billingInterval = ref<BillingInterval[]>([])
const currentPlanTitle = ref<string | null>(null)
const currentPlanId = ref<number | null>(null)

const showCoinAnimation = ref(false)
const isStartWalletAnimation = ref(false)

const redirectToLogin = () => {
  router.push({})
  setTimeout(() => {
    router.push({ query: { auth_form: 'login', auth_noredirect: 'true' } })
  }, 100)
}

const requestPreview = async () => {
  if (!props.id) {
    console.warn('No paper ID provided for PDF preview')
    return
  }

  if (!auth.isAuthenticated.value) {
    redirectToLogin()
    return
  }

  loadingPreview.value = true

  try {
    const response = await downloadFile({
      contentType: 'PastPaper',
      fileType: 'pdf',
      id: Number(props.id),
    }) as ApiResult<DownloadResponseDTO>

    if (response.succeeded && response.data?.url) {
      previewPdfUrl.value = response.data.url
      previewFileName.value = response.data.name || 'document.pdf'
      previewTitle.value = props.title || 'PDF Preview'
      previewDialog.value = true

      // Only show "coins were just spent" feedback when the backend confirms a real spend
      // (paidBy: 'Points') - a subscription-quota-covered or genuinely free preview has no
      // balance change to animate.
      if (response.data.spent && response.data.paidBy === 'Points') {
        showCoinAnimation.value = true
      }
      return
    }

    if (response.data?.upgradeSuggestions && response.data.upgradeSuggestions.length > 0) {
      paymentPlans.value = response.data.upgradeSuggestions
      billingInterval.value = response.data.availableBillingIntervals || []
      currentPlanTitle.value = response.data.currentPlanTitle
      currentPlanId.value = response.data.currentPlanId
      showCoinPaymentModal.value = true
      return
    }

    if (response.errors?.[0]?.message === 'InsufficientBalance') {
      showCoinPaymentModal.value = true
    }
  }
  finally {
    loadingPreview.value = false
  }
}

const openWebPDF = () => {
  requestPreview()
}

const upgradePlanSuccessfully = async () => {
  showCoinPaymentModal.value = false
  await requestPreview()
}

const handleCoinAnimationComplete = () => {
  showCoinAnimation.value = false
  isStartWalletAnimation.value = true
}

const shareContent = () => {
  emit('share')
}
</script>

<style scoped>
.container-slider-button {
  background-color: #fcfcfd;
  border: 1px solid #f2f4f7;
  max-width: 360px;
  height: 100%;
  min-height: 400px;
  max-height: 400px;
}
.button-div {
  min-width: 60px;
  border: 1px solid #f2f4f7;
}
.preview-div {
  width: 32px;
  height: 32px;
  background-color: #344054cc;
  right: 20px;
  bottom: 20px;
}

.preview-div:hover {
  opacity: 0.5;
}
.preview-price-chip {
  height: 24px;
  padding: 0 8px;
  background-color: #344054cc;
  right: 20px;
  bottom: 60px;
}
.main-image-paper {
  object-fit: cover;
}
</style>
