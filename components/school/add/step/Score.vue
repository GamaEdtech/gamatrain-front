<template>
  <div
    class="w-100 d-flex flex-column align-center justify-space-between ga-1 max-width-container"
  >
    <div class="w-100 d-flex flex-column align-center justify-start ga-10">
      <div class="w-100 text-h4 primary-gray-500">
        School Score
      </div>

      <div
        v-for="(item, index) in itemsScore"
        :key="index"
        class="w-100 d-flex justify-space-between align-center"
      >
        <span
          class="d-flex align-center ga-3 text-h5 font-weight-bold primary-gray-700"
        >
          <div class="dot-div" />
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

      <div
        class="w-100 d-flex flex-column align-start justify-start ga-1 position-relative"
      >
        <div class="text-h6 font-weight-bold primary-gray-700 ml-2">
          <v-badge
            floating
            location="top right"
            color="transparent"
            overlap
          >
            <template #badge>
              <v-icon
                size="large"
                color="red"
              >
                md:star
              </v-icon>
            </template>
            <span>Comment</span>
          </v-badge>
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
          rows="7"
          :rules="[descriptionRule]"
        />
        <v-btn
          size="x-small"
          height="40"
          width="40"
          icon
          color="primary"
          :loading="loadingHelpAi"
          class="position-absolute position-button-ai"
          @click="sendToAI"
        >
          <v-icon
            size="x-large"
            color="white"
          >
            md:edit
          </v-icon>
        </v-btn>
      </div>
    </div>

    <div class="w-100 d-flex align-center justify-center ga-3 mt-2">
      <v-btn
        size="x-small"
        variant="text"
        class="text-h5"
        @click="cancel"
      >
        Cancel
      </v-btn>
      <v-btn
        :loading="loading"
        icon
        color="#1D2939"
        height="40"
        width="40"
        flat
        @click="preStep"
      >
        <v-icon size="x-large">
          md:arrow_back
        </v-icon>
      </v-btn>
      <v-btn
        color="#ffb600"
        flat
        rounded="xl"
        height="40"
        max-width="180"
        class="w-100 text-h5"
        :loading="loading"
        :disabled="!isFormValid"
        @click="submitForm"
      >
        Confirm
      </v-btn>
    </div>
  </div>
</template>

<script setup>
const router = useRouter()

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  schoolAiData: {
    type: Object,
  },
})
const emit = defineEmits(['nextStep', 'prevStep'])

const itemsScore = ref([
  {
    title: 'Classes quality',
    id: 1,
    key: 'classesQualityRate',
    score: 0,
  },
  {
    title: 'Education',
    id: 2,
    key: 'educationRate',
    score: 0,
  },
  {
    title: 'IT training',
    id: 3,
    key: 'itTrainingRate',
    score: 0,
  },
  {
    title: 'Safe and happy',
    id: 4,
    key: 'safetyAndHappinessRate',
    score: 0,
  },
  {
    title: 'Behavior',
    id: 5,
    key: 'behaviorRate',
    score: 0,
  },
  {
    title: 'Tuition ratio',
    id: 6,
    key: 'tuitionRatioRate',
    score: 0,
  },
  {
    title: 'Facilities',
    id: 7,
    key: 'facilitiesRate',
    score: 0,
  },
  {
    title: 'Artistic activities',
    id: 8,
    key: 'artisticActivitiesRate',
    score: 0,
  },
])

const updateRating = (rate, index) => {
  itemsScore.value[index].score = rate
}
const comment = ref('')

const { loading: loadingHelpAi, getDescriptionFromAi } = useCommentAssistant()

const sendToAI = async () => {
  try {
    const result = await getDescriptionFromAi(props.schoolAiData)
    if (result) {
      comment.value = result.description
    }
  }
  catch (err) {
    console.error('AI Error:', err)
  }
}

const descriptionRule = (value) => {
  if (!value) return true
  return value.length <= 500 || 'Maximum 500 characters allowed'
}
const isFormValid = computed(() => {
  return comment.value ? descriptionRule(comment.value) === true : false
})

const submitForm = () => {
  if (isFormValid.value) {
    const informationSumbitComment = {
      comment: comment.value,
    }
    itemsScore.value.forEach((item) => {
      informationSumbitComment[item.key] = item.score
    })
    const commentObject = {
      comment: informationSumbitComment,
    }

    emit('nextStep', commentObject)
  }
}

const cancel = () => {
  router.push('/school')
}

const preStep = () => {
  emit('prevStep')
}
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
.position-button-ai {
  right: 20px;
  bottom: 30px;
}
</style>
