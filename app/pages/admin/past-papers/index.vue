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
      <v-text-field
        v-model="codeOrId"
        label="Code or ID"
        density="compact"
        hide-details
        clearable
        rounded="pill"
        variant="outlined"
        class="filter-field filter-field--small"
        @keyup.enter="search"
        @click:clear="clearCodeOrId"
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
      <v-btn
        rounded="pill"
        variant="text"
        height="40"
        prepend-icon="md:filter_alt_off"
        :disabled="!hasFilters"
        @click="clearFilters"
      >
        Clear
      </v-btn>
    </div>

    <!-- The papers' own details: board, grade and subject narrow each other; then type, session, variant and review. -->
    <div class="w-100 d-flex flex-wrap align-center ga-2 mt-2">
      <v-autocomplete
        v-model="filters.section"
        :items="boards"
        item-title="title"
        item-value="id"
        label="Board"
        density="compact"
        hide-details
        clearable
        rounded="pill"
        variant="outlined"
        class="filter-field"
        @update:model-value="changeBoard"
      />
      <v-autocomplete
        v-model="filters.base"
        :items="grades"
        item-title="title"
        item-value="id"
        label="Grade"
        density="compact"
        hide-details
        clearable
        rounded="pill"
        variant="outlined"
        class="filter-field"
        :disabled="!filters.section"
        :loading="loadingGrade"
        @update:model-value="changeGrade"
      />
      <v-autocomplete
        v-model="filters.lesson"
        :items="subjects"
        item-title="title"
        item-value="id"
        label="Subject"
        density="compact"
        hide-details
        clearable
        rounded="pill"
        variant="outlined"
        class="filter-field"
        :disabled="!filters.base"
        :loading="loadingSubject"
        @update:model-value="search"
      />
      <v-autocomplete
        v-model="filters.test_type"
        :items="classifications"
        item-title="title"
        item-value="id"
        label="Paper type"
        density="compact"
        hide-details
        clearable
        rounded="pill"
        variant="outlined"
        class="filter-field"
        :disabled="!filters.section"
        :loading="loadingClassification"
        @update:model-value="search"
      />
      <v-select
        v-model="filters.edu_year"
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
      <v-select
        v-model="filters.edu_month"
        :items="MONTH_LIST"
        item-title="title"
        item-value="id"
        label="Month"
        density="compact"
        hide-details
        clearable
        rounded="pill"
        variant="outlined"
        class="filter-field filter-field--small"
        @update:model-value="search"
      />
      <v-autocomplete
        v-model="filters.variant"
        :items="variants"
        item-title="title"
        item-value="id"
        label="Variant"
        density="compact"
        hide-details
        clearable
        rounded="pill"
        variant="outlined"
        class="filter-field filter-field--small"
        @update:model-value="search"
      />
      <v-select
        v-model="filters.is_paper"
        :items="PAPER_KINDS"
        item-title="title"
        item-value="value"
        label="Paper or not"
        density="compact"
        hide-details
        clearable
        rounded="pill"
        variant="outlined"
        class="filter-field filter-field--small"
        @update:model-value="search"
      />
      <v-select
        v-model="filters.refScore"
        :items="SCORES"
        item-title="title"
        item-value="value"
        label="Referee score"
        density="compact"
        hide-details
        clearable
        rounded="pill"
        variant="outlined"
        class="filter-field filter-field--small"
        @update:model-value="search"
      />
      <v-select
        v-model="filters.order"
        :items="ORDERS"
        item-title="title"
        item-value="value"
        label="Sort"
        density="compact"
        hide-details
        rounded="pill"
        variant="outlined"
        class="filter-field filter-field--small"
        @update:model-value="search"
      />
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
      max-width="760"
      scrollable
    >
      <v-card
        v-if="selected"
        rounded="lg"
      >
        <v-card-title class="text-wrap">
          Review: {{ selected.title }}
        </v-card-title>
        <v-card-text class="d-flex flex-column ga-4">
          <v-skeleton-loader
            v-if="loadingDetail"
            type="list-item-two-line, list-item-two-line, actions"
          />
          <v-alert
            v-else-if="!detail"
            type="warning"
            variant="tonal"
            density="compact"
          >
            The paper's details could not be loaded.
          </v-alert>
          <template v-else>
            <v-table density="compact">
              <tbody>
                <tr
                  v-for="row in detailRows"
                  :key="row.label"
                >
                  <th class="text-no-wrap">
                    {{ row.label }}
                  </th>
                  <td>{{ row.value }}</td>
                </tr>
              </tbody>
            </v-table>

            <div v-if="description">
              <div class="text-subtitle-2 mb-1">
                Description
              </div>
              <v-sheet
                border
                rounded
                class="pa-3 text-body-2 description"
              >
                {{ description }}
              </v-sheet>
            </div>

            <div>
              <div class="text-subtitle-2 mb-1">
                Files
              </div>
              <div
                v-if="paperFiles.length"
                class="d-flex flex-wrap ga-2"
              >
                <v-btn
                  v-for="file in paperFiles"
                  :key="file.key"
                  variant="tonal"
                  color="primary"
                  prepend-icon="md:open_in_new"
                  :loading="openingFile === file.key"
                  @click="openFile(file)"
                >
                  {{ file.label }}
                </v-btn>
              </div>
              <div
                v-else
                class="text-body-2 text-medium-emphasis"
              >
                No files.
              </div>
            </div>

            <v-alert
              v-if="detail.reviewNote"
              type="info"
              variant="tonal"
              density="compact"
              title="Last review note"
            >
              <div class="description">
                {{ detail.reviewNote }}
              </div>
            </v-alert>
            <v-divider />
          </template>

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
import type { AdminPastPaperDetailDTO, AdminPastPaperDTO, AdminPastPaperFileType, DataTableHeader } from '@/types'
import { MONTH_LIST, YEAR_LIST } from '~/constants/pastpaper'

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
const PAPER_KINDS = [{ title: 'Papers', value: 1 }, { title: 'Not papers', value: 0 }]
const ORDERS = [
  { title: 'Newest first', value: null },
  { title: 'ID, high to low', value: 'iddesc' },
  { title: 'ID, low to high', value: 'idasc' },
]
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
  getPaper,
  getFileLink,
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
  // A published paper's ID opens its public page; an unpublished one has none (its page answers 404).
  {
    title: 'ID',
    key: 'id',
    sortable: false,
    width: '7vw',
    type: 'link',
    target: '_blank',
    getTo: item => (Number(item.status) === 1 ? `/paper/${item.id}` : undefined),
  },
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
      { icon: 'md:fact_check', tooltip: 'Details and review', onClick: item => openReview(item) },
      { icon: 'md:edit', tooltip: 'Edit details and files', to: item => `/admin/past-papers/${item.id}/edit` },
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
const codeOrId = ref('')

