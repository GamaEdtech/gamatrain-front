<template>
  <div class="w-100 d-flex flex-column ga-4 pb-8">
    <div class="d-flex align-center ga-2">
      <v-btn
        variant="text"
        prepend-icon="md:arrow_back"
        to="/admin/exam-questions"
      >
        Question bank
      </v-btn>
      <h1 class="text-h6">
        {{ isNew ? 'Add question' : `Edit question #${id}` }}
      </h1>
    </div>

    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
    />

    <v-row
      v-else
      dense
    >
      <v-col
        cols="12"
        md="8"
        class="d-flex flex-column ga-3"
      >
        <div class="text-caption text-grey700">
          Question
        </div>
        <common-rich-editor
          v-model="form.question"
          mode="full"
        />
        <img
          v-if="images.question"
          :src="images.question"
          alt="Question image"
          class="old-image"
        >
        <template v-if="optionCount">
          <div
            v-for="letter in OPTIONS.slice(0, optionCount)"
            :key="letter"
            class="d-flex flex-column ga-1"
          >
            <div class="text-caption text-grey700">
              Option {{ letter.toUpperCase() }}
            </div>
            <common-rich-editor v-model="form[`answer${letter.toUpperCase()}` as OptionKey]" />
            <img
              v-if="images[letter]"
              :src="images[letter]"
              :alt="`Option ${letter} image`"
              class="old-image"
            >
          </div>
        </template>
        <div class="text-caption text-grey700">
          Worked answer (optional)
        </div>
        <common-rich-editor
          v-model="form.answerFull"
          mode="full"
        />
        <img
          v-if="images.answerFull"
          :src="images.answerFull"
          alt="Worked answer image"
          class="old-image"
        >
      </v-col>
      <v-col
        cols="12"
        md="4"
        class="d-flex flex-column ga-3"
      >
        <v-select
          v-model="form.type"
          :items="QUESTION_TYPES"
          item-title="title"
          item-value="value"
          label="Type"
          variant="outlined"
          density="compact"
        />
        <v-select
          v-if="optionCount"
          v-model="form.trueAnswer"
          :items="OPTIONS.slice(0, optionCount).map((letter, i) => ({ title: letter.toUpperCase(), value: i + 1 }))"
          item-title="title"
          item-value="value"
          label="Correct option"
          variant="outlined"
          density="compact"
        />
        <v-select
          v-model="form.status"
          :items="Object.entries(QUESTION_STATUSES).map(([value, title]) => ({ title, value: Number(value) }))"
          item-title="title"
          item-value="value"
          label="Status"
          variant="outlined"
          density="compact"
        />
        <v-select
          v-model="form.level"
          :items="[{ title: 'None', value: 0 }, { title: 'Easy', value: 1 }, { title: 'Medium', value: 2 }, { title: 'Hard', value: 3 }]"
          item-title="title"
          item-value="value"
          label="Level"
          variant="outlined"
          density="compact"
        />
        <div class="d-flex flex-wrap ga-2">
          <admin-common-type-filters
            v-model:board-id="boardId"
            v-model:grade-id="gradeId"
            v-model:subject-id="subjectId"
            v-model:topic-id="topicId"
            with-topic
          />
        </div>
        <div
          v-if="!isNew && currentTypes"
          class="text-caption text-grey600"
        >
          Now: {{ currentTypes }}. Choose above to change.
        </div>
        <v-text-field
          v-model="form.resource"
          label="Source"
          variant="outlined"
          density="compact"
          counter="200"
        />
        <v-btn
          color="success"
          variant="flat"
          :loading="saving"
          @click="submit"
        >
          {{ isNew ? 'Add question' : 'Save' }}
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { AdminExamQuestionDetailDTO } from '@/types'
import { QUESTION_STATUSES, QUESTION_TYPES } from '@/types'

type OptionKey = 'answerA' | 'answerB' | 'answerC' | 'answerD'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

const OPTIONS = ['a', 'b', 'c', 'd'] as const
const route = useRoute()
const router = useRouter()
const id = computed(() => String(route.params.id))
const isNew = computed(() => id.value === 'new')
useHead({ title: () => (isNew.value ? 'Add question' : 'Edit question') })

const { saving, getQuestion, saveQuestion } = useExamAdmin()
const loading = ref(true)
const current = ref<AdminExamQuestionDetailDTO | null>(null)
const boardId = ref<string | null>(null)
const gradeId = ref<string | null>(null)
const subjectId = ref<string | null>(null)
const topicId = ref<string | null>(null)
const images = reactive<Record<string, string | null>>({})
const form = reactive({
  type: 1,
  question: '',
  answerA: '',
  answerB: '',
  answerC: '',
  answerD: '',
  answerFull: '',
  trueAnswer: null as number | null,
  status: 0 as number | null,
  level: 0 as number | null,
  resource: '',
})

// Four-choice and two-choice questions have options; true/false uses two fixed ones gama-api stores the same way.
const optionCount = computed(() => ({ 1: 4, 4: 2, 8: 2 } as Record<number, number>)[form.type] ?? 0)
const currentTypes = computed(() => [current.value?.subjectTitle, current.value?.topicTitle].filter(Boolean).join(' › '))

const submit = async () => {
  const result = await saveQuestion(isNew.value ? null : Number(id.value), {
    ...form,
    boardId: boardId.value ? Number(boardId.value) : current.value?.boardId ?? null,
    gradeId: gradeId.value ? Number(gradeId.value) : current.value?.gradeId ?? null,
    subjectId: subjectId.value ? Number(subjectId.value) : current.value?.subjectId ?? null,
    coreTopicIds: topicId.value ?? current.value?.coreTopicIds ?? null,
  })
  if (result && isNew.value) await router.replace(`/admin/exam-questions/edit/${result}`)
}

onMounted(async () => {
  if (!isNew.value) {
    const question = await getQuestion(id.value)
    if (!question) {
      await router.replace('/admin/exam-questions')
      return
    }

    current.value = question
    Object.assign(form, {
      type: question.typeCode ?? 1,
      question: question.question ?? '',
      answerA: question.answerA ?? '',
      answerB: question.answerB ?? '',
      answerC: question.answerC ?? '',
      answerD: question.answerD ?? '',
      answerFull: question.answerFull ?? '',
      trueAnswer: question.trueAnswer,
      status: question.status,
      level: question.level ?? 0,
      resource: question.resource ?? '',
    })
    // gama-api's separate image files, shown under the text they belong to.
    Object.assign(images, { question: question.questionImage, a: question.answerAImage, b: question.answerBImage, c: question.answerCImage, d: question.answerDImage, answerFull: question.answerFullImage })
  }

  loading.value = false
})
</script>

<style scoped>
.old-image {
  max-width: 320px;
  max-height: 180px;
  object-fit: contain;
}
</style>
