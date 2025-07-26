<template>
  <div
    class="w-100 d-flex align-center justify-start flex-column margin-top-handle"
  >
    <school-add-stepper
      :steps="steps"
      :step-index="currentStep"
      @change-step="changeStep"
    />
    <v-container class="w-100 mt-2 d-flex justify-center handle-height">
      <school-add-step-location
        v-if="currentStep == STEP_INDEX.Location"
        @next-step="changeLocationStep"
      />
      <school-add-step-category
        v-if="currentStep == STEP_INDEX.Category"
        @next-step="changeCategoryStep"
        @prev-step="backLocationStep"
      />
      <school-add-step-contact
        v-if="currentStep == STEP_INDEX.Contact"
        @next-step="changeFacilityStep"
        @prev-step="backCategoryStep"
      />
      <school-add-step-facility
        v-if="currentStep == STEP_INDEX.Facilities"
        @next-step="changeScoreStep"
        @prev-step="backContactStep"
      />

      <school-add-step-score
        v-if="currentStep == STEP_INDEX.Score"
        @next-step="submitSchool"
        @prev-step="backFacilityStep"
      />
    </v-container>
  </div>
</template>

<script setup>
// {
//   //"name": "string",
//   "latitude": 0,
//   "longitude": 0,
//   //"stateId": 0,
//   //"cityId": 0,
//   //"countryId": 0,
//   "localName": "string",
//   "schoolType": "Public",
//   "zipCode": "string",
//   //"address": "string",
//   //"webSite": "string",
//   "localAddress": "string",
//   //"email": "string",
//   "faxNumber": "string",
//   //"phoneNumber": "string",
//   "quarter": "string",
//   //"tags": [
//     0
//   ],
//   //"tuition": 0
// }
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
const currentStep = ref(STEP_INDEX.Score);

const changeStep = (step) => {
  currentStep.value = step.value;
};
// end section step

const changeLocationStep = () => {
  currentStep.value = STEP_INDEX.Category;
};
const backLocationStep = () => {
  currentStep.value = STEP_INDEX.Location;
};

const changeCategoryStep = () => {
  currentStep.value = STEP_INDEX.Contact;
};
const backCategoryStep = () => {
  currentStep.value = STEP_INDEX.Category;
};

const changeFacilityStep = () => {
  currentStep.value = STEP_INDEX.Facilities;
};
const backContactStep = () => {
  currentStep.value = STEP_INDEX.Contact;
};

const changeScoreStep = () => {
  currentStep.value = STEP_INDEX.Score;
};
const backFacilityStep = () => {
  currentStep.value = STEP_INDEX.Facilities;
};
const submitSchool = () => {};
</script>

<style scoped>
.margin-top-handle {
  margin-top: 64px;
  min-height: calc(100vh - 64px);
  background-color: #f8f7f7;
}
.handle-height {
  min-height: calc(100vh - 64px - 90px);
}

@media (min-width: 960px) {
  .margin-top-handle {
    margin-top: 6.4rem;
    min-height: calc(100vh - 6.4rem);
  }
  .handle-height {
    min-height: calc(100vh - 6.4rem - 90px);
  }
}
</style>
