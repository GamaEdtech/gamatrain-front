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

      <div class="d-flex align-center justify-end ga-1 flex-wrap">
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

        <span class="text-grey400 text-no-wrap text-h5 font-weight-semibold">
          <span class="text-grey500 font-weight-bold mr-1">
            {{ totalCount }}
          </span>
          Blogs
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
          <div class="text-grey600 text-h5 d-flex justify-start align-center font-weight-bold">
            {{ item.id }}
          </div>
        </template>

        <template #[`item.title`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center truncate-text">
            {{ item.title }}
          </div>
        </template>

        <template #[`item.creationUser`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center">
            {{ item.creationUser || 'unknown' }}
          </div>
        </template>

        <template #[`item.creationDate`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center">
            {{ $dayjs(item.creationDate).format('DD/MM/YYYY HH:mm:ss') }}
          </div>
        </template>

        <template #[`item.status`]="{ item }">
          <div class="w-100 d-flex justify-center align-center">
            <v-chip
              :color="getStatusColor(item.status)"
              class="font-weight-bold text-h5"
            >
              {{ getStatusTitle(item.status) }}
            </v-chip>
          </div>
        </template>

        <template #[`item.Action`]="{ item }">
          <div class="d-flex justify-center align-center">
            <v-btn
              icon
              flat
              @click="openDetailModal(item)"
            >
              <v-icon
                size="20"
                color="grey800"
              >
                md:plagiarism
              </v-icon>
              <v-tooltip
                activator="parent"
                location="top"
              >
                Details
              </v-tooltip>
            </v-btn>

            <v-btn
              icon
              flat
              :href="`/posts/${item.postId}`"
              target="_blank"
            >
              <v-icon
                size="20"
                color="grey800"
              >
                md:arrow_circle_right
              </v-icon>
              <v-tooltip
                activator="parent"
                location="top"
              >
                Blog Page
              </v-tooltip>
            </v-btn>

            <!-- <v-btn
              icon
              flat
              @click="openDeleteModal(item)"
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
  SearchFilterAdminBlogContribution,
} from '@/types'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

const { $dayjs } = useNuxtApp()
const {
  loadingGetData: loading,
  data: list,
  getData,
  totalCount,
  pageCount,
  deleteItem,
  loadingDeleteItem,
} = useBlogAdmin()

const headers = [
  { title: 'ID', key: 'id', sortable: false, width: '8vw' },
  { title: 'Title', key: 'title', sortable: false, width: '28vw' },
  { title: 'Contributor', key: 'creationUser', sortable: false, width: '18vw' },
  { title: 'Date', key: 'creationDate', sortable: false, width: '18vw' },
  { title: 'Status', key: 'status', sortable: false, width: '12vw' },
  { title: 'Action', key: 'Action', sortable: false, width: '16vw' },
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

const changePageNumber = async () => {
  await fetchBlogs()
}

const changePageSize = async () => {
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
.set-height-table {
  max-height: 70vh;
}
.th-min-width {
  min-width: 130px;
}
.select-size-div {
  top: 18px;
}
.truncate-text {
  max-width: 320px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
