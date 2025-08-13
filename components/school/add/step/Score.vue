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
          @click="getDescriptionFromAi()"
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
const nuxtApp = useNuxtApp()

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
const loadingHelpAi = ref(false)

const getDescriptionFromAi = async () => {
  const userComment = `You are an educational review assistant. Your task is to evaluate the following school and return a structured JSON response.

### **School Information:**
- **Name:** ${props.schoolAiData.name}
- **Location:** ${props.schoolAiData.countryTitle}, ${
  props.schoolAiData.stateTitle
}, ${props.schoolAiData.cityTitle}
${
  props.schoolAiData.webSite
    ? `- **Website:** ${props.schoolAiData.webSite}`
    : ''
}

### **Evaluation Criteria:**
Rate each of the following aspects on a scale of 1 to 5 stars (as numbers) using insights from sources like OpenStreetMap, Google Maps, and the school's official website. Then write a short, bold, and slightly provocative comment about the school.

1. Quality of classrooms and educational facilities  
2. Teachers' proficiency and teaching effectiveness  
3. Access to and use of computers and technology  
4. Safety and overall atmosphere of the school  
5. Behavior of school officials towards students  
6. Affordability relative to the services provided  
7. Availability of suitable sports facilities  
8. Presence of art classes or counseling programs  

### **Comment Rules:**
- Write the **comment in the primary language used in** \`${
  props.schoolAiData.countryTitle
}\`. For example, use Persian for Iran, Italian for Italy, and French for France. **Do not use the user's IP address, browser language, or environment to determine the language.**
- Mention at least **one clear strength and one clear weakness** of the school.
- Use a **natural, human tone** with a **touch of challenge or controversy** to encourage discussion (e.g., “some parents might disagree…” or “not everyone would be happy with…”).
- Keep the comment **short, engaging, and between 350 and 400 characters**.
- The comment should **not repeat the school name or location**.
- If it's a **kindergarten**, write like a thoughtful parent.  
  If it's an **educational group**, use inclusive and general language.
- Always **end the comment with at least one emoji** to feel more personal and real.

### **Response Format (JSON):**
Return a structured JSON object like this, with exactly 8 rating fields (1 to 5) and the comment:

\`\`\`json
{
  "description": "🏫 Cornerstone Preparatory School offers a great learning environment with skilled teachers and strong safety measures. However, technology access and arts programs could be improved.",
  "ratings": {
    "classrooms_quality": 4,
    "teachers_proficiency": 5,
    "technology_access": 2,
    "school_safety": 4,
    "officials_behavior": 3,
    "affordability": 4,
    "sports_facilities": 3,
    "art_counseling": 2
  }
}
\`\`\`
`

  if (!localStorage.getItem('v2_token')) {
    nuxtApp.$toast?.error('Login required to proceed.')
    router.push({ query: { auth_form: 'login' } })
    return
  }
  if (!userComment) {
    nuxtApp.$toast?.error('Sorry, insufficient data')
    return
  }
  loadingHelpAi.value = true
  try {
    const apiResponse = await useApiService.post('/api/chatgpt', {
      userComment,
    })
    const cleanedResponse = apiResponse.response
      .replace(/^\s*```json[\s\S]*?\n/, '')
      .replace(/```$/, '')
    const parsedResponse = JSON.parse(cleanedResponse)
    comment.value = parsedResponse.description
  }
  catch {
    nuxtApp.$toast?.error('Error: Failed to get AI response.')
  }
  finally {
    loadingHelpAi.value = false
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
