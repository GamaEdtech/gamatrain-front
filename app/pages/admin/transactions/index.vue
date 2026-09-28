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
    </div>

    <common-data-table
      v-model:page="page"
      v-model:page-size="pageSize"
      :headers="headers"
      :items="list || []"
      :page-count="pageCount"
      :total-count="totalCount"
      :page-size-options="allPageSize"
      :loading="loading"
      item-label="Transactions"
      class="mt-4"
      @update:page="changePageNumber"
      @update:page-size="changePageSize"
    >
      <template #actions>
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
    </common-data-table>

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
  AdminTransactionDTO,
  DataTableHeader,
  SearchFilterAdminTransaction,
} from '@/types'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

const {
  loadingGetData: loading,
  data: list,
  getData,
  totalCount,
  pageCount,
} = useTransactionAdmin()

const headers: DataTableHeader<AdminTransactionDTO>[] = [
  { title: 'User ID', key: 'userId', sortable: false, width: '5vw', align: 'start' },
  { title: 'Points', key: 'points', sortable: false, width: '15vw', type: 'number' },
  {
    title: 'Current Balance',
    key: 'currentBalance',
    sortable: false,
    width: '15vw',
    type: 'number',
  },
  {
    title: 'Creation Date',
    key: 'creationDate',
    sortable: false,
    width: '15vw',
    type: 'date',
    dateFormat: 'DD/MM/YYYY HH:mm',
  },
  { title: 'Type', key: 'isDebit', sortable: false, width: '10vw' },
  { title: 'Description', key: 'description', sortable: false, width: '40vw', align: 'start' },
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

const changePageNumber = async (pageNumber: number) => {
  page.value = pageNumber
  await fetchTransactions()
}

const changePageSize = async (newPageSize: number) => {
  pageSize.value = newPageSize
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
.reverse-icon {
  transform: rotateZ(180deg);
}
.text-decoration-none:hover {
  text-decoration: underline !important;
}
</style>
