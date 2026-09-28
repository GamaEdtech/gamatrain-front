<template>
  <div class="w-100 h-100 d-flex flex-column align-start justify-start">
    <div class="w-100 d-flex justify-space-between align-center">
      <div class="d-flex align-center justify-start position-relative flex-wrap ga-2">
        <div class="btn-filter-container d-none d-md-flex align-center justify-center ga-1 bg-grey100 pa-1 rounded-pill">
          <v-btn
            v-for="status in SCHOOL_ISSUE_STATUS_FILTER_LIST"
            :key="status.id"
            rounded="pill"
            :color="status.id === statusSelect ? `primary` : `transparent`"
            flat
            height="40"
            @click="changeFilterStatus(status.id)"
          >
            <span :class="`${status.id === statusSelect ? `text-grey900` : `text-grey500`} font-weight-bold text-h5`">
              {{ status.title }}
            </span>
          </v-btn>
        </div>

        <div class="filter-mobile-container d-flex d-md-none align-center justify-start">
          <common-gombo-box
            v-model="statusSelect"
            label="Status"
            :items="SCHOOL_ISSUE_STATUS_FILTER_LIST"
            @update:model-value="changeFilterStatus"
          />
        </div>
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
      item-label="School Issues"
      class="mt-4"
      @update:page="changePageNumber"
      @update:page-size="changePageSize"
    >
      <template #actions>
        <v-btn
          size="small"
          flat
          icon
          color="info"
          :loading="loading"
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
      v-if="showDetailModal && selectedIssue"
      v-model:show-dialog="showDetailModal"
      title="Detail"
      :max-width="600"
    >
      <admin-schools-issues-modals-detail
        :issue="selectedIssue"
        @change-status-successfull="changeStatusSuccessfull"
      />
    </admin-common-modal>
  </div>
</template>

<script setup lang="ts">
import { SCHOOL_ISSUE_STATUS_FILTER_LIST } from '@/constants'
import type {
  AdminSchoolIssueDTO,
  AdminSchoolIssueStatus,
  DataTableHeader,
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
} = useSchoolIssueAdmin()

const headers: DataTableHeader<AdminSchoolIssueDTO>[] = [
  { title: 'ID', key: 'id', sortable: false, width: '5vw', align: 'start' },
  { title: 'Reporter', key: 'creationUser', sortable: false, width: '15vw', emptyText: 'unknown' },
  { title: 'Date', key: 'creationDate', sortable: false, width: '15vw', type: 'date', dateFormat: 'DD/MM/YYYY HH:mm' },
  { title: 'Description', key: 'description', sortable: false, width: '25vw' },
  { title: 'School', key: 'schoolName', sortable: false, width: '15vw', emptyText: 'unknown' },
  {
    title: 'Status',
    key: 'status',
    sortable: false,
    width: '10vw',
    type: 'chip',
    getText: (item: AdminSchoolIssueDTO) => getStatusTitle(item.status),
    getChipColor: (item: AdminSchoolIssueDTO) => getStatusColor(item.status),
  },
  {
    title: 'Action',
    key: 'Action',
    sortable: false,
    width: '15vw',
    type: 'actions',
    actions: [
      { icon: 'md:plagiarism', tooltip: 'Details', onClick: (item: AdminSchoolIssueDTO) => openDetailModal(item) },
      { icon: 'md:arrow_circle_right', tooltip: 'School Page', to: (item: AdminSchoolIssueDTO) => `/school/${item.schoolId}`, target: '_blank' },
    ],
  },
]

const pageSize = ref(10)
const page = ref(1)
const allPageSize = [
  { label: '10 Rows', value: 10 },
  { label: '20 Rows', value: 20 },
  { label: '50 Rows', value: 50 },
]

const statusSelect = ref<AdminSchoolIssueStatus | ''>('')
const showDetailModal = ref(false)
const selectedIssue = ref<AdminSchoolIssueDTO | null>(null)

const fetchSchoolIssues = async () => {
  await getData({
    page: page.value,
    pageSize: pageSize.value,
    status: statusSelect.value,
  })
}

const changeFilterStatus = async (status: string | number) => {
  statusSelect.value = status as AdminSchoolIssueStatus | ''
  page.value = 1
  await fetchSchoolIssues()
}

const changePageNumber = async (pageNumber: number) => {
  page.value = pageNumber
  await fetchSchoolIssues()
}

const changePageSize = async (newPageSize: number) => {
  pageSize.value = newPageSize
  page.value = 1
  await fetchSchoolIssues()
}

onMounted(async () => {
  await fetchSchoolIssues()
})

const openDetailModal = (item: AdminSchoolIssueDTO) => {
  selectedIssue.value = item
  showDetailModal.value = true
}

const changeStatusSuccessfull = async () => {
  selectedIssue.value = null
  showDetailModal.value = false
  page.value = 1
  await fetchSchoolIssues()
}

const refreshData = async () => {
  await fetchSchoolIssues()
}

const getStatusTitle = (status: AdminSchoolIssueStatus) => {
  if (status === 'Review') return 'Pending'

  return status
}

const getStatusColor = (status: AdminSchoolIssueStatus) => {
  if (status === 'Confirmed') return 'success'
  if (status === 'Review') return 'warning'

  return 'error'
}
</script>

<style scoped>
.btn-filter-container{
  min-height : 48px;
}
.filter-mobile-container{
  width: 170px;
}
</style>
