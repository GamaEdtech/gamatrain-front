<template>
  <div class="w-100 d-flex flex-column flex-sm-row ga-3">
    <div
      v-for="item in 3"
      :key="item"
      class="dashboard-card w-100 pa-4 d-flex align-center ga-4"
    >
      <v-skeleton-loader
        height="48"
        width="48"
        class="rounded-lg"
      />
      <div class="d-flex flex-column ga-2">
        <v-skeleton-loader
          height="18"
          width="80"
        />
        <v-skeleton-loader
          height="26"
          width="120"
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
</style>
