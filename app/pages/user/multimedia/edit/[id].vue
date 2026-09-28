<template>
  <v-container class="w-100 d-flex flex-column">
    <v-form
      v-model="isFormValid"
      class="w-100 d-flex flex-column"
    >
      <h1 class="text-h4 text-grey700 font-weight-regular">
        Multimedia Edit Form
      </h1>

      <div class="d-flex flex-wrap justify-space-between">
        <div class="each-item d-flex flex-column align-start justify-start ga-1 mt-4">
          <common-gombo-box
            v-model="multimedia.board"
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
            :rules="[required]"
            @update:model-value="boardChange"
          />
        </div>

        <div class="each-item d-flex flex-column align-start justify-start ga-1 mt-4">
          <common-gombo-box
            v-model="multimedia.grade"
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
            :disabled="!multimedia.board || loadingGrade"
            :rules="[required]"
            @update:model-value="gradeChange"
          />
        </div>

        <div class="each-item d-flex flex-column align-start justify-start ga-1 mt-4">
          <common-gombo-box
            v-model="multimedia.subject"
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
            :disabled="!multimedia.board || !multimedia.grade || loadingSubject"
            :rules="[required]"
            @update:model-value="subjectChange"
          />
        </div>

        <div class="container-topics w-100 d-flex flex-column align-start justify-start ga-1 mt-4 rounded-lg pa-2">
          <common-multi-choice-check-box-list
            v-model:choices="multimedia.topics"
            title="Topics"
            :loading-get-data="loadingGetItemById || loadingTopic"
            :data="topics?.map((item) => {
              return {
                id: item.id,
                title: item.title,
              }
            })"
            :disabled="!multimedia.subject"
          />
        </div>

        <div class="w-100 d-flex flex-column align-start justify-start ga-1 mt-4 rounded-lg pa-2">
          <span class="text-h6 text-grey700 font-weight-medium">Title</span>
          <v-text-field
            v-model="multimedia.title"
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
            v-model="multimedia.description"
            density="compact"
            variant="outlined"
            label=""
            outlined
            rounded="lg"
            color="primary"
            base-color="grey200"
            class="w-100"
            placeholder="Write a brief description about the files to help the user make an informed choice"
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

        <div
          class="w-100 d-flex flex-wrap ga-1 mt-4"
        >
          <div class="each-item d-flex flex-column align-start justify-start ga-1 mt-4">
            <common-gombo-box
              v-model="multimedia.content_type"
              label="Content type"
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
              :rules="[required]"
            />
          </div>

          <div class="each-item d-flex flex-column align-start justify-start ga-1 mt-4">
            <span class="text-h6 text-grey700 font-weight-medium">
              Multimedia File
              <span
                v-if="hasExistingFile || multimedia.file"
                class="text-subtitle-1 text-grey600"
              >
                ({{ fileStatusText }})
              </span>
            </span>
            <v-file-input
              v-model="multimediaFile"
              density="compact"
              variant="outlined"
              accept=".mp4,.avi,.m4a,.mpg,.flv,.docx,.pptx,.pdf,.exe,.apk,.mp3,.wave,.acc,.swf,.gif,.zip"
              label=""
              base-color="grey200"
              color="primary"
              prepend-icon=""
              append-inner-icon="md:files"
              autocomplete="off"
              max-height="48"
              rounded="pill"
              class="w-100"
              :disabled="loadingUploadMultimediaFile"
              @update:model-value="uploadMultimediaFile"
            >
              <template #prepend-inner>
                <v-icon
                  size="20"
                  color="info"
                >
                  md:text_snippet
                </v-icon>
                <v-progress-circular
                  v-if="loadingUploadMultimediaFile || loadingGetItemById"
                  indeterminate
                  size="20"
                  color="primary"
                  class="mx-2"
                />
              </template>
              <template #append>
                <v-icon
                  v-if="hasExistingFile"
                  size="26"
                  color="info"
                  class="cursor-pointer"
                  @click.stop="downloadExistingFile"
                >
                  md:download
                </v-icon>
              </template>
            </v-file-input>
          </div>
        </div>

        <!-- <div class="w-100 d-flex flex-column align-start justify-start ga-1 mt-6 rounded-lg pa-2">
          <span class="text-h5 text-grey700 font-weight-bold">Content cover</span>
          <span class="text-h6 text-grey600 font-weight-bold">
            What pages of the book does this content cover?
          </span>
        </div> -->

        <!-- <div class="w-100 d-flex flex-wrap justify-start">
          <div class="each-item d-flex flex-column align-start justify-start ga-1 mt-4">
            <span class="text-h6 text-grey700 font-weight-medium">From page</span>
            <v-text-field
              v-model="multimedia.from_page"
              type="number"
              min="1"
              density="compact"
              variant="outlined"
              rounded="pill"
              color="primary"
              base-color="grey200"
              class="w-100"
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

          <div class="each-item d-flex flex-column align-start justify-start ga-1 mt-4 ml-2">
            <span class="text-h6 text-grey700 font-weight-medium">To page</span>
            <v-text-field
              v-model="multimedia.to_page"
              type="number"
              min="1"
              density="compact"
              variant="outlined"
              rounded="pill"
              color="primary"
              base-color="grey200"
              class="w-100"
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
        </div> -->

        <!-- <div class="w-100 d-flex align-center justify-start mt-4">
          <v-checkbox
            v-model="multimedia.free_available"
            density="compact"
            color="primary"
            hide-details
            class="text-h5"
          >
            <template #label>
              <span class="text-h5 text-grey700 font-weight-medium">
                I would like the file to be freely available to others.
              </span>
            </template>
          </v-checkbox>
        </div> -->
      </div>
    </v-form>

    <div class="d-flex align-center justify-center mt-8 ga-2">
      <v-btn
        variant="outlined"
        color="lightError"
        to="/user/multimedia"
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
        :disabled="!isFormValid || loadingUploadMultimediaFile"
        @click="submitMultimedia"
      >
        Update
      </v-btn>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import type {
  MultimediaCreateDTO,
  MultimediaDetailDTO,
  MultimediaFileInfoDTO,
} from '@/types'

