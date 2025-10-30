<template>
  <div
    id="test-details"
    ref="testDetail"
  >
    <!-- Start : Flying Coin -->
    <div
      class="random-coin"
      :style="coinStyles"
    >
      <ClientOnly>
        <DotLottieVue
          :style="{
            width: `120px`,
            height: `120px`,
          }"
          autoplay
          loop
          src="/static/coins/gold.json"
        />
      </ClientOnly>
    </div>
    <!-- End : Flying Coin -->

    <!-- Coin Consumption Animation -->
    <common-coin-consumption-animation
      :is-visible="showCoinFailAnimation"
      @animation-complete="handleAnimationCoinFailComplete"
    />

    <!--  Start: detail  -->
    <section>
      <v-container
        fluid
        class="py-0 relation-position"
      >
        <!-- Start : Box Showing Balance -->
        <div
          v-show="showBoxBalance"
          ref="boxShowingBalanceRef"
          class="box-showing-balance"
        >
          <span
            ref="amountBalanceRef"
            class="amount-balance"
          >{{
            formattedBalance
          }}</span>
        </div>
        <!-- End : Box Showing Balance -->
        <div class="detail mt-md-4">
          <v-row>
            <v-col
              cols="12"
              md="12"
              class="pt-lg-0"
            >
              <div
                v-show="$route.name == 'test-id'"
                class="label-holder"
              >
                <v-chip
                  v-if="contentData.topic"
                  :to="`/search?type=azmoon&section=${contentData.section}&base=${contentData.base}&lesson=${contentData.lesson}&topic=${contentData.topic}`"
                  class="ma-1 blue-grey darken-1 text-white"
                  size="small"
                >
                  {{ contentData.topic_title }}
                </v-chip>
                <v-chip
                  :to="`/search?type=azmoon&section=${contentData.section}&base=${contentData.base}&lesson=${contentData.lesson}`"
                  class="ma-1 blue-grey darken-1 text-white"
                  size="small"
                >
                  {{ contentData.lesson_title }}
                </v-chip>
                <v-chip
                  :to="`/search?type=azmoon&section=${contentData.section}&base=${contentData.base}`"
                  link
                  class="mr-1 blue-grey darken-1 text-white"
                  size="small"
                >
                  {{ contentData.base_title }}
                </v-chip>
                <v-chip
                  :to="`/search?type=azmoon&section=${contentData.section}`"
                  link
                  class="mr-1 blue-grey darken-1 text-white"
                  size="small"
                >
                  {{ contentData.section_title }}
                </v-chip>
                <v-chip
                  v-if="contentData.tutorial_id"
                  :to="`/tutorial/${contentData.tutorial_id}`"
                  link
                  outlined
                  class="mr-1 blue-grey darken-1"
                  size="small"
                >
                  Tutorial
                </v-chip>
              </div>
              <div
                v-show="route.name==='test-id'"
                class="text-h4 font-weight-bold text-blue-grey-lighten-1"
              >
                Question:
              </div>
              <!--  Description   -->
              <div class="d-flex mb-4">
                <div class="w-100">
                  <div class="description-holder my-4">
                    <v-col
                      class="test-list pt-0"
                      cols="12"
                    >
                      <div
                        id="test-question"
                        ref="test-question"
                        class="text-h4"
                        v-html="contentData.question"
                      />
                      <img
                        v-show="contentData.q_file && contentData.q_file != '0'"
                        class="answer-img"
                        :src="contentData.q_file"
                        alt="Answer Image"
                      >

                      <v-radio-group
                        v-if="
                          contentData.type == 'fourchoice'
                            || contentData.type == 'twochoice'
                            || contentData.type == 'tf'
                        "
                        v-model="selectedOption"
                        hide-details
                        @update:model-value="fireSelectedOption"
                      >
                        <v-radio
                          value="1"
                          class="answer"
                          :class="{
                            'true-answer':
                              isCorrectAnswer(1) && !isLoadingCoinPoint,
                            'false-answer':
                              isIncorrectAnswer(1) && !isLoadingCoinPoint,
                          }"
                        >
                          <template #label>
                            <div
                              ref="choise1"
                              class="answer"
                            >
                              <div class="d-flex">
                                <v-icon
                                  v-show="
                                    isCorrectAnswer(1) && !isLoadingCoinPoint
                                  "
                                  color="success"
                                  class="mr-2 success-answer-icon"
                                >
                                  mdi-check-circle
                                </v-icon>
                                <div
                                  v-show="
                                    !isCorrectAnswer(1) && !isLoadingCoinPoint
                                  "
                                  class="option-icon text-subtitle-1 mr-2"
                                >
                                  A
                                </div>
                                <v-progress-circular
                                  v-show="isLoadingCoinPoint"
                                  color="primary"
                                  indeterminate
                                  :size="30"
                                  class="mr-2"
                                />
                                <div
                                  ref="mathJaxEl"
                                  class="d-inline"
                                  v-html="contentData.answer_a"
                                />
                              </div>
                              <img
                                v-show="contentData.a_file"
                                class="answer-img"
                                :src="contentData.a_file"
                                alt="Answer Image"
                              >
                            </div>
                          </template>
                        </v-radio>
                        <v-radio
                          value="2"
                          class="answer"
                          :class="{
                            'true-answer':
                              isCorrectAnswer(2) && !isLoadingCoinPoint,
                            'false-answer':
                              isIncorrectAnswer(2) && !isLoadingCoinPoint,
                          }"
                        >
                          <template #label>
                            <div
                              ref="choise2"
                              class="answer d-flex"
                            >
                              <v-icon
                                v-show="
                                  isCorrectAnswer(2) && !isLoadingCoinPoint
                                "
                                color="success"
                                class="mr-2 success-answer-icon"
                              >
                                mdi-check-circle
                              </v-icon>
                              <div
                                v-show="
                                  !isCorrectAnswer(2) && !isLoadingCoinPoint
                                "
                                class="option-icon text-subtitle-1 mr-2"
                              >
                                B
                              </div>
                              <v-progress-circular
                                v-show="isLoadingCoinPoint"
                                color="primary"
                                indeterminate
                                :size="30"
                                class="mr-2"
                              />
                              <span
                                ref="mathJaxEl"
                                v-html="contentData.answer_b"
                              />
                              <img
                                v-show="contentData.b_file"
                                :src="contentData.b_file"
                                class="answer-img"
                                alt="Answer Image"
                              >
                            </div>
                          </template>
                        </v-radio>
                        <v-radio
                          v-if="contentData.type == 'fourchoice'"
                          value="3"
                          class="answer"
                          :class="{
                            'true-answer':
                              isCorrectAnswer(3) && !isLoadingCoinPoint,
                            'false-answer':
                              isIncorrectAnswer(3) && !isLoadingCoinPoint,
                          }"
                        >
                          <template #label>
                            <div
                              ref="choise3"
                              class="answer d-flex"
                            >
                              <v-icon
                                v-show="
                                  isCorrectAnswer(3) && !isLoadingCoinPoint
                                "
                                color="success"
                                class="mr-2 success-answer-icon"
                              >
                                mdi-check-circle
                              </v-icon>
                              <div
                                v-show="
                                  !isCorrectAnswer(3) && !isLoadingCoinPoint
                                "
                                class="option-icon text-subtitle-1 mr-2"
                              >
                                C
                              </div>
                              <v-progress-circular
                                v-show="isLoadingCoinPoint"
                                color="primary"
                                indeterminate
                                :size="30"
                                class="mr-2"
                              />
                              <span
                                ref="mathJaxEl"
                                v-html="contentData.answer_c"
                              />
                              <img
                                v-show="contentData.c_file"
                                class="answer-img"
                                :src="contentData.c_file"
                                alt="Answer Image"
                              >
                            </div>
                          </template>
                        </v-radio>
                        <v-radio
                          v-if="contentData.type == 'fourchoice'"
                          value="4"
                          class="answer"
                          :class="{
                            'true-answer':
                              isCorrectAnswer(4) && !isLoadingCoinPoint,
                            'false-answer':
                              isIncorrectAnswer(4) && !isLoadingCoinPoint,
                          }"
                        >
                          <template #label>
                            <div
                              ref="choise4"
                              class="answer d-flex"
                            >
                              <v-icon
                                v-show="
                                  isCorrectAnswer(4) && !isLoadingCoinPoint
                                "
                                color="success"
                                class="mr-2 success-answer-icon"
                              >
                                mdi-check-circle
                              </v-icon>
                              <div
                                v-show="
                                  !isCorrectAnswer(4) && !isLoadingCoinPoint
                                "
                                class="option-icon text-subtitle-1 mr-2"
                              >
                                D
                              </div>
                              <v-progress-circular
                                v-show="isLoadingCoinPoint"
                                color="primary"
                                indeterminate
                                :size="30"
                                class="mr-2"
                              />
                              <span
                                ref="mathJaxEl"
                                v-html="contentData.answer_d"
                              />

                              <img
                                v-show="contentData.d_file"
                                class="answer-img"
                                :src="contentData.d_file"
                                alt="Answer Image"
                              >
                            </div>
                          </template>
                        </v-radio>
                      </v-radio-group>
                    </v-col>
                  </div>

                  <!-- Helpful link -->
                  <div>
                    <v-btn
                      :disabled="!nextTestId"
                      :loading="nextTestLoading"
                      color="info"
                      class=" next-test   text-transform-none"
                      :to="`/test/${nextTestId}`"
                    >
                      <span class="text-white">
                        {{
                          $route.name == "test-id"
                            ? "Next One"
                            : "Time to Test!"
                        }}
                      </span>
                    </v-btn>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </section>

    <!--  End: detail  -->

    <crash-report
      ref="crash_report"
      :report_type_list="report_type_list"
    />
  </div>
