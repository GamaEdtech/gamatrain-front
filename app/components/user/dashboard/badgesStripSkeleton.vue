<template>
  <div class="dashboard-card pa-4 d-flex flex-column ga-4 w-100">
    <div class="d-flex justify-space-between align-center flex-wrap ga-2">
      <v-skeleton-loader
        height="28"
        width="170"
      />
      <v-skeleton-loader
        height="22"
        width="150"
      />
    </div>

    <div class="d-flex flex-wrap ga-6">
      <div
        v-for="badge in 6"
        :key="badge"
        class="d-flex flex-column align-center ga-2 container-badge"
      >
        <v-skeleton-loader
          height="56"
          width="56"
          class="rounded-circle"
        />
        <v-skeleton-loader
          height="18"
          width="72"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-card {
  border-radius: 1rem;
  border: 1px solid rgb(var(--v-theme-grey200));
}

.container-badge {
  width: 84px;
}

@media screen and (max-width: 600px) {
  .container-badge {
    width: 64px;
  }
}
</style>
