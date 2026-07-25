<template>
  <div class="w-100 d-flex flex-column align-start justify-start py-4 mt-md-0 mt-6">
    <div
      v-if="showChips"
      class="w-100 d-flex align-center ga-2 flex-wrap"
    >
      <v-chip
        v-for="chip in chips"
        :key="chip.title"
        variant="flat"
        :class="chipClass"
        color="grey100"
        :size="smAndUp ? 'large' : 'small'"
        :to="{
          path: '/search',
          query: chip.params,
        }"
      >
        <span :class="chipTextClass">
          {{ chip.title }}
        </span>
      </v-chip>
    </div>
    <div class="w-100 d-flex align-center mt-4">
      <div
        v-if="contentData.answer_full.length > 0"
        class="w-100 d-flex align-center justify-end"
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
          @click="openPaymentModal"
        />
      </div>
    </div>

    <div
      ref="textQuestionRef"
      class="container-question w-100 d-flex flex-column align-start justift-start mt-6"
    >
      <div
        :class="[
          'test-text text-grey700 font-weight-semibold',
          { 'test-text-sm': smAndUp },
        ]"
        v-html="contentData.question"
      />
      <img
        v-if="contentData.q_file && contentData.q_file != '0'"
        class="answer-img mt-1 ma-auto ms-sm-0"
        :src="contentData.q_file"
        alt="Question Image"
      >
      <div
        v-if="contentData.type == 'fourchoice' || contentData.type == 'twochoice'
          || contentData.type == 'tf'"
        class="w-100 d-flex flex-column align-start justify-start px-1 px-sm-3 mt-4 ga-4"
      >
        <div
          v-for="item in answers"
          :key="item.key"
          class="w-100 d-flex flex-column align-start ga-2 cursor-pointer position-relative container-choice"
          @click="handleAnswerSelect(item.key)"
        >
          <div class="w-100 d-flex flex-nowrap align-start ga-3">
            <div
              :class="[
                'choice-div flex-shrink-0 font-weight-regular text-grey800 d-flex align-center justify-center rounded-lg border-md border-solid border-opacity-100',
                {
                  'border-grey200': getChoiceStatus(item.key) === 'default',
                  'border-success': getChoiceStatus(item.key) === 'success',
                  'border-lightError': getChoiceStatus(item.key) === 'error',
                  'border-primary': getChoiceStatus(item.key) === 'loading',
                },
              ]"
            >
              <v-progress-circular
                v-if="getChoiceStatus(item.key) === 'loading'"
                color="primary"
                size="20"
                indeterminate
                :width="2"
              />
              <span v-else-if="getChoiceStatus(item.key) === 'default'">{{ item.key }}</span>

              <v-icon
                v-else-if="getChoiceStatus(item.key) === 'success'"
                color="success"
              >
                md:check
              </v-icon>

              <v-icon
                v-else
                color="lightError"
              >
                md:close
              </v-icon>
            </div>
            <div
              :class="[
                'test-text flex-grow-1 font-weight-regular choice-text text-grey800 overflow-x-auto overflow-y-hidden',
                { 'test-text-sm': smAndUp },
              ]"
              v-html="item.text"
            />
          </div>
          <img
            v-if="item.file"
            class="answer-img mt-1"
            :src="item.file"
            alt="Answer Image"
          >
        </div>
      </div>
    </div>

    <div
      v-if="contentData.answer_full.length > 0 && isPaymentComplete"
      ref="fullAnswerRef"
      class="w-100 mt-4 d-flex flex-column align-start justify-start px-2 px-sm-8"
    >
      <div
        :class="['test-text font-weight-bold text-grey600', { 'test-text-sm': smAndUp }]"
      >
        Solution:
      </div>
      <div
        :class="['test-text text-grey800 mt-4', { 'test-text-sm': smAndUp }]"
        v-html="contentData.answer_full"
      />
    </div>

    <div class="w-100 d-flex align-center justify-center justify-sm-start mt-6">
      <div class="w-100 w-sm-25">
        <v-btn
          :disabled="!nextTestId && !ssrNextTestId"
          :loading="nextTestLoading"
          color="primary"
          rounded="pill"
          block
          flat
          :to="`/test/${ssrNextTest ? ssrNextTestId : nextTestId}`"
        >
          <span class="text-h5 font-weight-medium text-grey800">
            {{ buttonNextText }}
          </span>
        </v-btn>
      </div>
    </div>

    <lazy-test-success-coin-animation
      :is-start-animation="isStartSuccessAnimation"
      @complete-success-animation="completeSuccessCoinAnimation"
    />
    <lazy-test-counting-wallet-animation
      :is-start-animation="isStartWalletAnimation"
      :direction="directionWalletAniamtion"
      :delta-price="questionReward"
      @complete-animation="completeWalletAnimation"
    />
    <lazy-common-coin-consumption-animation
      v-model:is-visible="isStartFailCoinAnimation"
      @animation-complete="completeFailAnimation"
    />

    <lazy-modals-coin-payment-modal
      v-if="showCoinPaymentModal"
      v-model:show-dialog="showCoinPaymentModal"
      :user-balance="balance"
      :is-processing="isLoading || isProcessingPayment"
      text-modal="Unlock the answer by finding 5 Coins hidden on the site—don’t worry, it’s all part of the game!"
      @confirm="handleCoinPaymentConfirm"
      @close="handleCoinPaymentClose"
    />
  </div>
