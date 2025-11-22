<template>
  <div class="mt-4">
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
          > My Forum List </span>
        </v-col>
      </v-row>

      <!-- Filter section -->
      <!-- <v-row class="d-none d-md-flex">
        <v-col cols="12" md="3">
          <v-autocomplete
            density="compact"
            variant="outlined"
            v-model="filter.level"
            clearable
            :items="level_list"
            item-title="title"
            item-value="id"
            label="Curriculum"
            @update:model-value="filterChanged('level')"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-autocomplete
            density="compact"
            variant="outlined"
            v-model="filter.grade"
            clearable
            :items="grade_list"
            item-value="id"
            item-title="title"
            label="Grade"
            @update:model-value="filterChanged('grade')"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-autocomplete
            density="compact"
            variant="outlined"
            :items="lesson_list"
            item-value="id"
            item-title="title"
            v-model="filter.lesson"
            clearable
            label="Subject"
            @update:model-value="filterChanged('lesson')"
          />
        </v-col>
      </v-row> -->
      <!-- End filter section -->

      <v-card class="mt-3 px-4 px-md-0">
        <v-card-title class="text-h4 px-0 px-md-4">
          <v-row class="py-2">
            <v-col
              cols="12"
              class="text-left"
            >
              <v-btn
                to="/user/question/create"
                color="teal"
                density="default"
                exact
                class="text-white py-2"
                style="font-size: 1.2rem; text-transform: none"
              >
                Add Forum
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text class="px-sm-8 px-md-4">
          <v-row>
            <v-col
              cols="12"
              class="px-0 px-sm-4 px-md-4"
            >
              <v-table class="content_table">
                <thead>
                  <tr>
                    <th
                      class="text-left text-h5"
                      style="min-width: fit-content !important"
                    >
                      #
                    </th>
                    <th
                      class="text-center text-h5"
                      style="min-width: fit-content !important"
                    >
                      Title
                    </th>
                    <th
                      class="text-center text-h5"
                      style="min-width: fit-content !important"
                    >
                      Unread reply
                    </th>
                    <th
                      class="text-center text-h5"
                      style="min-width: fit-content !important"
                    >
                      Status
                    </th>
                    <th
                      class="text-center text-h5"
                      style="min-width: fit-content !important"
                    >
                      Date
                    </th>
                    <th
                      class="text-center text-h5"
                      style="min-width: fit-content !important"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in question_list"
                    v-show="question_list.length > 0"
                    :key="item.id"
                  >
                    <td>{{ item.id }}</td>
                    <td
                      class="text-center"
                      style="max-width: 20rem"
                    >
                      <a
                        :href="`/qa/${item.id}/${item.title}`"
                        target="_blank"
                      >
                        {{ item.title }}
                      </a>
                    </td>
                    <td class="text-center">
                      {{ item.unread_reply }}
                    </td>
                    <td class="text-center">
                      {{ calcStatus(item.status) }}
                    </td>
                    <td class="text-center">
                      {{ item.subdate }}
                    </td>
                    <td class="text-center">
                      <div class="d-flex justify-center">
                        <v-tooltip location="bottom">
                          <template #activator="{ props }">
                            <v-btn
                              icon
                              color="green"
                              :to="`/qa/${item.id}`"
                              target="_blank"
                              v-bind="props"
                              density="compact"
                              variant="text"
                            >
                              <v-icon> mdi-eye </v-icon>
                            </v-btn>
                          </template>
                          <span>View</span>
                        </v-tooltip>
                        <v-tooltip location="bottom">
                          <template #activator="{ props }">
                            <v-btn
                              icon
                              v-bind="props"
                              :to="`/user/question/edit/${item.id}`"
                              density="compact"
                              variant="text"
                            >
                              <v-icon> mdi-note-edit-outline </v-icon>
                            </v-btn>
                          </template>
                          <span>Edit</span>
                        </v-tooltip>
                        <v-tooltip location="bottom">
                          <template #activator="{ props }">
                            <v-btn
                              icon
                              color="error"
                              v-bind="props"
                              density="compact"
                              variant="text"
                              @click="openDeleteConfirmDialog(item.id, index)"
                            >
                              <v-icon> mdi-delete </v-icon>
                            </v-btn>
                          </template>
                          <span>Delete</span>
                        </v-tooltip>
                      </div>
                    </td>
                  </tr>
                  <tr
                    v-show="
                      !initialLoading
                        && page_loading === false
                        && question_list.length === 0
                    "
                  >
                    <td
                      colspan="7"
                      class="text-center"
                    >
                      <p>Oops! no data found</p>
                    </td>
                  </tr>
                  <tr v-show="page_loading || initialLoading">
                    <td
                      colspan="7"
                      class="text-center"
                    >
                      <v-progress-circular
                        :size="30"
                        :width="3"
                        class="mt-12 mb-12"
                        color="orange"
                        indeterminate
                      />
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Delete dialog -->
    <v-dialog
      v-model="deleteConfirmDialog"
      max-width="290"
    >
      <v-card class="py-2 px-2">
        <v-card-title
          class="px-4"
          style="font-size: 1.4rem"
        >
          Are you sure?
        </v-card-title>

        <v-card-text
          class="px-4 pt-0 pb-1"
          style="color: rgba(0, 0, 0, 0.6)"
        >
          <p>If you are sure to delete, click Yes.</p>
        </v-card-text>

        <v-card-actions class="pt-4">
          <v-spacer />

          <v-btn
            variant="text"
            style="
              font-size: 1.4rem !important;
              letter-spacing: inherit !important;
              text-transform: none !important;
            "
            @click="deleteConfirmDialog = false"
          >
            No
          </v-btn>

          <v-btn
            color="green-darken-1"
            variant="text"
            style="
              font-size: 1.4rem !important;
              letter-spacing: inherit !important;
              text-transform: none !important;
            "
            :loading="delete_loading"
            @click="deleteQuestion()"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- End delete dialog -->
  </div>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth'

