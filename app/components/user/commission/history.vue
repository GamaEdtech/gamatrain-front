<template>
  <div class="w-100 h-100 d-flex flex-column align-start justify-start">
    <div class="w-100 d-flex flex-column justify-start align-start">
      <div class="w-100 d-flex justify-space-between align-center">
        <h1 class="text-h4 font-weight-bold text-grey700">
          Commission History
        </h1>

        <v-btn
          color="transparent"
          flat
          icon
          class="d-flex d-sm-none"
          @click="emit('showChart')"
        >
          <v-icon
            color="grey500"
            size="20"
          >
            md:show_chart
          </v-icon>
        </v-btn>
      </div>
    </div>

    <div
      v-if="loading"
      class="w-100 mt-4"
    >
      <user-commission-skeleton-table-desktop />
    </div>

    <common-data-table
      v-else
      sticky-header-offset="64px"
      :headers="headers"
      :items="list"
      :page="page"
      :page-size="pageSize"
      :page-count="pageCount"
      :total-count="totalCount"
      item-label="Records"
      :show-page-size-selector="false"
      class="mt-4"
      @update:page="changePageNumber"
    />
  </div>
</template>

<script setup lang="ts">
import type { DataTableHeader, UserCommissionDTO } from '@/types'

const emit = defineEmits(['showChart'])
const {
  loadingGetData: loading,
  data: list,
  getData,
  totalCount,
  pageCount,
} = useCommission()

const headers: DataTableHeader<UserCommissionDTO>[] = [
  { title: 'ID', key: 'id', sortable: false, width: '8vw', align: 'start' },
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
    dateFormat: 'DD/MM/YYYY HH:mm',
    icon: 'md:history',
  },
]

const pageSize = ref(10)
const page = ref(1)

const fetchCommissions = async () => {
  await getData({
    page: page.value,
    pageSize: pageSize.value,
    startDate: '',
    endDate: '',
  })
}

const changePageNumber = async (pageNumber: number) => {
  page.value = pageNumber
  await fetchCommissions()
}

onMounted(async () => {
  await fetchCommissions()
})
</script>

<style scoped>
.border-odd {
  border-top: 2px solid rgb(var(--v-theme-grey100));
  border-bottom: 2px solid rgb(var(--v-theme-grey100));
}
.line-specifier-load-more {
  width: 100%;
  height: 6px;
}
</style>