</template>

<script setup lang="ts">
import type { QuestionDTO, NextQuestionDTO, ApiResult, TestTimeDTO, AppError } from '@/types'
import { useDisplay } from 'vuetify/lib/composables/display.mjs'

interface ITestDetail {
  contentData: QuestionDTO
  buttonNextText?: string
  showChips?: boolean
  ssrNextTest?: boolean
  ssrNextTestId?: string
}

const { $renderMathInElement, $ensureMathJaxReady, $toast } = useNuxtApp()
const auth = useAuth()
const router = useRouter()
const props = withDefaults(defineProps<ITestDetail>(), {
  buttonNextText: 'Next One',
  ssrNextTest: false,
})

const isAnswerSelected = ref(false)
const selectedAnswer = ref<string | null>(null)
const answers = computed(() => [
  { key: '1', text: props.contentData.answer_a, file: props.contentData.a_file },
  { key: '2', text: props.contentData.answer_b, file: props.contentData.b_file },
  { key: '3', text: props.contentData.answer_c, file: props.contentData.c_file },
  { key: '4', text: props.contentData.answer_d, file: props.contentData.d_file },
].filter(a => a.text || a.file))
const isLoadingGetAnswerAndPoint = ref(false)

const isStartSuccessAnimation = ref(false)
const isStartWalletAnimation = ref(false)
const isStartFailCoinAnimation = ref(false)
const directionWalletAniamtion = ref(1)
const questionReward = ref(0)

const { balance, fetchBalance, consumeCoins, isLoading } = useCoinBalance()
const showCoinPaymentModal = ref(false)
const isProcessingPayment = ref(false)
const fullAnswerRef = ref(null)
const isPaymentComplete = ref(false)
const isStartProcessShowAnswer = ref(false)

const nextTestId = ref()
const nextTestLoading = ref(false)

const { smAndUp } = useDisplay()

const chipClass = 'text-subtitle-1 px-3'
const chipTextClass = 'text-grey500 text-h6 text-sm-h5 font-weight-regular'

const chips = computed(() => {
  const data = props.contentData

  return [{
    title: data.section_title,
    params: {
      type: 'paper',
      section: data.section,
    },
  },
  {
    title: data.base_title,
    params: {
      type: 'paper',
      section: data.section,
      base: data.base,
    },
  },
  {
    title: data.lesson_title,
    params: {
      type: 'paper',
      section: data.section,
      base: data.base,
      lesson: data.lesson,
    },
  },
  {
    title: data.topic_title,
    params: {
      type: 'paper',
      section: data.section,
      base: data.base,
      lesson: data.lesson,
      topic: data.topic,
    },
  },
  ].filter(chip => chip.title)
})

const completeSuccessCoinAnimation = () => {
  isStartSuccessAnimation.value = false
  isStartWalletAnimation.value = true
}

const completeWalletAnimation = () => {
  isStartWalletAnimation.value = false
}

