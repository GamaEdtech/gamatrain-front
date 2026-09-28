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
        <span class="text-primary font-weight-bold text-h5">Add Plan</span>
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
      item-label="Plans"
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
      <admin-subscription-plans-add @add-item-success-full="addItemSuccessFull" />
    </admin-common-modal>

    <admin-common-modal
      v-if="showDetailModal"
      v-model:show-dialog="showDetailModal"
      title="Edit"
    >
      <admin-subscription-plans-detail
        :id="selectedItemIdForDetail"
        @edit-item-success-full="editItemSuccessFull"
      />
    </admin-common-modal>

    <admin-common-modal
      v-if="showFeaturesModal && selectedPlanForFeatures"
      v-model:show-dialog="showFeaturesModal"
      title="Features"
    >
      <admin-subscription-plans-features
        :plan="selectedPlanForFeatures"
        @features-success-full="featuresSuccessFull"
      />
    </admin-common-modal>
  </div>
</template>

<script setup lang="ts">
import type { AdminSubscriptionPlanDTO, DataTableHeader } from '@/types'

const {
  loadingGetData: loading,
  data: list,
  getData,
  totalCount,
  pageCount,
  deleteItem,
  loadingDeleteItem,
} = useSubscriptionPlanAdmin()

const headers: DataTableHeader<AdminSubscriptionPlanDTO>[] = [
  { title: 'ID', key: 'id', sortable: false, width: '8vw', align: 'start' },
  { title: 'Title', key: 'title', sortable: false, width: '22vw' },
  {
    title: 'Status',
    key: 'isActive',
    sortable: false,
    width: '12vw',
    type: 'chip',
    getText: (item: AdminSubscriptionPlanDTO) => item.isActive ? 'Active' : 'Inactive',
    getChipColor: (item: AdminSubscriptionPlanDTO) => item.isActive ? 'success' : 'error',
  },
  {
    title: 'Highlight',
    key: 'highlight',
    sortable: false,
    width: '12vw',
    type: 'chip',
    getText: (item: AdminSubscriptionPlanDTO) => item.highlight ? 'Highlighted' : 'Normal',
    getChipColor: (item: AdminSubscriptionPlanDTO) => item.highlight ? 'success' : 'grey400',
  },
  { title: 'Prices', key: 'prices', sortable: false, width: '24vw', getText: (item: AdminSubscriptionPlanDTO) => item.prices?.length ?? 0 },
  { title: 'Features', key: 'featureGroups', sortable: false, width: '10vw', getText: (item: AdminSubscriptionPlanDTO) => item.featureGroups.length },
  {
    title: 'Action',
    key: 'Action',
    sortable: false,
    width: '12vw',
    type: 'actions',
    actions: [
      { icon: 'md:extension', tooltip: 'Manage Features', onClick: (item: AdminSubscriptionPlanDTO) => openFeaturesModal(item) },
      { icon: 'md:delete', tooltip: 'delete', onClick: (item: AdminSubscriptionPlanDTO) => openDeleteModal(item) },
      { icon: 'md:settings', tooltip: 'Detail', onClick: (item: AdminSubscriptionPlanDTO) => openDetailModal(item) },
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
const selectedItemIdForDetail = ref('')
const showFeaturesModal = ref(false)
const selectedPlanForFeatures = ref<AdminSubscriptionPlanDTO | null>(null)

const fetchPlans = async () => {
  await getData({
    page: page.value,
    pageSize: pageSize.value,
  })
}

const changePageNumber = async (pageNumber: number) => {
  page.value = pageNumber
  await fetchPlans()
}

const changePageSize = async (newPageSize: number) => {
  pageSize.value = newPageSize
  page.value = 1
  await fetchPlans()
}

onMounted(async () => {
  await fetchPlans()
})

const addItemSuccessFull = async () => {
  showAddModal.value = false
  await fetchPlans()
}

const openDeleteModal = (item: AdminSubscriptionPlanDTO) => {
  selectedItemIdForDelete.value = item.id.toString()
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  await deleteItem(selectedItemIdForDelete.value)
  selectedItemIdForDelete.value = ''
  showDeleteModal.value = false
  await fetchPlans()
}

const openDetailModal = (item: AdminSubscriptionPlanDTO) => {
  selectedItemIdForDetail.value = item.id.toString()
  showDetailModal.value = true
}

const editItemSuccessFull = async () => {
  showDetailModal.value = false
  await fetchPlans()
}

const openFeaturesModal = (item: AdminSubscriptionPlanDTO) => {
  selectedPlanForFeatures.value = item
  showFeaturesModal.value = true
}

const featuresSuccessFull = async () => {
  showFeaturesModal.value = false
  selectedPlanForFeatures.value = null
  await fetchPlans()
}

const refreshData = async () => {
  await fetchPlans()
}
</script>
