<template>
  <v-container class="flex-column margin-top-handle">
    <v-row class="justify-space-between flex-wrap">
      <!-- Start Filter -->
      <v-col
        cols="12"
        sm="8"
        md="8"
      >
        <SubjectCascader
          :state="selectorState"
          :columns="columns"
          :display-path="displayPath"
          :search="searchState"
          :search-results="searchResults"
          @open="setOpen"
          @select="selectOption"
          @navigate="selectorState.stage = $event"
          @retry="retry"
          @search="searchState.query = $event"
          @select-search="selectSearchResult"
          @retry-search="retrySearch"
        />
      </v-col>
      <!-- End Filter -->
    </v-row>

    <v-row>
      <ResourceCollections
        :context="{ ...paperContext, subjectTitle: titleLesson }"
        :data="resourcesData"
        :is-loading="isLoadingResources"
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

<script setup lang="ts">
import { computed } from 'vue'

import ResourceCollections from '~/components/subject-directory/ResourceCollections.vue'
import paperTable from '~/components/subject-directory/paper-table.vue'
import SubjectCascader from '~/components/subject-directory/SubjectCascader.vue'
import { useDirectoryCascader } from '~/composables/useDirectoryCascader'

const {
  state: selectorState, columns, displayPath, setOpen, selectOption, retry,
  searchState, searchResults, retrySearch, selectSearchResult,
} = await useDirectoryCascader()
const paperContext = computed(() => ({
  subjectId: selectorState.selection?.subject.id || '',
  boardId: selectorState.selection?.board.code || '',
  gradeId: selectorState.selection?.grade.id || '',
  subjectTitle: selectorState.selection?.subject.title || '',
}))

const { resourcesData, titleLesson, isLoadingResources, resourceError, refreshResources }
  = await useDirectoryResources(paperContext)

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
