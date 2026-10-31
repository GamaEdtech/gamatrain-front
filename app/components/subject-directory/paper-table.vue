<template>
  <section
    class="directory-papers text-brandNavy"
    aria-labelledby="directory-papers-title"
  >
    <h2
      id="directory-papers-title"
      class="d-sr-only"
    >
      Past Papers
    </h2>

    <SubjectDirectoryPaperFilters
      :filters="filterButtons"
      :board-id="boardId"
      :context-key="`${subjectId}:${gradeId}:${boardId}`"
      @select="selectFilter"
      @clear="clearFilters"
      @retry="refreshPaperTypes()"
    />

    <p
      v-if="!subjectId"
      class="pa-6 text-grey600"
    >
      Select a subject to browse past papers.
    </p>
    <template v-else>
      <v-expansion-panels
        v-if="years.length"
        v-model="expandedYears"
        class="directory-years"
        variant="accordion"
        multiple
      >
        <v-expansion-panel
          v-for="year in years"
          :key="year.id"
          :value="year.id"
          elevation="0"
        >
          <h3 class="directory-accordion-heading ma-0 pa-0">
            <v-expansion-panel-title
              :id="`${accordionId}-year-${year.id}-title`"
              :aria-controls="`${accordionId}-year-${year.id}-panel`"
              class="directory-year-title font-weight-bold rounded-0 justify-start"
              static
              expand-icon="md:keyboard_arrow_right"
              collapse-icon="md:keyboard_arrow_down"
            >
              {{ year.title }}
            </v-expansion-panel-title>
          </h3>
          <v-expansion-panel-text :id="`${accordionId}-year-${year.id}-panel`">
            <v-expansion-panels
              :model-value="expandedSessions[year.id]"
              class="directory-sessions"
              variant="accordion"
              multiple
              @update:model-value="expandSessions(year.id, $event)"
            >
              <v-expansion-panel
                v-for="session in year.sessions"
                :key="session.id"
                :value="session.id"
                class="rounded-0"
                elevation="0"
              >
                <h4 class="directory-accordion-heading ma-0 pa-0">
                  <v-expansion-panel-title
                    :id="`${accordionId}-year-${year.id}-session-${session.id}-title`"
                    :aria-controls="`${accordionId}-year-${year.id}-session-${session.id}-panel`"
                    class="directory-session-title text-brandNavy font-weight-bold rounded-0 justify-start"
                    color="surfaceTertiary"
                    static
                    expand-icon="md:keyboard_arrow_right"
                    collapse-icon="md:keyboard_arrow_down"
                  >
                    {{ session.title }}
                  </v-expansion-panel-title>
                </h4>
                <v-expansion-panel-text :id="`${accordionId}-year-${year.id}-session-${session.id}-panel`">
                  <subject-directory-paper-row
                    v-for="paper in session.papers"
                    :key="paper.id"
                    :paper="paper"
                    :subject-title="subjectTitle"
                    :downloads="downloads"
                  />
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <div
        v-if="loading && !years.length"
        class="d-flex align-center justify-center ga-3 pa-6 text-grey600"
        role="status"
      >
        <v-progress-circular
          indeterminate
          size="24"
          width="2"
          color="primary"
        />
        <span>Loading papers…</span>
      </div>
      <p
        v-else-if="list.loaded && !list.items.length && !list.error"
        class="pa-6 ma-0 text-grey600 text-center"
        role="status"
      >
        No papers match these filters.
      </p>

      <div
        v-if="list.error"
        class="d-flex align-center justify-center flex-wrap ga-3 pa-4"
        role="alert"
      >
        <span class="text-grey600">Unable to load papers.</span>
        <v-btn
          variant="text"
          color="brandNavy"
          class="text-none"
          @click="retry()"
        >
          Retry
        </v-btn>
      </div>
      <div
        v-else-if="list.loaded && list.hasMore"
        class="d-flex justify-center py-4"
      >
        <v-btn
          variant="outlined"
          color="brandNavy"
          rounded="lg"
          class="directory-load-more text-none"
          :loading="list.loading"
          @click="loadMore"
        >
          Load older papers
        </v-btn>
      </div>
    </template>
  </section>

  <!-- Membership, gem-spend and download dialogs for the paper downloads -->
  <lazy-common-modal-base
    v-model:show-dialog="downloads.showPayment"
    :max-width="900"
    title="Get Membership. Unlock Premium Downloads."
    subtitle="Join +50,000 Students"
  >
    <common-modal-payment
      :plans="downloads.upgrade?.upgradeSuggestions ?? []"
      :billing-interval="downloads.upgrade?.availableBillingIntervals ?? []"
      :current-plan-id="downloads.upgrade?.currentPlanId ?? null"
      :current-plan-title="downloads.upgrade?.currentPlanTitle ?? null"
      @dismiss="downloads.showPayment = false"
      @switch-successfully="downloads.retryAfterUpgrade"
    />
  </lazy-common-modal-base>
  <lazy-common-coin-consumption-animation
    v-model:is-visible="downloads.showCoinAnimation"
    @animation-complete="downloads.onCoinAnimationDone"
  />
  <lazy-test-counting-wallet-animation
    :is-start-animation="downloads.isStartWalletAnimation"
    :direction="-1"
    :delta-price="downloads.price"
    @complete-animation="downloads.onWalletAnimationDone"
  />
  <lazy-common-modal-base
    v-model:show-dialog="downloads.showDownload"
    :max-width="600"
    title="Download"
  >
    <lazy-common-modal-download-file
      :link="downloads.downloadLink"
      @close="downloads.showDownload = false"
    />
  </lazy-common-modal-base>
