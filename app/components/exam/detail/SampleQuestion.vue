<template>
  <div ref="rootRef">
    <test-question-stem
      :question="question.question || ''"
      :file="question.image"
      :number="number"
    />

    <!-- The same choices as the question page; the correct answer is fetched only once one is picked, so it isn't
         in this page's HTML. -->
    <v-radio-group
      v-if="options.length"
      :model-value="selected"
      :readonly="!!selected"
      :aria-label="`Answer options for question ${number}`"
      hide-details
      class="w-100 px-1 px-sm-3 mt-2"
      @update:model-value="choose(String($event))"
    >
      <test-question-choice
        v-for="option in options"
        :key="option.key"
        :option="option"
        :status="choiceStatus(option.key)"
      />
    </v-radio-group>
    <v-btn
      v-else-if="!answer"
      variant="tonal"
      color="primary"
      rounded="lg"
      class="text-none mt-3"
      :loading="loading"
      @click="loadAnswer"
    >
      Show the answer
    </v-btn>

    <p
      v-if="result"
      class="text-h5 font-weight-semibold mt-3"
      :class="result === 'correct' ? 'text-success' : 'text-error'"
      role="status"
    >
      {{ result === 'correct' ? 'Correct!' : 'Not quite: the correct answer is marked.' }}
    </p>
    <p
      v-else-if="failed"
      class="text-h5 text-grey600 mt-3"
      role="status"
    >
      The answer isn't available here. Take the test to see it.
    </p>

    <div
      v-if="answer && (answer.answer_full || solutionFile)"
      class="mt-3"
    >
      <p class="text-h5 font-weight-bold text-grey600">
        Solution:
      </p>
      <div
        v-if="answer.answer_full"
        class="solution text-grey800 mt-2"
        v-html="answer.answer_full"
      />
      <test-question-image
        v-if="solutionFile"
        class="mt-2"
        :src="solutionFile"
        alt="Solution image"
      />
    </div>

    <!-- A link crawlers can follow to the question's own page; answering happens right here. -->
    <nuxt-link
      :to="contentPath('test', question.code || question.id)"
      class="d-inline-block text-h6 text-grey500 mt-3"
    >
      Open this question on its own page
    </nuxt-link>
  </div>
</template>

<script setup lang="ts">
import type { ApiResult, ExamSampleQuestionDTO, QuestionDTO } from '@/types'
import type { QuestionChoiceStatus, QuestionOption } from '~/composables/useQuestionOptions'

const props = defineProps<{
  question: ExamSampleQuestionDTO
  number: number
}>()

// An older gamatrain-back sends no `key`; then the position is the number (right unless an earlier option was empty).
const options = computed<QuestionOption[]>(() => props.question.options.map((option, index) => {
  const key = String(option.key ?? index + 1) as QuestionOption['key']
  return { key, text: option.text || '', file: getQuestionFile(option.image), alt: `Answer ${key} image` }
}))

const selected = ref<string | null>(null)
const answer = ref<QuestionDTO | null>(null)
const loading = ref(false)
const failed = ref(false)
const solutionFile = computed(() => getQuestionFile(answer.value?.answer_full_file))

const result = computed(() => {
  if (!selected.value || !answer.value?.true_answer) return null
  return selected.value === answer.value.true_answer ? 'correct' : 'wrong'
})

// Graded the way the question page grades (TestDetails): the right option green, a wrong pick red.
const choiceStatus = (key: string): QuestionChoiceStatus => {
  if (!selected.value) return 'default'
  if (loading.value) return 'loading'
  if (!answer.value?.true_answer) return key === selected.value ? 'selected' : 'default'
  if (key === answer.value.true_answer) return 'success'
  return key === selected.value ? 'error' : 'default'
}

// The question page's own public call; it has the correct option and the worked answer.
const loadAnswer = async () => {
  loading.value = true
  failed.value = false
  try {
    const response = await useApiService.get<ApiResult<QuestionDTO>>(`/api/v1/examTests/${props.question.id}`, { full: true })
    answer.value = response.status === 1 && response.data?.id ? response.data : null
    failed.value = !answer.value
  }
  catch {
    failed.value = true
  }
  finally {
    loading.value = false
  }
}

const choose = async (key: string) => {
  if (selected.value) return
  selected.value = key
  await loadAnswer()
}

const rootRef = ref<HTMLElement>()
const renderMath = useMathJaxRender()
onMounted(() => renderMath(rootRef.value))
// The solution arrives after the first typeset.
watch(answer, async () => {
  await nextTick()
  renderMath(rootRef.value)
})
</script>

<style scoped>
.solution {
  font-size: 1.6rem;
}
.solution :deep(img) {
  max-width: 100%;
  height: auto;
}
</style>
