<template>
  <div class="w-100 h-100 d-flex flex-column align-start justify-start">
    <div class="w-100 d-flex flex-wrap align-center ga-2">
      <v-select
        v-model="status"
        :items="STATUS_FILTERS"
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
      <v-text-field
        v-model="title"
        label="Title"
        density="compact"
        hide-details
        clearable
        rounded="pill"
        variant="outlined"
        class="filter-field"
        @keyup.enter="search"
        @click:clear="clearTitle"
      />
      <v-btn
        rounded="pill"
        color="primary"
        flat
        height="40"
        @click="search"
      >
        Search
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
      item-label="Past papers"
      class="mt-4"
      @update:page="changePageNumber"
      @update:page-size="changePageSize"
    >
      <template #actions>
        <v-btn
          size="small"
          flat
          icon
          color="info"
          :loading="loading"
          @click="fetchPapers"
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

    <admin-common-delete-modal
      v-model="showDeleteModal"
      :loading="loadingDeleteItem"
      @confirm="confirmDelete"
    />

    <v-dialog
      v-model="showReview"
      max-width="560"
    >
      <v-card
        v-if="selected"
        rounded="lg"
      >
        <v-card-title class="text-wrap">
          Review: {{ selected.title }}
        </v-card-title>
        <v-card-text class="d-flex flex-column ga-4">
          <v-select
            v-model="reviewStatus"
            :items="REVIEW_STATUSES"
            item-title="title"
            item-value="value"
            label="Status"
            density="compact"
            hide-details
            variant="outlined"
          />
          <v-textarea
            v-model="reviewNotes"
            label="Notes for the teacher (one per line)"
            :hint="reviewStatus === 1 ? 'Optional when confirming.' : 'Required: what the teacher should change.'"
            persistent-hint
            rows="4"
            variant="outlined"
          />
          <v-select
            v-model="score"
            :items="SCORES"
            item-title="title"
            item-value="value"
            label="Referee score"
            density="compact"
            hide-details
            variant="outlined"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="showReview = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            :loading="loadingReview"
            @click="saveReview"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import type { AdminPastPaperDTO, DataTableHeader } from '@/types'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

const STATUS_TITLES: Record<number, string> = {
  0: 'Waiting for review',
  1: 'Confirmed',
  2: 'Rejected',
  3: 'Needs changes',
  4: 'Deactivated',
  5: 'Deleted',
  6: 'Edited',
}
const STATUS_FILTERS = [{ title: 'All', value: null }, ...[0, 6, 3, 1, 2, 4].map(value => ({ title: STATUS_TITLES[value]!, value }))]
const REVIEW_STATUSES = [1, 3, 2, 4, 0].map(value => ({ title: STATUS_TITLES[value]!, value }))
const SCORES = [
  { title: 'None', value: 0 },
  { title: 'D', value: 1 },
  { title: 'C', value: 2 },
  { title: 'B', value: 3 },
  { title: 'A', value: 4 },
  { title: 'A+', value: 5 },
]

const {
  data: list,
  totalCount,
  pageCount,
  loadingGetData: loading,
  loadingReview,
  loadingDeleteItem,
  getData,
  review,
  setScore,
  deleteItem,
} = usePastPaperAdmin()

const statusColor = (value: string) => {
  const status = Number(value)
  if (status === 1) return 'success'
  if (status === 2 || status === 4) return 'error'
  if (status === 3) return 'info'
  return 'warning'
}

const headers: DataTableHeader<AdminPastPaperDTO>[] = [
  { title: 'ID', key: 'id', sortable: false, width: '7vw' },
  { title: 'Title', key: 'title', sortable: false, width: '25vw' },
  { title: 'Subject', key: 'lesson_title', sortable: false, width: '14vw' },
  { title: 'Owner', key: 'owner_name', sortable: false, width: '12vw', emptyText: '-' },
  { title: 'Score', key: 'ref_score', sortable: false, width: '5vw' },
  { title: 'Date', key: 'subdate', sortable: false, width: '12vw', type: 'date', dateFormat: 'DD/MM/YYYY HH:mm' },
  {
    title: 'Status',
    key: 'status',
    sortable: false,
    width: '10vw',
    type: 'chip',
    getText: item => STATUS_TITLES[Number(item.status)] ?? 'Unknown',
    getChipColor: item => statusColor(item.status),
  },
  {
    title: 'Action',
    key: 'Action',
    sortable: false,
    width: '12vw',
    type: 'actions',
    actions: [
      { icon: 'md:fact_check', tooltip: 'Review', onClick: item => openReview(item) },
      { icon: 'md:visibility', tooltip: 'View', href: item => `/paper/${item.id}`, target: '_blank', show: item => Number(item.status) === 1 },
      { icon: 'md:delete', tooltip: 'Delete', onClick: item => openDelete(item) },
    ],
  },
]

const page = ref(1)
const pageSize = ref(20)
const allPageSize = [
  { label: '10 Rows', value: 10 },
  { label: '20 Rows', value: 20 },
  { label: '50 Rows', value: 50 },
]
const status = ref<number | null>(0)
const title = ref('')

const fetchPapers = async () => {
  await getData({ page: page.value, pageSize: pageSize.value, status: status.value, title: title.value })
}

const search = async () => {
  page.value = 1
  await fetchPapers()
}

const clearTitle = async () => {
  title.value = ''
  await search()
}

const changePageNumber = async (value: number) => {
  page.value = value
  await fetchPapers()
}

const changePageSize = async (value: number) => {
  pageSize.value = value
  page.value = 1
  await fetchPapers()
}

const selected = ref<AdminPastPaperDTO | null>(null)
const showReview = ref(false)
const reviewStatus = ref(1)
const reviewNotes = ref('')
const score = ref(0)

const openReview = (item: AdminPastPaperDTO) => {
  selected.value = item
  reviewStatus.value = 1
  reviewNotes.value = ''
  score.value = Number(item.ref_score) || 0
  showReview.value = true
}

const saveReview = async () => {
  if (!selected.value) return
  const id = selected.value.id
  const notes = reviewNotes.value.split('\n').map(line => line.replace(/^-\s*/, '').trim()).filter(Boolean)
  if (score.value !== (Number(selected.value.ref_score) || 0) && !(await setScore(id, score.value))) return
  if (await review(id, { status: reviewStatus.value, notes })) {
    showReview.value = false
    await fetchPapers()
  }
}

const showDeleteModal = ref(false)
const openDelete = (item: AdminPastPaperDTO) => {
  selected.value = item
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (selected.value && await deleteItem(selected.value.id)) {
    showDeleteModal.value = false
    await fetchPapers()
  }
}

onMounted(fetchPapers)
</script>

<style scoped>
.filter-field {
  min-width: 200px;
  max-width: 280px;
}
</style>
