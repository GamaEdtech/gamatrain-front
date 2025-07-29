<template>
  <div
    cols="12"
    class="px-2 px-sm-2 mt-8"
  >
    <v-row>
      <v-col
        cols="12"
        class="pl-5"
      >
        <span class="text-h4 text-teal">Past Papers Submission Form </span>
      </v-col>
    </v-row>
    <v-card class="mt-3">
      <v-card-text class="py-10 px-8">
        <VForm
          ref="form"
          v-model="isFormValid"
          lazy-validation
          autocomplete="off"
          @submit.prevent="onSubmit"
        >
          <v-row>
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
                :rules="[(v) => !!v || 'Board is required']"
                item-title="title"
                item-value="id"
                label="Board"
                color="#FFB300"
                autocomplete="off"
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
                :rules="[(v) => !!v || 'Grade is required']"
                item-value="id"
                item-title="title"
                label="Grade"
                color="#FFB300"
                autocomplete="off"
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
                :rules="[(v) => !!v || 'Subject is required']"
                item-value="id"
                item-title="title"
                label="Subject"
                color="#FFB300"
                autocomplete="off"
              />
            </v-col>
            <v-col
              cols="12"
              md="12"
            >
              <form-topic-selector
                v-if="topic_list.length > 0"
                ref="topicSelectorRef"
                :topic-list="topic_list"
                @select-topic="selectTopic"
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-autocomplete
                v-model="formData.test_type"
                density="compact"
                variant="outlined"
                :items="test_type_list"
                :loading="test_type_loading"
                :disabled="!formData.section || test_type_loading"
                item-value="id"
                item-title="title"
                label="Classification"
                placeholder="Select a board first"
                color="#FFB300"
                autocomplete="off"
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-autocomplete
                v-model="formData.answer_type"
                required
                density="compact"
                variant="outlined"
                :items="answer_status_list"
                :rules="[
                  (v) =>
                    (v !== null && v !== undefined && v !== '')
                    || v === 0
                    || 'Answer status is required',
                ]"
                item-value="id"
                item-title="title"
                label="Solution Availability"
                color="#FFB300"
                autocomplete="off"
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-autocomplete
                v-model="formData.level"
                density="compact"
                variant="outlined"
                :items="test_level_list"
                item-value="id"
                item-title="title"
                label="Difficulty Level"
                color="#FFB300"
                autocomplete="off"
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-autocomplete
                v-model="formData.edu_year"
                required
                density="compact"
                variant="outlined"
                :items="year_list"
                :rules="[(v) => !!v || 'Year is required']"
                label="Year"
                color="#FFB300"
                autocomplete="off"
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-autocomplete
                v-model="formData.edu_month"
                required
                density="compact"
                variant="outlined"
                :items="month_list"
                :rules="[(v) => !!v || 'Month is required']"
                item-title="title"
                item-value="id"
                label="Month"
                color="#FFB300"
                autocomplete="off"
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-autocomplete
                v-model="formData.holding_level"
                density="compact"
                variant="outlined"
                :items="holding_level_list"
                item-title="title"
                item-value="id"
                label="Testing Scope"
                color="#FFB300"
                autocomplete="off"
              />
            </v-col>

            <v-col
              v-if="formData.holding_level < 4"
              cols="12"
              md="4"
            >
              <v-autocomplete
                v-model="formData.state"
                density="compact"
                variant="outlined"
                :items="state_list"
                item-title="title"
                item-value="id"
                label="State"
                color="#FFB300"
                autocomplete="off"
              />
            </v-col>
            <v-col
              v-if="formData.holding_level < 3"
              cols="12"
              md="4"
            >
              <v-autocomplete
                v-model="formData.area"
                density="compact"
                variant="outlined"
                :items="area_list"
                item-title="title"
                item-value="id"
                label="Area"
                color="#FFB300"
                autocomplete="off"
              />
            </v-col>
            <v-col
              v-if="formData.holding_level < 2"
              cols="12"
              md="4"
            >
              <v-autocomplete
                v-model="formData.school"
                density="compact"
                variant="outlined"
                :items="school_list"
                item-title="title"
                item-value="id"
                label="School"
                color="#FFB300"
                autocomplete="off"
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
                :rules="[(v) => !!v || 'Title is required']"
                label="Title"
                color="#FFB300"
                autocomplete="off"
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
                  (v) => !!v || 'Description is required',
                  (v) =>
                    (v && v.length >= 70)
                    || 'Description must be at least 70 characters',
                ]"
                label="Content outline"
                hint="You must enter at least 70 characters."
                persistent-hint
                placeholder="A brief overview of the content, outlining sections, topics, and question formats."
                color="#FFB300"
                autocomplete="off"
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-file-input
                v-model="file_pdf"
                required
                density="compact"
                variant="outlined"
                :rules="[(v) => !!v || 'PDF file is required']"
                :prepend-icon="null"
                accept="application/pdf"
                label="Pdf Question"
                color="red"
                :loading="file_pdf_loading"
                prepend-inner-icon="mdi-file-pdf-box"
                append-icon="mdi-folder-open"
                autocomplete="off"
                @change="uploadFile('file_pdf', $event)"
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-file-input
                v-model="file_answer"
                density="compact"
                variant="outlined"
                label="PDF Solution"
                :prepend-icon="null"
                accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                :loading="file_answer_loading"
                color="default"
                prepend-inner-icon="mdi-file"
                append-icon="mdi-folder-open"
                @change="uploadFile('file_answer', $event)"
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-file-input
                v-model="file_word"
                density="compact"
                variant="outlined"
                label="Word Q & S"
                :prepend-icon="null"
                accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                :loading="file_word_loading"
                color="blue"
                prepend-inner-icon="mdi-file-word-outline"
                append-icon="mdi-folder-open"
                @change="uploadFile('file_word', $event)"
              />
            </v-col>

            <v-col
              v-if="extraAttr.length"
              cols="12"
            >
              <v-row
                v-for="(item, index) in extraAttr"
                :key="index"
              >
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-autocomplete
                    v-model="item.type"
                    :items="extra_type_list"
                    variant="outlined"
                    density="compact"
                    item-title="title"
                    item-value="id"
                    label="Select file type"
                    color="#FFB300"
                    autocomplete="off"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-file-input
                    v-model="item.file_extra"
                    density="compact"
                    variant="outlined"
                    label="Select file"
                    :prepend-icon="null"
                    :loading="file_extra_loading"
                    color="green"
                    prepend-inner-icon="mdi-plus"
                    append-icon="mdi-folder-open"
                    @change="(event) => uploadFile('file_extra', event, index)"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-btn
                variant="outlined"
                color="success"
                @click="addExtraAttr"
              >
                <v-icon> mdi-plus </v-icon>
                Add Solution video
              </v-btn>
            </v-col>
            <!-- <v-col cols="12" md="12">
              <v-checkbox
                density="compact"
                v-model="formData.free_agreement"
                label="I would like the file to be freely available to others."
              />
            </v-col> -->

            <v-col
              cols="12"
              md="6"
              class="pb-0"
            >
              <v-btn
                color="success"
                type="submit"
                block
                :loading="loading.form"
                :disabled="!isFormValid"
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
                to="/user/paper"
                block
              >
                Discard
              </v-btn>
            </v-col>
          </v-row>
        </VForm>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard-layout',
  middleware: ['auth', 'user-type'],
})