const emptyFilters = () => ({
  section: null as string | number | null,
  base: null as string | number | null,
  lesson: null as string | number | null,
  test_type: null as string | number | null,
  edu_year: null as string | number | null,
  edu_month: null as string | number | null,
  variant: null as string | number | null,
  is_paper: null as number | null,
  refScore: null as number | null,
  order: null as string | null,
})
const filters = ref(emptyFilters())

const {
  data: boards,
  getData: getBoards,
  grades,
  getGrades,
  resetGrades,
  loadingGrade,
  subjects,
  getSubjects,
  resetSubjects,
  loadingSubject,
  classifications,
  getClassification,
  resetClassifications,
  loadingClassification,
} = useBoard()

// The variants (nv, 1, 2, A...), from the types list.
const variants = ref<{ id: string, title: string }[]>([])
const loadVariants = async () => {
  try {
    const response = await useApiService.get<ApiResult<{ id: string, title: string }[]>>('/api/v2/search/types', { type: 'variant' })
    variants.value = response.succeeded && Array.isArray(response.data) ? response.data : []
  }
  catch {
    variants.value = []
  }
}

const hasFilters = computed(() => !!codeOrId.value || Object.values(filters.value).some(value => value !== null && value !== ''))

const fetchPapers = async () => {
  // A number is a paper's id, anything else its code.
  const key = codeOrId.value?.trim() || ''
  await getData({
    page: page.value,
    pageSize: pageSize.value,
    status: status.value,
    title: title.value,
    ...filters.value,
    id: /^\d+$/.test(key) ? key : null,
    code: key && !/^\d+$/.test(key) ? key : null,
  })
}

