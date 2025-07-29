<template>
  <v-container class="flex-column margin-top-handle">
    <v-row class="justify-center">
      <v-col
        cols="4"
        md="12"
        class="d-flex d-md-none justify-start"
      >
        <v-badge
          class="mt-1 height-badge"
          offset-x="5"
          offset-y="-5"
          :color="countFilterSelect == 0 ? `transparent` : `#F04438`"
          :content="countFilterSelect == 0 ? `` : countFilterSelect"
        >
          <v-btn
            rounded="xl"
            prepend-icon="mdi-tune-vertical"
            variant="outlined"
            class="primary-gray-700"
            density="comfortable"
            @click="openFilterMobileModal = !openFilterMobileModal"
          >
            Filter
          </v-btn>
        </v-badge>
      </v-col>
      <v-col
        cols="8"
        md="12"
        class="d-flex justify-end justify-md-center"
      >
        <v-text-field
          v-model="textSearch"
          label="Search anything...."
          variant="outlined"
          color="#FFB600"
          max-width="330"
          density="compact"
          hide-details
          class="custom-search-text-field"
          @update:model-value="changeTextSearch"
        >
          <template #append>
            <v-btn
              icon
              varient="text"
              color="#FFB600"
              width="50"
              class="rounded-ts rounded-te-xl rounded-be-xl rounded-bs h-100 ml-n2"
              flat
            >
              <v-icon
                size="x-large"
                icon="mdi-magnify"
                color="#000000"
              />
            </v-btn>
          </template>
        </v-text-field>
      </v-col>
      <search-filter-option
        v-model:show-dialog-filter-mobile="openFilterMobileModal"
        :count-data-found="totalDataFind"
        @change-filter-query="changeFilterQuery"
      />
      <v-col
        cols="12"
        class="d-flex align-end justify-end ga-2 max-width-container"
      >
        <span class="text-h5 primary-gray-400">Result</span>
        <span class="text-h4 primary-gray-700 font-weight-bold">{{
          $numberFormat(totalDataFind)
        }}</span>
      </v-col>
      <search-list
        :data-list="data"
        :is-initial-loading="isInitialDataLoading"
        :is-pagination-loading="isPaginationDataLoading"
        :is-all-data-loaded="isAllDataLoaded"
        @load-next-page="loadNextPageData"
      />
    </v-row>
  </v-container>
</template>

<script setup>
import dayjs from 'dayjs'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const openFilterMobileModal = ref(false)
const countFilterSelect = ref(0)
const querySearch = ref()
const textSearch = ref(route.query.keyword ? route.query.keyword : '')
const timer = ref(null)

const isInitialDataLoading = ref(false)
const isPaginationDataLoading = ref(false)
const data = ref([])
const isAllDataLoaded = ref(false)
const totalDataFind = ref(0)
const pageNumber = ref(1)
const perPage = 10

const loadNextPageData = async () => {
  pageNumber.value += 1
  isPaginationDataLoading.value = true
  await getDataList(true)
}

const changeFilterQuery = async (query, skipFetch = false) => {
  countFilterSelect.value = Object.keys(query).length
  querySearch.value = {
    ...query,
  }
  if (textSearch.value.length > 0) {
    querySearch.value.keyword = textSearch.value
  }
  if (!skipFetch) {
    isAllDataLoaded.value = false
    isInitialDataLoading.value = true
    pageNumber.value = 1
    await getDataList()
  }
}

const changeTextSearch = () => {
  isInitialDataLoading.value = true

  const query = querySearch.value
  if (textSearch.value.length == 0) {
    delete query.keyword
  }
  else {
    query.keyword = textSearch.value
  }
  router.replace({ query })
  debouncedSearchText()
}

const debouncedSearchText = () => {
  if (timer.value) {
    clearTimeout(timer.value)
    timer.value = null
  }
  timer.value = setTimeout(() => {
    isAllDataLoaded.value = false
    pageNumber.value = 1
    getDataList()
  }, 800)
}

