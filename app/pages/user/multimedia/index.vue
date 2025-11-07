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
          >My Multimedia List</span>
        </v-col>
      </v-row>

      <!-- Filter section -->
      <v-row class="d-none d-md-flex">
        <v-col
          cols="12"
          md="3"
        >
          <v-autocomplete
            v-model="filter.level"
            density="compact"
            variant="outlined"
            clearable
            :items="level_list"
            item-title="title"
            item-value="id"
            label="Board"
            color="orange"
            @update:model-value="filterChanged('level')"
          />
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-autocomplete
            v-model="filter.grade"
            density="compact"
            variant="outlined"
            clearable
            :items="grade_list"
            item-value="id"
            item-title="title"
            label="Grade"
            color="orange"
            @update:model-value="filterChanged('grade')"
          />
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-autocomplete
            v-model="filter.lesson"
            density="compact"
            variant="outlined"
            :items="lesson_list"
            item-value="id"
            item-title="title"
            clearable
            label="Subject"
            color="orange"
            @update:model-value="filterChanged('lesson')"
          />
        </v-col>
      </v-row>
      <!-- End filter section -->

      <v-card
        class="mt-3 py-2"
        elevation="2"
      >
        <v-card-title class="text-h5">
          <v-row>
            <v-col
              cols="12"
              class="text-left"
            >
              <v-btn
                to="/user/multimedia/create"
                color="teal"
                density="default"
                exact
                class="text-white text-h5 md-ma-2"
                style="text-transform: none"
              >
                Add Multimedia
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
                      style="color: rgba(0, 0, 0, 0.6) !important"
                    >
                      #
                    </th>
                    <th
                      class="text-center text-h5"
                      style="color: rgba(0, 0, 0, 0.6) !important"
                    >
                      Title
                    </th>
                    <th
                      class="text-center text-h5"
                      style="color: rgba(0, 0, 0, 0.6) !important"
                    >
                      Score
                    </th>
                    <th
                      class="text-center text-h5"
                      style="color: rgba(0, 0, 0, 0.6) !important"
                    >
                      Download
                    </th>
                    <th
                      class="text-center text-h5"
                      style="color: rgba(0, 0, 0, 0.6) !important"
                    >
                      Date
                    </th>
                    <th
                      class="text-center text-h5"
                      style="color: rgba(0, 0, 0, 0.6) !important"
                    >
                      Status
                    </th>
                    <th
                      class="text-center text-h5"
                      style="color: rgba(0, 0, 0, 0.6) !important"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in multimedia_list"
                    v-show="multimedia_list.length > 0"
                    :key="item.id"
                  >
                    <td>{{ item.id }}</td>
                    <td
                      class="text-center"
                      style="max-width: 20rem"
                    >
                      <a
                        :href="`/multimedia/${item.id}/${item.title}`"
                        target="_blank"
                      >
                        {{ item.title }}
                      </a>
                    </td>
                    <td class="text-center">
                      {{ item.teacher_score }}
                    </td>
                    <td class="text-center">
                      {{ item.downloads }}
                    </td>
                    <td class="text-center">
                      {{ item.subdate }}
                    </td>
                    <td class="text-center">
                      {{ calcStatus(item.status) }}
                    </td>
                    <td class="text-center">
                      <v-tooltip location="bottom">
                        <template #activator="{ props }">
                          <v-btn
                            icon
                            color="green"
                            :to="`/multimedia/${item.id}/${item.title}`"
                            target="_blank"
                            density="compact"
                            variant="text"
                            v-bind="props"
                          >
                            <v-icon>mdi-eye</v-icon>
                          </v-btn>
                        </template>
                        <span>View</span>
                      </v-tooltip>
                      <v-tooltip location="bottom">
                        <template #activator="{ props }">
                          <v-btn
                            icon
                            v-bind="props"
                            :to="`/user/multimedia/edit/${item.id}`"
                            density="compact"
                            variant="text"
                          >
                            <v-icon>mdi-note-edit-outline</v-icon>
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
                            @click="confirmDelete(item.id, index)"
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </template>
                        <span>Delete</span>
                      </v-tooltip>
                    </td>
                  </tr>
                  <tr
                    v-show="
                      page_loading === false && multimedia_list.length === 0
                    "
                  >
                    <td
                      colspan="7"
                      class="text-center"
                    >
                      <p>Oops! no data found</p>
                    </td>
                  </tr>
                  <tr v-show="page_loading">
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
            @click="deleteMultimedia()"
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

