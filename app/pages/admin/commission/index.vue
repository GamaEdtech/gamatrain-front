<template>
  <div class="w-100 h-100 d-flex flex-column align-start justify-start">
    <div class="w-100 d-flex justify-space-between align-center">
      <div class="d-flex align-center justify-start position-relative flex-wrap ga-2">
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
      item-label="Commissions"
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
            class="grey500"
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
    </common-data-table>

    <admin-common-modal
      v-model:show-dialog="showSearchModal"
      title="Search"
    >
      <admin-commission-modal-search
        :data="searchFilter"
        :loading="loading"
        @search="startSearch"
      />
    </admin-common-modal>
  </div>
</template>

<script setup lang="ts">
import type {
  AdminCommissionDTO,
  DataTableHeader,
  SearchFilterAdminCommission,
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
} = useCommissionAdmin()

const headers: DataTableHeader<AdminCommissionDTO>[] = [
  { title: 'ID', key: 'id', sortable: false, width: '8vw' },
  {
    title: 'Owner',
    key: 'ownerFirstName',
    sortable: false,
    width: '18vw',
    getText: (item: AdminCommissionDTO) => getOwnerName(item),
  },
  { title: 'Downloader ID', key: 'downloaderUserId', sortable: false, width: '14vw', emptyText: 'unknown' },
  {
    title: 'Reason',
    key: 'reason',
    sortable: false,
    width: '16vw',
    type: 'chip',
    getChipColor: () => 'info',
  },
  { title: 'Source', key: 'source', sortable: false, width: '16vw', emptyText: 'unknown' },
  {
    title: 'Content Type',
    key: 'contentType',
    sortable: false,
    width: '16vw',
    type: 'chip',
    getChipColor: () => 'primary',
  },
  { title: 'Content ID', key: 'externalContentId', sortable: false, width: '14vw', emptyText: 'unknown' },
  { title: 'File Type', key: 'externalFileType', sortable: false, width: '14vw', emptyText: 'unknown' },
  { title: 'Extra ID', key: 'externalExtraId', sortable: false, width: '12vw', emptyText: 'unknown' },
  { title: 'Points', key: 'points', sortable: false, width: '10vw', type: 'number' },
  { title: 'Commission', key: 'commissionPercent', sortable: false, width: '14vw', type: 'percent' },
  { title: 'Amount USD', key: 'amountUsd', sortable: false, width: '14vw', type: 'currency', prefix: '$' },
  {
    title: 'Created At',
    key: 'creationDate',
    sortable: false,
    width: '18vw',
    type: 'date',
    dateFormat: 'DD/MM/YYYY HH:mm:ss',
  },
]

const pageSize = ref(10)
const page = ref(1)
const allPageSize = [
  { label: '10 Rows', value: 10 },
  { label: '20 Rows', value: 20 },
  { label: '50 Rows', value: 50 },
]

const showSearchModal = ref(false)
const searchFilter = reactive<SearchFilterAdminCommission>({
  startDate: '',
  endDate: '',
})

const fetchCommissions = async () => {
  await getData({
    page: page.value,
    pageSize: pageSize.value,
    ...searchFilter,
  })
}

const changePageNumber = async (pageNumber: number) => {
  page.value = pageNumber
  await fetchCommissions()
}

const changePageSize = async (newPageSize: number) => {
  pageSize.value = newPageSize
  page.value = 1
  await fetchCommissions()
}

onMounted(async () => {
  await fetchCommissions()
})

const startSearch = async (item: SearchFilterAdminCommission) => {
  searchFilter.startDate = item.startDate
  searchFilter.endDate = item.endDate
  page.value = 1
  showSearchModal.value = false
  await fetchCommissions()
}

const isShowClearFilter = computed(() => {
  return searchFilter.startDate.toString().length > 0
    || searchFilter.endDate.toString().length > 0
})

const clearFilter = async () => {
  searchFilter.startDate = ''
  searchFilter.endDate = ''
  page.value = 1
  await fetchCommissions()
}

const getOwnerName = (item: AdminCommissionDTO) => {
  if (!item.ownerFirstName && !item.ownerLastName) return 'unknown'

  return `${item.ownerFirstName} ${item.ownerLastName}`
}

const refreshData = async () => {
  await fetchCommissions()
}
</script>

<style scoped>
</style>
