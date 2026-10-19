<template>
  <div class="w-100 d-flex flex-column align-start justify-start py-4 mt-md-0 mt-6">
    <div
      v-if="showChips"
      class="w-100 d-flex align-center ga-2 flex-wrap"
    >
      <v-chip
        v-for="chip in chips"
        :key="chip.title as string"
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
        v-if="!reviewMode && hasFullAnswer"
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
          :disabled="isFullAnswerVisible"
          @click="showFullAnswer"
        />
      </div>
    </div>

    <div
      ref="textQuestionRef"
      class="container-question w-100 d-flex flex-column align-start justify-start mt-6"
    >
      <test-question-stem
        :question="contentData.question"
        :file="contentData.q_file"
      />
      <v-radio-group
        v-if="contentData.type == 'fourchoice' || contentData.type == 'twochoice'
          || contentData.type == 'tf'"
        :model-value="selectedAnswer"
        :readonly="reviewMode || isAnswerSelected"
        aria-label="Answer options"
        hide-details
        class="w-100 px-1 px-sm-3 mt-2"
        @update:model-value="handleAnswerSelect(String($event))"
      >
        <test-question-choice
          v-for="option in options"
          :key="option.key"
          :option="option"
          :status="getChoiceStatus(option.key)"
        />
      </v-radio-group>
    </div>

    <div
      v-if="!reviewMode && hasFullAnswer && isFullAnswerVisible"
      ref="fullAnswerRef"
      class="w-100 mt-4 d-flex flex-column align-start justify-start px-2 px-sm-8"
    >
      <div
        class="test-text font-weight-bold text-grey600"
      >
        Solution:
      </div>
      <div
        v-if="contentData.answer_full"
        class="test-text text-grey800 mt-4"
        v-html="contentData.answer_full"
      />
      <img
        v-if="fullAnswerFile"
        class="answer-img mt-4 ma-auto ms-sm-0"
        :src="fullAnswerFile"
        alt="Solution Image"
      >
    </div>

    <div
      v-if="!reviewMode"
      class="w-100 d-flex align-center justify-center justify-sm-start mt-6"
    >
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
      v-if="!reviewMode"
      :is-start-animation="isStartSuccessAnimation"
      @complete-success-animation="completeSuccessCoinAnimation"
    />
    <lazy-test-counting-wallet-animation
      v-if="!reviewMode"
      :is-start-animation="isStartWalletAnimation"
      :direction="directionWalletAniamtion"
      :delta-price="questionReward"
      @complete-animation="completeWalletAnimation"
    />
    <lazy-common-coin-consumption-animation
      v-if="!reviewMode"
      v-model:is-visible="isStartFailCoinAnimation"
      @animation-complete="completeFailAnimation"
    />
  </div>
</template>

<script setup lang="ts">
import type { QuestionDTO, NextQuestionDTO, ApiResult, TestTimeDTO, AppError, ExamResultQuestionDTO } from '@/types'
import { useDisplay } from 'vuetify'

type TestDetailsContent = QuestionDTO | ExamResultQuestionDTO
type ChipQuery = Record<string, string>

interface TestDetailChip {
  title: string
  params: ChipQuery
}

interface ITestDetail {
  contentData: TestDetailsContent
  buttonNextText?: string
  showChips?: boolean
  ssrNextTest?: boolean
  ssrNextTestId?: string
  reviewMode?: boolean
}

const { $toast } = useNuxtApp()
const renderMath = useMathJaxRender()
const router = useRouter()
const props = withDefaults(defineProps<ITestDetail>(), {
  buttonNextText: 'Next One',
  ssrNextTest: false,
  reviewMode: false,
})

const isAnswerSelected = ref(false)
const selectedAnswer = ref<string | null>(null)
const options = useQuestionOptions(() => props.contentData)
const isLoadingGetAnswerAndPoint = ref(false)

const isStartSuccessAnimation = ref(false)
const isStartWalletAnimation = ref(false)
const isStartFailCoinAnimation = ref(false)
const directionWalletAniamtion = ref(1)
const questionReward = ref(0)

const fullAnswerRef = ref<HTMLElement>()
const isFullAnswerVisible = ref(false)
const fullAnswerFile = computed(() => getQuestionFile(props.contentData.answer_full_file))
const hasFullAnswer = computed(() => !!props.contentData.answer_full || !!fullAnswerFile.value)

