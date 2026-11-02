<template>
  <div class="preview-card">
    <!-- The paper always sits on a white sheet: many thumbnails are transparent PNGs, unreadable on the dark theme.
         The fixed 496:702 box (the thumbnails' own shape) keeps the space before the image loads. -->
    <!-- Tapping the paper opens the preview too, so a tap on the picture isn't a dead click. -->
    <component
      :is="files?.pdf?.exist ? 'button' : 'div'"
      :type="files?.pdf?.exist ? 'button' : undefined"
      :aria-label="files?.pdf?.exist ? 'Preview the paper' : undefined"
      class="sheet position-relative overflow-hidden rounded-lg pa-0"
      @click="files?.pdf?.exist && requestPreview()"
    >
      <img
        :src="thumbPic"
        :alt="alt"
        width="496"
        height="702"
        class="sheet__image"
        fetchpriority="high"
        loading="eager"
        decoding="async"
      >
    </component>

    <div class="preview-side d-flex flex-column ga-3">
      <!-- Phones and tablets show the paper's facts here, under the page; desktop shows them under the title. -->
      <slot />
      <v-btn
        v-if="files?.pdf?.exist"
        color="brandNavy"
        size="large"
        rounded="lg"
        flat
        block
        class="text-h5 font-weight-heavy text-none"
        :loading="loadingPreview"
        prepend-icon="md:crop_free"
        @click="requestPreview"
      >
        Preview<span class="d-none d-sm-inline">&nbsp;{{ pagesLabel }}</span>
        <span
          v-if="previewPrice"
          class="preview-price d-inline-flex align-center ga-1 ml-2 px-2 rounded-pill text-h6"
        >
          <v-icon
            size="14"
            color="primary"
            aria-hidden="true"
          >md:diamond_outlined</v-icon>
          {{ previewPrice }}
        </span>
        <span
          v-else
          class="ml-1 text-h6 font-weight-semibold opacity-80"
        >(free)</span>
      </v-btn>
    </div>

    <client-only>
      <lazy-common-pdf-preview-dialog
        v-model="previewDialog"
        :title="previewTitle"
        :pdf-url="previewPdfUrl"
        :file-name="previewFileName"
      />
    </client-only>

    <!-- Same entitlement/upgrade flow as the Download rows - preview goes through the
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

    <!-- Same "what did this just cost me" feedback as the Download rows: a coin-spend
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
  qFilePages?: string | number
}

const props = defineProps<IPreviewActionCard>()

const auth = useAuth()
const router = useRouter()
const { downloadFile } = useDownload()

const previewDialog = ref(false)
const previewPdfUrl = ref('')
const previewFileName = ref('')
const previewTitle = ref('')
const loadingPreview = ref(false)
const previewPrice = computed(() => props.files?.pdf?.price ?? 0)
const pagesLabel = computed(() => (Number(props.qFilePages) ? `all ${props.qFilePages} pages` : 'the full paper'))

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

const upgradePlanSuccessfully = async () => {
  showCoinPaymentModal.value = false
  await requestPreview()
}

const handleCoinAnimationComplete = () => {
  showCoinAnimation.value = false
  isStartWalletAnimation.value = true
}
</script>

<style scoped lang="scss">
@use 'sass:map';
@use 'vuetify/settings' as vuetify;

/* The whole first page, in the thumbnails' own 496:702 shape so its space is kept before it loads. Phones and
   tablets centre it at a readable size; desktop gives it the full side column. */
.preview-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.sheet {
  display: block;
  width: 100%;
  max-width: 320px;
  align-self: center;
  aspect-ratio: 496 / 702;
  /* The `white` token is white in both themes. */
  background-color: rgb(var(--v-theme-white));
  border: 1px solid rgb(var(--v-theme-grey200));
}
button.sheet {
  cursor: zoom-in;
}
.sheet__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
@media #{map.get(vuetify.$display-breakpoints, 'md-and-up')} {
  .sheet {
    max-width: none;
  }
}
.preview-price {
  background-color: rgba(var(--v-theme-white), 0.15);
}
</style>
