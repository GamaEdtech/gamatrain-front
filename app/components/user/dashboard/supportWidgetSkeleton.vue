<template>
  <div class="dashboard-card pa-4 d-flex flex-column align-start w-100">
    <v-skeleton-loader
      height="28"
      width="110"
      class="mb-2"
    />
    <v-skeleton-loader
      height="22"
      width="100%"
    />
    <v-skeleton-loader
      height="22"
      width="70%"
      class="mt-2"
    />
    <v-skeleton-loader
      height="40"
      width="100%"
      class="mt-4 rounded-pill"
    />
  </div>
</template>

<style scoped>
.dashboard-card {
  border-radius: 1rem;
  border: 1px solid rgb(var(--v-theme-grey200));
}
</style>
