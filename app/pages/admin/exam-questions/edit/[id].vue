<template>
  <div class="question-edit w-100 d-flex flex-column ga-4 pb-8">
    <div class="question-edit__header d-flex align-center flex-wrap ga-2 py-2">
      <v-btn
        variant="text"
        prepend-icon="md:arrow_back"
        to="/admin/exam-questions"
      >
        Question bank
      </v-btn>
      <h1 class="text-h6 font-weight-bold">
        {{ isNew ? 'New question' : `Question #${id}` }}
      </h1>
      <v-chip
        v-if="current?.code"
        size="small"
        variant="outlined"
        prepend-icon="md:tag"
      >
        {{ current.code }}
      </v-chip>
      <v-chip
        v-if="!isNew && form.status !== null"
        size="small"
        variant="flat"
        :color="STATUS_COLORS[form.status]"
      >
        {{ QUESTION_STATUSES[form.status] }}
      </v-chip>
      <v-spacer />
      <v-btn
        color="primary"
        variant="flat"
        prepend-icon="md:save"
        :loading="saving || imageSaving"
        :disabled="loading"
        @click="submit"
      >
        {{ isNew ? 'Add question' : 'Save changes' }}
      </v-btn>
    </div>

    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
    />

    <v-row v-else>
      <v-col
        cols="12"
        md="8"
        class="d-flex flex-column ga-4"
      >
        <v-card
          variant="outlined"
          rounded="lg"
          class="question-edit__card"
        >
          <v-card-item
            prepend-icon="md:quiz"
            title="Question"
            subtitle="The text students read, and its picture if it has one"
          />
          <v-card-text class="d-flex flex-column ga-3">
            <common-rich-editor
              v-model="form.question"
              with-math
              mode="full"
              min-height="180px"
            />
            <admin-exam-question-image
              label="Add an image"
              :url="images.question"
              :change="imageChanges.question"
              @change="imageChanges.question = $event"
            />
          </v-card-text>
        </v-card>

        <v-card
          v-if="optionCount"
          variant="outlined"
          rounded="lg"
          class="question-edit__card"
        >
          <v-card-item
            prepend-icon="md:checklist"
            title="Answer options"
            subtitle="Click a letter to mark the correct answer"
          />
          <v-card-text class="d-flex flex-column ga-4">
            <div
              v-for="(letter, index) in OPTIONS.slice(0, optionCount)"
              :key="letter"
              class="question-edit__option d-flex ga-3 pa-3 rounded-lg"
              :class="{ 'question-edit__option--correct': form.trueAnswer === index + 1 }"
            >
              <v-btn
                :color="form.trueAnswer === index + 1 ? 'success' : undefined"
                :variant="form.trueAnswer === index + 1 ? 'flat' : 'tonal'"
                :aria-label="`Mark option ${letter.toUpperCase()} as correct`"
                icon
                size="40"
                class="flex-shrink-0"
                @click="form.trueAnswer = index + 1"
              >
                <v-icon
                  v-if="form.trueAnswer === index + 1"
                  icon="md:check"
                />
                <span
                  v-else
                  class="font-weight-bold"
                >{{ letter.toUpperCase() }}</span>
              </v-btn>
              <div class="d-flex flex-column ga-2 flex-grow-1 question-edit__option-body">
                <common-rich-editor
                  v-model="form[`answer${letter.toUpperCase()}` as OptionKey]"
                  with-math
                  min-height="64px"
                />
                <admin-exam-question-image
                  label="Add an image"
                  :url="images[letter]"
                  :change="imageChanges[letter]"
                  @change="imageChanges[letter] = $event"
                />
              </div>
            </div>
            <div
              v-if="!form.trueAnswer"
              class="text-caption text-error d-flex align-center ga-1"
            >
              <v-icon
                icon="md:error"
                size="16"
              />
              No correct answer marked yet.
            </div>
          </v-card-text>
        </v-card>

        <v-card
          variant="outlined"
          rounded="lg"
          class="question-edit__card"
        >
          <v-card-item
            prepend-icon="md:lightbulb"
            title="Worked answer"
            subtitle="Optional: how to reach the answer, shown after the exam"
          />
          <v-card-text class="d-flex flex-column ga-3">
            <common-rich-editor
              v-model="form.answerFull"
              with-math
              mode="full"
              min-height="140px"
            />
            <admin-exam-question-image
              label="Add an image"
              :url="images.answerFull"
              :change="imageChanges.answerFull"
              @change="imageChanges.answerFull = $event"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        md="4"
      >
        <div class="question-edit__side d-flex flex-column ga-4">
          <v-card
            variant="outlined"
            rounded="lg"
            class="question-edit__card"
          >
            <v-card-item
              prepend-icon="md:tune"
              title="Details"
            />
            <v-card-text class="d-flex flex-column ga-4">
              <v-select
                v-model="form.type"
                :items="QUESTION_TYPES"
                item-title="title"
                item-value="value"
                label="Type"
                variant="outlined"
                density="compact"
                hide-details
              />
              <div>
                <div class="text-caption text-grey700 mb-1">
                  Status
                </div>
                <v-chip-group
                  v-model="form.status"
                  mandatory
                  selected-class="font-weight-bold"
                >
                  <v-chip
                    v-for="(title, value) in QUESTION_STATUSES"
                    :key="value"
                    :value="Number(value)"
                    :color="STATUS_COLORS[Number(value)]"
                    :variant="form.status === Number(value) ? 'flat' : 'outlined'"
                    size="small"
                  >
                    {{ title }}
                  </v-chip>
                </v-chip-group>
              </div>
              <div>
                <div class="text-caption text-grey700 mb-1">
                  Level
                </div>
                <v-btn-toggle
                  v-model="form.level"
                  mandatory
                  divided
                  density="compact"
                  variant="outlined"
                  color="primary"
                  class="w-100"
                >
                  <v-btn
                    v-for="level in LEVELS"
                    :key="level.value"
                    :value="level.value"
                    class="flex-grow-1"
                    size="small"
                  >
                    {{ level.title }}
                  </v-btn>
                </v-btn-toggle>
              </div>
            </v-card-text>
          </v-card>

          <v-card
            variant="outlined"
            rounded="lg"
            class="question-edit__card"
          >
            <v-card-item
              prepend-icon="md:account_tree"
              title="Classification"
            />
            <v-card-text class="d-flex flex-column ga-3">
              <div
                v-if="!isNew && currentTypes"
                class="d-flex align-center ga-2 text-body-2"
              >
                <v-icon
                  icon="md:folder"
                  size="18"
                  color="grey600"
                />
                <span>{{ currentTypes }}</span>
              </div>
              <div class="question-edit__types d-flex flex-column ga-2">
                <admin-common-type-filters
                  v-model:board-id="boardId"
                  v-model:grade-id="gradeId"
                  v-model:subject-id="subjectId"
                  v-model:topic-id="topicId"
                  with-topic
                />
              </div>
              <div
                v-if="!isNew"
                class="text-caption text-grey600"
              >
                Leave empty to keep the current classification.
              </div>
            </v-card-text>
          </v-card>

          <v-card
            variant="outlined"
            rounded="lg"
            class="question-edit__card"
          >
            <v-card-item
              prepend-icon="md:menu_book"
              title="Source"
            />
            <v-card-text>
              <v-text-field
                v-model="form.resource"
                placeholder="e.g. Cambridge 2023, paper 1"
                variant="outlined"
                density="compact"
                counter="200"
              />
            </v-card-text>
          </v-card>

          <v-card
            v-if="current"
            variant="tonal"
            rounded="lg"
            color="grey600"
          >
            <v-list
              density="compact"
              bg-color="transparent"
              class="py-1"
            >
              <v-list-item
                prepend-icon="md:person"
                :title="current.ownerName || 'Unknown'"
                subtitle="Owner"
              />
              <v-list-item
                prepend-icon="md:assignment"
                :title="`${current.usedPublish} published exam${current.usedPublish === 1 ? '' : 's'}`"
                subtitle="Used in"
              />
              <v-list-item
                prepend-icon="md:schedule"
                :title="formatDate(current.lastModifyDate ?? current.creationDate)"
                :subtitle="`Last change · created ${formatDate(current.creationDate)}`"
              />
            </v-list>
          </v-card>
        </div>
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
const STATUS_COLORS: Record<number, string> = { 0: 'warning', 1: 'success', 2: 'error' }
const LEVELS = [{ title: 'None', value: 0 }, { title: 'Easy', value: 1 }, { title: 'Medium', value: 2 }, { title: 'Hard', value: 3 }]
const route = useRoute()
const router = useRouter()
const id = computed(() => String(route.params.id))
const isNew = computed(() => id.value === 'new')
useHead({ title: () => (isNew.value ? 'Add question' : 'Edit question') })

