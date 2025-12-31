<template>
  <v-container class="d-flex flex-column mt-10 mt-md-16">
    <template v-if="!contentData">
      <v-skeleton-loader type="subtitle" />
      <v-skeleton-loader
        v-for="(loader, index) in 4"
        :key="index"
        type="paragraph"
      />
    </template>
    <div
      v-if="contentData.answer_full.length > 0"
      class="w-100 d-flex align-center justify-end px-8"
    >
      <v-btn
        variant="tonal"
        color="info"
        flat
        width="40"
        height="40"
        class="text-h6"
        icon="md:question_mark"
        :disabled="isPaymentComplete"
        @click="showCoinPaymentModal = true"
      />
    </div>

    <test-details
      v-if="contentData"
      :content-data="contentData"
      @next="handleLoadNextTest"
    />

    <div
      v-if="contentData.answer_full.length > 0"
      ref="fullAnswerRef"
      class="w-100 mt-4 d-flex flex-column align-start justify-start px-8"
    >
      <div v-show="isPaymentComplete">
        <div
          class="text-h4 font-weight-bold text-blue-grey-lighten-1"
        >
          Solution:
        </div>
        <div
          class="text-h4 mt-4"
          v-html="contentData.answer_full"
        />
      </div>
    </div>

    <v-row>
      <v-col
        cols="12"
        class="px-7"
      >
        <v-chip
          link
          class="mr-1 bg-blue-grey-darken-1 text-white"
          :small="display.mdAndDown"
          :to="`/search?type=paper&section=${contentData?.section}`"
        >
          {{ contentData?.section_title }}
        </v-chip>
        <v-chip
          link
          class="mr-1 bg-blue-grey-darken-1 text-white"
          :small="display.mdAndDown"
          :to="`/search?type=paper&section=${contentData?.section}&base=${contentData?.base}`"
        >
          {{ contentData?.base_title }}
        </v-chip>
        <v-chip
          class="ma-1 bg-blue-grey-darken-1 text-white"
          :small="display.mdAndDown"
          :to="`/search?type=paper&section=${contentData?.section}&base=${contentData?.base}&lesson=${contentData?.lesson}`"
        >
          {{ contentData?.lesson_title }}
        </v-chip>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        class="px-6"
      >
        <CommonDetailSubjectDirectoryNav :content-data="contentData" />
      </v-col>
    </v-row>

    <v-row
      justify="center"
      class="mt-10"
    >
      <v-col
        cols="12"
        md="8"
        class="text-center"
      >
        <common-ad-banner
          v-model="isAdsLoad"
          adslot="7199289937"
        />
      </v-col>
    </v-row>

    <!-- Coin Payment Modal -->
    <modals-coin-payment-modal
      v-model:is-open="showCoinPaymentModal"
      :user-balance="coinBalance.balance.value"
      :is-processing="coinBalance.isLoading.value || isProcessingPayment"
      text-modal="Unlock the answer by finding 5 Coins hidden on the site—don’t worry, it’s all part of the game!"
      @confirm="handleCoinPaymentConfirm"
      @close="handleCoinPaymentClose"
    />

    <!-- Coin Consumption Animation -->
    <common-coin-consumption-animation
      :is-visible="showCoinAnimation"
      @animation-complete="handleAnimationComplete"
    />
  </v-container>
</template>

<script setup>
const { $renderMathInElement, $ensureMathJaxReady, $toast } = useNuxtApp()
const auth = useAuth()
const route = useRoute()
const testId = ref(route.params.id)
const isAdsLoad = ref(false)
const display = useGlobalDisplay()

// Fetch data
const {
  data: contentData,
  pending: _pending,
  refresh,
  execute: _execute,
} = await useAsyncData(`exam-test-${route.params.id}`, async () => {
  const res = await useApiService.get(`/api/v1/examTests/${route.params.id}`,
    { full: true },
  )
  if (res.status === 1) {
    return res.data
  }
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
})

const handleLoadNextTest = (id) => {
  testId.value = id
  refresh()
}

// Utility functions
const stripHtml = html => (html ? html.replace(/<[^>]+>/g, '') : '')
const cleanSubject = name => (name ? name.replace(/\s*\(.*?\)/, '') : '')

// Head/meta
useHead({
  titleTemplate: '%s Gamatrain',
  title: computed(
    () =>
      `${stripHtml(contentData.value?.question)?.substring(
        0,
        100,
      )} | ${cleanSubject(contentData.value?.lesson_title)} Quiz`,
  ),
  meta: [
    {
      name: 'apple-mobile-web-app-title',
      content: computed(
        () =>
          `${stripHtml(contentData.value?.question)?.substring(
            0,
            100,
          )} | ${cleanSubject(contentData.value?.lesson_title)} Quiz`,
      ),
    },
    {
      name: 'og:title',
      content: computed(
        () =>
          `${stripHtml(contentData.value?.question)?.substring(
            0,
            100,
          )} | ${cleanSubject(contentData.value?.lesson_title)} Quiz`,
      ),
    },
    {
      name: 'og:site_name',
      content: 'GamaTrain',
    },
    {
      name: 'description',
      content: computed(() => stripHtml(contentData.value?.question)),
    },
    {
      name: 'og:description',
      content: computed(() => stripHtml(contentData.value?.question)),
    },
  ],
})

const coinBalance = useCoinBalance()
const showCoinPaymentModal = ref(false)
const showCoinAnimation = ref(false)
const isProcessingPayment = ref(false)
const fullAnswerRef = ref(null)
const isPaymentComplete = ref(false)

const handleCoinPaymentConfirm = async () => {
  isProcessingPayment.value = true

  try {
    const success = await coinBalance.deductCoins(
      5,
      'See Full Answer Question',
    )
    if (success) {
      showCoinAnimation.value = true
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
}

const handleAnimationComplete = async () => {
  // Close everything immediately when animation completes
  showCoinAnimation.value = false
  showCoinPaymentModal.value = false
  isPaymentComplete.value = true
}

const renderMathJax = () => {
  if (
    typeof window !== 'undefined'
    && $renderMathInElement
    && fullAnswerRef.value
  ) {
    $renderMathInElement(fullAnswerRef.value)
  }
}

onMounted(async () => {
  if (auth.isAuthenticated.value && contentData.value.answer_full.length > 0) {
    await coinBalance.fetchBalance()

    setTimeout(() => {
      renderMathJax()
    }, 2000)
    await $ensureMathJaxReady?.()
    if (fullAnswerRef.value) {
      $renderMathInElement?.(fullAnswerRef.value)
    }
  }
})
</script>
