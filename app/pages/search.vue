<template>
  <v-container class="flex-column margin-top-handle">
    <v-row class="justify-center">
      <div class="w-100 d-flex justify-center flex-wrap top-info-div">
        <CommonFilterList
          :filter-list="filters"
          :count-data-found="totalDataFind"
          :loading="isInitialDataLoading"
          has-keyword-search
          @change-filter="changeFilter"
        >
          <div
            class="w-100 d-flex flex-column align-start ga-2 px-2 max-width-container"
          >
            <h1 class="text-h6 text-md-h5 pt-2">
              {{ metadata.title }}
            </h1>

            <CommonDetailSubjectDirectoryNav :content-data="data[0]" />
          </div>
        </CommonFilterList>
      </div>

      <search-list
        v-if="data.length > 0"
        :data-list="data"
        :is-initial-loading="isInitialDataLoading"
        :is-pagination-loading="isPaginationDataLoading"
        :is-all-data-loaded="isAllDataLoaded"
        :is-previous-loading="isPreviousLoading"
        :first-loaded-page-number="firstLoadedPageNumber"
        @load-next-page="loadNextPageData"
        @load-previous-page="loadPreviousPageData"
      />

      <div
        v-else
        class="w-100 d-flex flex-column align-center justify-center ga-4 mt-16"
      >
        <span class="text-h4 font-weight-bold">Be the first to add content to this category.</span>
        <v-btn
          class="text-h5 font-weight-bold"
          width="250"
          color="info"
          rounded="pill"
          flat
          variant="tonal"
          @click="createLinkAddConent()"
        >
          <v-icon color="info">
            md:add
          </v-icon>
          Add
        </v-btn>
      </div>
    </v-row>
  </v-container>
</template>

<script setup>
import dayjs from 'dayjs'
import { useRoute } from 'vue-router'

const route = useRoute()
const router = useRouter()

const getEquivalentNewType = (type) => {
  switch (type) {
    case 'test':
      return 'paper'
    case 'learnfiles':
      return 'multimedia'
    case 'azmoon':
      return 'quizhub'
    case 'question':
      return 'forum'
    case 'dars':
      return 'tutorial'
    case 'paper':
      return 'paper'
    case 'multimedia':
      return 'multimedia'
    case 'quizhub':
      return 'quizhub'
    case 'forum':
      return 'forum'
    case 'tutorial':
      return 'tutorial'
    default:
      return 'paper'
  }
}
const getEquivalentOldType = (type) => {
  switch (type) {
    case 'paper':
      return 'test'
    case 'multimedia':
      return 'learnfiles'
    case 'quizhub':
      return 'azmoon'
    case 'forum':
      return 'question'
    case 'tutorial':
      return 'dars'
    case 'test':
      return 'test'
    case 'learnfiles':
      return 'learnfiles'
    case 'azmoon':
      return 'azmoon'
    case 'question':
      return 'question'
    case 'dars':
      return 'dars'
    default:
      return 'test'
  }
}

const querySearch = ref({
  title: route.query.title,
  section: route.query.section,
  base: route.query.base,
  lesson: route.query.lesson,
  topic: route.query.topic,
  type: getEquivalentNewType(route.query.type),
  edu_year: route.query.edu_year,
  edu_month: route.query.edu_month,
  page: Number(route.query.page) || 1,
})
if (route.query.type && getEquivalentOldType(route.query.type) == 'learnfiles') {
  querySearch.value.content_type = route.query.content_type
}
if (route.query.type && getEquivalentOldType(route.query.type == 'test')) {
  querySearch.value.test_type = route.query.test_type
}
const isInitialDataLoading = ref(false)
const isPaginationDataLoading = ref(false)
const isPreviousLoading = ref(false)
const data = ref([])
const isAllDataLoaded = ref(false)
const totalDataFind = ref(0)
const perPage = 10
const firstLoadedPageNumber = ref(Number(route.query.page) || 1)
const latestLoadedPageNumber = ref(Number(route.query.page) || 1)

