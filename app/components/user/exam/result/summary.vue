<template>
  <v-card
    v-if="answerStats"
    class="w-100 mt-4 pa-4"
    flat
    rounded="lg"
    border
  >
    <div class="w-100 d-flex align-center justify-space-between ga-2 flex-wrap">
      <div class="d-flex align-center ga-2">
        <v-icon
          color="primary"
          size="24"
        >
          md:donut_large
        </v-icon>
        <span class="text-body-1 text-grey700 font-weight-bold">Result Summary</span>
      </div>
    </div>

    <div class="w-100 d-flex flex-wrap flex-md-nowrap ga-3 mt-4">
      <v-card
        class="w-100 w-md-50 pa-4 d-flex flex-column flex-sm-row align-center justify-center ga-6"
        color="grey100"
        flat
        rounded="lg"
        border
        min-width="240"
      >
        <div class="chart-container position-relative d-flex align-center justify-center">
          <DoughnutChart
            :data="chartData"
            :options="chartOptions"
          />
          <div class="position-absolute d-flex flex-column align-center justify-center">
            <span class="text-grey800 text-h4 font-weight-bold">{{ totalStats.percent }}%</span>
            <span class="text-grey500 text-caption font-weight-medium">Score</span>
          </div>
        </div>

        <div class="w-100 d-flex flex-column ga-2">
          <div
            v-for="(item, index) in statItems"
            :key="item.label"
            class="w-100 d-flex flex-wrap align-center ga-2"
          >
            <v-icon
              :color="item.color"
              size="14"
            >
              md:circle
            </v-icon>
            <span class="text-grey600 text-caption font-weight-medium ml-2">{{ item.label }}</span>
            <span class="text-grey800 text-caption font-weight-bold ml-auto">
              {{ item.value }}
            </span>

            <v-divider
              v-if="index != statItems.length - 1"
              color="grey500"
            />
          </div>
        </div>
      </v-card>

      <v-card
        class="w-100 w-md-50 pa-4 d-flex flex-column ga-4"
        color="grey100"
        flat
        rounded="lg"
        border
        min-width="240"
      >
        <div class="w-100 d-flex flex-wrap ga-2">
          <v-card
            v-for="rankItem in rankItems"
            :key="rankItem.label"
            class="pa-2 d-flex flex-column ga-1 flex-grow-1"
            color="surface"
            flat
            rounded="lg"
            border
            min-width="150"
          >
            <span class="text-grey400 text-caption font-weight-medium">
              <v-icon class="mr-1">{{ rankItem.icon }}</v-icon>
              {{ rankItem.label }}
            </span>
            <span class="text-grey800 text-body-1 font-weight-bold pl-6">
              {{ rankItem.value }}
            </span>
          </v-card>

          <v-card
            v-if="!analysisText"
            class="w-100 pa-3 d-flex flex-column flex-sm-row ga-2 flex-grow-1 border-sm border-primary border-opacity-50"
            color="primary50"
            flat
            rounded="lg"
            min-width="150"
          >
            <img
              :src="gamaRobot"
              alt=""
              width="80"
              class="h-100 image-robot"
            >
            <div class="w-100 d-flex flex-column align-start justify-start ga-1">
              <span class="text-grey800 text-body-1 font-weight-bold">Get your personal exam analysis</span>
              <template v-if="loadingGetAnalyzeResultExam">
                <span class="text-grey600 text-body-1 font-weight-medium">
                  Analyzing your answers… this can take a few seconds.
                </span>
                <v-progress-linear
                  color="primary"
                  bg-color="grey200"
                  height="6"
                  rounded
                  indeterminate
                  class="mt-2"
                />
              </template>
              <template v-else>
                <span class="text-grey600 text-body-1 font-weight-medium">Let alpha analyze your answers and reveal your strengths and areas to improve.</span>
                <v-btn
                  rounded="pill"
                  class="d-flex align-center justify-center mt-2"
                  color="primary"
                  flat
                  height="30"
                  @click="handleResultAnalyze"
                >
                  <span class="text-caption font-weight-bold mt-1 mx-2">Get my analysis</span>

                  <common-price-with-gem
                    v-if="!resultAnalyze?.purchased"
                    class="text-caption font-weight-bold mt-1"
                    :price="resultAnalyze?.points"
                    color="on-primary"
                  />
                  <span
                    v-else
                    class="text-caption font-weight-bold mt-1"
                  >(Owned)</span>
                </v-btn>
                <span
                  v-if="!resultAnalyze?.purchased"
                  class="text-grey500 text-body-1 font-weight-medium d-flex align-center ga-1"
                >
                  <v-icon>md:lock</v-icon>
                  Free with membership</span>
              </template>
            </div>
          </v-card>
        </div>
      </v-card>
    </div>

    <!-- Personal analysis: shown on load once bought, and revealed right after buying -->
    <v-expand-transition>
      <v-card
        v-if="analysisText"
        ref="analysisCardRef"
        class="w-100 mt-3 pa-4 border-sm border-primary border-opacity-50"
        color="primary50"
        flat
        rounded="lg"
      >
        <div class="d-flex align-center ga-3">
          <img
            :src="gamaRobot"
            alt=""
            width="48"
            height="48"
            class="image-robot flex-shrink-0"
          >
          <div class="d-flex flex-column">
            <span class="text-grey800 text-body-1 font-weight-bold">Your personal exam analysis</span>
            <span class="text-grey500 text-caption font-weight-medium">Based on your answers in this exam</span>
          </div>
        </div>
        <v-divider class="my-3" />
        <p class="text-grey700 text-body-1 font-weight-regular text-pre-line">
          {{ analysisText }}
        </p>
      </v-card>
    </v-expand-transition>

    <!-- Coin Payment Modal -->
    <lazy-common-modal-base
      v-model:show-dialog="showCoinPaymentModal"
      :max-width="900"
      title="Get Membership. Unlock Premium Analysis."
      subtitle="Join +50,000 Students"
    >
      <common-modal-payment
        :plans="paymentPlans"
        :billing-interval="billingInterval"
        :current-plan-id="currentPlanId"
        :current-plan-title="currentPlanTitle"
        @dismiss="showCoinPaymentModal = false"
        @switch-successfully="upgradePlanSuccessfully"
      />
    </lazy-common-modal-base>

    <!-- Coin Consumption Animation -->
    <lazy-common-coin-consumption-animation
      v-model:is-visible="showCoinAnimation"
      @animation-complete="handleAnimationComplete"
    />

    <lazy-test-counting-wallet-animation
      :is-start-animation="isStartWalletAnimation"
      :direction="-1"
      :delta-price="priceFile"
      @complete-animation="completeWalletAnimation"
    />
  </v-card>
