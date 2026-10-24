<template>
  <v-container class="margin-top-handle bg-grey25 text-brandNavy">
    <div
      class="directory-layout text-left"
      :class="{ 'directory-layout--without-resources': !hasResources }"
    >
      <header class="directory-introduction">
        <h1 class="directory-title mb-2">
          {{ introduction.title }}
        </h1>
        <p class="directory-description opacity-70 ma-0">
          {{ introduction.description }}
        </p>
      </header>
      <div class="directory-selector">
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
      </div>
      <aside
        v-if="hasResources"
        class="directory-sidebar"
        aria-label="Additional study resources"
      >
        <ResourceCollections
          class="directory-sidebar__resources"
          :context="paperContext"
          :data="resourcesData"
          :is-loading="isLoadingResources"
          :error="Boolean(resourceError)"
          @retry="refreshResources()"
        />
      </aside>
      <div class="directory-paper-content">
        <paperTable
          :selection="selectorState.selection"
          :subject-id="paperContext.subjectId"
          :grade-id="paperContext.gradeId"
          :board-id="paperContext.boardId"
          :subject-title="paperContext.subjectTitle"
        />
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import ResourceCollections from '~/components/subject-directory/ResourceCollections.vue'
import paperTable from '~/components/subject-directory/paper-table.vue'
import SubjectCascader from '~/components/subject-directory/SubjectCascader.vue'
import { useDirectoryCascader } from '~/composables/useDirectoryCascader'
import { useDirectoryInitialPapers } from '~/composables/useDirectoryInitialPapers'
import { getDirectoryCanonicalUrl } from '~/utils/directoryCanonicalUrl'
import { getDirectoryIntroduction } from '~/utils/directoryPresentation'
import { getDirectoryResourceCollections } from '~/utils/directoryResources'

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

const introduction = computed(() => getDirectoryIntroduction(selectorState.selection))
const [resourceState] = await Promise.all([
  useDirectoryResources(paperContext),
  useDirectoryInitialPapers(paperContext.value),
])
const { resourcesData, isLoadingResources, resourceError, refreshResources } = resourceState
const hasResources = computed(() => Boolean(
  isLoadingResources.value || resourceError.value || getDirectoryResourceCollections(resourcesData.value).length,
))

// SEO
const siteConfig = useSiteConfig()
const canonicalUrl = computed(() => getDirectoryCanonicalUrl(selectorState.selection, siteConfig.url))

useHead(() => ({
  titleTemplate: '%s',
  title: introduction.value.seoTitle,
  link: canonicalUrl.value ? [{ key: 'directory-canonical', rel: 'canonical', href: canonicalUrl.value }] : [],

  meta: [
    ...(canonicalUrl.value ? [{ key: 'directory-og-url', property: 'og:url', content: canonicalUrl.value }] : []),
    {
      name: 'apple-mobile-web-app-title',
      content: introduction.value.seoTitle,
    },
    {
      property: 'og:title',
      content: introduction.value.seoTitle,
    },
    {
      property: 'og:site_name',
      content: 'GamaTrain',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      name: 'description',
      content: introduction.value.metaDescription,
    },
    {
      property: 'og:description',
      content: introduction.value.metaDescription,
    },
  ],
}))
</script>

<style scoped>
.margin-top-handle {
  margin-top: 64px;
  min-height: calc(100vh - 64px);
}
.directory-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  grid-template-areas:
    'introduction resources'
    'selector resources'
    'papers resources';
  gap: 24px;
  align-items: start;
}
.directory-introduction { grid-area: introduction; min-width: 0; }
.directory-selector { grid-area: selector; min-width: 0; }
.directory-paper-content { grid-area: papers; min-width: 0; }
.directory-sidebar { grid-area: resources; align-self: stretch; min-width: 0; }
.directory-sidebar__resources {
  position: sticky;
  top: 80px;
}
.directory-title {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.25;
  overflow-wrap: anywhere;
}
.directory-description {
  font-size: 14px;
  line-height: 1.5;
}
@media (min-width: 960px) {
  .margin-top-handle {
    margin-top: 6.4rem;
    min-height: calc(100vh - 6.4rem);
  }
}
@media (max-width: 959px) {
  .directory-layout {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: 'introduction' 'selector' 'papers' 'resources';
    gap: 20px;
  }
  .directory-layout--without-resources {
    grid-template-areas: 'introduction' 'selector' 'papers';
  }
  .directory-sidebar__resources { position: static; }
  .directory-title { font-size: 20px; }
}
</style>
