<template>
  <v-container class="paper-form d-flex flex-column ga-6">
    <div>
      <h1 class="text-h5 font-weight-medium text-grey900">
        Edit past paper
      </h1>
      <p class="text-body-2 text-grey600 mt-1">
        {{ areMainFieldsEditable
          ? 'Change the files or the details. A new question paper can fill in the details for you.'
          : 'This paper is published: you can change its files and description, and they are reviewed before they go live.' }}
      </p>
    </div>

    <v-form
      v-model="isFormValid"
      class="d-flex flex-column ga-6"
    >
      <section>
        <div class="section-title">
          <span class="section-step">1</span> Files
        </div>
        <paper-files-editor
          ref="filesEditor"
          v-model:changes="fileChanges"
          v-model:uploading="filesUploading"
          :files="existingFiles"
          :pending="pendingEdit"
          :paper-id="paperId"
          :admin="admin"
          :can-remove="canRemoveFiles"
          @detected="detected"
        />
      </section>

      <section>
        <div class="section-title">
          <span class="section-step">2</span> Paper details
        </div>
        <v-card
          variant="outlined"
          rounded="lg"
          class="pa-4 d-flex flex-column ga-4"
        >
          <paper-detected-banner
            v-if="detection && areMainFieldsEditable"
            :detection="detection"
            :applied="detectionApplied"
            :loading="applyingDetection"
            @apply="applyDetected"
          />
          <v-alert
            v-if="!areMainFieldsEditable"
            type="info"
            variant="tonal"
            density="compact"
            icon="md:lock"
          >
            The details of a published paper are locked. To change them, contact support.
          </v-alert>

          <v-row dense>
            <v-col
              cols="12"
              md="4"
            >
              <common-gombo-box
                v-model="paper.board"
                label="Board"
                :items="boards?.map((board) => ({ id: board.code, title: board.title }))"
                :data-loading="loadingBoards"
                rounded="pill"
                height="48"
                base-color="grey400"
                color="primary"
                density="compact"
                :defalut-lable="false"
                :loading-value="loadingGetItemById"
                :bg-color="fieldTint('board')"
                :disabled="!areMainFieldsEditable"
                :rules="[required]"
                @update:model-value="boardChange"
              />
              <paper-auto-hint v-if="isFilled('board')" />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <common-gombo-box
                v-model="paper.grade"
                label="Grade"
                :items="grades?.map((item) => ({ id: item.id, title: item.title }))"
                :data-loading="loadingBoards || loadingGrade"
                rounded="pill"
                height="48"
                base-color="grey400"
                color="primary"
                density="compact"
                :defalut-lable="false"
                :loading-value="loadingGetItemById"
                :bg-color="fieldTint('grade')"
                :disabled="!areMainFieldsEditable || !paper.board || loadingGrade"
                :rules="[required]"
                @update:model-value="gradeChange"
              />
              <paper-auto-hint v-if="isFilled('grade')" />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <common-gombo-box
                v-model="paper.subject"
                label="Subject"
                :items="subjects?.map((item) => ({ id: item.id, title: item.title }))"
                :data-loading="loadingBoards || loadingGrade || loadingSubject"
                rounded="pill"
                height="48"
                base-color="grey400"
                color="primary"
                density="compact"
                :defalut-lable="false"
                :loading-value="loadingGetItemById"
                :bg-color="fieldTint('subject')"
                :disabled="!areMainFieldsEditable || !paper.board || !paper.grade || loadingSubject"
                :rules="[required]"
                @update:model-value="subjectChange"
              />
              <paper-auto-hint v-if="isFilled('subject')" />
            </v-col>

            <v-col
              cols="12"
              md="4"
            >
              <common-gombo-box
                v-model="paper.classification"
                label="Paper type"
                :items="classifications?.map((item) => ({ id: item.id, title: item.title }))"
                :data-loading="loadingBoards || loadingClassification"
                rounded="pill"
                height="48"
                base-color="grey400"
                color="primary"
                density="compact"
                :defalut-lable="false"
                :loading-value="loadingGetItemById"
                :bg-color="fieldTint('classification')"
                :disabled="!areMainFieldsEditable || !paper.board || loadingClassification"
                @update:model-value="forget('classification')"
              />
              <paper-auto-hint v-if="isFilled('classification')" />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <common-gombo-box
                v-model="paper.variant"
                label="Variant"
                :items="variants"
                rounded="pill"
                height="48"
                base-color="grey400"
                color="primary"
                density="compact"
                :defalut-lable="false"
                :loading-value="loadingGetItemById"
                :bg-color="fieldTint('variant')"
                :disabled="!areMainFieldsEditable"
                @update:model-value="forget('variant')"
              />
              <paper-auto-hint v-if="isFilled('variant')" />
            </v-col>
            <v-col
              cols="6"
              md="2"
            >
              <common-gombo-box
                v-model="paper.edu_year"
                label="Year"
                :items="YEAR_LIST.map((item) => ({ id: item.toString(), title: item.toString() }))"
                rounded="pill"
                height="48"
                base-color="grey400"
                color="primary"
                density="compact"
                :defalut-lable="false"
                :loading-value="loadingGetItemById"
                :bg-color="fieldTint('edu_year')"
                :disabled="!areMainFieldsEditable"
                :rules="[required]"
                @update:model-value="forget('edu_year')"
              />
              <paper-auto-hint v-if="isFilled('edu_year')" />
            </v-col>
            <v-col
              cols="6"
              md="2"
            >
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
                :loading-value="loadingGetItemById"
                :bg-color="fieldTint('edu_month')"
                :disabled="!areMainFieldsEditable"
                :rules="[required]"
                @update:model-value="forget('edu_month')"
              />
              <paper-auto-hint v-if="isFilled('edu_month')" />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="paper.title"
                label="Title"
                density="compact"
                variant="outlined"
                rounded="pill"
                color="primary"
                base-color="grey400"
                :bg-color="fieldTint('title')"
                :loading="loadingGetItemById"
                :disabled="!areMainFieldsEditable"
                :rules="[required]"
                hide-details="auto"
                @update:model-value="forget('title')"
              />
              <paper-auto-hint v-if="isFilled('title')" />
            </v-col>

            <v-col
              cols="12"
              md="4"
            >
              <common-gombo-box
                v-model="paper.answer_type"
                label="Solution availability"
                :items="ANSWER_STATUS_LIST"
                rounded="pill"
                height="48"
                base-color="grey400"
                color="primary"
                density="compact"
                :defalut-lable="false"
                :loading-value="loadingGetItemById"
                :has-search="false"
                :disabled="!areMainFieldsEditable"
                :rules="[required]"
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <common-gombo-box
                v-model="paper.level"
                label="Difficulty level"
                :items="TEST_LEVEL_LIST"
                rounded="pill"
                height="48"
                base-color="grey400"
                color="primary"
                density="compact"
                :defalut-lable="false"
                :loading-value="loadingGetItemById"
                :has-search="false"
                :disabled="!areMainFieldsEditable"
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <common-gombo-box
                v-model="paper.holding_level"
                label="Testing scope"
                :items="HOLDING_LEVEL_LIST"
                rounded="pill"
                height="48"
                base-color="grey400"
                color="primary"
                density="compact"
                :defalut-lable="false"
                :loading-value="loadingGetItemById"
                :has-search="false"
                :disabled="!areMainFieldsEditable"
              />
            </v-col>

            <v-col cols="12">
              <div class="container-topics rounded-lg pa-2">
                <common-multi-choice-check-box-list
                  v-model:choices="paper.topics"
                  title="Topics"
                  :loading-get-data="loadingGetItemById || loadingTopic"
                  :data="topics?.map((item) => ({ id: item.id, title: item.title }))"
                  :disabled="!areMainFieldsEditable || !paper.subject"
                />
              </div>
            </v-col>
          </v-row>
        </v-card>
      </section>

      <section>
        <div class="section-title">
          <span class="section-step">3</span> Description
        </div>
        <v-card
          variant="outlined"
          rounded="lg"
          class="pa-4"
        >
          <v-textarea
            v-model="paper.description"
            density="compact"
            variant="outlined"
            rounded="lg"
            color="primary"
            base-color="grey400"
            placeholder="What is in this paper, and what is it good for? (at least 70 characters)"
            :loading="loadingGetItemById"
            no-resize
            rows="6"
            counter
            :rules="[required, minLength(70)]"
          />
        </v-card>
      </section>
    </v-form>

    <div class="form-actions d-flex align-center justify-end flex-wrap ga-3 pa-3 rounded-lg">
      <span
        v-if="submitHint"
        class="text-caption text-grey600 mr-auto"
      >{{ submitHint }}</span>
      <v-btn
        variant="outlined"
        color="lightError"
        :to="admin ? '/admin/past-papers' : '/user/paper'"
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
        :disabled="!canSubmit"
        @click="submitPaper"
      >
        {{ admin || areMainFieldsEditable ? 'Save' : 'Submit for review' }}
      </v-btn>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ANSWER_STATUS_LIST, TEST_LEVEL_LIST, YEAR_LIST, MONTH_LIST, HOLDING_LEVEL_LIST } from '@/constants'
