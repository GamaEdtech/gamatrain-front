<template>
  <div
    ref="questionRootRef"
    class="question-item pa-4"
  >
    <div class="d-flex align-baseline mb-2 gtext-t3">
      <div class="font-weight-bold mr-2 text-grey-darken-1">
        {{ index + 1 }})
      </div>
      <div
        class="gama-text-h1 text-grey-darken-1"
        style="line-height: 1.7 !important"
        v-html="item.question"
      />
    </div>

    <img
      v-if="item.q_file && item.q_file !== '0'"
      class="answer-img mb-4"
      :src="item.q_file"
      alt="Question Image"
      loading="lazy"
    >

    <v-radio-group
      :model-value="modelValue"
      class="answer-group"
      color="orange"
      @update:model-value="onAnswerChange"
    >
      <v-radio
        :value="'1'"
        density="compact"
        style="font-size: 1.5rem; padding-block: 0.5rem"
      >
        <template #label>
          <div
            class="mr-6 d-flex align-center gtext-t4 text-grey-darken-1"
            v-html="`1)&nbsp;&nbsp;${item.answer_a}`"
          />
          <img
            v-if="item.a_file && item.a_file !== '0'"
            class="answer-img mt-2"
            :src="item.a_file"
            alt="Answer A Image"
            loading="lazy"
          >
        </template>
      </v-radio>
      <v-radio
        :value="'2'"
        density="compact"
        style="font-size: 1.5rem; padding-block: 0.5rem"
      >
        <template #label>
          <div
            class="mr-6 d-flex align-center gtext-t4 text-grey-darken-1"
            v-html="`2)&nbsp;&nbsp;${item.answer_b}`"
          />
          <img
            v-if="item.b_file && item.b_file !== '0'"
            class="answer-img mt-2"
            :src="item.b_file"
            alt="Answer B Image"
            loading="lazy"
          >
        </template>
      </v-radio>
      <v-radio
        :value="'3'"
        density="compact"
        style="font-size: 1.5rem; padding-block: 0.5rem"
      >
        <template #label>
          <div
            class="mr-6 d-flex align-center gtext-t4 text-grey-darken-1"
            v-html="`3)&nbsp;&nbsp;${item.answer_c}`"
          />
          <img
            v-if="item.c_file && item.c_file !== '0'"
            class="answer-img mt-2"
            :src="item.c_file"
            alt="Answer C Image"
            loading="lazy"
          >
        </template>
      </v-radio>
      <v-radio
        :value="'4'"
        density="compact"
        style="font-size: 1.5rem"
      >
        <template #label>
          <div
            class="mr-6 d-flex align-center gtext-t4 text-grey-darken-1"
            v-html="`4)&nbsp;&nbsp;${item.answer_d}`"
          />
          <img
            v-if="item.d_file && item.d_file !== '0'"
            class="answer-img mt-2"
            :src="item.d_file"
            alt="Answer D Image"
            loading="lazy"
          >
        </template>
      </v-radio>
    </v-radio-group>

    <div class="mt-2">
      <v-btn
        icon="mdi-eraser"
        size="x-small"
        variant="text"
        class="mr-2"
        aria-label="Erase answer"
        @click="$emit('erase', item.id)"
      />
      <v-btn
        icon="mdi-pin"
        size="x-small"
        :color="isPinned ? 'teal' : 'default'"
        variant="text"
        aria-label="Pin question"
        @click="$emit('pin', item.id)"
      />
    </div>

    <v-divider class="mt-4" />
  </div>
</template>

<script setup>
const _props = defineProps({
  item: { type: Object, required: true },
  index: { type: Number, required: true },
  modelValue: { type: [String, Number], default: null },
  isPinned: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'pin', 'erase'])

const questionRootRef = ref(null)
const { $renderMathInElement, $ensureMathJaxReady } = useNuxtApp()

const onAnswerChange = (value) => {
  emit('update:modelValue', value)
}

onMounted(async () => {
  if (import.meta.client && questionRootRef.value) {
    try {
      await $ensureMathJaxReady()
      $renderMathInElement(questionRootRef.value)
    }
    catch (error) {
      console.error('Error during MathJax typesetting in QuestionItem:', error)
    }
  }
})
</script>

<style scoped>
.question-item {
  border-bottom: 1px solid #eee;
}
.answer-img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  border: 1px solid #ddd;
}
.answer-group .v-radio {
  width: 100%;
}
.answer-group .answer-img {
  display: block;
  width: 100%;
  max-width: 300px;
  margin-left: 24px;
}
</style>
