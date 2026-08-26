<template>
  <div class="w-100 h-100 d-flex flex-column align-start justify-start">
    <div class="w-100 d-flex justify-space-between align-center">
      <div class="d-flex align-center justify-start position-relative flex-wrap ga-2">
        <div class="btn-filter-container d-none d-md-flex align-center justify-center ga-1 bg-grey100 pa-1 rounded-pill">
          <v-btn
            v-for="status in SCHOOL_IMAGE_STATUS_FILTER_LIST"
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
            :items="SCHOOL_IMAGE_STATUS_FILTER_LIST"
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
      item-label="Images"
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

    <admin-common-delete-modal
      v-model="showDeleteModal"
      :loading="loadingDeleteItem"
      @confirm="confirmDelete"
    />

    <admin-common-modal
      v-if="showDetailModal"
      v-model:show-dialog="showDetailModal"
      title="Detail"
      :max-width="600"
    >
      <admin-schools-images-modals-detail
        :contribution-id="selectedItemIdForDetail"
        @change-status-successfull="changeStatusSuccessfull"
      />
    </admin-common-modal>
  </div>
</template>

<script setup lang="ts">
import { SCHOOL_IMAGE_STATUS_FILTER_LIST } from '@/constants'
import type {
  AdminSchoolImageDTO,
  AdminSchoolImageStatus,
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
  deleteItem,
  loadingDeleteItem,
} = useSchoolImageAdmin()

const headers: DataTableHeader<AdminSchoolImageDTO>[] = [
  { title: 'ID', key: 'id', sortable: false, width: '8vw', align: 'start' },
  { title: 'Contributor', key: 'creationUser', sortable: false, width: '20vw', emptyText: 'unknown' },
  { title: 'Date', key: 'creationDate', sortable: false, width: '20vw', type: 'date', dateFormat: 'DD/MM/YYYY HH:mm:ss' },
  {
    title: 'Is Default',
    key: 'isDefault',
    sortable: false,
    width: '12vw',
    type: 'chip',
    getText: (item: AdminSchoolImageDTO) => item.isDefault ? 'True' : 'False',
    getChipColor: (item: AdminSchoolImageDTO) => item.isDefault ? 'success' : 'error',
  },
  {
    title: 'Status',
    key: 'status',
    sortable: false,
    width: '15vw',
    type: 'chip',
    getText: (item: AdminSchoolImageDTO) => getStatusTitle(item.status),
    getChipColor: (item: AdminSchoolImageDTO) => getStatusColor(item.status),
  },
  {
    title: 'Action',
    key: 'Action',
    sortable: false,
    width: '25vw',
    type: 'actions',
    actions: [
      { icon: 'md:plagiarism', tooltip: 'Details', onClick: (item: AdminSchoolImageDTO) => openDetailModal(item) },
      { icon: 'md:arrow_circle_right', tooltip: 'School Page', to: (item: AdminSchoolImageDTO) => `/school/${item.schoolId}`, target: '_blank' },
      { icon: 'md:delete', tooltip: 'Delete', onClick: (item: AdminSchoolImageDTO) => openDeleteModal(item) },
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

const statusSelect = ref<AdminSchoolImageStatus | ''>('')
const showDetailModal = ref(false)
const selectedItemIdForDetail = ref('')
const showDeleteModal = ref(false)
const selectedItemForDelete = ref<AdminSchoolImageDTO | null>(null)

const fetchImages = async () => {
  await getData({
    page: page.value,
    pageSize: pageSize.value,
    status: statusSelect.value,
  })
}

const changeFilterStatus = async (status: string | number) => {
  statusSelect.value = status as AdminSchoolImageStatus | ''
  page.value = 1
  await fetchImages()
}

const changePageNumber = async (pageNumber: number) => {
  page.value = pageNumber
  await fetchImages()
}

const changePageSize = async (newPageSize: number) => {
  pageSize.value = newPageSize
  page.value = 1
  await fetchImages()
}

onMounted(async () => {
  await fetchImages()
})

const openDetailModal = (item: AdminSchoolImageDTO) => {
  selectedItemIdForDetail.value = item.id.toString()
  showDetailModal.value = true
}

const openDeleteModal = (item: AdminSchoolImageDTO) => {
  selectedItemForDelete.value = item
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!selectedItemForDelete.value) return

  await deleteItem(selectedItemForDelete.value.schoolId, selectedItemForDelete.value.id)
  selectedItemForDelete.value = null
  showDeleteModal.value = false
  await fetchImages()
}

const changeStatusSuccessfull = async () => {
  selectedItemIdForDetail.value = ''
  showDetailModal.value = false
  page.value = 1
  await fetchImages()
}

const refreshData = async () => {
  await fetchImages()
}

const getStatusTitle = (status: AdminSchoolImageStatus) => {
  if (status === 'Review') return 'Pending'

  return status
}

const getStatusColor = (status: AdminSchoolImageStatus) => {
  if (status === 'Confirmed') return 'success'
  if (status === 'Draft') return 'info'
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
