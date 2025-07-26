<template>
  <div
    class="w-100 d-flex flex-column align-center justify-space-between ga-1 max-width-container"
  >
    <div class="w-100 d-flex flex-column align-center justify-start ga-10">
      <div class="w-100 text-h4 primary-gray-500">School Category</div>

      <!-- <div class="w-100 d-flex flex-column align-start justify-start ga-2">
        <div class="text-h6 font-weight-bold primary-gray-700 ml-2">Stage</div>
        <v-text-field
          v-model="selectedStage.title"
          rounded
          density="compact"
          placeholder="Stage"
          variant="outlined"
          hide-details
          autocomplete="new-password"
          role="presentation"
          clearable
          persistent-clear
          base-color="#E4E7EC"
          color="#ffb600"
          active-color="#ffb600"
          bg-color="#ffffff"
          class="w-100"
          readonly
          append-inner-icon="mdi-chevron-down"
          @click="openStageModal"
          @click:clear="clearStageValue"
        ></v-text-field>

        <search-select-dialog
          v-model:show-dialog="isOpenStageModal"
          title-modal="Stage"
          :items="stages"
          :selected-item="selectedStage"
          @change-selected-item="onFilterUpdate"
          :is-loading="stageLoading"
        />
      </div>

      <div
        class="w-100 d-flex align-center justify-space-between flex-wrap ga-6"
      >
        <div class="text-h5 font-weight-bold primary-gray-700 ml-2">
          Coed Status
        </div>
        <v-skeleton-loader
          v-if="ceodLoading"
          type="chip"
          width="150"
          height="50"
          class="bg-transparent justify-end"
        ></v-skeleton-loader>
        <v-btn-toggle
          v-else
          v-model="selectedCeod"
          rounded="xl"
          color="#1D2939"
          density="compact"
          divided
          base-color="#ffffff"
        >
          <v-btn
            class="font-weight-bold text-h6"
            v-for="(item, index) in ceods"
            :key="index"
            :value="item.id"
          >
            {{ item.title }}
          </v-btn>
        </v-btn-toggle>
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-6">
        <div class="text-h5 font-weight-bold primary-gray-700 ml-2">
          School Type
        </div>

        <div class="d-flex flex-wrap ga-2">
          <v-skeleton-loader
            v-if="schoolTypesLoading"
            width="100"
            height="30"
            class="bg-transparent rounded-xl"
            v-for="item in 3"
          ></v-skeleton-loader>
          <v-chip
            v-else
            v-for="(type, index) in schoolTypes"
            :key="index"
            color="#1D2939"
            :variant="
              selectedschoolTypes.includes(type.id) ? `flat` : `outlined`
            "
            class="font-weight-bold text-h6 cursor-pointer"
            @click="chooseSchoolType(type)"
          >
            {{ type.title }}
            <v-icon
              v-if="selectedschoolTypes.includes(type.id)"
              icon="mdi-close-circle"
              end
            ></v-icon>
          </v-chip>
        </div>
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-6">
        <div class="text-h5 font-weight-bold primary-gray-700 ml-2">
          Boarding type
        </div>

        <div class="d-flex flex-wrap ga-2">
          <v-skeleton-loader
            v-if="boardingTypesLoading"
            width="100"
            height="30"
            class="bg-transparent rounded-xl"
            v-for="item in 3"
          ></v-skeleton-loader>
          <v-chip
            v-else
            v-for="(type, index) in boardingTypes"
            :key="index"
            color="#1D2939"
            :variant="
              selectedboardingTypes.includes(type.id) ? `flat` : `outlined`
            "
            class="font-weight-bold text-h6 cursor-pointer"
            @click="chooseBoardingType(type)"
          >
            {{ type.title }}
            <v-icon
              v-if="selectedboardingTypes.includes(type.id)"
              icon="mdi-close-circle"
              end
            ></v-icon>
          </v-chip>
        </div>
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-6">
        <div class="text-h5 font-weight-bold primary-gray-700 ml-2">
          Religion
        </div>

        <div class="d-flex flex-wrap ga-2">
          <v-skeleton-loader
            v-if="religionLoading"
            width="100"
            height="30"
            class="bg-transparent rounded-xl"
            v-for="item in 3"
          ></v-skeleton-loader>
          <v-chip
            v-else
            v-for="(type, index) in religions"
            :key="index"
            color="#1D2939"
            :variant="selectedReligions.includes(type.id) ? `flat` : `outlined`"
            class="font-weight-bold text-h6 cursor-pointer"
            @click="chooseReligion(type)"
          >
            {{ type.title }}
            <v-icon
              v-if="selectedReligions.includes(type.id)"
              icon="mdi-close-circle"
              end
            ></v-icon>
          </v-chip>
        </div>
      </div> -->

      <div
        class="w-100 d-flex align-center justify-space-between flex-wrap ga-10 ga-sm-6"
      >
        <div class="text-h5 font-weight-bold primary-gray-700 ml-2">
          Tuition fee to
        </div>

        <v-slider
          class="w-66"
          thumb-color="#ffb600"
          color="#ffb600"
          track-color="#E4E7EC"
          density="compact"
          hide-details
          v-model="valueTuition"
          :max="500000"
          :min="0"
          :step="10000"
          thumb-label="always"
          :ticks="steps"
          show-ticks="always"
          tick-size="6"
        >
          <template #thumb-label="{ modelValue }">
            <span class="text-h5 font-weight-black text-black"
              >${{ modelValue }}</span
            >
          </template>
        </v-slider>
      </div>
    </div>

    <div class="w-100 d-flex align-center justify-center ga-3">
      <v-btn @click="cancel" size="x-small" variant="text" class="text-h5">
        Cancel
      </v-btn>
      <v-btn @click="preStep" icon color="#1D2939" height="40" width="40" flat>
        <v-icon size="x-large">mdi-arrow-left</v-icon>
      </v-btn>
      <v-btn
        color="#ffb600"
        flat
        rounded="xl"
        height="40"
        max-width="180"
        class="w-100 text-h5"
        :disabled="!isFormValid"
        @click="submitForm"
      >
        Confirm
      </v-btn>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();