import type { PaperDetectionDTO, PaperFileChangeDTO, PaperFileDTO, PaperPendingEditDTO, PastPaperCreateDTO, PastPaperDetailDTO } from '@/types'
import type { DetectedField } from '~/composables/usePaperDetection'

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
const filesEditor = ref<{ hasQuestion: boolean, missingKind: boolean } | null>(null)
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

// A new question paper's cover can fill in the details; on an edit the user's own values come first, so it is applied only
// when they ask (Apply details), and each filled field is marked until they change it.
const { detection, apply: applyDetection, applying: applyingDetection, isFilled, forget } = usePaperDetection(paper, { getGrades, getClassification, getSubjects, getTopics })
const detectionApplied = ref(false)
const detected = (found: PaperDetectionDTO) => {
  detection.value = found
  detectionApplied.value = false
}
const applyDetected = async () => {
  if (!detection.value) return
  await applyDetection(detection.value)
  detectionApplied.value = true
}
const fieldTint = (field: DetectedField) => (isFilled(field) ? 'blue-lighten-5' : undefined)

const canSubmit = computed(() => isFormValid.value && !hasUploadInProgress.value && !filesEditor.value?.missingKind
  && (filesEditor.value?.hasQuestion ?? true))
const submitHint = computed(() => {
  if (hasUploadInProgress.value) return 'Waiting for the files to finish uploading...'
  if (filesEditor.value && !filesEditor.value.hasQuestion) return 'The paper needs its question paper (PDF).'
  if (filesEditor.value?.missingKind) return 'Choose the kind of each other file.'
  if (!isFormValid.value) return 'Fill in the required details.'
  return ''
})

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
  for (const field of ['board', 'grade', 'subject', 'classification'] as const) forget(field)
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
  forget('grade')
  forget('subject')
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
  forget('subject')
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
.paper-form {
  max-width: 1100px;
}
.container-topics {
  border: 1px solid rgb(var(--v-theme-grey200));
}
.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 8px;
}
.section-step {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 0.8rem;
  color: rgb(var(--v-theme-on-primary));
  background: rgb(var(--v-theme-primary));
}
.form-actions {
  position: sticky;
  bottom: 8px;
  z-index: 2;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgb(var(--v-theme-grey200));
}
</style>
