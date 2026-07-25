<template>
  <v-container class="w-100 d-flex flex-column">
    <v-form
      v-model="isFormValid"
      class="w-100 d-flex flex-column"
    >
      <h1 class="text-h4 text-grey700 font-weight-regular">
        Past Papers Edit Form
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
            :loading-value="loadingGetItemById"
            rounded="pill"
            height="48"
            base-color="grey200"
            color="primary"
            :defalut-lable="false"
            density="compact"
            :disabled="!areMainFieldsEditable"
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
            :loading-value="loadingGetItemById"
            rounded="pill"
            height="48"
            base-color="grey200"
            color="primary"
            density="compact"
            :defalut-lable="false"
            :disabled="!areMainFieldsEditable || !paper.board || loadingGrade"
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
            :loading-value="loadingGetItemById"
            rounded="pill"
            height="48"
            base-color="grey200"
            color="primary"
            density="compact"
            :defalut-lable="false"
            :disabled="!areMainFieldsEditable || !paper.board || !paper.grade || loadingSubject"
            :rules="[required]"
            @update:model-value="subjectChange"
          />
        </div>

        <div class="container-topics w-100 d-flex flex-column align-start justify-start ga-1 mt-4 rounded-lg pa-2">
          <common-multi-choice-check-box-list
            v-model:choices="paper.topics"
            title="Topics"
            :loading-get-data="loadingGetItemById || loadingTopic"
            :data="topics?.map((item) => {
              return {
                id: item.id,
                title: item.title,
              }
            })"
            :disabled="!areMainFieldsEditable || !paper.subject"
          />
        </div>

        <div class="each-item d-flex flex-column align-start justify-start ga-1 mt-4">
          <common-gombo-box
            v-model="paper.classification"
            label="Subject"
            :items="classifications?.map((item) => {
              return {
                id: item.id,
                title: item.title,
              }
            })"
            :data-loading="loadingBoards || loadingClassification"
            :loading-value="loadingGetItemById"
            rounded="pill"
            height="48"
            base-color="grey200"
            color="primary"
            density="compact"
            :defalut-lable="false"
            :disabled="!areMainFieldsEditable || !paper.board || loadingClassification"
          />
        </div>

        <div class="each-item d-flex flex-column align-start justify-start ga-1 mt-4">
          <common-gombo-box
            v-model="paper.answer_type"
            label="Solution Availability"
            :items="ANSWER_STATUS_LIST"
            :loading-value="loadingGetItemById"
            rounded="pill"
            height="48"
            base-color="grey200"
            color="primary"
            density="compact"
            :defalut-lable="false"
            :has-search="false"
            :disabled="!areMainFieldsEditable"
            :rules="[required]"
          />
        </div>

        <div class="each-item d-flex flex-column align-start justify-start ga-1 mt-4">
          <common-gombo-box
            v-model="paper.level"
            label="Difficulty Level"
            :items="TEST_LEVEL_LIST"
            :loading-value="loadingGetItemById"
            rounded="pill"
            height="48"
            base-color="grey200"
            color="primary"
            density="compact"
            :defalut-lable="false"
            :has-search="false"
            :disabled="!areMainFieldsEditable"
          />
        </div>

        <div class="each-item d-flex flex-column align-start justify-start ga-1 mt-4">
          <common-gombo-box
            v-model="paper.edu_year"
            label="Year"
            :loading-value="loadingGetItemById"
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
            :disabled="!areMainFieldsEditable"
            :rules="[required]"
          />
        </div>

        <div class="each-item d-flex flex-column align-start justify-start ga-1 mt-4">
          <common-gombo-box
            v-model="paper.edu_month"
            label="Month"
            :items="MONTH_LIST"
            :loading-value="loadingGetItemById"
            rounded="pill"
            height="48"
            base-color="grey200"
            color="primary"
            density="compact"
            :defalut-lable="false"
            :disabled="!areMainFieldsEditable"
            :rules="[required]"
          />
        </div>

        <div class="each-item d-flex flex-column align-start justify-start ga-1 mt-4">
          <common-gombo-box
            v-model="paper.holding_level"
            label="Testing Scope"
            :items="HOLDING_LEVEL_LIST"
            :loading-value="loadingGetItemById"
            rounded="pill"
            height="48"
            base-color="grey200"
            color="primary"
            density="compact"
            :defalut-lable="false"
            :has-search="false"
            :disabled="!areMainFieldsEditable"
          />
        </div>

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
            :disabled="!areMainFieldsEditable"
            :rules="[required]"
          >
            <template #prepend-inner>
              <v-progress-circular
                v-if="loadingGetItemById"
                indeterminate
                size="20"
                color="primary"
                class="mx-2"
              />
            </template>
          </v-text-field>
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
          >
            <template #prepend-inner>
              <v-progress-circular
                v-if="loadingGetItemById"
                indeterminate
                size="20"
                color="primary"
                class="mx-2"
              />
            </template>
          </v-textarea>
        </div>

        <div class="each-item d-flex flex-column align-start justify-start ga-1 mt-4">
          <span class="text-h6 text-grey700 font-weight-medium">
            Pdf Question
            <span
              v-if="hasExistingFile('pdf') || paper.file_pdf"
              class="text-subtitle-1 text-grey600"
            >
              ({{ getFileStatusText('pdf') }})
            </span>
          </span>
          <v-file-input
            v-model="pdfQuestionFile"
            density="compact"
            variant="outlined"
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
                v-if="isUploadingFile('file_pdf') || loadingGetItemById"
                indeterminate
                size="20"
                color="primary"
                class="mx-2"
              />
            </template>
            <template #append>
              <v-icon
                v-if="hasExistingFile('pdf')"
                size="26"
                color="error"
                class="cursor-pointer"
                @click.stop="downloadExistingFile('q_pdf')"
              >
                md:download
              </v-icon>
            </template>
          </v-file-input>
        </div>

        <div class="each-item d-flex flex-column align-start justify-start ga-1 mt-4">
          <span class="text-h6 text-grey700 font-weight-medium">
            Pdf Solution
            <span
              v-if="hasExistingFile('answer') || paper.file_answer"
              class="text-subtitle-1 text-grey600"
            >
              ({{ getFileStatusText('answer') }})
            </span>
          </span>
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
                v-if="isUploadingFile('file_answer') || loadingGetItemById"
                indeterminate
                size="20"
                color="primary"
                class="mx-2"
              />
            </template>
            <template #append>
              <v-icon
                v-if="hasExistingFile('answer')"
                size="26"
                color="error"
                class="cursor-pointer"
                @click.stop="downloadExistingFile('a_file')"
              >
                md:download
              </v-icon>
            </template>
          </v-file-input>
        </div>

        <div class="each-item d-flex flex-column align-start justify-start ga-1 mt-4">
          <span class="text-h6 text-grey700 font-weight-medium">
            Word Q & S
            <span
              v-if="hasExistingFile('word') || paper.file_word"
              class="text-subtitle-1 text-grey600"
            >
              ({{ getFileStatusText('word') }})
            </span>
          </span>
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
                v-if="isUploadingFile('file_word') || loadingGetItemById"
                indeterminate
                size="20"
                color="primary"
                class="mx-2"
              />
            </template>
            <template #append>
              <v-icon
                v-if="hasExistingFile('word')"
                size="26"
                color="info"
                class="cursor-pointer"
                @click.stop="downloadExistingFile('q_word')"
              >
                md:download
              </v-icon>
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
              :loading-value="loadingGetItemById"
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
            <span class="text-h6 text-grey700 font-weight-medium">
              Extra File
              <span
                v-if="hasExistingExtraFile(extra) || extra.name"
                class="text-subtitle-1 text-grey600"
              >
                ({{ getExtraFileStatusText(extra) }})
              </span>
            </span>
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
                    v-if="isUploadingFile('file_extra', index) || loadingGetItemById"
                    indeterminate
                    size="20"
                    color="primary"
                    class="mx-2"
                  />
                </template>
                <template #append>
                  <v-icon
                    v-if="hasExistingExtraFile(extra)"
                    size="26"
                    color="success"
                    class="cursor-pointer"
                    @click.stop="downloadExistingFile('extra', extra.id)"
                  >
                    md:download
                  </v-icon>
                </template>
              </v-file-input>
              <!-- <v-icon
                size="24"
                color="lightError"
                class="cursor-pointer mt-2"
                @click="removeExtra(index)"
              >
                md:delete
              </v-icon> -->
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
        :loading="loadingEditItem"
        :disabled="!isFormValid || hasUploadInProgress"
        @click="submitPaper"
      >
        Submit
      </v-btn>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ANSWER_STATUS_LIST, TEST_LEVEL_LIST, YEAR_LIST, MONTH_LIST, HOLDING_LEVEL_LIST } from '@/constants'
