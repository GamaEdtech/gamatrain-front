<template>
  <v-container class="paper-form d-flex flex-column ga-6">
    <div>
      <h1 class="text-h5 font-weight-medium text-grey900">
        Add a past paper
      </h1>
      <p class="text-body-2 text-grey600 mt-1">
        Start with the files: we read the question paper and fill in its details for you to check.
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
          :key="formKey"
          v-model:changes="fileChanges"
          v-model:uploading="filesUploading"
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
            v-if="detection"
            :detection="detection"
            applied
          />

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
                :bg-color="fieldTint('board')"
                :defalut-lable="false"
                density="compact"
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
                :bg-color="fieldTint('grade')"
                density="compact"
                :defalut-lable="false"
                :disabled="!paper.board || loadingGrade"
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
                :bg-color="fieldTint('subject')"
                density="compact"
                :defalut-lable="false"
                :disabled="!paper.board || !paper.grade || loadingSubject"
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
                :bg-color="fieldTint('classification')"
                density="compact"
                :defalut-lable="false"
                :disabled="!paper.board || loadingClassification"
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
                :bg-color="fieldTint('variant')"
                density="compact"
                :defalut-lable="false"
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
                :bg-color="fieldTint('edu_year')"
                density="compact"
                :defalut-lable="false"
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
                :bg-color="fieldTint('edu_month')"
                density="compact"
                :defalut-lable="false"
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
                :has-search="false"
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
                :has-search="false"
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
                :has-search="false"
              />
            </v-col>

            <v-col cols="12">
              <div class="container-topics rounded-lg pa-2">
                <common-multi-choice-check-box-list
                  v-model:choices="paper.topics"
                  title="Topics"
                  :loading-get-data="loadingTopic"
                  :data="topics?.map((item) => ({ id: item.id, title: item.title }))"
                  :disabled="!paper.subject"
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
        :disabled="!canSubmit"
        @click="submitPaper"
      >
        Submit for review
      </v-btn>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ANSWER_STATUS_LIST, TEST_LEVEL_LIST, YEAR_LIST, MONTH_LIST, HOLDING_LEVEL_LIST } from '@/constants'
import type { ApiResult, PaperDetectionDTO, PaperFileChangeDTO, PastPaperCreateDTO } from '@/types'
import type { DetectedField } from '~/composables/usePaperDetection'

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
  variant: '',
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
const filesEditor = ref<{ hasQuestion: boolean, missingKind: boolean } | null>(null)
const hasQuestion = computed(() => Boolean(filesEditor.value?.hasQuestion))

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

// The question paper's cover fills in the details; each filled field is marked until the user changes it.
const { detection, apply: applyDetection, isFilled, forget } = usePaperDetection(paper, { getGrades, getClassification, getSubjects, getTopics })
const detected = (found: PaperDetectionDTO) => applyDetection(found)
const fieldTint = (field: DetectedField) => (isFilled(field) ? 'blue-lighten-5' : undefined)

const canSubmit = computed(() => isFormValid.value && !filesUploading.value && hasQuestion.value && !filesEditor.value?.missingKind)
const submitHint = computed(() => {
  if (filesUploading.value) return 'Waiting for the files to finish uploading...'
  if (!hasQuestion.value) return 'Add the question paper (PDF) first.'
  if (filesEditor.value?.missingKind) return 'Choose the kind of each other file.'
  if (!isFormValid.value) return 'Fill in the required details.'
  return ''
})

// A detail the user picks is theirs: it, and the details below it that it clears, are no longer "from your PDF".
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
  loadVariants()
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
