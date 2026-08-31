<template>
  <div class="w-100 h-100 d-flex flex-column align-start justify-start px-2 pa-md-0">
    <div class="w-100 d-flex align-center justify-space-between ga-2 mt-4">
      <h1 class="text-h4 text-grey700 font-weight-regular">
        My Multimedia
      </h1>
    </div>

    <div class="w-100 d-flex ga-1 flex-wrap align-end mt-4">
      <div class="filter-item">
        <common-gombo-box
          v-model="filters.board"
          label="Board"
          :items="boards?.map((board) => {
            return {
              id: board.code,
              title: board.title,
            }
          })"
          :data-loading="loadingBoards"
          rounded="pill"
          height="48"
          base-color="grey200"
          color="primary"
          density="compact"
          :defalut-lable="false"
          @update:model-value="boardFilterChange"
        />
      </div>

      <div class="filter-item">
        <common-gombo-box
          v-model="filters.grade"
          label="Grade"
          :items="grades?.map((item) => {
            return {
              id: item.id,
              title: item.title,
            }
          })"
          :data-loading="loadingBoards || loadingGrade"
          rounded="pill"
          height="48"
          base-color="grey200"
          color="primary"
          density="compact"
          :defalut-lable="false"
          :disabled="!filters.board || loadingGrade"
          @update:model-value="gradeFilterChange"
        />
      </div>

      <div class="filter-item">
        <common-gombo-box
          v-model="filters.subject"
          label="Subject"
          :items="subjects?.map((item) => {
            return {
              id: item.id,
              title: item.title,
            }
          })"
          :data-loading="loadingBoards || loadingGrade || loadingSubject"
          rounded="pill"
          height="48"
          base-color="grey200"
          color="primary"
          density="compact"
          :defalut-lable="false"
          :disabled="!filters.board || !filters.grade || loadingSubject"
          @update:model-value="subjectFilterChange"
        />
      </div>
    </div>

    <div class="w-100 d-flex justify-start align-center mt-4">
      <v-btn
        to="/user/multimedia/create"
        rounded="pill"
        color="primary"
        flat
        max-width="220"
        height="34"
      >
        <v-icon
          color="grey800"
          size="20"
        >
          md:add
        </v-icon>
        <span class="text-grey800 font-weight-bold text-h6">New Multimedia</span>
      </v-btn>
    </div>

    <common-data-table
      v-model:page="page"
      v-model:page-size="pageSize"
      sticky-header-offset="64px"
      :headers="headers"
      :items="list || []"
      :page-count="pageCount"
      :total-count="totalCount"
      :page-size-options="allPageSize"
      :loading="loading"
      item-label="Multimedia"
      class="mt-4"
      @update:page="changePageNumber"
      @update:page-size="changePageSize"
    />

    <common-modal-base
      v-model:show-dialog="showDeleteModal"
      title="Delete"
    >
      <common-modal-delete
        :loading="loadingDeleteItem"
        @confirm="confirmDelete"
      />
    </common-modal-base>
  </div>
</template>

<script setup lang="ts">
import type { DataTableHeader, MultimediaBriefDTO } from '@/types'

definePageMeta({
  layout: 'dashboard-layout',
  middleware: ['auth', 'user-type'],
})

useSeoMeta({
  title: 'Multimedia Management',
})

const {
  loadingGetData: loading,
  data: list,
  getData,
  totalCount,
  pageCount,
  deleteItem,
  loadingDeleteItem,
} = useMultimedia()
const {
  loadingGetData: loadingBoards,
  data: boards,
  getData: getBoards,
  getGrades,
  grades,
  loadingGrade,
  resetGrades,
  subjects,
  loadingSubject,
  resetSubjects,
  getSubjects,
} = useBoard()

const openModalDelete = (item: MultimediaBriefDTO) => {
  selectedItemIdForDelete.value = item.id.toString()
  showDeleteModal.value = true
}