</template>

<script setup lang="ts">
import { reactive, useId } from 'vue'
import type { PropType } from 'vue'
import type { DirectorySelection } from '~/types/subject-directory'

const accordionId = useId()
const props = defineProps({
  selection: { type: Object as PropType<DirectorySelection | null>, default: null },
  subjectId: { type: [String, Number], default: '' },
  gradeId: { type: [String, Number], default: '' },
  boardId: { type: [String, Number], default: '' },
  subjectTitle: { type: String, default: '' },
})

const {
  filterButtons, years, list, expandedYears, expandedSessions,
  selectFilter, clearFilters, refreshPaperTypes, expandSessions, loadMore, retry, loading,
} = await useDirectoryPapers(props)

const downloads = reactive(useDirectoryPaperDownloads())
</script>

<style scoped>
.directory-papers {
  --directory-session-padding: 24px;
  --directory-chevron-size: 20px;
  --directory-chevron-gap: 12px;
  --directory-session-text-offset: calc(var(--directory-session-padding) + var(--directory-chevron-size) + var(--directory-chevron-gap));
  width: 100%;
}

.directory-years :deep(.v-expansion-panel) {
  background-color: rgb(var(--v-theme-grey25));
  color: inherit;
}

.directory-years :deep(.v-expansion-panel::after) {
  display: none;
}

.directory-years :deep(.v-expansion-panel-text__wrapper) {
  padding: 0;
}

.directory-years :deep(.v-expansion-panel-title__icon) {
  order: -1;
  margin-inline: 0 var(--directory-chevron-gap);
  color: rgb(var(--v-theme-grey500));
}

.directory-years :deep(.v-expansion-panel-title__icon .v-icon) {
  width: var(--directory-chevron-size);
  height: var(--directory-chevron-size);
  font-size: var(--directory-chevron-size);
}

.directory-accordion-heading {
  font: inherit;
}

.directory-year-title {
  min-height: 48px;
  padding: 8px 0;
  font-size: 18px;
  line-height: 24px;
}

.directory-session-title {
  min-height: 44px;
  padding: 8px var(--directory-session-padding);
  font-size: 16px;
  line-height: 24px;
}

/* px size: the app's 10px root font size makes Vuetify's rem-based button text too small */
.directory-load-more {
  font-size: 14px;
  letter-spacing: normal;
}

@media (prefers-reduced-motion: reduce) {
  .directory-years :deep(.expand-transition-enter-active),
  .directory-years :deep(.expand-transition-leave-active) {
    transition-duration: 0.01ms !important;
  }
}
</style>
