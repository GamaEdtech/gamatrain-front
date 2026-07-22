<template>
  <div class="w-100 h-100 d-flex flex-column align-start justify-start px-2 pa-md-0">
    <div class="w-100 d-flex align-center justify-space-between ga-2 mt-4">
      <h1 class="text-h4 text-grey700 font-weight-regular">
        My Blog
      </h1>
    </div>

    <!-- <div class="w-100 d-flex ga-1 flex-wrap align-end mt-4">
      <div class="filter-item">
        <common-gombo-box
          v-model="filters.status"
          label="Subject"
          :items="USER_BLOG_STATUS?.map((item) => {
            return {
              id: item,
              title: item,
            }
          })"
          rounded="pill"
          height="48"
          base-color="grey200"
          color="primary"
          density="compact"
          :defalut-lable="false"
          @update:model-value="statusFilterChange"
        />
      </div>
    </div> -->

    <div class="w-100 d-flex justify-space-between align-center mt-4">
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
      <span class="text-grey400 text-no-wrap text-h5 font-weight-semibold ml-auto">
        <span class="text-grey500 font-weight-bold mr-1">
          {{ totalCount }}
        </span>
        Blog
      </span>
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

        <template #[`item.creationUser`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center">
            {{ item.creationUser ?? 'unkhown' }}
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
// import { USER_BLOG_STATUS } from '@/constants'
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
  { title: 'Title', key: 'title', sortable: false, width: '30vw' },
  { title: 'User', key: 'creationUser', sortable: false, width: '10vw' },
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

// const filters = reactive<{
//   status: string
// }>({
//   status: '',
// })

// // const showDeleteModal = ref(false)
// const selectedItemIdForDelete = ref('')

const fetchData = async () => {
  await getData({
    page: page.value,
    pageSize: pageSize.value,
    // status: filters.status,
  })
}

const changePageNumber = async () => {
  await fetchData()
}

const changePageSize = async () => {
  page.value = 1
  await fetchData()
}

// const statusFilterChange = async () => {
//   page.value = 1
//   await fetchData()
// }

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
.filter-item{
  width: 30%;
  max-width : 200px;
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

@media screen and (max-width: 600px) {
  .filter-item{
    width: 100%;
     max-width : 100%
  }
}
</style>