const { data: initialData, pending: _loadingDataServer } = await useAsyncData(
  'dataSearchSSR',
  () => {
    const params = {
      page: pageNumber.value,
      keyword: route.query.keyword,
      section: route.query.section,
      base: route.query.base,
      lesson: route.query.lesson,
      topic: route.query.topic,
      type: route.query.type ? route.query.type : 'test',
      edu_year: route.query.edu_year,
      edu_month: route.query.edu_month,
    }

    if (route.query.type && route.query.type == 'learnfiles') {
      params.content_type = route.query.content_type
    }
    if (route.query.type && route.query.type == 'test') {
      params.test_type = route.query.test_type
    }

    return $fetch('/api/v1/search', { params })
  },
)

if (initialData.value) {
  data.value = initialData.value.data.list
  totalDataFind.value = initialData.value.data.num || 0
  isInitialDataLoading.value = false
  isPaginationDataLoading.value = false
}

const getDataList = async (isLoadNextPage = false) => {
  if (isAllDataLoaded.value) return
  try {
    const params = { ...querySearch.value }
    params.page = pageNumber.value
    const response = await $fetch('/api/v1/search', { params })

    if (response.data.list.length < perPage) {
      isAllDataLoaded.value = true
    }
    totalDataFind.value = response.data.num ? response.data.num : 0
    if (isLoadNextPage) {
      data.value = [...data.value, ...response.data.list]
    }
    else {
      data.value = response.data.list
    }
  }
  catch (err) {
    console.error(err)
  }
  finally {
    isPaginationDataLoading.value = false
    isInitialDataLoading.value = false
  }
}

const pageTitle = ref('')
const pageDescribe = ref('')

const setMetaData = (type) => {
  const { section, base, lesson, test_type, edu_year, edu_month } = route.query
  const firstElement = initialData.value?.data?.list[0]

  const titles = {
    boardTitle:
      section && firstElement ? firstElement.section_title : undefined,
    gradeTitle: section && base && firstElement ? firstElement.base_title : '',
    subjectTitle:
      section && base && lesson && firstElement
        ? firstElement.lesson_title
        : '',
    classificationTitle: '',
    yearTitle: edu_year ? edu_year : '',
    monthTitle: edu_month
      ? dayjs()
          .month(edu_month - 1)
          .format('MMMM')
      : '',
  }
  if (
    (route.query.type == 'test' || route.query.type == 'azmoon')
    && test_type
  ) {
    titles.classificationTitle
      = firstElement?.test_type_title || firstElement?.azmoon_type_title
  }
  const joinTextTitles = `${titles.monthTitle} ${titles.yearTitle} ${titles.classificationTitle} ${titles.subjectTitle} ${titles.gradeTitle} ${titles.boardTitle}`

  setPageDescribe(type, titles, joinTextTitles)
  setPageTitle(type, titles, joinTextTitles)

  useHead(() => ({
    title: pageTitle.value,
    meta: [
      {
        hid: 'apple-mobile-web-app-title',
        name: 'apple-mobile-web-app-title',
        content: pageTitle.value,
      },
      {
        hid: 'og:title',
        name: 'og:title',
        content: pageTitle.value,
      },
      {
        hid: 'og:site_name',
        name: 'og:site_name',
        content: 'GamaTrain',
      },
      {
        hid: 'description',
        name: 'description',
        content: pageDescribe.value,
      },
      {
        hid: 'og:description',
        name: 'og:description',
        content: pageDescribe.value,
      },
    ],
  }))
}

