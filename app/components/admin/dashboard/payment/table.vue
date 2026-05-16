<template>
  <div class="w-100 mt-4">
    <v-data-table
      :headers="headers"
      :items="tableItems"
      class="elevation-1 set-height-table"
      :loading="loadingPaymentSummary"
      fixed-header
      hide-default-footer
    >
      <template #headers="{ columns }">
        <tr>
          <th
            v-for="(column, index) in columns"
            :key="index"
            :class="`bg-grey100 text-grey700 text-h5 font-weight-bold pa-2 text-center
               ${index == 0 ? `text-start` : `th-min-width`}`"
          >
            {{ column.title }}
          </th>
        </tr>
      </template>

      <template #[`item.metric`]="{ item }">
        <div
          :class="`text-${getColorTitle(item.metric)} text-h5 font-weight-bold py-4`"
        >
          {{ item.metric }}
        </div>
      </template>

      <template #[`item.totalAmount`]="{ item }">
        <div
          class="text-grey600 text-h5 text-center font-weight-bold"
        >
          $ {{ $numberFormat(item.totalAmount.toFixed(2)) }}
        </div>
      </template>
      <template #[`item.totalCount`]="{ item }">
        <div
          class="text-grey600 text-h5 text-center font-weight-bold"
        >
          {{ item.totalCount }}
        </div>
      </template>
      <template #[`item.trend`]="{ item }">
        <div
          class="text-grey600 text-h5 text-center font-weight-bold"
        >
          {{ item.trend }}
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script setup lang="ts">
const { paymentSummary, loadingPaymentSummary } = usePayment()

const headers = [
  {
    title: 'Metric',
    key: 'metric',
    sortable: false,
    width: '25vw',
  },

  {
    title: 'Total Amount',
    key: 'totalAmount',
    sortable: false,
    width: '25vw',
  },

  {
    title: 'Total Count',
    key: 'totalCount',
    sortable: false,
    width: '25vw',
  },

  {
    title: 'Trend',
    key: 'trend',
    sortable: false,
    width: '25vw',
  },
]
const tableItems = computed(() => {
  const paidAmount = paymentSummary.value.reduce(
    (sum, item) => sum + item.paidAmount,
    0,
  )

  const pendingAmount = paymentSummary.value.reduce(
    (sum, item) => sum + item.pendingAmount,
    0,
  )

  const failedAmount = paymentSummary.value.reduce(
    (sum, item) => sum + item.failedAmount,
    0,
  )

  const paidCount = paymentSummary.value.reduce(
    (sum, item) => sum + item.paidCount,
    0,
  )

  const pendingCount = paymentSummary.value.reduce(
    (sum, item) => sum + item.pendingCount,
    0,
  )

  const failedCount = paymentSummary.value.reduce(
    (sum, item) => sum + item.failedCount,
    0,
  )

  return [
    {
      metric: 'Paid',
      totalAmount: paidAmount,
      totalCount: paidCount,
      trend: '-',
    },

    {
      metric: 'Pending',
      totalAmount: pendingAmount,
      totalCount: pendingCount,
      trend: '-',
    },

    {
      metric: 'Failed',
      totalAmount: failedAmount,
      totalCount: failedCount,
      trend: '-',
    },

    {
      metric: 'Grand Total',
      totalAmount:
        paidAmount
        + pendingAmount
        + failedAmount,

      totalCount:
        paidCount
        + pendingCount
        + failedCount,

      trend: '-',
    },
  ]
})

const getColorTitle = (title: string) => {
  switch (title) {
    case 'Paid':
      return 'success'
    case 'Pending':
      return 'warning'
    case 'Failed':
      return 'error'

    default:
      return 'grey700'
  }
}
</script>

<style scoped>
.set-height-table {
  max-height: 70vh;
}
.th-min-width {
  min-width: 130px;
}
</style>
