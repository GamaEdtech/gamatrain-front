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
      <v-autocomplete
        v-model="boardId"
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
        v-model="gradeId"
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
        :disabled="!boardId"
        @update:model-value="changeGrade"
      />
      <v-autocomplete
        v-model="subjectId"
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
        :disabled="!gradeId"
        @update:model-value="search"
      />
      <v-text-field
        v-model="title"
        label="Title, keyword or id"
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
      <v-spacer />
      <v-btn
        v-if="can(ADMIN_PERMISSIONS.tutorials.create)"
        rounded="pill"
        color="success"
        flat
        height="40"
        prepend-icon="md:add"
        to="/admin/tutorials/edit/new"
      >
        Add tutorial
      </v-btn>
    </div>

    <common-data-table
      v-model:page="page"
      v-model:page-size="pageSize"
      :headers="headers"
      :items="list"
      :page-count="pageCount"
      :total-count="totalCount"
      :page-size-options="allPageSize"
      :loading="loadingList"
      item-label="Tutorials"
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
          :loading="loadingList"
          @click="fetchTutorials"
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
      :loading="loadingDelete"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import type { AdminTutorialDTO, DataTableHeader, TutorialStatus, TypeItemDTO } from '@/types'
import { ADMIN_PERMISSIONS } from '~/constants'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

useHead({ title: 'Tutorials' })

const STATUS_TITLES: Record<TutorialStatus, string> = {
  Pending: 'Waiting',
  Confirmed: 'Published',
  Rejected: 'Rejected',
  NeedsChanges: 'Needs changes',
  Deactivated: 'Deactivated',
}
const STATUS_FILTERS = [
  { title: 'All', value: null },
  ...(Object.keys(STATUS_TITLES) as TutorialStatus[]).map(value => ({ title: STATUS_TITLES[value], value })),
]

const { can } = useAdminAccess()
const { list, totalCount, pageCount, loadingList, loadingDelete, getList, setStatus, remove } = useTutorialAdmin()
const typeLists = useTypeLists()

const statusColor = (status: TutorialStatus) => {
  if (status === 'Confirmed') return 'success'
  if (status === 'Rejected' || status === 'Deactivated') return 'error'
  if (status === 'NeedsChanges') return 'info'
  return 'warning'
}

const headers: DataTableHeader<AdminTutorialDTO>[] = [
  { title: 'ID', key: 'id', sortable: false, width: '6vw' },
  { title: 'Title', key: 'title', sortable: false, width: '24vw' },
  { title: 'Subject', key: 'subjectTitle', sortable: false, width: '14vw', emptyText: '-' },
  { title: 'Topics', key: 'topics', sortable: false, width: '14vw', getText: item => item.topics.map(t => t.title).filter(Boolean).join(' / ') || '-' },
  { title: 'Owner', key: 'ownerName', sortable: false, width: '10vw', emptyText: '-' },
  { title: 'Views', key: 'viewCount', sortable: false, width: '5vw' },
  { title: 'Changed', key: 'lastModifyDate', sortable: false, width: '10vw', type: 'date', dateFormat: 'DD/MM/YYYY HH:mm' },
  {
    title: 'Status',
    key: 'status',
    sortable: false,
    width: '8vw',
    type: 'chip',
    getText: item => STATUS_TITLES[item.status] ?? item.status,
    getChipColor: item => statusColor(item.status),
  },
  {
    title: 'Action',
    key: 'Action',
    sortable: false,
    width: '12vw',
    type: 'actions',
    actions: [
      { icon: 'md:edit', tooltip: 'Edit', href: item => `/admin/tutorials/edit/${item.id}`, show: () => can(ADMIN_PERMISSIONS.tutorials.detail) },
      { icon: 'md:publish', tooltip: 'Publish', onClick: item => changeStatus(item, 'Confirmed'), show: item => item.status !== 'Confirmed' && can(ADMIN_PERMISSIONS.tutorials.status) },
      { icon: 'md:visibility_off', tooltip: 'Deactivate', onClick: item => changeStatus(item, 'Deactivated'), show: item => item.status === 'Confirmed' && can(ADMIN_PERMISSIONS.tutorials.status) },
      { icon: 'md:visibility', tooltip: 'View', href: item => `/tutorial/${item.id}`, target: '_blank', show: item => item.status === 'Confirmed' },
      { icon: 'md:delete', tooltip: 'Delete', onClick: item => openDelete(item), show: () => can(ADMIN_PERMISSIONS.tutorials.remove) },
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
const status = ref<TutorialStatus | null>(null)
const title = ref('')
const boardId = ref<string | null>(null)
const gradeId = ref<string | null>(null)
const subjectId = ref<string | null>(null)
const boards = ref<TypeItemDTO[]>([])
const grades = ref<TypeItemDTO[]>([])
const subjects = ref<TypeItemDTO[]>([])

const fetchTutorials = () => getList({
  page: page.value,
  pageSize: pageSize.value,
  status: status.value,
  boardId: boardId.value ? Number(boardId.value) : null,
  gradeId: gradeId.value ? Number(gradeId.value) : null,
  subjectId: subjectId.value ? Number(subjectId.value) : null,
  title: title.value ?? '',
})

const search = async () => {
  page.value = 1
  await fetchTutorials()
}

const changeBoard = async () => {
  gradeId.value = null
  subjectId.value = null
  grades.value = boardId.value ? await typeLists.grades(boardId.value) : []
  subjects.value = []
  await search()
}

const changeGrade = async () => {
  subjectId.value = null
  subjects.value = gradeId.value ? await typeLists.subjects(gradeId.value) : []
  await search()
}

const clearTitle = async () => {
  title.value = ''
  await search()
}

const changePageNumber = async (value: number) => {
  page.value = value
  await fetchTutorials()
}

const changePageSize = async (value: number) => {
  pageSize.value = value
  page.value = 1
  await fetchTutorials()
}

const changeStatus = async (item: AdminTutorialDTO, value: TutorialStatus) => {
  if (await setStatus(item.id, value)) await fetchTutorials()
}

const selected = ref<AdminTutorialDTO | null>(null)
const showDeleteModal = ref(false)
const openDelete = (item: AdminTutorialDTO) => {
  selected.value = item
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (selected.value && await remove(selected.value.id)) {
    showDeleteModal.value = false
    await fetchTutorials()
  }
}

onMounted(async () => {
  await fetchTutorials()
  boards.value = await typeLists.boards()
})
</script>

<style scoped>
.filter-field {
  min-width: 180px;
  max-width: 260px;
}
</style>
