<template>
  <div
    id="test-details"
    ref="testDetail"
  >
    <!-- Start : Flying Coin -->
    <div
      ref="coinElement"
      class="flying-coin-div d-none"
    >
      <div class="inner-coin-div">
        <span class="text-coin">$GET</span>
      </div>
    </div>
    <!-- End : Flying Coin -->

    <!--  Start: detail  -->
    <section>
      <v-container class="py-0 relation-position">
        <!-- Start : Box Showing Balance -->
        <div
          v-show="showBoxBalance"
          ref="boxShowingBalance"
          class="box-showing-balance"
        >
          <span class="title-balance">$GET: </span>
          <span
            ref="amountBalance"
            class="amount-balance"
          >{{
            Number(balance).toFixed(8)
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
                      >

                      <v-radio-group
                        v-if="
                          contentData.type == 'fourchoice'
                            || contentData.type == 'twochoice'
                            || contentData.type == 'tf'
                        "
                        v-model="selectedOption"
                        hide-details
                        @change="fireSelectedOption"
                      >
                        <v-radio
                          value="1"
                          class="answer"
                          :class="{
                            'true-answer': isCorrectAnswer(1),
                            'false-answer': isIncorrectAnswer(1),
                          }"
                        >
                          <template #label>
                            <div
                              ref="choise1"
                              class="answer"
                            >
                              <div>
                                <v-icon
                                  v-show="isCorrectAnswer(1)"
                                  color="success"
                                  class="mr-2 success-answer-icon"
                                >
                                  mdi-check-circle
                                </v-icon>
                                <v-btn
                                  v-show="!isCorrectAnswer(1)"
                                  variant="flat"
                                  icon
                                  class="option-icon subtitle-1 mr-2"
                                  size="small"
                                  @click.stop="selectedOption = 1"
                                >
                                  A
                                </v-btn>
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
                              >
                            </div>
                          </template>
                        </v-radio>
                        <v-radio
                          value="2"
                          class="answer"
                          :class="{
                            'true-answer': isCorrectAnswer(2),
                            'false-answer': isIncorrectAnswer(2),
                          }"
                        >
                          <template #label>
                            <div
                              ref="choise2"
                              class="answer"
                            >
                              <v-icon
                                v-show="isCorrectAnswer(2)"
                                color="success"
                                class="mr-2 success-answer-icon"
                              >
                                mdi-check-circle
                              </v-icon>
                              <v-btn
                                v-show="!isCorrectAnswer(2)"
                                variant="flat"
                                icon
                                class="option-icon subtitle-1 mr-2"
                                size="small"
                                @click.stop="selectedOption = 2"
                              >
                                B
                              </v-btn>
                              <span
                                ref="mathJaxEl"
                                v-html="contentData.answer_b"
                              />
                              <img
                                v-show="contentData.b_file"
                                :src="contentData.b_file"
                                class="answer-img"
                              >
                            </div>
                          </template>
                        </v-radio>
                        <v-radio
                          v-if="contentData.type == 'fourchoice'"
                          value="3"
                          class="answer"
                          :class="{
                            'true-answer': isCorrectAnswer(3),
                            'false-answer': isIncorrectAnswer(3),
                          }"
                        >
                          <template #label>
                            <div
                              ref="choise3"
                              class="answer"
                            >
                              <v-icon
                                v-show="isCorrectAnswer(3)"
                                color="success"
                                class="mr-2 success-answer-icon"
                              >
                                mdi-check-circle
                              </v-icon>
                              <v-btn
                                v-show="!isCorrectAnswer(3)"
                                variant="flat"
                                icon
                                class="option-icon subtitle-1 mr-2"
                                size="small"
                                @click.stop="selectedOption = 3"
                              >
                                C
                              </v-btn>
                              <span
                                ref="mathJaxEl"
                                v-html="contentData.answer_c"
                              />
                              <img
                                v-show="contentData.c_file"
                                class="answer-img"
                                :src="contentData.c_file"
                              >
                            </div>
                          </template>
                        </v-radio>
                        <v-radio
                          v-if="contentData.type == 'fourchoice'"
                          value="4"
                          class="answer"
                          :class="{
                            'true-answer': isCorrectAnswer(4),
                            'false-answer': isIncorrectAnswer(4),
                          }"
                        >
                          <template #label>
                            <div
                              ref="choise4"
                              class="answer"
                            >
                              <v-icon
                                v-show="isCorrectAnswer(4)"
                                color="success"
                                class="mr-2 success-answer-icon"
                              >
                                mdi-check-circle
                              </v-icon>
                              <v-btn
                                v-show="!isCorrectAnswer(4)"
                                variant="flat"
                                icon
                                class="option-icon subtitle-1 mr-2"
                                size="small"
                                @click.stop="selectedOption = 4"
                              >
                                D
                              </v-btn>
                              <span
                                ref="mathJaxEl"
                                v-html="contentData.answer_d"
                              />

                              <img
                                v-show="contentData.d_file"
                                class="answer-img"
                                :src="contentData.d_file"
                              >
                            </div>
                          </template>
                        </v-radio>
                      </v-radio-group>
                    </v-col>
                  </div>

                  <!-- Helpful link -->
                  <div class="justify-center text-center">
                    <v-btn
                      :disabled="!nextTestId"
                      :loading="nextTestLoading"
                      class="next-test mx-auto text-transform-none"
                      @click="navigateToNextTest"
                    >
                      {{
                        $route.name == "test-id"
                          ? "Try the Next One"
                          : "Time to Test!"
                      }}
                      <v-icon>mdi-skip-next-outline</v-icon>
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
import CrashReport from '~/components/common/crash-report.vue'
import successSound from '@/assets/sounds/success.mp3'
import failSound from '@/assets/sounds/fail.mp3'

