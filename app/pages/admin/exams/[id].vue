<template>
  <div class="w-100 d-flex flex-column ga-4 pb-8">
    <div class="d-flex align-center ga-2">
      <v-btn
        variant="text"
        prepend-icon="md:arrow_back"
        to="/admin/exams"
      >
        Exams
      </v-btn>
      <h1 class="text-h6">
        {{ exam ? `#${exam.id} ${exam.title}` : 'Exam' }}
      </h1>
      <v-spacer />
      <v-btn
        v-if="exam && [1, 5, 7].includes(exam.status)"
        variant="text"
        prepend-icon="md:visibility"
        :href="`/exam/${exam.id}`"
        target="_blank"
      >
        View
      </v-btn>
    </div>

    <v-progress-linear
      v-if="!exam"
      indeterminate
      color="primary"
    />

    <v-row
      v-else
      dense
    >
      <v-col
        cols="12"
        md="5"
        class="d-flex flex-column ga-3"
      >
        <div class="text-subtitle-1 font-weight-bold">
          Settings
        </div>
        <v-text-field
          v-model="form.title"
          label="Title"
          variant="outlined"
          density="compact"
          counter="500"
        />
        <div class="text-caption text-grey600">
          {{ [exam.boardTitle, exam.gradeTitle, exam.subjectTitle, exam.examTypeTitle].filter(Boolean).join(' › ') || 'No board or subject' }}
        </div>
        <div class="d-flex ga-2">
          <v-text-field
            v-model.number="form.durationMinutes"
            label="Time (minutes)"
            type="number"
            variant="outlined"
            density="compact"
          />
          <v-select
            v-model="form.scoreType"
            :items="[{ title: 'Normal', value: 1 }, { title: 'Negative marking', value: 2 }]"
            item-title="title"
            item-value="value"
            label="Scoring"
            variant="outlined"
            density="compact"
          />
        </div>
        <div class="d-flex ga-2">
          <v-select
            v-model="form.level"
            :items="[{ title: 'None', value: 0 }, { title: 'Easy', value: 1 }, { title: 'Medium', value: 2 }, { title: 'Hard', value: 3 }]"
            item-title="title"
            item-value="value"
            label="Level"
            variant="outlined"
            density="compact"
          />
          <v-text-field
            v-model.number="form.eduYear"
            label="Year"
            type="number"
            variant="outlined"
            density="compact"
          />
          <v-text-field
            v-model.number="form.eduMonth"
            label="Month"
            type="number"
            variant="outlined"
            density="compact"
          />
        </div>
        <v-btn
          v-if="can(ADMIN_PERMISSIONS.exams.update)"
          color="success"
          variant="flat"
          :loading="saving"
          @click="saveSettings"
        >
          Save settings
        </v-btn>

        <div class="text-subtitle-1 font-weight-bold mt-4">
          Status
        </div>
        <div class="d-flex ga-2 align-center">
          <v-select
            v-model="status"
            :items="statuses"
            item-title="title"
            item-value="value"
            variant="outlined"
            density="compact"
            hide-details
          />
          <v-btn
            v-if="can(ADMIN_PERMISSIONS.exams.status)"
            color="primary"
            variant="flat"
            :loading="saving"
            @click="saveStatus"
          >
            Save
          </v-btn>
        </div>
        <div class="text-caption text-grey600">
          Taken {{ exam.participantCount }} times, viewed {{ exam.viewCount }} times. Owner: {{ exam.ownerName || '-' }}.
        </div>
      </v-col>

      <v-col
        cols="12"
        md="7"
        class="d-flex flex-column ga-2"
      >
        <div class="d-flex align-center">
          <div class="text-subtitle-1 font-weight-bold">
            Questions ({{ questions.length }})
          </div>
          <v-spacer />
          <v-text-field
            v-model="addId"
            label="Add question id"
            type="number"
            density="compact"
            hide-details
            variant="outlined"
            class="add-field"
            @keyup.enter="addQuestion"
          />
          <v-btn
            variant="text"
            icon="md:add"
            @click="addQuestion"
          />
        </div>
        <v-list
          ref="questionList"
          density="compact"
          class="border rounded"
        >
          <v-list-item
            v-for="(question, index) in questions"
            :key="question.id"
            :subtitle="[question.type, question.topicTitle, `answer ${question.trueAnswer ?? '-'}`, statusTitle(question.status)].filter(Boolean).join(' · ')"
          >
            <!-- The excerpt keeps the question's TeX ($...$), typeset by MathJax (see renderQuestions). -->
            <template #title>
              {{ index + 1 }}. <span :key="`${question.id}:${question.excerpt}`">{{ question.excerpt || question.code }}</span>
            </template>
            <template #append>
              <v-btn
                size="small"
                variant="text"
                icon="md:arrow_upward"
                :disabled="index === 0"
                @click="move(index, -1)"
              />
              <v-btn
                size="small"
                variant="text"
                icon="md:arrow_downward"
                :disabled="index === questions.length - 1"
                @click="move(index, 1)"
              />
              <v-btn
                size="small"
                variant="text"
                icon="md:edit"
                :to="`/admin/exam-questions/edit/${question.id}`"
              />
              <v-btn
                size="small"
                variant="text"
                color="error"
                icon="md:close"
                @click="questions.splice(index, 1)"
              />
            </template>
          </v-list-item>
        </v-list>
        <v-btn
          v-if="can(ADMIN_PERMISSIONS.exams.questions)"
          color="success"
          variant="flat"
          :loading="saving"
          @click="saveQuestions"
        >
          Save questions and order
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { AdminExamDetailDTO, AdminExamQuestionItemDTO } from '@/types'
import { EXAM_STATUSES, QUESTION_STATUSES } from '@/types'
import { ADMIN_PERMISSIONS } from '~/constants'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

