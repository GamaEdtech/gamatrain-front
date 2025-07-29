<template>
  <v-dialog
    v-model="dialogVisible"
    transition="dialog-bottom-transition"
    :fullscreen="display.xs.value"
    max-width="924"
    style="z-index: 1501"
  >
    <v-card>
      <v-card-text class="pt-6 pb-0 pt-md-8 pb-2 px-6 px-md-12">
        <div class="d-flex">
          <div class="gtext-h5 priamry-gray-700">
            Leave a Comment
          </div>
          <v-spacer />
          <v-btn
            icon
            variant="text"
            @click="dialogVisible = false"
          >
            <v-icon
              size="20"
              variant="text"
            >
              mdi-close
            </v-icon>
          </v-btn>
        </div>
        <v-divider class="mb-12 mt-4" />
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <ul id="score-form">
              <li class="d-flex mb-4">
                <div class="bullet" />
                <div
                  class="gtext-t4 font-weight-medium primary-gray-700 score-title"
                >
                  Classroom & facility quality
                </div>
                <v-rating
                  v-model="commentForm.classesQualityRate"
                  background-color="orange lighten-3"
                  color="orange"
                  half-increments
                  hover
                  size="24"
                />
              </li>
              <li class="d-flex mb-4">
                <div class="bullet" />
                <div
                  class="gtext-t4 font-weight-medium primary-gray-700 score-title"
                >
                  Teachers' expertise
                </div>
                <v-rating
                  v-model="commentForm.educationRate"
                  background-color="orange lighten-3"
                  color="orange"
                  half-increments
                  hover
                  size="24"
                />
              </li>
              <li class="d-flex mb-4">
                <div class="bullet" />
                <div
                  class="gtext-t4 font-weight-medium primary-gray-700 score-title"
                >
                  Tech accessibility
                </div>
                <v-rating
                  v-model="commentForm.itTrainingRate"
                  background-color="orange lighten-3"
                  color="orange"
                  half-increments
                  hover
                  size="24"
                />
              </li>
              <li class="d-flex mb-4">
                <div class="bullet" />
                <div
                  class="gtext-t4 font-weight-medium primary-gray-700 score-title"
                >
                  Safety & environment
                </div>
                <v-rating
                  v-model="commentForm.safetyAndHappinessRate"
                  background-color="orange lighten-3"
                  color="orange"
                  half-increments
                  hover
                  size="24"
                />
              </li>
              <li class="d-flex mb-4">
                <div class="bullet" />
                <div
                  class="gtext-t4 font-weight-medium primary-gray-700 score-title"
                >
                  Staff behavior
                </div>
                <v-rating
                  v-model="commentForm.behaviorRate"
                  background-color="orange lighten-3"
                  color="orange"
                  half-increments
                  hover
                  size="24"
                />
              </li>
              <li class="d-flex mb-4">
                <div class="bullet" />
                <div
                  class="gtext-t4 font-weight-medium primary-gray-700 score-title"
                >
                  Value for tuition
                </div>
                <v-rating
                  v-model="commentForm.tuitionRatioRate"
                  background-color="orange lighten-3"
                  color="orange"
                  half-increments
                  hover
                  size="24"
                />
              </li>
              <li class="d-flex mb-4">
                <div class="bullet" />
                <div
                  class="gtext-t4 font-weight-medium primary-gray-700 score-title"
                >
                  Facilities
                </div>
                <v-rating
                  v-model="commentForm.facilitiesRate"
                  background-color="orange lighten-3"
                  color="orange"
                  half-increments
                  hover
                  size="24"
                />
              </li>
              <li class="d-flex">
                <div class="bullet" />
                <div
                  class="gtext-t4 font-weight-medium primary-gray-700 score-title"
                >
                  Art & counseling programs
                </div>
                <v-rating
                  v-model="commentForm.artisticActivitiesRate"
                  background-color="orange lighten-3"
                  color="orange"
                  half-increments
                  hover
                  size="24"
                />
              </li>
            </ul>
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <div style="position: relative">
              <v-textarea
                v-model="commentForm.comment"
                placeholder="Type your comment"
                :rows="display.xs.value ? 10 : 14"
                variant="outlined"
              />
              <v-btn
                size="x-small"
                height="40"
                width="40"
                :loading="helpLoading"
                class="text-white"
                color="teal lighten-2"
                style="position: absolute; right: 10px; bottom: 40px"
                @click="sendToAI()"
              >
                <v-icon
                  size="x-large"
                  color="white"
                >
                  mdi-auto-fix
                </v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="justify-center pb-13">
        <v-btn
          class="primary black--text text-transform-none gtext-t4 font-weight-medium"
          rounded
          color="primary"
          width="100%"
          max-width="400"
          size="x-large"
          variant="flat"
          :disabled="!commentForm.comment"
          :loading="submitLoading"
          @click="submitComment()"
        >
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNuxtApp } from '#imports'
import { useDisplay } from 'vuetify/lib/composables/display'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  contentData: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue', 'submitted'])
const commentForm = reactive({
  comment: '',
  classesQualityRate: 4.5,
  educationRate: 4,
  itTrainingRate: 4,
  safetyAndHappinessRate: 3.5,
  behaviorRate: 4,
  tuitionRatioRate: 5,
  facilitiesRate: 4.5,
  artisticActivitiesRate: 4,
})
const dialogVisible = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})
const display = useDisplay()
const route = useRoute()
const router = useRouter()
const nuxtApp = useNuxtApp()
const helpLoading = ref(false)
const submitLoading = ref(false)

