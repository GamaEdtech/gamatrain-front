<template>
  <div
    v-show="visible"
    class="w-100 pa-4 rounded-lg mt-12 box-question position-relative"
  >
    <div class="lable-div position-absolute text-white text-h4 pa-2">
      Time To Test
    </div>
    <div
      v-if="
        randomTestContent
          && randomTestContent.answer_full
          && randomTestContent.answer_full.length > 0
      "
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
    <div
      v-if="loadingRandomTest"
      class="w-100 h-100 d-flex flex-column align-start justify-start ga-2"
    >
      <v-skeleton-loader
        width="300"
        height="30"
        class="w-100 rounded-pill"
      />

      <v-skeleton-loader
        width="150"
        height="20"
        class="mt-10 rounded-pill"
      />
      <v-skeleton-loader
        width="150"
        height="20"
        class="rounded-pill"
      />
      <v-skeleton-loader
        width="150"
        height="20"
        class="rounded-pill"
      />
      <v-skeleton-loader
        width="150"
        height="20"
        class="rounded-pill"
      />
    </div>

    <TestDetails
      v-else
      :content-data="randomTestContent"
    />

    <div
      v-if="
        randomTestContent
          && randomTestContent.answer_full
          && randomTestContent.answer_full.length > 0
      "
      ref="fullAnswerRef"
      class="w-100 mt-4 d-flex flex-column align-start justify-start px-8"
    >
      <div v-show="isPaymentComplete">
        <div class="text-h4 font-weight-bold text-blue-grey-lighten-1">
          Solution:
        </div>
        <div
          class="text-h4 mt-4"
          v-html="randomTestContent.answer_full"
        />
      </div>
    </div>

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
  </div>
</template>

<script setup lang="ts">
import type { ApiResult } from '~/interfaces/api'

interface RandomTestCodeDTO {
  code: string
}

interface IBoxRandomQuestion {
  lesson?: string
}
const props = defineProps<IBoxRandomQuestion>()

const { $renderMathInElement, $ensureMathJaxReady, $toast } = useNuxtApp()
const auth = useAuth()
const visible = ref(false)

const randomTestContent = ref<Record<string, string> | undefined>(undefined)
const loadingRandomTest = ref(true)

const getRandomTestCode = async () => {
  if (props.lesson) {
    try {
      const response = await useApiService.get<ApiResult<RandomTestCodeDTO>>(
        `/api/v1/examTests/random?lesson=${props.lesson}`,
      )
      if (response.data?.code) {
        await getRandomTest(response.data.code)
      }
    }
    catch (error: unknown) {
      console.log('error', error)
    }
    finally {
      loadingRandomTest.value = false
    }
  }
}
const getRandomTest = async (code: string) => {
  try {
    const response = await useApiService.get<ApiResult<Record<string, string>>>(
      `/api/v1/examTests/${code}`,
    )
    if (response.data) {
      randomTestContent.value = response.data
    }
  }
  catch (error: unknown) {
    console.log('error', error)
  }
  finally {
    if (randomTestContent.value) visible.value = true
    loadingRandomTest.value = false
  }
}

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
  await getRandomTestCode()

  if (
    auth.isAuthenticated.value
    && randomTestContent.value
    && randomTestContent.value.answer_full
    && randomTestContent.value.answer_full.length > 0
  ) {
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

<style scoped>
.box-question {
  border: 1px solid #e1e2e3;
  min-height: 250px;
}
.lable-div {
  background-color: #000;
  top: -42px;
  border-radius: 8px 8px 0 0;
}
</style>
