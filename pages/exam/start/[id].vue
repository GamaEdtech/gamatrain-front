<template>
  <div
    v-if="pending && !contentData"
    class="d-flex justify-center align-center"
    style="height: 80vh;"
  >
    <v-progress-circular
      indeterminate
      color="teal"
      size="64"
    />
  </div>
  <div
    v-else-if="fetchError && !pending "
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
    class="test-maker mt-20"
  >
    <v-container class="test-maker">
      <!-- Header -->
      <v-card
        id="participating-exam-header"
        class="mb-4"
      >
        <v-card-text>
          <v-row class="text-center">
            <v-col cols="4">
              <p>
                Remaining time:
                <ClientOnly>
                  <v-chip
                    label
                    color="teal"
                    variant="tonal"
                  >
                    {{ hhmmss(examStats.remainTime) }}
                  </v-chip>
                </ClientOnly>
              </p>
            </v-col>
            <v-col cols="4">
              <a
                :href="examStats.nextNotAnswer ? `#item-${examStats.nextNotAnswer}`: ''"
                @click="updateNextNotAnswer()"
              >
                Unanswered questions:
                <ClientOnly>
                  <v-chip
                    label
                    color="teal"
                    variant="tonal"
                  >
                    {{ contentData.tests.length - Object.keys(examStats.answerData).length }}
                  </v-chip>
                </ClientOnly>
              </a>
            </v-col>
            <v-col cols="4">
              <a
                :href="examStats.nextPin ? `#item-${examStats.nextPin}` : '#'"
                @click="updateNextPin()"
              >
                Pined question:
                <ClientOnly>
                  <v-chip
                    label
                    color="teal"
                    variant="tonal"
                  >
                    {{ examStats.pinQuestionsArr.length }}
                  </v-chip>
                </ClientOnly>
              </a>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Main Content -->
      <v-card class="test-list mb-4 mt-4">
        <v-card-title class="text-h4 font-weight-bold py-6 mt-6">
          {{ contentData.exam?.title || "" }}
        </v-card-title>
        <v-card-text>
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
            <p>Oops! No questions found for this exam.</p>
          </div>

          <!-- Submit buttons -->
          <v-row class="mb-16 mt-4">
            <v-col
              cols="12"
              md="6"
              class="pb-0"
            >
              <v-btn
                :loading="submit_loading"
                size="large"
                color="teal"
                class="text-white"
                block
                style="text-transform: none;"
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
                to="/search?type=azmoon"
                block
                style="text-transform: none;"
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

const route = useRoute()
const router = useRouter()
const auth = useAuth()
const authToken = auth.getUserToken()

const contentData = ref(null)
const fetchError = ref(null)
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

const { data, error, pending } = await useAsyncData(
  `exam-start-${route.params.id}`,
  () => {
    if (!authToken) {
      throw createError({ statusCode: 401, statusMessage: 'You must be logged in to start an exam.' })
    }
    return $fetch(`/api/v1/exams/start/${route.params.id}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
  },
)

if (error.value) {
  if (error.value.statusCode === 400 && error.value.data?.data?.id) {
    if (import.meta.client) {
      router.push(`/exam/result/${error.value.data.data.id}`)
    }
  }
  else {
    fetchError.value = { message: error.value.data?.message || error.value.statusMessage || 'Could not load the exam.' }
    console.error('Failed to load exam data:', error.value)
  }
}
else if (data.value?.status !== 1) {
  fetchError.value = { message: data.value.message || 'The exam data is invalid.' }
  console.error('API returned a non-success status:', data.value)
}
else {
  contentData.value = data.value.data
}

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
  const answeredIds = new Set(Object.keys(examStats.answerData))
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
    if (examStats.nextPin === question_id) examStats.nextPin = examStats.pinQuestionsArr[0] || ''
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

const updateNextPin = () => {
  if (!examStats.pinQuestionsArr.length) return
  const currentIndex = examStats.pinQuestionsArr.indexOf(examStats.nextPin)
  const nextIndex = (currentIndex + 1) % examStats.pinQuestionsArr.length
  examStats.nextPin = examStats.pinQuestionsArr[nextIndex]
}

const updateNextNotAnswer = () => {
  if (!examStats.notAnsweredArr.length) return
  const currentIndex = examStats.notAnsweredArr.indexOf(examStats.nextNotAnswer)
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
    const response = await $fetch(`/api/v1/exams/end/${contentData.value.exam.id}`, {
      method: 'POST',
      body: {
        startID: contentData.value.startID,
        answers: examStats.answerData,
      },
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    await router.push(`/exam/result/${response.data.id}`)
  }
  catch (err) {
    if (err.response?._data?.data?.id) {
      await router.push(`/exam/result/${err.response._data.data.id}`)
    }
    else {
      console.error('Error submitting exam:', err)
    }
  }
  finally {
    submit_loading.value = false
  }
}

onMounted(() => {
  if (contentData.value) {
    setupExamStats()
  }
})
</script>

<style scoped>
#participating-exam-header {
  position: sticky;
  top: 64px;
  left: 0;
  right: 0;
  z-index: 10;
}

.bookmark-target {
  padding-top: 80px;
  margin-top: -80px;
}
</style>
