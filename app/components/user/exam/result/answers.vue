<template>
  <v-card
    v-if="questions?.length"
    class="w-100 mt-4 mb-8 pa-4"
    flat
    rounded="lg"
    border
  >
    <div class="w-100 d-flex align-center justify-space-between ga-2 flex-wrap">
      <div class="d-flex align-center ga-2">
        <v-icon
          color="primary"
          size="24"
        >
          md:quiz
        </v-icon>
        <span class="text-h5 text-grey700 font-weight-bold">Answer Sheet</span>
      </div>

      <span class="text-grey500 text-h6">
        {{ questions.length }} items
      </span>
    </div>

    <div class="w-100 d-flex align-center flex-wrap ga-4 mt-4">
      <div
        v-for="item in guideItems"
        :key="item.label"
        class="d-flex align-center ga-2"
      >
        <div
          :class="[
            'choice-div flex-shrink-0 font-weight-regular text-grey800 d-flex align-center justify-center rounded-lg border-md border-solid border-opacity-100',
            item.class,
          ]"
        >
          <v-icon
            v-if="item.icon"
            :color="item.iconColor"
            size="18"
          >
            {{ item.icon }}
          </v-icon>
        </div>
        <span class="text-grey600 text-h6">{{ item.label }}</span>
      </div>
    </div>

    <div class="w-100 d-flex flex-wrap ga-2 mt-4">
      <v-card
        v-for="(question, index) in questions"
        :key="question.id"
        class="question-card pa-3 d-flex align-center justify-space-between ga-3 flex-wrap cursor-pointer"
        color="grey100"
        flat
        rounded="lg"
        border
        @click="openQuestionModal(question)"
      >
        <div class="d-flex align-center ga-2">
          <v-avatar
            color="primary"
            rounded="lg"
            size="32"
            class="text-grey800 text-h6 font-weight-bold"
          >
            {{ index + 1 }}
          </v-avatar>

          <v-chip
            :color="getQuestionChipColor(question)"
            variant="outlined"
            size="small"
            class="font-weight-bold text-h6"
          >
            {{ getQuestionStatusText(question) }}
          </v-chip>
        </div>

        <div class="d-flex align-center ga-2">
          <div
            v-for="choice in choices"
            :key="choice"
            :class="[
              'choice-div flex-shrink-0 font-weight-regular text-grey800 d-flex align-center justify-center rounded-lg border-md border-solid border-opacity-100',
              getChoiceClass(question, choice),
            ]"
          >
            <span v-if="getChoiceStatus(question, choice) === 'default'">
              {{ choice }}
            </span>

            <v-icon
              v-else-if="getChoiceStatus(question, choice) === 'success'"
              color="success"
              size="18"
            >
              md:check
            </v-icon>

            <v-icon
              v-else-if="getChoiceStatus(question, choice) === 'error'"
              color="lightError"
              size="18"
            >
              md:close
            </v-icon>

            <v-icon
              v-else
              color="success"
              size="18"
            >
              md:radio_button_unchecked
            </v-icon>
          </div>
        </div>
      </v-card>
    </div>

    <common-modal-base
      v-model:show-dialog="showQuestionModal"
      title="Question detail"
      :max-width="760"
    >
      <div class="w-100 d-flex flex-column">
        <test-details
          v-if="selectedQuestion"
          :content-data="selectedQuestion"
          review-mode
        />

        <div class="w-100 d-flex justify-end mt-4">
          <v-btn
            color="primary"
            rounded="pill"
            flat
            @click="openCrashReportModal"
          >
            <v-icon
              color="grey800"
              size="20"
            >
              md:bug_report
            </v-icon>
            <span class="text-grey800 text-h6 font-weight-bold">
              Crash report
            </span>
          </v-btn>
        </div>
      </div>
    </common-modal-base>

    <common-modal-base
      v-model:show-dialog="showCrashReportModal"
      title="Crash report"
      :max-width="760"
    >
      <common-modal-crash-report
        v-if="selectedQuestion"
        :id="selectedQuestion.id"
        :report-type-list="reportTypeList"
        type-crash-report="examTest"
        @close="showCrashReportModal = false"
      />
    </common-modal-base>
  </v-card>
</template>

<script setup lang="ts">
import type { ExamResultQuestionDTO } from '@/types'

const props = defineProps<{
  questions?: ExamResultQuestionDTO[]
}>()

const choices = ['1', '2', '3', '4']

const guideItems = [
  {
    label: 'Correct selected answer',
    class: 'border-success',
    icon: 'md:check',
    iconColor: 'success',
  },
  {
    label: 'Wrong selected answer',
    class: 'border-lightError',
    icon: 'md:close',
    iconColor: 'lightError',
  },
  {
    label: 'Correct option',
    class: 'border-success',
    icon: 'md:radio_button_unchecked',
    iconColor: 'success',
  },
  {
    label: 'No answer',
    class: 'border-grey200',
    icon: '',
    iconColor: 'grey500',
  },
]

const questions = computed(() => props.questions || [])
const showQuestionModal = ref(false)
const showCrashReportModal = ref(false)
const selectedQuestion = ref<ExamResultQuestionDTO | null>(null)
const {
  getChoiceStatus: getSharedChoiceStatus,
  getChoiceClass: getSharedChoiceClass,
  getQuestionStatusText: getSharedQuestionStatusText,
  getQuestionChipColor: getSharedQuestionChipColor,
} = useExamResultChoiceStatus()
const reportTypeList = [
  {
    value: 1,
    label: 'The selected option in the answer sheet is not correct.',
  },
  { value: 2, label: 'There is more than one correct option.' },
  { value: 3, label: 'None of the options are correct.' },
  { value: 4, label: 'There are typos in questions or options.' },
  { value: 5, label: 'This test is similar to another test in the same test.' },
  { value: 6, label: 'There are problems in the descriptive answer.' },
  { value: 7, label: 'This test is out of budget or topic.' },
  { value: 8, label: 'Other cases' },
]

const openQuestionModal = (question: ExamResultQuestionDTO) => {
  selectedQuestion.value = question
  showQuestionModal.value = true
}

const openCrashReportModal = () => {
  showCrashReportModal.value = true
}

const getChoiceStatus = (question: ExamResultQuestionDTO, choice: string) => {
  return getSharedChoiceStatus(question.true_answer, question.user_answer, choice)
}

const getChoiceClass = (question: ExamResultQuestionDTO, choice: string) => {
  return getSharedChoiceClass(getChoiceStatus(question, choice))
}

const getQuestionStatusText = (question: ExamResultQuestionDTO) => {
  return getSharedQuestionStatusText(question.true_answer, question.user_answer)
}

const getQuestionChipColor = (question: ExamResultQuestionDTO) => {
  return getSharedQuestionChipColor(question.true_answer, question.user_answer)
}
</script>

<style scoped>
.choice-div {
  min-width: 24px;
  min-height: 24px;
  max-width: 24px;
  max-height: 24px;
  font-size: 1.4rem;
}

.question-card {
  width: 100%;
}

@media screen and (min-width: 600px) {
  .question-card {
    width: calc(50% - 4px);
  }
}
</style>
