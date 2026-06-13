<template>
  <div class="mb-4 d-inline-flex align-center flex-wrap">
    <div>
      <template v-if="isLoadingBoard">
        <div class="d-inline-flex mt-2">
          <v-skeleton-loader
            min-width="200"
            type="heading"
          />
        </div>
      </template>
      <template v-else>
        <div
          v-if="selectedBoard"
          class="d-inline-flex flex-row align-center cursor-pointer"
          @click="openBoardDialog"
        >
          <span class="w-100 gama-text-h3 font-weight-semibold">
            {{ selectedBoard?.title }}
          </span>
          <v-icon
            size="18"
            color="black"
            class="mx-2"
          >
            mdi-menu-down
          </v-icon>
        </div>
      </template>
    </div>
    <div>
      <template v-if="isLoadingGrades">
        <div class="d-inline-flex mt-2">
          <v-skeleton-loader
            min-width="200"
            type="heading"
          />
        </div>
      </template>
      <template v-else>
        <div
          v-if="selectedGrade"
          class="d-inline-flex flex-row align-center cursor-pointer"
          @click="openGradeDialog"
        >
          <span class="w-100 gama-text-h3 font-weight-semibold">
            {{ selectedGrade?.title }}
          </span>
          <v-icon
            v-if="selectedBoard"
            size="18"
            color="black"
            class="mx-2"
          >
            mdi-menu-down
          </v-icon>
        </div>
      </template>
    </div>
    <div>
      <template v-if="isLoadingSubjects">
        <div class="d-inline-flex mt-2">
          <v-skeleton-loader
            type="heading"
            min-width="200"
          />
        </div>
      </template>
      <template v-else>
        <div
          v-if="selectedSubject"
          class="d-inline-flex flex-row align-center mb-4 mb-md-0 cursor-pointer"
          @click="openSubjectDialog"
        >
          <span class="w-100 gama-text-h3 font-weight-semibold">
            {{ selectedSubject?.title }}
          </span>
          <v-icon
            v-if="selectedSubject"
            size="18"
            color="black"
            class="mx-2"
          >
            mdi-menu-down
          </v-icon>
        </div>
      </template>
    </div>

    <search-select-dialog
      v-model:show-dialog="showBoardDialog"
      title-modal="Board"
      :items="boards"
      :selected-item="selectedBoard"
      :has-search="true"
      @change-selected-item="boardChange"
    />

    <search-select-dialog
      v-model:show-dialog="showGradeDialog"
      title-modal="Grade"
      :items="grades"
      :selected-item="selectedGrade"
      :has-search="true"
      @change-selected-item="gradeChange"
    />

    <search-select-dialog
      v-model:show-dialog="showSubjectDialog"
      title-modal="Subject"
      :items="subjects"
      :selected-item="selectedSubject"
      :has-search="true"
      @change-selected-item="subjectChange"
    />
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

const emit = defineEmits([
  'changeSubject',
  'changeStatusLoading',
  'changeFilterForBreadCrumb',
])

const router = useRouter()
const route = useRoute()

const { loadingGetData: isLoadingBoard, data: boards, getData: fetchBoards } = useBoard()

onMounted(async () => {
  await fetchBoards()
  setBoard()
  await fetchGrade()
  setGrade()
  await fetchSubject()
  setSubject()
  emit(
    'changeFilterForBreadCrumb',
    selectedBoard.value,
    selectedGrade.value,
    selectedSubject.value,
  )
  if (!route.query.subject) {
    emit('changeSubject', selectedSubject.value)
  }
  updateQueryParam()
})

const updateQueryParam = () => {
  const query = {}
  if (selectedBoard.value) query.board = selectedBoard.value.code
  if (selectedGrade.value) query.grade = selectedGrade.value.id
  if (selectedSubject.value) query.subject = selectedSubject.value.id
  router.replace({ query })
}

// Start Board Section
const selectedBoard = ref(null)
const showBoardDialog = ref(false)

const setBoard = () => {
  if (route.query.board) {
    const boardId = route.query.board
    const findedBoard = boards.value.find(board => board.code == boardId)
    if (findedBoard) {
      selectedBoard.value = findedBoard
    }
    else {
      setDefaltBoard()
    }
  }
  else {
    setDefaltBoard()
  }
  isLoadingBoard.value = false
}
const setDefaltBoard = () => {
  const cieBoard = boards.value.find(
    board => board.title === 'CIE' || board.code === '6659', // CIE ID
  )
  if (cieBoard) {
    selectedBoard.value = cieBoard
  }
  else {
    if (this.boards.length > 0) {
      selectedBoard.value = this.boards[0]
    }
    else {
      const defaultBoard = {
        id: '6659',
        title: 'CIE',
        name: 'CIE',
      }
      selectedBoard.value = defaultBoard
    }
  }
}

