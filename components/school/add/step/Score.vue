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
        />
      </div>

      <v-textarea
        v-model="comment"
        rounded="lg"
        density="compact"
        placeholder="Type your comment"
        variant="outlined"
        autocomplete="new-password"
        role="presentation"
        persistent-clear
        no-resize
        base-color="#E4E7EC"
        color="#ffb600"
        active-color="#ffb600"
        bg-color="#ffffff"
        class="w-100"
      ></v-textarea>
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

const itemsScore = ref([
  {
    title: "Classes quality",
    id: 1,
    score: 2,
  },
  {
    title: "Education",
    id: 2,
    score: 0,
  },
  {
    title: "IT training",
    id: 3,
    score: 0,
  },
  {
    title: "Safe and happy",
    id: 4,
    score: 0,
  },
  {
    title: "Behavior",
    id: 5,
    score: 0,
  },
  {
    title: "Tuition ratio",
    id: 6,
    score: 0,
  },
  {
    title: "Facilities",
    id: 7,
    score: 0,
  },
  {
    title: "Artistic activities",
    id: 8,
    score: 0,
  },
]);
const comment = ref("");

const submitForm = () => {
  emit("nextStep");
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

.dot-div {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ffb600;
}
</style>
