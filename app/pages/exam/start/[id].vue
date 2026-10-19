<template>
  <div
    v-if="!contentData && !fetchError && !needsSignIn"
    class="mt-20"
  >
    <v-container class="px-0 px-sm-4">
      <exam-start-skeleton />
    </v-container>
  </div>
  <div
    v-else-if="needsSignIn"
    class="d-flex flex-column align-center justify-center text-center ga-4 px-4"
    style="min-height: 60vh"
  >
    <v-icon
      size="56"
      color="primary"
    >
      md:lock_outline
    </v-icon>
    <p class="text-h4 font-weight-bold mb-0">
      Sign in to start this exam
    </p>
    <p class="text-h6 text-grey600 mb-0">
      Your answers and result are saved to your account.
    </p>
    <div class="d-flex align-center justify-center ga-3 flex-wrap">
      <v-btn
        rounded="pill"
        variant="outlined"
        color="grey500"
        height="40"
        min-width="110"
        class="text-h5 font-weight-bold"
        @click="router.back()"
      >
        Back
      </v-btn>
      <v-btn
        rounded="pill"
        color="primary"
        height="40"
        min-width="110"
        class="text-h5 font-weight-bold"
        flat
        @click="openSignIn"
      >
        Sign in
      </v-btn>
    </div>
  </div>
  <div
    v-else-if="fetchError"
    class="text-center mt-20"
  >
    <p class="text-h5">
      An error occurred
    </p>
    <p>{{ fetchError.message }}</p>
    <v-btn
      to="/"
      class="mt-4"
    >
      Go Home
    </v-btn>
  </div>
  <div
    v-else-if="contentData"
    class="mt-20"
  >
    <v-container class="px-0 px-sm-4">
      <!-- Header -->
      <v-card
        id="participating-exam-header"
        class="exam-card mb-4"
      >
        <div class="d-flex align-center flex-wrap ga-3 pa-3 px-sm-6">
          <div class="d-flex align-center ga-2">
            <v-icon
              icon="md:timer"
              size="28"
              :color="timerColor"
            />
            <div class="d-flex flex-column">
              <span class="text-h6 text-grey500">Time left</span>
              <span
                :class="['text-h4 font-weight-bold', `text-${timerColor}`]"
                role="timer"
              >
                {{ hhmmss(examStats.remainTime) }}
              </span>
            </div>
          </div>

          <v-spacer />

          <div class="d-flex align-center ga-2">
            <v-btn
              variant="tonal"
              color="grey700"
              rounded="pill"
              class="text-h5"
              prepend-icon="md:radio_button_unchecked"
              :disabled="!unansweredCount"
              :aria-label="`Go to the next unanswered question, ${unansweredCount} left`"
              @click="goToNextUnanswered"
            >
              <span class="d-none d-sm-inline me-1">Unanswered</span>
              <span class="font-weight-bold">{{ unansweredCount }}</span>
            </v-btn>
            <v-btn
              :variant="examStats.pinQuestionsArr.length ? 'flat' : 'tonal'"
              :color="examStats.pinQuestionsArr.length ? 'primary' : 'grey700'"
              rounded="pill"
              :class="['text-h5', { 'text-grey800': examStats.pinQuestionsArr.length }]"
              prepend-icon="md:push_pin"
              :disabled="!examStats.pinQuestionsArr.length"
              :aria-label="`Go to the next pinned question, ${examStats.pinQuestionsArr.length} pinned`"
              @click="goToNextPin"
            >
              <span class="d-none d-sm-inline me-1">Pinned</span>
              <span class="font-weight-bold">{{ examStats.pinQuestionsArr.length }}</span>
            </v-btn>
          </div>
        </div>
        <v-progress-linear
          :model-value="answeredPercent"
          color="primary"
          bg-color="grey200"
          bg-opacity="1"
          height="4"
          :aria-label="`${answeredCount} of ${contentData.tests.length} questions answered`"
        />
      </v-card>

      <!-- Main Content -->
      <v-card class="exam-card test-list mb-4 mt-4">
        <v-card-title class="text-h4 font-weight-bold text-wrap py-6 mt-6 px-4 px-sm-6 px-md-8">
          {{ contentData.exam?.title || "" }}
        </v-card-title>
        <v-card-text class="px-4 px-sm-6 px-md-8">
          <v-divider class="mb-4" />

          <div v-if="contentData.tests.length > 0">
            <div
              v-for="(item, index) in contentData.tests"
              :id="`item-${item.id}`"
              :key="item.id"
              class="bookmark-target"
            >
              <QuestionItem
                :item="item"
                :index="index"
                :model-value="examStats.answerData[item.id]"
                :is-pinned="examStats.pinQuestionsArr.includes(item.id)"
                @update:model-value="handleAnswerUpdate(item.id, $event)"
                @pin="pinQuestion(item.id)"
                @erase="eraseTest(item.id)"
              />
            </div>
          </div>

          <div
            v-else
            class="text-center pa-10"
          >
            <p class="text-h5">
              Oops! No questions found for this exam.
            </p>
          </div>

          <!-- Submit buttons -->
          <v-row class="mb-4 mb-md-16 mt-4">
            <v-col
              cols="12"
              md="6"
              class="pb-0"
            >
              <v-btn
                :loading="submit_loading"
                size="large"
                color="primary"
                class="text-h5 text-grey800"
                block
                flat
                @click="endExam()"
              >
                Send answers
              </v-btn>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-btn
                size="large"
                variant="outlined"
                color="error"
                class="text-h5"
                to="/search?type=quizhub"
                block
              >
                Discard
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script setup>
import QuestionItem from '~/components/exam/QuestionItem.vue'
import { useAuth } from '~/composables/useAuth'

