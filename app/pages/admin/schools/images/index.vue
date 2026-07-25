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

      <div class="d-flex align-center justify-end ga-2 flex-wrap">
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
        <span class="text-grey400 text-no-wrap text-h5 font-weight-semibold">
          <span class="text-grey500 font-weight-bold mr-1">
            {{ totalCount }}
          </span>
          Images
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
          <div class="text-grey600 text-h5 d-flex justify-start align-center font-weight-bold">
            {{ item.id }}
          </div>
        </template>

        <template #[`item.creationUser`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center">
            {{ item.creationUser || 'unknown' }}
          </div>
        </template>

        <template #[`item.creationDate`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center">
            {{ formatLocal(item.creationDate, 'DD/MM/YYYY HH:mm:ss') }}
          </div>
        </template>

        <template #[`item.isDefault`]="{ item }">
          <div class="w-100 d-flex justify-center align-center">
            <v-chip
              :color="item.isDefault ? `success` : `error`"
              class="font-weight-bold text-h5"
            >
              {{ item.isDefault ? 'True' : 'False' }}
            </v-chip>
          </div>
        </template>

        <template #[`item.status`]="{ item }">
          <div class="w-100 d-flex justify-center align-center">
            <v-chip
              :color="getStatusColor(item.status)"
              class="font-weight-bold text-h5"
            >
              {{ getStatusTitle(item.status) }}
            </v-chip>
          </div>
        </template>

        <template #[`item.Action`]="{ item }">
          <div class="d-flex justify-center align-center">
            <v-btn
              icon
              flat
              @click="openDetailModal(item)"
            >
              <v-icon
                size="20"
                color="grey800"
              >
                md:plagiarism
              </v-icon>
              <v-tooltip
                activator="parent"
                location="top"
              >
                Details
              </v-tooltip>
            </v-btn>

            <v-btn
              icon
              flat
              :to="`/school/${item.schoolId}`"
              target="_blank"
            >
              <v-icon
                size="20"
                color="grey800"
              >
                md:arrow_circle_right
              </v-icon>
              <v-tooltip
                activator="parent"
                location="top"
              >
                School Page
              </v-tooltip>
            </v-btn>

            <v-btn
              icon
              flat
              @click="openDeleteModal(item)"
            >
              <v-icon
                size="20"
                color="grey800"
              >
                md:delete
              </v-icon>
              <v-tooltip
                activator="parent"
                location="top"
              >
                Delete
              </v-tooltip>
            </v-btn>
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
  deleteItem,
  loadingDeleteItem,
} = useSchoolImageAdmin()

const headers = [
  { title: 'ID', key: 'id', sortable: false, width: '8vw' },
  { title: 'Contributor', key: 'creationUser', sortable: false, width: '20vw' },
  { title: 'Date', key: 'creationDate', sortable: false, width: '20vw' },
  { title: 'Is Default', key: 'isDefault', sortable: false, width: '12vw' },
  { title: 'Status', key: 'status', sortable: false, width: '15vw' },
  { title: 'Action', key: 'Action', sortable: false, width: '25vw' },
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

const changePageNumber = async () => {
  await fetchImages()
}

const changePageSize = async () => {
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
.set-height-table {
  max-height: 70vh;
}
.th-min-width {
  min-width: 130px;
}
.select-size-div {
  top: 18px;
}
.btn-filter-container{
  min-height : 48px;
}
.filter-mobile-container{
  width: 170px;
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
