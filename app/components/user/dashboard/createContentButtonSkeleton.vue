<template>
  <div class="d-flex flex-wrap justify-space-between ga-2 w-100 ma-0">
    <div
      v-for="item in 3"
      :key="item"
      class="dashboard-card pa-4 d-flex align-center justify-space-between ga-2"
    >
      <div class="d-flex align-center ga-3">
        <v-skeleton-loader
          height="44"
          width="44"
          class="rounded-lg"
        />
        <div class="d-flex flex-column ga-2">
          <v-skeleton-loader
            height="22"
            width="130"
          />
          <v-skeleton-loader
            height="18"
            width="100"
          />
        </div>
      </div>

      <v-skeleton-loader
        height="32"
        width="110"
        class="rounded-pill"
      />
    </div>
  </div>
</template>

<style scoped>
.dashboard-card {
  border-radius: 1rem;
  border: 1px solid rgb(var(--v-theme-grey200));
  width: 49%;
}

@media screen and (max-width: 600px) {
  .dashboard-card {
    width: 100%;
  }
}
</style>
