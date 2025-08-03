<template>
  <v-container>
    <div>
      <v-col
        cols="12"
        class="px-0 px-sm-2 mt-md-16"
      >
        <v-row>
          <v-col
            cols="12"
            class="pl-5"
          >
            <span class="text-h4 teal--text">
              <v-icon
                color="teal"
                large
              > mdi-clipboard-list-outline </v-icon>
              My Exams
            </span>
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
              clearable
              :items="level_list"
              item-text="title"
              item-value="id"
              label="Curriculum"
              variant="outlined"
              color="primary"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
          >
            <v-autocomplete
              v-model="filter.grade"
              density="compact"
              clearable
              :items="grade_list"
              item-value="id"
              item-text="title"
              label="Grade"
              variant="outlined"
              color="primary"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
          >
            <v-autocomplete
              v-model="filter.lesson"
              density="compact"
              :items="lesson_list"
              item-value="id"
              item-text="title"
              clearable
              label="Subject"
              variant="outlined"
              color="primary"
            />
          </v-col>
        </v-row>
        <!-- End filter section -->

        <v-card class="mt-3 p-4">
          <v-card-text class="px-sm-8 px-md-4">
            <v-row>
              <v-col
                cols="12"
                class="px-4"
              >
                <v-simple-table class="exams_table">
                  <template #default>
                    <tbody class="d-flex flex-column">
                      <tr
                        v-for="item in exam_list"
                        v-show="exam_list.length > 0"
                        :key="item.id"
                        class="d-flex w-100 justify-space-between border-b-sm"
                      >
                        <td class="py-3">
                          <nuxt-link
                            :to="`/exam/${item.id}`"
                            class="gtext-t5 font-weight-bold"
                          >{{ item.title }}</nuxt-link>
                          <nuxt-link
                            :to="`/exam/participants/${item.id}`"
                            class="mt-2 d-block gtext-t5"
                          >
                            <span class="icong-student" />
                            Participants: {{ item.participants.total }}
                          </nuxt-link>
                        </td>
                        <td class="text-right py-3">
                          <p>
                            {{ item.subdate }}
                          </p>
                          <div class="d-flex align-center">
                            <p class="gtext-t6">
                              {{ showStatus(item.status) }}
                            </p>
                            <v-tooltip location="bottom">
                              <template #activator="{ props }">
                                <v-btn
                                  icon="mdi-delete"
                                  color="error"
                                  size="small"
                                  v-bind="props"
                                  variant="text"
                                  @click="openDeleteConfirmDialog(item.id)"
                                />
                              </template>
                              <span>Delete</span>
                            </v-tooltip>
                            <v-tooltip location="bottom">
                              <template #activator="{ props }">
                                <v-btn
                                  icon="mdi-note-edit-outline"
                                  size="small"
                                  v-bind="props"
                                  :to="`/test-maker/edit/${item.id}`"
                                  variant="text"
                                />
                              </template>
                              <span>Edit</span>
                            </v-tooltip>
                            <v-tooltip location="bottom">
                              <template #activator="{ props }">
                                <v-btn
                                  icon="mdi-share-variant-outline"
                                  size="small"
                                  color="primary"
                                  v-bind="props"
                                  variant="text"
                                />
                              </template>
                              <span>Share</span>
                            </v-tooltip>
                          </div>
                        </td>
                      </tr>
                      <tr
                        v-show="
                          page_loading === false && exam_list.length === 0
                        "
                        class="w-100"
                      >
                        <td
                          colspan="2"
                          class="d-flex text-center w-100"
                        >
                          <p class="w-100">
                            Oops! no data found
                          </p>
                        </td>
                      </tr>
                      <tr
                        v-show="page_loading"
                        class="w-100"
                      >
                        <td
                          colspan="2"
                          class="text-center w-100 d-flex"
                        >
                          <v-progress-circular
                            :size="40"
                            :width="4"
                            class="mt-12 mb-12 w-100"
                            color="orange"
                            indeterminate
                          />
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-dialog
        v-model="deleteConfirmDialog"
        max-width="290"
      >
        <v-card class="pa-0">
          <v-card-title
            class="mt-2 text-h5"
            style="font-size: 13px"
          >
            Are you sure?
          </v-card-title>

          <v-card-text>
            <p style="color: rgba(0, 0, 0, 0.6); font-size: 13px">
              If you are sure to delete, click Yes.
            </p>
          </v-card-text>

          <v-card-actions>
            <v-spacer />

            <v-btn
              text
              style="text-transform: none; font-size: 13px"
              @click="deleteConfirmDialog = false"
            >
              No
            </v-btn>

            <v-btn
              color="green darken-1"
              text
              :loading="delete_loading"
              style="text-transform: none; font-size: 13px"
              @click="deleteExam()"
            >
              Yes
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>

