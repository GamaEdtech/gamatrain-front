<template>
  <section
    class="directory-papers text-black"
    aria-labelledby="directory-papers-title"
  >
    <div class="d-flex align-center ga-2 mb-2">
      <v-icon
        size="34"
        color="info"
      >
        mdi-file-clock-outline
      </v-icon>
      <h2
        id="directory-papers-title"
        class="directory-heading font-weight-bold"
      >
        Past Papers
      </h2>
    </div>
    <p class="directory-description text-directoryDescription mb-4">
      Download past papers, mark schemes and examiner reports.
    </p>

    <SubjectDirectoryPaperFilters
      :filters="filterButtons"
      :board-id="boardId"
      :context-key="`${subjectId}:${gradeId}:${boardId}`"
      @select="selectFilter"
      @clear="clearFilters"
      @retry="fetchOptions"
    />

    <p
      v-if="!subjectId"
      class="pa-6 text-grey600"
    >
      Select a subject to browse past papers.
    </p>
    <v-expansion-panels
      v-else
      :model-value="expandedYears"
      class="directory-years"
      variant="accordion"
      multiple
      @update:model-value="expandYears"
    >
      <v-expansion-panel
        v-for="year in visibleYears"
        :key="year.id"
        :value="year.id"
        elevation="0"
      >
        <v-expansion-panel-title
          class="directory-year-title font-weight-bold"
          static
          expand-icon="md:keyboard_arrow_down"
          collapse-icon="md:keyboard_arrow_up"
        >
          <v-icon
            size="24"
            class="mr-3"
          >
            md:calendar_today_outlined
          </v-icon>
          {{ year.title }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <div
            v-if="yearAvailabilityLoading(year.id)"
            class="d-flex align-center justify-center ga-3 pa-4 text-grey600"
            role="status"
          >
            <v-progress-circular
              indeterminate
              size="24"
              width="2"
              color="directoryInk"
            />
            <span>Checking available sessions…</span>
          </div>
          <v-expansion-panels
            v-if="displayedSessions(year.id).length"
            v-model="expandedSessions[year.id]"
            class="directory-sessions"
            variant="accordion"
            multiple
          >
            <v-expansion-panel
              v-for="session in displayedSessions(year.id)"
              :key="session.id"
              :value="session.id"
              elevation="0"
            >
              <v-expansion-panel-title
                class="directory-session-title font-weight-bold"
                color="directorySeries"
                static
                expand-icon="md:keyboard_arrow_down"
                collapse-icon="md:keyboard_arrow_up"
              >
                {{ session.title }}
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <subject-directory-paper-session
                  :key="`${sessionKey(year.id, session.id)}:${filters.year}:${filters.series}`"
                  :state="sessionState(year.id, session.id)"
                  :active="isSessionOpen(year.id, session.id)"
                  :label="`${year.title} ${session.title} papers`"
                  :subject-title="subjectTitle"
                  :downloads="downloads"
                  :load-page="() => loadSession(year.id, session.id)"
                />
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
          <p
            v-else-if="!yearAvailabilityLoading(year.id)"
            class="pa-6 ma-0 text-grey600 text-center"
            role="status"
          >
            No papers are available for this year.
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </section>

  <!-- Coin Payment Modal -->
  <lazy-common-modal-base
    v-model:show-dialog="showCoinPaymentModal"
    :max-width="900"
    title="Get Membership. Unlock Premium Downloads."
    subtitle="Join +50,000 Students"
  >
    <common-modal-payment
      :plans="paymentPlans"
      :billing-interval="billingInterval"
      :current-plan-id="currentPlanId"
      :current-plan-title="currentPlanTitle"
      @dismiss="showCoinPaymentModal = false"
      @switch-successfully="upgradePlanSuccessfully"
    />
  </lazy-common-modal-base>

  <!-- Coin Consumption Animation -->
  <lazy-common-coin-consumption-animation
    v-model:is-visible="showCoinAnimation"
    @animation-complete="handleAnimationComplete"
  />

  <lazy-test-counting-wallet-animation
    :is-start-animation="isStartWalletAnimation"
    :direction="-1"
    :delta-price="PRICE_FILE"
    @complete-animation="completeWalletAnimation"
  />
  <lazy-common-modal-base
    v-model:show-dialog="downloadIssue"
    :max-width="600"
    title="Download"
  >
    <lazy-common-modal-download-file
      :link="downloadIssueLink"
      @close="downloadIssue = false"
    />
  </lazy-common-modal-base>
</template>

<script setup>
const props = defineProps({
  subjectId: { type: [String, Number], default: '' },
  gradeId: { type: [String, Number], default: '' },
  boardId: { type: [String, Number], default: '' },
  subjectTitle: { type: String, default: '' },
})

const {
  filters, filterButtons, visibleYears, expandedYears, expandedSessions,
  selectFilter, clearFilters, fetchOptions, expandYears, sessionKey, sessionState, loadSession, isSessionOpen,
  displayedSessions, yearAvailabilityLoading,
} = await useDirectoryPapers(props)

const downloadState = useDirectoryPaperDownloads()
const downloads = reactive(downloadState)
const {
  showCoinPaymentModal, showCoinAnimation, isStartWalletAnimation,
  downloadIssue, downloadIssueLink, paymentPlans, billingInterval,
  currentPlanTitle, currentPlanId, handleAnimationComplete, completeWalletAnimation,
  upgradePlanSuccessfully,
} = downloadState
const PRICE_FILE = 10
</script>

<style scoped>
.directory-papers {
  width: 100%;
}

.directory-heading {
  font-size: 28px;
  line-height: 34px;
}

.directory-description {
  font-size: 16px;
  line-height: 24px;
}

.directory-years :deep(.v-expansion-panel) {
  background-color: rgb(var(--v-theme-white));
  color: inherit;
}

.directory-years :deep(.v-expansion-panel::after) {
  display: none;
}

.directory-years :deep(.v-expansion-panel-text__wrapper) {
  padding: 0;
}

.directory-years :deep(.v-expansion-panel-title) {
  border: 1px solid rgb(var(--v-theme-grey300));
  border-radius: 8px;
}

.directory-years :deep(.v-expansion-panel-title__icon .v-icon) {
  width: 24px;
  height: 24px;
  font-size: 24px;
}

.directory-year-title {
  min-height: 55px;
  padding: 12px 30px 12px 40px;
  font-size: 20px;
  line-height: 24px;
}

.directory-session-title {
  min-height: 50px;
  padding: 12px 30px 12px 76px;
  font-size: 18px;
  line-height: 24px;
}

@media (max-width: 959px) {
  .directory-heading {
    font-size: 24px;
  }

  .directory-year-title {
    padding-inline: 16px;
  }

  .directory-session-title {
    padding-inline: 52px 16px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .directory-years :deep(.expand-transition-enter-active),
  .directory-years :deep(.expand-transition-leave-active) {
    transition-duration: 0.01ms !important;
  }
}
</style>