</template>

<script setup>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import CrashReport from '~/components/common/crash-report.vue'

const route = useRoute()
const props = defineProps({
  contentData: {
    type: Object,
    default: () => ({}),
  },
})

const _emits = defineEmits(['next'])

const _route = useRoute()
const nuxtApp = useNuxtApp()

const { $renderMathInElement, $ensureMathJaxReady, $toast } = nuxtApp
const nextTestId = ref(null)

const fullAnswer = ref('')
const selectedOption = ref('')
const report_type_list = [
  {
    value: 1,
    label: 'The selected option in the answer sheet is not correct.',
  },
  { value: 2, label: 'There is more than one correct option.' },
  { value: 3, label: 'None of the options are correct.' },
  { value: 4, label: 'There are typos in questions or options.' },
  { value: 5, label: 'This test is similar to another test in the same test.' },
  { value: 6, label: 'There are problems in the descriptive answer.' },
  { value: 7, label: 'This test is out of budget or topic.' },
  { value: 8, label: 'Other cases' },
]
const nextTestLoading = ref(false)

const balance = ref(0.0)
const pointPriceQuestion = ref(0)
const showBoxBalance = ref(true)
const isAnswerToQuestion = ref(false)
const SMALL_SIZE_COIN = 40
const BIG_SIZE_COIN = 120
const testDetail = ref(null)
const coinStyles = ref({
  position: 'absolute',
  left: '100px',
  top: '100px',
  zIndex: 999,
  pointerEvents: 'auto',
  cursor: 'pointer',
  transition: 'none',
  opacity: 0,
  scale: 1,
})
const isLoadingCoinPoint = ref(false)
const boxShowingBalanceRef = ref(null)
const amountBalanceRef = ref(null)
const showCoinFailAnimation = ref(false)

