<template>
  <div
    class="w-100 d-flex align-center justify-start flex-column margin-top-handle"
  >
    <school-add-stepper
      :steps="steps"
      :step-index="currentStep"
      @change-step="changeStep"
    />
    <school-add-modal-detail
      v-model:show-dialog="showModalDetailSchool"
      :school-information="schoolFindedInSearch"
      @new-school="startAddNewSchool"
    />
    <v-container class="w-100 mt-2 d-flex justify-center handle-height">
      <div
        v-show="currentStep == STEP_INDEX.Location"
        class="display-set"
      >
        <school-add-step-location
          @next-step="nextStep"
          @school-find-in-search="schoolFindInSearch"
        />
      </div>
      <!-- <div
        v-show="currentStep == STEP_INDEX.Category"
        class="display-set"
      >
        <school-add-step-category
          @next-step="nextStep"
          @prev-step="backStep"
        />
      </div> -->
      <div
        v-show="currentStep == STEP_INDEX.Contact"
        class="display-set"
      >
        <school-add-step-contact
          :school-information="schoolInformation"
          @next-step="nextStep"
          @prev-step="backStep"
        />
      </div>
      <div
        v-show="currentStep == STEP_INDEX.Facilities"
        class="display-set"
      >
        <school-add-step-facility
          @next-step="nextStep"
          @prev-step="backStep"
        />
      </div>
      <div
        v-show="currentStep == STEP_INDEX.Score"
        class="display-set"
      >
        <school-add-step-score
          :loading="loadingSubmitSchool"
          :school-ai-data="schoolAiData"
          @next-step="submitSchool"
          @prev-step="backStep"
        />
      </div>
    </v-container>
  </div>
</template>

<script setup>
const nuxtApp = useNuxtApp()
const router = useRouter()
const { getToken, initCaptcha, isLoaded } = useRecaptcha()

useHead({
  title: 'Add School',

  meta: [
    {
      hid: 'apple-mobile-web-app-title',
      name: 'apple-mobile-web-app-title',
      content: 'Add School',
    },
    {
      hid: 'og:title',
      name: 'og:title',
      content: 'Add School',
    },
    {
      hid: 'og:site_name',
      name: 'og:site_name',
      content: 'GamaTrain',
    },
    {
      hid: 'description',
      name: 'description',
      content:
        'Explore tailored K12 schools effortlessly with GamaTrain\'s School Finder. Find the perfect school for your unique needs and set the course for academic success.',
    },
    {
      hid: 'og:description',
      name: 'og:description',
      content:
        'Explore tailored K12 schools effortlessly with GamaTrain\'s School Finder. Find the perfect school for your unique needs and set the course for academic success.',
    },
  ],
})

const schoolFindedInSearch = ref()
const showModalDetailSchool = ref(false)
const loadingSubmitSchool = ref(false)
const schoolInformation = ref({
  name: '',
  latitude: 0,
  longitude: 0,
  stateId: null,
  cityId: null,
  countryId: null,
  address: '',
  webSite: '',
  email: '',
  phoneNumber: '',
  tags: [],
  tuition: 0,
  localName: '',
  zipCode: '',
  localAddress: '',
  faxNumber: '',
  description: '',
  file: null,
  comment: {
    comment: '',
    classesQualityRate: 0,
    educationRate: 0,
    iTTrainingRate: 0,
    safetyAndHappinessRate: 0,
    behaviorRate: 0,
    tuitionRatioRate: 0,
    facilitiesRate: 0,
    artisticActivitiesRate: 0,
  },
})
const schoolAiData = ref({
  name: '',
  countryTitle: '',
  stateTitle: '',
  cityTitle: '',
  webSite: '',
  latitude: null,
  longitude: null,
})

