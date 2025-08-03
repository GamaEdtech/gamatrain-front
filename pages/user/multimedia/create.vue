<template>
  <div
    id="multimedia-submit-form"
    class="mt-4"
  >
    <v-col
      cols="12"
      class="px-2 px-sm-2 px-md-0"
    >
      <v-row>
        <v-col
          cols="12"
          class="pl-5"
        >
          <span
            class="text-h4"
            style="color: #009688"
          >
            Multimedia Submission Form
          </span>
        </v-col>
      </v-row>
      <v-card
        class="mt-3"
        :elevation="3"
      >
        <v-card-text class="px-0 px-sm-8 px-md-4">
          <v-card-text>
            <v-card
              flat
              class="mt-3"
            >
              <VForm
                ref="form"
                v-model="isFormValid"
                lazy-validation
                @submit.prevent="submitContent"
              >
                <v-row class="py-3">
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-autocomplete
                      v-model="formData.section"
                      required
                      density="compact"
                      variant="outlined"
                      :items="section_list"
                      :rules="[(v) => !!v || 'This field is required']"
                      item-title="title"
                      item-value="id"
                      label="Board"
                      color="orange"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-autocomplete
                      v-model="formData.base"
                      required
                      density="compact"
                      variant="outlined"
                      :items="grade_list"
                      :rules="[(v) => !!v || 'This field is required']"
                      item-value="id"
                      item-title="title"
                      label="Grade"
                      color="orange"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-autocomplete
                      v-model="formData.lesson"
                      required
                      density="compact"
                      variant="outlined"
                      :items="lesson_list"
                      :rules="[(v) => !!v || 'This field is required']"
                      item-value="id"
                      item-title="title"
                      label="Subject"
                      color="orange"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="12"
                  >
                    <form-topic-selector
                      v-if="formData.lesson !== ''"
                      ref="topicSelectorRef"
                      :topic-list="topic_list"
                      @select-topic="selectTopic"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="12"
                  >
                    <v-text-field
                      v-model="formData.title"
                      required
                      density="compact"
                      variant="outlined"
                      :rules="[(v) => !!v || 'This field is required']"
                      label="Title"
                      color="orange"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="12"
                  >
                    <v-textarea
                      v-model="formData.description"
                      required
                      density="compact"
                      variant="outlined"
                      :rules="[
                        (v) => !!v || 'This field is required',
                        (v) =>
                          (v && v.length >= 70)
                          || 'Description must be at least 70 characters',
                      ]"
                      label="Describe"
                      hint="You must enter at least 70 characters."
                      persistent-hint
                      placeholder="Write a brief description about the files to help the user make an informed choice"
                      color="orange"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-autocomplete
                      v-model="formData.content_type"
                      required
                      density="compact"
                      variant="outlined"
                      :items="content_type_list"
                      :rules="[(v) => !!v || 'This field is required']"
                      item-value="id"
                      item-title="title"
                      label="Content type"
                      color="orange"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-file-input
                      v-model="file"
                      required
                      density="compact"
                      variant="outlined"
                      label="Multimedia file"
                      accept=".mp4,.avi,.m4a,.mpg,.flv,.docx,.pptx,.pdf,.exe,.apk,.mp3,.wave,.acc,.swf,.gif,.zip"
                      :rules="[
                        (v) => !!v || 'This field is required',
                        (v) =>
                          !v
                          || v.size < 20000000
                          || 'File size should be less than 20 MB!',
                      ]"
                      :loading="loading.file"
                      :prepend-icon="null"
                      color="orange"
                      prepend-inner-icon="mdi-play-box"
                      append-icon="mdi-folder-open"
                      @update:model-value="uploadFile($event)"
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-divider class="my-3" />
                    <p class="text-h5">
                      Content cover
                    </p>
                    <p class="text-h6">
                      What pages of the book does this content cover?
                    </p>
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-text-field
                      v-model="formData.from_page"
                      type="number"
                      min="1"
                      label="From page"
                      density="compact"
                      variant="outlined"
                      color="orange"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-text-field
                      v-model="formData.to_page"
                      type="number"
                      min="1"
                      label="To page"
                      density="compact"
                      variant="outlined"
                      color="orange"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="12"
                  >
                    <v-checkbox
                      v-model="formData.free_available"
                      density="compact"
                      label="I would like the file to be freely available to others."
                      color="orange"
                      style="font-weight: 500; font-size: 1.2rem"
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    class="pb-0"
                  >
                    <v-btn
                      type="submit"
                      :loading="loading.form"
                      :disabled="!isFormValid"
                      color="success"
                      block
                      style="
                        text-transform: none;
                        font-weight: 500;
                        font-size: 1.2rem;
                      "
                    >
                      Submit
                    </v-btn>
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-btn
                      variant="outlined"
                      color="error"
                      to="/user/multimedia"
                      block
                      style="
                        text-transform: none;
                        font-weight: 500;
                        font-size: 1.2rem;
                      "
                    >
                      Discard
                    </v-btn>
                  </v-col>
                </v-row>
              </VForm>
            </v-card>
          </v-card-text>
        </v-card-text>
      </v-card>
    </v-col>
  </div>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth'
