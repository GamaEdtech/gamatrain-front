<template>
  <div class="w-100 h-100 d-flex flex-column align-start justify-start">
    <div class="w-100 d-flex flex-wrap align-center ga-2">
      <v-select
        v-model="status"
        :items="statusFilters"
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
      <admin-common-type-filters
        v-model:board-id="boardId"
        v-model:grade-id="gradeId"
        v-model:subject-id="subjectId"
        @change="search"
      />
      <v-autocomplete
        v-model="examTypeId"
        :items="examTypes"
        item-title="title"
        item-value="id"
        label="Exam type"
        density="compact"
        hide-details
        clearable
        rounded="pill"
        variant="outlined"
        class="filter-field filter-field--small"
        @update:model-value="search"
      />
      <v-select
        v-model="combination"
        :items="COMBINATIONS"
        item-title="title"
        item-value="value"
        label="Questions"
        density="compact"
        hide-details
        clearable
        rounded="pill"
        variant="outlined"
        class="filter-field filter-field--small"
        @update:model-value="search"
      />
      <v-select
        v-model="open"
        :items="OPEN_STATES"
        item-title="title"
        item-value="value"
        label="Open now"
        density="compact"
        hide-details
        clearable
        rounded="pill"
        variant="outlined"
        class="filter-field filter-field--small"
        @update:model-value="search"
      />
      <v-select
        v-model="year"
        :items="YEAR_LIST"
        label="Year"
        density="compact"
        hide-details
        clearable
        rounded="pill"
        variant="outlined"
        class="filter-field filter-field--small"
        @update:model-value="search"
      />
      <v-text-field
        v-model="text"
        label="Title, code or id"
        density="compact"
        hide-details
        clearable
        rounded="pill"
        variant="outlined"
        class="filter-field"
        @keyup.enter="search"
        @click:clear="text = ''; search()"
      />
      <v-checkbox
        v-model="includeDeleted"
        label="Deleted too"
        density="compact"
        hide-details
        @update:model-value="search"
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
      :items="items"
      :page-count="Math.ceil(total / pageSize)"
      :total-count="total"
      :page-size-options="pageSizes"
      :loading="loading"
      item-label="Exams"
      class="mt-4"
      @update:page="fetch"
      @update:page-size="search"
    />

    <admin-common-delete-modal
      v-model="showDelete"
      :loading="saving"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import type { AdminExamItemDTO, DataTableHeader } from '@/types'
import { EXAM_STATUSES } from '@/types'
import { ADMIN_PERMISSIONS } from '~/constants'
import { YEAR_LIST } from '~/constants/pastpaper'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

useHead({ title: 'Exams' })

const { can } = useAdminAccess()
const { loading, saving, getExams, setExamStatus, deleteExam } = useExamAdmin()

const statusFilters = [{ title: 'All', value: null }, ...Object.entries(EXAM_STATUSES).map(([value, title]) => ({ title, value: Number(value) }))]
const statusColor = (status: number) => ([1, 5, 7].includes(status) ? 'success' : status === 2 ? 'error' : status === 6 ? 'grey' : 'warning')

