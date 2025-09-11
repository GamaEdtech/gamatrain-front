<template>
  <div>
    <!-- Tabs and action buttons -->
    <div class="d-flex align-center justify-space-between mb-4">
      <div class="d-flex align-center">
        <div class="toggle-container">
          <v-btn
            v-for="tab in [
              'Draft',
              'Review',
              'Confirmed',
              'Rejected',
              'Deleted',
            ]"
            :key="tab"
            :class="{ 'active-tab': activeTab === tab }"
            class="toggle-btn"
            variant="text"
            @click="activeTab = tab"
          >
            {{ tab }}
          </v-btn>
        </div>
      </div>
      <div class="d-flex align-center">
        <v-btn
          :to="`/user/blogs/create`"
          color="success"
          class="new-blog-btn mr-4"
          rounded
          size="large"
          variant="flat"
        >
          <v-icon left>
            mdi-plus
          </v-icon>
          New blog
        </v-btn>
        <v-text-field
          v-model="searchQuery"
          placeholder="Search blogs by title..."
          prepend-inner-icon="mdi-magnify"
          :append-inner-icon="searchQuery ? 'mdi-close' : undefined"
          :loading="isSearching"
          variant="outlined"
          rounded
          density="compact"
          hide-details
          single-line
          class="search-input mr-4"
          style="max-width: 300px; width: 300px"
          autocomplete="off"
          @click:append-inner="clearSearch"
          @keydown.enter="handleSearchQuery"
        />
        <span class="item-count grey--text">
          {{
            searchQuery
              ? `${tableItems.length} of ${totalRecords}`
              : totalRecords
          }}
          Item{{
            (searchQuery ? tableItems.length : totalRecords) !== 1 ? "s" : ""
          }}
        </span>
      </div>
    </div>

    <!-- Table -->
    <v-card
      flat
      class="rounded-lg"
    >
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="tableItems"
        :items-per-page="-1"
        hide-default-footer
        show-select
        class="blog-table"
        item-key="id"
        :loading="loading"
        :no-data-text="
          searchQuery
            ? `No blogs found for '${searchQuery}'`
            : 'No blogs available'
        "
      >
        <!-- Title column with avatar -->
        <template #[`item.title`]="{ item }">
          <div class="d-flex align-center py-2">
            <!-- <v-avatar
              size="40"
              class="mr-3"
            >
              <v-img
                v-if="item.avatar"
                :src="item.avatar"
                :alt="item.title"
              />
            </v-avatar> -->
            <span class="font-weight-medium">{{ item.title }}</span>
          </div>
        </template>

        <!-- Category column with icon -->
        <template #[`item.category`]="{ item }">
          <div class="d-flex align-center">
            <v-icon
              small
              class="mr-1"
              color="grey darken-1"
            >
              {{ item.category === "News" ? "mdi-newspaper" : "mdi-bullhorn" }}
            </v-icon>
            <span>{{ item.category }}</span>
          </div>
        </template>

        <template #[`item.view`]="{ item }">
          <v-btn
            variant="text"
            :to="`/blog/${item.id}/${$slugGenerator(item.title)}`"
            target="_blank"
            icon
            small
            color="secondary"
          >
            <v-icon small>
              mdi-eye
            </v-icon>
          </v-btn>
        </template>

        <template #[`item.edit`]="{ item }">
          <v-btn
            variant="text"
            :to="`/user/blogs/edit/${item.id}`"
            icon
            small
            color="warning"
          >
            <v-icon small>
              mdi-pencil
            </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Footer with pagination -->
    <div class="d-flex justify-space-between align-center mt-4">
      <v-pagination
        v-model="page"
        :length="Math.ceil(totalRecords / pageSize)"
        :total-visible="7"
        class="custom-pagination"
      />

      <v-select
        v-model="perPage"
        :items="['10 Row', '20 Row', '50 Row']"
        variant="outlined"
        density="compact"
        rounded
        hide-details
        class="row-select"
      />
    </div>

    <!-- Delete Modal -->
    <DeleteModal
      v-model:is-open="isDeleteModalOpen"
      :item-type="'blog'"
      @confirm="handleDelete"
      @close="isDeleteModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import DeleteModal from '@/components/modals/DeleteModal.vue'

