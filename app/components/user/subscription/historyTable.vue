<template>
  <div
    v-if="loadingGetUserSubscriptionHistory || userSubscriptionHistoryTotalCount > 0"
    class="w-100 d-flex flex-column align-start justify-start"
  >
    <div class="w-100 d-flex justify-space-between align-center flex-wrap ga-2">
      <span class="text-h4 font-weight-bold text-grey700">Subscription History</span>
      <span class="text-grey400 text-no-wrap text-h5 font-weight-semibold">
        <span class="text-grey500 font-weight-bold mr-1">{{ userSubscriptionHistoryTotalCount }}</span>
        Records
      </span>
    </div>

    <!-- Start Desktop -->
    <div class="w-100 mt-4 d-none d-sm-block">
      <common-data-table
        :page="page"
        :page-size="pageSize"
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
    </div>
    <!-- End Desktop -->

    <!-- Start Mobile -->
    <div class="w-100 d-flex d-sm-none flex-column align-start justify-start mt-4">
      <template v-if="loadingGetUserSubscriptionHistory">
        <div
          v-for="i in pageSize"
          :key="i"
          :class="`${i % 2 == 1 ? `bg-grey25 border-odd` : ``} card-history-mobile w-100 d-flex flex-column align-start justify-start ga-3 pa-4`"
        >
          <v-skeleton-loader
            width="140"
            height="20"
            class="rounded-lg"
          />
          <v-skeleton-loader
            width="100%"
            height="60"
            class="rounded-lg"
          />
        </div>
      </template>
      <template v-else>
        <div
          v-for="(item, index) in userSubscriptionHistory"
          :key="index"
          :class="`${index % 2 == 0 ? `bg-grey25 border-odd` : ``} card-history-mobile w-100 d-flex flex-column align-start justify-start ga-3 pa-4`"
        >
          <div class="w-100 d-flex align-center justify-space-between">
            <span class="text-grey700 text-h6 font-weight-medium">{{ item.planTitle }}</span>
            <v-chip
              :color="getStatusColor(item.status)"
              class="font-weight-bold text-h6"
            >
              {{ item.status }}
            </v-chip>
          </div>
          <div class="w-100 d-flex align-center justify-space-between">
            <span class="text-grey500 text-h6">Created</span>
            <span class="text-grey700 text-h6 font-weight-bold">{{ formatDate(item.creationDate) }}</span>
          </div>
          <div class="w-100 d-flex align-center justify-space-between">
            <span class="text-grey500 text-h6">Started</span>
            <span class="text-grey700 text-h6 font-weight-bold">{{ formatDate(item.startDate) }}</span>
          </div>
          <div class="w-100 d-flex align-center justify-space-between">
            <span class="text-grey500 text-h6">Expires</span>
            <span class="text-grey700 text-h6 font-weight-bold">{{ formatDate(item.expirationDate) }}</span>
          </div>
          <div class="w-100 d-flex align-center justify-space-between">
            <span class="text-grey500 text-h6">Paid</span>
            <span class="text-grey700 text-h6 font-weight-bold">{{ item.currency }} {{ $numberFormat(item.pricePaid) }}</span>
          </div>
          <div class="w-100 d-flex align-center justify-space-between">
            <span class="text-grey500 text-h6">Billing</span>
            <span class="text-grey700 text-h6 font-weight-bold">{{ item.billingInterval }}</span>
          </div>
          <div class="w-100 d-flex align-center justify-space-between">
            <span class="text-grey500 text-h6">Auto Renews</span>
            <v-chip
              :color="item.autoRenews ? `success` : `grey400`"
              class="font-weight-bold text-h6"
            >
              {{ item.autoRenews ? `Yes` : `No` }}
            </v-chip>
          </div>
        </div>
      </template>

      <div
        v-if="userSubscriptionHistoryPageCount > 1"
        class="w-100 d-flex justify-center mt-4"
      >
        <v-pagination
          v-model="page"
          :length="userSubscriptionHistoryPageCount"
          :total-visible="4"
          :disabled="loadingGetUserSubscriptionHistory"
          next-icon="md:arrow_forward"
          prev-icon="md:arrow_back"
          size="40"
          class="custom-pagination"
          @update:model-value="changePageNumber"
        />
      </div>
    </div>
    <!-- End Mobile -->
  </div>
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

<style scoped>
.border-odd {
  border-top: 2px solid rgb(var(--v-theme-grey100));
  border-bottom: 2px solid rgb(var(--v-theme-grey100));
}
.card-history-mobile {
  min-height: 190px;
}
:deep(.custom-pagination .v-pagination__item--is-active button) {
  background-color: rgb(var(--v-theme-primary)) !important;
}
:deep(.custom-pagination .v-pagination__item--is-active .v-btn__overlay) {
  background-color: rgb(var(--v-theme-primary)) !important;
}
</style>
