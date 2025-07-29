<template>
  <v-container class="flex-column margin-top-handle">
    <!-- Start BreadCrumb  -->
    <v-row>
      <breadcrumb
        :breads="breadsCrumb"
        background-color="transparent"
      />
    </v-row>
    <!-- End BreadCrumb -->

    <v-row class="justify-space-between flex-wrap">
      <!-- Start Filter -->
      <v-col
        cols="12"
        sm="8"
        md="8"
      >
        <filterPapers
          @change-status-loading="changeLoadingStatus"
          @change-subject="changeSubject"
          @change-filter-for-bread-crumb="changeFilterForBreadCrumb"
        />
      </v-col>
      <!-- End Filter -->
    </v-row>

    <v-row class="flex-column-reverse flex-sm-row">
      <resources
        :topical-data="topicalData"
        :data="resourcesData"
        :is-loading="isLoadingResources"
      />

      <!-- Start Image Lesson -->
      <v-col
        cols="12"
        sm="4"
        md="4"
        class="position-relative mt-0 mt-sm-n15"
      >
        <template v-if="isLoadingResources">
          <v-skeleton-loader type="image" />
        </template>
        <template v-else>
          <template v-if="imageLesson">
            <div
              :class="`d-flex justify-center w-100 h-100 mx-auto max-height-image`"
            >
              <NuxtImg
                width="300px"
                :src="imageLesson"
                placeholder
                class="rounded-lg w-100 h-100"
              />
            </div>
          </template>
        </template>
      </v-col>
      <!-- End Image Lesson -->
    </v-row>

    <v-row
      class="container-table-time-line d-flex flex-row justify-space-between justify-lg-space-between"
    >
      <v-col cols="10">
        <paperTable
          :desktop-header="headerPapersTableDesktop"
          :mobile-headers="headerPapersTableMobile"
          :is-loading-papers="isLoadingPapers"
          :is-loading-infinite-scroll="isLoadingInfiniteScroll"
          :is-all-data-loaded="isAllPapersLoaded"
          :data="papers"
          @load-next-page-data="fetchNextPagePapers"
        />
      </v-col>
      <v-col cols="2">
        <timeline
          :timeline="timelineData"
          :is-loading="loadingTimeline"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import breadcrumb from '~/components/widgets/breadcrumb.vue'
import resources from '~/components/subject-directory/resources.vue'
import paperTable from '~/components/subject-directory/paper-table.vue'
import timeline from '~/components/subject-directory/timeline.vue'
import filterPapers from '~/components/subject-directory/filter-papers.vue'

const route = useRoute()
const nuxtApp = useNuxtApp()

// Initial State Bread Crumb
const breadsCrumb = ref([
  {
    text: 'Subject Directory',
    disabled: true,
    href: '/search?type=test',
    name: 'type',
  },
])

const changeFilterForBreadCrumb = (board, grade, subject) => {
  if (board) {
    const newBoard = {
      text: board.title,
      disabled: true,
      href: `/search?type=test&section=${board.id}`,
      name: 'board',
    }
    breadsCrumb.value = breadsCrumb.value.filter(item => item.name == 'type')
    breadsCrumb.value.push(newBoard)
  }
  if (grade) {
    const newGrade = {
      text: grade.title,
      disabled: true,
      href: `/search?type=test&base=${grade.id}`,
      name: 'grade',
    }
    breadsCrumb.value = breadsCrumb.value.filter(
      item => item.name == 'type' || item.name == 'board',
    )
    breadsCrumb.value.push(newGrade)
  }
  if (subject) {
    const newSubject = {
      text: subject.title,
      disabled: true,
      href: `/search?type=test&lesson=${subject.id}`,
      name: 'subject',
    }
    breadsCrumb.value = breadsCrumb.value.filter(
      item =>
        item.name == 'type' || item.name == 'board' || item.name == 'grade',
    )
    breadsCrumb.value.push(newSubject)
  }
}

// Start Section Resources
const isLoadingResources = ref(true)

const titleLesson = ref('')
const resourcesData = ref([])
const topicalData = ref({
  label: 'Topical',
  icon: 'Topical.svg',
  items: [],
})
const imageLesson = ref(null)
// End Section Resources

