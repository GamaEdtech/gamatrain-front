<template>
  <v-container class="w-100 d-flex flex-column">
    <v-form
      v-model="isFormValid"
      class="w-100 d-flex flex-column"
    >
      <h1 class="text-h6 text-grey700 font-weight-regular">
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
            base-color="grey400"
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
            base-color="grey400"
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
            base-color="grey400"
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
            label="Classification"
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
            base-color="grey400"
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
            base-color="grey400"
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
            base-color="grey400"
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
            base-color="grey400"
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
            base-color="grey400"
            color="primary"
            density="compact"
            :defalut-lable="false"
            :disabled="!areMainFieldsEditable"
            :rules="[required]"
          />
        </div>

        <div class="each-item d-flex flex-column align-start justify-start ga-1 mt-4">
          <common-gombo-box
            v-model="paper.variant"
            label="Variant (optional)"
            :items="variants"
            :loading-value="loadingGetItemById"
            rounded="pill"
            height="48"
            base-color="grey400"
            color="primary"
            density="compact"
            :defalut-lable="false"
            :disabled="!areMainFieldsEditable"
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
            base-color="grey400"
            color="primary"
            density="compact"
            :defalut-lable="false"
            :has-search="false"
            :disabled="!areMainFieldsEditable"
          />
        </div>

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

        <paper-files-editor
          v-model:changes="fileChanges"
          v-model:uploading="filesUploading"
          :files="existingFiles"
          :pending="pendingEdit"
          :paper-id="paperId"
          :admin="admin"
          :can-remove="canRemoveFiles"
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
import type { PaperFileChangeDTO, PaperFileDTO, PaperPendingEditDTO, PastPaperCreateDTO, PastPaperDetailDTO } from '@/types'

type PaperForm = Omit<PastPaperCreateDTO, 'files'>

// The paper edit form: a teacher's own paper, or (admin) any paper through the admin endpoints.
const props = defineProps<{ admin?: boolean }>()

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
} = useBoard()
const { getItemById, loadingGetItemById, editItem, loadingEditItem } = usePastPaper({ admin: props.admin })
const { required, minLength } = useValidationRules()
const { $toast } = useNuxtApp()

// The variants (nv, 1, 2, A...), from the types list.
const variants = ref<{ id: string, title: string }[]>([])
const loadVariants = async () => {
  try {
    const response = await useApiService.get<ApiResult<{ id: string, title: string }[]>>('/api/v2/search/types', { type: 'variant' })
    variants.value = response.succeeded && Array.isArray(response.data) ? response.data.map(item => ({ id: String(item.id), title: item.title })) : []
  }
  catch {
    variants.value = []
  }
}

const isFormValid = ref(false)
// The files: the paper's stored ones, the owner's edit waiting for review, and the changes made here (sent on Submit).
const existingFiles = ref<PaperFileDTO[]>([])
const pendingEdit = ref<PaperPendingEditDTO | null>(null)
const fileChanges = ref<PaperFileChangeDTO[]>([])
const filesUploading = ref(false)
const hasUploadInProgress = computed(() => filesUploading.value)
const paperStatus = ref('')
const editableStatusList = ['0', '2', '3']
// A teacher changes the main fields only while the paper waits for review or was sent back; an admin, in any status
// (the admin edit keeps the paper's status).
const areMainFieldsEditable = computed(() => {
  if (props.admin) return true
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
  variant: '',
  holding_level: '',
  title: '',
  description: '',
  state: '',
  area: '',
  school: '',
})

const paperId = computed(() => String(route.params.id || ''))

const getNumber = (value: string | number | undefined, fallback: number) => {
  const parsedValue = Number(value)

  return Number.isNaN(parsedValue) ? fallback : parsedValue
}

// Files are removed until the paper is past review; on a published paper the removal waits for review with the edit; an
// admin removes in any status. The question paper is only ever replaced.
const canRemoveFiles = computed(() => props.admin || ['0', '1', '3'].includes(paperStatus.value))

const getTopicsFromItem = (item: PastPaperDetailDTO) => {
  if (Array.isArray(item.topics)) return item.topics.map(item => item.id)
  if (item.topic) {
    return item.topic
      .split('+')
      .filter(Boolean)
  }

  return []
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
  // 0 means no variant on gama-api.
  paper.value.variant = item.variant && String(item.variant) !== '0' ? String(item.variant) : ''
  paper.value.holding_level = getNumber(item.holding_level, 4)
  paper.value.title = item.title || ''
  paper.value.description = item.description || ''
  paper.value.state = item.state || ''
  paper.value.area = item.area || ''
  paper.value.school = item.school || ''
  existingFiles.value = Array.isArray(item.files) ? item.files : []
  pendingEdit.value = item.pending_edit ?? null

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
}

const submitPaper = async () => {
  if (hasUploadInProgress.value) {
    $toast.error('Please wait until the file upload is complete.')
    return
  }

  const response = await editItem(paperId.value, { ...paper.value, files: fileChanges.value })

  if (response.status === 1 && response.data?.id !== 0) {
    router.push(props.admin ? '/admin/past-papers' : '/user/paper')
  }
}

const initData = async () => {
  const [paperResponse] = await Promise.all([
    getItemById(paperId.value),
    getBoards(),
    loadVariants(),
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
