<template>
  <v-container class="test-maker">
    <v-container>
      <v-row class="mt-14">
        <v-col
          cols="12"
          md="12"
        >
          <span
            class="text-teal"
            style="
              font-size: 2.125rem !important;
              letter-spacing: 0.0073529412em !important;
              line-height: 2.5rem;
            "
          >
            <span
              class="fa-solid fa-file"
              style="font-size: 2rem !important; margin-inline: 0.5rem"
            />
            {{ contentData.exam.title }} Report card
          </span>
        </v-col>
      </v-row>
    </v-container>
    <v-card
      elevation="2"
      class="mb-16"
    >
      <v-card-text>
        <v-container>
          <v-row>
            <v-col
              cols="12"
              md="12"
            >
              <ClientOnly>
                <v-table class="exams_table">
                  <thead>
                    <tr style="color: rgba(0, 0, 0, 0.6)">
                      <th class="text-left text-h5">
                        Participant
                      </th>
                      <th class="text-center text-h5">
                        <span
                          class="d-block d-md-none fa-regular fa-circle-play fa-lg"
                        />
                        <span class="d-none d-md-block">Start time</span>
                      </th>
                      <th class="text-center text-h5">
                        <span
                          class="d-block d-md-none fa-regular fa-clock fa-lg"
                        />
                        <span class="d-none d-md-block">Test duration</span>
                      </th>
                      <th class="text-center text-h5">
                        <span
                          class="d-block d-md-none fa-regular fa-circle-stop fa-lg"
                        />
                        <span class="d-none d-md-block">Response time</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {{ contentData.user?.first_name }}
                        {{ contentData.user?.last_name }}
                      </td>
                      <td class="text-center">
                        {{ contentData.userData.subdate }}
                      </td>
                      <td class="text-center">
                        {{ contentData.exam.azmoon_time }} min
                      </td>
                      <td class="text-center">
                        {{ contentData.userData.submit_time }} Seconds
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </ClientOnly>
            </v-col>
          </v-row>

          <v-row class="mt-8">
            <v-col
              class="d-none d-md-block"
              md="12"
            >
              <span class="mr-2">
                <i class="fa-solid fa-circle-check fa-lg text-green" />
                : Correct answers
              </span>
              <span class="mr-2 my-1">
                <i class="fa-regular fa-times-circle fa-lg text-red" />
                : Wrong answer
              </span>
              <span class="mr-2 my-1">
                <i class="fa-regular fa-circle-check fa-lg text-green" />
                : Correct option
              </span>
              <span class="mr-2 my-1">
                <i class="fa-regular fa-circle fa-lg" />
                : No answer
              </span>
            </v-col>
            <v-col
              cols="6"
              class="d-block d-md-none"
            >
              <span class="mr-2">
                <i class="fa-solid fa-circle-check fa-lg text-green" />
                : Correct answers
              </span>
            </v-col>
            <v-col
              cols="6"
              class="d-block d-md-none"
            >
              <span class="mr-2 my-1">
                <i class="fa-regular fa-times-circle fa-lg text-red" />
                : Wrong answer
              </span>
            </v-col>
            <v-col
              cols="6"
              class="d-block d-md-none"
            >
              <span class="mr-2 my-1">
                <i class="fa-regular fa-circle-check fa-lg text-green" />
                : Correct option
              </span>
            </v-col>
            <v-col
              cols="6"
              class="d-block d-md-none"
            >
              <span class="mr-2 my-1">
                <i class="fa-regular fa-circle fa-lg" />
                : No answer
              </span>
            </v-col>
          </v-row>

          <v-row>
            <v-col
              cols="12"
              md="4"
            >
              <v-table class="exams_table">
                <thead>
                  <tr style="color: rgba()">
                    <th class="text-left text-h5">
                      #
                    </th>
                    <th class="text-center text-h5">
                      1
                    </th>
                    <th class="text-center text-h5">
                      2
                    </th>
                    <th class="text-center text-h5">
                      3
                    </th>
                    <th class="text-center text-h5">
                      4
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, key) in contentData.result"
                    :key="item.id || key"
                    class="pointer"
                    @click="questionDetails(item)"
                  >
                    <td>{{ key + 1 }}</td>
                    <td
                      v-for="option in 4"
                      :key="option"
                      class="text-center"
                    >
                      <span
                        v-if="
                          item.user_answer == option
                            && item.true_answer == option
                        "
                        class="text-green fa-solid fa-circle-check fa-lg"
                        size="large"
                      />
                      <span
                        v-else-if="
                          item.user_answer == option
                            && item.true_answer != option
                        "
                        class="text-red fa-regular fa-times-circle fa-lg"
                        size="large"
                      />
                      <span
                        v-else-if="item.true_answer == option"
                        class="text-green fa-regular fa-circle-check fa-lg"
                        size="large"
                      />
                      <span
                        v-else
                        class="fa-regular fa-circle fa-lg"
                        size="large"
                      />
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-col>
            <v-col
              cols="12"
              md="8"
            >
              <v-row>
                <v-col cols="12">
                  <v-table class="exams_table">
                    <thead>
                      <tr>
                        <th class="text-left text-h5">
                          Lesson
                        </th>
                        <th class="text-center text-h5">
                          Count
                        </th>
                        <th class="text-center text-h5">
                          <span
                            class="text-green fa-solid fa-circle-check fa-lg"
                          />
                        </th>
                        <th class="text-center text-h5">
                          <span
                            class="text-red fa-solid fa-times-circle fa-lg"
                          />
                        </th>
                        <th class="text-center text-h5">
                          <span class="fa-regular fa-circle fa-lg" />
                        </th>
                        <th class="text-center text-h5">
                          %
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item, index) in contentData.answerStats.lessons"
                        :key="index"
                      >
                        <td>{{ item.title }}</td>
                        <td class="text-center">
                          {{ item.num }}
                        </td>
                        <td class="text-center">
                          {{ item.true }}
                        </td>
                        <td class="text-center">
                          {{ item.false }}
                        </td>
                        <td class="text-center">
                          {{ item.noanswer }}
                        </td>
                        <td class="text-center">
                          {{ item.percent }}
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr style="background-color: #e5fbf7">
                        <td>Total</td>
                        <td class="text-center">
                          {{ contentData.answerStats.total.num }}
                        </td>
                        <td class="text-center">
                          {{ contentData.answerStats.total.true }}
                        </td>
                        <td class="text-center">
                          {{ contentData.answerStats.total.false }}
                        </td>
                        <td class="text-center">
                          {{ contentData.answerStats.total.noAnswer }}
                        </td>
                        <td class="text-center">
                          {{ contentData.answerStats.total.percent }}
                        </td>
                      </tr>
                    </tfoot>
                  </v-table>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-table class="exams_table">
                    <tbody>
                      <tr>
                        <td>
                          <span
                            class="text-green fa-solid fa-circle-check fa-lg"
                          />&nbsp; Correct answers:
                        </td>
                        <td class="text-center">
                          {{ contentData.answerStats.total.true }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span
                            class="text-red fa-regular fa-times-circle fa-lg"
                          />&nbsp; Wrong answers:
                        </td>
                        <td class="text-center">
                          {{ contentData.answerStats.total.false }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span class="fa-regular fa-circle fa-lg" />&nbsp; No
                          answer:
                        </td>
                        <td class="text-center">
                          {{ contentData.answerStats.total.noAnswer }}
                        </td>
                      </tr>
                      <tr>
                        <td>Rank in country:</td>
                        <td
                          v-if="contentData.rank && contentData.rank.total"
                          class="text-center"
                        >
                          <strong>
                            {{ contentData.rank.total.user }}
                          </strong>
                          of {{ contentData.rank.total.total }} participants
                        </td>
                        <td
                          v-else
                          class="text-center"
                        >
                          -
                        </td>
                      </tr>
                      <tr>
                        <td>Rank in state:</td>
                        <td
                          v-if="contentData.rank && contentData.rank.state"
                          class="text-center"
                        >
                          <strong>{{ contentData.rank.state.user }}</strong>
                          of {{ contentData.rank.state.total }} participants
                        </td>
                        <td
                          v-else
                          class="text-center"
                        >
                          -
                        </td>
                      </tr>
                      <tr>
                        <td>Rank in area:</td>
                        <td
                          v-if="contentData.rank && contentData.rank.area"
                          class="text-center"
                        >
                          <strong> {{ contentData.rank.area.user }}</strong>
                          of {{ contentData.rank.area.total }} participants
                        </td>
                        <td
                          v-else
                          class="text-center"
                        >
                          -
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                  <v-btn
                    :loading="download_loading"
                    class="mt-8 p-4"
                    block
                    rounded="1"
                    density="compact"
                    size="large"
                    variant="flat"
                    color="error"
                    style="color: #fff !important"
                    @click="startDownload"
                  >
                    <div
                      style="font-size: 14px !important; text-transform: none"
                    >
                      Download PDF file with key |
                      {{
                        contentData.price.price > 0
                          ? `$${contentData.price.price}`
                          : "Free"
                      }}
                    </div>
                  </v-btn>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                  style="height: 250px"
                >
                  <pie-chart :chart-data="chartData" />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>

    <ClientOnly>
      <v-dialog
        v-model="dialog.status"
        max-width="700"
      >
        <v-card>
          <v-card-text
            ref="dialogMathJaxContainerRef"
            class="py-4"
          >
            <v-col
              class="test-list"
              cols="12"
            >
              <div
                id="test-question"
                style="
                  color: rgba(0, 0, 0, 0.6);
                  font-size: 1.8rem !important;
                  font-weight: bold !important;
                  line-height: 2.2rem;
                  margin-bottom: 1rem;
                "
                v-html="dialog.question"
              />
              <img
                v-if="dialog.q_file && dialog.q_file !== '0'"
                :src="dialog.q_file"
              >

              <div class="mt-4">
                <div
                  v-if="dialog.answer_a"
                  class="answer"
                >
                  <v-icon
                    v-if="dialog.true_answer == '1'"
                    class="true_answer"
                    icon="mdi-check"
                    size="large"
                  />
                  <v-icon
                    v-if="
                      dialog.user_answer == '1' && dialog.true_answer != '1'
                    "
                    class="false_answer"
                    icon="mdi-close"
                    size="large"
                  />
                  <span>1)&nbsp;</span>
                  <span v-html="dialog.answer_a" />
                  <img
                    v-if="dialog.a_file && dialog.a_file !== '0'"
                    :src="dialog.a_file"
                    class="answer-img"
                  >
                </div>

                <div
                  v-if="dialog.answer_b"
                  class="answer"
                >
                  <v-icon
                    v-if="dialog.true_answer == '2'"
                    class="true_answer"
                    icon="mdi-check"
                    size="large"
                  />
                  <v-icon
                    v-if="
                      dialog.user_answer == '2' && dialog.true_answer != '2'
                    "
                    class="false_answer"
                    icon="mdi-close"
                    size="large"
                  />
                  <span>2)&nbsp;</span>
                  <span v-html="dialog.answer_b" />
                  <img
                    v-if="dialog.b_file && dialog.b_file !== '0'"
                    :src="dialog.b_file"
                    class="answer-img"
                  >
                </div>

                <div
                  v-if="dialog.answer_c"
                  class="answer"
                >
                  <v-icon
                    v-if="dialog.true_answer == '3'"
                    class="true_answer"
                    icon="mdi-check"
                    size="large"
                  />
                  <v-icon
                    v-if="
                      dialog.user_answer == '3' && dialog.true_answer != '3'
                    "
                    class="false_answer"
                    icon="mdi-close"
                    size="large"
                  />
                  <span>3)&nbsp;</span>
                  <span v-html="dialog.answer_c" />
                  <img
                    v-if="dialog.c_file && dialog.c_file !== '0'"
                    :src="dialog.c_file"
                    class="answer-img"
                  >
                </div>

                <div
                  v-if="dialog.answer_d"
                  class="answer"
                >
                  <v-icon
                    v-if="dialog.true_answer == '4'"
                    class="true_answer"
                    icon="mdi-check"
                    size="large"
                  />
                  <v-icon
                    v-if="
                      dialog.user_answer == '4' && dialog.true_answer != '4'
                    "
                    class="false_answer"
                    icon="mdi-close"
                    size="large"
                  />
                  <span>4)&nbsp;</span>
                  <span v-html="dialog.answer_d" />
                  <img
                    v-if="dialog.d_file && dialog.d_file !== '0'"
                    :src="dialog.d_file"
                    class="answer-img"
                  >
                </div>
              </div>

              <v-row class="mt-3">
                <v-col cols="10">
                  <v-btn
                    variant="text"
                    icon="mdi-bullhorn-outline"
                    color="blue"
                    style="font-size: 15px"
                    @click="openCrashReportDialog"
                  />
                  <NuxtLink :to="`/test/${dialog.id}`"><v-btn
                    color="green"
                    variant="text"
                    style="font-size: 15px"
                    icon="mdi-eye"
                  /></NuxtLink>
                </v-col>
                <v-col
                  class="text-right"
                  cols="2"
                >
                  <v-btn
                    color="red"
                    variant="outlined"
                    density="comfortable"
                    size="large"
                    style="text-transform: none !important; font-size: 13px"
                    @click="dialog.status = false"
                  >
                    Close
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-card-text>
        </v-card>
      </v-dialog>
    </ClientOnly>

    <common-crash-report
      ref="crashReportRef"
      :report_type_list="report_type_list"
    />
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted, computed, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '#app'
import PieChart from '@/components/chart/PieChart'
import { useAuth } from '~/composables/useAuth'