useHead({
  title: 'Multimedia Management',
})

// Services
const { $toast } = useNuxtApp()

const _router = useRouter()

// User token
const userToken = ref('')

// Data
const multimedia_list = ref([])

// Delete dialog
const deleteConfirmDialog = ref(false)
const deleteId = ref(null)
const delete_multimedia_index = ref(null)
const delete_loading = ref(false)

// Filter section
const filter = reactive({
  level: '',
  grade: '',
  lesson: '',
})

const level_list = ref([])
const grade_list = ref([])
const lesson_list = ref([])

// Pagination
const page_loading = ref(false)
const page = ref(1)
const all_files_loaded = ref(false)
const timer = ref(null)

// Methods
const getMultimediaList = async () => {
  if (!all_files_loaded.value) {
    page_loading.value = true

    try {
      const response = await useApiService.get('/api/v1/files', {
        perpage: 20,
        page: page.value,
        section: filter.level,
        base: filter.grade,
        lesson: filter.lesson,
      })

      multimedia_list.value.push(...response.data.list)

      // For terminate auto load request
      if (response.data.list.length === 0) {
        all_files_loaded.value = true
      }
    }
    catch (err) {
      console.error(err)
      $toast.error('Error loading multimedia')
    }
    finally {
      page_loading.value = false
    }
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

const getTypeList = async (type, parent = '') => {
  const params = { type }

  if (type === 'base') params.section_id = parent
  if (type === 'lesson') params.base_id = parent

  try {
    const response = await useApiService.get('/api/v1/types/list', params)

    if (type === 'section') {
      level_list.value = response.data
    }
    else if (type === 'base') {
      grade_list.value = response.data
    }
    else if (type === 'lesson') {
      lesson_list.value = response.data
    }
  }
  catch (err) {
    $toast.error(err.message || 'Error loading data')
  }
}

const setupInfiniteScroll = () => {
  window.onscroll = () => {
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
        getMultimediaList()
      }, 800)
    }
  }
}

const filterChanged = (type) => {
  if (type == 'level') {
    filter.grade = ''
    filter.lesson = ''

    if (filter.level) getTypeList('base', filter.level)

    page.value = 1
    all_files_loaded.value = false

    grade_list.value = []
    lesson_list.value = []
    multimedia_list.value = []

    getMultimediaList()
  }
  else if (type == 'grade') {
    filter.lesson = ''

    if (filter.grade) getTypeList('lesson', filter.grade)

    page.value = 1
    all_files_loaded.value = false
    multimedia_list.value = []
    lesson_list.value = []

    getMultimediaList()
  }
  else if (type == 'lesson') {
    page.value = 1
    all_files_loaded.value = false
    multimedia_list.value = []

    getMultimediaList()
  }
}

const confirmDelete = (id, index) => {
  deleteId.value = id
  delete_multimedia_index.value = index
  deleteConfirmDialog.value = true
}

const deleteMultimedia = async () => {
  delete_loading.value = true

  try {
    await useApiService.remove(`/api/v1/files/${deleteId.value}`)

    multimedia_list.value.splice(delete_multimedia_index.value, 1)
    deleteId.value = null
    delete_multimedia_index.value = null
    deleteConfirmDialog.value = false
    $toast.success('Multimedia deleted successfully')
  }
  catch (e) {
    if (e.response?.status === 400) {
      $toast.error(e.response.data.message || 'Error deleting multimedia')
    }
    else {
      $toast.error('Error deleting multimedia')
    }

    // Reset state variables even on error
    deleteId.value = null
    delete_multimedia_index.value = null
    deleteConfirmDialog.value = false
  }
  finally {
    delete_loading.value = false
  }
}

// Initialize
onMounted(() => {
  userToken.value = auth.getUserToken()
  getMultimediaList()
  getTypeList('section')
  setupInfiniteScroll()
})

// Cleanup
onUnmounted(() => {
  window.onscroll = null
  if (timer.value) {
    clearTimeout(timer.value)
  }
})
</script>

<style scoped>
p {
  font-size: 1.4rem;
}
.v-table > .v-table__wrapper > table > tbody > tr:hover {
  background-color: #eeeeeeb1 !important;
}
</style>