const changeBoard = async (value: string | number | null) => {
  filters.value.base = null
  filters.value.lesson = null
  filters.value.test_type = null
  resetGrades()
  resetSubjects()
  resetClassifications()
  if (value) await Promise.all([getGrades(value), getClassification(value)])
  await search()
}

const changeGrade = async (value: string | number | null) => {
  filters.value.lesson = null
  resetSubjects()
  if (value) await getSubjects(value)
  await search()
}

const clearCodeOrId = async () => {
  codeOrId.value = ''
  await search()
}

const clearFilters = async () => {
  codeOrId.value = ''
  filters.value = emptyFilters()
  resetGrades()
  resetSubjects()
  resetClassifications()
  await search()
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

const detail = ref<AdminPastPaperDetailDTO | null>(null)
const loadingDetail = ref(false)

const openReview = async (item: AdminPastPaperDTO) => {
  selected.value = item
  reviewStatus.value = 1
  reviewNotes.value = ''
  score.value = Number(item.ref_score) || 0
  detail.value = null
  showReview.value = true
  loadingDetail.value = true
  const paper = await getPaper(item.id)
  // The dialog may have moved on to another paper meanwhile.
  if (selected.value?.id === item.id) {
    detail.value = paper
    loadingDetail.value = false
  }
}

const detailRows = computed(() => {
  const paper = detail.value
  if (!paper) return []
  const date = [paper.edu_month_title || paper.edu_month, paper.edu_year].filter(value => value && value !== '0').join(' ')
  return [
    { label: 'Owner', value: selected.value?.owner_name },
    { label: 'Status', value: STATUS_TITLES[Number(paper.status)] },
    { label: 'Board', value: paper.section_title },
    { label: 'Grade', value: paper.base_title },
    { label: 'Subject', value: paper.lesson_title },
    { label: 'Type', value: paper.test_type_title },
    { label: 'Date', value: date },
    { label: 'Variant', value: paper.variant && paper.variant !== '0' ? paper.variant : '' },
    { label: 'Sent', value: paper.subdate },
    { label: 'Last edited', value: paper.up_date },
  ].filter(row => row.value)
})

// The description comes HTML-escaped; shown as text, never as HTML.
const description = computed(() => {
  const text = detail.value?.description
  if (!text || !import.meta.client) return ''
  return new DOMParser().parseFromString(text, 'text/html').documentElement.textContent?.trim() ?? ''
})

interface PaperFileLink {
  key: string
  label: string
  type: AdminPastPaperFileType
  extraId?: string
}

const paperFiles = computed<PaperFileLink[]>(() => {
  const files = detail.value?.files
  if (!files) return []
  const pages = (value?: string) => (value && value !== '0' ? ` (${value} pages)` : '')
  const main: PaperFileLink[] = [
    files.pdf?.exist ? { key: 'pdf', label: `Question paper${pages(detail.value?.q_file_pages)}`, type: 'pdf' } : null,
    files.word?.exist ? { key: 'word', label: 'Question paper (Word)', type: 'word' } : null,
    files.answer?.exist ? { key: 'answer', label: `Answers${pages(detail.value?.a_file_pages)}`, type: 'answer' } : null,
  ].filter((file): file is PaperFileLink => file !== null)
  const extras = (files.extra ?? []).map(extra => ({
    key: `extra-${extra.id}`,
    label: extra.type_title || `Extra file ${extra.id}`,
    type: 'extra' as const,
    extraId: extra.id,
  }))
  return [...main, ...extras]
})

const openingFile = ref<string | null>(null)

// The tab is opened on the click itself and pointed at the signed link once it arrives: opened after the request, it
// would be blocked as a pop-up.
const openFile = async (file: PaperFileLink) => {
  if (!selected.value) return
  const tab = window.open('', '_blank')
  openingFile.value = file.key
  try {
    const url = await getFileLink(selected.value.id, file.type, file.extraId)
    if (url && tab) tab.location.href = url
    else if (url) window.open(url, '_blank', 'noopener')
    else tab?.close()
  }
  finally {
    openingFile.value = null
  }
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

onMounted(async () => {
  await Promise.all([fetchPapers(), getBoards(), loadVariants()])
})
</script>

<style scoped>
.filter-field {
  min-width: 200px;
  max-width: 280px;
}

.filter-field--small {
  min-width: 150px;
  max-width: 180px;
}

.description {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
</style>