// A timed exam is a focus mode: no mobile bottom nav taking space or tempting the user to leave mid-exam.
definePageMeta({
  hideBottomNav: true,
})

const route = useRoute()

const router = useRouter()
const auth = useAuth()
const { user } = useUser()

const contentData = ref(null)
const fetchError = ref(null)
// A guest can't start an exam: ask them to sign in here rather than showing an error.
const needsSignIn = ref(!auth.getUserToken())
const submit_loading = ref(false)
const allExamStats = ref([])
const examStats = reactive({
  id: '',
  remainTime: 0,
  pinQuestionsArr: [],
  notAnsweredArr: [],
  answerData: {},
  nextPin: '',
  nextNotAnswer: '',
})

// Exam start is per-user and backed by localStorage state, so load it on the client only;
// on the server the request has no Authorization header.
const { data, error, status, refresh } = await useAsyncData(
  `exam-start-${route.params.id}`,
  () => {
    if (!auth.getUserToken()) {
      throw createError({
        statusCode: 401,
        statusMessage: 'You must be logged in to start an exam.',
      })
    }
    return useApiService.get(`/api/v1/exams/start/${route.params.id}`)
  },
  { server: false },
)

const handleExamResponse = () => {
  if (!auth.getUserToken()) {
    needsSignIn.value = true
    return
  }

  if (error.value) {
    if (error.value.statusCode === 400 && error.value.data?.data?.id) {
      // Replace, so the browser's Back button leaves the result for the page before the exam
      // instead of landing here again.
      router.replace(`/user/exam/result/${error.value.data.data.id}`)
    }
    else {
      fetchError.value = {
        message:
          error.value.data?.message
          || error.value.statusMessage
          || 'Could not load the exam.',
      }
      console.error('Failed to load exam data:', error.value)
    }
  }
  else if (data.value?.status !== 1) {
    fetchError.value = {
      message: data.value?.message || 'The exam data is invalid.',
    }
    console.error('API returned a non-success status:', data.value)
  }
  else {
    contentData.value = data.value.data
    setupExamStats()
  }
}

const examTitle = () => contentData.value?.exam?.title || 'Exam'
useSeoMeta({
  title: examTitle,
  ogTitle: examTitle,
  twitterTitle: examTitle,
})

const updateLocalStorage = () => {
  if (import.meta.server) return
  const index = allExamStats.value.findIndex(x => x.id === examStats.id)
  const dataToStore = JSON.parse(JSON.stringify(examStats))
  if (index === -1) {
    allExamStats.value.push(dataToStore)
  }
  else {
    allExamStats.value[index] = dataToStore
  }
  localStorage.setItem('allExamStats', JSON.stringify(allExamStats.value))
}

const setupExamStats = () => {
  if (import.meta.server || !contentData.value) return

  examStats.id = contentData.value.exam.id

  if (localStorage.getItem('allExamStats')) {
    allExamStats.value = JSON.parse(localStorage.getItem('allExamStats'))
  }

  const savedState = allExamStats.value.find(x => x.id === examStats.id)

  if (savedState) {
    Object.assign(examStats, savedState)
    initNotAnswered()
  }
  else {
    examStats.remainTime = contentData.value.exam.azmoon_time * 60
    initNotAnswered()
  }

  countDownTimer()
}

const initNotAnswered = () => {
  if (!contentData.value?.tests) return
  // Erasing an answer leaves its key with an undefined value, so only keys with a value count as answered.
  const answeredIds = new Set(
    Object.entries(examStats.answerData)
      .filter(([, answer]) => answer != null)
      .map(([id]) => id),
  )
  examStats.notAnsweredArr = contentData.value.tests
    .map(test => test.id)
    .filter(id => !answeredIds.has(id.toString()))
}

const countDownTimer = () => {
  if (import.meta.server || examStats.remainTime <= 0) {
    if (examStats.remainTime <= 0 && contentData.value) endExam()
    return
  }

  setTimeout(() => {
    examStats.remainTime -= 1
    updateLocalStorage()
    countDownTimer()
  }, 1000)
}

const hhmmss = (secs) => {
  if (isNaN(secs) || secs < 0) secs = 0
  const timeString = new Date(secs * 1000).toISOString().substr(11, 8)
  return timeString.startsWith('00:') ? timeString.substr(3) : timeString
}

