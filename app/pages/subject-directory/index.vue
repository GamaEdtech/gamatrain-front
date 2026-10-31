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
          :snapshot="snapshot"
          @select="select"
          @retry="refreshSelection()"
        />
      </div>
      <aside
        v-if="hasResources"
        class="directory-sidebar"
        aria-label="Additional study resources"
      >
        <ResourceCollections
          class="directory-sidebar__resources"
          :collections="collections"
          :is-loading="isLoadingResources"
          :error="Boolean(resourceError)"
          @retry="refreshResources()"
        />
      </aside>
      <div class="directory-paper-content">
        <paperTable
          :selection="selection"
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
import { useDirectorySelection } from '~/composables/useDirectorySelection'
import { getDirectoryCanonicalUrl, getDirectoryIntroduction } from '~/utils/directorySeo'

const { snapshot, selection, select, refresh: refreshSelection } = await useDirectorySelection()
const paperContext = computed(() => ({
  subjectId: selection.value?.subject.id || '',
  boardId: selection.value?.board.code || '',
  gradeId: selection.value?.grade.id || '',
  subjectTitle: selection.value?.subject.title || '',
}))

// Not awaited: the server still waits for it, in parallel with the papers.
const { collections, isLoadingResources, resourceError, refreshResources } = useDirectoryResources(paperContext)
const hasResources = computed(() => Boolean(isLoadingResources.value || resourceError.value || collections.value.length))

// SEO
const introduction = computed(() => getDirectoryIntroduction(selection.value))
const siteConfig = useSiteConfig()
const canonicalUrl = computed(() => getDirectoryCanonicalUrl(selection.value, siteConfig.url))

useSeoMeta({
  titleTemplate: '%s',
  title: () => introduction.value.seoTitle,
  description: () => introduction.value.description,
  ogTitle: () => introduction.value.seoTitle,
  ogDescription: () => introduction.value.description,
  ogUrl: () => canonicalUrl.value ?? undefined,
  ogType: 'website',
  ogSiteName: 'GamaTrain',
  appleMobileWebAppTitle: () => introduction.value.seoTitle,
})
useHead(() => ({
  link: canonicalUrl.value ? [{ key: 'directory-canonical', rel: 'canonical', href: canonicalUrl.value }] : [],
}))
</script>

<style scoped lang="scss">
@use 'sass:map';
@use 'vuetify/settings' as vuetify;

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
@media #{map.get(vuetify.$display-breakpoints, 'md-and-up')} {
  .margin-top-handle {
    margin-top: 6.4rem;
    min-height: calc(100vh - 6.4rem);
  }
}
@media #{map.get(vuetify.$display-breakpoints, 'sm-and-down')} {
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