useHead({
  title: 'Add paper',
})

// Get services
const router = useRouter()
const userState = useState('user', () => ({
  lastSelectedCurriculum: '',
  lastSelectedGrade: '',
  lastSelectedSubject: '',
  lastSelectedHoldingLevel: 4,
}))
const { $toast, $auth } = useNuxtApp()

// Form validation
const form = ref(null)
const isFormValid = ref(false)

const onSubmit = () => {
  submitQuestion()
}

const topicSelectorRef = ref(null)

const formData = reactive({
  section: '',
  base: '',
  lesson: '',
  topics: [],
  test_type: '',
  answer_type: 0,
  level: 2,
  year: '',
  month: '',
  holding_level: userState.value.lastSelectedHoldingLevel
    ? userState.value.lastSelectedHoldingLevel
    : 4,
  state: '',
  area: '',
  school: '',
  file_pdf: '',
  file_word: '',
  file_answer: '',
  // free_agreement: false,
  edu_year: '',
  edu_month: '',
})

const file_pdf = ref(null)
const file_word = ref(null)
const file_answer = ref(null)

const file_pdf_loading = ref(false)
const file_word_loading = ref(false)
const file_answer_loading = ref(false)
const file_extra_loading = ref(false)
const test_type_loading = ref(false)

const section_list = ref([])
const grade_list = ref([])
const _field_list = ref([])
const lesson_list = ref([])
const topic_list = ref([])
const test_type_list = ref([])
const answer_status_list = [
  { id: 0, title: 'No Solution' },
  { id: 1, title: 'Answer Key' },
  { id: 2, title: 'Complete Solution' },
]
const test_level_list = [
  { id: 1, title: 'Easy' },
  { id: 2, title: 'Moderate' },
  { id: 3, title: 'Hard' },
]
const year_list = [
  2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013,
]
const month_list = [
  { id: 1, title: 'January' },
  { id: 2, title: 'February' },
  { id: 3, title: 'March' },
  { id: 4, title: 'April' },
  { id: 5, title: 'May' },
  { id: 6, title: 'June' },
  { id: 7, title: 'July' },
  { id: 8, title: 'August' },
  { id: 9, title: 'September' },
  { id: 10, title: 'October' },
  { id: 11, title: 'November' },
  { id: 12, title: 'December' },
]
const holding_level_list = [
  // { id: 1, title: "School" },
  // { id: 2, title: "District" },
  // { id: 3, title: "State" },
  // { id: 4, title: "Country" },
  { id: 4, title: 'National' },
  { id: 5, title: 'International' },
]
const state_list = ref([])
const area_list = ref([])
const school_list = ref([])
const extraAttr = ref([])
const extra_type_list = ref([])

