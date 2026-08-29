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

      <div class="d-flex align-center justify-end ga-1 flex-wrap">
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

        <span class="text-grey400 text-no-wrap text-h5 font-weight-semibold">
          <span class="text-grey500 font-weight-bold mr-1">
            {{ totalCount }}
          </span>
          Commissions
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
              :class="`bg-grey100 text-grey700 text-h5 font-weight-bold pa-2 text-center
               ${index == 0 ? `` : `th-min-width`}`"
            >
              {{ column.title }}
            </th>
          </tr>
        </template>

        <template #[`item.id`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold">
            {{ item.id }}
          </div>
        </template>

        <template #[`item.ownerFirstName`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center">
            {{ getOwnerName(item) }}
          </div>
        </template>

        <template #[`item.reason`]="{ item }">
          <div class="w-100 d-flex justify-center align-center">
            <v-chip
              color="info"
              class="font-weight-bold text-h5"
            >
              {{ item.reason }}
            </v-chip>
          </div>
        </template>

        <template #[`item.downloaderUserId`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center">
            {{ formatCell(item.downloaderUserId) }}
          </div>
        </template>

        <template #[`item.source`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center">
            {{ formatCell(item.source) }}
          </div>
        </template>

        <template #[`item.contentType`]="{ item }">
          <div class="w-100 d-flex justify-center align-center">
            <v-chip
              color="primary"
              class="font-weight-bold text-h5"
            >
              {{ item.contentType }}
            </v-chip>
          </div>
        </template>

        <template #[`item.externalContentId`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center">
            {{ formatCell(item.externalContentId) }}
          </div>
        </template>

        <template #[`item.externalFileType`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center">
            {{ formatCell(item.externalFileType) }}
          </div>
        </template>

        <template #[`item.externalExtraId`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center">
            {{ formatCell(item.externalExtraId) }}
          </div>
        </template>

        <template #[`item.points`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center">
            {{ $numberFormat(item.points) }}
          </div>
        </template>

        <template #[`item.commissionPercent`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center">
            {{ $numberFormat(item.commissionPercent) }}%
          </div>
        </template>

        <template #[`item.amountUsd`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center">
            ${{ $numberFormat(item.amountUsd) }}
          </div>
        </template>

        <template #[`item.creationDate`]="{ item }">
          <div class="text-grey600 text-h5 d-flex text-center justify-center align-center font-weight-bold">
            {{ formatLocal(item.creationDate, 'DD/MM/YYYY HH:mm:ss') }}
          </div>
        </template>
      </v-data-table>
    </div>

    <div class="w-100 d-flex mt-2 position-relative ga-6">
      <div class="w-100 d-flex justify-center justify-sm-start justify-md-center mt-16 mt-sm-4">
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
  SearchFilterAdminCommission,
} from '@/types'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

const { formatLocal } = useDateTime()
const { $numberFormat } = useNuxtApp()
const {
  loadingGetData: loading,
  data: list,
  getData,
  totalCount,
  pageCount,
} = useCommissionAdmin()

const headers = [
  { title: 'ID', key: 'id', sortable: false, width: '8vw' },
  { title: 'Owner', key: 'ownerFirstName', sortable: false, width: '18vw' },
  { title: 'Downloader ID', key: 'downloaderUserId', sortable: false, width: '14vw' },
  { title: 'Reason', key: 'reason', sortable: false, width: '16vw' },
  { title: 'Source', key: 'source', sortable: false, width: '16vw' },
  { title: 'Content Type', key: 'contentType', sortable: false, width: '16vw' },
  { title: 'Content ID', key: 'externalContentId', sortable: false, width: '14vw' },
  { title: 'File Type', key: 'externalFileType', sortable: false, width: '14vw' },
  { title: 'Extra ID', key: 'externalExtraId', sortable: false, width: '12vw' },
  { title: 'Points', key: 'points', sortable: false, width: '10vw' },
  { title: 'Commission', key: 'commissionPercent', sortable: false, width: '14vw' },
  { title: 'Amount USD', key: 'amountUsd', sortable: false, width: '14vw' },
  { title: 'Created At', key: 'creationDate', sortable: false, width: '18vw' },
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

const changePageNumber = async () => {
  await fetchCommissions()
}

const changePageSize = async () => {
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

const formatCell = (value: string | number | null | undefined) => {
  if (value === null || value === undefined || value === '') return 'unknown'

  return value
}

const refreshData = async () => {
  await fetchCommissions()
}
</script>

<style scoped>
.set-height-table {
  max-height: 70vh;
}
.th-min-width {
  min-width: 130px;
}
.select-size-div {
  top: 18px;
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