const props = defineProps({
  contentData: {
    type: Object,
    default: () => ({}),
  },
})

const _emits = defineEmits(['next'])

const _route = useRoute()
const nuxtApp = useNuxtApp()
const { $renderMathInElement, $ensureMathJaxReady } = nuxtApp
const nextTestId = ref(null)
const _router = useRouter()
const navigateToNextTest = () => {
  nextTestLoading.value = true
  navigateTo(`/test/${nextTestId.value}`)
}
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
const showingCoin = ref(false)
const balance = ref(0.0000001)
const showBoxBalance = ref(true)
const isAnswerToQuestion = ref(false)
const sizeCoin = ref(120)
const testDetail = ref(null)
const coinElement = ref(null)
const boxShowingBalance = ref(null)
const amountBalance = ref(null)
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
})

watch(
  () => props.contentData,
  async (_val) => {
    await nextTick()
    if (testDetail.value) {
      $renderMathInElement?.(testDetail.value)
      loadNextTest()
    }
  },
  { immediate: true },
)

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
function animationMovingCoin(
  startInformation,
  coinEl,
  endInformation,
  balanceChangeDirection,
) {
  coinElement.value.style.top = `${
    startInformation.top + startInformation.height / 2 - sizeCoin.value / 2
  }px`
  coinElement.value.style.left = `${
    startInformation.left + startInformation.width / 2 - sizeCoin.value / 2
  }px`
  let dx, dy
  if (balanceChangeDirection == 1) {
    dx
      = endInformation.left
        - startInformation.width / 2
        + endInformation.width / 2
    dy
      = endInformation.top
        - startInformation.height / 2
        + endInformation.height / 2
        - startInformation.top
  }
  else {
    dx
      = endInformation.width / 2
        - startInformation.left
        - startInformation.width / 2
    dy
      = endInformation.height / 2
        - startInformation.height / 2
        + endInformation.top / 2
        - startInformation.top
  }
  coinElement.value.style.setProperty('--dx', `${dx}px`)
  coinElement.value.style.setProperty('--dy', `${dy}px`)
  coinElement.value.classList.remove('animate', 'fade-out', 'error-animate')
  if (balanceChangeDirection == 1) {
    coinElement.value.classList.add('animate')
  }
  else {
    coinElement.value.classList.add('error-animate')
  }
}
function animationFadeOutCoin(coinEl, endInformation) {
  setTimeout(() => {
    coinEl.style.top = `${
      endInformation.top + endInformation.height / 2 - sizeCoin.value / 2
    }px`
    coinEl.style.left = `${
      endInformation.left + endInformation.width / 2 - sizeCoin.value / 2
    }px`
    coinEl.classList.remove('animate')
    coinEl.classList.add('fade-out')
  }, 3000)
}
function animationFadeInBoxBalance(
  coinEl,
  boxShowingBalanceElement,
  nameAnimation,
) {
  setTimeout(() => {
    if (coinElement.value) {
      coinElement.value.classList.add('d-none')
      coinElement.value.classList.remove('d-flex')
      coinElement.value.classList.remove('fade-out')
    }
    showBoxBalance.value = true
    boxShowingBalanceElement.classList.add(nameAnimation)
  }, 4000)
}
function animationCountingBalance(
  amountBalanceElement,
  balanceChangeDirection,
) {
  setTimeout(() => {
    const startValue = Number(balance.value)
    const displacementAmount = 0.0000004
    const endValue = parseFloat(
      (startValue + displacementAmount * balanceChangeDirection).toFixed(8),
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
      balance.value = parseFloat(current.toFixed(8))
    }, stepTime)
  }, 4600)
}
function animationFadeOutBoxBalance(
  amountBalanceElement,
  boxShowingBalanceElement,
) {
  setTimeout(() => {
    amountBalanceElement.classList.remove(
      'pulsing',
      'decreasing',
      'increasing',
    )
    boxShowingBalanceElement.classList.remove('animate-in', 'animate-in-error')
    boxShowingBalanceElement.classList.add('animate-out')
  }, 7000)
  setTimeout(() => {
    boxShowingBalanceElement.classList.remove('animate-out')
    showBoxBalance.value = false
  }, 7500)
}
function playSound(sound) {
  const audio = new Audio(sound)
  audio.play().catch((e) => {
    console.warn('Failed to play audio:', e)
  })
}
function createExplosionParticles(x, y, count = 30) {
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div')
    particle.classList.add('particle')
    particle.style.left = `${x}px`
    particle.style.top = `${y}px`
    const angle = Math.random() * 2 * Math.PI
    const radius = Math.random() * 150
    const dx = Math.cos(angle) * radius
    const dy = Math.sin(angle) * radius
    particle.style.setProperty('--x', `${dx}px`)
    particle.style.setProperty('--y', `${dy}px`)
    document.body.appendChild(particle)
    particle.addEventListener('animationend', () => {
      particle.remove()
    })
  }
}
function animationExplodeCoin(coinEl, centerInformation) {
  setTimeout(() => {
    coinEl.classList.remove('error-animate')
    coinEl.style.opacity = 0
    const centerX = centerInformation.width / 2
    const centerY = centerInformation.height / 2 + sizeCoin.value / 2 - 20
    createExplosionParticles(centerX, centerY, 60)
  }, 3000)
}
function animationPulseHeart(startInformation, _coinEl) {
  coinElement.value.style.top = `${
    startInformation.top + startInformation.height / 2 - sizeCoin.value / 2
  }px`
  coinElement.value.style.left = `${
    startInformation.left + startInformation.width / 2 - sizeCoin.value / 2
  }px`
  coinElement.value.classList.remove('animate', 'fade-out', 'pulse')
  coinElement.value.classList.add('pulse')
}
function fireSelectedOption() {
  const walletElement = document.querySelector(
    window.innerWidth < 1264 ? '.wallet-mobile' : '.wallet-div',
  )
  const walletElementBoundingRect = walletElement.getBoundingClientRect()
  const boxShowingBalanceElement = boxShowingBalance.value
  const amountBalanceElement = amountBalance.value
  const testDetailElement = testDetail.value

  const testDetailElementBoundingRect
    = testDetailElement.getBoundingClientRect()
  if (
    selectedOption.value === props.contentData.true_answer
    && !isAnswerToQuestion.value
  ) {
    coinElement.value.classList.remove('d-none')
    coinElement.value.classList.add('d-flex')
    showingCoin.value = true
    playSound(successSound)
    animationPulseHeart(testDetailElementBoundingRect, coinElement.value)
    setTimeout(() => {
      coinElement.value.classList.remove('pulse')
      animationMovingCoin(
        testDetailElementBoundingRect,
        coinElement.value,
        walletElementBoundingRect,
        1,
      )
      animationFadeOutCoin(coinElement.value, walletElementBoundingRect)
      animationFadeInBoxBalance(
        coinElement.value,
        boxShowingBalanceElement,
        'animate-in',
      )
      animationCountingBalance(amountBalanceElement, 1)
      animationFadeOutBoxBalance(
        amountBalanceElement,
        boxShowingBalanceElement,
      )
    }, 1000)
  }
  if (
    selectedOption.value !== props.contentData.true_answer
    && !isAnswerToQuestion.value
  ) {
    coinElement.value.classList.remove('d-none')
    coinElement.value.classList.add('d-flex')
    playSound(failSound)
    animationMovingCoin(
      walletElementBoundingRect,
      coinElement.value,
      testDetailElementBoundingRect,
      -1,
    )
    animationExplodeCoin(coinElement.value, testDetailElementBoundingRect)
    animationFadeInBoxBalance(
      coinElement.value,
      boxShowingBalanceElement,
      'animate-in-error',
    )
    animationCountingBalance(amountBalanceElement, -1)
    animationFadeOutBoxBalance(amountBalanceElement, boxShowingBalanceElement)
  }
  isAnswerToQuestion.value = true
  fullAnswer.value = 0
}
function loadNextTest() {
  nextTestLoading.value = true
  selectedOption.value = ''
  coinElement.value.removeAttribute('style')
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
}

