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
      <v-select
        v-model="type"
        :items="[{ title: 'All types', value: null }, ...QUESTION_TYPES]"
        item-title="title"
        item-value="value"
        label="Type"
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
        v-model:topic-id="topicId"
        with-topic
        @change="search"
      />
      <v-text-field
        v-model="text"
        label="Text, code or id"
        density="compact"
        hide-details
        clearable
        rounded="pill"
        variant="outlined"
        class="filter-field"
        @keyup.enter="search"
        @click:clear="text = ''; search()"
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
      <v-spacer />
      <v-btn
        v-if="can(ADMIN_PERMISSIONS.examQuestions.create)"
        rounded="pill"
        color="success"
        flat
        height="40"
        prepend-icon="md:add"
        to="/admin/exam-questions/edit/new"
      >
        Add question
      </v-btn>
    </div>

    <common-data-table
      ref="table"
      v-model:page="page"
      v-model:page-size="pageSize"
      :headers="headers"
      :items="items"
      :page-count="Math.ceil(total / pageSize)"
      :total-count="total"
      :page-size-options="pageSizes"
      :loading="loading"
      item-label="Questions"
      class="mt-4"
      @update:page="fetch"
      @update:page-size="search"
    >
      <!-- The excerpt keeps the question's TeX ($...$), typeset by MathJax after each load. Keyed by its text so a new
           page gets a fresh element: MathJax replaces the text node Vue would otherwise update. -->
      <template #[`item.excerpt`]="{ item }">
        <span :key="`${item.id}:${item.excerpt}`">{{ item.excerpt || '-' }}</span>
      </template>
    </common-data-table>

    <admin-common-delete-modal
      v-model="showDelete"
      :loading="saving"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import type { AdminExamQuestionItemDTO, DataTableHeader } from '@/types'
import { QUESTION_STATUSES, QUESTION_TYPES } from '@/types'
import { ADMIN_PERMISSIONS } from '~/constants'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

useHead({ title: 'Question bank' })

const { can } = useAdminAccess()
const { loading, saving, getQuestions, setQuestionStatus, deleteQuestion } = useExamAdmin()
const renderMath = useMathJaxRender()
const table = useTemplateRef<{ $el: HTMLElement }>('table')

const statusFilters = [{ title: 'All', value: null }, ...Object.entries(QUESTION_STATUSES).map(([value, title]) => ({ title, value: Number(value) }))]
const statusColor = (status: number) => (status === 1 ? 'success' : status === 2 ? 'error' : 'warning')

const headers: DataTableHeader<AdminExamQuestionItemDTO>[] = [
  { title: 'ID', key: 'id', sortable: false, width: '6vw' },
  { title: 'Question', key: 'excerpt', sortable: false, width: '30vw', emptyText: '-' },
  { title: 'Subject', key: 'subjectTitle', sortable: false, width: '11vw', emptyText: '-' },
  { title: 'Topic', key: 'topicTitle', sortable: false, width: '11vw', emptyText: '-' },
  { title: 'Type', key: 'type', sortable: false, width: '7vw', emptyText: '-' },
  { title: 'Answer', key: 'trueAnswer', sortable: false, width: '4vw', emptyText: '-' },
  { title: 'Created', key: 'creationDate', sortable: false, width: '9vw', type: 'date', dateFormat: 'DD/MM/YYYY HH:mm' },
  { title: 'Changed', key: 'lastModifyDate', sortable: false, width: '9vw', type: 'date', dateFormat: 'DD/MM/YYYY HH:mm', emptyText: '-' },
  {
    title: 'Status',
    key: 'status',
    sortable: false,
    width: '7vw',
    type: 'chip',
    getText: item => QUESTION_STATUSES[item.status] ?? String(item.status),
    getChipColor: item => statusColor(item.status),
  },
  {
    title: 'Action',
    key: 'Action',
    sortable: false,
    width: '10vw',
    type: 'actions',
    actions: [
      { icon: 'md:edit', tooltip: 'Edit', href: item => `/admin/exam-questions/edit/${item.id}`, show: () => can(ADMIN_PERMISSIONS.examQuestions.detail) },
      { icon: 'md:check_circle', tooltip: 'Confirm', onClick: item => changeStatus(item, 1), show: item => item.status !== 1 && can(ADMIN_PERMISSIONS.examQuestions.status) },
      { icon: 'md:visibility', tooltip: 'View', href: item => `/test/${item.code}`, target: '_blank', show: item => item.status === 1 && !!item.code },
      { icon: 'md:delete', tooltip: 'Delete', onClick: item => openDelete(item), show: () => can(ADMIN_PERMISSIONS.examQuestions.remove) },
    ],
  },
]

const items = ref<AdminExamQuestionItemDTO[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)
const pageSizes = [{ label: '20 Rows', value: 20 }, { label: '50 Rows', value: 50 }, { label: '100 Rows', value: 100 }]
const status = ref<number | null>(null)
const type = ref<number | null>(null)
const boardId = ref<string | null>(null)
const gradeId = ref<string | null>(null)
const subjectId = ref<string | null>(null)
const topicId = ref<string | null>(null)
const text = ref('')

const fetch = async () => {
  const data = await getQuestions({
    page: page.value,
    pageSize: pageSize.value,
    status: status.value,
    type: type.value,
    boardId: boardId.value,
    subjectId: subjectId.value,
    topicId: topicId.value,
    text: text.value,
  })
  items.value = data.items
  total.value = data.total
  await nextTick()
  await renderMath(table.value?.$el)
}

const search = async () => {
  page.value = 1
  await fetch()
}

const changeStatus = async (item: AdminExamQuestionItemDTO, value: number) => {
  if (await setQuestionStatus(item.id, value)) await fetch()
}

const selected = ref<AdminExamQuestionItemDTO | null>(null)
const showDelete = ref(false)
const openDelete = (item: AdminExamQuestionItemDTO) => {
  selected.value = item
  showDelete.value = true
}

const confirmDelete = async () => {
  if (selected.value && await deleteQuestion(selected.value.id)) {
    showDelete.value = false
    await fetch()
  }
}

onMounted(fetch)
</script>

<style scoped>
.filter-field {
  min-width: 160px;
  max-width: 240px;
}
</style>
