<template>
  <v-container
    id="test-album"
    class="mt-14"
  >
    <!-- Mobile filter -->
    <!--
    <v-row justify="center" class="d-block d-md-none">
      <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            class="d-block d-md-none"
            min-width="40"
            fixed
            right
            style="z-index: 10; bottom: 8rem"
            size="x-large"
            color="teal"
            variant="flat"
            rounded
          >
            <v-icon>mdi-filter</v-icon>
            <v-slide-x-reverse-transition>
              <span v-show="expandFilterMenu" class="text-h6">filter</span>
            </v-slide-x-reverse-transition>
          </v-btn>
        </template>
        <v-card>
          <div style="position: sticky; top: 0; left: 0; right: 0; z-index: 10">
            <v-toolbar class="filter-btn-header">
              <v-toolbar-items>
                <v-btn
                  class="text-h5 font-weight-bold"
                  variant="text"
                  @click="dialog = false"
                >
                  Search in albums
                </v-btn>
              </v-toolbar-items>
              <v-spacer></v-spacer>
              <v-btn icon @click="dialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
          </div>
          <v-card-text>

            <v-row class="mt-4">
              <v-col cols="12" md="3">
                <v-autocomplete
                  density="compact"
                  v-model="filter.level"
                  clearable
                  :items="level_list"
                  item-title="title"
                  item-value="id"
                  label="Curriculum"
                  variant="outlined"
                  color="orange"
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-autocomplete
                  density="compact"
                  v-model="filter.grade"
                  clearable
                  :items="grade_list"
                  item-value="id"
                  item-title="title"
                  label="Grade"
                  variant="outlined"
                  color="orange"
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-autocomplete
                  density="compact"
                  :items="lesson_list"
                  item-value="id"
                  item-title="title"
                  v-model="filter.lesson"
                  clearable
                  label="Subject"
                  variant="outlined"
                  color="orange"
                />
              </v-col>
            </v-row>

          </v-card-text>

          <v-card-actions
            style="position: sticky; bottom: 0; left: 0; right: 0"
          >
            <v-btn
              size="medium"
              block
              class="filter-show-result mr-4"
              @click="dialog = !dialog"
            >
              show result ({{ album_list.length }})
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
   Mobile filter
   -->
    <v-row>
      <v-col
        cols="12"
        class="pl-5"
      >
        <span class="text-h4 text-teal">
          <v-icon
            color="teal"
            size="large"
          >mdi-image-album</v-icon>
          Albums
        </span>
      </v-col>
    </v-row>
    <v-card
      flat
      class="mt-3 mb-6 pb-10 album-card"
    >
      <v-card-text>
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
              item-title="title"
              item-value="id"
              label="Board"
              variant="outlined"
              color="orange"
              autocomplete="off"
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
              item-title="title"
              label="Grade"
              variant="outlined"
              color="orange"
              autocomplete="off"
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
              item-title="title"
              clearable
              label="Subject"
              variant="outlined"
              color="orange"
              autocomplete="off"
            />
          </v-col>
        </v-row>
        <!-- End filter section -->

        <!-- Albums -->
        <v-row>
          <v-col
            v-if="page_loading === false && album_list.length === 0"
            cols="12"
            class="text-center"
          >
            <p>Oops! no data found</p>
          </v-col>
          <v-col
            v-for="(album, index) in album_list"
            v-else
            :key="index"
            cols="12"
            sm="6"
            md="3"
          >
            <v-card class="album-card">
              <v-card-title class="text-h4">
                <NuxtLink :to="`/albums/${album.lesson}`">
                  {{ album.lesson_title }} album
                </NuxtLink>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="7">
                    <NuxtLink :to="`/albums/${album.lesson}`">
                      <v-img
                        v-if="album.lesson_pic"
                        class="album-img"
                        :src="album.lesson_pic"
                        @error="imgErrorHandler(album, index)"
                      />
                      <v-card
                        v-else
                        flat
                        class="album-no-img container mx-auto fill-height align-center justify-center"
                      >
                        <v-card-text class="px-0">
                          <p class="font-weight-bold mb-3 mt-5">
                            {{ album.lesson_title }}
                          </p>
                          <a href="https://gamatrain.com">Gamatrain.com</a>
                        </v-card-text>
                      </v-card>
                    </NuxtLink>
                  </v-col>
                  <v-col
                    cols="5"
                    class="d-flex align-center justify-center pr-0"
                  >
                    <p
                      v-show="album.price === '0'"
                      class="price_label text-green"
                    >
                      Free
                    </p>
                    <p
                      v-show="album.price !== '0'"
                      class="price_label"
                    >
                      <span class="text-red">
                        ${{ formatNumber(album.price) }}
                      </span>
                      <br>
                      <br>
                      <span class="subscription_label">
                        Yearly subscription
                      </span>
                    </p>
                  </v-col>
                  <v-col
                    cols="12"
                    class="py-0"
                  >
                    <v-divider />
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-chip
                  label
                  class="test-count-label"
                >
                  <span class="label-text">Test count:&nbsp; </span>
                  <span class="label-val">{{
                    formatNumber(album.tests_num)
                  }}</span>
                </v-chip>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <v-row v-show="page_loading">
          <v-col
            cols="12"
            class="text-center"
          >
            <v-progress-circular
              :size="40"
              :width="4"
              class="mt-12 mb-12"
              color="orange"
              indeterminate
            />
          </v-col>
        </v-row>

        <!-- End albums -->
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import _FormTopicSelector from '~/components/form/topic-selector.vue'

