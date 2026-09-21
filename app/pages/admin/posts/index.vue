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
      item-label="Posts"
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
          class="mr-1"
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

      <template #[`item.title`]="{ item }">
        <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center truncate-text">
          {{ item.title }}
        </div>
      </template>
    </common-data-table>

    <admin-common-modal
      v-model:show-dialog="showSearchModal"
      title="Search"
    >
      <admin-posts-modal-search
        :data="searchFilter"
        :loading="loading"
        @search="startSearch"
      />
    </admin-common-modal>

    <admin-common-modal
      v-if="showDetailModal"
      v-model:show-dialog="showDetailModal"
      title="Detail"
      :max-width="850"
    >
      <admin-posts-modal-detail
        :contribution-id="selectedItemIdForDetail"
        @change-status-successfull="changeStatusSuccessfull"
      />
    </admin-common-modal>

    <admin-common-delete-modal
      v-model="showDeleteModal"
      :loading="loadingDeleteItem"
      @confirm="deletePost"
    />
  </div>
</template>

<script setup lang="ts">
import type {
  AdminPostDTO,
  AdminPostStatus,
  DataTableHeader,
  SearchFilterAdminPost,
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
} = usePostAdmin()

const headers: DataTableHeader<AdminPostDTO>[] = [
  { title: 'ID', key: 'id', sortable: false, width: '8vw', align: 'start' },
  { title: 'Title', key: 'title', sortable: false, width: '28vw' },
  { title: 'Contributor', key: 'creationUser', sortable: false, width: '18vw', emptyText: 'unknown' },
  {
    title: 'Date',
    key: 'creationDate',
    sortable: false,
    width: '18vw',
    type: 'date',
    dateFormat: 'DD/MM/YYYY HH:mm:ss',
  },
  {
    title: 'Status',
    key: 'status',
    sortable: false,
    width: '12vw',
    type: 'chip',
    getText: (item: AdminPostDTO) => getStatusTitle(item.status),
    getChipColor: (item: AdminPostDTO) => getStatusColor(item.status),
  },
  {
    title: 'Action',
    key: 'Action',
    sortable: false,
    width: '16vw',
    type: 'actions',
    actions: [
      {
        icon: 'md:plagiarism',
        tooltip: 'Details',
        onClick: (item: AdminPostDTO) => openDetailModal(item),
      },
      {
        icon: 'md:arrow_circle_right',
        tooltip: 'Post Page',
        href: (item: AdminPostDTO) => `/post/${item.id}`,
        target: '_blank',
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

const searchFilter = reactive<SearchFilterAdminPost>({
  startDate: '',
  endDate: '',
  email: '',
  username: '',
  status: 'Confirmed',
})

const showSearchModal = ref(false)
const showDetailModal = ref(false)
const showDeleteModal = ref(false)
const selectedItemIdForDetail = ref('')
const selectedPostIdForDelete = ref<number | null>(null)

const fetchPosts = async () => {
  await getData({
    page: page.value,
    pageSize: pageSize.value,
    ...searchFilter,
  })
}

const changePageNumber = async (pageNumber: number) => {
  page.value = pageNumber
  await fetchPosts()
}

const changePageSize = async (newPageSize: number) => {
  pageSize.value = newPageSize
  page.value = 1
  await fetchPosts()
}

onMounted(async () => {
  await fetchPosts()
})

const startSearch = async (item: SearchFilterAdminPost) => {
  searchFilter.startDate = item.startDate
  searchFilter.endDate = item.endDate
  searchFilter.email = item.email
  searchFilter.username = item.username
  searchFilter.status = item.status
  page.value = 1
  showSearchModal.value = false
  await fetchPosts()
}

const isShowClearFilter = computed(() => {
  return searchFilter.startDate.length > 0
    || searchFilter.endDate.length > 0
    || searchFilter.email.length > 0
    || searchFilter.username.length > 0
    || searchFilter.status.length > 0
})

const clearFilter = async () => {
  searchFilter.startDate = ''
  searchFilter.endDate = ''
  searchFilter.email = ''
  searchFilter.username = ''
  searchFilter.status = 'Confirmed'
  page.value = 1
  await fetchPosts()
}

const openDetailModal = (item: AdminPostDTO) => {
  selectedItemIdForDetail.value = item.id.toString()
  showDetailModal.value = true
}

// const openDeleteModal = (item: AdminPostDTO) => {
//   selectedPostIdForDelete.value = item.id
//   showDeleteModal.value = true
// }

const deletePost = async () => {
  if (!selectedPostIdForDelete.value) return

  const response = await deleteItem(selectedPostIdForDelete.value)
  if (response.succeeded) {
    showDeleteModal.value = false
    selectedPostIdForDelete.value = null
    await fetchPosts()
  }
}

const changeStatusSuccessfull = async () => {
  selectedItemIdForDetail.value = ''
  showDetailModal.value = false
  page.value = 1
  await fetchPosts()
}

const refreshData = async () => {
  await fetchPosts()
}

const getStatusTitle = (status: AdminPostStatus) => {
  if (status === 'Review') return 'Pending'

  return status
}

const getStatusColor = (status: AdminPostStatus) => {
  if (status === 'Confirmed') return 'success'
  if (status === 'Draft') return 'info'
  if (status === 'Review') return 'warning'

  return 'error'
}
</script>

<style scoped>
.truncate-text {
  max-width: 320px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
