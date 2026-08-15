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

        <span class="text-grey400 text-no-wrap text-h5 font-weight-semibold">
          <span class="text-grey500 font-weight-bold mr-1">
            {{ totalCount }}
          </span>
          Blog
        </span>
      </div>
    </div>

    <div class="w-100 mt-4">
      <v-data-table
        :headers="headers"
        :items="list"
        :items-per-page="pageSize"
        class="elevation-1 set-height-table"
        :loading="loading"
        fixed-header
        hide-default-footer
      >
        <template #headers="{ columns }">
          <tr>
            <th
              v-for="(column, index) in columns"
              :key="index"
              :class="`bg-grey100 text-grey700 text-h5 font-weight-bold pa-2 text-center
               ${index == 0 ? `` : `th-min-width`}`"
            >
              {{ column.title }}
            </th>
          </tr>
        </template>

        <template #[`item.id`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold">
            {{ item.id }}
          </div>
        </template>

        <template #[`item.title`]="{ item }">
          <div class="text-grey600 text-h5 font-weight-bold d-flex justify-center align-center">
            {{ item.title }}
          </div>
        </template>

        <template #[`item.creationDate`]="{ item }">
          <div class="text-center text-grey600 text-h5 d-flex justify-center align-center font-weight-bold">
            {{ formatLocal(item.creationDate, "DD/MM/YYYY HH:mm:ss") }}
          </div>
        </template>

        <template #[`item.status`]="{ item }">
          <div class="w-100 d-flex justify-center align-center">
            <v-chip
              :color="getStatusColor(item.status)"
              class="font-weight-bold text-h5"
            >
              {{ item.status }}
            </v-chip>
          </div>
        </template>

        <template #[`item.Action`]="{ item }">
          <div class="d-flex justify-center align-center">
            <v-btn
              icon
              flat
              :to="`/blog/${item.postId}`"
              target="_blank"
            >
              <v-icon
                size="20"
                color="grey800"
              >
                md:visibility
              </v-icon>
              <v-tooltip
                activator="parent"
                location="top"
              >
                View
              </v-tooltip>
            </v-btn>

            <v-btn
              icon
              flat
              :to="`/user/blogs/edit/${item.id}?fromPage=${page}`"
            >
              <v-icon
                size="20"
                color="grey800"
              >
                md:edit
              </v-icon>
              <v-tooltip
                activator="parent"
                location="top"
              >
                Edit
              </v-tooltip>
            </v-btn>

            <!-- <v-btn
              icon
              flat
              @click="openModalDelete(item)"
            >
              <v-icon
                size="20"
                color="grey800"
              >
                md:delete
              </v-icon>
              <v-tooltip
                activator="parent"
                location="top"
              >
                Delete
              </v-tooltip>
            </v-btn> -->
          </div>
        </template>
      </v-data-table>
    </div>

    <div class="w-100 d-flex mt-2 position-relative ga-6">
      <div class="w-100 d-flex justify-center justify-sm-start justify-md-center mt-16 mt-sm-4">
        <v-pagination
          v-model="page"
          :length="pageCount"
          :total-visible="4"
          next-icon="md:arrow_forward"
          prev-icon="md:arrow_back"
          size="40"
          class="custom-pagination"
          @update:model-value="changePageNumber"
        />
      </div>

      <div class="position-absolute right-0 select-size-div">
        <v-select
          v-model="pageSize"
          :items="allPageSize"
          item-title="label"
          item-value="value"
          variant="outlined"
          density="compact"
          rounded
          hide-details
          max-width="140"
          class="rounded-pill"
          @update:model-value="changePageSize"
        />
      </div>
    </div>

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
import type { BlogUserBreifDTOStatus } from '@/types'
import { USER_BLOG_STATUS } from '@/constants'
// import type { BlogUserBreifDTO } from '@/types'

definePageMeta({
  layout: 'dashboard-layout',
  middleware: ['auth'],
})

useSeoMeta({
  title: 'Blog Management',
})

const { formatLocal } = useDateTime()
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

const headers = [
  { title: 'ID', key: 'id', sortable: false, width: '10vw' },
  { title: 'Title', key: 'title', sortable: false, width: '40vw' },
  { title: 'Date', key: 'creationDate', sortable: false, width: '20vw' },
  { title: 'Status', key: 'status', sortable: false, width: '15vw' },
  { title: 'Action', key: 'Action', sortable: false, width: '15vw' },
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

const changePageNumber = async () => {
  await fetchData()
}

const changePageSize = async () => {
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
.set-height-table {
  max-height: 70vh;
}
.th-min-width {
  min-width: 130px;
}
.select-size-div {
  top: 18px;
}

:deep(.custom-pagination li button:hover) {
  background-color: rgb(var(--v-theme-primary));
  opacity: 0.6;
}
:deep(.custom-pagination .v-pagination__item--is-active button) {
  background: rgb(var(--v-theme-primary)) !important;
}
:deep(.custom-pagination .v-pagination__item--is-active .v-btn__overlay){
  opacity: 0 !important;
}
</style>