import type { FilesDTO, PastPaperCreateDTO, PastPaperDetailDTO } from '@/types'

interface ExtraFileInfo {
  id?: string | number | null
  name: string | null
  type: string | number
  file: File | File[] | null
}

type PaperFileField = 'file_pdf' | 'file_word' | 'file_answer' | 'file_extra'
type PaperForm = Omit<PastPaperCreateDTO, 'file_extra'>

definePageMeta({
  layout: 'dashboard-layout',
  middleware: ['auth', 'user-type'],
})

useSeoMeta({
  title: 'Edit Paper',
})

const route = useRoute()
const router = useRouter()
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
  getClassification,
  resetClassifications,
  loadingClassification,
  classifications,
  getTopics,
  resetTopics,
  loadingTopic,
  topics,
  getExtraTypeFile,
  extraTypeFile,
  loadingExtraTypeFile,
} = useBoard()
const { getItemById, loadingGetItemById, editItem, loadingEditItem } = usePastPaper()
const { downloadFile, loadingDownloadPastPaperFile } = usePastPaperDownload()
const { required, minLength } = useValidationRules()
const { uploadFile } = useUpload()
const { $toast } = useNuxtApp()

const isFormValid = ref(false)
const hasUploadInProgress = computed(() => uploadingFileKeys.value.length > 0)
const paperStatus = ref('')
const editableStatusList = ['0', '2', '3']
const areMainFieldsEditable = computed(() => {
  return paperStatus.value
    ? editableStatusList.includes(paperStatus.value)
    : true
})

