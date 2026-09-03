<template>
  <div class="dashboard-card pa-4 w-100">
    <div class="d-flex align-center justify-space-between flex-wrap ga-4">
      <div class="d-flex align-start ga-3 flex-grow-1">
        <v-skeleton-loader
          height="48"
          width="48"
          class="rounded-lg flex-shrink-0"
        />

        <div class="d-flex flex-column ga-2 flex-grow-1 min-width-0">
          <div class="d-flex align-center flex-wrap ga-2">
            <v-skeleton-loader
              height="28"
              width="160"
            />
            <v-skeleton-loader
              height="28"
              width="80"
              class="rounded-pill"
            />
          </div>
          <v-skeleton-loader
            height="22"
            width="280"
          />
        </div>
      </div>

      <div class="d-flex align-center justify-end flex-wrap ga-3">
        <v-skeleton-loader
          height="96"
          width="96"
          class="rounded-circle"
        />
        <div class="d-flex flex-column ga-2">
          <v-skeleton-loader
            height="20"
            width="80"
          />
          <v-skeleton-loader
            height="18"
            width="110"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-card {
  border-radius: 1rem;
  border: 1px solid rgb(var(--v-theme-grey200));
  background: rgb(var(--v-theme-white));
}

.min-width-0 {
  min-width: 0;
}
</style>
