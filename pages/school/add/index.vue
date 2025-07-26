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
      <div class="display-set" v-show="currentStep == STEP_INDEX.Location">
        <school-add-step-location
          @next-step="nextStep"
          :school-information="schoolInformation"
        />
      </div>
      <div class="display-set" v-show="currentStep == STEP_INDEX.Category">
        <school-add-step-category @next-step="nextStep" @prev-step="backStep" />
      </div>
      <div class="display-set" v-show="currentStep == STEP_INDEX.Contact">
        <school-add-step-contact @next-step="nextStep" @prev-step="backStep" />
      </div>
      <div class="display-set" v-show="currentStep == STEP_INDEX.Facilities">
        <school-add-step-facility
          @next-step="submitSchool"
          @prev-step="backStep"
        />
      </div>
      <div class="display-set" v-show="currentStep == STEP_INDEX.Score">
        <school-add-step-score
          @next-step="sendCommentOnSchool"
          @prev-step="backStep"
        />
      </div>
    </v-container>
  </div>
</template>

<script setup>
const nuxtApp = useNuxtApp();

const loadingSubmitSchool = ref(false);
const schoolInformation = ref({
  name: "",
  latitude: 0,
  longitude: 0,
  stateId: null,
  cityId: null,
  countryId: null,
  // localName: "",
  // "schoolType": "Public",
  // zipCode: "",
  address: "",
  webSite: "",
  // localAddress: "",
  email: "",
  // faxNumber: "",
  phoneNumber: "",
  // quarter: "",
  tags: [],
  tuition: 0,
});

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

const nextStep = (data) => {
  schoolInformation.value = {
    ...schoolInformation.value,
    ...data,
  };
  currentStep.value += 1;
};
const backStep = () => {
  currentStep.value -= 1;
};
const submitSchool = (data) => {
  loadingSubmitSchool.value = true;
  schoolInformation.value = {
    ...schoolInformation.value,
    ...data,
  };
  console.log(schoolInformation.value);

  useApiService
    .post(`/api/v2/schools/contributions`, schoolInformation.value)
    .then(async (response) => {
      console.log("final response", response);

      if (response.succeeded) {
        nuxtApp.$toast?.success(
          "Thank you! Your contribution has been successfully submitted."
        );
      } else {
        nuxtApp.$toast?.error(response?.errors[0]?.message);
      }
    })
    .catch((err) => {
      console.log("err", err);

      if (err?.response?.status == 401 || err?.response?.status == 403) {
      } else nuxtApp.$toast?.error(err?.response?.data?.message);
    })
    .finally(() => {
      loadingSubmitSchool.value = false;
    });
};

const sendCommentOnSchool = () => {};
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
.display-set {
  display: flex;
  justify-content: center;
  width: 100%;
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