const paper = ref<PaperForm>({
  board: '',
  grade: '',
  subject: '',
  classification: '',
  topics: [],
  answer_type: '',
  level: '',
  edu_year: '',
  edu_month: '',
  holding_level: '',
  title: '',
  description: '',
  file_pdf: '',
  file_word: '',
  file_answer: '',
  state: '',
  area: '',
  school: '',
})

const pdfQuestionFile = ref<File | File[] | null>(null)
const pdfSolutionFile = ref<File | File[] | null>(null)
const wordQuestionAndSolutionFile = ref<File | File[] | null>(null)
const extraFileList = ref<ExtraFileInfo[]>([])
const uploadingFileKeys = ref<string[]>([])
const existingFiles = ref<FilesDTO | null>(null)

const paperId = computed(() => String(route.params.id || ''))

const getNumber = (value: string | number | undefined, fallback: number) => {
  const parsedValue = Number(value)

  return Number.isNaN(parsedValue) ? fallback : parsedValue
}

type MainFileType = keyof Pick<FilesDTO, 'answer' | 'pdf' | 'word'>

const hasExistingFile = (type: MainFileType) => {
  return existingFiles.value?.[type]?.exist === true
}

const hasExistingExtraFile = (extra: ExtraFileInfo) => {
  return Boolean(extra.id)
}

const getFileStatusText = (type: MainFileType) => {
  const uploadedFiles = {
    answer: paper.value.file_answer,
    pdf: paper.value.file_pdf,
    word: paper.value.file_word,
  }

  return uploadedFiles[type] ? 'new file selected' : 'saved file attached'
}

const getExtraFileStatusText = (extra: ExtraFileInfo) => {
  return extra.name ? 'new file selected' : 'saved file attached'
}

const downloadExistingFile = async (
  type: 'q_word' | 'q_pdf' | 'a_file' | 'extra',
  extraId?: string | number | null,
) => {
  if (loadingDownloadPastPaperFile.value || (type === 'extra' && !extraId)) return

  await downloadFile(paperId.value, type, extraId || undefined)
}

const getTopicsFromItem = (item: PastPaperDetailDTO) => {
  if (Array.isArray(item.topics)) return item.topics.map(item => item.id)
  if (item.topic) {
    return item.topic
      .split('+')
      .filter(Boolean)
  }

  return []
}

const addExtraFile = () => {
  extraFileList.value.push({ type: '', file: null, name: null })
}

// const removeExtra = (index: number) => {
//   const hasExtraUploadInProgress = uploadingFileKeys.value.some(key =>
//     key.startsWith('file_extra-'),
//   )

//   if (hasExtraUploadInProgress) {
//     $toast.error('Please wait until the file upload is complete.')
//     return
//   }

//   extraFileList.value.splice(index, 1)
//   uploadingFileKeys.value = uploadingFileKeys.value.filter(
//     key => key !== getUploadKey('file_extra', index),
//   )
// }

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

const getSelectedFile = (value: unknown) => {
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
  value: unknown,
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

const applyPaperData = (item: PastPaperDetailDTO) => {
  paperStatus.value = item.status || ''
  paper.value.board = item.section || ''
  paper.value.answer_type = getNumber(item.answer_type, 0)
  paper.value.level = getNumber(item.level, 2)
  paper.value.edu_year = item.edu_year || ''
  paper.value.edu_month = item.edu_month || ''
  paper.value.holding_level = getNumber(item.holding_level, 4)
  paper.value.title = item.title || ''
  paper.value.description = item.description || ''
  paper.value.state = item.state || ''
  paper.value.area = item.area || ''
  paper.value.school = item.school || ''
  existingFiles.value = item.files || null

  if (paper.value.board) {
    getGrades(paper.value.board)
    getClassification(paper.value.board)
  }

  paper.value.grade = item.base || ''

  if (paper.value.grade) {
    getSubjects(paper.value.grade)
  }

  paper.value.subject = item.lesson || ''

  if (paper.value.subject) {
    getTopics(paper.value.subject)
  }

  paper.value.classification = item.test_type || ''
  paper.value.topics = getTopicsFromItem(item)

  extraFileList.value = item.files?.extra?.map(file => ({
    id: file.id || null,
    type: file.type || '',
    file: null,
    name: null,
  })) || []
}

const submitPaper = async () => {
  if (hasUploadInProgress.value) {
    $toast.error('Please wait until the file upload is complete.')
    return
  }

  const response = await editItem(paperId.value, {
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

const initData = async () => {
  const [paperResponse] = await Promise.all([
    getItemById(paperId.value),
    getBoards(),
    getExtraTypeFile('test_extra_file'),
  ])

  if (paperResponse.data) {
    await applyPaperData(paperResponse.data)
  }
}

onMounted(async () => {
  await initData()
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