<script setup>
// Define layout and page metadata
definePageMeta({
  layout: 'test-maker-layout',
  middleware: ['auth', 'user-type'],
})

const { $toast } = useNuxtApp()
useHead({ title: 'My Exams' })

const filter = ref({
  level: null,
  grade: null,
  lesson: null,
})

const level_list = ref([])
const grade_list = ref([])
const lesson_list = ref([])
const exam_list = ref([])
const page_loading = ref(false)
const page = ref(1)
const all_files_loaded = ref(false)
const deleteConfirmDialog = ref(false)
const delete_loading = ref(false)
const delete_exam_id = ref(null)
const timer = ref(null)

const getTypeList = async (type, parent = '') => {
  const params = { type }
  if (type === 'base') params.section_id = parent
  if (type === 'lesson') params.base_id = parent

  try {
    const res = await useApiService.get('/api/v1/types/list', params)

    if (type === 'section') {
      level_list.value = res.data
    }
    else if (type === 'base') {
      grade_list.value = res.data
    }
    else if (type === 'lesson') {
      lesson_list.value = res.data
    }
  }
  catch (err) {
    $toast.error(err)
  }
}

const getExams = async () => {
  if (!all_files_loaded.value) {
    page_loading.value = true
    try {
      const response = await useApiService.get('/api/v1/exams', {
        perpage: 20,
        page: page.value,
        section: filter.value.level,
        base: filter.value.grade,
        lesson: filter.value.lesson,
      })

      exam_list.value.push(...response.data.list)

      if (response.data.list.length === 0) {
        all_files_loaded.value = true
      }
    }
    catch (err) {
      console.error(err)
    }
    finally {
      page_loading.value = false
    }
  }
}

const scroll = () => {
  window.onscroll = () => {
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

    if (timer.value) clearTimeout(timer)

    if (bottomOfWindow && !all_files_loaded.value) {
      page_loading.value = true
      timer.value = setTimeout(() => {
        page.value++
        getExams()
      }, 800)
    }
  }
}

const showStatus = (id) => {
  if (id === '6') return 'Under construction'
  else if (id === '7') return 'Published'
}

const openDeleteConfirmDialog = (item_id) => {
  delete_exam_id.value = item_id
  deleteConfirmDialog.value = true
}

const deleteExam = async () => {
  delete_loading.value = true
  try {
    await useApiService.remove(`/api/v1/exams/${delete_exam_id.value}`)

    // Reset pagination and reload exams
    page.value = 1
    all_files_loaded.value = false
    exam_list.value = []
    getExams()
  }
  catch (e) {
    console.log(e)
  }
  finally {
    delete_loading.value = false
    delete_exam_id.value = null
    deleteConfirmDialog.value = false
  }
}

onMounted(() => {
  getTypeList('section')
  getExams('section')
  scroll('section')
})

// Watchers
watch(
  () => filter.value.level,
  (val) => {
    filter.value.grade = ''
    filter.value.lesson = ''
    if (val) getTypeList('base', val)

    page.value = 1
    all_files_loaded.value = false
    exam_list.value = []
    getExams()
  },
)

watch(
  () => filter.value.grade,
  (val) => {
    filter.value.lesson = ''
    if (val) getTypeList('lesson', val)

    page.value = 1
    all_files_loaded.value = false
    exam_list.value = []
    getExams()
  },
)

watch(
  () => filter.value.lesson,
  () => {
    page.value = 1
    all_files_loaded.value = false
    exam_list.value = []
    getExams()
  },
)
</script>

<style scoped>
p {
  font-size: 1.4rem;
}
:deep(.mdi) {
  font-size: 16px !important;
}
</style>
