<template>
  <div
    class="w-100 d-flex flex-column align-center justify-space-between ga-1 max-width-container"
  >
    <div class="w-100 d-flex flex-column align-center justify-start ga-10">
      <v-alert
        class="primary-gray-700 font-weight-bold"
        text="You're adding a new school.Please enter the details carefully!"
        border="start"
        color="#ffdb804d"
        border-color="#FFB600"
        rounded="lg"
      >
        <template #prepend>
          <v-icon color="#FFB600">mdi-lightbulb-alert</v-icon>
        </template>
      </v-alert>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 font-weight-bold primary-gray-700 ml-2">Title</div>
        <v-text-field
          v-model="title"
          rounded
          density="compact"
          placeholder="Title"
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
        ></v-text-field>
      </div>

      <div
        v-for="(location, index) in locationData"
        :key="index"
        class="w-100 d-flex flex-column align-start justify-start ga-1"
      >
        <div class="text-h6 font-weight-bold primary-gray-700 ml-2">
          {{ location.lable }}
        </div>
        <v-text-field
          v-model="location.selected.title"
          rounded
          density="compact"
          :placeholder="location.lable"
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
          @click="openModal(location)"
          @click:clear="clearValue(index)"
          :disabled="checkDisable(index)"
        ></v-text-field>

        <search-select-dialog
          v-model:show-dialog="location.isOpenModal"
          :title-modal="location.lable"
          :items="location.items"
          :selected-item="location.selected"
          @change-selected-item="onFilterUpdate($event, index)"
          :is-loading="location.loading"
        />
      </div>
    </div>

    <div class="w-100 d-flex align-center justify-center ga-3">
      <v-btn @click="cancel" variant="text" class="text-h5"> Cancel </v-btn>
      <v-btn
        color="#ffb600"
        flat
        rounded="xl"
        height="40"
        width="200"
        class="text-h5"
        :disabled="!isFormValid"
        @click="submitForm"
        :loading="loadingFindSchool"
      >
        Confirm
      </v-btn>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();

const props = defineProps({
  schoolInformation: {
    type: Object,
  },
});
const emit = defineEmits(["nextStep", "schoolFindInSearch"]);

onMounted(() => {
  getLocationList({ "PagingDto.PageFilter.Size": 250 }, "Country");
});

const getLocationList = async (params, type) => {
  try {
    let endpoint = "/api/v1/types/list";
    if (type === "Country") {
      locationData.value[0].loading = true;
      endpoint = "/api/v2/locations/countries";
    }
    if (type === "State") {
      locationData.value[1].loading = true;
      endpoint = `/api/v2/locations/states/${locationData.value[0].selected.id}`;
    }
    if (type === "City") {
      locationData.value[2].loading = true;
      endpoint = `/api/v2/locations/cities/${locationData.value[1].selected.id}`;
    }

    const response = await $fetch(endpoint, { params });

    if (type === "Country") {
      locationData.value[0].items = response.data.list;
    }
    if (type === "State") {
      locationData.value[1].items = response.data.list;
    }
    if (type === "City") {
      locationData.value[2].items = response.data.list;
    }
  } catch (err) {
    console.error("Error fetching location data:", err);
  } finally {
    locationData.value.forEach((item) => {
      item.loading = false;
    });
  }
};

const isFormValid = computed(() => {
  if (!title.value || !title.value.trim()) return false;

  for (const location of locationData.value) {
    if (!location.selected.title || !location.selected.title.trim()) {
      return false;
    }
  }
  return true;
});

const title = ref("");

const locationData = ref([
  {
    lable: "Country",
    loading: false,
    isOpenModal: false,
    items: [],
    selected: {
      id: null,
      title: "",
    },
  },
  {
    lable: "State",
    loading: false,
    isOpenModal: false,
    items: [],
    selected: {
      id: null,
      title: "",
    },
  },
  {
    lable: "City",
    loading: false,
    isOpenModal: false,
    items: [],
    selected: {
      id: null,
      title: "",
    },
  },
]);
const openModal = (location) => {
  location.isOpenModal = true;
};
const clearValue = (index) => {
  for (let i = index; i < locationData.value.length; i++) {
    locationData.value[i].selected = {
      id: null,
      title: "",
    };
  }
};

const onFilterUpdate = (selectedItem, index) => {
  locationData.value[index].isOpenModal = false;
  if (
    selectedItem.id &&
    selectedItem.id != locationData.value[index].selected.id
  ) {
    clearValue(index);
    locationData.value[index].selected = selectedItem;
    if (index != locationData.value.length - 1) {
      getLocationList(
        { "PagingDto.PageFilter.Size": 10000 },
        locationData.value[index + 1].lable
      );
    }
  }
};
const checkDisable = (index) => {
  for (let i = 0; i < index; i++) {
    if (locationData.value[i].selected.id == null) {
      return true;
    }
  }
  return false;
};

const submitForm = () => {
  if (isFormValid.value) {
    checkSchoolAvailable();
  }
};

const loadingFindSchool = ref(false);
const checkSchoolAvailable = async () => {
  try {
    loadingFindSchool.value = true;
    const params = {
      Name: title.value,
      CountryId: locationData.value[0].selected.id,
      StateId: locationData.value[1].selected.id,
      CityId: locationData.value[2].selected.id,
    };

    const response = await useApiService.get("/api/v2/schools", params);
    const locationStepInfo = {
      name: title.value,
      countryId: locationData.value[0].selected.id,
      stateId: locationData.value[1].selected.id,
      cityId: locationData.value[2].selected.id,
    };
    if (response.data.list == null || response.data.list.length == 0) {
      emit("nextStep", locationStepInfo);
    } else {
      emit("schoolFindInSearch", response.data.list[0], locationStepInfo);
    }
    // console.log("response", response);
  } catch (err) {
    console.error(err);
  } finally {
    loadingFindSchool.value = false;
  }
};

const cancel = () => {
  router.push("/school");
};
</script>

<style scoped>
.max-width-container {
  max-width: 500px;
}
</style>
