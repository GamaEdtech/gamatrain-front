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
      item-label="Comments"
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
      <admin-schools-comments-modal-search
        :data="searchFilter"
        :loading="loading"
        @search="startSearch"
      />
    </admin-common-modal>

    <admin-common-modal
      v-if="showDetailModal"
      v-model:show-dialog="showDetailModal"
      title="Detail"
      :max-width="650"
    >
      <admin-schools-comments-modal-detail
        :contribution-id="selectedItemIdForDetail"
        @change-status-successfull="changeStatusSuccessfull"
      />
    </admin-common-modal>
  </div>
</template>

<script setup lang="ts">
import type {
  AdminSchoolCommentDTO,
  AdminSchoolCommentStatus,
  DataTableHeader,
  SearchFilterAdminSchoolComment,
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
} = useSchoolCommentAdmin()

const headers: DataTableHeader<AdminSchoolCommentDTO>[] = [
  { title: 'ID', key: 'id', sortable: false, width: '8vw', align: 'start' },
  { title: 'Contributor', key: 'creationUser', sortable: false, width: '24vw', emptyText: 'unknown' },
  { title: 'Date', key: 'creationDate', sortable: false, width: '24vw', type: 'date', dateFormat: 'DD/MM/YYYY HH:mm:ss' },
  {
    title: 'Status',
    key: 'status',
    sortable: false,
    width: '16vw',
    type: 'chip',
    getText: (item: AdminSchoolCommentDTO) => getStatusTitle(item.status),
    getChipColor: (item: AdminSchoolCommentDTO) => getStatusColor(item.status),
  },
  {
    title: 'Action',
    key: 'Action',
    sortable: false,
    width: '28vw',
    type: 'actions',
    actions: [
      { icon: 'md:plagiarism', tooltip: 'Details', onClick: (item: AdminSchoolCommentDTO) => openDetailModal(item) },
      { icon: 'md:arrow_circle_right', tooltip: 'School Page', to: (item: AdminSchoolCommentDTO) => `/school/${item.schoolId}`, target: '_blank' },
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

const searchFilter = reactive<SearchFilterAdminSchoolComment>({
  startDate: '',
  endDate: '',
  commenterEmail: '',
  commenterName: '',
  status: '',
})

const showSearchModal = ref(false)
const showDetailModal = ref(false)
const selectedItemIdForDetail = ref('')

const fetchComments = async () => {
  await getData({
    page: page.value,
    pageSize: pageSize.value,
    ...searchFilter,
  })
}

const changePageNumber = async (pageNumber: number) => {
  page.value = pageNumber
  await fetchComments()
}

const changePageSize = async (newPageSize: number) => {
  pageSize.value = newPageSize
  page.value = 1
  await fetchComments()
}

onMounted(async () => {
  await fetchComments()
})

const startSearch = async (item: SearchFilterAdminSchoolComment) => {
  searchFilter.startDate = item.startDate
  searchFilter.endDate = item.endDate
  searchFilter.commenterEmail = item.commenterEmail
  searchFilter.commenterName = item.commenterName
  searchFilter.status = item.status
  page.value = 1
  showSearchModal.value = false
  await fetchComments()
}

const isShowClearFilter = computed(() => {
  return searchFilter.startDate.length > 0
    || searchFilter.endDate.length > 0
    || searchFilter.commenterEmail.length > 0
    || searchFilter.commenterName.length > 0
    || searchFilter.status.length > 0
})

const clearFilter = async () => {
  searchFilter.startDate = ''
  searchFilter.endDate = ''
  searchFilter.commenterEmail = ''
  searchFilter.commenterName = ''
  searchFilter.status = ''
  page.value = 1
  await fetchComments()
}

const openDetailModal = (item: AdminSchoolCommentDTO) => {
  selectedItemIdForDetail.value = item.id.toString()
  showDetailModal.value = true
}

const changeStatusSuccessfull = async () => {
  selectedItemIdForDetail.value = ''
  showDetailModal.value = false
  page.value = 1
  await fetchComments()
}

const refreshData = async () => {
  await fetchComments()
}

const getStatusTitle = (status: AdminSchoolCommentStatus) => {
  if (status === 'Review') return 'Pending'

  return status
}

const getStatusColor = (status: AdminSchoolCommentStatus) => {
  if (status === 'Confirmed') return 'success'
  if (status === 'Draft') return 'info'
  if (status === 'Review') return 'warning'

  return 'error'
}
</script>