// Start Section Papers
const isLoadingPapers = ref(true)
const isLoadingInfiniteScroll = ref(false)
const isAllPapersLoaded = ref(false)
const pageNumber = ref(1)
const perPage = 20
const papers = ref([])
const selectedSubjectId = ref(route.query.subject ? route.query.subject : '')
const headerPapersTableDesktop = [
  {
    title: 'Classification',
    align: 'start',
    value: 'name',
    icon: 'mdi-format-list-bulleted',
  },
  {
    title: 'Year',
    align: 'center',
    value: 'year',
    icon: 'mdi-format-list-bulleted',
  },
  {
    title: 'Term',
    align: 'center',
    value: 'term',
    icon: 'mdi-format-list-bulleted',
  },
  {
    title: 'Download Files',
    align: 'center',
    value: 'downloadFilesContains',
  },
  {
    title: 'ExamHub',
    align: 'center',
    value: 'examHubIcon',
  },
]
const headerPapersTableMobile = [
  { title: 'Classification', value: 'classification' },
  { title: 'Year', value: 'year' },
  { title: 'Term', value: 'term' },
]

const fetchNextPagePapers = async () => {
  if (selectedSubjectId.value && selectedSubjectId.value.length > 0) {
    try {
      isLoadingInfiniteScroll.value = true
      pageNumber.value += 1
      const endpointPapers = `api/v1/tests/search?lesson=${selectedSubjectId.value}&page=${pageNumber.value}&perpage=20&is_paper=true&directory=true`
      const responsePapers = await $fetch(endpointPapers)
      if (responsePapers) {
        if (responsePapers.data.list.length < perPage) {
          isAllPapersLoaded.value = true
        }
        papers.value = [...papers.value, ...responsePapers.data.list]

        generateTimeLine()
      }
    }
    catch (error) {
      console.error('Error fetching search results:', error)
    }
    finally {
      isLoadingInfiniteScroll.value = false
    }
  }
}
// End Section Papers

// Start Section Timeline
const loadingTimeline = ref(true)
const timelineData = ref([])
const generateTimeLine = () => {
  const sortedItems = [...papers.value].sort((a, b) => {
    const yearDiff = parseInt(b.edu_year) - parseInt(a.edu_year)
    if (yearDiff !== 0) return yearDiff
    return parseInt(b.edu_month) - parseInt(a.edu_month)
  })

  const timelineMap = {}
  let positionCounter = 0
  sortedItems.forEach((item) => {
    const year = parseInt(item.edu_year)
    const monthNumber = parseInt(item.edu_month)
    const month = nuxtApp
      .$dayjs()
      .month(monthNumber - 1)
      .format('MMM')

    if (!timelineMap[year]) {
      timelineMap[year] = { months: new Set(), positions: [] }
    }

    if (!timelineMap[year].months.has(month)) {
      timelineMap[year].positions.push(positionCounter)
    }

    timelineMap[year].months.add(month)
    positionCounter++
  })

  timelineData.value = Object.keys(timelineMap)
    .sort((a, b) => b - a)
    .map(year => ({
      year: parseInt(year),
      months: Array.from(timelineMap[year].months),
      positions: timelineMap[year].positions,
    }))
}

// End Section Timeline

const { data: lessonData, status: _status } = await useAsyncData(
  'lessonData',
  async () => {
    let resourcesData
    let papersData
    const subjectId = route.params.subject || route.query.subject
    if (subjectId) {
      try {
        const baseURL = `/api/v1/`
        const endpointResources = `${baseURL}tests/search?is_paper=false&directory=true&lesson=${subjectId}`

        const responseResource = await $fetch(endpointResources)
        if (responseResource.data) {
          resourcesData = responseResource.data
        }
        const endpointPapers = `${baseURL}tests/search?lesson=${subjectId}&page=1&perpage=20&is_paper=true&directory=true`
        const responsePapers = await $fetch(endpointPapers)
        if (responsePapers.data) {
          papersData = responsePapers.data.list
        }
      }
      catch (error) {
        if (error.response) {
          console.error('🔴 Response status:', error.response.status)
          console.error(
            '📄 Response data:',
            JSON.stringify(error.response.data, null, 2),
          )
          console.error('📋 Response headers:', error.response.headers)
        }
        else if (error.request) {
          console.error(
            '📡 No response received. Request object:',
            error.request,
          )
        }
        else {
          console.error('⚠️ Setup error:', error.message)
        }
        console.error('Error fetching data:', error)
      }
      finally {
        // Reset loading states after initial data fetch
        isLoadingResources.value = false
        isLoadingPapers.value = false
      }
    }
    return { resourcesData, papersData }
  },
)

