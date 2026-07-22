<template>
  <v-container class="w-100 d-flex flex-column">
    <v-form
      v-model="isFormValid"
      class="w-100 d-flex flex-column"
    >
      <h1 class="text-h4 text-grey700 font-weight-regular">
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
            base-color="grey200"
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
            base-color="grey200"
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
            base-color="grey200"
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
            base-color="grey200"
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
            base-color="grey200"
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
            base-color="grey200"
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
            base-color="grey200"
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
            base-color="grey200"
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
            base-color="grey200"
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
          <span class="text-h6 text-grey700 font-weight-medium">Title</span>
          <v-text-field
            v-model="paper.title"
            density="compact"
            variant="outlined"
            label=""
            outlined
            rounded="pill"
            color="primary"
            height="48"
            base-color="grey200"
            class="w-100"
            :rules="[required]"
          />
        </div>

        <div class="w-100 d-flex flex-column align-start justify-start ga-1 mt-4 rounded-lg pa-2">
          <span class="text-h6 text-grey700 font-weight-medium">Description</span>
          <v-textarea
            v-model="paper.description"
            density="compact"
            variant="outlined"
            label=""
            outlined
            rounded="lg"
            color="primary"
            base-color="grey200"
            class="w-100"
            placeholder="Type your description"
            persistent-clear
            no-resize
            rows="7"
            :rules="[required, minLength(70)]"
          />
        </div>

        <div class="each-item d-flex flex-column align-start justify-start ga-1 mt-4">
          <span class="text-h6 text-grey700 font-weight-medium">Pdf Question</span>
          <v-file-input
            v-model="pdfQuestionFile"
            density="compact"
            variant="outlined"
            :rules="[required]"
            accept="application/pdf"
            label=""
            base-color="grey200"
            color="primary"
            prepend-icon=""
            append-inner-icon="md:files"
            autocomplete="off"
            max-height="48"
            rounded="pill"
            class="w-100"
            :disabled="isUploadingFile('file_pdf')"
            @update:model-value="uploadPaperFile('file_pdf', $event)"
          >
            <template #prepend-inner>
              <v-icon
                size="20"
                color="error"
              >
                md:picture_as_pdf
              </v-icon>
              <v-progress-circular
                v-if="isUploadingFile('file_pdf')"
                indeterminate
                size="20"
                color="primary"
                class="mx-2"
              />
            </template>
          </v-file-input>
        </div>

        <div class="each-item d-flex flex-column align-start justify-start ga-1 mt-4">
          <span class="text-h6 text-grey700 font-weight-medium">Pdf Solution</span>
          <v-file-input
            v-model="pdfSolutionFile"
            density="compact"
            variant="outlined"
            accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            label=""
            base-color="grey200"
            color="primary"
            prepend-icon=""
            append-inner-icon="md:files"
            autocomplete="off"
            max-height="48"
            rounded="pill"
            class="w-100"
            :disabled="isUploadingFile('file_answer')"
            @update:model-value="uploadPaperFile('file_answer', $event)"
          >
            <template #prepend-inner>
              <v-icon
                size="20"
                color="error"
              >
                md:picture_as_pdf
              </v-icon>
              <v-progress-circular
                v-if="isUploadingFile('file_answer')"
                indeterminate
                size="20"
                color="primary"
                class="mx-2"
              />
            </template>
          </v-file-input>
        </div>

        <div class="each-item d-flex flex-column align-start justify-start ga-1 mt-4">
          <span class="text-h6 text-grey700 font-weight-medium">Word Q & S</span>
          <v-file-input
            v-model="wordQuestionAndSolutionFile"
            density="compact"
            variant="outlined"
            accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            label=""
            base-color="grey200"
            color="primary"
            prepend-icon=""
            append-inner-icon="md:files"
            autocomplete="off"
            max-height="48"
            rounded="pill"
            class="w-100"
            :disabled="isUploadingFile('file_word')"
            @update:model-value="uploadPaperFile('file_word', $event)"
          >
            <template #prepend-inner>
              <v-icon
                size="20"
                color="info"
              >
                md:text_snippet
              </v-icon>
              <v-progress-circular
                v-if="isUploadingFile('file_word')"
                indeterminate
                size="20"
                color="primary"
                class="mx-2"
              />
            </template>
          </v-file-input>
        </div>

        <div
          v-for="(extra, index) in extraFileList"
          :key="index"
          class="w-100 d-flex flex-wrap ga-1 mt-4"
        >
          <div class="each-item d-flex flex-column align-start justify-start ga-1">
            <common-gombo-box
              v-model="extra.type"
              label="Subject"
              :items="extraTypeFile?.map((item) => {
                return {
                  id: item.id,
                  title: item.title,
                }
              })"
              :data-loading="loadingExtraTypeFile"
              rounded="pill"
              height="48"
              base-color="grey200"
              color="primary"
              density="compact"
              :defalut-lable="false"
              :has-search="false"
            />
          </div>

          <div class="each-item d-flex flex-column align-start justify-start ga-1">
            <span class="text-h6 text-grey700 font-weight-medium">Extra File</span>
            <div class="w-100 d-flex align-start ga-1">
              <v-file-input
                v-model="extra.file"
                density="compact"
                variant="outlined"
                label=""
                base-color="grey200"
                color="primary"
                prepend-icon=""
                append-inner-icon="md:files"
                autocomplete="off"
                max-height="48"
                rounded="pill"
                class="w-100"
                :disabled="isUploadingFile('file_extra', index)"
                @update:model-value="uploadPaperFile('file_extra', $event, index)"
              >
                <template #prepend-inner>
                  <v-icon
                    size="20"
                    color="success"
                  >
                    md:add
                  </v-icon>
                  <v-progress-circular
                    v-if="isUploadingFile('file_extra', index)"
                    indeterminate
                    size="20"
                    color="primary"
                    class="mx-2"
                  />
                </template>
              </v-file-input>

              <v-icon
                size="24"
                color="lightError"
                class="cursor-pointer mt-2"
                @click="removeExtra(index)"
              >
                md:delete
              </v-icon>
            </div>
          </div>
        </div>

        <v-btn
          flat
          rounded="pill"
          width="250"
          height="40"
          class="text-h5 font-weight-medium text-white"
          color="success"
          @click="addExtraFile"
        >
          <v-icon color="white">
            md:add
          </v-icon>
          Add Solution video
        </v-btn>
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
        class="text-h5 font-weight-medium"
      >
        Discard
      </v-btn>
      <v-btn
        flat
        rounded="pill"
        width="200"
        height="40"
        class="text-h5 font-weight-medium text-grey800"
        color="primary"
        :loading="loadingAddItem"
        :disabled="!isFormValid"
        @click="submitPaper"
      >
        Submit
      </v-btn>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ANSWER_STATUS_LIST, TEST_LEVEL_LIST, YEAR_LIST, MONTH_LIST, HOLDING_LEVEL_LIST } from '@/constants'
