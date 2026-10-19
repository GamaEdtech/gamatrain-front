<template>
  <div
    aria-busy="true"
    aria-label="Loading exam"
  >
    <!-- Header: timer and the two jump buttons -->
    <v-card class="exam-skeleton-card exam-skeleton-header mb-4">
      <div class="d-flex align-center ga-3 pa-3 px-sm-6">
        <v-skeleton-loader
          height="28"
          width="28"
          class="rounded-circle"
        />
        <div class="d-flex flex-column ga-1">
          <v-skeleton-loader
            height="12"
            width="60"
          />
          <v-skeleton-loader
            height="22"
            width="90"
          />
        </div>
        <v-spacer />
        <v-skeleton-loader
          v-for="item in 2"
          :key="item"
          height="36"
          width="64"
          class="rounded-pill"
        />
      </div>
    </v-card>

    <!-- Title and the first questions -->
    <v-card class="exam-skeleton-card mb-4 mt-4">
      <div class="pt-12 pb-6 px-4 px-sm-6 px-md-8">
        <v-skeleton-loader
          height="28"
          max-width="420"
        />
      </div>
      <div class="px-4 px-sm-6 px-md-8 pb-6">
        <v-divider class="mb-4" />
        <div
          v-for="question in 2"
          :key="question"
          class="pt-6 pb-4"
        >
          <div class="d-flex flex-column ga-2">
            <v-skeleton-loader
              height="20"
              width="100%"
            />
            <v-skeleton-loader
              height="20"
              width="70%"
            />
          </div>
          <v-skeleton-loader
            v-if="question === 1"
            height="200"
            max-width="400"
            class="mt-4 rounded-lg"
          />
          <div class="d-flex flex-column ga-4 mt-6 px-1 px-sm-3">
            <div
              v-for="option in 4"
              :key="option"
              class="d-flex align-center ga-3"
            >
              <v-skeleton-loader
                height="24"
                width="24"
                class="rounded-lg flex-shrink-0"
              />
              <v-skeleton-loader
                height="18"
                :width="`${30 + option * 10}%`"
              />
            </div>
          </div>
        </div>
      </div>
    </v-card>
  </div>
</template>

<style scoped lang="scss">
@use 'sass:map';
@use 'vuetify/settings' as vuetify;

/* Same place as the exam page's sticky header, just below the app bar. */
.exam-skeleton-header {
  position: sticky;
  top: 64px;
  z-index: 10;
}
/* Matches the exam page: cards run edge to edge on phones. */
@media #{map.get(vuetify.$display-breakpoints, 'xs')} {
  .exam-skeleton-card {
    border-radius: 0;
  }
}
</style>
