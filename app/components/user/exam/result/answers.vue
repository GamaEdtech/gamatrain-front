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
        class="question-card pa-3 d-flex align-center justify-space-between ga-3 flex-wrap"
        color="grey100"
        flat
        rounded="lg"
        border
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

const getChoiceStatus = (question: ExamResultQuestionDTO, choice: string) => {
  if (question.true_answer === choice && question.user_answer === choice) return 'success'
  if (question.user_answer === choice && question.true_answer !== choice) return 'error'
  if (question.true_answer === choice) return 'correct'

  return 'default'
}

const getChoiceClass = (question: ExamResultQuestionDTO, choice: string) => {
  const status = getChoiceStatus(question, choice)

  if (status === 'success' || status === 'correct') return 'border-success'
  if (status === 'error') return 'border-lightError'

  return 'border-grey200'
}

const getQuestionStatusText = (question: ExamResultQuestionDTO) => {
  if (!question.user_answer || question.user_answer === '0') return 'No answer'
  return question.user_answer === question.true_answer ? 'Correct' : 'Wrong'
}

const getQuestionChipColor = (question: ExamResultQuestionDTO) => {
  if (!question.user_answer || question.user_answer === '0') return 'grey300'
  return question.user_answer === question.true_answer ? 'success' : 'lightError'
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