if (lessonData.value?.resourcesData) {
  titleLesson.value = lessonData.value.resourcesData.lesson_title
  imageLesson.value = lessonData.value.resourcesData.lesson_pic
  resourcesData.value = lessonData.value.resourcesData.list
  const filterTopical = resourcesData.value.filter(
    item => item.title === 'Topical',
  )
  if (filterTopical.length > 0) {
    topicalData.value.items = filterTopical[0].items
  }
  isLoadingResources.value = false
}

if (lessonData.value?.papersData) {
  papers.value = lessonData.value.papersData
  isLoadingPapers.value = false
}

onMounted(async () => {
  if (!route.query.subject) {
    isLoadingResources.value = true
    isLoadingPapers.value = true
    loadingTimeline.value = true
  }
  if (papers.value.length > 0) {
    generateTimeLine()
  }
  loadingTimeline.value = false
})

const changeLoadingStatus = () => {
  isLoadingResources.value = true
  isLoadingPapers.value = true
  loadingTimeline.value = true
}

const resetParameter = () => {
  timelineData.value = []
  papers.value = []
  isAllPapersLoaded.value = false
  pageNumber.value = 1
  titleLesson.value = ''
  resourcesData.value = []
  topicalData.value.items = []
  imageLesson.value = null
}

const fetchDataForNewSubject = async (subject) => {
  try {
    isLoadingResources.value = true
    isLoadingPapers.value = true
    const endpointResources = `/api/v1/tests/search?is_paper=false&directory=true&lesson=${subject.id}`
    const endpointPapers = `/api/v1/tests/search?lesson=${subject.id}&page=1&perpage=20&is_paper=true&directory=true`

    const [responseResource, responsePapers] = await Promise.all([
      $fetch(endpointResources),
      $fetch(endpointPapers),
    ])

    if (responseResource.data) {
      titleLesson.value = responseResource.data.lesson_title
      imageLesson.value = responseResource.data.lesson_pic
      resourcesData.value = responseResource.data.list
      const filterTopical = resourcesData.value.filter(
        item => item.title === 'Topical',
      )
      if (filterTopical.length > 0) {
        topicalData.value.items = filterTopical[0].items
      }
    }

    if (responsePapers.data) {
      papers.value = responsePapers.data.list
      generateTimeLine()
    }
  }
  catch (error) {
    console.error('error', error)
  }
  finally {
    isLoadingResources.value = false
    loadingTimeline.value = false
    isLoadingPapers.value = false
  }
}

const changeSubject = (subject) => {
  resetParameter()
  if (subject && subject.id) {
    selectedSubjectId.value = subject.id
    fetchDataForNewSubject(subject)
  }
  else {
    isLoadingResources.value = false
    loadingTimeline.value = false
    isLoadingPapers.value = false
  }
}

// SEO
useHead({
  titleTemplate: '%s',
  title: `${titleLesson.value} Past Papers, Resources | Coursebook & Workbook – Free PDFs`,

  meta: [
    {
      hid: 'apple-mobile-web-app-title',
      name: 'apple-mobile-web-app-title',
      content: `${titleLesson.value} Past Papers, Resources | Coursebook & Workbook – Free PDFs`,
    },
    {
      hid: 'og:title',
      name: 'og:title',
      content: `${titleLesson.value} Past Papers, Resources | Coursebook & Workbook – Free PDFs`,
    },
    {
      hid: 'og:site_name',
      name: 'og:site_name',
      content: 'GamaTrain',
    },
    {
      hid: 'description',
      name: 'description',
      content: `Download free PDF resources for ${titleLesson.value}, including coursebook, workbook, study guide, and past papers with mark schemes. Updated for 2024 & 2025 exams.`,
    },
    {
      hid: 'og:description',
      name: 'og:description',
      content: `Download free PDF resources for ${titleLesson.value}, including coursebook, workbook, study guide, and past papers with mark schemes. Updated for 2024 & 2025 exams.`,
    },
  ],
})
</script>

<style scoped>
.margin-top-handle {
  margin-top: 64px;
  min-height: calc(100vh - 64px);
}
.max-height-image {
  max-width: 250px;
  max-height: 300px;
  min-height: 300px;
}
@media (min-width: 960px) {
  .margin-top-handle {
    margin-top: 6.4rem;
    min-height: calc(100vh - 6.4rem);
  }
}
</style>