const nextTestId = ref()
const nextTestLoading = ref(false)

const { smAndUp } = useDisplay()

const chipClass = 'text-subtitle-1 px-3'
const chipTextClass = 'text-grey500 text-h6 text-sm-h5 font-weight-regular'
const { getChoiceStatus: getResultChoiceStatus } = useExamResultChoiceStatus()

const chips = computed<TestDetailChip[]>(() => {
  const data = props.contentData
  const section = getQuestionQueryValue(data, 'section')
  const base = getQuestionQueryValue(data, 'base')
  const lesson = getQuestionQueryValue(data, 'lesson')
  const topic = getQuestionQueryValue(data, 'topic') || getQuestionQueryValue(data, 'topics')

  return [{
    title: getQuestionField(data, 'section_title'),
    params: {
      type: 'paper',
      section,
      base: '',
      lesson: '',
      topic: '',
    },
  },
  {
    title: getQuestionField(data, 'base_title'),
    params: {
      type: 'paper',
      section,
      base,
      lesson: '',
      topic: '',
    },
  },
  {
    title: data.lesson_title,
    params: {
      type: 'paper',
      section,
      base,
      lesson,
      topic: '',
    },
  },
  {
    title: getQuestionField(data, 'topic_title') || getQuestionField(data, 'topics_title'),
    params: {
      type: 'paper',
      section,
      base,
      lesson,
      topic,
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

const completeFailAnimation = () => {
  isStartFailCoinAnimation.value = false
  isStartWalletAnimation.value = true
}

const handleAnswerSelect = async (answer: string) => {
  if (props.reviewMode) return
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
        questionReward.value = Math.abs(response.data.points)
        directionWalletAniamtion.value = 1
        isStartSuccessAnimation.value = true
      }
      else {
        questionReward.value = Math.abs(response.data.points)
        directionWalletAniamtion.value = -1
        isStartFailCoinAnimation.value = true
      }
    }
    else {
      $toast.error((response.errors && response.errors[0]) ? response.errors[0]?.message : '')
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
  if (props.reviewMode) {
    const userAnswer = getUserAnswer()
    return getResultChoiceStatus(props.contentData.true_answer, userAnswer, choice)
  }

  if (isLoadingGetAnswerAndPoint.value) return 'loading'
  if (!isAnswerSelected.value) return 'default'

  if (choice === props.contentData.true_answer) return 'success'

  if (choice === selectedAnswer.value) return 'error'

  return 'default'
}

const textQuestionRef = ref<HTMLElement>()
onMounted(async () => {
  await renderMath(textQuestionRef.value)

  if (!props.reviewMode && !props.ssrNextTest) {
    await loadNextTest()
  }
})

// Free for now: the backend can't yet tell whether a subscription covers this,
// so revealing the full answer no longer costs coins.
const showFullAnswer = async () => {
  isFullAnswerVisible.value = true
  await nextTick()
  await renderMath(fullAnswerRef.value)
}

const loadNextTest = async () => {
  try {
    nextTestLoading.value = true
    const response = await useApiService.get<ApiResult<NextQuestionDTO>>(
      `/api/v1/examTests/random?lesson=${props.contentData.lesson}&topic=${getQuestionField(props.contentData, 'topic')}`,
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

const getUserAnswer = () => {
  return 'user_answer' in props.contentData ? props.contentData.user_answer : selectedAnswer.value
}

const getQuestionField = (data: TestDetailsContent, field: string) => {
  const value = field in data ? data[field as keyof TestDetailsContent] : ''
  return typeof value === 'string' ? value : ''
}

const getQuestionQueryValue = (data: TestDetailsContent, field: string) => {
  const value = getQuestionField(data, field)
  return value || ''
}
</script>

<style scoped lang="scss">
@use 'sass:map';
@use 'vuetify/settings' as vuetify;

.answer-img {
  width: auto;
  max-width: 100%;
}
.test-text {
  font-size: 1.6rem;
}
@media #{map.get(vuetify.$display-breakpoints, 'sm-and-up')} {
  .test-text {
    font-size: 1.8rem;
  }
}
</style>