const { saving, getQuestion, saveQuestion, setQuestionImage, removeQuestionImage } = useExamAdmin()
const loading = ref(true)
const current = ref<AdminExamQuestionDetailDTO | null>(null)
const boardId = ref<string | null>(null)
const gradeId = ref<string | null>(null)
const subjectId = ref<string | null>(null)
const topicId = ref<string | null>(null)
const images = reactive<Record<string, string | null>>({})
// Image changes queued until Save, per slot: a new file, null to remove, undefined for no change.
const imageChanges = reactive<Record<string, File | null | undefined>>({})
const imageSaving = ref(false)
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
const formatDate = (value: string | null | undefined) => {
  if (!value) return '-'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
const currentTypes = computed(() => [current.value?.subjectTitle, current.value?.topicTitle].filter(Boolean).join(' › '))

const submit = async () => {
  const result = await saveQuestion(isNew.value ? null : Number(id.value), {
    ...form,
    boardId: boardId.value ? Number(boardId.value) : current.value?.boardId ?? null,
    gradeId: gradeId.value ? Number(gradeId.value) : current.value?.gradeId ?? null,
    subjectId: subjectId.value ? Number(subjectId.value) : current.value?.subjectId ?? null,
    coreTopicIds: topicId.value ?? current.value?.coreTopicIds ?? null,
  })
  if (!result) return

  const questionId = isNew.value ? Number(result) : Number(id.value)
  await saveImages(questionId)
  if (isNew.value) await router.replace(`/admin/exam-questions/edit/${questionId}`)
}

// Sends the queued image changes once the question is saved (a new question needs its id first). A failed one stays
// queued, with the error shown, so Save can try it again.
const saveImages = async (questionId: number) => {
  imageSaving.value = true
  try {
    for (const [slot, change] of Object.entries(imageChanges)) {
      if (change === undefined) continue
      if (change === null) {
        if (await removeQuestionImage(questionId, slot)) {
          images[slot] = null
          imageChanges[slot] = undefined
        }
      }
      else {
        const url = await setQuestionImage(questionId, slot, change)
        if (url) {
          images[slot] = url
          imageChanges[slot] = undefined
        }
      }
    }
  }
  finally {
    imageSaving.value = false
  }
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
.question-edit__header {
  position: sticky;
  top: 0;
  z-index: 5;
  background: rgb(var(--v-theme-background));
  border-bottom: 1px solid rgb(var(--v-theme-grey200));
}

.question-edit__card {
  border-color: rgb(var(--v-theme-grey200)) !important;
  background: rgb(var(--v-theme-surface));
}

.question-edit__side {
  position: sticky;
  top: 72px;
}

.question-edit__option {
  border: 1px solid rgb(var(--v-theme-grey200));
  transition: border-color 0.15s, background-color 0.15s;
}

.question-edit__option--correct {
  border-color: rgb(var(--v-theme-success));
  background: rgba(var(--v-theme-success), 0.06);
}

.question-edit__option-body {
  min-width: 0;
}

/* The shared type filters sit in a row on list pages; here each takes the panel's full width. */
.question-edit__types :deep(.v-input) {
  width: 100%;
  max-width: none !important;
  flex: none;
}
</style>
