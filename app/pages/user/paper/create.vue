<template>
  <v-container class="w-100 d-flex flex-column">
    <v-form
      v-model="isFormValid"
      class="w-100 d-flex flex-column"
    >
      <h1 class="text-h6 text-grey700 font-weight-regular">
        Past Papers Submission Form
      </h1>
      <div class="d-flex flex-wrap justify-space-between">
        <div class="each-item d-flex flex-column align-start justify-start ga-1 mt-4">
          <common-gombo-box
            v-model="paper.board"
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
            base-color="grey400"
            color="primary"
            :defalut-lable="false"
            density="compact"
            :rules="[required]"
            @update:model-value="boardChange"
          />
        </div>

        <div class="each-item d-flex flex-column align-start justify-start ga-1 mt-4">
          <common-gombo-box
            v-model="paper.grade"
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
            base-color="grey400"
            color="primary"
            density="compact"
            :defalut-lable="false"
            :disabled="!paper.board || loadingGrade"
            :rules="[required]"
            @update:model-value="gradeChange"
          />
        </div>

        <div class="each-item d-flex flex-column align-start justify-start ga-1 mt-4">
          <common-gombo-box
            v-model="paper.subject"
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
            base-color="grey400"
            color="primary"
            density="compact"
            :defalut-lable="false"
            :disabled="!paper.board || !paper.grade || loadingSubject"
            :rules="[required]"
            @update:model-value="subjectChange"
          />
        </div>

        <div class="container-topics w-100 d-flex flex-column align-start justify-start ga-1 mt-4 rounded-lg pa-2">
          <common-multi-choice-check-box-list
            v-model:choices="paper.topics"
            title="Topics"
            :loading-get-data="loadingTopic"
            :data="topics?.map((item) => {
              return {
                id: item.id,
                title: item.title,
              }
            })"
            :disabled="!paper.subject"
          />
        </div>

        <div class="each-item d-flex flex-column align-start justify-start ga-1 mt-4">
          <common-gombo-box
            v-model="paper.classification"
            label="Classification"
            :items="classifications?.map((item) => {
              return {
                id: item.id,
                title: item.title,
              }
            })"
            :data-loading="loadingBoards || loadingClassification "
            rounded="pill"
            height="48"
            base-color="grey400"
            color="primary"
            density="compact"
            :defalut-lable="false"
            :disabled="!paper.board || loadingClassification"
          />
        </div>

        <div class="each-item d-flex flex-column align-start justify-start ga-1 mt-4">
          <common-gombo-box
            v-model="paper.answer_type"
            label="Solution Availability"
            :items="ANSWER_STATUS_LIST"
            rounded="pill"
            height="48"
            base-color="grey400"
            color="primary"
            density="compact"
            :defalut-lable="false"
            :has-search="false"
            :rules="[required]"
          />
        </div>

        <div class="each-item d-flex flex-column align-start justify-start ga-1 mt-4">
          <common-gombo-box
            v-model="paper.level"
            label="Difficulty Level"
            :items="TEST_LEVEL_LIST"
            rounded="pill"
            height="48"
            base-color="grey400"
            color="primary"
            density="compact"
            :defalut-lable="false"
            :has-search="false"
          />
        </div>

        <div class="each-item d-flex flex-column align-start justify-start ga-1 mt-4">
          <common-gombo-box
            v-model="paper.edu_year"
            label="Year"
            :items="YEAR_LIST.map((item) => {
              return {
                id: item.toString(),
                title: item.toString(),
              }
            })"
            rounded="pill"
            height="48"
            base-color="grey400"
            color="primary"
            density="compact"
            :defalut-lable="false"
            :rules="[required]"
          />
        </div>

        <div class="each-item d-flex flex-column align-start justify-start ga-1 mt-4">
          <common-gombo-box
            v-model="paper.edu_month"
            label="Month"
            :items="MONTH_LIST"
            rounded="pill"
            height="48"
            base-color="grey400"
            color="primary"
            density="compact"
            :defalut-lable="false"
            :rules="[required]"
          />
        </div>

        <div class="each-item d-flex flex-column align-start justify-start ga-1 mt-4">
          <common-gombo-box
            v-model="paper.holding_level"
            label="Testing Scope"
            :items="HOLDING_LEVEL_LIST"
            rounded="pill"
            height="48"
            base-color="grey400"
            color="primary"
            density="compact"
            :defalut-lable="false"
            :has-search="false"
          />
        </div>

        <!-- <v-col
              v-if="formData.holding_level < 4"
              cols="12"
              md="4"
            >
              <v-autocomplete
                v-model="formData.state"
                density="compact"
                variant="outlined"
                :items="state_list"
                item-title="title"
                item-value="id"
                label="State"
                color="#FFB300"
                autocomplete="off"
              />
            </v-col>
            <v-col
              v-if="formData.holding_level < 3"
              cols="12"
              md="4"
            >
              <v-autocomplete
                v-model="formData.area"
                density="compact"
                variant="outlined"
                :items="area_list"
                item-title="title"
                item-value="id"
                label="Area"
                color="#FFB300"
                autocomplete="off"
              />
            </v-col>
            <v-col
              v-if="formData.holding_level < 2"
              cols="12"
              md="4"
            >
              <v-autocomplete
                v-model="formData.school"
                density="compact"
                variant="outlined"
                :items="school_list"
                item-title="title"
                item-value="id"
                label="School"
                color="#FFB300"
                autocomplete="off"
              />
            </v-col> -->

        <div class="w-100 d-flex flex-column align-start justify-start ga-1 mt-4 rounded-lg pa-2">
          <span class="text-caption text-grey700 font-weight-medium">Title</span>
          <v-text-field
            v-model="paper.title"
            density="compact"
            variant="outlined"
            label=""
            outlined
            rounded="pill"
            color="primary"
            height="48"
            base-color="grey400"
            class="w-100"
            :rules="[required]"
          />
        </div>

        <div class="w-100 d-flex flex-column align-start justify-start ga-1 mt-4 rounded-lg pa-2">
          <span class="text-caption text-grey700 font-weight-medium">Description</span>
          <v-textarea
            v-model="paper.description"
            density="compact"
            variant="outlined"
            label=""
            outlined
            rounded="lg"
            color="primary"
            base-color="grey400"
            class="w-100"
            placeholder="Type your description"
            persistent-clear
            no-resize
            rows="7"
            :rules="[required, minLength(70)]"
          />
        </div>

        <paper-files-editor
          ref="filesEditor"
          :key="formKey"
          v-model:changes="fileChanges"
          v-model:uploading="filesUploading"
          class="mt-6"
        />
      </div>
    </v-form>

    <div class="d-flex align-center justify-center mt-8 ga-2">
      <v-btn
        variant="outlined"
        color="lightError"
        to="/user/paper"
        flat
        rounded="pill"
        height="40"
        class="text-body-1 font-weight-medium"
      >
        Discard
      </v-btn>
      <v-btn
        flat
        rounded="pill"
        width="200"
        height="40"
        class="text-body-1 font-weight-medium"
        color="primary"
        :loading="loadingAddItem"
        :disabled="!isFormValid || filesUploading || !hasQuestion"
        @click="submitPaper"
      >
        Submit
      </v-btn>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ANSWER_STATUS_LIST, TEST_LEVEL_LIST, YEAR_LIST, MONTH_LIST, HOLDING_LEVEL_LIST } from '@/constants'
