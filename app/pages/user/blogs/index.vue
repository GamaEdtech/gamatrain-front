<template>
  <div class="w-100 h-100 d-flex flex-column align-start justify-start px-2 pa-md-0">
    <div class="w-100 d-flex align-center justify-space-between ga-2 mt-4">
      <h1 class="text-h4 text-grey700 font-weight-regular">
        My Blog
      </h1>
    </div>

    <div class="w-100 d-flex justify-space-between align-center ga-2 flex-wrap mt-4">
      <div class="d-flex align-center ga-2 flex-wrap">
        <v-btn
          to="/user/blogs/create"
          rounded="pill"
          color="primary"
          flat
          max-width="220"
          height="34"
        >
          <v-icon
            color="grey800"
            size="20"
          >
            md:add
          </v-icon>
          <span class="text-grey800 font-weight-bold text-h6">New Blog</span>
        </v-btn>

        <v-btn
          v-if="isShowClearFilter"
          color="primary"
          rounded="xl"
          height="34"
          class="text-h6"
          flat
          variant="outlined"
          @click="clearFilter"
        >
          Clear Filter
        </v-btn>
      </div>

      <div class="d-flex align-center justify-end ga-1 flex-wrap">
        <v-btn
          variant="plain"
          max-width="20"
          @click="showFilterModal = true"
        >
          <v-icon
            size="26"
            class="grey500"
          >
            md:filter_list
          </v-icon>
        </v-btn>
      </div>
    </div>

    <common-data-table
      v-model:page="page"
      v-model:page-size="pageSize"
      sticky-header-offset="64px"
      :headers="headers"
      :items="list || []"
      :page-count="pageCount"
      :total-count="totalCount"
      :page-size-options="allPageSize"
      :loading="loading"
      item-label="Blog"
      class="mt-4"
      @update:page="changePageNumber"
      @update:page-size="changePageSize"
    />

    <common-modal-base
      v-model:show-dialog="showFilterModal"
      title="Filter"
    >
      <div class="w-100 d-flex flex-column pa-4">
        <common-gombo-box
          v-model="pendingStatus"
          label="Status"
          :items="statusFilterItems"
          rounded="lg"
          density="compact"
          base-color="grey200"
          color="primary"
          :defalut-lable="false"
        />

        <v-btn
          color="primary"
          rounded="xl"
          height="40"
          width="200"
          class="text-h5 mt-4 mx-auto"
          flat
          @click="applyFilter"
        >
          Apply
        </v-btn>
      </div>
    </common-modal-base>

    <!-- <common-modal-base
      v-model:show-dialog="showDeleteModal"
      title="Delete"
    >
      <common-modal-delete
        :loading="loadingDeleteItem"
        @confirm="confirmDelete"
      />
    </common-modal-base> -->
  </div>
</template>

<script setup lang="ts">
import type { BlogUserBreifDTO, BlogUserBreifDTOStatus, DataTableHeader } from '@/types'
import { USER_BLOG_STATUS } from '@/constants'

definePageMeta({
  layout: 'dashboard-layout',
  middleware: ['auth'],
})

useSeoMeta({
  title: 'Blog Management',
})

const {
  loadingGetData: loading,
  data: list,
  getData,
  totalCount,
  pageCount,
  // deleteItem,
  // loadingDeleteItem,
} = useBlog()
const route = useRoute()

const headers: DataTableHeader<BlogUserBreifDTO>[] = [
  { title: 'ID', key: 'id', sortable: false, width: '10vw' },
  { title: 'Title', key: 'title', sortable: false, width: '40vw' },
  {
    title: 'Date',
    key: 'creationDate',
    sortable: false,
    width: '20vw',
    type: 'date',
    dateFormat: 'DD/MM/YYYY HH:mm:ss',
  },
  {
    title: 'Status',
    key: 'status',
    sortable: false,
    width: '15vw',
    type: 'chip',
    getChipColor: (item: BlogUserBreifDTO) => getStatusColor(item.status),
  },
  {
    title: 'Action',
    key: 'Action',
    sortable: false,
    width: '15vw',
    type: 'actions',
    actions: [
      {
        icon: 'md:visibility',
        tooltip: 'View',
        to: (item: BlogUserBreifDTO) => `/blog/${item.postId}`,
        target: '_blank',
      },
      {
        icon: 'md:edit',
        tooltip: 'Edit',
        to: (item: BlogUserBreifDTO) => `/user/blogs/edit/${item.id}?fromPage=${page.value}`,
      },
    ],
  },
]

const pageSize = ref(10)
const page = ref(route.query.page ? Number(route.query.page) : 1)
const allPageSize = [
  { label: '10 Rows', value: 10 },
  { label: '20 Rows', value: 20 },
  { label: '50 Rows', value: 50 },
]

const filters = reactive<{
  status: BlogUserBreifDTOStatus | ''
}>({
  status: '',
})

// 'All' (empty status) is an explicit choice here rather than relying on the gombo-box's clear button, so
// switching back to every status is as discoverable as picking one.
const statusFilterItems = [
  { id: '', title: 'All' },
  ...USER_BLOG_STATUS.map(item => ({ id: item, title: item })),
]

const showFilterModal = ref(false)
// Separate from filters.status so opening the modal and closing it without hitting Apply doesn't touch
// the currently-applied filter.
const pendingStatus = ref<BlogUserBreifDTOStatus | ''>('')

const isShowClearFilter = computed(() => filters.status.length > 0)

// Reflect the currently-applied filter each time the modal opens, rather than whatever was left over
// from the last time it was opened and dismissed without applying.
watch(showFilterModal, (isOpen) => {
  if (isOpen) {
    pendingStatus.value = filters.status
  }
})

// const showDeleteModal = ref(false)
// const selectedItemIdForDelete = ref('')

const fetchData = async () => {
  await getData({
    page: page.value,
    pageSize: pageSize.value,
    status: filters.status || undefined,
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

const applyFilter = async () => {
  filters.status = pendingStatus.value
  showFilterModal.value = false
  page.value = 1
  await fetchData()
}

const clearFilter = async () => {
  filters.status = ''
  pendingStatus.value = ''
  page.value = 1
  await fetchData()
}

// const openModalDelete = (item: BlogUserBreifDTO) => {
//   selectedItemIdForDelete.value = item.id.toString()
//   showDeleteModal.value = true
// }

// const confirmDelete = async () => {
//   await deleteItem(selectedItemIdForDelete.value)
//   selectedItemIdForDelete.value = ''
//   showDeleteModal.value = false
//   await fetchData()
// }

const getStatusColor = (status: BlogUserBreifDTOStatus) => {
  switch (status) {
    case 'Confirmed':
      return 'success'
    case 'Review':
      return 'warning'
    case 'Rejected':
      return 'error'
    case 'Deleted':
      return 'error'
    case 'Draft':
      return 'info'

    default:
      return 'warning'
  }
}

onMounted(async () => {
  await fetchData()
})
</script>

<style scoped>
</style>