const { $toast, $slugGenerator } = useNuxtApp()

definePageMeta({
  layout: 'dashboard-layout',
  middleware: ['auth', 'user-type'],
})

useHead({
  title: 'Blog Management',
})

// State
const selected = ref([])
const activeTab = ref('Draft')
const page = ref(1)
const pageSize = ref(10)
const perPage = ref('10 Row')
const totalRecords = ref(0)
const isDeleteModalOpen = ref(false)
const itemToDelete = ref(null)
const loading = ref(false)
const searchQuery = ref('')
const isSearching = ref(false)
// const bulkAction = ref('Delete All')

const headers = [
  { title: 'Name', value: 'title', sortable: true },
  { title: 'Category', value: 'category', sortable: true },
  { title: 'Author', value: 'author', sortable: true },
  { title: 'Date', value: 'date', sortable: true },
  { title: 'View', value: 'view', sortable: false, align: 'center' },
  { title: 'Edit', value: 'edit', sortable: false, align: 'center' },
  // { title: 'Delete', value: 'delete', sortable: false, align: 'center' },
]

const tableItems = ref([])
const allItems = ref([]) // Store all items from API
const filteredItems = ref([]) // Store filtered items for display

// Methods
const fetchBlogs = async () => {
  loading.value = true
  const skip = (page.value - 1) * pageSize.value

  try {
    const response = await useApiService.get('/api/v2/blogs/contributions', {
      'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
      'PagingDto.PageFilter.Size': pageSize.value,
      'PagingDto.PageFilter.Skip': skip,
      'Status': activeTab.value,
    })

    if (response && response.succeeded) {
      const mappedItems = (response.data.list || []).map(item => ({
        id: item.id,
        title: item.title,
        category: item.category || '',
        author: item.creationUser || '',
        date: item.creationDate || '',
        avatar: item.imageUri || '',
        summary: item.summary || '',
      }))

      // Store all items and apply current search filter
      allItems.value = mappedItems
      applySearchFilter()
      totalRecords.value = response?.data?.totalRecordsCount
    }
  }
  finally {
    loading.value = false
  }
}

// const openDeleteModal = (item) => {
//   itemToDelete.value = item
//   isDeleteModalOpen.value = true
// }

const handleDelete = async () => {
  if (itemToDelete.value) {
    try {
      await useApiService.remove(
        `/api/v2/blogs/contributions/${itemToDelete.value.id}`,
        {
          postId: itemToDelete.value.id,
        },
      )

      $toast.success('Blog deleted successfully!')

      tableItems.value = tableItems.value.filter(
        item => item.id !== itemToDelete.value.id,
      )
      totalRecords.value = Math.max(0, totalRecords.value - 1)
    }
    catch (error) {
      console.error('Error deleting blog:', error)
      $toast.error(
        error?.response?.data?.errors?.[0]?.message || 'Failed to delete blog.',
      )
    }
  }
  itemToDelete.value = null
  isDeleteModalOpen.value = false
}

const applySearchFilter = () => {
  if (!searchQuery.value || !searchQuery.value.trim()) {
    // No search query, show all items
    filteredItems.value = [...allItems.value]
  }
  else {
    // Apply search filter - search in title, category, author, and summary
    const query = searchQuery.value.toLowerCase().trim()
    filteredItems.value = allItems.value.filter((item) => {
      return (
        (item.title && item.title.toLowerCase().includes(query))
        || (item.category && item.category.toLowerCase().includes(query))
        || (item.author && item.author.toLowerCase().includes(query))
        || (item.summary && item.summary.toLowerCase().includes(query))
      )
    })
  }
  tableItems.value = filteredItems.value
}