const mathJaxEl = ref(null)
const crash_report = ref(null)

onMounted(async () => {
  setTimeout(() => {
    renderMathJax()
  }, 2000)
  loadNextTest()
  await $ensureMathJaxReady?.()
  if (testDetail.value) {
    $renderMathInElement?.(testDetail.value)
  }
  setInitialPositionCoin()
})

function isCorrectAnswer(option) {
  return selectedOption.value && option == props.contentData.true_answer
}
function isIncorrectAnswer(option) {
  return (
    selectedOption.value
    && option == selectedOption.value
    && option != props.contentData.true_answer
  )
}
function renderMathJax() {
  if (
    typeof window !== 'undefined'
    && $renderMathInElement
    && testDetail.value
  ) {
    $renderMathInElement(testDetail.value)
  }
}
function setInitialPositionCoin() {
  const testDetailElement = testDetail.value
  const testDetailElementBoundingRect
    = testDetailElement.getBoundingClientRect()
  coinStyles.value.top = `${
    testDetailElementBoundingRect.top
    + testDetailElementBoundingRect.height / 2
    - BIG_SIZE_COIN / 2
  }px`
  coinStyles.value.left = `${
    testDetailElementBoundingRect.left
    + testDetailElementBoundingRect.width / 2
    - BIG_SIZE_COIN / 2
  }px`
}
function animationSuccessCoin() {
  coinStyles.value.scale = SMALL_SIZE_COIN / BIG_SIZE_COIN
  coinStyles.value.opacity = 1

  setTimeout(() => {
    coinStyles.value.transition = 'all 1s ease'
    coinStyles.value.scale = 1
  }, 500)
}
function animationFadeOutCoin() {
  coinStyles.value.transition = 'none'
  coinStyles.value.opacity = 0
  coinStyles.value.scale = SMALL_SIZE_COIN / BIG_SIZE_COIN
}
function animationFadeInBoxBalance(boxShowingBalanceElement, nameAnimation) {
  showBoxBalance.value = true
  boxShowingBalanceElement.classList.add(nameAnimation)
}
function animationCountingBalance(
  amountBalanceElement,
  balanceChangeDirection,
) {
  setTimeout(() => {
    const startValue = Number(balance.value)
    const displacementAmount = pointPriceQuestion.value
    const endValue = parseFloat(
      (startValue + displacementAmount * balanceChangeDirection).toFixed(7),
    )
    const duration = 1000
    const stepTime = 30
    let current = startValue
    const steps = Math.ceil(duration / stepTime)
    const amountStep = Math.abs(endValue - startValue) / steps
    amountBalanceElement.classList.add(
      'pulsing',
      balanceChangeDirection == 1 ? 'increasing' : 'decreasing',
    )
    const counter = setInterval(() => {
      current = current + balanceChangeDirection * amountStep
      if (current >= endValue && balanceChangeDirection == 1) {
        current = endValue
        clearInterval(counter)
      }
      if (current <= endValue && balanceChangeDirection == -1) {
        current = endValue
        clearInterval(counter)
      }
      balance.value = parseFloat(current.toFixed(7))
    }, stepTime)
  }, 600)
}
function animationFadeOutBoxBalance(
  amountBalanceElement,
  boxShowingBalanceElement,
) {
  setTimeout(() => {
    boxShowingBalanceElement.classList.remove('animate-in', 'animate-in-error')
    boxShowingBalanceElement.classList.add('animate-out')
  }, 3000)
  setTimeout(() => {
    amountBalanceElement.classList.remove(
      'pulsing',
      'decreasing',
      'increasing',
    )
    boxShowingBalanceElement.classList.remove('animate-out')
    showBoxBalance.value = false
  }, 3500)
}
function playSound(sound) {
  const audio = new Audio(`/assets/sounds/${sound}.mp3`)
  audio.play().catch((e) => {
    console.warn('Failed to play audio:', e)
  })
}
function handleAnimationCoinFailComplete() {
  const boxShowingBalanceElement = boxShowingBalanceRef.value
  const amountBalanceElement = amountBalanceRef.value
  showCoinFailAnimation.value = false
  animationFadeInBoxBalance(boxShowingBalanceElement, 'animate-in-error')
  animationCountingBalance(amountBalanceElement, -1)
  animationFadeOutBoxBalance(amountBalanceElement, boxShowingBalanceElement)
}

