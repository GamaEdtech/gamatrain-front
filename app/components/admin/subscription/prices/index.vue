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
        <span class="text-primary font-weight-bold text-h5">Add Price</span>
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
      item-label="Prices"
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

      <template #[`item.price`]="{ item }">
        <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center ga-1">
          <div
            class="container-symbol"
            v-html="item.currencySymbol"
          /> {{ item.price }}
        </div>
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
      <admin-subscription-prices-add @add-item-success-full="addItemSuccessFull" />
    </admin-common-modal>

    <admin-common-modal
      v-if="showDetailModal && selectedItemForDetail"
      v-model:show-dialog="showDetailModal"
      title="Edit"
    >
      <admin-subscription-prices-detail
        :item="selectedItemForDetail"
        @edit-item-success-full="editItemSuccessFull"
      />
    </admin-common-modal>
  </div>
</template>

<script setup lang="ts">
import type { AdminSubscriptionPriceDTO, DataTableHeader } from '@/types'

const {
  loadingGetData: loading,
  data: list,
  getData,
  totalCount,
  pageCount,
  deleteItem,
  loadingDeleteItem,
} = useSubscriptionPriceAdmin()

const headers: DataTableHeader<AdminSubscriptionPriceDTO>[] = [
  { title: 'ID', key: 'id', sortable: false, width: '8vw', align: 'start' },
  { title: 'Plan ID', key: 'subscriptionPlanId', sortable: false, width: '18vw' },
  { title: 'Country', key: 'countryCode', sortable: false, width: '16vw', emptyText: 'Worldwide' },
  { title: 'Currency', key: 'currency', sortable: false, width: '16vw', type: 'chip', getChipColor: () => 'info' },
  { title: 'Billing', key: 'billingInterval', sortable: false, width: '16vw', type: 'chip', getChipColor: () => 'info' },
  { title: 'Price', key: 'price', sortable: false, width: '18vw' },
  {
    title: 'Action',
    key: 'Action',
    sortable: false,
    width: '20vw',
    type: 'actions',
    actions: [
      { icon: 'md:delete', tooltip: 'delete', onClick: (item: AdminSubscriptionPriceDTO) => openDeleteModal(item) },
      { icon: 'md:settings', tooltip: 'Detail', onClick: (item: AdminSubscriptionPriceDTO) => openDetailModal(item) },
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
const selectedItemForDetail = ref<AdminSubscriptionPriceDTO | null>(null)

const fetchPrices = async () => {
  await getData({
    page: page.value,
    pageSize: pageSize.value,
  })
}

const changePageNumber = async (pageNumber: number) => {
  page.value = pageNumber
  await fetchPrices()
}

const changePageSize = async (newPageSize: number) => {
  pageSize.value = newPageSize
  page.value = 1
  await fetchPrices()
}

onMounted(async () => {
  await fetchPrices()
})

const addItemSuccessFull = async () => {
  showAddModal.value = false
  await fetchPrices()
}

const openDeleteModal = (item: AdminSubscriptionPriceDTO) => {
  selectedItemIdForDelete.value = item.id.toString()
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  await deleteItem(selectedItemIdForDelete.value)
  selectedItemIdForDelete.value = ''
  showDeleteModal.value = false
  await fetchPrices()
}

const openDetailModal = (item: AdminSubscriptionPriceDTO) => {
  selectedItemForDetail.value = item
  showDetailModal.value = true
}

const editItemSuccessFull = async () => {
  showDetailModal.value = false
  selectedItemForDetail.value = null
  await fetchPrices()
}

const refreshData = async () => {
  await fetchPrices()
}
</script>

<style scoped>
.container-symbol{
  width : 20px;
  height: 20px;
}
</style>