const loading = reactive({
  form: false,
})

const getTypeList = async (type, parent = '') => {
  const params = { type }

  if (type === 'base') params.section_id = parent
  if (type === 'lesson') params.base_id = parent
  if (type === 'topic') params.lesson_id = parent
  if (type === 'area') params.state_id = parent

  if (type === 'school') {
    params.section_id = formData.section
    params.area_id = formData.area
  }

  try {
    const response = await useApiService.get('/api/v1/types/list', params)

    if (type === 'section') {
      section_list.value = response.data
      formData.section = userState.value.lastSelectedCurriculum
        ? userState.value.lastSelectedCurriculum
        : ''
    }
    else if (type === 'base') {
      grade_list.value = response.data
      formData.base = userState.value.lastSelectedGrade
        ? userState.value.lastSelectedGrade
        : ''
    }
    else if (type === 'lesson') {
      lesson_list.value = response.data
      formData.lesson = userState.value.lastSelectedSubject
        ? userState.value.lastSelectedSubject
        : ''
    }
    else if (type === 'topic') {
      topic_list.value = response.data
    }
    else if (type === 'test_type') {
      test_type_list.value = response.data
    }
    else if (type === 'state') {
      state_list.value = response.data
    }
    else if (type === 'area') {
      area_list.value = response.data
    }
    else if (type === 'school') {
      school_list.value = response.data
    }
  }
  catch (err) {
    $toast.error(err)
  }
}