const emit = defineEmits(["nextStep", "prevStep"]);

onMounted(() => {
  // stageLoading.value = true;
  // getInformationList({ type: "section" }, "stage");
  // ceodLoading.value = true;
  // getInformationList({ type: "coed_status" }, "coed_status");
  // schoolTypesLoading.value = true;
  // getInformationList({ type: "school_type" }, "school_type");
  // boardingTypesLoading.value = true;
  // getInformationList({ type: "boarding_type" }, "boarding_type");
  // religionLoading.value = true;
  // getInformationList({ type: "religion" }, "religion");
});

// const getInformationList = async (params, type) => {
//   try {
//     const endpoint = "/api/v1/types/list";

//     const response = await $fetch(endpoint, { params });
//     console.log("reposne", type, response);
//     if (type == "stage") {
//       stages.value = response.data;
//     } else if (type == "coed_status") {
//       ceods.value = response.data;
//     } else if (type == "school_type") {
//       schoolTypes.value = response.data;
//     } else if (type == "boarding_type") {
//       boardingTypes.value = response.data;
//     } else if (type == "religion") {
//       religions.value = response.data;
//     }
//   } catch (err) {
//     console.error("Error fetching location data:", err);
//   } finally {
//     if (type == "stage") {
//       stageLoading.value = false;
//     } else if (type == "coed_status") {
//       ceodLoading.value = false;
//     } else if (type == "school_type") {
//       schoolTypesLoading.value = false;
//     } else if (type == "boarding_type") {
//       boardingTypesLoading.value = false;
//     } else if (type == "religion") {
//       religionLoading.value = false;
//     }
//   }
// };

// start stage section
const stageLoading = ref(false);
const selectedStage = ref({
  title: "",
  id: null,
});
const stages = ref([]);
const isOpenStageModal = ref(false);

const openStageModal = () => {
  isOpenStageModal.value = true;
};
const clearStageValue = () => {
  selectedStage.value = {
    id: null,
    title: "",
  };
};

const onFilterUpdate = (selectedItem) => {
  isOpenStageModal.value = false;
  if (selectedItem.id && selectedItem.id != selectedStage.value.id) {
    selectedStage.value = selectedItem;
  }
};
// end stage section

// start ceod section
const ceodLoading = ref(true);
const selectedCeod = ref();
const ceods = ref([]);
// end ceod section

// start school type section
const schoolTypesLoading = ref(true);
const selectedschoolTypes = ref([]);
const schoolTypes = ref([]);

const chooseSchoolType = (schoolType) => {
  if (selectedschoolTypes.value.includes(schoolType.id)) {
    selectedschoolTypes.value = selectedschoolTypes.value.filter(
      (id) => id !== schoolType.id
    );
  } else {
    selectedschoolTypes.value.push(schoolType.id);
  }
};
// end  school type section

// start boarding type section
const boardingTypesLoading = ref(true);
const selectedboardingTypes = ref([]);
const boardingTypes = ref([]);

const chooseBoardingType = (boardingType) => {
  if (selectedboardingTypes.value.includes(boardingType.id)) {
    selectedboardingTypes.value = selectedboardingTypes.value.filter(
      (id) => id !== boardingType.id
    );
  } else {
    selectedboardingTypes.value.push(boardingType.id);
  }
};
// end  boarding type section

// start religion section
const religionLoading = ref(true);
const selectedReligions = ref([]);
const religions = ref([]);

const chooseReligion = (religion) => {
  if (selectedReligions.value.includes(religion.id)) {
    selectedReligions.value = selectedReligions.value.filter(
      (id) => id !== religion.id
    );
  } else {
    selectedReligions.value.push(religion.id);
  }
};
// end  religion section

// start tuituin section
const valueTuition = ref(0);
const steps = ref({
  0: "",
  100000: "",
  200000: "",
  300000: "",
  400000: "",
  500000: "",
});
// end tuituin section

const isFormValid = computed(() => {
  if (valueTuition.value == 0) return false;
  return true;
});

const submitForm = () => {
  if (isFormValid.value) {
    const categoryStepInformation = {
      tuition: valueTuition.value,
    };
    emit("nextStep", categoryStepInformation);
  }
};

const preStep = () => {
  emit("prevStep");
};

const cancel = () => {
  router.push("/school");
};
</script>

<style scoped>
.max-width-container {
  max-width: 500px;
}
:deep(.v-slider-thumb__label) {
  background-color: #ffb600;
  height: 36px;
}
:deep(.v-slider-thumb__label::before) {
  color: #ffb600;
}
:deep(.v-slider-track__tick) {
  background-color: #d0d5dd;
}
:deep(.v-slider-track__tick--filled) {
  background-color: #ffd58d;
}
</style>