const route = useRoute()
const _id = route.params.id

const auth = useAuth()
const _authToken = auth.getUserToken()

const download_loading = ref(false)

const crashReportRef = ref(null)
const dialog = reactive({
  status: false,
  question: '',
  q_file: '',
  true_answer: '',
  user_answer: '',
  id: '',
  answer_a: '',
  a_file: '',
  answer_b: '',
  b_file: '',
  answer_c: '',
  c_file: '',
  answer_d: '',
  d_file: '',
})

const report_type_list = ref([
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
])

const dialogMathJaxContainerRef = ref(null)
const { $renderMathInElement, $ensureMathJaxReady } = useNuxtApp()

const typesetDialog = async () => {
  if (import.meta.client && dialogMathJaxContainerRef.value) {
    try {
      await $ensureMathJaxReady()
      if (!window.MathJax?.Hub) return
      const elementToProcess
        = dialogMathJaxContainerRef.value.$el ?? dialogMathJaxContainerRef.value
      if (elementToProcess instanceof HTMLElement) {
        await nextTick()
        $renderMathInElement(elementToProcess)
      }
    }
    catch (err) {
      console.error('Error during MathJax typesetting in dialog:', err)
    }
  }
}

const _crash_report = ref(null)

useHead({
  title: 'Online exam result',
})

