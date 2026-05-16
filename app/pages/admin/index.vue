<template>
  <div class="w-100 h-100 d-flex flex-column align-start justify-start">
    <div class="w-100 d-flex align-center justify-space-between mb-4">
      <span class="text-h4 font-weight-bold text-start text-grey700">
        Payment Summary
      </span>
      <v-btn
        variant="plain"
        max-width="40"
        @click="showSearchModal = true"
      >
        <v-icon
          size="36"
          class="grey500"
        >
          md:search
        </v-icon>
      </v-btn>
    </div>
    <div class="w-100 d-flex align-center justify-start mb-4">
      <v-btn
        v-if="isShowClearFilter"
        color="primary"
        rounded="pill"
        height="40"
        width="120"
        class="text-h5 font-weight-bold "
        flat
        variant="outlined"
        @click="clearFilter"
      >
        Clear Filter
      </v-btn>
    </div>
    <admin-dashboard-payment-chart />

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
  PaymentSummaryGetParams,
} from '@/types'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

const { getPaymentSummary } = usePayment()

const showSearchModal = ref(false)
const DEFAULT_START_DATE = dayjs()
  .subtract(30, 'day')
  .format('YYYY-MM-DD')

const DEFAULT_END_DATE = dayjs()
  .format('YYYY-MM-DD')
const paymentSummaryGetParams = reactive<PaymentSummaryGetParams>({
  userId: null,
  startDate: DEFAULT_START_DATE,
  endDate: DEFAULT_END_DATE,
  gateway: null,
  status: null,
  currency: null,
})

onMounted(async () => {
  await getPaymentSummary(paymentSummaryGetParams)
})

const isShowClearFilter = computed(() => {
  return (
    !!paymentSummaryGetParams.userId
    || paymentSummaryGetParams.startDate !== DEFAULT_START_DATE
    || paymentSummaryGetParams.endDate !== DEFAULT_END_DATE
    || !!paymentSummaryGetParams.gateway
    || !!paymentSummaryGetParams.status
    || !!paymentSummaryGetParams.currency
  )
})
const clearFilter = async () => {
  paymentSummaryGetParams.userId = null
  paymentSummaryGetParams.startDate = ''
  paymentSummaryGetParams.endDate = ''
  paymentSummaryGetParams.gateway = null
  paymentSummaryGetParams.status = null
  paymentSummaryGetParams.currency = null
  await getPaymentSummary(paymentSummaryGetParams)
}

const startSearch = async (item: PaymentSummaryGetParams) => {
  paymentSummaryGetParams.userId = item.userId
  paymentSummaryGetParams.startDate = item.startDate ? dayjs(item.startDate).format('YYYY-MM-DD') : null
  paymentSummaryGetParams.endDate = item.endDate ? dayjs(item.endDate).format('YYYY-MM-DD') : null
  paymentSummaryGetParams.gateway = item.gateway
  paymentSummaryGetParams.status = item.status
  paymentSummaryGetParams.currency = item.currency
  showSearchModal.value = false
  await getPaymentSummary(paymentSummaryGetParams)
}
</script>
