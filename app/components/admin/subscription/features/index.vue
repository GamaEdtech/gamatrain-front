<template>
  <div class="w-100 h-100 d-flex flex-column align-start justify-start">
    <div class="w-100 d-flex align-center justify-space-between ga-2 mt-4">
      <v-btn
        rounded="pill"
        color="primary"
        flat
        variant="outlined"
        height="40"
        @click="showAddModal = true"
      >
        <span class="text-primary font-weight-bold text-h5">Add Feature</span>
      </v-btn>
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
      item-label="Features"
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
      v-model:show-dialog="showAddModal"
      title="Add"
    >
      <admin-subscription-features-add @add-item-success-full="addItemSuccessFull" />
    </admin-common-modal>

    <admin-common-modal
      v-if="showDetailModal && selectedItemForDetail"
      v-model:show-dialog="showDetailModal"
      title="Edit"
    >
      <admin-subscription-features-detail
        :item="selectedItemForDetail"
        @edit-item-success-full="editItemSuccessFull"
      />
    </admin-common-modal>
  </div>
</template>

<script setup lang="ts">
import type { AdminSubscriptionFeatureDTO, DataTableHeader } from '@/types'

const {
  loadingGetData: loading,
  data: list,
  getData,
  totalCount,
  pageCount,
  deleteItem,
  loadingDeleteItem,
} = useSubscriptionFeatureAdmin()

const headers: DataTableHeader<AdminSubscriptionFeatureDTO>[] = [
  { title: 'ID', key: 'id', sortable: false, width: '8vw', align: 'start' },
  { title: 'Code', key: 'code', sortable: false, width: '18vw' },
  { title: 'Name', key: 'name', sortable: false, width: '22vw' },
  { title: 'Description', key: 'description', sortable: false, width: '30vw' },
  {
    title: 'Status',
    key: 'isActive',
    sortable: false,
    width: '10vw',
    type: 'chip',
    getText: (item: AdminSubscriptionFeatureDTO) => item.isActive ? 'Active' : 'Inactive',
    getChipColor: (item: AdminSubscriptionFeatureDTO) => item.isActive ? 'success' : 'error',
  },
  {
    title: 'Action',
    key: 'Action',
    sortable: false,
    width: '12vw',
    type: 'actions',
    actions: [
      { icon: 'md:delete', tooltip: 'delete', onClick: (item: AdminSubscriptionFeatureDTO) => openDeleteModal(item) },
      { icon: 'md:settings', tooltip: 'Detail', onClick: (item: AdminSubscriptionFeatureDTO) => openDetailModal(item) },
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

const showDeleteModal = ref(false)
const selectedItemIdForDelete = ref('')
const showAddModal = ref(false)
const showDetailModal = ref(false)
const selectedItemForDetail = ref<AdminSubscriptionFeatureDTO | null>(null)

const fetchFeatures = async () => {
  await getData({
    page: page.value,
    pageSize: pageSize.value,
  })
}

const changePageNumber = async (pageNumber: number) => {
  page.value = pageNumber
  await fetchFeatures()
}

const changePageSize = async (newPageSize: number) => {
  pageSize.value = newPageSize
  page.value = 1
  await fetchFeatures()
}

onMounted(async () => {
  await fetchFeatures()
})

const addItemSuccessFull = async () => {
  showAddModal.value = false
  await fetchFeatures()
}

const openDeleteModal = (item: AdminSubscriptionFeatureDTO) => {
  selectedItemIdForDelete.value = item.id.toString()
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  await deleteItem(selectedItemIdForDelete.value)
  selectedItemIdForDelete.value = ''
  showDeleteModal.value = false
  await fetchFeatures()
}

const openDetailModal = (item: AdminSubscriptionFeatureDTO) => {
  selectedItemForDetail.value = item
  showDetailModal.value = true
}

const editItemSuccessFull = async () => {
  showDetailModal.value = false
  selectedItemForDetail.value = null
  await fetchFeatures()
}

const refreshData = async () => {
  await fetchFeatures()
}
</script>
