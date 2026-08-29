<template>
  <div class="history-card w-100 d-flex flex-column flex-sm-row alight-start align-sm-center justify-space-between ga-4 pa-4">
    <div class="d-flex flex-column ga-2 flex-grow-1">
      <v-skeleton-loader
        width="180"
        height="18"
        class="rounded-pill"
      />
      <v-skeleton-loader
        width="120"
        height="16"
        class="rounded-pill"
      />
    </div>

    <div class="d-flex align-center ga-3 flex-wrap justify-start justify-sm-end">
      <v-skeleton-loader
        width="80"
        height="28"
        class="rounded-pill"
      />
      <v-skeleton-loader
        width="120"
        height="16"
        class="rounded-pill"
      />
      <v-skeleton-loader
        width="80"
        height="16"
        class="rounded-pill"
      />
    </div>
  </div>
</template>

<style scoped>
.history-card {
  border: 1px solid rgb(var(--v-theme-grey200));
  border-radius: 8px;
  min-height: 86px;
}
</style>
