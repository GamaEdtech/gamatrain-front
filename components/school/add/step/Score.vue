<template>
  <div
    class="w-100 d-flex flex-column align-center justify-space-between ga-1 max-width-container"
  >
    <div class="w-100 d-flex flex-column align-center justify-start ga-10">
      <div class="w-100 text-h4 primary-gray-500">School Score</div>

      <div
        class="w-100 d-flex justify-space-between align-center"
        v-for="(item, index) in itemsScore"
        :key="index"
      >
        <span
          class="d-flex align-center ga-3 text-h5 font-weight-bold primary-gray-700"
        >
          <div class="dot-div"></div>
          {{ item.title }}
        </span>

        <v-rating
          half-increments
          hover
          :length="5"
          :size="30"
          :model-value="item.score"
          color="primary"
          active-color="primary"
          empty-icon="md:star_outline"
          half-icon="md:star_half"
          full-icon="md:star"
          @update:model-value="updateRating($event, index)"
        />
      </div>

      <v-textarea
        v-model="comment"
        rounded="lg"
        density="compact"
        placeholder="Type your comment"
        variant="outlined"
        autocomplete="off"
        persistent-clear
        no-resize
        base-color="#E4E7EC"
        color="#ffb600"
        active-color="#ffb600"
        bg-color="#ffffff"
        class="w-100"
      ></v-textarea>
    </div>

    <div class="w-100 d-flex align-center justify-center ga-3 mt-2">
      <v-btn @click="cancel" size="x-small" variant="text" class="text-h5">
        Cancel
      </v-btn>

      <v-btn
        color="#ffb600"
        flat
        rounded="xl"
        height="40"
        max-width="180"
        class="w-100 text-h5"
        :loading="loading"
        @click="submitForm"
      >
        Confirm
      </v-btn>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["nextStep", "prevStep"]);

const itemsScore = ref([
  {
    title: "Classes quality",
    id: 1,
    key: "classesQualityRate",
    score: 0,
  },
  {
    title: "Education",
    id: 2,
    key: "educationRate",
    score: 0,
  },
  {
    title: "IT training",
    id: 3,
    key: "itTrainingRate",
    score: 0,
  },
  {
    title: "Safe and happy",
    id: 4,
    key: "safetyAndHappinessRate",
    score: 0,
  },
  {
    title: "Behavior",
    id: 5,
    key: "behaviorRate",
    score: 0,
  },
  {
    title: "Tuition ratio",
    id: 6,
    key: "tuitionRatioRate",
    score: 0,
  },
  {
    title: "Facilities",
    id: 7,
    key: "facilitiesRate",
    score: 0,
  },
  {
    title: "Artistic activities",
    id: 8,
    key: "artisticActivitiesRate",
    score: 0,
  },
]);

const updateRating = (rate, index) => {
  itemsScore.value[index].score = rate;
};
const comment = ref("");

const submitForm = () => {
  const informationSumbitComment = {
    comment: comment.value,
  };
  itemsScore.value.forEach((item, index) => {
    informationSumbitComment[item.key] = item.score;
  });
  const commentObject = {
    comment: informationSumbitComment,
  };

  emit("nextStep", commentObject);
};

const cancel = () => {
  router.push("/school");
};
</script>

<style scoped>
.max-width-container {
  max-width: 500px;
}

.dot-div {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ffb600;
}
</style>
