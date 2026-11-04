<template>
  <!-- Same shape as the compact (no photo) card, which most schools get. -->
  <div class="w-100 pa-0 rounded-lg d-flex flex-column align-start card-school overflow-hidden">
    <div class="w-100 d-flex flex-column ga-2 pa-3">
      <v-skeleton-loader
        width="200"
        height="20"
        class="rounded-xl"
      />
      <v-skeleton-loader
        width="160"
        height="16"
        class="rounded-xl"
      />
    </div>
    <div class="w-100 d-flex align-center justify-space-between bottom-section px-3 py-2">
      <div class="d-flex align-center ga-3">
        <v-skeleton-loader
          v-for="item in 2"
          :key="item"
          width="20"
          height="20"
          class="rounded-circle"
        />
      </div>
      <v-skeleton-loader
        width="60"
        height="20"
        class="rounded-xl"
      />
    </div>
  </div>
</template>

<style scoped>
.card-school {
  background-color: rgb(var(--v-theme-surface));
  border: 1px solid rgb(var(--v-theme-grey200));
  max-width: 320px;
  min-width: 300px;
}

.bottom-section {
  background-color: rgb(var(--v-theme-grey50));
  border-top: 1px solid rgb(var(--v-theme-grey100));
}

.v-theme--dark .card-school,
.v-theme--dark .bottom-section {
  background-color: rgb(var(--v-theme-surfaceTertiary));
  border-color: rgb(var(--v-theme-borderSubtle));
}

.v-theme--dark .card-school :deep(.v-skeleton-loader) {
  background: transparent;
}
</style>