const route = useRoute()
const { can } = useAdminAccess()
const { saving, getExam, getQuestion, updateExam, setExamStatus, setExamQuestions } = useExamAdmin()
useHead({ title: 'Exam' })

const statuses = Object.entries(EXAM_STATUSES).map(([value, title]) => ({ title, value: Number(value) }))
const statusTitle = (value: number) => QUESTION_STATUSES[value] ?? String(value)
const exam = ref<AdminExamDetailDTO | null>(null)
const status = ref(0)
const questions = ref<AdminExamQuestionItemDTO[]>([])
const addId = ref('')
const renderMath = useMathJaxRender()
const questionList = useTemplateRef<{ $el: HTMLElement }>('questionList')
// Draws the formulas of any question that was loaded or added since the last pass; ones already drawn are left alone.
watch(() => questions.value.map(t => t.id).join(), async () => {
  await nextTick()
  await renderMath(questionList.value?.$el)
})
const form = reactive({ title: '', durationMinutes: null as number | null, scoreType: 1 as number | null, level: 0 as number | null, eduYear: null as number | null, eduMonth: null as number | null })

const load = async () => {
  const data = await getExam(String(route.params.id))
  if (!data) return
  exam.value = data
  status.value = data.status
  questions.value = [...data.questions]
  Object.assign(form, { title: data.title, durationMinutes: data.durationMinutes, scoreType: data.scoreType ?? 1, level: data.level ?? 0, eduYear: data.eduYear, eduMonth: data.eduMonth })
}

const saveSettings = async () => {
  if (!exam.value) return
  await updateExam(exam.value.id, {
    ...form,
    boardId: exam.value.boardId,
    gradeId: exam.value.gradeId,
    subjectId: exam.value.subjectId,
    coreTopicIds: exam.value.coreTopicIds,
    examTypeId: exam.value.examTypeId,
    startDate: exam.value.startDate,
    endDate: exam.value.endDate,
  })
}

const saveStatus = async () => {
  if (exam.value && await setExamStatus(exam.value.id, status.value)) await load()
}

const move = (index: number, step: number) => {
  const [item] = questions.value.splice(index, 1)
  if (item) questions.value.splice(index + step, 0, item)
}

const addQuestion = async () => {
  const id = Number(addId.value)
  if (!id || questions.value.some(t => t.id === id)) return
  const question = await getQuestion(id)
  if (question) {
    questions.value.push(question)
    addId.value = ''
  }
}

const saveQuestions = async () => {
  if (exam.value && await setExamQuestions(exam.value.id, questions.value.map(t => t.id))) await load()
}

onMounted(load)
</script>

<style scoped>
.add-field {
  max-width: 180px;
}
</style>
