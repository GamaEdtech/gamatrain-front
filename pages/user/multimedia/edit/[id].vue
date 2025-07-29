<template>
  <div
    id="multimedia-edit-form"
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
            Multimedia Edit Form
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
                @submit.prevent="updateContent"
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
                    v-if="topic_list.length"
                    cols="12"
                    md="12"
                  >
                    <form-topic-selector
                      v-if="formData.lesson !== ''"
                      ref="topicSelectorRef"
                      :topic-list="topic_list"
                      :selected-topics="formData.topics"
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
                      density="compact"
                      variant="outlined"
                      label="Multimedia file"
                      accept=".mp4,.avi,.m4a,.mpg,.flv,.docx,.pptx,.pdf,.exe,.apk,.mp3,.wave,.acc,.swf,.gif,.zip"
                      :rules="[
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
                      persistent-hint
                      @update:model-value="uploadFile($event)"
                    >
                      <template #append>
                        <v-btn
                          v-if="multimediaData.files.exist"
                          icon
                          size="small"
                          variant="plain"
                          title="Download file"
                          :loading="download_loading"
                          @click="startDownload('multimedia')"
                        >
                          <v-icon
                            size="18"
                            style="margin-left: 0.5rem"
                          >
                            mdi-download
                          </v-icon>
                        </v-btn>
                      </template>
                    </v-file-input>
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
                    md="6"
                    class="pb-0"
                  >
                    <v-btn
                      type="submit"
                      :loading="loading.form"
                      :disabled="!isFormValid"
                      color="success"
                      block
                      style="font-size: 1.2rem; text-transform: none"
                    >
                      Update
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
                      style="font-size: 1.2rem; text-transform: none"
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
  title: 'Edit Multimedia',
})

// Get services
const route = useRoute()
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

// Loading flag to prevent watchers from firing during initial load
const isInitialLoad = ref(true)

// Form validation
const form = ref(null)
const isFormValid = ref(false)

// Multimedia data
const multimediaData = reactive({
  id: route.params.id || null,
  files: {
    exist: false,
    url: null,
  },
})

// Check if we're in edit mode
const isEditMode = computed(() => !!multimediaData.id)

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
  multimedia: false, // Loading multimedia data
  section: false,
  base: false,
  lesson: false,
  topic: false,
  file: false, // Upload file
  form: false, // Submit form
})

// Reference to topic selector component
const topicSelectorRef = ref(null)

// Fetch multimedia data
const fetchMultimediaData = async () => {
  if (!multimediaData.id) return

  loading.multimedia = true
  // Ensure initial load flag is set during the whole loading process
  isInitialLoad.value = true

  try {
    const response = await useApiService.get(
      `/api/v1/files/${multimediaData.id}`,
    )

    // Set multimedia data
    const data = response.data

    // First load all dropdowns sequentially
    if (data.section) {
      await getTypeList('base', data.section)
    }

    if (data.base) {
      await getTypeList('lesson', data.base)
    }

    if (data.lesson) {
      await getTypeList('topic', data.lesson)
    }

    // Process topics data based on its format
    let topicsData = []

    if (data.topics) {
      // If topics is already an array, use it directly
      if (Array.isArray(data.topics)) {
        topicsData = data.topics
      }
      // If topics is a string (possibly comma or plus separated), convert to array
      else if (typeof data.topics === 'string') {
        // Try different separators, checking for + first as it's used in the old version
        if (data.topics.includes('+')) {
          topicsData = data.topics.split('+')
        }
        else if (data.topics.includes(',')) {
          topicsData = data.topics.split(',')
        }
        else {
          // Single value case
          topicsData = [data.topics]
        }
      }
      else if (
        typeof data.topics === 'object'
        && !Array.isArray(data.topics)
      ) {
        // Handle case where topics might be an object with keys
        topicsData = Object.values(data.topics).filter(t => t)
      }
    }
    else if (data.topic) {
      // Backward compatibility with old API that uses 'topic' instead of 'topics'
      if (typeof data.topic === 'string') {
        if (data.topic.includes('+')) {
          topicsData = data.topic.split('+')
        }
        else if (data.topic.includes(',')) {
          topicsData = data.topic.split(',')
        }
        else {
          topicsData = [data.topic]
        }
      }
      else if (Array.isArray(data.topic)) {
        topicsData = data.topic
      }
    }

    // Clean up topic IDs and ensure they're strings (if they're numeric values)
    topicsData = topicsData
      .map(t => (typeof t === 'object' ? t.id : t.toString().trim()))
      .filter(t => t)
    // Now set all form values at once
    formData.section = data.section
    formData.base = data.base
    formData.lesson = data.lesson
    formData.topics = topicsData
    formData.title = data.title
    formData.description = data.description
    formData.content_type = data.content_type
    formData.from_page = data.from_page
    formData.to_page = data.to_page
    formData.free_available = !!data.free_available

    // Handle file information - API returns it in a 'files' object
    // Check if files object exists and has exist property set to true
    const hasFile = data.files && data.files.exist === true

    // Store file information
    formData.file = hasFile ? data.files.name || data.title : ''

    // Set files information for download button
    multimediaData.files = {
      exist: hasFile,
      url: hasFile ? `/api/v1/files/download/${multimediaData.id}` : null,
      size: hasFile ? data.files.size : null,
      ext: hasFile ? data.files.ext : null,
    }
  }
  catch (err) {
    $toast.error(err.message || 'Error loading multimedia data')
    router.push('/user/multimedia')
  }
  finally {
    loading.multimedia = false
    // Reset the initial load flag when we're done
    setTimeout(() => {
      isInitialLoad.value = false
    }, 100) // Small delay to ensure Vue has finished processing all reactivity
  }
}

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
    }
    else if (type === 'base') {
      grade_list.value = response.data
    }
    else if (type === 'lesson') {
      lesson_list.value = response.data
    }
    else if (type === 'topic') {
      topic_list.value = response.data

      // If we have topics data and the topic selector exists, set lesson_selected
      if (topic_list.value.length > 0 && topicSelectorRef.value) {
        topicSelectorRef.value.lesson_selected = true

        // If we have saved topics, set them after a short delay to ensure component is mounted
        if (formData.topics && formData.topics.length > 0) {
          setTimeout(() => {
            if (topicSelectorRef.value) {
              topicSelectorRef.value.topic = [...formData.topics]
            }
          }, 100)
        }
      }
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
  // Skip if we're in initial load
  if (isInitialLoad.value) return

  if (type === 'topic') {
    formData.topics = Array.isArray(value) ? value : [value]
  }
}

