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
        <span class="text-primary font-weight-bold text-h5">Add Gateway</span>
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
      item-label="Gateway"
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
      <admin-subscription-gateway-mappings-add @add-item-success-full="addItemSuccessFull" />
    </admin-common-modal>

    <admin-common-modal
      v-if="showDetailModal && selectedItemForDetail"
      v-model:show-dialog="showDetailModal"
      title="Edit"
    >
      <admin-subscription-gateway-mappings-detail
        :item="selectedItemForDetail"
        @edit-item-success-full="editItemSuccessFull"
      />
    </admin-common-modal>
  </div>
</template>

<script setup lang="ts">
import type { AdminSubscriptionGatewayMappingDTO, DataTableHeader } from '@/types'

const {
  loadingGetData: loading,
  data: list,
  getData,
  totalCount,
  pageCount,
  deleteItem,
  loadingDeleteItem,
} = useSubscriptionGatewayMappingAdmin()

const headers: DataTableHeader<AdminSubscriptionGatewayMappingDTO>[] = [
  { title: 'ID', key: 'id', sortable: false, width: '8vw', align: 'start' },
  { title: 'Price ID', key: 'subscriptionPlanPriceId', sortable: false, width: '14vw' },
  { title: 'Gateway', key: 'gateway', sortable: false, width: '16vw', type: 'chip', getChipColor: () => 'info' },
  { title: 'External Product ID', key: 'externalProductId', sortable: false, width: '24vw' },
  { title: 'External Plan ID', key: 'externalPlanId', sortable: false, width: '24vw' },
  {
    title: 'Action',
    key: 'Action',
    sortable: false,
    width: '14vw',
    type: 'actions',
    actions: [
      { icon: 'md:delete', tooltip: 'delete', onClick: (item: AdminSubscriptionGatewayMappingDTO) => openDeleteModal(item) },
      { icon: 'md:settings', tooltip: 'Detail', onClick: (item: AdminSubscriptionGatewayMappingDTO) => openDetailModal(item) },
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
const selectedItemForDetail = ref<AdminSubscriptionGatewayMappingDTO | null>(null)

const fetchGatewayMappings = async () => {
  await getData({
    page: page.value,
    pageSize: pageSize.value,
  })
}

const changePageNumber = async (pageNumber: number) => {
  page.value = pageNumber
  await fetchGatewayMappings()
}

const changePageSize = async (newPageSize: number) => {
  pageSize.value = newPageSize
  page.value = 1
  await fetchGatewayMappings()
}

onMounted(async () => {
  await fetchGatewayMappings()
})

const addItemSuccessFull = async () => {
  showAddModal.value = false
  await fetchGatewayMappings()
}

const openDeleteModal = (item: AdminSubscriptionGatewayMappingDTO) => {
  selectedItemIdForDelete.value = item.id.toString()
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  await deleteItem(selectedItemIdForDelete.value)
  selectedItemIdForDelete.value = ''
  showDeleteModal.value = false
  await fetchGatewayMappings()
}

const openDetailModal = (item: AdminSubscriptionGatewayMappingDTO) => {
  selectedItemForDetail.value = item
  showDetailModal.value = true
}

const editItemSuccessFull = async () => {
  showDetailModal.value = false
  selectedItemForDetail.value = null
  await fetchGatewayMappings()
}

const refreshData = async () => {
  await fetchGatewayMappings()
}
</script>
