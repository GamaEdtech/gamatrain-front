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
          class="directory-year-title font-weight-bold rounded-0 justify-start"
          static
          expand-icon="md:keyboard_arrow_right"
          collapse-icon="md:keyboard_arrow_down"
        >
          {{ year.title }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <div
            v-if="yearAvailabilityLoading(year.id)"
            class="d-flex align-center ga-3 py-4 text-grey600"
            role="status"
          >
            <v-progress-circular
              indeterminate
              size="24"
              width="2"
              color="primary"
            />
            <span>Checking available sessions…</span>
          </div>
          <v-expansion-panels
            v-if="displayedSessions(year.id).length"
            :model-value="expandedSessions[year.id]"
            class="directory-sessions"
            variant="accordion"
            multiple
            @update:model-value="expandSessions(year.id, $event)"
          >
            <v-expansion-panel
              v-for="session in displayedSessions(year.id)"
              :key="session.id"
              :value="session.id"
              class="rounded-0"
              elevation="0"
            >
              <v-expansion-panel-title
                class="directory-session-title text-brandNavy font-weight-bold rounded-0 justify-start"
                color="surfaceTertiary"
                static
                expand-icon="md:keyboard_arrow_right"
                collapse-icon="md:keyboard_arrow_down"
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
            class="py-6 ma-0 text-grey600"
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
    :delta-price="priceFile"
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
  selectFilter, clearFilters, fetchOptions, expandYears, expandSessions, sessionKey, sessionState, loadSession, isSessionOpen,
  displayedSessions, yearAvailabilityLoading,
} = await useDirectoryPapers(props)

const downloadState = useDirectoryPaperDownloads()
const downloads = reactive(downloadState)
const {
  showCoinPaymentModal, showCoinAnimation, isStartWalletAnimation,
  downloadIssue, downloadIssueLink, paymentPlans, billingInterval,
  currentPlanTitle, currentPlanId, handleAnimationComplete, completeWalletAnimation,
  upgradePlanSuccessfully, priceFile,
} = downloadState
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

@media (prefers-reduced-motion: reduce) {
  .directory-years :deep(.expand-transition-enter-active),
  .directory-years :deep(.expand-transition-leave-active) {
    transition-duration: 0.01ms !important;
  }
}
</style>
