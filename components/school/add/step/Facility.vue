<template>
  <div
    class="w-100 d-flex flex-column align-center justify-space-between ga-1 max-width-container"
  >
    <div class="w-100 d-flex flex-column align-center justify-start ga-2">
      <div class="w-100 text-h4 primary-gray-500">School Facilities</div>

      <div class="w-100 d-flex flex-wrap">
        <div
          v-if="isLoadingTag"
          class="w-100 w-sm-50 d-flex align-center pt-6 pb-6 ga-2"
          v-for="loader in 6"
          :key="loader"
        >
          <v-skeleton-loader
            width="48"
            height="48"
            class="bg-transparent rounded-circle"
          ></v-skeleton-loader>

          <v-skeleton-loader
            width="90"
            height="16"
            class="bg-transparent rounded-lg"
          ></v-skeleton-loader>
        </div>
        <div
          v-else
          class="w-100 w-sm-50 d-flex align-center pt-6 pb-6 ga-2"
          v-for="(tag, index) in tags"
          :key="index"
          @click="chooseTag(tag)"
        >
          <v-btn
            icon
            flat
            :color="selectedTags.includes(tag.id) ? `#344054` : `#D0D5DD`"
            width="48"
            height="48"
          >
            <v-icon size="x-large" color="#ffffff">{{
              "md:" + tag.icon
            }}</v-icon>
          </v-btn>
          <span class="font-weight-bold text-h5 primary-gray-900">{{
            tag.name
          }}</span>
        </div>
      </div>
    </div>

    <div class="w-100 d-flex align-center justify-center ga-3 mt-2">
      <v-btn @click="cancel" size="x-small" variant="text" class="text-h5">
        Cancel
      </v-btn>
      <v-btn
        :loading="loadingSendData"
        @click="preStep"
        icon
        color="#1D2939"
        height="40"
        width="40"
        flat
      >
        <v-icon size="x-large">md:arrow_back</v-icon>
      </v-btn>
      <v-btn
        color="#ffb600"
        flat
        rounded="xl"
        height="40"
        max-width="180"
        class="w-100 text-h5"
        @click="submitForm"
        :loading="loadingSendData"
      >
        Confirm
      </v-btn>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();

const props = defineProps({
  loadingSendData: {
    tpye: Boolean,
    default: false,
  },
});
const emit = defineEmits(["nextStep", "prevStep"]);

onMounted(async () => {
  await getTags();
});

const getTags = async (params, type) => {
  try {
    isLoadingTag.value = true;
    const endpoint = "/api/v2/tags/School";
    const response = await $fetch(endpoint);
    tags.value = response.data;
  } catch (err) {
    console.error("Error fetching location data:", err);
  } finally {
    isLoadingTag.value = false;
  }
};

const isLoadingTag = ref(true);
const selectedTags = ref([]);
const tags = ref([]);

const chooseTag = (tag) => {
  if (selectedTags.value.includes(tag.id)) {
    selectedTags.value = selectedTags.value.filter((id) => id !== tag.id);
  } else {
    selectedTags.value.push(tag.id);
  }
};

const submitForm = () => {
  const facilityStepInfo = {
    tags: [...selectedTags.value],
  };
  emit("nextStep", facilityStepInfo);
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
</style>