const { data: contentData } = await useAsyncData(
  `exam-result-${route.params.id}`,
  async () => {
    const authToken = auth.getUserToken()
    if (!authToken) {
      throw createError({
        statusCode: 403,
        message: 'Authentication required.',
      })
    }
    try {
      const response = await $fetch(`/api/v1/exams/result/${route.params.id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      if (response?.status === 1 && response.data) {
        return response.data
      }
      return null
    }
    catch (err) {
      console.error('API Error fetching exam results:', err)
      return null
    }
  },
)

const startDownload = async () => {
  download_loading.value = true
  try {
    const response = await $fetch(
      `/api/v1/exams/download/${contentData.value.exam.id}`,
    )
    // Use dynamic import for file-saver
    const FileSaver = await import('file-saver')
    FileSaver.saveAs(response.data.url, response.data.name)
  }
  catch (err) {
    if (
      err.response?.status === 400
      && err.response?.data?.error === 'creditNotEnough'
    ) {
      toast.info('No enough credit')
    }
    console.error(err)
  }
  finally {
    download_loading.value = false
  }
}

const chartData = computed(() => {
  const stats = contentData.value?.answerStats?.total
  if (!stats) {
    // Return a valid empty chart data object
    return {
      labels: ['Correct answers', 'Wrong answers', 'No answer'],
      datasets: [
        {
          borderColor: '#e1e2e3',
          backgroundColor: ['#4CAF50', '#F44336', '#EEEEEE'],
          data: [0, 0, 0],
        },
      ],
    }
  }

  return {
    labels: ['Correct answers', 'Wrong answers', 'No answer'],
    datasets: [
      {
        borderColor: '#e1e2e3',
        backgroundColor: ['#4CAF50', '#F44336', '#fff'],
        data: [stats.true || 0, stats.false || 0, stats.noAnswer || 0],
      },
    ],
  }
})

const questionDetails = (item) => {
  dialog.status = false
  nextTick(() => {
    Object.assign(dialog, { ...item, status: true })
  })
}
const openCrashReportDialog = () => {
  dialog.status = false
  if (crashReportRef.value) {
    crashReportRef.value.dialog = true
    crashReportRef.value.form.id = dialog.id
    crashReportRef.value.form.type = 'examTest'
  }
}

watch(
  () => dialog.status,
  (isOpening) => {
    if (isOpening) {
      nextTick(() => {
        typesetDialog()
      })
    }
  },
)

onMounted(() => {
  if (import.meta.client) {
    const allExamStats = JSON.parse(
      localStorage.getItem('allExamStats') || '[]',
    )
    const index = allExamStats.findIndex(
      x => x.id == contentData.value.exam.id,
    )
    if (index !== -1) {
      allExamStats.splice(index, 1)
      localStorage.setItem('allExamStats', JSON.stringify(allExamStats))
    }
  }
})
</script>

<style scoped>
.pointer {
  cursor: pointer;
}

.true_answer {
  color: green;
}

.false_answer {
  color: red;
}

.fa-lg {
  font-size: large !important;
}

@media (max-width: 960px) {
  :deep(.chart-container) {
    height: 200px !important;
  }
}
table > thead > tr > th {
  color: rgba(0, 0, 0, 0.6);
}

table > tbody > tr:hover {
  background-color: #eeeeee !important;
}
</style>
