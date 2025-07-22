<template>
  <div class="w-100 pt-1 pb-2 bg-white position-absolute left-0 shadow">
    <v-container class="d-flex justify-space-between align-center">
      <div
        v-for="(step, index) in steps"
        :key="index"
        :class="`cursor-pointer d-flex ${
          index != 0 || index == steps.length - 1 ? `w-100` : ``
        }`"
        @click="changeStep(step)"
      >
        <div v-if="index != 0" class="my-auto flex-grow-1">
          <v-progress-linear
            height="3"
            bg-color="#848585"
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
              :color="`${
                stepIndex === index
                  ? `#FFDB80`
                  : stepIndex > index
                  ? `#FFB600`
                  : `#F2F4F7`
              }`"
            >
              <v-icon color="#475467" :icon="step.icon" />
            </v-btn>
          </div>
          <div
            :class="[
              'text-body-2 text-md-h6 position-absolute bottom-0 mb-1',
              `${
                stepIndex == index
                  ? 'primary-gray-700 font-weight-bold'
                  : 'primary-gray-400'
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
const props = defineProps({
  steps: {
    type: Array,
    required: true,
  },
  stepIndex: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["changeStep"]);

function changeStep(step) {
  emit("changeStep", step);
}
</script>

<style scoped>
.shadow {
  box-shadow: 0px 20px 30px 0px #1018282b;
}
.border-active {
  border: 2px solid #ffdb80;
  border-radius: 50%;
  padding: 4px;
}
</style>