const handleClassificationError = (error) => {
  console.error('Classification loading error:', error)
  $toast.error('Unable to load paper types. Please try selecting the board again.')
  test_type_list.value = []
  formData.test_type = ''
}

const getClassificationTypes = async (sectionId) => {
  if (!sectionId) {
    test_type_list.value = []
    return
  }

  test_type_loading.value = true
  try {
    const params = {
      type: 'test_type',
      section_id: sectionId,
    }
    const response = await useApiService.get('/api/v1/types/list', params)

    // The API should return board-specific classifications including:
    // - General resources (Coursebook, Workbook) for all boards
    // - CIE papers (Paper 1, Paper 2, etc.) for CIE board
    // - Edexcel papers and Units for Edexcel board
    // - Other board-specific classifications
    test_type_list.value = response.data || []

    // Handle empty response
    if (!response.data || response.data.length === 0) {
      console.warn('No classification types returned for board:', sectionId)
    }
  }
  catch (err) {
    handleClassificationError(err)
  }
  finally {
    test_type_loading.value = false
  }
}

const getExtraFileType = async () => {
  try {
    const response = await useApiService.get('/api/v1/types/list', {
      type: 'test_extra_file',
    })
    extra_type_list.value = response.data
  }
  catch (error) {
    console.error(error)
  }
}

const submitQuestion = async () => {
  loading.form = true
  const formSubmitData = new FormData()
  for (const key in formData) {
    if (!(key == 'topics' || key == 'file_extra'))
      formSubmitData.append(key, formData[key])
  }

  if (
    formData.topics
    && Array.isArray(formData.topics)
    && formData.topics.length
  )
    for (const key in formData.topics)
      formSubmitData.append('topics[]', formData.topics[key])

  if (extraAttr.value.length)
    for (const key in extraAttr.value)
      formSubmitData.append(
        'file_extra[]',
        JSON.stringify(extraAttr.value[key]),
      )

  // End arrange to form data

  try {
    const response = await useApiService.post(
      '/api/v1/tests',
      urlencodeFormData(formSubmitData),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )

    if (response.data.id == 0 && response.data.repeated)
      $toast.info('The paper is duplicated')
    else {
      $toast.success('Submit successfully')
      router.push({
        path: '/user/paper',
      })
    }
  }
  catch (err) {
    if (err.response?.status == 403) $auth.logout()
    else if (err.response?.status == 400)
      $toast.error(err.response.data.message)
  }
  finally {
    loading.form = false
  }
}

