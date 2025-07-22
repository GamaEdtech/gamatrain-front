<template>
  <v-container class="flex-column margin-top-handle pt-0">
    <school-add-stepper
      :steps="steps"
      :step-index="currentStep"
      @change-step="changeStep"
    />
  </v-container>
</template>

<script setup>
// start section step
const STEP_INDEX = {
  Location: 0,
  Category: 1,
  Contact: 2,
  Facilities: 3,
  Score: 4,
};
const steps = [
  {
    title: "Location",
    value: 0,
    icon: "mdi-map-marker",
  },
  {
    title: "Category",
    value: 1,
    icon: "mdi-shape",
  },
  {
    title: "Contact",
    value: 2,
    icon: "mdi-phone",
  },
  {
    title: "Facilities",
    value: 3,
    icon: "mdi-playlist-check",
  },
  {
    title: "Score",
    value: 4,
    icon: "mdi-star",
  },
];
const currentStep = ref(STEP_INDEX.Location);

const changeStep = (step) => {
  currentStep.value = step.value;
};
// end section step
</script>

<style scoped>
.margin-top-handle {
  margin-top: 64px;
  min-height: calc(100vh - 64px);
}

@media (min-width: 960px) {
  .margin-top-handle {
    margin-top: 6.4rem;
    min-height: calc(100vh - 6.4rem);
  }
}
</style>
