<template>
  <div class="w-100 pt-1 pb-2 bg-surface position-relative shadow">
    <v-container class="d-flex justify-space-between align-center">
      <div
        v-for="(step, index) in steps"
        :key="index"
        :class="`cursor-pointer d-flex ${
          index != 0 || index == steps.length - 1 ? `w-100` : ``
        }`"
        @click="changeStep(step)"
      >
        <div
          v-if="index != 0"
          class="my-auto flex-grow-1"
        >
          <v-progress-linear
            height="3"
            bg-color="grey400"
            color="primary"
            :model-value="stepIndex >= index ? 100 : 0"
          />
        </div>
        <div class="d-flex flex-column align-center justify-center">
          <div :class="`${stepIndex === index ? `border-active` : ``}`">
            <v-btn
              icon
              width="34"
              height="34"
              flat
              :color="stepIndex === index ? undefined : stepIndex > index ? 'primary' : 'grey100'"
              :class="{ 'step-active': stepIndex === index }"
            >
              <v-icon
                color="grey600"
                :icon="step.icon"
              />
            </v-btn>
          </div>
          <div
            :class="[
              'text-body-2 text-md-h6 position-absolute bottom-0 mb-1',
              `${
                stepIndex == index
                  ? 'text-grey700 font-weight-bold'
                  : 'text-grey400'
              }`,
            ]"
          >
            {{ step.title }}
          </div>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script setup>
defineProps({
  steps: {
    type: Array,
    required: true,
  },
  stepIndex: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['changeStep'])

function changeStep(step) {
  emit('changeStep', step)
}
</script>

<style scoped>
.shadow {
  box-shadow: 0 20px 30px rgba(var(--v-theme-shadowNeutral), 0.17);
}
.step-active {
  background-color: rgba(var(--v-theme-primary), 0.5);
}
.border-active {
  border: 2px solid rgba(var(--v-theme-primary), 0.5);
  border-radius: 50%;
  padding: 4px;
}
</style>