const setPageTitle = (type, titles, joinTextTitles) => {
  const titleTemplates = {
    learnfiles: {
      dynamic: `${joinTextTitles} multimedia`,
      fallback:
        'Multimedia Interactive Educational Content; PowerPoint, Video, Class Voice, GamaTrain',
    },
    test: {
      dynamic: `${joinTextTitles} Past Papers`,
      fallback: 'Educational Resources | K12 Education Papers and Materials',
    },
    question: {
      dynamic: `${joinTextTitles} Forum`,
      fallback:
        'Seek Clarification, Expand Your Understanding: GamaTrain\'s Q&A Forum',
    },
    azmoon: {
      dynamic: `${joinTextTitles} Online test`,
      fallback: 'Online Exams, Free Exams for Improving Education',
    },
    dars: {
      dynamic: `${joinTextTitles} Textbook`,
      fallback:
        'Master Concepts, Enhance Learning: GamaTrain\'s Online Tutorials',
    },
    tutor: {
      dynamic: `${joinTextTitles} Teacher`,
      fallback: 'Teacher',
    },
    default: {
      dynamic: `${joinTextTitles} Past Papers`,
      fallback: 'Educational Resources | K12 Education Papers and Materials',
    },
  }

  const template = titleTemplates[type] || titleTemplates.default

  pageTitle.value = titles.boardTitle ? template.dynamic : template.fallback
}

const pageDescriptions = {
  learnfiles:
    'Elevate your learning experience with GamaTrain\'s captivating multimedia content, including PowerPoint presentations, informative videos, and diverse educational materials.',
  test: 'Enhance your learning with GamaTrain\'s extensive collection of online documents and texts, carefully curated to enrich your academic journey.',
  question:
    'Engage in active learning and gain deeper insights through GamaTrain\'s interactive Q&A platform, where you can pose questions and seek support from fellow learners and experts.',
  azmoon:
    'Hone your skills and assess your knowledge with GamaTrain\'s online exams, designed to enhance your exam preparation and boost your confidence.',
  dars: 'Complement your studies with GamaTrain\'s comprehensive online tutorials, providing step-by-step guidance and practice opportunities to refine your understanding.',
  tutor: 'Teacher',
}

const setPageDescribe = (type, titles, joinTextTitles) => {
  const descriptionTemplates = {
    learnfiles: {
      dynamic: `Free download list of ${joinTextTitles}  multimedia. Includes mark scheme for exam preparation.`,
    },
    test: {
      dynamic: `Free download list of ${joinTextTitles} Past Papers. Includes mark scheme for exam preparation.`,
    },
    question: {
      dynamic: `Free download list of ${joinTextTitles} Forum. Includes mark scheme for exam preparation.`,
    },
    azmoon: {
      dynamic: `Free download list of ${joinTextTitles} Online test. Includes mark scheme for exam preparation.`,
    },
    dars: {
      dynamic: `Free download list of ${joinTextTitles} Textbook. Includes mark scheme for exam preparation.`,
    },
    tutor: {
      dynamic: `Free download list of ${joinTextTitles} Teacher. Includes mark scheme for exam preparation.`,
    },
    default: {
      dynamic: `Free download list of ${joinTextTitles} Past Papers. Includes mark scheme for exam preparation.`,
    },
  }

  const template = descriptionTemplates[type] || descriptionTemplates.default

  pageDescribe.value = titles.boardTitle
    ? template.dynamic
    : pageDescriptions[type]
}

setMetaData(route.query.type)
</script>

<style scoped>
.margin-top-handle {
  margin-top: 64px;
  min-height: calc(100vh - 64px);
}

:deep(.custom-search-text-field .v-field__outline__start) {
  border-radius: 24px 0 0 24px !important;
  flex: 0 0 30px !important;
}
:deep(.custom-search-text-field .v-field__outline__end) {
  border-radius: 0 4px 4px 0 !important;
}

:deep(.height-badge .v-badge__wrapper .v-badge__badge) {
  height: 20px !important;
}
.max-width-container {
  max-width: 1200px;
}
@media (min-width: 960px) {
  .margin-top-handle {
    margin-top: 6.4rem;
    min-height: calc(100vh - 6.4rem);
  }
}
</style>
