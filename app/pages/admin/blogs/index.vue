<script setup>
import blogCard from '~/components/admin/blogs/blogCard.vue'
import DeleteItemModal from '@/components/admin/contactus/deleteItemModal.vue'
import useApiService from '~/composables/useApiService'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

const { $toast } = useNuxtApp()

const headers = [
  { title: 'Title', key: 'title', sortable: false, width: '20vw' },
  { title: 'Contributer', key: 'creationUser', sortable: false, width: '15vw' },
  { title: 'Status', key: 'confirmed', sortable: false, width: '10vw' },
  { title: 'Actions', key: 'actions', sortable: false, width: '5vw' },
]

const selectedBlog = reactive({
  title: null,
  slug: null,
  summary: null,
  body: null,
  imageUri: null,
  keywords: null,
  postId: null,
  visibilityType: null,
  publishDate: null,
  tags: [],
})

const list = ref([])
const tableLoading = ref(true)
const dialogVisible = ref(false)
const filter = ref('Confirmed')
const selectedPageSize = ref(10)
const page = ref(1)
const pageCount = ref(0)
const totalCount = ref(0)
const selected = ref([])
const isDeleteModalOpen = ref(false)
const selectedDeleteId = ref(null)

const allPageSize = [
  { label: '10 Rows', value: 10 },
  { label: '20 Rows', value: 20 },
  { label: '50 Rows', value: 50 },
]

const fetchBlogs = async () => {
  tableLoading.value = true
  try {
    const response = await useApiService.get('/api/v2/admin/blogs/contributions', {
      'PagingDto.PageFilter.Size': selectedPageSize.value,
      'PagingDto.PageFilter.Skip': (page.value - 1) * selectedPageSize.value,
      'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
      'Status': filter.value,
    })

    list.value = response.data.list
    totalCount.value = response.data.totalRecordsCount
    pageCount.value = Math.ceil(totalCount.value / selectedPageSize.value)
  }
  catch (err) {
    if (err.response?.status === 400) {
      $toast.error(err.response.data.message)
    }
  }
  finally {
    tableLoading.value = false
  }
}

const viewBlogDetails = async (id) => {
  try {
    const response = await useApiService.get(`/api/v2/admin/blogs/contributions/${id}`)

    selectedBlog.title = response.data.title
    selectedBlog.slug = response.data.slug
    selectedBlog.summary = response.data.summary
    selectedBlog.body = response.data.body
    selectedBlog.imageUri = response.data.imageUri
    selectedBlog.keywords = response.data.keywords
    selectedBlog.postId = response.data.postId
    selectedBlog.visibilityType = response.data.visibilityType
    selectedBlog.publishDate = response.data.publishDate
    selectedBlog.tags = response.data.tags

    dialogVisible.value = true
  }
  catch (err) {
    if (err.response?.status === 400) {
      $toast.error(err.response.data.message)
    }
  }
}

const handleDelete = (id) => {
  isDeleteModalOpen.value = true
  selectedDeleteId.value = id
}

const deleteBlog = async () => {
  try {
    const res = await useApiService.remove(`/api/v2/admin/blogs/posts/${selectedDeleteId.value}`)
    if (res.succeeded === true)
      $toast.success('Blog deleted successfully!')
    else
      $toast.error(res.errors[0].message)
  }
  catch (err) {
    if (err.response?.status === 400) {
      $toast.error(err.response.data.message)
    }
  }
  finally {
    isDeleteModalOpen.value = false
    fetchBlogs()
  }
}

const goToBlog = (postId) => {
  window.open(`/posts/${postId}`, '_blank')
}

watch(page, () => {
  fetchBlogs()
})

watch(selectedPageSize, () => {
  page.value = 1
  fetchBlogs()
})

watch(filter, (_val) => {
  page.value = 1
  fetchBlogs()
}, { immediate: true })
</script>

