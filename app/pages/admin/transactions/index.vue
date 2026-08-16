<template>
  <div class="w-100 h-100 d-flex flex-column align-start justify-start">
    <div class="w-100 d-flex justify-space-between align-center">
      <div class="d-flex align-center justify-start">
        <v-btn
          v-if="isShowClearFilter"
          color="primary"
          rounded="xl"
          height="40"
          width="120"
          class="text-h5"
          flat
          variant="outlined"
          @click="clearFilter"
        >
          Clear Filter
        </v-btn>
      </div>
      <div class="d-flex align-center justify-end ga-1 flex-wrap">
        <v-btn
          variant="plain"
          max-width="20"
          @click="showSearchModal = true"
        >
          <v-icon
            size="26"
            color="grey500"
          >
            md:search
          </v-icon>
        </v-btn>

        <v-btn
          size="small"
          flat
          icon
          color="info"
          :loading="loading"
          class="mr-1"
          @click="refreshData"
        >
          <v-icon
            color="white"
            size="20"
          >
            md:refresh
          </v-icon>
          <v-tooltip
            activator="parent"
            location="top"
          >
            Refresh Data
          </v-tooltip>
        </v-btn>

        <span
          class="text-grey400 text-no-wrap text-h5 font-weight-semibold"
        >
          <span class="text-grey500 font-weight-bold mr-1">
            {{ totalCount }}
          </span>
          Transactions
        </span>
      </div>
    </div>
    <div class="w-100 mt-4">
      <v-data-table
        :headers="headers"
        :items="list"
        :items-per-page="pageSize"
        class="elevation-1 set-height-table"
        :loading="loading"
        fixed-header
        hide-default-footer
      >
        <template #headers="{ columns }">
          <tr>
            <th
              v-for="(column, index) in columns"
              :key="index"
              :class="`bg-grey100 text-grey700 text-h5 font-weight-bold pa-2 th-min-width ${
                index == 0 || index == columns.length - 1
                  ? `text-left`
                  : `text-center`
              } ${index == columns.length - 1 ? `description-width` : ``}`"
            >
              {{ column.title }}
            </th>
          </tr>
        </template>

        <template #[`item.userId`]="{ item }">
          <div
            class="text-grey600 text-h5 d-flex justify-start align-center font-weight-bold"
          >
            {{ item.userId }}
          </div>
        </template>

        <template #[`item.points`]="{ item }">
          <div
            class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold"
          >
            {{ $numberFormat(item.points) }}
          </div>
        </template>
        <template #[`item.currentBalance`]="{ item }">
          <div
            class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold"
          >
            {{ $numberFormat(item.currentBalance) }}
          </div>
        </template>

        <template #[`item.creationDate`]="{ item }">
          <div
            class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold"
          >
            {{ formatLocal(item.creationDate, "DD/MM/YYYY HH:mm") }}
          </div>
        </template>

        <template #[`item.isDebit`]="{ item }">
          <div
            class="text-grey600 text-h5 d-flex justify-center align-end font-weight-bold ga-1"
          >
            <v-icon
              :class="`${item.isDebit ? `reverse-icon` : ``}`"
              size="26"
              :color="item.isDebit ? `error` : `success`"
            >
              md:payment_arrow_down
            </v-icon>
            <span :class="`${item.isDebit ? `text-error` : `text-success`}`">{{
              item.isDebit ? "Debit" : "Credit"
            }}</span>
          </div>
        </template>

        <template #[`item.description`]="{ item }">
          <div
            class="text-grey600 text-h5 d-flex justify-start align-center font-weight-bold"
          >
            <NuxtLink
              v-if="item.transactionType === 'DownloadPastPaper'"
              :to="`/paper/${item.identifierId}`"
              target="_blank"
              rel="noopener noreferrer"
              class="text-decoration-none"
            >
              {{ item.description }} ({{ item.identifierId }})
            </NuxtLink>

            <span v-else>
              {{ item.description }}
            </span>
          </div>
        </template>
      </v-data-table>
    </div>

    <div class="w-100 d-flex mt-2 position-relative ga-6">
      <div
        class="w-100 d-flex justify-center justify-sm-start justify-md-center mt-16 mt-sm-4"
      >
        <v-pagination
          v-model="page"
          :length="pageCount"
          :total-visible="4"
          next-icon="md:arrow_forward"
          prev-icon="md:arrow_back"
          size="40"
          class="custom-pagination"
          @update:model-value="changePageNumber"
        />
      </div>

      <div class="position-absolute right-0 select-size-div">
        <v-select
          v-model="pageSize"
          :items="allPageSize"
          item-title="label"
          item-value="value"
          variant="outlined"
          density="compact"
          rounded
          hide-details
          max-width="140"
          class="rounded-pill"
          @update:model-value="changePageSize"
        />
      </div>
    </div>

    <AdminCommonModal
      v-model:show-dialog="showSearchModal"
      title="Search"
    >
      <admin-transaction-modal-search
        :data="searchFilter"
        :loading="loading"
        @search="startSearch"
      />
    </AdminCommonModal>
  </div>
</template>

<script setup lang="ts">
import type {
  SearchFilterAdminTransaction,
} from '@/types'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

const { formatLocal } = useDateTime()
const {
  loadingGetData: loading,
  data: list,
  getData,
  totalCount,
  pageCount,
} = useTransactionAdmin()

const headers = [
  { title: 'User ID', key: 'userId', sortable: false, width: '5vw' },
  { title: 'Points', key: 'points', sortable: false, width: '15vw' },
  {
    title: 'Current Balance',
    key: 'currentBalance',
    sortable: false,
    width: '15vw',
  },
  {
    title: 'Creation Date',
    key: 'creationDate',
    sortable: false,
    width: '15vw',
  },
  { title: 'Type', key: 'isDebit', sortable: false, width: '10vw' },
  { title: 'Description', key: 'description', sortable: false, width: '40vw' },
]
const showSearchModal = ref(false)
const pageSize = ref(10)
const page = ref(1)
const allPageSize = [
  { label: '10 Rows', value: 10 },
  { label: '20 Rows', value: 20 },
  { label: '50 Rows', value: 50 },
]

const searchFilter = reactive<SearchFilterAdminTransaction>({
  isDebit: null,
  userId: '',
  name: '',
  email: '',
  identifierId: '',
  startDate: '',
  endDate: '',
})

const fetchTransactions = async () => {
  await getData({
    page: page.value,
    pageSize: pageSize.value,
    ...searchFilter,
  })
}

const changePageNumber = async () => {
  await fetchTransactions()
}

const changePageSize = async () => {
  page.value = 1
  await fetchTransactions()
}

onMounted(async () => {
  await fetchTransactions()
})

const startSearch = async (item: SearchFilterAdminTransaction) => {
  searchFilter.isDebit = item.isDebit
  searchFilter.userId = item.userId
  searchFilter.name = item.name
  searchFilter.email = item.email
  searchFilter.identifierId = item.identifierId
  searchFilter.startDate = item.startDate
  searchFilter.endDate = item.endDate
  page.value = 1
  showSearchModal.value = false
  await fetchTransactions()
}

const isShowClearFilter = computed(() => {
  if (
    searchFilter.isDebit !== null
    || searchFilter.userId.length > 0
    || searchFilter.name.length > 0
    || searchFilter.email.length > 0
    || searchFilter.identifierId.length > 0
    || searchFilter.startDate.toString().length > 0
    || searchFilter.endDate.toString().length > 0
  ) {
    return true
  }
  return false
})

const clearFilter = async () => {
  searchFilter.isDebit = null
  searchFilter.userId = ''
  searchFilter.name = ''
  searchFilter.email = ''
  searchFilter.identifierId = ''
  searchFilter.startDate = ''
  searchFilter.endDate = ''
  page.value = 1
  await fetchTransactions()
}

const refreshData = async () => {
  await fetchTransactions()
}
</script>

<style scoped>
.set-height-table {
  max-height: 70vh;
}
.th-min-width {
  min-width: 130px;
}
.description-width {
  min-width: 200px;
}
.reverse-icon {
  transform: rotateZ(180deg);
}
.select-size-div {
  top: 18px;
}
.text-decoration-none:hover {
  text-decoration: underline !important;
}

:deep(.custom-pagination li button:hover) {
  background-color: rgb(var(--v-theme-primary));
  opacity: 0.6;
}
:deep(.custom-pagination .v-pagination__item--is-active button) {
  background: rgb(var(--v-theme-primary)) !important;
}
:deep(.custom-pagination .v-pagination__item--is-active .v-btn__overlay){
  opacity: 0 !important;
}
</style>
