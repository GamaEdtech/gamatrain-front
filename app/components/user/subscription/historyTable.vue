<template>
  <common-data-table
    :page="page"
    :page-size="pageSize"
    title="Subscription History"
    item-label="Records"
    :headers="headers"
    :items="userSubscriptionHistory"
    :loading="loadingGetUserSubscriptionHistory"
    :page-count="userSubscriptionHistoryPageCount"
    :total-count="userSubscriptionHistoryTotalCount"
    @update:page="changePageNumber"
    @update:page-size="changePageSize"
  >
    <template #[`item.status`]="{ item }">
      <div class="w-100 d-flex justify-center align-center">
        <v-chip
          :color="getStatusColor(item.status)"
          class="font-weight-bold text-h5"
        >
          {{ item.status }}
        </v-chip>
      </div>
    </template>

    <template #[`item.creationDate`]="{ item }">
      <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center">
        {{ formatDate(item.creationDate) }}
      </div>
    </template>

    <template #[`item.startDate`]="{ item }">
      <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center">
        {{ formatDate(item.startDate) }}
      </div>
    </template>

    <template #[`item.expirationDate`]="{ item }">
      <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center">
        {{ formatDate(item.expirationDate) }}
      </div>
    </template>

    <template #[`item.pricePaid`]="{ item }">
      <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold">
        {{ item.currency }} {{ $numberFormat(item.pricePaid) }}
      </div>
    </template>

    <template #[`item.autoRenews`]="{ item }">
      <div class="w-100 d-flex justify-center align-center">
        <v-chip
          :color="item.autoRenews ? `success` : `grey400`"
          class="font-weight-bold text-h5"
        >
          {{ item.autoRenews ? `Yes` : `No` }}
        </v-chip>
      </div>
    </template>
  </common-data-table>
</template>

<script setup lang="ts">
const { $numberFormat } = useNuxtApp()
const { formatLocal } = useDateTime()
const {
  userSubscriptionHistory,
  userSubscriptionHistoryTotalCount,
  userSubscriptionHistoryPageCount,
  loadingGetUserSubscriptionHistory,
  getUserSubscriptionHistory,
} = useSubscription()

const page = ref(1)
const pageSize = ref(10)

const headers = [
  { title: 'Plan', key: 'planTitle', sortable: false },
  { title: 'Status', key: 'status', sortable: false },
  { title: 'Created', key: 'creationDate', sortable: false },
  { title: 'Started', key: 'startDate', sortable: false },
  { title: 'Expires', key: 'expirationDate', sortable: false },
  { title: 'Paid', key: 'pricePaid', sortable: false },
  { title: 'Billing', key: 'billingInterval', sortable: false },
  { title: 'Auto Renews', key: 'autoRenews', sortable: false },
]

const fetchHistory = async () => {
  await getUserSubscriptionHistory({
    page: page.value,
    pageSize: pageSize.value,
  })
}

const formatDate = (value: string) => {
  return formatLocal(value, 'DD/MM/YYYY')
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'success'
    case 'Pending':
      return 'warning'
    case 'Expired':
      return 'lightError'
    case 'Cancelled':
      return 'grey400'
    default:
      return 'grey400'
  }
}

const changePageNumber = async (value: number) => {
  page.value = value
  await fetchHistory()
}

const changePageSize = async (value: number) => {
  pageSize.value = value
  page.value = 1
  await fetchHistory()
}

onMounted(fetchHistory)
</script>