const urlencodeFormData = (fd) => {
  let s = ''
  for (const pair of fd.entries()) {
    if (typeof pair[1] == 'string') {
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

const uploadFile = async (file_name, ev, index = '') => {
  let value
  if (ev && ev.target && ev.target.files) {
    value = ev.target.files[0]
  }
  else if (ev instanceof File) {
    value = ev
  }
  else if (Array.isArray(ev) && ev.length > 0) {
    value = ev[0]
  }
  else {
    return
  }

  if (!value) {
    console.error('No valid file found')
    return
  }

  const fileFormData = new FormData()

  try {
    if (file_name == 'file_pdf') {
      if (
        !value.type.includes('pdf')
        && !value.name.toLowerCase().endsWith('.pdf')
      ) {
        $toast.error('Please upload a valid PDF file')
        file_pdf.value = null
        return
      }

      const isPdf
        = value.type.includes('pdf') || value.name.toLowerCase().endsWith('.pdf')

      if (!isPdf) {
        $toast.error('Please upload a valid PDF file')
        file_pdf.value = null
        return
      }

      file_pdf_loading.value = true
      loading.form = true
      fileFormData.append('file', value)
    }
    else if (file_name == 'file_word') {
      if (
        !value.type.includes('word')
        && !value.name.toLowerCase().endsWith('.doc')
        && !value.name.toLowerCase().endsWith('.docx')
      ) {
        $toast.error('Please upload a valid Word document')
        file_word.value = null
        return
      }

      const isWord
        = value.type.includes('word')
          || value.name.toLowerCase().endsWith('.doc')
          || value.name.toLowerCase().endsWith('.docx')

      if (!isWord) {
        $toast.error('Please upload a valid Word document')
        file_word.value = null
        return
      }

      file_word_loading.value = true
      loading.form = true
      fileFormData.append('file', value)
    }
    else if (file_name == 'file_answer') {
      const isPdf
        = value.type.includes('pdf') || value.name.toLowerCase().endsWith('.pdf')
      const isWord
        = value.type.includes('word')
          || value.name.toLowerCase().endsWith('.doc')
          || value.name.toLowerCase().endsWith('.docx')

      if (!isPdf && !isWord) {
        file_answer.value = null
        return
      }

      if (!isPdf && !isWord) {
        file_answer.value = null
        return
      }

      file_answer_loading.value = true
      loading.form = true
      fileFormData.append('file', value)
    }
    else if (file_name == 'file_extra') {
      file_extra_loading.value = true
      fileFormData.append('file', value)
    }

    const response = await useApiService.post('/api/v1/upload', fileFormData)

    if (file_name == 'file_pdf') formData.file_pdf = response.data[0].file.name
    else if (file_name == 'file_word')
      formData.file_word = response.data[0].file.name
    else if (file_name == 'file_answer')
      formData.file_answer = response.data[0].file.name
    else if (file_name == 'file_extra') {
      if (extraAttr.value[index]) {
        extraAttr.value[index].file = response.data[0].file.name
      }
      else {
        console.warn('No extra attribute found at index:', index)
      }
    }
  }
  catch (err) {
    if (err.response?.status == 403) $auth.logout()
    else $toast.error('Upload failed. Please try again.')
  }
  finally {
    file_pdf_loading.value = false
    file_word_loading.value = false
    file_answer_loading.value = false
    file_extra_loading.value = false
    loading.form = false
  }
}

const addExtraAttr = () => {
  extraAttr.value.push({ type: '', file: null, file_extra: null })
}

watch(
  () => formData.section,
  (val) => {
    userState.value.lastSelectedCurriculum = formData.section
    formData.base = ''
    formData.lesson = ''
    formData.topics = []
    formData.test_type = ''
    grade_list.value = []
    lesson_list.value = []
    topic_list.value = []

    getTypeList('base', val)
    getClassificationTypes(val)
    if (formData.area) getTypeList('school')
  },
)

watch(
  () => formData.base,
  () => {
    userState.value.lastSelectedGrade = formData.base
    formData.lesson = ''
    if (formData.base) getTypeList('lesson', formData.base)
  },
)

watch(
  () => formData.lesson,
  () => {
    userState.value.lastSelectedSubject = formData.lesson
    if (formData.lesson) {
      getTypeList('topic', formData.lesson)
      if (topicSelectorRef.value) {
        topicSelectorRef.value.lesson_selected = true
      }
    }
    else {
      formData.topic = []
      topic_list.value = []
      if (topicSelectorRef.value) {
        topicSelectorRef.value.lesson_selected = false
      }
    }
  },
)

watch(
  () => formData.holding_level,
  () => {
    userState.value.lastSelectedHoldingLevel = formData.holding_level
  },
)

watch(
  () => formData.state,
  () => {
    getTypeList('area', formData.state)
  },
)

watch(
  () => formData.area,
  () => {
    getTypeList('school')
  },
)

// watch(
//   () => formData.free_agreement,
//   (val) => {}
// );

onMounted(() => {
  getTypeList('section')
  getTypeList('state')
  getExtraFileType()

  // Load classifications if board is already selected (from user state)
  if (formData.section) {
    getClassificationTypes(formData.section)
  }
})
</script>

<style>
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

.topic_season {
  font-weight: bolder !important;
  color: blue !important;
}
</style>
