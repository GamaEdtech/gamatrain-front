<template>
  <div class="w-100 h-100 d-flex flex-column align-start justify-start">
    <div class="w-100 d-flex justify-end align-center">
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

        <span
          class="text-grey400 text-no-wrap text-h5 font-weight-semibold"
        >
          <span class="text-grey500 font-weight-bold mr-1">
            {{ totalCount }}
          </span>
          Comments
        </span>
      </div>
    </div>
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
          <div
            class="text-grey600 text-h5 d-flex justify-start align-center font-weight-bold"
          >
            {{ item.id }}
          </div>
        </template>

        <template #[`item.creationUser`]="{ item }">
          <div
            class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold text-center"
          >
            {{ !item.creationUser ? `unknown` : item.creationUser }}
          </div>
        </template>

        <template #[`item.creationDate`]="{ item }">
          <div
            class="text-grey600 text-h5 d-flex text-center justify-center align-center font-weight-bold"
          >
            {{ formatLocal(item.creationDate, "DD/MM/YYYY HH:mm:ss") }}
          </div>
        </template>

        <template #[`item.postId`]="{ item }">
          <div
            class="text-grey600 text-h5 d-flex text-center justify-center align-center font-weight-bold"
          >
            {{ !item.postId ? '-': item.postId }}
          </div>
        </template>

        <template #[`item.status`]="{ item }">
          <div
            class="w-100 d-flex justify-center align-center"
          >
            <v-chip
              :color="getColorStatus(item.status)"
              class="font-weight-bold text-h5"
            >
              {{ item.status }}
            </v-chip>
          </div>
        </template>

        <template #[`item.Action`]="{ item }">
          <div
            class="d-flex justify-center align-center"
          >
            <v-btn
              icon
              flat
              @click="openModalMoreAction(item)"
            >
              <v-icon
                size="20"
                color="grey800"
              >
                md:settings
              </v-icon>
              <v-tooltip
                activator="parent"
                location="top"
              >
                More
              </v-tooltip>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </div>

    <div class="w-100 d-flex mt-2 position-relative ga-6">
      <div
        class="w-100 d-flex justify-center justify-sm-start justify-md-center mt-16 mt-sm-4"
      >
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
} from '@/types'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

const { loadingGetData: loading, data: list, getData, totalCount, pageCount } = useBlogCommentAdmin()
const { formatLocal } = useDateTime()

const headers = [
  { title: 'ID', key: 'id', sortable: false, width: '10vw' },
  { title: 'User', key: 'creationUser', sortable: false, width: '20vw' },
  { title: 'Creation Date', key: 'creationDate', sortable: false, width: '20vw' },
  { title: 'Post Id', key: 'postId', sortable: false, width: '10vw' },
  { title: 'Status', key: 'status', sortable: false, width: '20vw' },
  {
    title: 'Action',
    key: 'Action',
    sortable: false,
    width: '20vw',
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

const changePageNumber = async () => {
  await fetchData()
}

const changePageSize = async () => {
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
.set-height-table {
  max-height: 70vh;
}
.th-min-width {
  min-width: 130px;
}
.description-width {
  min-width: 200px;
}
.reverse-icon {
  transform: rotateZ(180deg);
}
.select-size-div {
  top: 18px;
}
.btn-filter-container{
  height : 48px;
}
.filter-mobile-container{
  width: 170px;
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
