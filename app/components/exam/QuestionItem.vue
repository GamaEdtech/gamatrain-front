<template>
  <div
    ref="questionRootRef"
    class="w-100 d-flex flex-column align-start pt-6"
  >
    <test-question-stem
      :number="index + 1"
      :question="item.question"
      :file="item.q_file"
    />

    <v-radio-group
      :model-value="selectedAnswer"
      :aria-label="`Question ${index + 1} options`"
      hide-details
      class="w-100 px-1 px-sm-3 mt-2"
      @update:model-value="emit('update:modelValue', String($event))"
    >
      <test-question-choice
        v-for="option in options"
        :key="option.key"
        :option="option"
        :status="option.key === selectedAnswer ? 'selected' : 'default'"
      />
    </v-radio-group>

    <div class="d-flex align-center ga-1 mt-4">
      <v-btn
        icon
        size="small"
        variant="text"
        color="grey600"
        aria-label="Erase answer"
        @click="emit('erase', item.id)"
      >
        <v-icon
          icon="md:ink_eraser"
          size="20"
        />
      </v-btn>
      <v-btn
        icon
        size="small"
        variant="text"
        :color="isPinned ? 'primary' : 'grey600'"
        :aria-label="isPinned ? 'Unpin question' : 'Pin question'"
        :aria-pressed="isPinned"
        @click="emit('pin', item.id)"
      >
        <v-icon
          :icon="isPinned ? 'md:push_pin' : 'md:push_pin_outlined'"
          size="20"
        />
      </v-btn>
    </div>

    <v-divider class="w-100 mt-4" />
  </div>
</template>

<script setup lang="ts">
import type { QuestionOptionSource } from '~/composables/useQuestionOptions'

interface ExamQuestion extends QuestionOptionSource {
  id: string | number
  question: string
  q_file?: string | null
}

const props = withDefaults(defineProps<{
  item: ExamQuestion
  index: number
  modelValue?: string | number | null
  isPinned?: boolean
}>(), {
  modelValue: null,
  isPinned: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'pin': [id: ExamQuestion['id']]
  'erase': [id: ExamQuestion['id']]
}>()

const questionRootRef = ref<HTMLElement>()
const renderMath = useMathJaxRender()
const options = useQuestionOptions(() => props.item)

// Saved answers may come back from localStorage as numbers.
const selectedAnswer = computed(() => (props.modelValue == null ? null : String(props.modelValue)))

onMounted(() => renderMath(questionRootRef.value))
</script>