// Define layout and page metadata
definePageMeta({
  layout: 'test-maker-layout',
  middleware: ['auth', 'user-type'],
})

useHead({
  title: 'Online exam albums',
})

// Services
const { $toast } = useNuxtApp()

// Core data
const _test_step = ref(1)
const page_loading = ref(false)
const page = ref(1)
const all_files_loaded = ref(false)
const timer = ref(null)

// Filter section
const filter = reactive({
  level: '',
  grade: '',
  lesson: '',
})

// UI State
const _dialog = ref(false)
const expandFilterMenu = ref(true)

// Data lists
const level_list = ref([])
const grade_list = ref([])
const _field_list = ref([])
const lesson_list = ref([])
const album_list = ref([])

// Utility Functions
const formatNumber = (value) => {
  if (!value) return '0'

  const val = parseInt(value, 10)
  return val.toLocaleString()
}

// Methods
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
    $toast.error(err.message || 'Error loading data')
  }
}

const getAlbumList = async () => {
  if (all_files_loaded.value === false) {
    page_loading.value = true

    try {
      const response = await useApiService.get('/api/v1/albums', {
        perpage: 12,
        page: page.value,
        section: filter.level,
        base: filter.grade,
        lesson: filter.lesson,
      })

      const result = response.data.list
      for (const item of result) {
        if (album_list.value.findIndex(x => x.id === item.id) === -1) {
          album_list.value.push(item)
        }
      }

      // For terminate auto load request
      if (result.length === 0) {
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

    // Control filter menu button on mobile device
    expandFilterMenu.value = window.scrollY <= 1000

    // Load next page
    if (bottomOfWindow && all_files_loaded.value === false) {
      page_loading.value = true
      timer.value = setTimeout(() => {
        page.value++
        getAlbumList()
      }, 800)
    }
  }
}

const imgErrorHandler = (item, key) => {
  album_list.value[key].lesson_pic = ''
}

// Watchers
watch(
  () => filter.level,
  (val) => {
    filter.grade = ''
    filter.lesson = ''

    if (val) {
      getTypeList('base', val)
    }

    page.value = 1
    all_files_loaded.value = false
    album_list.value = []
    getAlbumList()
  },
)

watch(
  () => filter.grade,
  (val) => {
    filter.lesson = ''

    if (val) {
      album_list.value = []
      page.value = 1
      all_files_loaded.value = false
      getAlbumList()
      getTypeList('lesson', val)
    }
  },
)

watch(
  () => filter.lesson,
  (val) => {
    if (val) {
      page.value = 1
      all_files_loaded.value = false
      album_list.value = []
      getAlbumList()
    }
  },
)

// Lifecycle hooks
onMounted(() => {
  getTypeList('section')
  getAlbumList()
  setupInfiniteScroll()
})

onUnmounted(() => {
  window.onscroll = null
  if (timer.value) {
    clearTimeout(timer.value)
  }
})
</script>

<style scoped>
/* Responsive styles can be added here */
</style>