const completeFailAnimation = async () => {
  isStartFailCoinAnimation.value = false
  if (isStartProcessShowAnswer.value) {
    isPaymentComplete.value = true
    isStartProcessShowAnswer.value = false
    questionReward.value = 5
    directionWalletAniamtion.value = -1
    isStartWalletAnimation.value = true
    await nextTick()
    if (fullAnswerRef.value) {
      $renderMathInElement?.(fullAnswerRef.value)
    }
  }
  else {
    isStartWalletAnimation.value = true
  }
}

const handleAnswerSelect = async (answer: string) => {
  if (isAnswerSelected.value) return

  selectedAnswer.value = answer
  isAnswerSelected.value = true
  await checkAndGetPointQuestion()
}

const checkAndGetPointQuestion = async () => {
  try {
    isLoadingGetAnswerAndPoint.value = true
    const response = await useApiService.post<ApiResult<TestTimeDTO>>(`/api/v2/games/test-time`, {
      testId: props.contentData.id,
      submissionId: Number(selectedAnswer.value),
    })
    if (response.succeeded && response.data) {
      if (response.data?.isCorrect) {
        questionReward.value = Math.abs(response.data.points) / 1_000_000
        directionWalletAniamtion.value = 1
        isStartSuccessAnimation.value = true
      }
      else {
        questionReward.value = Math.abs(response.data.points) / 1_000_000
        directionWalletAniamtion.value = -1
        isStartFailCoinAnimation.value = true
      }
    }
    else {
      $toast.error(response.errors[0].message)
    }
  }
  catch (err) {
    const error = err as AppError
    if (error.response?.status === 403) {
      router.push({ query: { auth_form: 'login' } })
    }
    else if (error.response?.status === 400) {
      $toast.error(error.response?.data?.message || '')
    }
  }
  finally {
    isLoadingGetAnswerAndPoint.value = false
  }
}

const getChoiceStatus = (choice: string) => {
  if (isLoadingGetAnswerAndPoint.value) return 'loading'
  if (!isAnswerSelected.value) return 'default'

  if (choice === props.contentData.true_answer) return 'success'

  if (choice === selectedAnswer.value) return 'error'

  return 'default'
}

const textQuestionRef = ref<HTMLElement>()
onMounted(async () => {
  await $ensureMathJaxReady?.()
  if (textQuestionRef.value) {
    $renderMathInElement?.(textQuestionRef.value)
  }

  if (auth.isAuthenticated.value && props.contentData.answer_full.length > 0) {
    await fetchBalance()
  }

  if (!props.ssrNextTest) {
    await loadNextTest()
  }
})

const openPaymentModal = async () => {
  if (auth.isAuthenticated.value) {
    showCoinPaymentModal.value = true
  }
  else {
    router.push({ query: { auth_form: 'login' } })
  }
}

const handleCoinPaymentConfirm = async () => {
  isProcessingPayment.value = true

  try {
    const response = await consumeCoins(
      5,
      'Test',
      props.contentData.id as unknown as number,
      'See Full Answer Question',
    ) as ApiResult<unknown>
    if (response.succeeded) {
      showCoinPaymentModal.value = false
      isStartProcessShowAnswer.value = true
      isStartFailCoinAnimation.value = true
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

const loadNextTest = async () => {
  try {
    nextTestLoading.value = true
    const response = await useApiService.get<ApiResult<NextQuestionDTO>>(
      `/api/v1/examTests/random?lesson=${props.contentData.lesson}&topic=${props.contentData.topic}`,
      undefined,
      {
        public: true,
      },
    )
    if (response.data && response.data.code) {
      nextTestId.value = response.data.code
    }
  }
  catch (err) {
    const error = err as AppError
    if (error.response?.status === 403) {
      router.push({ query: { auth_form: 'login' } })
    }
    else if (error.response?.status === 400) {
      $toast.error(error.response?.data?.message || '')
    }
  }
  finally {
    nextTestLoading.value = false
  }
}
</script>

<style scoped>
.answer-img {
  /* max-height: 15rem; */
  width: auto;
  max-width: 100%;
}
.container-choice {
  min-height: 24px;
}
.choice-div {
  min-width : 24px;
  min-height: 24px;
  max-width : 24px;
  max-height: 24px;
  font-size: 1.4rem;
}
.choice-text {
  min-width: 0;
  line-height: 22px;
}

.test-text {
  font-size: 1.6rem;
}

.test-text-sm {
  font-size: 1.8rem;
}
</style>
