<template>
  <div class="w-100 h-100 d-flex flex-column align-start justify-start">
    <div class="w-100 d-flex align-center justify-start ga-2 mt-4">
      <v-btn
        v-if="isShowClearFilter"
        color="primary"
        rounded="pill"
        height="40"
        width="120"
        class="text-h5 font-weight-bold "
        flat
        variant="outlined"
        @click="clearFilter"
      >
        Clear Filter
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
      item-label="Comments"
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
    </common-data-table>

    <admin-common-modal
      v-model:show-dialog="showSearchModal"
      title="Search"
    >
      <admin-blogs-comments-modal-search
        :data="searchFilter"
        @search="startSearch"
      />
    </admin-common-modal>

    <admin-common-modal
      v-model:show-dialog="moreActionModal"
      title="Detail"
    >
      <admin-blogs-comments-modal-detail
        :contribution-id="selectedItemIdForMoreAction"
        @change-status-successfull="changeStatusSuccessfull"
      />
    </admin-common-modal>
  </div>
</template>

<script setup lang="ts">
import type {
  CommnetBlogAdminDTO,
  CommentBlogAdminSearchFilter,
  CommentBlogStatus,
  DataTableHeader,
} from '@/types'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

const { loadingGetData: loading, data: list, getData, totalCount, pageCount } = useBlogCommentAdmin()

const headers: DataTableHeader<CommnetBlogAdminDTO>[] = [
  { title: 'ID', key: 'id', sortable: false, width: '10vw', align: 'start' },
  { title: 'User', key: 'creationUser', sortable: false, width: '20vw', emptyText: 'unknown' },
  {
    title: 'Creation Date',
    key: 'creationDate',
    sortable: false,
    width: '20vw',
    type: 'date',
    dateFormat: 'DD/MM/YYYY HH:mm:ss',
  },
  { title: 'Post Id', key: 'postId', sortable: false, width: '10vw' },
  {
    title: 'Status',
    key: 'status',
    sortable: false,
    width: '20vw',
    type: 'chip',
    getChipColor: (item: CommnetBlogAdminDTO) => getColorStatus(item.status),
  },
  {
    title: 'Action',
    key: 'Action',
    sortable: false,
    width: '20vw',
    type: 'actions',
    actions: [
      {
        icon: 'md:settings',
        tooltip: 'More',
        onClick: (item: CommnetBlogAdminDTO) => openModalMoreAction(item),
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

const moreActionModal = ref(false)
const selectedItemIdForMoreAction = ref('')
const showSearchModal = ref(false)
const searchFilter = reactive<CommentBlogAdminSearchFilter>({
  startDate: '',
  endDate: '',
  commenterEmail: '',
  commenterName: '',
  status: undefined,
})

const fetchData = async () => {
  await getData({
    page: page.value,
    pageSize: pageSize.value,
    ...searchFilter,
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

const openModalMoreAction = (item: CommnetBlogAdminDTO) => {
  selectedItemIdForMoreAction.value = item.id.toString()
  moreActionModal.value = true
}

const changeStatusSuccessfull = async () => {
  moreActionModal.value = false
  selectedItemIdForMoreAction.value = ''
  await fetchData()
}

const refreshData = async () => {
  await fetchData()
}

const isShowClearFilter = computed(() => {
  if (
    searchFilter.startDate.length > 0
    || searchFilter.endDate.length > 0
    || searchFilter.commenterEmail.length > 0
    || searchFilter.commenterName.length > 0
    || searchFilter.status
  ) {
    return true
  }
  return false
})

const clearFilter = async () => {
  searchFilter.startDate = ''
  searchFilter.endDate = ''
  searchFilter.commenterEmail = ''
  searchFilter.commenterName = ''
  searchFilter.status = undefined
  page.value = 1
  await fetchData()
}

const startSearch = async (item: CommentBlogAdminSearchFilter) => {
  searchFilter.startDate = item.startDate
  searchFilter.endDate = item.endDate
  searchFilter.commenterEmail = item.commenterEmail
  searchFilter.commenterName = item.commenterName
  searchFilter.status = item.status
  page.value = 1
  showSearchModal.value = false
  await fetchData()
}

const getColorStatus = (status?: CommentBlogStatus) => {
  switch (status) {
    case 'Draft':
      return 'info'
    case 'Review':
      return 'warning'
    case 'Confirmed':
      return 'success'
    case 'Rejected':
      return 'error'
    case 'Deleted':
      return 'error'

    default:
      return 'info'
  }
}
</script>

<style scoped>
.reverse-icon {
  transform: rotateZ(180deg);
}
.btn-filter-container{
  height : 48px;
}
.filter-mobile-container{
  width: 170px;
}
</style>
