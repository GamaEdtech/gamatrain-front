<template>
  <div class="w-100 h-100 d-flex flex-column align-start justify-start">
    <div class="w-100 d-flex justify-space-between align-center">
      <div class="d-flex align-center justify-start position-relative flex-wrap ga-2">
        <div class="btn-filter-container d-none d-md-flex align-center justify-center ga-1 bg-grey100 pa-1 rounded-pill">
          <v-btn
            v-for="tagType in TAG_TYPE_FILTER_LIST"
            :key="tagType.id"
            rounded="pill"
            :color="tagType.id === selectedTagType ? `primary` : `transparent`"
            flat
            height="40"
            @click="changeFilterTagType(tagType.id)"
          >
            <span :class="`${tagType.id === selectedTagType ? `text-grey900` : `text-grey500`} font-weight-bold text-h5`">
              {{ tagType.title }}
            </span>
          </v-btn>
        </div>

        <div class="filter-mobile-container d-flex d-md-none align-center justify-start">
          <common-gombo-box
            v-model="selectedTagType"
            label="Tag Type"
            :items="TAG_TYPE_FILTER_LIST"
            @update:model-value="changeFilterTagType"
          />
        </div>
      </div>
    </div>

    <div class="w-100 d-flex align-center justify-start ga-2 mt-4">
      <v-btn
        rounded="pill"
        color="primary"
        flat
        variant="outlined"
        height="40"
        @click="showAddModal = true"
      >
        <span class="text-primary font-weight-bold text-h5">Add Tag</span>
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
      item-label="Tags"
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
      <admin-tags-modals-add @add-item-success-full="addItemSuccessFull" />
    </admin-common-modal>

    <admin-common-modal
      v-model:show-dialog="showDetailModal"
      title="Edit"
    >
      <admin-tags-modals-detail
        :id="selectedItemIdForDetail"
        @edit-item-success-full="editItemSuccessFull"
      />
    </admin-common-modal>
  </div>
</template>

<script setup lang="ts">
import { TAG_TYPE_FILTER_LIST } from '@/constants'
import type { AdminTagDTO, TagTypeDTO } from '@/types'

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
} = useTagAdmin()

const headers = [
  { title: 'ID', key: 'id', sortable: false, width: '10vw' },
  { title: 'Name', key: 'name', sortable: false, width: '25vw' },
  {
    title: 'Tag Type',
    key: 'tagType',
    sortable: false,
    width: '20vw',
    type: 'chip' as const,
    getChipColor: () => 'info',
  },
  { title: 'Icon', key: 'icon', sortable: false, width: '25vw' },
  {
    title: 'Action',
    key: 'Action',
    sortable: false,
    width: '20vw',
    type: 'actions' as const,
    actions: [
      {
        icon: 'md:delete',
        tooltip: 'delete',
        onClick: (item: AdminTagDTO) => openModalDelete(item),
      },
      {
        icon: 'md:settings',
        tooltip: 'Detail',
        onClick: (item: AdminTagDTO) => openDetailModal(item),
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

const selectedTagType = ref<TagTypeDTO | ''>('')
const showDeleteModal = ref(false)
const selectedItemIdForDelete = ref('')
const showAddModal = ref(false)
const showDetailModal = ref(false)
const selectedItemIdForDetail = ref('')

const fetchTags = async () => {
  await getData({
    page: page.value,
    pageSize: pageSize.value,
    tagType: selectedTagType.value,
  })
}

const changeFilterTagType = async (tagType: string | number) => {
  selectedTagType.value = tagType as TagTypeDTO | ''
  page.value = 1
  await fetchTags()
}

const changePageNumber = async (pageNumber: number) => {
  page.value = pageNumber
  await fetchTags()
}

const changePageSize = async (newPageSize: number) => {
  pageSize.value = newPageSize
  page.value = 1
  await fetchTags()
}

onMounted(async () => {
  await fetchTags()
})

const addItemSuccessFull = async () => {
  showAddModal.value = false
  await fetchTags()
}

const openModalDelete = (item: AdminTagDTO) => {
  selectedItemIdForDelete.value = item.id.toString()
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  await deleteItem(selectedItemIdForDelete.value)
  selectedItemIdForDelete.value = ''
  showDeleteModal.value = false
  await fetchTags()
}

const openDetailModal = (item: AdminTagDTO) => {
  selectedItemIdForDetail.value = item.id.toString()
  showDetailModal.value = true
}

const editItemSuccessFull = async () => {
  showDetailModal.value = false
  await fetchTags()
}

const refreshData = async () => {
  await fetchTags()
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