// start section step
const STEP_INDEX = {
  Location: 0,
  // Category: 1,
  Contact: 1,
  Facilities: 2,
  Score: 3,
}
const steps = [
  {
    title: 'Location',
    value: 0,
    icon: 'md:location_on',
  },
  // {
  //   title: 'Category',
  //   value: 1,
  //   icon: 'md:category',
  // },
  {
    title: 'Contact',
    value: 1,
    icon: 'md:call',
  },
  {
    title: 'Facilities',
    value: 2,
    icon: 'md:playlist_add_check',
  },
  {
    title: 'Score',
    value: 3,
    icon: 'md:star',
  },
]
const currentStep = ref(STEP_INDEX.Location)

const changeStep = () => {
  // easy Change Step for developement
  // currentStep.value = step.value;
}
// end section step

const schoolFindInSearch = (school, data, aiInfo = null) => {
  schoolInformation.value = {
    ...schoolInformation.value,
    ...data,
  }
  schoolFindedInSearch.value = school
  showModalDetailSchool.value = true
  if (aiInfo) {
    schoolAiData.value = {
      ...schoolAiData.value,
      ...aiInfo,
    }
  }
}

const startAddNewSchool = () => {
  showModalDetailSchool.value = false
  // currentStep.value = STEP_INDEX.Category;
  currentStep.value = STEP_INDEX.Contact
}

const nextStep = (data, aiInfo = null) => {
  schoolInformation.value = {
    ...schoolInformation.value,
    ...data,
  }
  currentStep.value += 1
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
  if (aiInfo) {
    schoolAiData.value = {
      ...schoolAiData.value,
      ...aiInfo,
    }
  }
}
const backStep = () => {
  currentStep.value -= 1
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
const submitSchool = async (data) => {
  loadingSubmitSchool.value = true
  if (!isLoaded()) {
    loadingSubmitSchool.value = false
    throw new Error('reCAPTCHA not loaded yet. Please try again.')
  }

  const token = await getToken('submit')

  schoolInformation.value = {
    ...schoolInformation.value,
    ...data,
  }
  schoolInformation.value['Comment.Captcha'] = token
  const formData = buildFormDataFromObject(schoolInformation.value)
  useApiService
    .post(`/api/v2/schools/contributions`, formData)
    .then(async (response) => {
      if (response.succeeded) {
        nuxtApp.$toast?.success(
          'Thank you! Your contribution has been successfully submitted.',
        )
        router.push('/school')
      }
      else {
        nuxtApp.$toast?.error(response?.errors[0]?.message)
      }
    })
    .catch((err) => {
      console.log('err', err)

      nuxtApp.$toast?.error(err?.response?.data?.message)
    })
    .finally(() => {
      loadingSubmitSchool.value = false
    })
}

const buildFormDataFromObject = (
  obj,
  form = new FormData(),
  parentKey = '',
) => {
  for (const key in obj) {
    if (obj[key] === null || obj[key] === undefined) continue

    const formattedKey = key.charAt(0).toUpperCase() + key.slice(1)
    const formKey = parentKey ? `${parentKey}.${formattedKey}` : formattedKey

    const value = obj[key]

    if (value instanceof File || value instanceof Blob) {
      form.append(formKey, value)
    }
    else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        form.append(`${formKey}[${index}]`, item)
      })
    }
    else if (typeof value === 'object') {
      buildFormDataFromObject(value, form, formKey)
    }
    else {
      form.append(formKey, value)
    }
  }

  return form
}

onMounted(() => {
  initCaptcha()
})
</script>

<style scoped>
.margin-top-handle {
  margin-top: 64px;
  min-height: calc(100vh - 64px);
  background-color: #f8f7f7;
}
.handle-height {
  min-height: calc(100vh - 64px - 90px);
}
.display-set {
  display: flex;
  justify-content: center;
  width: 100%;
}
@media (min-width: 960px) {
  .margin-top-handle {
    margin-top: 6.4rem;
    min-height: calc(100vh - 6.4rem);
  }
  .handle-height {
    min-height: calc(100vh - 6.4rem - 90px);
  }
}
</style>
