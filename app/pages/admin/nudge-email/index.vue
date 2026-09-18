<template>
  <div class="w-100 h-100 d-flex flex-column align-start justify-start">
    <div class="w-100 d-flex align-center justify-start ga-2 mt-4">
      <v-btn
        rounded="pill"
        color="primary"
        flat
        variant="outlined"
        height="40"
        @click="showAddModal = true"
      >
        <span class="text-primary font-weight-bold text-h5">Add Nudge</span>
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
      item-label="Nudges"
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
      :max-width="600"
    >
      <admin-nudge-email-modal-add @add-item-success-full="addItemSuccessFull" />
    </admin-common-modal>

    <admin-common-modal
      v-model:show-dialog="showDetailModal"
      title="Edit"
      :max-width="600"
    >
      <admin-nudge-email-modal-detail
        :id="selectedItemIdForDetail"
        @edit-item-success-full="editItemSuccessFull"
      />
    </admin-common-modal>
  </div>
</template>

<script setup lang="ts">
import type { DataTableHeader, AdminNudgeTemplateDTO } from '@/types'

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
} = useNudgeAdmin()

const headers: DataTableHeader<AdminNudgeTemplateDTO>[] = [
  { title: 'ID', key: 'id', sortable: false, width: '10vw' },
  {
    title: 'Nudge Type',
    key: 'nudgeType',
    sortable: false,
    width: '20vw',
    type: 'chip',
    getChipColor: () => 'info',
  },
  { title: 'Subject', key: 'subject', sortable: false, width: '20vw' },
  { title: 'CTA Label', key: 'ctaLabel', sortable: false, width: '10vw' },
  { title: 'CTA URL', key: 'ctaUrl', sortable: false, width: '10vw' },
  {
    title: 'Status',
    key: 'isActive',
    sortable: false,
    width: '20vw',
    type: 'chip',
    getChipColor: (item: AdminNudgeTemplateDTO) => item.isActive ? 'success' : 'lightError',
    getText: (item: AdminNudgeTemplateDTO) => item.isActive ? 'Acitve' : 'Inactive',
  },
  {
    title: 'Action',
    key: 'Action',
    sortable: false,
    width: '10vw',
    type: 'actions',
    actions: [
      {
        icon: 'md:delete',
        tooltip: 'delete',
        onClick: (item: AdminNudgeTemplateDTO) => openModalDelete(item),
      },
      {
        icon: 'md:settings',
        tooltip: 'Detail',
        onClick: (item: AdminNudgeTemplateDTO) => openDetailModal(item),
      },
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

const fetchData = async () => {
  await getData({
    page: page.value,
    pageSize: pageSize.value,
  })
}

const changePageNumber = async (pageNumber: number) => {
  page.value = pageNumber
  await fetchData()
}

const changePageSize = async (newPageSize: number) => {
  pageSize.value = newPageSize
  page.value = 1
  await fetchData()
}

onMounted(async () => {
  await fetchData()
})

const addItemSuccessFull = async () => {
  showAddModal.value = false
  await fetchData()
}

const openModalDelete = (item: AdminNudgeTemplateDTO) => {
  selectedItemIdForDelete.value = item.id.toString()
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  await deleteItem(selectedItemIdForDelete.value)
  selectedItemIdForDelete.value = ''
  showDeleteModal.value = false
  await fetchData()
}

const openDetailModal = (item: AdminNudgeTemplateDTO) => {
  selectedItemIdForDetail.value = item.id.toString()
  showDetailModal.value = true
}

const editItemSuccessFull = async () => {
  showDetailModal.value = false
  await fetchData()
}

const refreshData = async () => {
  await fetchData()
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
