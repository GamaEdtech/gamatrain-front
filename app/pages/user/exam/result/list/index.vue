<template>
  <div class="w-100 h-100 d-flex flex-column align-start justify-start px-2 pa-md-0">
    <div class="w-100 d-flex align-center justify-space-between ga-2 mt-4">
      <h1 class="text-h4 text-grey700 font-weight-regular">
        Exam Results
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

    <common-data-table
      v-model:page="page"
      v-model:page-size="pageSize"
      :headers="headers"
      :items="list || []"
      :page-count="pageCount"
      :total-count="totalCount"
      :page-size-options="allPageSize"
      :loading="loading"
      item-label="Results"
      class="mt-4"
      @update:page="changePageNumber"
      @update:page-size="changePageSize"
    />
  </div>
</template>

<script setup lang="ts">
import type { DataTableHeader, ExamResultDTO } from '@/types'

definePageMeta({
  layout: 'dashboard-layout',
  middleware: ['auth'],
})

useSeoMeta({
  title: 'Exam Results',
})

const {
  loadingGetData: loading,
  data: list,
  getData,
  totalCount,
  pageCount,
} = useExamResult()
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

const headers: DataTableHeader<ExamResultDTO>[] = [
  {
    title: 'Title',
    key: 'exam_title',
    sortable: false,
    width: '38vw',
    type: 'link',
    align: 'center',
    getTo: (item: ExamResultDTO) => `/exam/result/${item.id}`,
  },
  { title: 'Code', key: 'exam_code', sortable: false, width: '8vw' },
  { title: 'Grade', key: 'base_title', sortable: false, width: '10vw' },
  { title: 'Subject', key: 'lesson_title', sortable: false, width: '10vw' },
  { title: 'Score', key: 'result_score', sortable: false, width: '8vw' },
  {
    title: 'Date',
    key: 'subdate',
    sortable: false,
    width: '14vw',
    type: 'date',
    dateFormat: 'DD/MM/YYYY HH:mm:ss',
  },
  {
    title: 'Status',
    key: 'status',
    sortable: false,
    width: '10vw',
    type: 'chip',
    getText: (item: ExamResultDTO) => getStatusTitle(item.status),
    getChipColor: (item: ExamResultDTO) => getStatusColor(item.status),
  },
  {
    title: 'Action',
    key: 'Action',
    sortable: false,
    width: '10vw',
    type: 'actions',
    actions: [
      {
        icon: 'md:description',
        tooltip: 'Report card',
        to: (item: ExamResultDTO) => `/exam/result/${item.id}`,
        show: (item: ExamResultDTO) => Number(item.status) === 1,
      },
      {
        icon: 'md:play_arrow',
        tooltip: 'Continue',
        to: (item: ExamResultDTO) => `/exam/start/${item.id}`,
        show: (item: ExamResultDTO) => Number(item.status) !== 1,
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

const fetchExamResults = async () => {
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
  await fetchExamResults()
}

const changePageSize = async (newPageSize: number) => {
  pageSize.value = newPageSize
  page.value = 1
  await fetchExamResults()
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
  await fetchExamResults()
}

const gradeFilterChange = async (gradeId: string | number) => {
  filters.grade = gradeId
  filters.subject = ''
  resetSubjects()

  if (gradeId) {
    getSubjects(gradeId)
  }

  page.value = 1
  await fetchExamResults()
}

const subjectFilterChange = async (subjectId: string | number) => {
  filters.subject = subjectId
  page.value = 1
  await fetchExamResults()
}

const getStatusTitle = (value: string | number) => {
  return Number(value) === 1 ? 'Complete' : 'Incomplete'
}

const getStatusColor = (value: string | number) => {
  return Number(value) === 1 ? 'success' : 'warning'
}

onMounted(async () => {
  fetchExamResults()
  getBoards()
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
