<template>
  <div
    ref="questionRootRef"
    class="question-item pa-4"
  >
    <div class="d-flex align-baseline mb-2 gtext-t3">
      <div class="flex-shrink-0 font-weight-bold mr-2 text-grey-darken-1">
        {{ index + 1 }})
      </div>
      <div
        class="question-text gama-text-h1 text-grey-darken-1"
        v-html="item.question"
      />
    </div>

    <button
      v-if="hasFile(item.q_file)"
      type="button"
      class="image-zoom-trigger mb-4"
      aria-label="Enlarge question image"
      @click="openZoom(item.q_file, 'Question Image')"
    >
      <img
        class="question-img border rounded-lg"
        :src="item.q_file"
        alt="Question Image"
        loading="lazy"
      >
    </button>

    <v-radio-group
      :model-value="modelValue"
      class="answer-group"
      color="orange"
      @update:model-value="onAnswerChange"
    >
      <v-radio
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        density="compact"
        class="answer-option py-2"
      >
        <template #label>
          <div class="answer-content mr-6">
            <div class="d-flex align-baseline gtext-t4 text-grey-darken-1">
              <div class="flex-shrink-0 mr-2">
                {{ option.value }})
              </div>
              <div
                class="answer-text"
                v-html="option.text"
              />
            </div>
            <!-- .prevent keeps the click from reaching the label, so enlarging never changes the answer -->
            <button
              v-if="hasFile(option.file)"
              type="button"
              class="image-zoom-trigger mt-2"
              :aria-label="`Enlarge ${option.alt}`"
              @click.prevent.stop="openZoom(option.file, option.alt)"
            >
              <img
                class="answer-img border rounded-lg"
                :src="option.file"
                :alt="option.alt"
                loading="lazy"
              >
            </button>
          </div>
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

    <v-dialog
      v-model="isZoomOpen"
      max-width="1100"
    >
      <v-card>
        <v-card-actions class="justify-end pb-0">
          <v-btn
            icon="mdi-close"
            size="small"
            variant="text"
            aria-label="Close enlarged image"
            @click="isZoomOpen = false"
          />
        </v-card-actions>
        <v-card-text class="zoom-scroll pt-0">
          <img
            class="zoom-img"
            :src="zoomedImage.src"
            :alt="zoomedImage.alt"
          >
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
const props = defineProps({
  item: { type: Object, required: true },
  index: { type: Number, required: true },
  modelValue: { type: [String, Number], default: null },
  isPinned: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'pin', 'erase'])

const questionRootRef = ref(null)
const { $renderMathInElement, $ensureMathJaxReady } = useNuxtApp()

const options = computed(() => [
  { value: '1', text: props.item.answer_a, file: props.item.a_file, alt: 'Answer A Image' },
  { value: '2', text: props.item.answer_b, file: props.item.b_file, alt: 'Answer B Image' },
  { value: '3', text: props.item.answer_c, file: props.item.c_file, alt: 'Answer C Image' },
  { value: '4', text: props.item.answer_d, file: props.item.d_file, alt: 'Answer D Image' },
])

// The API sends '0' for "no file".
const hasFile = file => Boolean(file) && file !== '0'

const isZoomOpen = ref(false)
const zoomedImage = ref({ src: '', alt: '' })

const openZoom = (src, alt) => {
  zoomedImage.value = { src, alt }
  isZoomOpen.value = true
}

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
.question-text {
  min-width: 0;
  line-height: 1.7 !important;
}
/* Question and option images follow one rule: shown at their own size, never enlarged, and scaled
   down (keeping the aspect ratio) to fit a box. Options get a smaller box than the question. */
.question-img,
.answer-img {
  display: block;
  width: auto;
  height: auto;
  max-width: 100%;
}
.question-img {
  max-height: 420px;
}
.answer-img {
  max-height: 240px;
}
.image-zoom-trigger {
  display: block;
  max-width: min(100%, 720px);
  cursor: zoom-in;
}
/* Enlarged view: fills the dialog on wide screens; on phones it is twice the screen width and pans. */
.zoom-scroll {
  overflow: auto;
}
.zoom-img {
  display: block;
  width: 100%;
  height: auto;
  max-height: 80vh;
  object-fit: contain;
}
@media (max-width: 599.98px) {
  .zoom-img {
    width: 200%;
    max-height: none;
  }
}
.answer-group .v-radio {
  width: 100%;
}
.answer-option {
  font-size: 1.5rem;
}
.answer-content,
.answer-text {
  min-width: 0;
}
/* Images typed into the question or option text itself. */
.question-item :deep(.answer-text img),
.question-item :deep(.question-text img) {
  max-width: 100%;
  height: auto;
}
</style>