<template>
  <div>
    <div class="d-flex justify-end ga-2 align-center px-2 justify-space-between">
      <div class="filterBtns mb-4">
        <v-btn
          :class="{ 'active-filter': filter === 'Confirmed', 'inactive-filter': filter !== 'Confirmed' }"
          depressed
          rounded
          variant="plain"
          class="gtext-t4 font-weight-medium"
          @click="filter = 'Confirmed'"
        >
          Confirmed
        </v-btn>

        <v-btn
          :class="{ 'active-filter': filter === 'Review', 'inactive-filter': filter !== 'Review' }"
          depressed
          class="ml-2 gtext-t4 font-weight-medium"
          rounded
          variant="plain"
          @click="filter = 'Review'"
        >
          Pending
        </v-btn>
        <v-btn
          :class="{ 'active-filter': filter === 'Rejected', 'inactive-filter': filter !== 'Rejected' }"
          depressed
          class="ml-2 gtext-t4 font-weight-medium"
          rounded
          variant="plain"
          @click="filter = 'Rejected'"
        >
          Rejected
        </v-btn>
        <v-btn
          :class="{ 'active-filter': filter === 'Deleted', 'inactive-filter': filter !== 'Deleted' }"
          depressed
          class="ml-2 gtext-t4 font-weight-medium"
          rounded
          variant="plain"
          @click="filter = 'Deleted'"
        >
          Deleted
        </v-btn>
      </div>
      <div class="d-flex ga-1">
        <p class="primary-gray-500 gtext-t6 font-weight-bold">
          {{ totalCount }}
        </p>
        <p class="gray--text gtext-t6 font-weight-semibold">
          Blogs
        </p>
      </div>
    </div>
    <div class="scrollable-table">
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="list"
        :items-per-page="selectedPageSize"
        class="elevation-1"
        :loading="tableLoading"
        hide-default-footer
      >
        <template #[`item.title`]="{ item }">
          <div class="d-flex align-center">
            <span class="truncate-text">{{ item.title }}</span>
          </div>
        </template>

        <template #[`item.creationUser`]="{ item }">
          <div class="d-flex align-center">
            <span class="truncate-text">{{ item.creationUser }}</span>
          </div>
        </template>

        <template #[`header.actions`]>
          <div class="d-flex justify-end pr-6">
            Actions
          </div>
        </template>

        <template #[`item.confirmed`]="{ item }">
          <span
            v-if="item.status == 'Confirmed'"
            class="gtext-t5 green-12b76a"
          >Confirmed</span>
          <span
            v-if="item.status == 'Review'"
            class="gtext-t5 pending-status"
          >Pending</span>
          <span
            v-if="item.status == 'Deleted'"
            class="gtext-t5 red-F04438"
          >Deleted</span>
          <span
            v-if="item.status == 'Rejected'"
            class="gtext-t5 red-F04438"
          >Rejected</span>
        </template>

        <template #[`item.actions`]="{ item }">
          <div class="d-flex justify-end pr-2">
            <v-btn
              variant="plain"
              class="px-0 min-width-10"
            >
              <v-icon
                small
                class="mr-2 gtext-t1"
                @click="viewBlogDetails(item.id)"
              >
                mdi-file-find
              </v-icon>
              <v-tooltip
                activator="parent"
                location="top"
              >
                Details
              </v-tooltip>
            </v-btn>
            <v-btn
              variant="plain"
              class="px-0 min-width-10"
            >
              <v-icon
                small
                class="mr-2 gtext-t1"
                @click="goToBlog(item.postId)"
              >
                mdi-arrow-right-circle
              </v-icon>
              <v-tooltip
                activator="parent"
                location="top"
              >
                Blog Page
              </v-tooltip>
            </v-btn>
            <v-btn
              variant="plain"
              class="px-0 min-width-10"
            >
              <v-icon
                small
                class="gtext-t1"
                @click="handleDelete(item.postId)"
              >
                mdi-delete
              </v-icon>
              <v-tooltip
                activator="parent"
                location="top"
              >
                Delete
              </v-tooltip>
            </v-btn>
          </div>
        </template>
      </v-data-table>

      <blogCard
        v-model="dialogVisible"
        :selected-blog="selectedBlog"
        @fetch-blogs="fetchBlogs"
      />
      <DeleteItemModal
        v-model="isDeleteModalOpen"
        @confirm="deleteBlog"
      />
    </div>

    <v-row
      class="mt-2"
      align="center"
      justify="space-between"
      no-gutters
    >
      <v-col
        cols="12"
        class="d-flex align-center position-relative"
      >
        <div class="d-none d-sm-flex pagination-center">
          <v-pagination
            v-model="page"
            :length="pageCount"
            :total-visible="5"
            class="custom-pagination"
            next-icon="mdi-arrow-right"
            prev-icon="mdi-arrow-left"
          />
        </div>

        <div class="ml-auto">
          <v-select
            v-model="selectedPageSize"
            :items="allPageSize"
            item-title="label"
            item-value="value"
            variant="outlined"
            density="compact"
            rounded
            hide-details
            class="rounded-pill footerBtns"
          />
        </div>
      </v-col>

      <!-- Pagination (visible only on xs) -->
      <v-col
        cols="12"
        class="d-flex justify-center d-sm-none mt-2"
      >
        <v-pagination
          v-model="page"
          :length="pageCount"
          :total-visible="5"
          class="custom-pagination"
          next-icon="mdi-arrow-right"
          prev-icon="mdi-arrow-left"
        />
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.scrollable-table {
  max-height: 70vh;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
}

