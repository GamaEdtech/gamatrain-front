<template>
  <div class="directory-paper-row position-relative align-center">
    <NuxtLink
      :to="getDirectoryPaperLink(paper)"
      class="directory-paper-link d-flex flex-column justify-center text-decoration-none text-black"
      :title="paper.title"
    >
      <span class="directory-paper-title font-weight-bold">{{ getDirectoryPaperTitle(paper) }}</span>
      <span
        v-if="paperCode"
        class="directory-paper-code text-grey700"
      >{{ paperCode }}</span>
    </NuxtLink>

    <div class="directory-exam-cell">
      <v-btn
        v-if="examIds.length === 1"
        :to="`/exam/${examIds[0]}`"
        class="directory-action directory-exam-button text-none font-weight-regular"
        color="black"
        variant="flat"
        height="38"
      >
        <v-icon
          size="24"
          color="lightError"
          class="mr-2"
        >
          md:sensors
        </v-icon>
        Online Exam
        <v-icon
          size="24"
          class="ml-2"
        >
          md:chevron_right
        </v-icon>
      </v-btn>
      <v-menu v-else-if="examIds.length > 1">
        <template #activator="{ props: menuProps }">
          <v-btn
            v-bind="menuProps"
            class="directory-action directory-exam-button text-none font-weight-regular"
            color="black"
            variant="flat"
            height="38"
          >
            <v-icon
              size="24"
              color="lightError"
              class="mr-2"
            >
              md:sensors
            </v-icon>
            Online Exam
            <v-icon
              size="24"
              class="ml-2"
            >
              md:chevron_right
            </v-icon>
          </v-btn>
        </template>
        <v-list aria-label="Connected online exams">
          <v-list-item
            v-for="(id, index) in examIds"
            :key="id"
            :to="`/exam/${id}`"
            :title="`Online Exam ${index + 1}`"
          />
        </v-list>
      </v-menu>
    </div>

    <div class="directory-downloads d-flex align-center ga-3">
      <v-btn
        v-for="file in files"
        :key="file.type"
        class="directory-action directory-download text-none font-weight-regular flex-shrink-0"
        :class="`directory-download--${file.style}`"
        :color="file.style === 'question' ? 'directoryInk' : undefined"
        variant="flat"
        height="38"
        :loading="downloads.isDownloading(paper, file.type)"
        :disabled="downloads.isBusy && !downloads.isDownloading(paper, file.type)"
        :aria-label="`${file.title} — ${getDirectoryPaperTitle(paper)}`"
        @click="downloads.handleDownload(file.type, paper)"
      >
        <v-icon
          :icon="file.icon"
          size="24"
          class="mr-2"
          :class="{ 'directory-insert-icon': file.type === 'in_file' }"
        />
        {{ file.title }}
        <template #loader>
          <v-progress-circular
            :model-value="downloads.getDownloadProgress(paper, file.type)"
            size="24"
            width="2"
          />
        </template>
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import {
  getDirectoryExamIds, getDirectoryPaperCode, getDirectoryPaperDownloads,
  getDirectoryPaperLink, getDirectoryPaperTitle,
} from '~/utils/directoryPapers'

const props = defineProps({
  paper: { type: Object, required: true },
  subjectTitle: { type: String, default: '' },
  downloads: { type: Object, required: true },
})
const files = computed(() => getDirectoryPaperDownloads(props.paper))
const examIds = computed(() => getDirectoryExamIds(props.paper.exam_id))
const paperCode = computed(() => getDirectoryPaperCode(props.paper, props.subjectTitle))
</script>

<style scoped>
.directory-paper-row {
  display: grid;
  grid-template-columns: 154px 180px minmax(0, 1fr);
  column-gap: 24px;
  min-height: 61px;
  padding: 8px 24px 8px 106px;
  transition: background-color 150ms ease;
}

.directory-paper-row:hover,
.directory-paper-row:focus-within {
  background-color: rgb(var(--v-theme-directoryHover));
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
  outline: 2px solid rgb(var(--v-theme-info));
  outline-offset: -2px;
}

.directory-paper-title {
  font-size: 18px;
  line-height: 22px;
}

.directory-paper-code {
  font-size: 13px;
  line-height: 18px;
}

.directory-action {
  position: relative;
  z-index: 1;
  border-radius: 10px;
  font-size: 15px;
  letter-spacing: normal;
}

.directory-exam-button {
  width: 180px;
  padding-inline: 10px;
}

.directory-downloads {
  min-width: 0;
  overflow-x: auto;
  padding: 2px;
}

.directory-download:first-child {
  margin-inline-start: auto;
}

.directory-download {
  padding-inline: 14px;
  border: 2px solid rgb(var(--v-theme-directoryExtraBorder));
  color: rgb(var(--v-theme-directoryInk));
  background-color: rgb(var(--v-theme-white));
}

.directory-download--answer {
  background-color: rgb(var(--v-theme-directoryAnswer));
}

.directory-download--answer,
.directory-download--question {
  border-color: rgb(var(--v-theme-directoryButtonBorder));
}

.directory-insert-icon {
  transform: rotate(45deg);
}

@media (max-width: 1279px) {
  .directory-paper-row {
    grid-template-columns: 130px 180px minmax(0, 1fr);
    column-gap: 16px;
    padding-inline-start: 24px;
  }
}

@media (max-width: 959px) {
  .directory-paper-row {
    grid-template-columns: minmax(0, 1fr) 180px;
    grid-template-rows: 44px 42px;
    gap: 8px 12px;
    min-height: 118px;
    padding: 12px;
  }

  .directory-paper-title {
    font-size: 16px;
    line-height: 20px;
  }

  .directory-downloads {
    grid-column: 1 / -1;
  }

  .directory-download:first-child {
    margin-inline-start: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .directory-paper-row {
    transition: none;
  }
}
</style>
