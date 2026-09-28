<template>
  <div class="dashboard-card pa-4 d-flex flex-column ga-1 w-100">
    <div class="d-flex justify-space-between align-center flex-wrap ga-2">
      <v-skeleton-loader
        height="28"
        width="160"
      />
      <v-skeleton-loader
        height="22"
        width="130"
      />
    </div>

    <v-skeleton-loader
      height="48"
      width="100%"
      class="mt-4 rounded-lg"
    />

    <div class="d-flex flex-column ga-4 mt-4">
      <div
        v-for="item in 4"
        :key="item"
      >
        <div class="d-flex justify-space-between mb-1">
          <v-skeleton-loader
            height="20"
            width="150"
          />
          <v-skeleton-loader
            height="20"
            width="100"
          />
        </div>
        <v-skeleton-loader
          height="7"
          width="100%"
          class="rounded-pill"
        />
      </div>
    </div>

    <v-divider class="my-4" />

    <div class="d-flex justify-space-between">
      <v-skeleton-loader
        height="22"
        width="70"
      />
      <v-skeleton-loader
        height="22"
        width="220"
      />
    </div>
  </div>
</template>

<style scoped>
.dashboard-card {
  border-radius: 1rem;
  border: 1px solid rgb(var(--v-theme-grey200));
}
</style>