const handleAnswerUpdate = (itemId, value) => {
  examStats.answerData[itemId] = value
  const index = examStats.notAnsweredArr.indexOf(itemId)
  if (index > -1) {
    examStats.notAnsweredArr.splice(index, 1)
  }
  updateLocalStorage()
}

const pinQuestion = (question_id) => {
  const index = examStats.pinQuestionsArr.indexOf(question_id)
  if (index === -1) {
    examStats.pinQuestionsArr.push(question_id)
    if (examStats.pinQuestionsArr.length === 1) examStats.nextPin = question_id
  }
  else {
    examStats.pinQuestionsArr.splice(index, 1)
    if (examStats.nextPin === question_id)
      examStats.nextPin = examStats.pinQuestionsArr[0] || ''
  }
  updateLocalStorage()
}

const eraseTest = (question_id) => {
  examStats.answerData[question_id] = undefined
  if (!examStats.notAnsweredArr.includes(question_id)) {
    examStats.notAnsweredArr.push(question_id)
  }
  updateLocalStorage()
}

// Below these many seconds left, the timer turns amber, then red.
const TIMER_WARNING_SECONDS = 5 * 60
const TIMER_CRITICAL_SECONDS = 60

const timerColor = computed(() => {
  if (examStats.remainTime <= TIMER_CRITICAL_SECONDS) return 'lightError'
  if (examStats.remainTime <= TIMER_WARNING_SECONDS) return 'warning500'
  return 'grey800'
})
const unansweredCount = computed(() => examStats.notAnsweredArr.length)
const answeredCount = computed(() => (contentData.value?.tests.length || 0) - unansweredCount.value)
const answeredPercent = computed(() => {
  const total = contentData.value?.tests.length || 0
  return total ? (answeredCount.value / total) * 100 : 0
})

const scrollToQuestion = (questionId) => {
  document.getElementById(`item-${questionId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const goToNextUnanswered = () => {
  updateNextNotAnswer()
  scrollToQuestion(examStats.nextNotAnswer)
}

const goToNextPin = () => {
  updateNextPin()
  scrollToQuestion(examStats.nextPin)
}

const updateNextPin = () => {
  if (!examStats.pinQuestionsArr.length) return
  const currentIndex = examStats.pinQuestionsArr.indexOf(examStats.nextPin)
  const nextIndex = (currentIndex + 1) % examStats.pinQuestionsArr.length
  examStats.nextPin = examStats.pinQuestionsArr[nextIndex]
}

const updateNextNotAnswer = () => {
  if (!examStats.notAnsweredArr.length) return
  const currentIndex = examStats.notAnsweredArr.indexOf(
    examStats.nextNotAnswer,
  )
  const nextIndex = (currentIndex + 1) % examStats.notAnsweredArr.length
  examStats.nextNotAnswer = examStats.notAnsweredArr[nextIndex]
}

const endExam = async () => {
  submit_loading.value = true
  examStats.remainTime = -1

  const index = allExamStats.value.findIndex(x => x.id === examStats.id)
  if (index !== -1) {
    allExamStats.value.splice(index, 1)
    if (import.meta.client) {
      localStorage.setItem('allExamStats', JSON.stringify(allExamStats.value))
    }
  }

  try {
    const response = await useApiService.post(
      `/api/v1/exams/end/${contentData.value.exam.id}`,
      {
        startID: contentData.value.startID,
        answers: examStats.answerData,
      },
    )
    await router.replace(`/user/exam/result/${response.data.id}`)
  }
  catch (err) {
    if (err.response?._data?.data?.id) {
      await router.replace(`/user/exam/result/${err.response._data.data.id}`)
    }
    else {
      console.error('Error submitting exam:', err)
    }
  }
  finally {
    submit_loading.value = false
  }
}

const openSignIn = () => {
  router.push({ query: { auth_form: 'login', auth_noredirect: 'true' } })
}

// Signing in through the dialog keeps this page: load the exam as soon as the user is known.
watch(user, async (value) => {
  if (!value || !needsSignIn.value) return

  needsSignIn.value = false
  fetchError.value = null
  await refresh()
})

watch(status, (value) => {
  if (value === 'success' || value === 'error') handleExamResponse()
}, { immediate: true })
</script>

<style scoped lang="scss">
@use 'sass:map';
@use 'vuetify/settings' as vuetify;

/* On phones the cards run edge to edge, so the exam gets the full screen width. */
@media #{map.get(vuetify.$display-breakpoints, 'xs')} {
  .exam-card {
    border-radius: 0;
  }
}

#participating-exam-header {
  position: sticky;
  top: 64px;
  left: 0;
  right: 0;
  z-index: 10;
}

/* Keeps a question scrolled to by the header buttons clear of the app bar and the sticky header. */
.bookmark-target {
  scroll-margin-top: 170px;
}
</style>
