<template>
  <div class="w-100 d-flex flex-column align-start justify-start py-4">
    <div
      v-if="showChips"
      class="w-100 d-flex align-center ga-2 flex-wrap"
    >
      <v-chip
        v-if="contentData.section_title"
        variant="flat"
        class="text-subtitle-1 text-sm-h5 px-3"
        color="grey100"
        :to="`/search?type=paper&section=${contentData.section}`"
      >
        <span class="text-grey500">{{ contentData?.section_title }}</span>
      </v-chip>
      <v-chip
        v-if="contentData.base_title"
        variant="flat"
        class="text-subtitle-1 text-sm-h5 px-3"
        color="grey100"
        :to="`/search?type=paper&section=${contentData.section}&base=${contentData.base}`"
      >
        <span class="text-grey500">{{ contentData?.base_title }}</span>
      </v-chip>
      <v-chip
        v-if="contentData.lesson_title"
        variant="flat"
        class="text-subtitle-1 text-sm-h5 px-3"
        color="grey100"
        :to="`/search?type=paper&section=${contentData.section}&base=${contentData.base}&lesson=${
          contentData.lesson
        }`"
      >
        <span class="text-grey500">{{ contentData.lesson_title }}</span>
      </v-chip>
      <v-chip
        v-if="contentData.topic_title"
        variant="flat"
        class="text-subtitle-1 text-sm-h5 px-3"
        color="grey100"
        :to="`/search?type=paper&section=${contentData.section}&base=${contentData.base}&lesson=${
          contentData.lesson
        }&topic=${contentData.topic}`"
      >
        <span class="text-grey500">{{ contentData.topic_title }}</span>
      </v-chip>
    </div>
    <div
      v-if="showTitle"
      class="text-h4 font-weight-bold text-grey600 mt-4"
    >
      Question:
    </div>

    <div
      ref="textQuestionRef"
      class="container-question w-100 d-flex flex-column align-start justift-start mt-6"
    >
      <div
        class="text-h6 text-sm-h4 text-grey800"
        v-html="contentData.question"
      />
      <img
        v-if="contentData.q_file && contentData.q_file != '0'"
        class="answer-img mt-1"
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
          class="d-flex align-center flex-wrap ga-3 cursor-pointer w-100"
          @click="handleAnswerSelect(item.key)"
        >
          <div
            :class="[
              'choice-div text-h6 text-sm-h4 text-grey800 d-flex align-center justify-center rounded-lg border-md border-solid border-opacity-100',
              {
                'border-grey200': getChoiceStatus(item.key) === 'default',
                'border-success': getChoiceStatus(item.key) === 'success',
                'border-lightError': getChoiceStatus(item.key) === 'error',
              },
            ]"
          >
            <span v-if="getChoiceStatus(item.key) === 'default'">{{ item.key }}</span>

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
            class="text-h6 text-sm-h4 text-grey800 overflow-x-auto overflow-y-hidden"
            v-html="item.text"
          />
          <img
            v-if="item.file"
            class="answer-img mt-1"
            :src="item.file"
            alt="Answer Image"
          >
        </div>
      </div>
    </div>

    <test-success-coin-animation
      :is-start-animation="isStartSuccessAnimation"
      @complete-success-animation="completeSuccessCoinAnimation"
    />
    <test-counting-wallet-animation
      :is-start-animation="isStartWalletAnimation"
      :direction="directionWalletAniamtion"
      :point-price-question="pointPriceQuestion"
      @complete-animation="completeWalletAnimation"
    />
    <common-coin-consumption-animation
      :is-visible="isStartFailCoinAnimation"
      @animation-complete="completeFailAnimation"
    />
  </div>
</template>

<script setup lang="ts">
import type { QuestionDTO } from '~/types/api'

interface ITestDetail {
  contentData: QuestionDTO
  showChips?: boolean
  showTitle?: boolean
}

const { $renderMathInElement, $ensureMathJaxReady } = useNuxtApp()
const props = defineProps<ITestDetail>()

console.log('props', props.contentData)

const isAnswerSelected = ref(false)
const selectedAnswer = ref<string | null>(null)
const answers = computed(() => [
  { key: '1', text: props.contentData.answer_a, file: props.contentData.a_file },
  { key: '2', text: props.contentData.answer_b, file: props.contentData.b_file },
  { key: '3', text: props.contentData.answer_c, file: props.contentData.c_file },
  { key: '4', text: props.contentData.answer_d, file: props.contentData.d_file },
].filter(a => a.text || a.file))

const isStartSuccessAnimation = ref(false)
const isStartWalletAnimation = ref(false)
const isStartFailCoinAnimation = ref(false)
const directionWalletAniamtion = ref(1)
const pointPriceQuestion = ref(10)

const completeSuccessCoinAnimation = () => {
  isStartSuccessAnimation.value = false
  isStartWalletAnimation.value = true
}

const completeWalletAnimation = () => {
  isStartWalletAnimation.value = false
}

const completeFailAnimation = () => {
  isStartFailCoinAnimation.value = false
  isStartWalletAnimation.value = true
}

const handleAnswerSelect = (answer: string) => {
  // if (isAnswerSelected.value) return

  selectedAnswer.value = answer
  isAnswerSelected.value = true

  if (answer == props.contentData.true_answer) {
    directionWalletAniamtion.value = 1
    isStartSuccessAnimation.value = true
  }
  else {
    directionWalletAniamtion.value = -1
    isStartFailCoinAnimation.value = true
  }
}

const getChoiceStatus = (choice: string) => {
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
})
</script>

<style scoped>
.answer-img {
  /* max-height: 15rem; */
  width: auto;
  max-width: 100%;
}
.choice-div{
  min-width : 30px;
  min-height: 30px;
    max-width : 30px;
  max-height: 30px;
}
</style>
