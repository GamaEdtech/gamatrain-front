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
  { title: '#', key: 'rowIndex', sortable: false, width: '4vw', type: 'index' },
  {
    title: 'Reason',
    key: 'reason',
    sortable: false,
    width: '16vw',
    type: 'chip',
    getChipColor: () => 'info',
  },
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
  {
    title: 'Action',
    key: 'Action',
    sortable: false,
    width: '12vw',
    type: 'actions',
    actions: [
      {
        icon: 'md:arrow_circle_right',
        tooltip: 'Content Page',
        to: (item: UserCommissionDTO) => createLink(item),
        target: '_blank',
        disabled: (item: UserCommissionDTO) => !createLink(item),
      },
    ],
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

const createLink = (item: UserCommissionDTO) => {
  if (!item.externalContentId) return undefined

  switch (item.contentType) {
    case 'PastPaper':
    case 'Test':
      return `/paper/${item.externalContentId}`
    case 'Exam':
      return `/exam/${item.externalContentId}`
    case 'Multimedia':
      return `/multimedia/${item.externalContentId}`
    default:
      return undefined
  }
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