type MultimediaForm = MultimediaCreateDTO

definePageMeta({
  layout: 'dashboard-layout',
  middleware: ['auth', 'user-type'],
})

useSeoMeta({
  title: 'Edit Multimedia',
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
  getTopics,
  resetTopics,
  loadingTopic,
  topics,
  getExtraTypeFile,
  extraTypeFile,
  loadingExtraTypeFile,
} = useBoard()
const { getItemById, loadingGetItemById, editItem, loadingEditItem } = useMultimedia()
const { downloadFile, loadingDownloadPastPaperFile } = usePastPaperDownload()
const { required, minLength } = useValidationRules()
const { uploadFile } = useUpload()
const { $toast } = useNuxtApp()

const isFormValid = ref(false)
const multimediaFile = ref<File | File[] | null>(null)
const existingFile = ref<MultimediaFileInfoDTO | null>(null)
const loadingUploadMultimediaFile = ref(false)
const multimediaId = computed(() => String(route.params.id || ''))
const hasExistingFile = computed(() => existingFile.value?.exist === true)
const fileStatusText = computed(() => multimedia.value.file ? 'new file selected' : 'saved file attached')

const multimedia = ref<MultimediaForm>({
  board: '',
  grade: '',
  subject: '',
  topics: [],
  title: '',
  description: '',
  content_type: '',
  // from_page: '',
  // to_page: '',
  free_available: false,
  file: '',
})

const getSelectedFile = (value: unknown) => {
  if (value instanceof File) return value
  if (Array.isArray(value)) return value[0] ?? null

  return null
}

const getTopicsFromItem = (item: MultimediaDetailDTO) => {
  if (item.topic) {
    return item.topic
      .split('+')
      .filter(Boolean)
  }

  return []
}

const boardChange = async (boardId: string | number) => {
  multimedia.value.board = boardId
  multimedia.value.grade = ''
  multimedia.value.subject = ''
  multimedia.value.topics = []
  resetGrades()
  resetSubjects()
  resetTopics()
  if (boardId) {
    await getGrades(boardId)
  }
}

const gradeChange = async (gradeId: string | number) => {
  multimedia.value.grade = gradeId
  multimedia.value.subject = ''
  multimedia.value.topics = []
  resetSubjects()
  resetTopics()
  if (gradeId) {
    await getSubjects(gradeId)
  }
}

const subjectChange = async (subjectId: string | number) => {
  multimedia.value.subject = subjectId
  multimedia.value.topics = []
  resetTopics()
  if (subjectId) {
    await getTopics(subjectId)
  }
}

const uploadMultimediaFile = async (value: unknown) => {
  const file = getSelectedFile(value)

  if (!file) {
    multimedia.value.file = ''
    return
  }

  if (file.size >= 20000000) {
    $toast.error('File size should be less than 20 MB!')
    multimediaFile.value = null
    multimedia.value.file = ''
    return
  }

  loadingUploadMultimediaFile.value = true

  try {
    const response = await uploadFile(file)

    if (response.status == 1 && response.data && response.data.length > 0) {
      multimedia.value.file = response.data[0]?.file.name ?? ''
    }
    else {
      multimediaFile.value = null
      multimedia.value.file = ''
    }
  }
  finally {
    loadingUploadMultimediaFile.value = false
  }
}

const applyMultimediaData = async (item: MultimediaDetailDTO) => {
  multimedia.value.board = item.section || ''
  multimedia.value.topics = getTopicsFromItem(item)
  multimedia.value.title = item.title || ''
  multimedia.value.description = item.description || ''
  multimedia.value.content_type = item.content_type || ''
  // multimedia.value.from_page = item.from_page || ''
  // multimedia.value.to_page = item.to_page || ''
  multimedia.value.free_available = item.free_aggrement === '1'
  multimedia.value.file = ''
  existingFile.value = item.files || null

  if (multimedia.value.board) {
    getGrades(multimedia.value.board)
  }

  multimedia.value.grade = item.base || ''

  if (multimedia.value.grade) {
    getSubjects(multimedia.value.grade)
  }

  multimedia.value.subject = item.lesson || ''

  if (multimedia.value.subject) {
    getTopics(multimedia.value.subject)
  }
}

const downloadExistingFile = async () => {
  if (loadingDownloadPastPaperFile.value || !hasExistingFile.value) return

  await downloadFile(multimediaId.value, 'multimedia')
}

const submitMultimedia = async () => {
  const response = await editItem(multimediaId.value, multimedia.value)

  if (response.status === 1 && response.data?.id !== 0) {
    router.push('/user/multimedia')
  }
}

const initData = async () => {
  const [multimediaResponse] = await Promise.all([
    getItemById(multimediaId.value),
    getBoards(),
    getExtraTypeFile('content_type'),
  ])

  if (multimediaResponse.data) {
    await applyMultimediaData(multimediaResponse.data)
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
