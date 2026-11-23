<template>
  <div class="w-100 h-100 d-flex flex-column align-start justify-start">
    <div class="w-100 d-flex flex-wrap align-center ga-2">
      <v-select
        v-model="status"
        :items="STATUSES"
        item-title="title"
        item-value="value"
        label="Status"
        density="compact"
        hide-details
        rounded="pill"
        variant="outlined"
        class="filter-field"
        @update:model-value="search"
      />
      <v-select
        v-model="withComment"
        :items="COMMENT_FILTERS"
        item-title="title"
        item-value="value"
        label="Comment"
        density="compact"
        hide-details
        clearable
        rounded="pill"
        variant="outlined"
        class="filter-field"
        @update:model-value="search"
      />
      <v-text-field
        v-model="examId"
        label="Exam id"
        type="number"
        density="compact"
        hide-details
        clearable
        rounded="pill"
        variant="outlined"
        class="filter-field"
        @keyup.enter="search"
        @click:clear="examId = ''; search()"
      />
    </div>

    <common-data-table
      v-model:page="page"
      v-model:page-size="pageSize"
      :headers="headers"
      :items="items"
      :page-count="Math.ceil(total / pageSize)"
      :total-count="total"
      :page-size-options="pageSizes"
      :loading="loading"
      item-label="Reviews"
      class="mt-4"
      @update:page="fetch"
      @update:page-size="search"
    />

    <!-- Hiding asks for an optional note the author sees. -->
    <v-dialog
      v-model="showHide"
      max-width="480"
    >
      <v-card
        rounded="xl"
        class="pa-4"
      >
        <v-card-title class="text-h6">
          Hide this review
        </v-card-title>
        <v-card-text>
          <v-textarea
            v-model="note"
            label="Note for its author (optional)"
            variant="outlined"
            rows="2"
            counter="300"
            maxlength="300"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="showHide = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            variant="flat"
            :loading="saving"
            @click="confirmHide"
          >
            Hide
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import type { ApiResult, DataTableHeader } from '@/types'

// Exam reviews are public at once; staff hide a bad one here (and can show it again).
definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

useHead({ title: 'Exam reviews' })

interface ReviewRow {
  id: number
  examId: number
  examTitle: string | null
  userName: string | null
  rating: number
  comment: string | null
  status: string | { name: string }
  rejectionComment: string | null
  creationDate: string
  lastModifyDate: string | null
}

const STATUSES = [{ title: 'Shown', value: 'Confirmed' }, { title: 'Hidden', value: 'Rejected' }, { title: 'All', value: null }]
const COMMENT_FILTERS = [{ title: 'With comment', value: true }, { title: 'Rating only', value: false }]
const statusName = (value: ReviewRow['status']) => (typeof value === 'string' ? value : value?.name ?? '')

const { handleApiResponseError, handleApiCatchError } = useApiErrorHandler()
const { $toast } = useNuxtApp()

const headers: DataTableHeader<ReviewRow>[] = [
  { title: 'Date', key: 'creationDate', sortable: false, width: '9vw', type: 'date', dateFormat: 'DD/MM/YYYY HH:mm' },
  {
    title: 'Exam',
    key: 'examTitle',
    sortable: false,
    width: '18vw',
    type: 'link',
    target: '_blank',
    getText: item => item.examTitle || `#${item.examId}`,
    getTo: item => `/exam/${item.examId}`,
  },
  { title: 'By', key: 'userName', sortable: false, width: '10vw', emptyText: '-' },
  { title: 'Stars', key: 'rating', sortable: false, width: '5vw', getText: item => '★'.repeat(item.rating) },
  { title: 'Comment', key: 'comment', sortable: false, width: '26vw', emptyText: '-' },
  {
    title: 'Status',
    key: 'status',
    sortable: false,
    width: '7vw',
    type: 'chip',
    getText: item => (statusName(item.status) === 'Rejected' ? 'Hidden' : 'Shown'),
    getChipColor: item => (statusName(item.status) === 'Rejected' ? 'error' : 'success'),
  },
  {
    title: 'Action',
    key: 'Action',
    sortable: false,
    width: '6vw',
    type: 'actions',
    actions: [
      { icon: 'md:visibility_off', tooltip: 'Hide', show: item => statusName(item.status) !== 'Rejected', onClick: item => openHide(item) },
      { icon: 'md:visibility', tooltip: 'Show again', show: item => statusName(item.status) === 'Rejected', onClick: item => moderate(item.id, true) },
    ],
  },
]

const items = ref<ReviewRow[]>([])
const total = ref(0)
const loading = ref(false)
const saving = ref(false)
const page = ref(1)
const pageSize = ref(20)
const pageSizes = [{ label: '20 Rows', value: 20 }, { label: '50 Rows', value: 50 }, { label: '100 Rows', value: 100 }]
const status = ref<string | null>('Confirmed')
const withComment = ref<boolean | null>(true)
const examId = ref('')

const fetch = async () => {
  loading.value = true
  try {
    const query: Record<string, string | number | boolean> = { page: page.value, pageSize: pageSize.value }
    if (status.value) query.status = status.value
    if (withComment.value !== null) query.withComment = withComment.value
    if (examId.value) query.examId = examId.value
    const response = await useApiService.get<ApiResult<{ total: number, items: ReviewRow[] }>>('/api/v2/admin/exams/reviews', query)
    if (response.succeeded && response.data) {
      items.value = response.data.items
      total.value = response.data.total
    }
    else {
      handleApiResponseError(response)
    }
  }
  catch (err: unknown) {
    handleApiCatchError(err)
  }
  finally {
    loading.value = false
  }
}

const search = async () => {
  page.value = 1
  await fetch()
}

const moderate = async (id: number, confirm: boolean, rejectionComment?: string) => {
  saving.value = true
  try {
    const response = await useApiService.put<ApiResult<boolean>>(`/api/v2/admin/exams/reviews/${id}/status`, { confirm, rejectionComment })
    if (response.succeeded) {
      $toast.success(confirm ? 'Review shown.' : 'Review hidden.')
      await fetch()
      return true
    }
    handleApiResponseError(response)
  }
  catch (err: unknown) {
    handleApiCatchError(err)
  }
  finally {
    saving.value = false
  }
  return false
}

const showHide = ref(false)
const note = ref('')
const hiding = ref<ReviewRow | null>(null)
const openHide = (item: ReviewRow) => {
  hiding.value = item
  note.value = ''
  showHide.value = true
}

const confirmHide = async () => {
  if (hiding.value && await moderate(hiding.value.id, false, note.value)) showHide.value = false
}

onMounted(fetch)
</script>

<style scoped>
.filter-field {
  min-width: 170px;
  max-width: 220px;
}
</style>
