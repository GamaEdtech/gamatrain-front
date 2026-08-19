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

    <div
      v-else
      class="w-100 mt-4"
    >
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
              :class="`bg-grey100 text-grey700 text-h5 font-weight-medium pa-2 text-center
               ${index == 0 ? `text-start` : `th-min-width`}`"
            >
              {{ column.title }}
            </th>
          </tr>
        </template>

        <template #[`item.id`]="{ item }">
          <div class="text-grey700 text-h6 d-flex justify-start align-center font-weight-bold">
            {{ item.id }}
          </div>
        </template>

        <template #[`item.downloaderUserId`]="{ item }">
          <div class="table-text">
            {{ formatCell(item.downloaderUserId) }}
          </div>
        </template>

        <template #[`item.reason`]="{ item }">
          <div class="w-100 d-flex justify-center align-center">
            <v-chip
              color="info"
              class="font-weight-bold text-h6"
            >
              {{ item.reason }}
            </v-chip>
          </div>
        </template>

        <template #[`item.source`]="{ item }">
          <div class="table-text">
            {{ formatCell(item.source) }}
          </div>
        </template>

        <template #[`item.contentType`]="{ item }">
          <div class="w-100 d-flex justify-center align-center">
            <v-chip
              color="primary"
              class="font-weight-bold text-h6"
            >
              {{ item.contentType }}
            </v-chip>
          </div>
        </template>

        <template #[`item.externalContentId`]="{ item }">
          <div class="table-text">
            {{ formatCell(item.externalContentId) }}
          </div>
        </template>

        <template #[`item.externalFileType`]="{ item }">
          <div class="table-text">
            {{ formatCell(item.externalFileType) }}
          </div>
        </template>

        <template #[`item.externalExtraId`]="{ item }">
          <div class="table-text">
            {{ formatCell(item.externalExtraId) }}
          </div>
        </template>

        <template #[`item.points`]="{ item }">
          <div class="table-text">
            {{ $numberFormat(item.points) }}
          </div>
        </template>

        <template #[`item.commissionPercent`]="{ item }">
          <div class="table-text">
            {{ $numberFormat(item.commissionPercent) }}%
          </div>
        </template>

        <template #[`item.amountUsd`]="{ item }">
          <div class="table-text">
            ${{ $numberFormat(item.amountUsd) }}
          </div>
        </template>

        <template #[`item.creationDate`]="{ item }">
          <div class="text-grey500 text-h6 d-flex justify-center align-center font-weight-regular ga-1">
            <v-icon
              size="18"
              color="grey300"
            >
              md:history
            </v-icon>
            {{ formatLocal(item.creationDate, 'DD/MM/YYYY HH:mm') }}
          </div>
        </template>
      </v-data-table>
    </div>

    <div class="w-100 d-flex mt-2 position-relative">
      <div class="w-100 d-flex justify-center mt-4">
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
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['showChart'])
const { formatLocal } = useDateTime()
const { $numberFormat } = useNuxtApp()
const {
  loadingGetData: loading,
  data: list,
  getData,
  pageCount,
} = useCommission()

const headers = [
  { title: 'ID', key: 'id', sortable: false, width: '8vw' },
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

const fetchCommissions = async () => {
  await getData({
    page: page.value,
    pageSize: pageSize.value,
    startDate: '',
    endDate: '',
  })
}

const changePageNumber = async () => {
  await fetchCommissions()
}

const formatCell = (value: string | number | null | undefined) => {
  if (value === null || value === undefined || value === '') return 'unknown'

  return value
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
.set-height-table {
  max-height: 70vh;
}
.th-min-width {
  min-width: 130px;
}
.table-text {
  color: rgb(var(--v-theme-grey700));
  font-size: 1.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  text-align: center;
}
:deep(.custom-pagination li button:hover) {
  background-color: rgb(var(--v-theme-primary));
  opacity: 0.6;
}
:deep(.custom-pagination .v-pagination__item--is-active button) {
  background: rgb(var(--v-theme-primary)) !important;
}
:deep(.custom-pagination .v-pagination__item--is-active .v-btn__overlay) {
  opacity: 0 !important;
}
</style>