/* flying coin */
.flying-coin-div {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid #c99001;
  background-color: #fede2f;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1005;
}

.inner-coin-div {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 4px solid #c48e00;
  background-color: #e2a900;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-coin {
  font-size: 24px;
  font-weight: bold;
  color: #fede2f;
  text-shadow: 3px 2px 0px #c99001;
}

@keyframes fly-to-wallet {
  0% {
    transform: translate(0, 0) scale(1) rotate(0deg);
  }

  100% {
    transform: translate(var(--dx), var(--dy)) scale(0.3) rotate(720deg);
  }
}

@keyframes fly-to-wallet-reverse {
  0% {
    transform: translate(0, 0) scale(0) rotate(0deg);
  }

  100% {
    transform: translate(var(--dx), var(--dy)) scale(1) rotate(720deg);
  }
}

@keyframes coin-glow {
  0%,
  100% {
    box-shadow: 0 0 0px #fede2f;
  }

  50% {
    box-shadow: 0 0 20px #fff94a, 0 0 30px #ffd700;
  }
}

@keyframes coin-pulse {
  0%,
  100% {
    opacity: 0.5;
  }

  50% {
    opacity: 1;
  }
}

@keyframes scale-and-fade-out {
  0% {
    transform: scale(0.3);
    opacity: 1;
  }

  100% {
    transform: scale(0);
    opacity: 0;
  }
}