async function sendToAI() {
  const userComment = `You are an educational review assistant. Your task is to evaluate the following school and return a structured JSON response.\n\n### **School Information:**\n- **Name:** ${
    props.contentData.name
  }\n- **Location:** ${props.contentData.countryTitle}, ${
    props.contentData.stateTitle
  }, ${props.contentData.cityTitle}\n${
    props.contentData.webSite
      ? `- **Website:** ${props.contentData.webSite}`
      : ''
  }\n\n### **Evaluation Criteria:**\nRate each of the following aspects on a scale of 1 to 5 stars (as numbers) from sources like OpenStreetMap, Google Maps, and the school's official website, then provide a brief comment base on The following aspects for school (don't repeat school name and location in comment).\n1. Quality of classrooms and educational facilities\n2. Teachers' proficiency and teaching effectiveness\n3. Access to and use of computers and technology\n4. Safety and overall atmosphere of the school\n5. Behavior of school officials towards students\n6. Affordability relative to the services provided\n7. Availability of suitable sports facilities\n8. Presence of art classes or counseling programs\n\n### **Response Format:**\nReturn a structured JSON object with:\n- Category ratings as numbers (1-5) and it 8 items.\n- A short, engaging, fact-based description including emojis (min:350 char, max 400 char), Not rely solely on the ratings but should reflect the school's actual characteristics and unique features., Highlight both strengths and weaknesses of the school, providing a balanced perspective, Use emojis to make it more appealing\n\nResponse Format: (Don't forget end of rating object close by })\n\n\u0060\u0060\u0060json\n{\n  "description": "🏫 Cornerstone Preparatory School offers a great learning environment with skilled teachers and strong safety measures. However, technology access and arts programs could be improved.",\n  "ratings": {\n    "classrooms_quality": ai_rate as number,\n    "teachers_proficiency": ai_rate as number,\n    "technology_access": ai_rate as number,\n    "school_safety": ai_rate as number,\n    "officials_behavior": ai_rate as number,\n    "affordability": ai_rate as number,\n    "sports_facilities": ai_rate as number,\n    "art_counseling": ai_rate as number\n  }\n}\n\u0060\u0060\u0060\n`
  if (!localStorage.getItem('v2_token')) {
    nuxtApp.$toast?.error('Login required to proceed.')
    router.push({ query: { auth_form: 'login' } })
    return
  }
  if (!userComment) {
    nuxtApp.$toast?.error('Sorry, insufficient data')
    return
  }
  helpLoading.value = true
  try {
    const apiResponse = await $fetch('/api/chatgpt', {
      method: 'POST',
      body: { userComment },
    })
    const cleanedResponse = apiResponse.response
      .replace(/^\s*```json[\s\S]*?\n/, '')
      .replace(/```$/, '')
    const parsedResponse = JSON.parse(cleanedResponse)
    const ratings = parsedResponse.ratings
    commentForm.comment = parsedResponse.description
    commentForm.classesQualityRate = ratings.classrooms_quality
    commentForm.educationRate = ratings.teachers_proficiency
    commentForm.itTrainingRate = ratings.technology_access
    commentForm.safetyAndHappinessRate = ratings.school_safety
    commentForm.behaviorRate = ratings.officials_behavior
    commentForm.tuitionRatioRate = ratings.affordability
    commentForm.facilitiesRate = ratings.sports_facilities
    commentForm.artisticActivitiesRate = ratings.art_counseling
  }
  catch {
    nuxtApp.$toast?.error('Error: Failed to get AI response.')
  }
  finally {
    helpLoading.value = false
  }
}

async function submitComment() {
  submitLoading.value = true
  try {
    const response = await useApiService.post(
      `/api/v2/schools/${route.params.id}/comments`,
      { ...commentForm },
    )
    if (response.succeeded) {
      nuxtApp.$toast?.success('Your comment has been successfully submitted')
      emit('submitted')
      dialogVisible.value = false
    }
    else {
      nuxtApp.$toast?.error(response?.errors[0]?.message)
    }
  }
  catch (err) {
    if (err?.response?.status == 401 || err?.response?.status == 403) {
      router.push({ query: { auth_form: 'login' } })
    }
    else nuxtApp.$toast?.error('Something is wrong.')
  }
  finally {
    submitLoading.value = false
  }
}
</script>

<style scoped>
#score-form {
  padding: 0;

  .score-title {
    width: 15rem;
    margin-right: 1rem;
  }
}

.score-title {
  min-width: 22rem !important;
}
</style>
