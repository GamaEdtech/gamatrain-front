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
        v-model="contentType"
        :items="TYPES"
        item-title="title"
        item-value="value"
        label="About"
        density="compact"
        hide-details
        clearable
        rounded="pill"
        variant="outlined"
        class="filter-field"
        @update:model-value="search"
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
      item-label="Reports"
      class="mt-4"
      @update:page="fetch"
      @update:page-size="search"
    />

    <!-- Closing (or reopening) takes an optional note on what was done. Closing an open report emails the reporter the
         outcome (Settings > Report Fixed / Dismissed Email); the note stays with staff. -->
    <v-dialog
      v-model="showClose"
      max-width="480"
    >
      <v-card
        rounded="xl"
        class="pa-4"
      >
        <v-card-title class="text-h6">
          {{ closingTitle }}
        </v-card-title>
        <v-card-text>
          <p class="text-body-2 text-grey700 mb-3 message">
            {{ closing?.message }}
          </p>
          <v-alert
            v-if="closingStatus !== 'Open' && closing && name(closing.status) === 'Open'"
            type="info"
            variant="tonal"
            density="compact"
            class="mb-3"
          >
            {{ closingStatus === 'Resolved'
              ? 'The reporter gets an email that the problem was fixed.'
              : 'The reporter gets an email that nothing needed to change.' }}
          </v-alert>
          <v-textarea
            v-model="note"
            label="Note (optional)"
            hint="For staff only. It is not sent to the reporter."
            persistent-hint
            variant="outlined"
            rows="2"
            counter="500"
            maxlength="500"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="showClose = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            :loading="saving"
            @click="confirmClose"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import type { ApiResult, DataTableHeader } from '@/types'

// "Report a problem" from papers, exams, questions, tutorials, multimedia and Q&A, for staff to resolve or dismiss.
definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

useHead({ title: 'Problem reports' })

type Named = string | { name: string }

interface ReportRow {
  id: number
  contentType: Named
  contentId: number
  contentTitle: string | null
  reportType: number
  message: string | null
  userName: string | null
  status: Named
  adminNote: string | null
  creationDate: string
  closedDate: string | null
}

const STATUSES = [{ title: 'Open', value: 'Open' }, { title: 'Resolved', value: 'Resolved' }, { title: 'Dismissed', value: 'Dismissed' }, { title: 'All', value: null }]
const TYPES = [
  { title: 'Papers', value: 'Paper' },
  { title: 'Exams', value: 'Exam' },
  { title: 'Exam questions', value: 'ExamQuestion' },
  { title: 'Tutorials', value: 'Tutorial' },
  { title: 'Multimedia', value: 'Multimedia' },
  { title: 'Q&A', value: 'Question' },
]
// The pages' lists: a question in an exam's results has its own.
const PROBLEMS: Record<number, string> = { 1: 'Cannot download', 2: 'Wrong file', 3: 'Inappropriate or incorrect content' }
const name = (value: Named) => (typeof value === 'string' ? value : value?.name ?? '')

// Where the reported item is: its public page, or the question editor.
const itemLink = (item: ReportRow) => {
  switch (name(item.contentType)) {
    case 'Paper': return `/paper/${item.contentId}`
    case 'Exam': return `/exam/${item.contentId}`
    case 'ExamQuestion': return `/admin/exam-questions/edit/${item.contentId}`
    case 'Tutorial': return `/tutorial/${item.contentId}`
    case 'Multimedia': return `/multimedia/${item.contentId}`
    case 'Question': return `/qa/${item.contentId}`
    default: return undefined
  }
}

const { handleApiResponseError, handleApiCatchError } = useApiErrorHandler()
const { $toast } = useNuxtApp()

const headers: DataTableHeader<ReportRow>[] = [
  { title: 'Date', key: 'creationDate', sortable: false, width: '9vw', type: 'date', dateFormat: 'DD/MM/YYYY HH:mm' },
  { title: 'About', key: 'contentType', sortable: false, width: '7vw', getText: item => TYPES.find(t => t.value === name(item.contentType))?.title ?? name(item.contentType) },
  {
    title: 'Item',
    key: 'contentTitle',
    sortable: false,
    width: '16vw',
    type: 'link',
    target: '_blank',
    getText: item => item.contentTitle || `#${item.contentId}`,
    getTo: itemLink,
  },
  {
    title: 'Problem',
    key: 'reportType',
    sortable: false,
    width: '9vw',
    getText: item => (name(item.contentType) === 'ExamQuestion' ? `Answer key (${item.reportType})` : PROBLEMS[item.reportType] ?? String(item.reportType)),
  },
  { title: 'Description', key: 'message', sortable: false, width: '24vw', emptyText: '-' },
  { title: 'By', key: 'userName', sortable: false, width: '9vw', emptyText: '-' },
  {
    title: 'Status',
    key: 'status',
    sortable: false,
    width: '7vw',
    type: 'chip',
    getText: item => name(item.status),
    getChipColor: item => ({ Open: 'warning', Resolved: 'success', Dismissed: 'grey' } as Record<string, string>)[name(item.status)] ?? 'grey',
  },
  {
    title: 'Action',
    key: 'Action',
    sortable: false,
    width: '7vw',
    type: 'actions',
    actions: [
      { icon: 'md:task_alt', tooltip: 'Resolved', show: item => name(item.status) === 'Open', onClick: item => openClose(item, 'Resolved') },
      { icon: 'md:do_not_disturb_on', tooltip: 'Dismiss', show: item => name(item.status) === 'Open', onClick: item => openClose(item, 'Dismissed') },
      { icon: 'md:undo', tooltip: 'Reopen', show: item => name(item.status) !== 'Open', onClick: item => openClose(item, 'Open') },
    ],
  },
]

const items = ref<ReportRow[]>([])
const total = ref(0)
const loading = ref(false)
const saving = ref(false)
const page = ref(1)
const pageSize = ref(20)
const pageSizes = [{ label: '20 Rows', value: 20 }, { label: '50 Rows', value: 50 }, { label: '100 Rows', value: 100 }]
const status = ref<string | null>('Open')
const contentType = ref<string | null>(null)

const fetch = async () => {
  loading.value = true
  try {
    const query: Record<string, string | number> = { page: page.value, pageSize: pageSize.value }
    if (status.value) query.status = status.value
    if (contentType.value) query.contentType = contentType.value
    const response = await useApiService.get<ApiResult<{ total: number, items: ReportRow[] }>>('/api/v2/admin/reports', query)
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

const showClose = ref(false)
const closing = ref<ReportRow | null>(null)
const closingStatus = ref('Resolved')
const note = ref('')
const closingTitle = computed(() => ({ Resolved: 'Mark as resolved', Dismissed: 'Dismiss this report', Open: 'Reopen this report' } as Record<string, string>)[closingStatus.value])

const openClose = (item: ReportRow, value: string) => {
  closing.value = item
  closingStatus.value = value
  note.value = ''
  showClose.value = true
}

const confirmClose = async () => {
  if (!closing.value) return
  saving.value = true
  try {
    const response = await useApiService.put<ApiResult<boolean>>(`/api/v2/admin/reports/${closing.value.id}/status`, { status: closingStatus.value, note: note.value })
    if (response.succeeded) {
      $toast.success('Saved.')
      showClose.value = false
      await fetch()
    }
    else {
      handleApiResponseError(response)
    }
  }
  catch (err: unknown) {
    handleApiCatchError(err)
  }
  finally {
    saving.value = false
  }
}

onMounted(fetch)
</script>

<style scoped>
.filter-field {
  min-width: 170px;
  max-width: 220px;
}

.message {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
</style>