const auth = useAuth()
// Define layout and page metadata
definePageMeta({
  layout: 'dashboard-layout',
  middleware: ['auth', 'user-type'],
})

// Use services
const _router = useRouter()
const { $toast } = useNuxtApp()

// Page title
useHead({
  title: 'Q & A manage',
})

// Reactive state
const question_list = ref([])
const initialLoading = ref(true)

// User token
const userToken = ref('')

// Filter section
const filter = reactive({
  level: '',
  grade: '',
  lesson: '',
})

const level_list = ref([])
const grade_list = ref([])
const lesson_list = ref([])

// Paginate section
const page_loading = ref(false)
const page = ref(1)
const all_files_loaded = ref(false)
const timer = ref(null)

// Delete section
const deleteConfirmDialog = ref(false)
const delete_question_id = ref(null)
const delete_question_index = ref(null)
const delete_loading = ref(false)

// Methods
const getQuestionList = () => {
  if (!all_files_loaded.value) {
    page_loading.value = true

    useApiService
      .get('/api/v1/questions', {
        perpage: 20,
        page: page.value,
        section: filter.level,
        base: filter.grade,
        lesson: filter.lesson,
      })
      .then((response) => {
        question_list.value.push(...response.data.list)

        if (
          response.data.num
          && question_list.value.length >= Number(response.data.num)
        ) {
          all_files_loaded.value = true
        }

        // Handle case where no more items are returned
        if (response.data.list.length === 0) {
          all_files_loaded.value = true
        }
      })
      .catch((err) => {
        console.error(err)
        if (err.response?.status === 403) auth.logout()
      })
      .finally(() => {
        page_loading.value = false
        initialLoading.value = false
      })
  }
}