const boardChange = async (board) => {
  if (board.code != selectedBoard.value) {
    emit('changeStatusLoading')
    showBoardDialog.value = false
    selectedBoard.value = board
    selectedGrade.value = null
    selectedSubject.value = null
    await fetchGrade()
    setDefaltGrade()
    isLoadingGrades.value = false
    await fetchSubject()
    setDefaltSubject()
    emit(
      'changeFilterForBreadCrumb',
      selectedBoard.value,
      selectedGrade.value,
      selectedSubject.value,
    )
    isLoadingSubjects.value = false
    emit('changeSubject', selectedSubject.value)
    updateQueryParam()
  }
}

const openBoardDialog = () => {
  showBoardDialog.value = true
}

// End Board Section

// Start Grade Section
const selectedGrade = ref(null)
const grades = ref([])
const isLoadingGrades = ref(true)
const showGradeDialog = ref(false)

const fetchGrade = async () => {
  try {
    isLoadingGrades.value = true
    const responseGrade = await useApiService.get(
      `/api/v1/types/list/?type=base&section_id=${selectedBoard.value.code}`,
    )
    if (responseGrade.data) {
      grades.value = responseGrade.data
    }
  }
  catch (error) {
    console.error('error', error)
  }
}

const setGrade = () => {
  if (route.query.grade) {
    const gradeId = route.query.grade
    const findedGrade = grades.value.find(grade => grade.id == gradeId)
    if (findedGrade) {
      selectedGrade.value = findedGrade
    }
    else {
      setDefaltGrade()
    }
  }
  else {
    setDefaltGrade()
  }
  isLoadingGrades.value = false
}
const setDefaltGrade = () => {
  if (grades.value.length > 0) {
    selectedGrade.value = grades.value[0]
  }
}

const gradeChange = async (grade) => {
  if (grade.id != selectedGrade.value.id) {
    emit('changeStatusLoading')
    showGradeDialog.value = false
    selectedGrade.value = grade
    selectedSubject.value = null
    await fetchSubject()
    setDefaltSubject()
    isLoadingSubjects.value = false
    emit(
      'changeFilterForBreadCrumb',
      selectedBoard.value,
      selectedGrade.value,
      selectedSubject.value,
    )
    emit('changeSubject', selectedSubject.value)
    updateQueryParam()
  }
}

const openGradeDialog = () => {
  showGradeDialog.value = true
}

// End Grade Section

// Start Subject Section
const selectedSubject = ref(null)
const subjects = ref([])
const isLoadingSubjects = ref(true)
const showSubjectDialog = ref(false)

const fetchSubject = async () => {
  try {
    isLoadingSubjects.value = true
    const responseSubject = await useApiService.get(
      `/api/v1/types/list/?type=lesson&base_id=${selectedGrade.value.id}`, undefined, { public: true },
    )
    if (responseSubject.data) {
      subjects.value = responseSubject.data
    }
  }
  catch (error) {
    console.error('error', error)
  }
}

const setSubject = () => {
  if (route.query.subject) {
    const subjectId = route.query.subject
    const findedSubject = subjects.value.find(
      subject => subject.id == subjectId,
    )
    if (findedSubject) {
      selectedSubject.value = findedSubject
    }
    else {
      setDefaltSubject()
    }
  }
  else {
    setDefaltSubject()
  }
  isLoadingSubjects.value = false
}
const setDefaltSubject = () => {
  if (subjects.value.length > 0) {
    selectedSubject.value = subjects.value[0]
  }
}

const subjectChange = (subject) => {
  if (subject.id != selectedSubject.value.id) {
    emit('changeStatusLoading')
    showSubjectDialog.value = false
    selectedSubject.value = subject
    emit(
      'changeFilterForBreadCrumb',
      selectedBoard.value,
      selectedGrade.value,
      selectedSubject.value,
    )
    emit('changeSubject', selectedSubject.value)
    updateQueryParam()
  }
}

const openSubjectDialog = () => {
  showSubjectDialog.value = true
}

// End Subject Section
</script>

<style></style>