import type { PastPaperCreateDTO } from '@/types'

interface ExtraFileInfo {
  name: string | null
  type: string
  file: File | null
}

type PaperFileField = 'file_pdf' | 'file_word' | 'file_answer' | 'file_extra'
type PaperForm = Omit<PastPaperCreateDTO, 'file_extra'>

definePageMeta({
  layout: 'dashboard-layout',
  middleware: ['auth', 'user-type'],
})

useSeoMeta({
  title: 'Add Paper',
})

const {
  loadingGetData: loadingBoards, data: boards, getData: getBoards, getGrades, grades, loadingGrade, resetGrades,
  subjects, loadingSubject, resetSubjects, getSubjects, getClassification, resetClassifications, loadingClassification, classifications, getTopics, resetTopics, loadingTopic, topics, getExtraTypeFile, extraTypeFile, loadingExtraTypeFile,
} = useBoard()
const { required, minLength } = useValidationRules()
const { uploadFile } = useUpload()
const { $toast } = useNuxtApp()
const { addItem,
  loadingAddItem } = usePastPaper()
const router = useRouter()

const isFormValid = ref(false)
const paper = ref<PaperForm>({
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
  file_pdf: '',
  file_word: '',
  file_answer: '',
  state: '',
  area: '',
  school: '',
})
const pdfQuestionFile = ref(null)
const pdfSolutionFile = ref(null)
const wordQuestionAndSolutionFile = ref(null)
const extraFileList = ref<ExtraFileInfo[]>([])
const uploadingFileKeys = ref<string[]>([])

const addExtraFile = () => {
  extraFileList.value.push({ type: '', file: null, name: null })
}

