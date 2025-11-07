<template>
  <v-row class="mt-16">
    <v-col
      cols="12"
      md="4"
    >
      <h3 class="gtext-h5 primary-gray-600 mb-15 font-weight-bold">
        Score
      </h3>
      <div class="d-flex">
        <img
          id="score-img"
          src="/images/score.png"
          alt="Users score"
          class="mr-8"
        >
        <div class="mt-10">
          <div class="gtext-t6 primary-gray-400 mb-10">
            Total comments
            <span class="primary-gray-800 font-weight-heavy">
              {{ ratingData?.totalCount }}
            </span>
          </div>
          <div>
            <v-rating
              v-model="averageRate"
              background-color="orange lighten-3"
              color="orange"
              half-increments
              hover
              size="24"
              readonly
            />
          </div>
          <div class="gtext-t6 primary-gray-400">
            Average score &nbsp;<span
              class="primary-gray-900 gtext-t4 font-weight-medium"
            >
              {{ averageRate ? averageRate.toFixed(1) : "New" }} </span><span>&nbsp;/&nbsp;5</span>
          </div>
        </div>
      </div>
      <div class="mt-10 mb-12">
        <v-btn
          block
          class="bg-primary-gray-800 text-white text-transform-none gtext-t4 font-weight-medium"
          rounded
          size="x-large"
          @click="emit('leave-comment')"
        >
          Leave a Comment
        </v-btn>
      </div>
    </v-col>
    <v-col
      cols="12"
      md="8"
    >
      <ul
        id="score-results"
        class="pl-0 mr-4"
      >
        <li class="d-flex mb-4">
          <div class="bullet" />
          <div class="gtext-t4 font-weight-medium score-title">
            Classroom & facility quality
          </div>
          <v-progress-linear
            color="success"
            rounded
            :model-value="(ratingData.facilitiesRate * 100) / 5"
            height="8"
            class="mt-3"
          />
          <div class="gtext-t4 font-weight-medium rate-title ml-2">
            {{ convertRateToString(ratingData.facilitiesRate) }}
          </div>
        </li>
        <li class="d-flex mb-4">
          <div class="bullet" />
          <div class="gtext-t4 font-weight-medium score-title">
            Teachers' expertise
          </div>
          <v-progress-linear
            color="success"
            rounded
            :model-value="(ratingData.educationRate * 100) / 5"
            height="8"
            class="mt-3"
          />
          <div class="gtext-t4 font-weight-medium rate-title ml-2">
            {{ convertRateToString(ratingData.educationRate) }}
          </div>
        </li>
        <li class="d-flex mb-4">
          <div class="bullet" />
          <div class="gtext-t4 font-weight-medium score-title">
            Tech accessibility
          </div>
          <v-progress-linear
            color="success"
            rounded
            :model-value="(ratingData.itTrainingRate * 100) / 5"
            height="8"
            class="mt-3"
          />
          <div class="gtext-t4 font-weight-medium rate-title ml-2">
            {{ convertRateToString(ratingData.itTrainingRate) }}
          </div>
        </li>
        <li class="d-flex mb-4">
          <div class="bullet" />
          <div class="gtext-t4 font-weight-medium score-title">
            Safety & environment
          </div>
          <v-progress-linear
            color="success"
            rounded
            :model-value="(ratingData.safetyAndHappinessRate * 100) / 5"
            height="8"
            class="mt-3"
          />
          <div class="gtext-t4 font-weight-medium rate-title ml-2">
            {{ convertRateToString(ratingData.safetyAndHappinessRate) }}
          </div>
        </li>
        <li class="d-flex mb-4">
          <div class="bullet" />
          <div class="gtext-t4 font-weight-medium score-title">
            Staff behavior
          </div>
          <v-progress-linear
            color="success"
            rounded
            :model-value="(ratingData.behaviorRate * 100) / 5"
            height="8"
            class="mt-3"
          />
          <div class="gtext-t4 font-weight-medium rate-title ml-2">
            {{ convertRateToString(ratingData.behaviorRate) }}
          </div>
        </li>
        <li class="d-flex mb-4">
          <div class="bullet" />
          <div class="gtext-t4 font-weight-medium score-title">
            Value for tuition
          </div>
          <v-progress-linear
            color="success"
            rounded
            :model-value="(ratingData.tuitionRatioRate * 100) / 5"
            height="8"
            class="mt-3"
          />
          <div class="gtext-t4 font-weight-medium rate-title ml-2">
            {{ convertRateToString(ratingData.tuitionRatioRate) }}
          </div>
        </li>
        <li class="d-flex mb-4">
          <div class="bullet" />
          <div class="gtext-t4 font-weight-medium score-title">
            Sports facilities
          </div>
          <v-progress-linear
            color="success"
            rounded
            :model-value="(ratingData.facilitiesRate * 100) / 5"
            height="8"
            class="mt-3"
          />
          <div class="gtext-t4 font-weight-medium rate-title ml-2">
            {{ convertRateToString(ratingData.facilitiesRate) }}
          </div>
        </li>
        <li class="d-flex">
          <div class="bullet" />
          <div class="gtext-t4 font-weight-medium score-title">
            Art & counseling programs
          </div>
          <v-progress-linear
            color="success"
            rounded
            :model-value="(ratingData.artisticActivitiesRate * 100) / 5"
            height="8"
            class="mt-3"
          />
          <div class="gtext-t4 font-weight-medium rate-title ml-2">
            {{ convertRateToString(ratingData.artisticActivitiesRate) }}
          </div>
        </li>
      </ul>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  ratingData: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['leave-comment'])
const averageRate = computed(() => props.ratingData.averageRate || 0)
function convertRateToString(value) {
  if (value > 3.5) return 'Good'
  else if (value > 2) return 'Average'
  else if (value <= 2) return 'Poor'
  else return 'Unknown'
}
</script>

<style scoped>
#score-img {
  width: 16rem;
  height: 16rem;
}
.score-title {
  min-width: 22rem !important;
}
#score-results .rate-title {
  width: 14rem;
  text-align: right;
}
</style>
