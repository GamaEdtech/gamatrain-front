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
        <span class="text-primary font-weight-bold text-h5">Add Language</span>
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
      item-label="Languages"
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
      <admin-languages-modals-add @add-item-success-full="addItemSuccessFull" />
    </admin-common-modal>

    <admin-common-modal
      v-model:show-dialog="showDetailModal"
      title="Edit"
    >
      <admin-languages-modals-detail
        :id="selectedItemIdForDetail"
        @edit-item-success-full="editItemSuccessFull"
      />
    </admin-common-modal>
  </div>
</template>

<script setup lang="ts">
import type {
  AdminLanguageDTO,
  DataTableHeader,
} from '@/types'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

const { loadingGetData: loading, data: list, getData, totalCount, pageCount, deleteItem, loadingDeleteItem } = useLanguageAdmin()

const headers: DataTableHeader<AdminLanguageDTO>[] = [
  { title: 'ID', key: 'id', sortable: false, width: '10vw', align: 'start' },
  { title: 'Name', key: 'name', sortable: false, width: '15vw' },
  {
    title: 'Culture Code',
    key: 'code',
    sortable: false,
    width: '20vw',
  },
  { title: 'Icon', key: 'icon', sortable: false, width: '15vw' },
  {
    title: 'Is Enable',
    key: 'isEnable',
    sortable: false,
    width: '10vw',
    type: 'chip',
    getText: (item: AdminLanguageDTO) => item.isEnable ? 'Enable' : 'Disable',
    getChipColor: (item: AdminLanguageDTO) => item.isEnable ? 'success' : 'error',
  },
  {
    title: 'Is Default',
    key: 'isDefault',
    sortable: false,
    width: '10vw',
    type: 'chip',
    getText: (item: AdminLanguageDTO) => item.isDefault ? 'Default' : ' Non-default',
    getChipColor: (item: AdminLanguageDTO) => item.isDefault ? 'success' : 'error',
  },
  {
    title: 'Action',
    key: 'Action',
    sortable: false,
    width: '20vw',
    type: 'actions',
    actions: [
      { icon: 'md:delete', tooltip: 'delete', onClick: (item: AdminLanguageDTO) => openModalDelete(item) },
      { icon: 'md:settings', tooltip: 'Detail', onClick: (item: AdminLanguageDTO) => openDetailModal(item) },
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

const fetchLanguages = async () => {
  await getData({
    page: page.value,
    pageSize: pageSize.value,
  })
}

const changePageNumber = async (pageNumber: number) => {
  page.value = pageNumber
  await fetchLanguages()
}

const changePageSize = async (newPageSize: number) => {
  pageSize.value = newPageSize
  page.value = 1
  await fetchLanguages()
}

onMounted(async () => {
  await fetchLanguages()
})

const addItemSuccessFull = async () => {
  showAddModal.value = false
  await fetchLanguages()
}

const openModalDelete = (item: AdminLanguageDTO) => {
  selectedItemIdForDelete.value = item.id.toString()
  showDeleteModal.value = true
}
const confirmDelete = async () => {
  await deleteItem(selectedItemIdForDelete.value)
  selectedItemIdForDelete.value = ''
  showDeleteModal.value = false
  await fetchLanguages()
}

const openDetailModal = (item: AdminLanguageDTO) => {
  selectedItemIdForDetail.value = item.id.toString()
  showDetailModal.value = true
}

const editItemSuccessFull = async () => {
  showDetailModal.value = false
  await fetchLanguages()
}

const refreshData = async () => {
  await fetchLanguages()
}
</script>
