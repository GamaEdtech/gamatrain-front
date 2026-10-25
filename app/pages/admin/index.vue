<template>
  <div class="dashboard w-100 d-flex flex-column ga-8 pb-8">
    <!-- Header -->
    <div class="w-100 d-flex align-center justify-space-between flex-wrap ga-3">
      <div class="d-flex flex-column">
        <h1 class="text-h3 font-weight-bold text-grey800">
          {{ greeting }}{{ user?.firstName ? `, ${user.firstName}` : '' }}
        </h1>
        <span class="text-h6 text-grey500">
          Here's what needs you and how {{ monthLabel }} is going.
        </span>
      </div>
      <v-btn
        variant="outlined"
        rounded="pill"
        color="grey600"
        prepend-icon="md:refresh"
        class="text-h6 font-weight-bold"
        :loading="refreshing"
        @click="refreshAll"
      >
        Refresh
      </v-btn>
    </div>

    <!-- Needs attention -->
    <section class="d-flex flex-column ga-3">
      <div class="d-flex flex-column">
        <h2 class="text-h4 font-weight-bold text-grey700">
          Needs attention
        </h2>
        <span class="text-subtitle-1 text-grey500">
          {{ totalWaiting ? `${totalWaiting.toLocaleString('en-US')} items waiting` : 'Nothing waiting' }}
          <template v-if="summary"> · updated {{ formatLocal(summary.generatedDate, 'HH:mm') }}</template>
        </span>
      </div>
      <admin-dashboard-attention-cards
        :items="summary?.items ?? []"
        :loading="loadingSummary"
      />
    </section>

    <!-- Performance -->
    <section class="d-flex flex-column ga-4">
      <div class="d-flex align-center justify-space-between flex-wrap ga-3">
        <div class="d-flex flex-column">
          <h2 class="text-h4 font-weight-bold text-grey700">
            Performance
          </h2>
          <span class="text-subtitle-1 text-grey500">{{ rangeLabel }}</span>
        </div>
        <admin-dashboard-month-switcher v-model="month" />
      </div>

      <admin-dashboard-kpi-tiles
        :overview="overview"
        :loading="loadingOverview"
      />

      <v-row dense>
        <v-col
          cols="12"
          lg="8"
        >
          <admin-dashboard-trend-chart
            :daily="overview?.daily ?? []"
            :loading="loadingOverview"
          />
        </v-col>
        <v-col
          cols="12"
          lg="4"
        >
          <admin-dashboard-revenue-breakdown
            :overview="overview"
            :loading="loadingOverview"
          />
        </v-col>
      </v-row>
    </section>

    <!-- Payments -->
    <v-card
      tag="section"
      border
      flat
      rounded="xl"
      class="pa-4 pa-md-5 d-flex flex-column ga-3"
    >
      <div class="w-100 d-flex align-center justify-space-between flex-wrap ga-2">
        <div class="d-flex flex-column">
          <h2 class="text-h4 font-weight-bold text-grey700">
            Payments
          </h2>
          <span class="text-subtitle-1 text-grey500">{{ paymentsRangeLabel }}</span>
        </div>
        <div class="d-flex align-center ga-2">
          <admin-common-clear-filter-btn
            v-if="isShowClearFilter"
            @click="clearFilter"
          />
          <v-btn
            variant="tonal"
            rounded="pill"
            size="small"
            prepend-icon="md:tune"
            class="text-h6"
            @click="showSearchModal = true"
          >
            Filter
          </v-btn>
          <v-btn
            size="small"
            variant="tonal"
            icon
            :loading="loadingPayments"
            aria-label="Refresh payments"
            @click="refreshPayments"
          >
            <v-icon size="18">
              md:refresh
            </v-icon>
          </v-btn>
        </div>
      </div>
      <admin-dashboard-payment-chart @select-bar="selectBar" />
      <admin-dashboard-payment-table />
    </v-card>

    <!-- Invite program -->
    <section class="d-flex flex-column ga-3">
      <div class="d-flex flex-column">
        <h2 class="text-h4 font-weight-bold text-grey700">
          Teacher invite program
        </h2>
        <span class="text-subtitle-1 text-grey500">{{ rangeLabel }}</span>
      </div>
      <admin-dashboard-referral-report
        :report="referrals"
        :loading="loadingReferrals"
      />
    </section>

    <admin-common-modal
      v-model:show-dialog="showSearchModal"
      title="Search"
    >
      <admin-dashboard-modal-search
        :data="paymentSummaryGetParams"
        @search-data="startSearch"
      />
    </admin-common-modal>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import type {
  DashboardRange,
  PaymentSummaryDTO,
  PaymentSummaryGetParams,
} from '@/types'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin', 'finance'],
})

useHead({ title: 'Admin dashboard' })