:deep(.v-field__outline){
    --v-field-border-width: 1px !important;
    --v-field-border-opacity: 0.38 !important;
}

:deep(.v-data-table__th){
    color: #344054 !important;
    font-family: Inter, sans-serif !important;
    font-size: 1.4rem !important;
    line-height: 2.4rem !important;
    font-weight: 500;
    white-space: nowrap;
}

:deep(.v-table__wrapper > table > thead > tr){
  background-color: #F2F4F7 !important;
}

.filterBtns{
    display: flex;
    padding: 4px;
    background-color: #0000001A;
    border-radius: 28px;
    align-items: center;
}

.footerBtns{
  width: 150px !important;
  max-width: 150px !important;
}

.v-pagination > li > button {
  margin: 0.1rem !important;
}

.custom-pagination {
  width: 100% !important;
  justify-content: center !important;
}
:deep(.custom-pagination li),:deep(.custom-pagination li button){
  min-width: 36px !important;
  width: 36px !important;
  height: 36px !important;
}
:deep(.custom-pagination li button:hover){
  background-color: #ffb300;
  opacity: 0.7;
}
:deep(.custom-pagination .v-pagination__item--is-active button) {
  background: #ffb300 !important;
}

:deep(.v-data-table td) {
  cursor: default !important;
}

.active-filter {
  background-color: #FFB600 !important;
  color: #101828 !important;
}

.inactive-filter {
  color: #667085 !important;
}

:deep(.v-btn--variant-plain){
  opacity: 1 !important;
}

.truncate-text {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.v-data-table thead) {
  position: sticky;
  top: 0;
  z-index: 20;
  background-color: #F2F4F7 !important;
}

:deep(.v-data-table thead th) {
  background-color: #F2F4F7 !important;
}

.red-F04438{
  color: #F04438;
  border-radius: 4px;
  padding: 4px 8px;
  border: 1.5px solid #F04438;
  font-weight: 600 !important;
}
.green-12b76a{
  color: #12b76a;
  border-radius: 4px;
  padding: 4px 8px;
  border: 1.5px solid #12b76a;
  font-weight: 600 !important;
}

.pending-status{
  color: #6c6c6c;
  border-radius: 4px;
  padding: 4px 8px;
  border: 1.5px solid #6c6c6c;
  font-weight: 600 !important;
}

.min-width-10{
  min-width: 10px !important;
  height: 20px !important;
}
.pagination-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
</style>