@keyframes coin-pulse-center {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.7);
  }
}

.flying-coin-div.pulse {
  animation: coin-pulse-center 0.5s ease-in-out 2;
}

.flying-coin-div.fade-out {
  animation: scale-and-fade-out 1s ease-out forwards;
}

.flying-coin-div.animate {
  animation: fly-to-wallet 3s ease-in-out forwards,
    coin-glow 0.5s ease-in-out infinite, coin-pulse 0.5s ease-in-out infinite;
}

.flying-coin-div.error-animate {
  animation: fly-to-wallet-reverse 3s ease-in-out forwards,
    coin-glow 0.5s ease-in-out infinite, coin-pulse 0.5s ease-in-out infinite;
}

/* particle explode */
.particle {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #fede2f;
  border-radius: 50%;
  opacity: 1;
  pointer-events: none;
  z-index: 1006;
  animation: particle-fly 1.5s forwards ease-out;
}

@keyframes particle-fly {
  to {
    transform: translate(var(--x), var(--y)) scale(0.5);
    opacity: 0;
  }
}

/* Box Showing Balance */
@keyframes show-balance-box {
  0% {
    transform: translateY(-20px);
    opacity: 0;
  }

  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes animateOut {
  0% {
    transform: translateY(0);
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
  position: absolute;
  right: 60px;
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

.title-balance {
  font-size: 18px;
  font-weight: bold;
  color: black;
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
  font-size: 40px;
}
@media (max-width: 1264px) {
  .box-showing-balance {
    right: 20px;
    top: 20px;
  }
}
</style>
