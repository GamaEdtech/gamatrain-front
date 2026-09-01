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
      item-label="Blogs"
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
      <admin-blogs-modal-search
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
      <admin-blogs-modal-detail
        :contribution-id="selectedItemIdForDetail"
        @change-status-successfull="changeStatusSuccessfull"
      />
    </admin-common-modal>

    <admin-common-delete-modal
      v-model="showDeleteModal"
      :loading="loadingDeleteItem"
      @confirm="deleteBlog"
    />
  </div>
</template>

<script setup lang="ts">
import type {
  AdminBlogContributionDTO,
  AdminBlogContributionStatus,
  DataTableHeader,
  SearchFilterAdminBlogContribution,
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
} = useBlogAdmin()

const headers: DataTableHeader<AdminBlogContributionDTO>[] = [
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
    getText: (item: AdminBlogContributionDTO) => getStatusTitle(item.status),
    getChipColor: (item: AdminBlogContributionDTO) => getStatusColor(item.status),
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
        onClick: (item: AdminBlogContributionDTO) => openDetailModal(item),
      },
      {
        icon: 'md:arrow_circle_right',
        tooltip: 'Blog Page',
        href: (item: AdminBlogContributionDTO) => `/posts/${item.postId}`,
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

const searchFilter = reactive<SearchFilterAdminBlogContribution>({
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

const fetchBlogs = async () => {
  await getData({
    page: page.value,
    pageSize: pageSize.value,
    ...searchFilter,
  })
}

const changePageNumber = async (pageNumber: number) => {
  page.value = pageNumber
  await fetchBlogs()
}

const changePageSize = async (newPageSize: number) => {
  pageSize.value = newPageSize
  page.value = 1
  await fetchBlogs()
}

onMounted(async () => {
  await fetchBlogs()
})

const startSearch = async (item: SearchFilterAdminBlogContribution) => {
  searchFilter.startDate = item.startDate
  searchFilter.endDate = item.endDate
  searchFilter.email = item.email
  searchFilter.username = item.username
  searchFilter.status = item.status
  page.value = 1
  showSearchModal.value = false
  await fetchBlogs()
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
  await fetchBlogs()
}

const openDetailModal = (item: AdminBlogContributionDTO) => {
  selectedItemIdForDetail.value = item.id.toString()
  showDetailModal.value = true
}

// const openDeleteModal = (item: AdminBlogContributionDTO) => {
//   selectedPostIdForDelete.value = item.postId
//   showDeleteModal.value = true
// }

const deleteBlog = async () => {
  if (!selectedPostIdForDelete.value) return

  const response = await deleteItem(selectedPostIdForDelete.value)
  if (response.succeeded) {
    showDeleteModal.value = false
    selectedPostIdForDelete.value = null
    await fetchBlogs()
  }
}

const changeStatusSuccessfull = async () => {
  selectedItemIdForDetail.value = ''
  showDetailModal.value = false
  page.value = 1
  await fetchBlogs()
}

const refreshData = async () => {
  await fetchBlogs()
}

const getStatusTitle = (status: AdminBlogContributionStatus) => {
  if (status === 'Review') return 'Pending'

  return status
}

const getStatusColor = (status: AdminBlogContributionStatus) => {
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
