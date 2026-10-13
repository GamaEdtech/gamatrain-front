<template>
  <div class="directory-paper-row position-relative align-center">
    <NuxtLink
      :to="getDirectoryPaperLink(paper)"
      class="directory-paper-link d-flex flex-column justify-center text-decoration-none text-brandNavy"
      :title="paper.title"
    >
      <span class="directory-paper-title font-weight-bold">{{ getDirectoryPaperTitle(paper) }}</span>
      <span
        v-if="paperCode"
        class="directory-paper-code opacity-70"
      >{{ paperCode }}</span>
    </NuxtLink>

    <div class="directory-paper-actions d-flex flex-wrap align-center ga-2">
      <div
        v-if="examIds.length"
        class="directory-exam-cell"
      >
        <v-btn
          v-if="examIds.length === 1"
          :to="`/exam/${examIds[0]}`"
          class="directory-action directory-exam-button text-none font-weight-regular"
          color="brandNavy"
          variant="flat"
          height="40"
        >
          <v-icon
            size="20"
            color="primary"
            class="mr-1"
          >
            md:sensors
          </v-icon>
          Online Exam
          <v-icon
            size="20"
            class="ml-1"
          >
            md:chevron_right
          </v-icon>
        </v-btn>
        <v-menu v-else-if="examIds.length > 1">
          <template #activator="{ props: menuProps }">
            <v-btn
              v-bind="menuProps"
              class="directory-action directory-exam-button text-none font-weight-regular"
              color="brandNavy"
              variant="flat"
              height="40"
            >
              <v-icon
                size="20"
                color="primary"
                class="mr-1"
              >
                md:sensors
              </v-icon>
              Online Exam
              <v-icon
                size="20"
                class="ml-1"
              >
                md:chevron_right
              </v-icon>
            </v-btn>
          </template>
          <v-list
            class="directory-exam-menu text-brandNavy"
            bg-color="grey25"
            aria-label="Connected online exams"
          >
            <v-list-item
              v-for="(id, index) in examIds"
              :key="id"
              :to="`/exam/${id}`"
              :title="`Online Exam ${index + 1}`"
            />
          </v-list>
        </v-menu>
      </div>

      <div class="directory-downloads">
        <v-btn
          v-for="file in files"
          :key="file.type"
          class="directory-action directory-download text-none font-weight-regular flex-shrink-0"
          :class="`directory-download--${file.style}`"
          variant="flat"
          height="40"
          :loading="downloads.isDownloading(paper, file.type)"
          :disabled="downloads.isBusy && !downloads.isDownloading(paper, file.type)"
          :aria-label="`${file.title} — ${getDirectoryPaperTitle(paper)}${file.price ? ` — ${file.price} gems` : ''}`"
          @click="downloads.handleDownload(file.type, paper)"
        >
          <v-icon
            :icon="file.icon"
            size="20"
            class="mr-1"
            :class="{ 'directory-insert-icon': file.icon === 'md:attach_file' }"
          />
          <span class="directory-download__title">{{ file.title }}</span>
          <CommonPriceWithGem
            :price="file.price"
            :color="file.style === 'question' ? 'white' : 'brandNavy'"
            class="directory-download__price d-inline-flex align-center ga-1 ml-2"
          />
          <template #loader>
            <v-progress-circular
              :model-value="downloads.getDownloadProgress(paper, file.type)"
              size="20"
              width="2"
            />
          </template>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { UnwrapRef } from 'vue'
import type { DirectoryPaper } from '~/types/subject-directory/paperFiles'
import type { useDirectoryPaperDownloads } from '~/composables/useDirectoryPaperDownloads'
import {
  getDirectoryExamIds, getDirectoryPaperCode, getDirectoryPaperDownloads,
  getDirectoryPaperLink, getDirectoryPaperTitle,
} from '~/utils/directoryPapers'

const props = withDefaults(defineProps<{
  paper: DirectoryPaper
  subjectTitle?: string
  downloads: UnwrapRef<ReturnType<typeof useDirectoryPaperDownloads>>
}>(), { subjectTitle: '' })
const files = computed(() => [...getDirectoryPaperDownloads(props.paper)].reverse())
const examIds = computed(() => getDirectoryExamIds(props.paper.exam_id))
const paperCode = computed(() => getDirectoryPaperCode(props.paper, props.subjectTitle))
</script>

<style scoped>
.directory-paper-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  min-width: 0;
  min-height: 56px;
  padding: 8px 0 8px var(--directory-session-text-offset, 56px);
  transition: background-color 150ms ease;
}

.directory-paper-row:hover,
.directory-paper-row:focus-within {
  background-color: rgb(var(--v-theme-surfaceSecondary));
}

.directory-paper-link::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 4px;
}

.directory-paper-link:focus-visible {
  outline: none;
}

.directory-paper-link:focus-visible::after {
  outline: 3px solid rgb(var(--v-theme-primary) / 28%);
  outline-offset: -3px;
}

.directory-paper-link {
  min-width: 0;
  flex: 1 1 100px;
  overflow-wrap: anywhere;
}

.directory-paper-title {
  font-size: 16px;
  line-height: 20px;
}

.directory-paper-code {
  font-size: 13px;
  line-height: 18px;
}

.directory-action {
  position: relative;
  z-index: 1;
  border-radius: 8px;
  max-width: 100%;
  font-size: 12px;
  letter-spacing: normal;
}

.directory-exam-button {
  width: 100%;
  padding-inline: 8px;
}

.directory-paper-actions {
  min-width: 0;
  flex: 3 1 480px;
}
.directory-exam-cell {
  flex: 0 0 140px;
  max-width: 100%;
}

.directory-action :deep(.v-btn__content) {
  white-space: normal;
  overflow-wrap: anywhere;
}

.directory-downloads {
  display: flex;
  flex: 1 1 310px;
  flex-direction: row-reverse;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.directory-download {
  padding-inline: 8px;
  border: 1px solid rgb(var(--v-theme-borderSubtle));
  color: rgb(var(--v-theme-brandNavy));
  background-color: rgb(var(--v-theme-white));
  height: auto !important;
  min-height: 40px;
  padding-block: 6px;
}

.directory-download__title {
  min-width: 0;
  overflow-wrap: anywhere;
}

.directory-download__price {
  flex-shrink: 0;
  white-space: nowrap;
}

.directory-download--extra {
  background-color: rgb(var(--v-theme-surfaceTertiary));
}

.directory-download--answer {
  background-color: rgb(var(--v-theme-surfaceTertiary));
}

.directory-download--question {
  color: rgb(var(--v-theme-white));
  background-color: rgb(var(--v-theme-brandNavy));
  border-color: rgb(var(--v-theme-brandNavy));
}

.directory-exam-menu {
  border: 1px solid rgb(var(--v-theme-borderSubtle));
  border-radius: 12px !important;
  box-shadow: 0 20px 48px rgb(var(--v-theme-brandNavy) / 16%);
}

.directory-insert-icon {
  transform: rotate(45deg);
}

@media (prefers-reduced-motion: reduce) {
  .directory-paper-row {
    transition: none;
  }
}
</style>