const removeExtra = (index: number) => {
  const hasExtraUploadInProgress = uploadingFileKeys.value.some(key =>
    key.startsWith('file_extra-'),
  )

  if (hasExtraUploadInProgress) {
    $toast.error('Please wait until the file upload is complete.')
    return
  }

  extraFileList.value.splice(index, 1)
  uploadingFileKeys.value = uploadingFileKeys.value.filter(
    key => key !== getUploadKey('file_extra', index),
  )
}

const getUploadKey = (fileField: PaperFileField, index?: number) => {
  return fileField === 'file_extra' ? `${fileField}-${index}` : fileField
}

const isUploadingFile = (fileField: PaperFileField, index?: number) => {
  return uploadingFileKeys.value.includes(getUploadKey(fileField, index))
}

const setUploadingFile = (
  fileField: PaperFileField,
  isLoading: boolean,
  index?: number,
) => {
  const key = getUploadKey(fileField, index)

  if (isLoading) {
    if (!uploadingFileKeys.value.includes(key)) {
      uploadingFileKeys.value.push(key)
    }

    return
  }

  uploadingFileKeys.value = uploadingFileKeys.value.filter(item => item !== key)
}

const getSelectedFile = (value: File | File[] | null) => {
  if (value instanceof File) return value
  if (Array.isArray(value)) return value[0] ?? null

  return null
}

const isPdfFile = (file: File) => {
  return file.type.includes('pdf') || file.name.toLowerCase().endsWith('.pdf')
}

const isWordFile = (file: File) => {
  const fileName = file.name.toLowerCase()

  return file.type.includes('word')
    || fileName.endsWith('.doc')
    || fileName.endsWith('.docx')
}

const resetPaperFile = (fileField: PaperFileField, index?: number) => {
  if (fileField === 'file_pdf') {
    pdfQuestionFile.value = null
    paper.value.file_pdf = ''
  }
  else if (fileField === 'file_word') {
    wordQuestionAndSolutionFile.value = null
    paper.value.file_word = ''
  }
  else if (fileField === 'file_answer') {
    pdfSolutionFile.value = null
    paper.value.file_answer = ''
  }
  else if (typeof index === 'number' && extraFileList.value[index]) {
    extraFileList.value[index].file = null
    extraFileList.value[index].name = null
  }
}

const validatePaperFile = (fileField: PaperFileField, file: File) => {
  if (fileField === 'file_pdf' && !isPdfFile(file)) {
    $toast.error('Please upload a valid PDF file')
    return false
  }

  if (fileField === 'file_word' && !isWordFile(file)) {
    $toast.error('Please upload a valid Word document')
    return false
  }

  if (fileField === 'file_answer' && !isPdfFile(file) && !isWordFile(file)) {
    $toast.error('Please upload a valid PDF or Word document')
    return false
  }

  return true
}

const setUploadedFileName = (
  fileField: PaperFileField,
  fileName: string,
  index?: number,
) => {
  if (fileField === 'file_pdf') {
    paper.value.file_pdf = fileName
  }
  else if (fileField === 'file_word') {
    paper.value.file_word = fileName
  }
  else if (fileField === 'file_answer') {
    paper.value.file_answer = fileName
  }
  else if (typeof index === 'number' && extraFileList.value[index]) {
    extraFileList.value[index].name = fileName
  }
}

const uploadPaperFile = async (
  fileField: PaperFileField,
  value: File | File[] | null,
  index?: number,
) => {
  const file = getSelectedFile(value)

  if (!file) {
    resetPaperFile(fileField, index)
    return
  }

  if (!validatePaperFile(fileField, file)) {
    resetPaperFile(fileField, index)
    return
  }

  setUploadingFile(fileField, true, index)

  try {
    const response = await uploadFile(file)

    if (response.status == 1 && response.data && response.data.length > 0) {
      const uploadedFileName = response.data[0]?.file.name ?? ''
      setUploadedFileName(fileField, uploadedFileName, index)
    }
    else {
      resetPaperFile(fileField, index)
    }
  }
  finally {
    setUploadingFile(fileField, false, index)
  }
}

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

const submitPaper = async () => {
  const response = await addItem({
    ...paper.value,
    file_extra: extraFileList.value
      .filter(item => item.type && item.name)
      .map(item => ({
        type: Number(item.type),
        file: item.name || '',
      })),
  })

  if (response.status === 1 && response.data?.id !== 0) {
    router.push('/user/paper')
  }
}

onMounted(async () => {
  await getBoards()
  await getExtraTypeFile('test_extra_file')
})
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
