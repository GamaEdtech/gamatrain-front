<template>
  <v-container class="flex-column margin-top-handle">
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
          @change-filter-for-bread-crumb="updatePaperContext"
        />
      </v-col>
      <!-- End Filter -->
    </v-row>

    <v-row>
      <resources
        :context="{ ...paperContext, subjectTitle: titleLesson }"
        :data="resourcesData"
        :is-loading="isLoadingResources || isChangingSubject"
        :error="Boolean(resourceError)"
        @retry="refreshResources()"
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

const updatePaperContext = (board, grade, subject) => {
  paperContext.value = {
    subjectId: subject?.id || '',
    boardId: board?.code || '',
    gradeId: grade?.id || '',
    subjectTitle: subject?.title || '',
  }
}

const isChangingSubject = ref(false)
const { resourcesData, titleLesson, isLoadingResources, resourceError, refreshResources }
  = await useDirectoryResources(paperContext)

const changeLoadingStatus = () => {
  isChangingSubject.value = true
  paperContext.value = { ...paperContext.value, subjectId: '' }
}

const changeSubject = (subject) => {
  paperContext.value = {
    ...paperContext.value,
    subjectId: subject?.id || '',
    subjectTitle: subject?.title || '',
  }
  isChangingSubject.value = false
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
