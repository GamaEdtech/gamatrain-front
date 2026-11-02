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

    <div class="directory-paper-actions d-flex flex-nowrap align-center justify-end ga-2">
      <div
        v-if="examIds.length"
        class="directory-exam-cell"
      >
        <!-- One exam links straight to it; several open a menu of exams -->
        <v-btn
          :to="examIds.length === 1 ? getDirectoryExamLink(examIds[0]!) : undefined"
          class="directory-action directory-exam-button text-none font-weight-regular"
          variant="outlined"
          color="brandNavy"
          height="40"
          aria-label="Take exam"
          title="Online Exam"
          append-icon="md:arrow_forward"
        >
          <v-icon
            size="20"
            class="d-none d-md-inline-flex mr-1"
            aria-hidden="true"
          >
            md:sensors
          </v-icon>
          Take exam
          <v-menu
            v-if="examIds.length > 1"
            activator="parent"
          >
            <v-list
              bg-color="grey25"
              class="border border-borderSubtle border-opacity-100"
              rounded="lg"
              aria-label="Connected online exams"
            >
              <v-list-item
                v-for="(id, index) in examIds"
                :key="id"
                :to="getDirectoryExamLink(id)"
                :title="`Online Exam ${index + 1}`"
              />
            </v-list>
          </v-menu>
        </v-btn>
      </div>

      <div class="directory-downloads">
        <v-btn
          v-for="file in files"
          :key="file.type"
          class="directory-action directory-download text-none font-weight-regular flex-shrink-0"
          :color="file.style === 'question' ? 'brandNavy' : 'surfaceTertiary'"
          variant="flat"
          min-height="40"
          :loading="downloads.isActive(paper, file)"
          :disabled="Boolean(downloads.active) && !downloads.isActive(paper, file)"
          :title="file.title"
          :aria-label="`${file.title} — ${getDirectoryPaperTitle(paper)}${file.price ? ` — ${file.price} gems` : ''}`"
          @click="downloads.download(paper, file)"
        >
          <v-icon
            :icon="file.icon"
            size="20"
            class="mr-1"
            :class="{ 'directory-insert-icon': file.icon === 'md:attach_file' }"
          />
          <span class="directory-download__title">{{ file.shortTitle }}</span>
          <CommonPriceWithGem
            :price="file.price"
            :color="file.style === 'question' ? 'white' : 'brandNavy'"
            class="directory-download__price d-inline-flex align-center ga-1 ml-2"
          />
          <template #loader>
            <v-progress-circular
              :model-value="downloads.progress(paper, file)"
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
import type { DirectoryPaper } from '~/types/subject-directory'
import type { useDirectoryPaperDownloads } from '~/composables/useDirectoryPaperDownloads'
import {
  getDirectoryExamIds, getDirectoryExamLink, getDirectoryPaperCode, getDirectoryPaperDownloads,
  getDirectoryPaperLink, getDirectoryPaperTitle,
} from '~/utils/directoryPapers'

const props = withDefaults(defineProps<{
  paper: DirectoryPaper
  subjectTitle?: string
  downloads: UnwrapRef<ReturnType<typeof useDirectoryPaperDownloads>>
}>(), { subjectTitle: '' })
const files = computed(() => getDirectoryPaperDownloads(props.paper))
const examIds = computed(() => getDirectoryExamIds(props.paper.exam_id))
const paperCode = computed(() => getDirectoryPaperCode(props.paper, props.subjectTitle))
</script>

<style scoped lang="scss">
@use 'sass:map';
@use 'vuetify/settings' as vuetify;

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
  outline: 3px solid rgba(var(--v-theme-primary), 0.28);
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
  min-width: 0;
  font-size: 12px;
  letter-spacing: normal;
}

.directory-exam-button {
  padding-inline: 8px;
}

.directory-paper-actions {
  min-width: 0;
  flex: 3 1 480px;
}
.directory-exam-cell {
  flex: 0 0 auto;
  max-width: 100%;
}

.directory-action :deep(.v-btn__content) {
  white-space: normal;
  overflow-wrap: anywhere;
}

.directory-downloads {
  display: flex;
  flex: 0 1 auto;
  flex-direction: row-reverse;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.directory-download {
  padding: 6px 8px;
  height: auto !important;
  border: 1px solid rgb(var(--v-theme-borderSubtle));
}

/* Other buttons stay readable while one file downloads */
.directory-download.v-btn--disabled {
  opacity: 1;
}

.directory-download__title {
  min-width: 0;
  overflow-wrap: anywhere;
}

.directory-download__price {
  flex-shrink: 0;
  white-space: nowrap;
}

.directory-insert-icon {
  transform: rotate(45deg);
}

@media #{map.get(vuetify.$display-breakpoints, 'sm-and-down')} {
  /* On phones "Take exam" is a plain text link beside the title */
  .directory-exam-button {
    height: 32px !important;
    padding-inline: 4px;
    border: 0;
  }

  .directory-paper-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .directory-paper-link {
    grid-column: 1;
    grid-row: 1;
  }

  .directory-paper-actions {
    display: contents !important;
  }

  .directory-exam-cell {
    grid-column: 2;
    grid-row: 1;
    justify-self: end;
  }

  .directory-downloads {
    grid-column: 1 / -1;
    grid-row: 2;
    position: relative;
    z-index: 1;
    flex: 1 1 0;
    flex-wrap: nowrap;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    padding-block: 2px 4px;
    scrollbar-width: thin;
    scrollbar-color: rgb(var(--v-theme-borderSubtle)) transparent;
  }

  .directory-download {
    max-width: none;
  }

  .directory-action :deep(.v-btn__content) {
    white-space: nowrap;
    overflow-wrap: normal;
  }
}

@media (prefers-reduced-motion: reduce) {
  .directory-paper-row {
    transition: none;
  }
}
</style>