import FormTopicSelector from '~/components/form/topic-selector.vue'

const auth = useAuth()

// Define layout and page metadata
definePageMeta({
  layout: 'dashboard-layout',
  middleware: ['auth', 'user-type'],
})

useHead({
  title: 'Multimedia submission form',
})

// Get services
const router = useRouter()
const userState = useState('user', () => ({
  lastSelectedCurriculum: '',
  lastSelectedGrade: '',
  lastSelectedSubject: '',
  lastSelectedHoldingLevel: 4,
}))
const { $toast } = useNuxtApp()

// User token
const userToken = ref('')

// Form validation
const form = ref(null)
const isFormValid = ref(false)

// Reference to the topic selector component
const topicSelectorRef = ref(null)

const _onSubmit = () => {
  submitContent()
}

const formData = reactive({
  section: '',
  base: '',
  lesson: '',
  topics: [],
  title: '',
  description: '',
  content_type: '',
  from_page: '',
  to_page: '',
  free_available: false,
  file: '',
})

const file = ref(null)
const section_list = ref([])
const grade_list = ref([])
const lesson_list = ref([])
const topic_list = ref([])
const content_type_list = ref([])

// Handle loading states
const loading = reactive({
  section: false,
  base: false,
  lesson: false,
  topic: false,
  file: false, // Upload file
  form: false, // Submit form
})

const getTypeList = async (type, parent = '') => {
  const params = { type }

  if (type === 'section') {
    loading.section = true
  }
  if (type === 'base') {
    params.section_id = parent
    loading.base = true
  }
  if (type === 'lesson') {
    params.base_id = parent
    loading.lesson = true
  }
  if (type === 'topic') {
    params.lesson_id = parent
    loading.topic = true
  }

  try {
    const response = await useApiService.get('/api/v1/types/list', params)

    if (type === 'section') {
      section_list.value = response.data
      formData.section = userState.value.lastSelectedCurriculum || ''
    }
    else if (type === 'base') {
      grade_list.value = response.data
      formData.base = userState.value.lastSelectedGrade || ''
    }
    else if (type === 'lesson') {
      lesson_list.value = response.data
      formData.lesson = userState.value.lastSelectedSubject || ''
    }
    else if (type === 'topic') {
      topic_list.value = response.data
    }
    else if (type === 'content_type') {
      content_type_list.value = response.data
    }
  }
  catch {
    $toast.error('Error loading data')
  }
  finally {
    loading.section = false
    loading.base = false
    loading.lesson = false
    loading.topic = false
  }
}

const _changeOption = (type, value) => {
  if (type === 'topic') {
    formData.topics = value
  }
}