const loadNextPageData = async () => {
  latestLoadedPageNumber.value += 1
  querySearch.value.page = latestLoadedPageNumber.value
  const query = { ...route.query }

  query.page = querySearch.value.page
  router.replace({ query })
  isPaginationDataLoading.value = true
  const responseList = await getDataList()
  data.value = [...data.value, ...responseList]
}

const loadPreviousPageData = async () => {
  firstLoadedPageNumber.value -= 1

  querySearch.value.page = firstLoadedPageNumber.value
  const query = { ...route.query }

  query.page = querySearch.value.page
  router.replace({ query })
  isPreviousLoading.value = true
  const responseList = await getDataList()
  data.value = [...responseList, ...data.value]
}

const { data: initialData, pending: _loadingDataServer } = await useAsyncData(
  'dataSearchSSR',
  () => {
    const params = {
      page: Number(route.query.page) || 1,
      title: route.query.title,
      section: route.query.section,
      base: route.query.base,
      lesson: route.query.lesson,
      topic: route.query.topic,
      type: getEquivalentOldType(route.query.type),
      edu_year: route.query.edu_year,
      edu_month: route.query.edu_month,
    }

    if (route.query.type && getEquivalentOldType(route.query.type) == 'learnfiles') {
      params.content_type = route.query.content_type
    }
    if (route.query.type && getEquivalentOldType(route.query.type) == 'test') {
      params.test_type = route.query.test_type
    }

    return useApiService.get('/api/v1/search', params)
  },
)

watchEffect(() => {
  if (initialData.value) {
    data.value = initialData.value.data.list
  }
})

if (initialData.value) {
  data.value = initialData.value.data.list
  totalDataFind.value = initialData.value.data.num || 0
  isInitialDataLoading.value = false
  isPaginationDataLoading.value = false
}

const getDataList = async () => {
  if (isAllDataLoaded.value) return
  try {
    const params = { ...querySearch.value, type: getEquivalentOldType(querySearch.value.type) }
    const response = await useApiService.get('/api/v1/search', params)

    if (response.data.list.length < perPage) {
      isAllDataLoaded.value = true
    }
    totalDataFind.value = response.data.num ? response.data.num : 0

    return response.data.list
  }
  catch (err) {
    console.error(err)
    return []
  }
  finally {
    isPaginationDataLoading.value = false
    isInitialDataLoading.value = false
    isPreviousLoading.value = false
  }
}