const updateContent = async () => {
  loading.form = true

  // Prepare form data
  const formSubmitData = new FormData()
  for (const key in formData) {
    if (!(key === 'topics' || key === 'file_extra')) {
      formSubmitData.append(key, formData[key])
    }
  }

  // Handle topics array
  if (formData.topics && Array.isArray(formData.topics)) {
    if (formData.topics.length > 0) {
      formData.topics.forEach((topic) => {
        formSubmitData.append('topics[]', topic)
      })
    }
    else {
      // Ensure we send an empty topics array to clear existing topics
      formSubmitData.append('topics[]', '')
    }
  }

  // For free_available, ensure it's 1 or 0
  formSubmitData.set('free_available', formData.free_available ? 1 : 0)

  try {
    const response = await useApiService.put(
      `/api/v1/files/${multimediaData.id}`,
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
      $toast.success('Updated successfully')
      router.push('/user/multimedia')
    }
  }
  catch {
    $toast.error('Error updating multimedia')
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

    // Get file information from the upload response
    const fileInfo = response.data[0].file
    formData.file = fileInfo.name

    // Update files object for download button
    multimediaData.files = {
      exist: true,
      url: multimediaData.id
        ? `/api/v1/files/download/${multimediaData.id}`
        : `/api/v1/download/${fileInfo.name}`,
      size: fileInfo.size || null,
      ext: fileInfo.ext || null,
    }

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
    // Skip watchers during initial load
    if (isInitialLoad.value) return

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
    // Skip watchers during initial load
    if (isInitialLoad.value) return

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
    // Skip watchers during initial load
    if (isInitialLoad.value) return

    userState.value.lastSelectedSubject = val

    // Only clear topics if we're not in edit mode or if we've explicitly changed the lesson
    // This prevents losing topics when editing an existing record
    if (!isEditMode.value || val === '') {
      formData.topics = []
    }

    // Always clear topic list when lesson changes to force reload
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

watch(
  () => formData.topics,
  (val) => {
    // Ensure topic selector gets updated with current topics
    if (topicSelectorRef.value && val && val.length > 0) {
      topicSelectorRef.value.topic = val
    }
  },
)

const download_loading = ref(false)

const startDownload = async () => {
  download_loading.value = true
  try {
    const response = await useApiService.get(
      `/api/v1/files/download/${route.params.id}`,
    )
    const FileSaver = await import('file-saver')
    FileSaver.saveAs(response.data.url, response.data.name)
  }
  catch {
    $toast.error('Error downloading file')
  }
  finally {
    download_loading.value = false
  }
}

// Initialize on mount
onMounted(async () => {
  // Set initial load flag
  isInitialLoad.value = true

  userToken.value = auth.getUserToken()

  // Load initial dropdown data
  await getTypeList('section')
  await getTypeList('content_type')

  // Fetch multimedia data if in edit mode
  if (isEditMode.value) {
    await fetchMultimediaData()
  }
  else {
    // If not in edit mode, we can turn off the initial load flag
    isInitialLoad.value = false
  }
})
</script>

<style>
#multimedia-edit-form .text-h4 {
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
</style>
