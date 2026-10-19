<template>
  <div class="w-100 d-flex flex-column align-start">
    <div class="w-100 d-flex align-start ga-2 test-text text-grey700 font-weight-semibold">
      <span
        v-if="number"
        class="flex-shrink-0"
      >
        {{ number }})
      </span>
      <div
        class="question-text overflow-x-auto overflow-y-hidden"
        v-html="question"
      />
    </div>
    <test-question-image
      v-if="imageFile"
      class="mt-1 mx-auto ms-sm-0"
      :src="imageFile"
      alt="Question Image"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  question: string
  file?: string | null
  /** Shown before the question, as in an exam's numbered list. */
  number?: number
}>()

const imageFile = computed(() => getQuestionFile(props.file))
</script>

<style scoped lang="scss">
@use 'sass:map';
@use 'vuetify/settings' as vuetify;

.test-text {
  font-size: 1.6rem;
}
@media #{map.get(vuetify.$display-breakpoints, 'sm-and-up')} {
  .test-text {
    font-size: 1.8rem;
  }
}
.question-text {
  min-width: 0;
}
/* Images typed into the question text itself. */
.question-text :deep(img) {
  max-width: 100%;
  height: auto;
}
</style>