const { user } = useUser()
const { formatLocal } = useDateTime()
const { paymentSummary, getPaymentSummary, loadingPaymentSummary: loadingPayments } = usePayment()
const {
  summary,
  loadingSummary,
  fetchSummary,
  startSummaryRefresh,
  stopSummaryRefresh,
  overview,
  loadingOverview,
  fetchOverview,
  referrals,
  loadingReferrals,
  fetchReferrals,
} = useAdminDashboard()

const greeting = (() => {
  const hour = dayjs().hour()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
})()

const totalWaiting = computed(() => summary.value?.items.reduce((sum, t) => sum + t.count, 0) ?? 0)

// The month the performance, payments and invite sections show (YYYY-MM). The current month runs up to today.
const month = ref(dayjs().format('YYYY-MM'))
const range = computed<DashboardRange>(() => {
  const start = dayjs(`${month.value}-01`)
  const monthEnd = start.endOf('month')
  const end = monthEnd.isAfter(dayjs()) ? dayjs() : monthEnd
  return { startDate: start.format('YYYY-MM-DD'), endDate: end.format('YYYY-MM-DD') }
})
const monthLabel = computed(() => (month.value === dayjs().format('YYYY-MM') ? 'this month' : dayjs(`${month.value}-01`).format('MMMM YYYY')))
const rangeLabel = computed(() => `${dayjs(range.value.startDate).format('D MMM')} – ${dayjs(range.value.endDate).format('D MMM YYYY')}`)

const showSearchModal = ref(false)
const paymentSummaryGetParams = reactive<PaymentSummaryGetParams>({
  userId: null,
  startDate: range.value.startDate,
  endDate: range.value.endDate,
  gateway: 'Stripe',
  status: 'Paid',
  currency: null,
  kind: null,
})
const paymentsRangeLabel = computed(() => {
  const { startDate, endDate } = paymentSummaryGetParams
  if (!startDate || !endDate) return 'All dates'
  return startDate === endDate
    ? dayjs(startDate).format('D MMM YYYY')
    : `${dayjs(startDate).format('D MMM')} – ${dayjs(endDate).format('D MMM YYYY')}`
})

const isShowClearFilter = computed(() => (
  !!paymentSummaryGetParams.userId
  || paymentSummaryGetParams.startDate !== range.value.startDate
  || paymentSummaryGetParams.endDate !== range.value.endDate
  || (!!paymentSummaryGetParams.gateway && paymentSummaryGetParams.gateway != 'Stripe')
  || (!!paymentSummaryGetParams.status && paymentSummaryGetParams.status != 'Paid')
  || !!paymentSummaryGetParams.currency
  || !!paymentSummaryGetParams.kind
))

const resetPaymentFilter = () => {
  paymentSummaryGetParams.userId = null
  paymentSummaryGetParams.startDate = range.value.startDate
  paymentSummaryGetParams.endDate = range.value.endDate
  paymentSummaryGetParams.gateway = 'Stripe'
  paymentSummaryGetParams.status = 'Paid'
  paymentSummaryGetParams.currency = null
  paymentSummaryGetParams.kind = null
}

const refreshPayments = () => getPaymentSummary(paymentSummaryGetParams)

const clearFilter = async () => {
  resetPaymentFilter()
  await refreshPayments()
}

const startSearch = async (item: PaymentSummaryGetParams) => {
  paymentSummaryGetParams.userId = item.userId
  paymentSummaryGetParams.startDate = item.startDate ? dayjs(item.startDate).format('YYYY-MM-DD') : null
  paymentSummaryGetParams.endDate = item.endDate ? dayjs(item.endDate).format('YYYY-MM-DD') : null
  paymentSummaryGetParams.gateway = item.gateway
  paymentSummaryGetParams.status = item.status
  paymentSummaryGetParams.currency = item.currency
  paymentSummaryGetParams.kind = item.kind
  showSearchModal.value = false
  await refreshPayments()
}

const selectBar = (data: PaymentSummaryDTO) => {
  paymentSummary.value = [data]
  paymentSummaryGetParams.startDate = data.date
  paymentSummaryGetParams.endDate = data.date
}

const loadPeriod = async () => {
  await Promise.all([fetchOverview(range.value), fetchReferrals(range.value), refreshPayments()])
}

// Switching month moves every period section, and the payments chart back to that month's unfiltered view.
watch(month, async () => {
  resetPaymentFilter()
  await loadPeriod()
})

const refreshing = ref(false)
const refreshAll = async () => {
  refreshing.value = true
  try {
    await Promise.all([fetchSummary(true), loadPeriod()])
  }
  finally {
    refreshing.value = false
  }
}

onMounted(async () => {
  startSummaryRefresh()
  await loadPeriod()
})

onBeforeUnmount(stopSummaryRefresh)
</script>