const handleSearchQuery = () => {
  isSearching.value = true
  try {
    applySearchFilter()
  }
  finally {
    isSearching.value = false
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  applySearchFilter()
}

// const handleBulkAction = async () => {
//   if (selected.value.length && bulkAction.value === 'Delete All') {
//     try {
//       // Implement bulk delete logic here
//       console.log(selected.value)
//       $toast.success('Selected items deleted successfully!')
//       selected.value = []
//     }
//     catch {
//       $toast.error('Failed to delete selected items.')
//     }
//   }
// }

// Watchers
watch(page, () => {
  fetchBlogs()
})

watch(perPage, (val) => {
  pageSize.value = parseInt(val)
  page.value = 1
  fetchBlogs()
})

// Debounced search to avoid too many API calls
// Debounced search for better UX
let searchTimeout = null
watch(searchQuery, () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  searchTimeout = setTimeout(() => {
    handleSearchQuery()
  }, 150) // Wait 150ms after user stops typing
})

watch(activeTab, () => {
  // Clear search when switching tabs and fetch new data
  console.log(`Active tab changed to: ${activeTab.value}`)
  searchQuery.value = '' // Clear search when switching tabs
  fetchBlogs()
})

// Lifecycle
onMounted(() => {
  fetchBlogs()
})
</script>

<style scoped>
.toggle-container {
  display: flex;
  background: #f2f4f7;
  border-radius: 32px;
  padding: 4px;
  width: 100%;
  max-width: 400px;
  height: 44px;
}

.toggle-btn {
  height: 38px !important;
  flex: 1;
  border-radius: 32px !important;
  text-transform: none;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: #667085 !important;
  background: transparent !important;
  letter-spacing: 0;
  min-width: 0 !important;
  margin: 0 !important;
}

.active-tab {
  background: #ffb600 !important;
  color: #1d2939 !important;
  font-weight: 600;
  box-shadow: 0px 1px 3px rgba(16, 24, 40, 0.1),
    0px 1px 2px rgba(16, 24, 40, 0.06);
}

.new-blog-btn {
  text-transform: none;
  font-weight: 500;
}

@media (max-width: 600px) {
  .d-flex.align-center.justify-space-between.mb-4 {
    flex-direction: column;
    align-items: stretch !important;
    gap: 16px;
  }

  .d-flex.align-center {
    flex-direction: column;
    width: 100%;
    gap: 16px;
  }

  .toggle-container {
    width: 100%;
    max-width: none;
  }

  .new-blog-btn {
    width: 100%;
    margin-right: 0 !important;
  }

  .search-input {
    width: 100% !important;
    max-width: none !important;
    margin-right: 0 !important;
  }

  .item-count {
    align-self: flex-end;
  }

  .d-flex.justify-space-between.align-center.mt-4 {
    flex-direction: column;
    gap: 16px;
  }

  .bulk-action-select {
    max-width: none;
    width: 100%;
  }

  .do-btn {
    width: 100%;
  }

  .row-select {
    max-width: none;
    width: 100%;
  }

  .custom-pagination {
    order: -1;
    margin-bottom: 16px;
  }
}

.blog-table {
  border: 1px solid #edf2f7;
  border-radius: 8px;
}

.blog-table ::v-deep tbody tr {
  border-bottom: 1px solid #f2f4f7;
}

.blog-table ::v-deep tbody td {
  padding: 12px 16px;
  height: 72px !important;
}

.bulk-action-select {
  max-width: 150px;
}

.row-select {
  max-width: 120px;
}

.custom-pagination ::v-deep .v-pagination__item {
  box-shadow: none !important;
}

.custom-pagination ::v-deep .v-pagination__item--active {
  background-color: #ffb600 !important;
  color: #000000 !important;
}

.item-count {
  color: #bdbdbd;
  font-size: 14px;
}

.blog-table ::v-deep .v-data-table__checkbox {
  margin-right: 8px;
}

.blog-table
  ::v-deep
  .v-data-table
  > .v-data-table__wrapper
  > table
  > thead
  > tr
  > th {
  font-size: 14px;
  color: #344054;
  font-weight: 600;
  text-transform: none;
  letter-spacing: normal;
}
</style>
