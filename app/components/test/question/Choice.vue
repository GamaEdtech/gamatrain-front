<template>
  <!-- A v-radio whose input slot draws the numbered status box; the native radio input stays inside it,
       so the parent v-radio-group keeps radio semantics, arrow-key navigation and readonly handling. -->
  <v-radio
    :value="option.key"
    :ripple="false"
    :class="['question-choice py-2', option.text ? 'align-start' : 'align-center']"
  >
    <template #input="{ inputNode }">
      <div
        :class="[
          'choice-div flex-shrink-0 font-weight-regular text-grey800 d-flex align-center justify-center rounded-lg border-md border-solid border-opacity-100',
          boxClass,
        ]"
      >
        <v-progress-circular
          v-if="status === 'loading'"
          color="primary"
          size="20"
          indeterminate
          :width="2"
        />
        <span v-else-if="status === 'default' || status === 'selected'">{{ option.key }}</span>

        <v-icon
          v-else-if="status === 'success'"
          color="success"
        >
          md:check
        </v-icon>

        <v-icon
          v-else-if="status === 'error'"
          color="lightError"
        >
          md:close
        </v-icon>
      </div>
      <component :is="inputNode" />
    </template>

    <template #label>
      <div class="w-100 d-flex flex-column align-start ga-2 ms-3">
        <div
          v-if="option.text"
          class="test-text w-100 font-weight-regular choice-text text-grey800 overflow-x-auto overflow-y-hidden"
          v-html="option.text"
        />
        <test-question-image
          v-if="option.file"
          :class="{ 'mt-1': option.text }"
          variant="option"
          :src="option.file"
          :alt="option.alt"
        />
      </div>
    </template>
  </v-radio>
</template>

<script setup lang="ts">
import type { QuestionOption, QuestionChoiceStatus } from '~/composables/useQuestionOptions'

const props = withDefaults(defineProps<{
  option: QuestionOption
  status?: QuestionChoiceStatus
}>(), {
  status: 'default',
})

const BOX_CLASSES: Record<QuestionChoiceStatus, string> = {
  default: 'border-grey200',
  selected: 'border-primary bg-primary',
  loading: 'border-primary',
  success: 'border-success',
  error: 'border-lightError',
  correct: 'border-success choice-correct',
}

const boxClass = computed(() => BOX_CLASSES[props.status])
</script>

<style scoped lang="scss">
@use 'sass:map';
@use 'vuetify/settings' as vuetify;

/* Size the radio's input area to the 24px box and drop Vuetify's round hover/focus halo:
   the box shows focus itself. */
.question-choice {
  --v-selection-control-size: 24px;
  width: 100%;
}
.question-choice :deep(.v-selection-control__input::before) {
  display: none;
}
.question-choice :deep(.v-label) {
  width: 100%;
  height: auto;
  opacity: 1;
  align-items: flex-start;
  cursor: pointer;
}
.question-choice.v-selection-control--focus-visible .choice-div {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}
.choice-div {
  min-width : 24px;
  min-height: 24px;
  max-width : 24px;
  max-height: 24px;
  font-size: 1.4rem;
}
/* The correct-option dot, painted from the box's own center: a separate dot element rounded half a pixel off it. */
.choice-correct {
  background: radial-gradient(circle, rgb(var(--v-theme-success)) 7px, transparent 7.5px);
}
.choice-text {
  min-width: 0;
  line-height: 22px;
}
/* Images typed into the option text itself. */
.choice-text :deep(img) {
  max-width: 100%;
  height: auto;
}
.test-text {
  font-size: 1.6rem;
}
@media #{map.get(vuetify.$display-breakpoints, 'sm-and-up')} {
  .test-text {
    font-size: 1.8rem;
  }
}
</style>