import type { PaperFileChangeDTO, PastPaperCreateDTO } from '@/types'

type PaperForm = Omit<PastPaperCreateDTO, 'files'>

definePageMeta({
  layout: 'dashboard-layout',
  middleware: ['auth', 'user-type'],
})

useSeoMeta({
  title: 'Add Paper',
})

const {
  loadingGetData: loadingBoards, data: boards, getData: getBoards, getGrades, grades, loadingGrade, resetGrades,
  subjects, loadingSubject, resetSubjects, getSubjects, getClassification, resetClassifications, loadingClassification, classifications, getTopics, resetTopics, loadingTopic, topics,
} = useBoard()
const { required, minLength } = useValidationRules()
const { addItem,
  loadingAddItem } = usePastPaper()
const router = useRouter()
const route = useRoute()

const isFormValid = ref(false)
const createDefaultPaper = (): PaperForm => ({
  board: '',
  grade: '',
  subject: '',
  classification: '',
  topics: [],
  answer_type: 0,
  level: 2,
  edu_year: '',
  edu_month: '',
  holding_level: 4,
  title: '',
  description: '',
  state: '',
  area: '',
  school: '',
})
const paper = ref<PaperForm>(createDefaultPaper())
// The paper's files, as the add's `files` (uploaded when picked, saved on Submit). The question paper is required.
const fileChanges = ref<PaperFileChangeDTO[]>([])
const filesUploading = ref(false)
// A reset of the form starts the file list over too.
const formKey = ref(0)
const filesEditor = ref<{ hasQuestion: boolean } | null>(null)
const hasQuestion = computed(() => Boolean(filesEditor.value?.hasQuestion))

const boardChange = async (boardId: number | string) => {
  paper.value.board = boardId
  paper.value.grade = ''
  paper.value.subject = ''
  paper.value.classification = ''
  paper.value.topics = []
  resetGrades()
  resetSubjects()
  resetClassifications()
  resetTopics()
  if (boardId) {
    await getGrades(boardId)
    await getClassification(boardId)
  }
}

const gradeChange = async (gradeId: number | string) => {
  paper.value.grade = gradeId
  paper.value.subject = ''
  paper.value.topics = []
  resetSubjects()
  resetTopics()
  if (gradeId) {
    await getSubjects(gradeId)
  }
}

const subjectChange = async (subjectId: number | string) => {
  paper.value.subject = subjectId
  paper.value.topics = []
  resetTopics()
  if (subjectId) {
    await getTopics(subjectId)
  }
}

const resetFormState = () => {
  paper.value = createDefaultPaper()
  fileChanges.value = []
  formKey.value++
  resetGrades()
  resetSubjects()
  resetClassifications()
  resetTopics()
}

const getQueryString = (value: unknown) => typeof value === 'string' ? value : ''

const applyQueryDefaults = async () => {
  const board = getQueryString(route.query.board)
  const classification = getQueryString(route.query.classification)

  if (board) {
    paper.value.board = board
    await Promise.allSettled([getGrades(paper.value.board), getClassification(paper.value.board)])
    if (classification) {
      paper.value.classification = classification
    }
  }
}

const submitPaper = async () => {
  const response = await addItem({ ...paper.value, files: fileChanges.value })

  if (response.status === 1 && response.data?.id !== 0) {
    router.push('/user/paper')
  }
}

onMounted(async () => {
  getBoards()
  await applyQueryDefaults()
})

watch(
  [
    () => route.query.board,
    () => route.query.classification,
  ],
  async () => {
    resetFormState()
    await applyQueryDefaults()
  },
)
</script>

<style scoped>
.each-item{
  width : 33%
}
.container-topics{
  border : 2px solid rgb(var(--v-theme-grey200))
}
@media screen and (max-width: 960px) {
  .each-item{
    width: 100%;
  }
}
</style>