const allMonths = [
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

const specialMonths = {
  4161: [
    { id: 3, title: 'March' },
    { id: 6, title: 'May/Jun' },
    { id: 11, title: 'Oct/Nov' },
  ],
  22: [
    { id: 3, title: 'March' },
    { id: 6, title: 'May/Jun' },
    { id: 11, title: 'Oct/Nov' },
  ],
  6374: [
    { id: 6, title: 'May/Jun' },
    { id: 11, title: 'Oct/Nov' },
  ],
  23: [
    { id: 6, title: 'May/Jun' },
    { id: 11, title: 'Oct/Nov' },
  ],
  6533: [
    { id: 6, title: 'May/Jun' },
    { id: 11, title: 'Oct/Nov' },
  ],
  6635: [
    { id: 4, title: 'April' },
    { id: 10, title: 'October' },
  ],
  6639: [
    { id: 4, title: 'April' },
    { id: 10, title: 'October' },
  ],
  // AQA-GCSE
  6672: [
    { id: 6, title: 'June' },
    { id: 11, title: 'November' },
  ],
  // AQA-AS LEVEL
  6673: [{ id: 6, title: 'June' }],
  // AQA-A LEVEL
  6674: [{ id: 6, title: 'June' }],
  // OCR GCSE
  6676: [
    { id: 6, title: 'June' },
    { id: 11, title: 'November' },
  ],
  // OCR AS LEVEL
  6677: [
    { id: 6, title: 'June' },
    { id: 11, title: 'Oct/Nov' },
  ],
  // OCR A LEVEL
  6678: [
    { id: 6, title: 'June' },
    { id: 11, title: 'Oct/Nov' },
  ],
  // Edexcel A LEVEL
  6671: [
    { id: 6, title: 'May/Jun' },
    { id: 11, title: 'Oct/Nov' },
  ],
  // Edexcel AS LEVEL
  6675: [
    { id: 6, title: 'May/Jun' },
    { id: 11, title: 'Oct/Nov' },
  ],
  // Edexcel GCSE
  6669: [
    { id: 6, title: 'May/Jun' },
    { id: 11, title: 'Oct/Nov' },
  ],
  // Edexcel International A/AS LEVEL
  6670: [
    { id: 1, title: 'January' },
    { id: 4, title: 'April' },
    { id: 6, title: 'June' },
    { id: 10, title: 'October' },
    { id: 11, title: 'November' },
  ],
  // Edexcel International GCSE
  6668: [
    { id: 1, title: 'January' },
    { id: 4, title: 'April' },
    { id: 6, title: 'June' },
    { id: 10, title: 'October' },
    { id: 11, title: 'November' },
  ],
}
const FILTER_INDEX = {
  Board: 0,
  Grade: 1,
  Subject: 2,
  Topic: 3,
  Services: 4,
  Classification: 5,
  Year: 6,
  Month: 7,
}
const filters = [
  {
    selectedItem: null,
    title: 'Board',
    disabled: false,
    hasSearch: true,
    refElement: null,
    api: '/api/v1/types/list',
    idInParams: false,
    extraApiParams: {
      type: `section`,
    },
    queryKey: 'section',
    children: [FILTER_INDEX.Grade, FILTER_INDEX.Classification],
    closable: true,
  },
  {
    selectedItem: null,
    title: 'Grade',
    disabled: true,
    hasSearch: true,
    refElement: null,
    api: '/api/v1/types/list',
    idInParams: false,
    extraApiParams: {
      type: `base`,
    },
    dependencies: [
      { parent: FILTER_INDEX.Board, targetKey: 'section_id', sourceKey: 'id' },
    ],
    queryKey: 'base',
    children: [FILTER_INDEX.Subject],
    childrenForGetStaticData: [FILTER_INDEX.Month],
    closable: true,
  },
  {
    selectedItem: null,
    title: 'Subject',
    disabled: true,
    hasSearch: true,
    refElement: null,
    api: '/api/v1/types/list',
    idInParams: false,
    extraApiParams: {
      type: `lesson`,
    },
    dependencies: [
      { parent: FILTER_INDEX.Grade, targetKey: 'base_id', sourceKey: 'id' },
    ],
    queryKey: 'lesson',
    children: [FILTER_INDEX.Topic],
    closable: true,
  },
  {
    selectedItem: null,
    title: 'Topic',
    disabled: true,
    hasSearch: true,
    refElement: null,
    api: '/api/v1/types/list',
    idInParams: false,
    extraApiParams: {
      type: `topic`,
    },
    dependencies: [
      { parent: FILTER_INDEX.Subject, targetKey: 'lesson_id', sourceKey: 'id' },
    ],
    queryKey: 'topic',
    children: [],
    closable: true,
  },
  {
    selectedItem: null,
    title: 'Services',
    disabled: false,
    hasSearch: false,
    refElement: null,
    api: null,
    idInParams: false,
    extraApiParams: {},
    dependencies: [],
    staticList: [
      {
        title: 'Past Papers',
        id: 'paper',
        icon: 'stat-icon icon-paper',
        color: '#2e90fa',
        idClassification: 'test_type',
      },
      {
        title: 'Multimedia',
        id: 'multimedia',
        icon: 'stat-icon icon-multimedia',
        color: '#02b719',
        idClassification: 'content_type',
      },
      {
        title: 'QuizHub',
        id: 'quizhub',
        icon: 'stat-icon icon-exam',
        color: '#7c4dff',
        idClassification: 'test_type',
      },
      {
        title: 'Forum',
        id: 'forum',
        icon: 'stat-icon icon-q-a',
        color: '#fdb022',
        idClassification: null,
      },
      {
        title: 'Tutorial',
        id: 'tutorial',
        icon: 'stat-icon icon-tutorial',
        color: '#2e90fa',
        idClassification: null,
      },
    ],
    queryKey: 'type',
    children: [
      FILTER_INDEX.Classification,
      FILTER_INDEX.Year,
      FILTER_INDEX.Month,
    ],
    closable: false,
    defaultValue: {
      title: 'Past Papers',
      id: 'paper',
      icon: 'stat-icon icon-paper',
      color: '#2e90fa',
      idClassification: 'test_type',
    },
  },
  {
    selectedItem: null,
    title: 'Classification',
    disabled: true,
    hasSearch: true,
    refElement: null,
    api: '/api/v1/types/list',
    idInParams: false,
    extraApiParams: {},
    dependencies: [
      { parent: FILTER_INDEX.Board, targetKey: 'section_id', sourceKey: 'id' },
      {
        parent: FILTER_INDEX.Services,
        targetKey: 'type',
        sourceKey: 'idClassification',
        disableIds: ['dars', 'question', 'tutorial', 'forum'],
      },
    ],
    queryMap: {
      test: 'test_type',
      azmoon: 'test_type',
      learnfiles: 'content_type',
      paper: 'test_type',
      quizhub: 'test_type',
      multimedia: 'content_type',
    },
    parentIndexChangeQueryKey: FILTER_INDEX.Services,
    queryKey: 'test_type',
    children: [],
    closable: true,
  },
  {
    selectedItem: null,
    title: 'Year',
    disabled: true,
    hasSearch: true,
    refElement: null,
    api: null,
    idInParams: false,
    extraApiParams: {},
    dependencies: [
      {
        parent: FILTER_INDEX.Services,
        targetKey: 'type',
        sourceKey: 'id',
        disableIds: ['learnfiles', 'dars', 'question', 'multimedia', 'tutorial', 'forum'],
      },
    ],
    staticList: Array.from({ length: 13 }, (_, i) => 2013 + i)
      .reverse()
      .map(year => ({
        title: `${year}`,
        id: year,
      })),
    queryKey: 'edu_year',
    closable: true,
    children: [],
  },
  {
    selectedItem: null,
    title: 'Month',
    disabled: true,
    hasSearch: true,
    refElement: null,
    api: null,
    idInParams: false,
    extraApiParams: {},
    dependencies: [
      {
        parent: FILTER_INDEX.Services,
        targetKey: 'type',
        sourceKey: 'id',
        disableIds: ['learnfiles', 'dars', 'question', 'multimedia', 'tutorial', 'forum'],
      },
    ],
    staticList: [],
    dependenciesForGetStaticData: [FILTER_INDEX.Grade],
    getStaticList: (id = route.query.base) => {
      const gradeId = id ? id : route.query.base
      return gradeId && specialMonths[gradeId]
        ? specialMonths[gradeId]
        : allMonths
    },
    queryKey: 'edu_month',
    closable: true,
    children: [],
  },
]

const changeFilter = async (query) => {
  isAllDataLoaded.value = false
  isInitialDataLoading.value = true
  firstLoadedPageNumber.value = 1
  latestLoadedPageNumber.value = 1
  querySearch.value = { ...query, page: 1 }
  const responseList = await getDataList()
  data.value = responseList
}

// Computed metadata that updates when data changes
const metadata = computed(() => {
  const { section, base, lesson, test_type, edu_year, edu_month } = route.query
  const firstElement = data.value[0]

  let monthTitle = edu_month
    ? dayjs()
        .month(edu_month - 1)
        .format('MMMM')
    : ''
  if (base && edu_month) {
    const monthList = specialMonths[base]
    if (monthList && monthList.length > 0) {
      const month = monthList.filter(item => item.id == edu_month)
      if (month.length > 0) {
        monthTitle = month[0].title
      }
    }
  }

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
    monthTitle: monthTitle,
    is_paper: firstElement?.is_paper,
  }

  if (
    (getEquivalentOldType(route.query.type) == 'test' || getEquivalentOldType(route.query.type) == 'azmoon')
    && test_type
  ) {
    titles.classificationTitle
      = firstElement?.test_type_title || firstElement?.azmoon_type_title
  }

  const joinTextTitles = `${titles.monthTitle} ${titles.yearTitle} ${titles.classificationTitle} ${titles.subjectTitle} ${titles.gradeTitle} ${titles.boardTitle}`

  // Generate title
  let appendText = ''
  if (titles.is_paper) {
    appendText = 'Past Papers'
  }

  const titleTemplates = {
    learnfiles: {
      dynamic: `${joinTextTitles} multimedia`,
      fallback:
        'Multimedia Interactive Educational Content; PowerPoint, Video, Class Voice, GamaTrain',
    },
    test: {
      dynamic: `${joinTextTitles} ${appendText}`,
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

  const template = titleTemplates[getEquivalentOldType(route.query.type)] || titleTemplates.default
  const title = titles.boardTitle ? template.dynamic : template.fallback

  // Generate description
  let descAppendText = ''
  if (titles.is_paper) {
    descAppendText = 'Includes mark scheme for exam preparation.'
  }
  else {
    descAppendText = 'Useful for study, practice, and exam preparation.'
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

  const descriptionTemplates = {
    learnfiles: {
      dynamic: `Free download list of ${joinTextTitles}  multimedia. ${descAppendText}`,
    },
    test: {
      dynamic: `Free download list of ${joinTextTitles} ${appendText}. ${descAppendText}`,
    },
    question: {
      dynamic: `Free download list of ${joinTextTitles} Forum. ${descAppendText}`,
    },
    azmoon: {
      dynamic: `Free download list of ${joinTextTitles} Online test. ${descAppendText}`,
    },
    dars: {
      dynamic: `Free download list of ${joinTextTitles} Textbook. ${descAppendText}`,
    },
    tutor: {
      dynamic: `Free download list of ${joinTextTitles} Teacher. ${descAppendText}`,
    },
    default: {
      dynamic: `Free download list of ${joinTextTitles} ${appendText}. ${descAppendText}`,
    },
  }

  const descTemplate
    = descriptionTemplates[getEquivalentOldType(route.query.type)] || descriptionTemplates.default
  const description = titles.boardTitle
    ? descTemplate.dynamic
    : pageDescriptions[getEquivalentOldType(route.query.type)] || pageDescriptions.test

  return { title, description }
})

// Reactive useHead that updates when metadata changes
useHead(() => ({
  title: metadata.value.title,
  meta: [
    {
      hid: 'apple-mobile-web-app-title',
      name: 'apple-mobile-web-app-title',
      content: metadata.value.title,
    },
    {
      hid: 'og:title',
      name: 'og:title',
      content: metadata.value.title,
    },
    {
      hid: 'og:site_name',
      name: 'og:site_name',
      content: 'GamaTrain',
    },
    {
      hid: 'description',
      name: 'description',
      content: metadata.value.description,
    },
    {
      hid: 'og:description',
      name: 'og:description',
      content: metadata.value.description,
    },
  ],
}))

const createLinkAddConent = () => {
  const auth = useAuth()
  const router = useRouter()
  if (!auth.isAuthenticated.value)

    router.push({ query: { auth_form: 'login' } })
  else {
    const type = getEquivalentOldType(route.query.type)
    let link = ''
    switch (type) {
      case 'test':
        link = '/user/paper/create'
        break
      case 'learnfiles':
        link = '/user/multimedia/create'
        break
      case 'azmoon':
        link = '/test-maker/create'
        break
      case 'question':
        link = '/user/question/create'
        break
      case 'dars':
        link = '/user/paper/create'
        break

      default:
        link = '/user/paper/create'
        break
    }
    navigateTo(link)
  }
}

onMounted(() => {
  const oldType = ['test', 'learnfiles', 'azmoon', 'question', 'dars']
  if (oldType.includes(route.query.type)) {
    const newType = getEquivalentNewType(route.query.type)
    const staticListFilterType = filters[FILTER_INDEX.Services].staticList
    const selectedType = staticListFilterType.filter(item => item.id == newType)[0]
    filters[FILTER_INDEX.Services].selectedItem = selectedType
    const newQuery = {
      ...route.query,
      type: newType,
    }
    router.replace({ query: newQuery })
  }
})
</script>

<style scoped>
.top-info-div {
  position: sticky;
  top: 64px;
  background-color: white;
  z-index: 2;
}
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
