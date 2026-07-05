<template>
  <div class="w-100 h-100 d-flex flex-column align-start justify-start px-2 pa-md-0">
    <div class="w-100 d-flex align-center justify-space-between ga-2 mt-4">
      <h1 class="text-h4 text-grey700 font-weight-regular">
        My Forum List
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

    <div class="w-100 d-flex justify-space-between align-center mt-4">
      <v-btn
        to="/user/question/create"
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
        <span class="text-grey800 font-weight-bold text-h6">New Forum</span>
      </v-btn>
      <span class="text-grey400 text-no-wrap text-h5 font-weight-semibold ml-auto">
        <span class="text-grey500 font-weight-bold mr-1">
          {{ totalCount }}
        </span>
        Forum
      </span>
    </div>

    <div class="w-100 mt-4">
      <v-data-table
        :headers="headers"
        :items="list"
        :items-per-page="pageSize"
        class="elevation-1 set-height-table"
        :loading="loading"
        fixed-header
        hide-default-footer
      >
        <template #headers="{ columns }">
          <tr>
            <th
              v-for="(column, index) in columns"
              :key="index"
              :class="`bg-grey100 text-grey700 text-h5 font-weight-bold pa-2 text-center
               ${index == 0 ? `` : `th-min-width`}`"
            >
              {{ column.title }}
            </th>
          </tr>
        </template>

        <template #[`item.id`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold">
            {{ item.id }}
          </div>
        </template>

        <template #[`item.title`]="{ item }">
          <div class="text-grey600 text-h5 font-weight-bold d-flex justify-center align-center">
            {{ item.title }}
          </div>
        </template>

        <template #[`item.unread_reply`]="{ item }">
          <div class="text-grey600 text-h5 d-flex justify-center align-center font-weight-bold">
            {{ item.unread_reply }}
          </div>
        </template>

        <template #[`item.subdate`]="{ item }">
          <div class="text-center text-grey600 text-h5 d-flex justify-center align-center font-weight-bold">
            {{ item.subdate }}
          </div>
        </template>

        <template #[`item.status`]="{ item }">
          <div class="w-100 d-flex justify-center align-center">
            <v-chip
              :color="getStatusColor(item.status)"
              class="font-weight-bold text-h5"
            >
              {{ getStatusTitle(item.status) }}
            </v-chip>
          </div>
        </template>

        <template #[`item.Action`]="{ item }">
          <div class="d-flex justify-center align-center">
            <v-btn
              icon
              flat
              :to="`/qa/${item.id}`"
            >
              <v-icon
                size="20"
                color="grey800"
              >
                md:visibility
              </v-icon>
              <v-tooltip
                activator="parent"
                location="top"
              >
                View
              </v-tooltip>
            </v-btn>

            <v-btn
              icon
              flat
              :to="`/user/question/edit/${item.id}`"
            >
              <v-icon
                size="20"
                color="grey800"
              >
                md:edit
              </v-icon>
              <v-tooltip
                activator="parent"
                location="top"
              >
                Edit
              </v-tooltip>
            </v-btn>

            <v-btn
              icon
              flat
              @click="openModalDelete(item)"
            >
              <v-icon
                size="20"
                color="grey800"
              >
                md:delete
              </v-icon>
              <v-tooltip
                activator="parent"
                location="top"
              >
                Delete
              </v-tooltip>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </div>

    <div class="w-100 d-flex mt-2 position-relative ga-6">
      <div class="w-100 d-flex justify-center justify-sm-start justify-md-center mt-16 mt-sm-4">
        <v-pagination
          v-model="page"
          :length="pageCount"
          :total-visible="4"
          next-icon="md:arrow_forward"
          prev-icon="md:arrow_back"
          size="40"
          class="custom-pagination"
          @update:model-value="changePageNumber"
        />
      </div>

      <div class="position-absolute right-0 select-size-div">
        <v-select
          v-model="pageSize"
          :items="allPageSize"
          item-title="label"
          item-value="value"
          variant="outlined"
          density="compact"
          rounded
          hide-details
          max-width="140"
          class="rounded-pill"
          @update:model-value="changePageSize"
        />
      </div>
    </div>

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
import type { ForumBriefDTO } from '@/types'

definePageMeta({
  layout: 'dashboard-layout',
  middleware: ['auth'],
})

useSeoMeta({
  title: 'Forum Management',
})

const {
  loadingGetData: loading,
  data: list,
  getData,
  totalCount,
  pageCount,
  deleteItem,
  loadingDeleteItem,
} = useForum()
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

const headers = [
  { title: 'ID', key: 'id', sortable: false, width: '10vw' },
  { title: 'Title', key: 'title', sortable: false, width: '30vw' },
  { title: 'UnRead Reply', key: 'unread_reply', sortable: false, width: '10vw' },
  { title: 'Date', key: 'subdate', sortable: false, width: '20vw' },
  { title: 'Status', key: 'status', sortable: false, width: '15vw' },
  { title: 'Action', key: 'Action', sortable: false, width: '15vw' },
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

const fetchData = async () => {
  await getData({
    page: page.value,
    pageSize: pageSize.value,
    section: filters.board,
    base: filters.grade,
    lesson: filters.subject,
  })
}

const changePageNumber = async () => {
  await fetchData()
}

const changePageSize = async () => {
  page.value = 1
  await fetchData()
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
  fetchData()
}

const gradeFilterChange = async (gradeId: string | number) => {
  filters.grade = gradeId
  filters.subject = ''
  resetSubjects()

  if (gradeId) {
    getSubjects(gradeId)
  }

  page.value = 1
  fetchData()
}

const subjectFilterChange = async (subjectId: string | number) => {
  filters.subject = subjectId
  page.value = 1
  await fetchData()
}

const openModalDelete = (item: ForumBriefDTO) => {
  selectedItemIdForDelete.value = item.id.toString()
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  await deleteItem(selectedItemIdForDelete.value)
  selectedItemIdForDelete.value = ''
  showDeleteModal.value = false
  await fetchData()
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
    fetchData(),
    getBoards(),
  ])
})
</script>

<style scoped>
.set-height-table {
  max-height: 70vh;
}
.th-min-width {
  min-width: 130px;
}
.select-size-div {
  top: 18px;
}
.filter-item{
  width: 30%;
  max-width : 200px;
}

:deep(.custom-pagination li button:hover) {
  background-color: rgb(var(--v-theme-primary));
  opacity: 0.6;
}
:deep(.custom-pagination .v-pagination__item--is-active button) {
  background: rgb(var(--v-theme-primary)) !important;
}
:deep(.custom-pagination .v-pagination__item--is-active .v-btn__overlay){
  opacity: 0 !important;
}

@media screen and (max-width: 600px) {
  .filter-item{
    width: 100%;
     max-width : 100%
  }
}
</style>