const headers: DataTableHeader<AdminExamItemDTO>[] = [
  { title: 'ID', key: 'id', sortable: false, width: '6vw' },
  { title: 'Title', key: 'title', sortable: false, width: '24vw' },
  { title: 'Subject', key: 'subjectTitle', sortable: false, width: '12vw', emptyText: '-' },
  { title: 'Type', key: 'examTypeTitle', sortable: false, width: '8vw', emptyText: '-' },
  { title: 'Questions', key: 'questionCount', sortable: false, width: '6vw' },
  { title: 'Taken', key: 'participantCount', sortable: false, width: '5vw' },
  { title: 'Owner', key: 'ownerName', sortable: false, width: '10vw', emptyText: '-' },
  { title: 'Changed', key: 'lastModifyDate', sortable: false, width: '10vw', type: 'date', dateFormat: 'DD/MM/YYYY HH:mm' },
  {
    title: 'Status',
    key: 'status',
    sortable: false,
    width: '8vw',
    type: 'chip',
    getText: item => (item.isDeleted ? 'Deleted' : EXAM_STATUSES[item.status] ?? String(item.status)),
    getChipColor: item => (item.isDeleted ? 'error' : statusColor(item.status)),
  },
  {
    title: 'Action',
    key: 'Action',
    sortable: false,
    width: '11vw',
    type: 'actions',
    actions: [
      { icon: 'md:edit', tooltip: 'Open', href: item => `/admin/exams/${item.id}`, show: () => can(ADMIN_PERMISSIONS.exams.detail) },
      { icon: 'md:publish', tooltip: 'Publish', onClick: item => changeStatus(item, 1), show: item => !item.isDeleted && ![1, 5, 7].includes(item.status) && can(ADMIN_PERMISSIONS.exams.status) },
      { icon: 'md:visibility', tooltip: 'View', href: item => `/exam/${item.id}`, target: '_blank', show: item => !item.isDeleted && [1, 5, 7].includes(item.status) },
      { icon: 'md:delete', tooltip: 'Delete', onClick: item => openDelete(item), show: item => !item.isDeleted && can(ADMIN_PERMISSIONS.exams.remove) },
    ],
  },
]

const items = ref<AdminExamItemDTO[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)
const pageSizes = [{ label: '20 Rows', value: 20 }, { label: '50 Rows', value: 50 }, { label: '100 Rows', value: 100 }]
const status = ref<number | null>(null)
const boardId = ref<string | null>(null)
const gradeId = ref<string | null>(null)
const subjectId = ref<string | null>(null)
const text = ref('')
const includeDeleted = ref(false)
const examTypeId = ref<string | null>(null)
const combination = ref<number | null>(null)
const open = ref<boolean | null>(null)
const year = ref<number | null>(null)

// gama-api's question combination: from albums (other teachers' questions), the owner's own, or both.
const COMBINATIONS = [{ title: 'From albums', value: 1 }, { title: 'Own questions', value: 2 }, { title: 'Mixed', value: 3 }]
// Open: no dates, or now between its start and end.
const OPEN_STATES = [{ title: 'Open now', value: true }, { title: 'Not open now', value: false }]

// The exam types (Multiple Choice, Paper 1...), from the types list.
const examTypes = ref<{ id: string, title: string }[]>([])
const loadExamTypes = async () => {
  try {
    const response = await useApiService.get<ApiResult<{ id: string, title: string }[]>>('/api/v2/search/types', { type: 'exam_type' })
    examTypes.value = response.succeeded && Array.isArray(response.data) ? response.data.map(item => ({ id: String(item.id), title: item.title })) : []
  }
  catch {
    examTypes.value = []
  }
}

const fetch = async () => {
  const data = await getExams({
    page: page.value,
    pageSize: pageSize.value,
    status: status.value,
    boardId: boardId.value,
    gradeId: gradeId.value,
    subjectId: subjectId.value,
    text: text.value,
    examTypeId: examTypeId.value,
    combination: combination.value,
    open: open.value,
    year: year.value,
    includeDeleted: includeDeleted.value || null,
  })
  items.value = data.items
  total.value = data.total
}

const search = async () => {
  page.value = 1
  await fetch()
}

const changeStatus = async (item: AdminExamItemDTO, value: number) => {
  if (await setExamStatus(item.id, value)) await fetch()
}

const selected = ref<AdminExamItemDTO | null>(null)
const showDelete = ref(false)
const openDelete = (item: AdminExamItemDTO) => {
  selected.value = item
  showDelete.value = true
}

const confirmDelete = async () => {
  if (selected.value && await deleteExam(selected.value.id)) {
    showDelete.value = false
    await fetch()
  }
}

onMounted(async () => {
  await Promise.all([fetch(), loadExamTypes()])
})
</script>

<style scoped>
.filter-field--small {
  min-width: 150px;
  max-width: 180px;
}

.filter-field {
  min-width: 170px;
  max-width: 250px;
}
</style>