const headers: DataTableHeader<MultimediaBriefDTO>[] = [
  { title: 'ID', key: 'id', sortable: false, width: '10vw' },
  {
    title: 'Title',
    key: 'title',
    sortable: false,
    width: '30vw',
    type: 'link',
    getTo: (item: MultimediaBriefDTO) => `/multimedia/${item.id}/${item.title}`,
  },
  { title: 'Score', key: 'ref_score', sortable: false, width: '5vw' },
  { title: 'Download', key: 'downloads', sortable: false, width: '5vw' },
  {
    title: 'Date',
    key: 'subdate',
    sortable: false,
    width: '20vw',
    type: 'date',
    dateFormat: 'DD/MM/YYYY HH:mm:ss',
  },
  {
    title: 'Status',
    key: 'status',
    sortable: false,
    width: '15vw',
    type: 'chip',
    getText: (item: MultimediaBriefDTO) => getStatusTitle(item.status),
    getChipColor: (item: MultimediaBriefDTO) => getStatusColor(item.status),
  },
  {
    title: 'Action',
    key: 'Action',
    sortable: false,
    width: '15vw',
    type: 'actions',
    actions: [
      {
        icon: 'md:visibility',
        tooltip: 'View',
        to: (item: MultimediaBriefDTO) => `/multimedia/${item.id}`,
      },
      {
        icon: 'md:edit',
        tooltip: 'Edit',
        to: (item: MultimediaBriefDTO) => `/user/multimedia/edit/${item.id}`,
      },
      {
        icon: 'md:delete',
        tooltip: 'Delete',
        onClick: (item: MultimediaBriefDTO) => openModalDelete(item),
      },
    ],
  },
]

const pageSize = ref(10)
const page = ref(1)
const allPageSize = [
  { label: '10 Rows', value: 10 },
  { label: '20 Rows', value: 20 },
  { label: '50 Rows', value: 50 },
]

const filters = reactive<{
  board: string | number
  grade: string | number
  subject: string | number
}>({
  board: '',
  grade: '',
  subject: '',
})

const showDeleteModal = ref(false)
const selectedItemIdForDelete = ref('')

const fetchMultimedia = async () => {
  await getData({
    page: page.value,
    pageSize: pageSize.value,
    section: filters.board,
    base: filters.grade,
    lesson: filters.subject,
  })
}

const changePageNumber = async (pageNumber: number) => {
  page.value = pageNumber
  await fetchMultimedia()
}

const changePageSize = async (newPageSize: number) => {
  pageSize.value = newPageSize
  page.value = 1
  await fetchMultimedia()
}

const boardFilterChange = async (boardId: string | number) => {
  filters.board = boardId
  filters.grade = ''
  filters.subject = ''
  resetGrades()
  resetSubjects()

  if (boardId) {
    getGrades(boardId)
  }

  page.value = 1
  fetchMultimedia()
}

const gradeFilterChange = async (gradeId: string | number) => {
  filters.grade = gradeId
  filters.subject = ''
  resetSubjects()

  if (gradeId) {
    getSubjects(gradeId)
  }

  page.value = 1
  fetchMultimedia()
}

const subjectFilterChange = async (subjectId: string | number) => {
  filters.subject = subjectId
  page.value = 1
  await fetchMultimedia()
}

const confirmDelete = async () => {
  await deleteItem(selectedItemIdForDelete.value)
  selectedItemIdForDelete.value = ''
  showDeleteModal.value = false
  await fetchMultimedia()
}

const getStatusTitle = (value: string | number) => {
  const status = Number(value)

  if (status === 0) return 'Unreviewed'
  if (status === 1) return 'Confirmed'
  if (status === 2) return 'Reference to type unit'
  if (status === 3) return 'Has a message'
  if (status === 4) return 'Inactive'
  if (status === 5) return 'Edited'

  return 'Unknown'
}

const getStatusColor = (value: string | number) => {
  const status = Number(value)

  if (status === 1) return 'success'
  if (status === 3 || status === 5) return 'info'
  if (status === 4) return 'error'

  return 'warning'
}

onMounted(async () => {
  await Promise.all([
    fetchMultimedia(),
    getBoards(),
  ])
})
</script>

<style scoped>
.filter-item{
  width: 30%;
  max-width : 200px;
}

@media screen and (max-width: 600px) {
  .filter-item{
    width: 100%;
     max-width : 100%
  }
}
</style>
