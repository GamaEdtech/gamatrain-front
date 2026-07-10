<template>
  <v-container class="w-100 d-flex flex-column">
    <v-form
      v-model="isFormValid"
      class="w-100 d-flex flex-column"
    >
      <h1 class="text-h4 text-grey700 font-weight-regular">
        Forum Submission Form
      </h1>

      <div class="d-flex flex-wrap justify-space-between">
        <div class="each-item d-flex flex-column align-start justify-start ga-1 mt-4">
          <common-gombo-box
            v-model="forum.board"
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
            v-model="forum.grade"
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
            :disabled="!forum.board || loadingGrade"
            :rules="[required]"
            @update:model-value="gradeChange"
          />
        </div>

        <div class="each-item d-flex flex-column align-start justify-start ga-1 mt-4">
          <common-gombo-box
            v-model="forum.subject"
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
            :disabled="!forum.board || !forum.grade || loadingSubject"
            :rules="[required]"
            @update:model-value="subjectChange"
          />
        </div>

        <div class="each-item d-flex flex-column align-start justify-start ga-1 mt-4">
          <common-gombo-box
            v-model="forum.topics"
            label="Topics"
            :items="topics?.map((item) => {
              return {
                id: item.id,
                title: item.title,
              }
            })"
            :data-loading="loadingBoards || loadingGrade || loadingSubject || loadingTopic"
            rounded="pill"
            height="48"
            base-color="grey200"
            color="primary"
            density="compact"
            :defalut-lable="false"
            :disabled="!forum.board || !forum.grade || !forum.subject || loadingTopic"
          />
        </div>

        <div class="w-100 d-flex flex-column align-start justify-start ga-1 mt-4 rounded-lg pa-2">
          <span class="text-h6 text-grey700 font-weight-medium">Title</span>
          <v-text-field
            v-model="forum.title"
            density="compact"
            variant="outlined"
            label=""
            outlined
            rounded="pill"
            color="primary"
            height="48"
            base-color="grey200"
            class="w-100"
            :rules="[required, minLength(20)]"
          />
        </div>

        <div class="w-100 d-flex flex-column align-start justify-start ga-1 rounded-lg pa-2">
          <span class="text-h6 text-grey700 font-weight-medium">Question</span>
          <v-textarea
            v-model="forum.question"
            density="compact"
            variant="outlined"
            label=""
            outlined
            rounded="lg"
            color="primary"
            base-color="grey200"
            class="w-100"
            placeholder="Enter your question"
            persistent-clear
            no-resize
            rows="7"
            :rules="[required, minLength(70)]"
          />
        </div>

        <div class="each-item d-flex flex-column align-start justify-start ga-1">
          <span class="text-h6 text-grey700 font-weight-medium">Attach file</span>
          <v-file-input
            v-model="forumFile"
            density="compact"
            variant="outlined"
            accept=".png,.jpg,jpeg,.gif,.zip,.rar,.mp4,.flv"
            label=""
            base-color="grey200"
            color="primary"
            prepend-icon=""
            append-inner-icon="md:files"
            autocomplete="off"
            max-height="48"
            rounded="pill"
            class="w-100"
            :disabled="loadingUploadFile"
            @update:model-value="uploadForumFile"
          >
            <template #prepend-inner>
              <v-icon
                size="20"
                color="info"
              >
                md:text_snippet
              </v-icon>
              <v-progress-circular
                v-if="loadingUploadFile"
                indeterminate
                size="20"
                color="primary"
                class="mx-2"
              />
            </template>
          </v-file-input>
        </div>
      </div>
    </v-form>

    <div class="d-flex align-center justify-center mt-8 ga-2">
      <v-btn
        variant="outlined"
        color="lightError"
        to="/user/question"
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
        :disabled="!isFormValid || loadingUploadFile"
        @click="submit"
      >
        Submit
      </v-btn>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import type { ForumCreateDTO } from '@/types'

definePageMeta({
  layout: 'dashboard-layout',
  middleware: ['auth'],
})

useSeoMeta({
  title: 'Forum submission form',
})

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
} = useBoard()
const { required, minLength } = useValidationRules()
const { uploadFile, loadingUploadFile } = useUpload()
const { addItem, loadingAddItem } = useForum()
const { $toast } = useNuxtApp()
const router = useRouter()

const isFormValid = ref(false)
const forumFile = ref<File | File[] | null>(null)
const forum = ref<ForumCreateDTO>({
  board: '',
  grade: '',
  subject: '',
  topics: '',
  title: '',
  question: '',
  file: '',
})

const getSelectedFile = (value: unknown) => {
  if (value instanceof File) return value
  if (Array.isArray(value)) return value[0] ?? null

  return null
}

const boardChange = async (boardId: string | number) => {
  forum.value.board = boardId
  forum.value.grade = ''
  forum.value.subject = ''
  forum.value.topics = ''
  resetGrades()
  resetSubjects()
  resetTopics()
  if (boardId) {
    await getGrades(boardId)
  }
}

const gradeChange = async (gradeId: string | number) => {
  forum.value.grade = gradeId
  forum.value.subject = ''
  forum.value.topics = ''
  resetSubjects()
  resetTopics()
  if (gradeId) {
    await getSubjects(gradeId)
  }
}

const subjectChange = async (subjectId: string | number) => {
  forum.value.subject = subjectId
  forum.value.topics = ''
  resetTopics()
  if (subjectId) {
    await getTopics(subjectId)
  }
}

const uploadForumFile = async (value: unknown) => {
  const file = getSelectedFile(value)

  if (!file) {
    forum.value.file = ''
    return
  }

  if (file.size >= 20000000) {
    $toast.error('File size should be less than 20 MB!')
    forumFile.value = null
    forum.value.file = ''
    return
  }

  const response = await uploadFile(file)

  if (response.status == 1 && response.data && response.data.length > 0) {
    forum.value.file = response.data[0]?.file.name ?? ''
  }
  else {
    forumFile.value = null
    forum.value.file = ''
  }
}

const submit = async () => {
  const response = await addItem(forum.value)

  if (response.status === 1 && response.data?.id !== 0) {
    router.push('/user/question')
  }
}

onMounted(async () => {
  await getBoards()
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