</template>

<script setup lang="ts">
import type { ChartData, ChartOptions } from 'chart.js'
import type { ExamResultAnswerStatsDTO, ExamResultRankDTO, ExamResultAnalyzeResponseDTO, UpgradeSuggestionsDTO,
  BillingInterval, ExamAnalyzeDetailResponseDTO } from '@/types'
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from 'chart.js'
import { Doughnut as DoughnutChart } from 'vue-chartjs'
import { useGoTo, useTheme } from 'vuetify'
import gamaRobot from '@/assets/images/gama-robot.webp'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
)

const theme = useTheme()

const props = defineProps<{
  answerStats?: ExamResultAnswerStatsDTO
  rank?: ExamResultRankDTO
  resultAnalyze?: ExamResultAnalyzeResponseDTO
}>()
const emit = defineEmits<{
  updateResultAnalyze: [analysis: ExamAnalyzeDetailResponseDTO]
}>()

const totalStats = computed(() => {
  const total = props.answerStats?.total
  if (total) {
    return {
      ...total,
      noAnswer: getNoAnswerCount(total),
    }
  }

  return {
    num: 0,
    true: 0,
    false: 0,
    noAnswer: 0,
    percent: 0,
  }
})

const statItems = computed(() => [
  { label: 'Correct answers', value: totalStats.value.true, color: 'success' },
  { label: 'Wrong answers', value: totalStats.value.false, color: 'lightError' },
  { label: 'No answer', value: totalStats.value.noAnswer, color: 'grey300' },
  { label: 'Total questions', value: totalStats.value.num, color: 'grey600' },
])