const submitContent = async () => {
  loading.form = true

  // Prepare form data
  const formSubmitData = new FormData()
  for (const key in formData) {
    if (!(key === 'topics' || key === 'file_extra')) {
      formSubmitData.append(key, formData[key])
    }
  }

  if (
    formData.topics
    && Array.isArray(formData.topics)
    && formData.topics.length
  ) {
    for (const key in formData.topics) {
      formSubmitData.append('topics[]', formData.topics[key])
    }
  }

  // For free_available, ensure it's 1 or 0
  formSubmitData.set('free_available', formData.free_available ? 1 : 0)

  try {
    const response = await useApiService.post(
      '/api/v1/files',
      urlencodeFormData(formSubmitData),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )

    if (response.data.id === 0 && response.data.repeated) {
      $toast.info('The multimedia is duplicated')
    }
    else {
      $toast.success('Submitted successfully')
      router.push('/user/multimedia')
    }
  }
  catch {
    $toast.error('Error submitting multimedia')
  }
  finally {
    loading.form = false
  }
}

// Convert form data to URL encoded format
const urlencodeFormData = (fd) => {
  let s = ''
  for (const pair of fd.entries()) {
    if (typeof pair[1] === 'string') {
      s += (s ? '&' : '') + encode(pair[0]) + '=' + encode(pair[1])
    }
  }
  return s
}

const encode = (s) => {
  return encodeURIComponent(s).replace(/%20/g, '+')
}

const selectTopic = (event) => {
  formData.topics = event
}

const uploadFile = async (value) => {
  if (!value) return

  loading.file = true

  const fileFormData = new FormData()
  fileFormData.append('file', value)

  try {
    const response = await useApiService.post('/api/v1/upload', fileFormData)

    formData.file = response.data[0].file.name
    $toast.success('File uploaded successfully')
  }
  catch {
    $toast.error('An error occurred during file upload')
  }
  finally {
    loading.file = false
  }
}

// Set up watchers
watch(
  () => formData.section,
  (val) => {
    userState.value.lastSelectedCurriculum = val
    formData.base = ''
    formData.lesson = ''
    formData.topics = []
    grade_list.value = []
    lesson_list.value = []
    topic_list.value = []

    if (val) {
      getTypeList('base', val)
    }
  },
)

watch(
  () => formData.base,
  (val) => {
    userState.value.lastSelectedGrade = val
    formData.lesson = ''
    formData.topics = []
    lesson_list.value = []
    topic_list.value = []

    if (val) {
      getTypeList('lesson', val)
    }
  },
)

watch(
  () => formData.lesson,
  (val) => {
    userState.value.lastSelectedSubject = val
    formData.topics = []
    topic_list.value = []

    if (val) {
      getTypeList('topic', val)
      if (topicSelectorRef.value) {
        topicSelectorRef.value.lesson_selected = true
      }
    }
    else {
      if (topicSelectorRef.value) {
        topicSelectorRef.value.lesson_selected = false
      }
    }
  },
)

// Initialize on mount
onMounted(() => {
  userToken.value = auth.getUserToken()
  getTypeList('section')
  getTypeList('content_type')
})
</script>

<style>
#multimedia-submit-form .text-h4 {
  line-height: 4rem;
}

.submission-notice {
  line-height: 2rem;
  background-color: #ffefe5 !important;
}

.submission-notice .v-alert__icon.v-icon {
  color: white !important;
  padding: 2rem;
  border-radius: 0.5rem;
  background-color: #ff6600;
}

.notice_item {
  font-size: 1.4rem;
  line-height: 2.2rem;
  list-style-type: none;
  color: black;
  padding-left: 0 !important;
}

.notice_item li {
  margin-bottom: 1rem;
}

.notice_item li:before {
  font-family: "Font Awesome 5 Free";
  font-size: 2rem;
  color: #ffc700ff;
  content: "\f0a4";
  font-weight: 900;
}

.v-selection-control .v-label {
  font-weight: 300;
  font-size: 1.4rem;
  color: rgba(0, 0, 0, 0.6);
}
</style>
