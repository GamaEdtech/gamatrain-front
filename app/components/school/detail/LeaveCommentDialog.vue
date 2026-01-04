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
                icon
                color="primary"
                :loading="helpLoading"
                style="position: absolute; right: 10px; bottom: 40px"
                @click="sendToAI()"
              >
                <v-icon
                  size="x-large"
                  color="white"
                >
                  md:wand_stars
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
const submitLoading = ref(false)

const { loading: helpLoading, getDescriptionFromAi } = useCommentAssistant()

async function sendToAI() {
  try {
    const schoolAiData = {
      name: props.contentData.name,
      countryTitle: props.contentData.countryTitle,
      stateTitle: props.contentData.stateTitle,
      cityTitle: props.contentData.cityTitle,
      webSite: props.contentData.webSite ? props.contentData.webSite : '',
      latitude: props.contentData.latitude,
      longitude: props.contentData.longitude,
    }
    const result = await getDescriptionFromAi(schoolAiData)
    if (result) {
      const ratings = result.ratings
      commentForm.comment = result.description
      commentForm.classesQualityRate = ratings.classrooms_quality
      commentForm.educationRate = ratings.teachers_proficiency
      commentForm.itTrainingRate = ratings.technology_access
      commentForm.safetyAndHappinessRate = ratings.school_safety
      commentForm.behaviorRate = ratings.officials_behavior
      commentForm.tuitionRatioRate = ratings.affordability
      commentForm.facilitiesRate = ratings.sports_facilities
      commentForm.artisticActivitiesRate = ratings.art_counseling
    }
  }
  catch (err) {
    console.error('AI Error:', err)
  }
}
const { getToken, initCaptcha, isLoaded } = useRecaptcha()
initCaptcha()

async function submitComment() {
  submitLoading.value = true
  try {
    if (!isLoaded()) {
      throw new Error('reCAPTCHA not loaded yet. Please try again.')
    }

    const captcha = await getToken('submit')

    const response = await useApiService.post(
      `/api/v2/schools/${route.params.id}/comments`,
      { ...commentForm, captcha },
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