const chartData = computed<ChartData<'doughnut'>>(() => ({
  labels: ['Correct answers', 'Wrong answers', 'No answer'],
  datasets: [
    {
      data: [
        totalStats.value.true,
        totalStats.value.false,
        totalStats.value.noAnswer,
      ],
      backgroundColor: [
        theme.current.value.colors.success,
        theme.current.value.colors.lightError,
        theme.current.value.colors.grey300,
      ],
      borderColor: theme.current.value.colors.grey100,
      borderWidth: 3,
      hoverOffset: 4,
    },
  ],
}))

const chartOptions = computed<ChartOptions<'doughnut'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '68%',
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const value = Number(context.raw || 0)
          return `${context.label}: ${value}`
        },
      },
    },
  },
}))

const getNoAnswerCount = (stats: { noanswer?: number, noAnswer?: number }) => {
  return stats.noanswer ?? stats.noAnswer ?? 0
}

const rankItems = computed(() => {
  return [
    { label: 'Country rank', value: formatRank(props.rank?.total), icon: 'md:trophy' },
    { label: 'State rank', value: formatRank(props.rank?.state), icon: 'md:leaderboard' },
  ]
})

const formatRank = (rank?: { user: number, total: string }) => {
  if (!rank) return '-'
  return `${rank.user} of ${rank.total}`
}

const { getAnalyzeResultExam, loadingGetAnalyzeResultExam } = useExamResult()
const route = useRoute()

const showCoinPaymentModal = ref(false)
const showCoinAnimation = ref(false)
const isStartWalletAnimation = ref(false)
const priceFile = ref(0)
const paymentPlans = ref<UpgradeSuggestionsDTO[]>([])
const billingInterval = ref<BillingInterval[]>([])
const currentPlanTitle = ref<string | null>(null)
const currentPlanId = ref<number | null>(null)
const goTo = useGoTo()
const analysisCardRef = ref<{ $el: HTMLElement } | null>(null)
// What the analysis card shows; a just-bought analysis waits here until the wallet animation ends.
const analysisText = ref(props.resultAnalyze?.result ?? '')
const pendingAnalysisText = ref('')

const revealAnalysis = async (text: string) => {
  analysisText.value = text
  await nextTick()
  if (analysisCardRef.value?.$el) {
    goTo(analysisCardRef.value.$el, { offset: -80 })
  }
}

const handleAnimationComplete = async () => {
  // Close everything immediately when animation completes
  showCoinAnimation.value = false
  isStartWalletAnimation.value = true
}

const completeWalletAnimation = () => {
  isStartWalletAnimation.value = false
  revealAnalysis(pendingAnalysisText.value)
}
const upgradePlanSuccessfully = async () => {
  showCoinPaymentModal.value = false
  await handleResultAnalyze()
}

const handleResultAnalyze = async () => {
  if (loadingGetAnalyzeResultExam.value) return

  const response = await getAnalyzeResultExam(route.params.id as string)
  if (response.succeeded && response.data) {
    emit('updateResultAnalyze', response.data)
    if (response.data.paidBy === 'Points') {
      // Animate the amount actually charged, not the price shown before buying.
      priceFile.value = response.data.points
      pendingAnalysisText.value = response.data.result
      showCoinAnimation.value = true
    }
    else {
      revealAnalysis(response.data.result)
    }
    return
  }

  if (response.data?.upgradeSuggestions?.length) {
    paymentPlans.value = response.data.upgradeSuggestions
    billingInterval.value = response.data.availableBillingIntervals || []
    currentPlanTitle.value = response.data.currentPlanTitle
    currentPlanId.value = response.data.currentPlanId
    showCoinPaymentModal.value = true
  }
  else if (response.errors?.[0]?.message === 'InsufficientBalance') {
    showCoinPaymentModal.value = true
  }
}
</script>

<style scoped>
.chart-container {
  width: 160px;
  height: 160px;
}
.image-robot{
  object-fit : contain
}
</style>
