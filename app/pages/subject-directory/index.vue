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

    <v-row>
      <resources
        :topical-data="topicalData"
        :data="resourcesData"
        :is-loading="isLoadingResources"
      />
    </v-row>

    <v-row>
      <v-col cols="12">
        <paperTable
          :subject-id="paperContext.subjectId"
          :grade-id="paperContext.gradeId"
          :board-id="paperContext.boardId"
          :subject-title="paperContext.subjectTitle"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import breadcrumb from '~/components/widgets/breadcrumb.vue'
import resources from '~/components/subject-directory/resources.vue'
import paperTable from '~/components/subject-directory/paper-table.vue'
import filterPapers from '~/components/subject-directory/filter-papers.vue'

const route = useRoute()
const paperContext = ref({
  subjectId: route.params.subject || route.query.subject || '',
  boardId: route.query.board || '',
  gradeId: route.query.grade || '',
  subjectTitle: '',
})

// Initial State Bread Crumb
const breadsCrumb = ref([
  {
    text: 'Subject Directory',
    disabled: true,
    href: '/search?type=paper',
    name: 'type',
  },
])

const changeFilterForBreadCrumb = (board, grade, subject) => {
  paperContext.value = {
    subjectId: subject?.id || '',
    boardId: board?.code || '',
    gradeId: grade?.id || '',
    subjectTitle: subject?.title || '',
  }
  if (board) {
    const newBoard = {
      text: board.title,
      disabled: true,
      href: `/search?type=paper&section=${board.code}`,
      name: 'board',
    }
    breadsCrumb.value = breadsCrumb.value.filter(item => item.name == 'type')
    breadsCrumb.value.push(newBoard)
  }
  if (grade) {
    const newGrade = {
      text: grade.title,
      disabled: true,
      href: `/search?type=paper&base=${grade.id}`,
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
      href: `/search?type=paper&lesson=${subject.id}`,
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
// End Section Resources

const subjectId = route.params.subject || route.query.subject

const { data: resourcesResponse } = await useAsyncData(
  `resourcesData-${subjectId}`,
  async () => {
    if (!subjectId) return null
    const baseURL = `/api/v1/`
    const endpointResources = `${baseURL}tests/search?is_paper=false&directory=true&lesson=${subjectId}`
    return await useApiService.get(endpointResources)
  },
)

if (resourcesResponse.value?.data) {
  titleLesson.value = resourcesResponse.value.data.lesson_title
  resourcesData.value = resourcesResponse.value.data.list
  const filterTopical = resourcesData.value.filter(
    item => item.title === 'Topical',
  )
  if (filterTopical.length > 0) {
    topicalData.value.items = filterTopical[0].items
  }
  isLoadingResources.value = false
}

const changeLoadingStatus = () => {
  isLoadingResources.value = true
  paperContext.value = { ...paperContext.value, subjectId: '' }
}

const resetParameter = () => {
  titleLesson.value = ''
  resourcesData.value = []
  topicalData.value.items = []
}

const fetchDataForNewSubject = async (subject) => {
  try {
    isLoadingResources.value = true
    const endpointResources = `/api/v1/tests/search?is_paper=false&directory=true&lesson=${subject.id}`
    const responseResource = await useApiService.get(endpointResources)

    if (responseResource.data) {
      titleLesson.value = responseResource.data.lesson_title
      resourcesData.value = responseResource.data.list
      const filterTopical = resourcesData.value.filter(
        item => item.title === 'Topical',
      )
      if (filterTopical.length > 0) {
        topicalData.value.items = filterTopical[0].items
      }
    }
  }
  catch (error) {
    console.error('error', error)
  }
  finally {
    isLoadingResources.value = false
  }
}

const changeSubject = (subject) => {
  resetParameter()
  if (subject && subject.id) {
    paperContext.value = { ...paperContext.value, subjectId: subject.id, subjectTitle: subject.title || '' }
    fetchDataForNewSubject(subject)
  }
  else {
    isLoadingResources.value = false
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
@media (min-width: 960px) {
  .margin-top-handle {
    margin-top: 6.4rem;
    min-height: calc(100vh - 6.4rem);
  }
}
</style>