function selectCorrectAnswer() {
  const boxShowingBalanceElement = boxShowingBalanceRef.value
  const amountBalanceElement = amountBalanceRef.value

  animationSuccessCoin()
  playSound('success')
  setTimeout(() => {
    animationFadeOutCoin()
    animationFadeInBoxBalance(boxShowingBalanceElement, 'animate-in')
    animationCountingBalance(amountBalanceElement, 1)
    animationFadeOutBoxBalance(amountBalanceElement, boxShowingBalanceElement)
  }, 2500)
}

function selectWrongAnswer() {
  playSound('fail')
  showCoinFailAnimation.value = true
}

const formattedBalance = computed(() => {
  const value = Number(balance.value).toFixed(7)
  return balance.value > 0 ? `+${value}` : value
})

async function fireSelectedOption() {
  pointPriceQuestion.value = 0
  if (!isAnswerToQuestion.value) {
    try {
      isLoadingCoinPoint.value = true
      const response = await useApiService.post(`/api/v2/games/test-time`, {
        testId: props.contentData.id,
        submissionId: Number(selectedOption.value),
      })
      if (response.succeeded) {
        if (response.data.isCorrect) {
          pointPriceQuestion.value = Math.abs(response.data.points)
          selectCorrectAnswer()
        }
        else {
          pointPriceQuestion.value = Math.abs(response.data.points)
          selectWrongAnswer()
        }
      }
      else {
        $toast.error(response.errors[0].message)
      }
    }
    catch (error) {
      $toast.error(error)
    }
    finally {
      isLoadingCoinPoint.value = false
    }
  }
  isAnswerToQuestion.value = true
  fullAnswer.value = 0
  balance.value = 0.0
}
function loadNextTest() {
  nextTestLoading.value = true
  selectedOption.value = ''
  isAnswerToQuestion.value = false
  fullAnswer.value = ''
  $fetch(
    `/api/v1/examTests/random?lesson=${props.contentData.lesson}&topic=${props.contentData.topic}`,
  )
    .then((response) => {
      if (response.data.code) nextTestId.value = response.data.code
    })
    .catch((_err) => {})
    .finally(() => {
      nextTestLoading.value = false
    })
}
</script>

