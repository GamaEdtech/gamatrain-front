<template>
  <div>
    <!-- Tabs and action buttons -->
    <div class="d-flex align-center justify-space-between mb-4">
      <div class="d-flex align-center">
        <div class="toggle-container">
          <v-btn
            v-for="tab in ['Published', 'Drafted', 'Deleted']"
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
          placeholder="Search anything..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          rounded
          density="compact"
          hide-details
          single-line
          class="search-input mr-4"
          style="max-width: 300px; width: 300px"
        />
        <span class="item-count grey--text">{{ totalRecords }} Item</span>
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
      >
        <!-- Title column with avatar -->
        <template #[`item.title`]="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar
              size="40"
              class="mr-3"
            >
              <v-img
                :src="item.avatar"
                :alt="item.title"
              />
            </v-avatar>
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

        <template #[`item.delete`]="{ item }">
          <v-btn
            variant="text"
            icon
            small
            color="error"
            @click="openDeleteModal(item)"
          >
            <v-icon small>
              mdi-delete
            </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Footer with pagination -->
    <div class="d-flex justify-space-between align-center mt-4">
      <div class="d-flex align-center">
        <v-select
          v-model="bulkAction"
          :items="['Delete All']"
          variant="outlined"
          density="compact"
          rounded
          hide-details
          class="bulk-action-select mr-2"
          :disabled="!selected.length"
        />
        <v-btn
          :disabled="!selected.length"
          rounded
          color="primary"
          class="do-btn"
          @click="handleBulkAction"
        >
          Do
        </v-btn>
      </div>

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

const { $toast } = useNuxtApp()

definePageMeta({
  layout: 'dashboard-layout',
  middleware: ['auth', 'user-type'],
})

useHead({
  title: 'Blog Management',
})

// State
const _singleSelect = ref(false)
const selected = ref([])
const activeTab = ref('Published')
const page = ref(1)
const pageSize = ref(10)
const perPage = ref('10 Row')
const totalRecords = ref(0)
const isDeleteModalOpen = ref(false)
const itemToDelete = ref(null)
const loading = ref(false)
const searchQuery = ref('')
const bulkAction = ref('Delete All')

const headers = [
  { title: 'Name', value: 'title' },
  { title: 'Category', value: 'category', sortable: true },
  { title: 'Author', value: 'author', sortable: true },
  { title: 'Date', value: 'date', sortable: true },
  { title: 'Edit', value: 'edit', sortable: false, align: 'center' },
  { title: 'Delete', value: 'delete', sortable: false, align: 'center' },
]

const tableItems = ref([])

// Methods
const fetchBlogs = async () => {
  loading.value = true
  const skip = (page.value - 1) * pageSize.value
  try {
    const response = await useApiService.get('/api/v2/blogs/posts', {
      'PagingDto.PageFilter.Size': pageSize.value,
      'PagingDto.PageFilter.Skip': skip,
      'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
    })

    if (response && response.succeeded) {
      tableItems.value = (response.data.list || []).map(item => ({
        id: item.id,
        title: item.title,
        category: item.category || '',
        author: item.author || '',
        date: item.date || '',
        avatar: item.imageUri || '',
        summary: item.summary || '',
      }))
      totalRecords.value = response.data.totalRecordsCount || 0
    }
  }
  finally {
    loading.value = false
  }
}

const openDeleteModal = (item) => {
  itemToDelete.value = item
  isDeleteModalOpen.value = true
}

const handleDelete = async () => {
  if (itemToDelete.value) {
    try {
      await useApiService.remove(
        `/api/v2/blogs/posts/${itemToDelete.value.id}`,
        {
          postId: itemToDelete.value.id,
        },
      )

      $toast.success('Blog deleted successfully!')

      tableItems.value = tableItems.value.filter(
        item => item.id !== itemToDelete.value.id,
      )
    }
    catch {
      $toast.error('Failed to delete blog.')
    }
  }
  itemToDelete.value = null
  isDeleteModalOpen.value = false
}

const handleBulkAction = async () => {
  if (selected.value.length && bulkAction.value === 'Delete All') {
    try {
      // Implement bulk delete logic here
      $toast.success('Selected items deleted successfully!')
      selected.value = []
    }
    catch {
      $toast.error('Failed to delete selected items.')
    }
  }
}

// Watchers
watch(page, () => {
  fetchBlogs()
})

watch(perPage, (val) => {
  pageSize.value = parseInt(val)
  page.value = 1
  fetchBlogs()
})

watch(searchQuery, () => {
  // Implement search logic here
  fetchBlogs()
})

watch(activeTab, () => {
  // Implement tab change logic here
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