const calcStatus = (val) => {
  let title = ''
  if (val == 0) title = 'Unreviewed'
  else if (val == 1) title = 'Confirmed'
  else if (val == 2) title = 'Reference to type unit'
  else if (val == 3) title = 'Has a message'
  else if (val == 4) title = 'Inactive'
  else if (val == 5) title = 'Edited'
  return title
}

const getTypeList = (type, parent = '') => {
  const params = { type }

  if (type === 'base') params.section_id = parent
  if (type === 'lesson') params.base_id = parent

  useApiService
    .get('/api/v1/types/list', params)
    .then((response) => {
      if (type === 'section') {
        level_list.value = response.data
      }
      else if (type === 'base') {
        grade_list.value = response.data
      }
      else if (type === 'lesson') {
        lesson_list.value = response.data
      }
    })
    .catch((err) => {
      $toast.error(err.message || 'Error loading data')
    })
}

const scroll = () => {
  // For infinite loading
  window.onscroll = () => {
    // Don't proceed if all files are loaded
    if (all_files_loaded.value) {
      return
    }

    // Scroll position
    const scrollPosition
      = Math.max(
        window.pageYOffset,
        document.documentElement.scrollTop,
        document.body.scrollTop,
      )
      + window.innerHeight
      + 50
    const bottomOfWindow
      = scrollPosition >= document.documentElement.offsetHeight

    // Avoid the number of requests
    if (timer.value) {
      clearTimeout(timer.value)
      timer.value = null
    }

    // Load next page
    if (bottomOfWindow && !all_files_loaded.value) {
      page_loading.value = true
      timer.value = setTimeout(() => {
        page.value++
        getQuestionList()
      }, 800)
    }
  }
}

const _filterChanged = (type) => {
  if (type == 'level') {
    filter.grade = ''
    filter.lesson = ''
    if (filter.level) getTypeList('base', filter.level)

    page.value = 1
    all_files_loaded.value = false

    grade_list.value = []
    lesson_list.value = []
    question_list.value = []

    getQuestionList()
  }
  else if (type == 'grade') {
    filter.lesson = ''
    if (filter.grade) getTypeList('lesson', filter.grade)

    page.value = 1
    all_files_loaded.value = false
    question_list.value = []
    lesson_list.value = []
    getQuestionList()
  }
  else if (type == 'lesson') {
    page.value = 1
    all_files_loaded.value = false
    question_list.value = []
    getQuestionList()
  }
}

const openDeleteConfirmDialog = (item_id, index) => {
  delete_question_id.value = item_id
  delete_question_index.value = index
  deleteConfirmDialog.value = true
}

const deleteQuestion = async () => {
  delete_loading.value = true

  try {
    await useApiService.remove(`/api/v1/questions/${delete_question_id.value}`)
    question_list.value.splice(delete_question_index.value, 1)
    delete_question_id.value = null
    delete_question_index.value = null
    deleteConfirmDialog.value = false
    $toast.success('Deleted successfully')
  }
  catch (e) {
    if (e.response?.status == 400) {
      $toast.error(e.response.data.message || 'Error deleting question')
    }

    delete_question_id.value = null
    delete_question_index.value = null
    deleteConfirmDialog.value = false
  }
  finally {
    delete_loading.value = false
  }
}

// Initialize on mount
onMounted(() => {
  userToken.value = auth.getUserToken()
  getQuestionList()
  getTypeList('section')
  scroll()
})
</script>

<style scoped>
p {
  font-size: 1.4rem;
}
table > thead > tr > th {
  color: rgba(0, 0, 0, 0.6);
}
.v-table > .v-table__wrapper > table > tbody > tr > td,
.v-table > .v-table__wrapper > table > thead > tr > th,
.v-table > .v-table__wrapper > table > tfoot > tr > th {
  padding: 14px 6px !important;
}

.v-table > .v-table__wrapper > table > tbody > tr:hover {
  background-color: #eeeeeeb1 !important;
}
</style>