<style scoped>
.content_main_info {
  padding: 27px;
  background: #f5f5f5 !important;
  border-radius: 6px;
}
.option-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid black;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content_main_info .creator_title {
  font-size: 18px;
}

.order-btn-holder {
  position: fixed !important;
  bottom: 0 !important;
  right: 0 !important;
  left: 0 !important;
  z-index: 2 !important;
  border-top: 0.1rem solid #e1e2e3;
}

.order-btn-holder .v-btn {
  width: 40% !important;
}

.order-btn-holder span {
  font-size: 1.3rem;
}

p {
  font-size: 1.3rem !important;
}

.answer {
  padding: 0.3rem 0.2rem 0.2rem 0.2rem;
}

.true-answer {
  background: transparent !important;
  border: 1px solid #4caf50;
  /* Green background color */
  color: inherit !important;
  /* White text color */
  border-radius: 10px;
}

.false-answer {
  background: transparent !important;
  border: 1px solid #f44336;
  /* Red background color */
  color: inherit !important;
  /* White text color */
  border-radius: 10px;
}

.answer {
  align-items: center;
  display: flex;
  height: auto;
  outline: none;
}

.answer-img {
  max-height: 15rem;
  width: auto;
}

/* Box Showing Balance */
@keyframes show-balance-box {
  0% {
    transform: translateY(-20px);
    opacity: 0;
  }

  100% {
    transform: translateY(76px);
    opacity: 1;
  }
}

@keyframes animateOut {
  0% {
    transform: translateY(76px);
    opacity: 1;
  }

  100% {
    transform: translateY(-50px);
    opacity: 0;
  }
}

.box-showing-balance {
  padding: 10px 20px;
  border: 2px solid #ffb600;
  border-radius: 10px;
  position: fixed;
  right: 80px;
  top: -10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 20px;
  opacity: 0;
  transform: translateY(-20px);
  transition: border 0.5s ease;
  z-index: 3;
  max-width: 300px;
}

.box-showing-balance.animate-in {
  animation: show-balance-box 0.6s ease-out forwards;
  border: 2px solid green;
  background-color: rgb(197 248 197 / 76%);
}

.box-showing-balance.animate-out {
  animation: animateOut 0.5s ease forwards;
}

.box-showing-balance.animate-in-error {
  animation: show-balance-box 0.6s ease-out forwards;
  border: 2px solid red;
  background-color: rgba(255, 199, 199, 0.76);
}

.amount-balance {
  font-size: 20px;
  font-weight: 700;
  color: black;
}

.amount-balance.increasing {
  color: green;
}

.amount-balance.decreasing {
  color: red;
}

@keyframes pulse-scale {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

.amount-balance.pulsing {
  animation: pulse-scale 0.3s ease-in-out infinite;
}

.relation-position {
  position: relative;
}
.success-answer-icon {
  font-size: 30px;
}
@media (max-width: 1264px) {
  .box-showing-balance {
    right: 20px;
    top: 20px;
  }
  @keyframes show-balance-box {
    0% {
      transform: translateY(-20px);
      opacity: 0;
    }

    100% {
      transform: translateY(50px);
      opacity: 1;
    }
  }
  @keyframes animateOut {
    0% {
      transform: translateY(50px);
      opacity: 1;
    }

    100% {
      transform: translateY(-50px);
      opacity: 0;
    }
  }
}
</style>
