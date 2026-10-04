<template>
  <div class="card-skeleton w-100 rounded-xl d-flex align-stretch">
    <v-skeleton-loader
      type="image"
      class="skeleton-cover flex-shrink-0"
    />
    <div class="skeleton-body d-flex flex-column flex-grow-1">
      <div class="d-flex justify-space-between align-center ga-4">
        <div class="d-flex align-center ga-2">
          <v-skeleton-loader type="avatar" width="26" height="26" />
          <v-skeleton-loader type="text" width="120" />
        </div>
        <v-skeleton-loader
          class="d-none d-md-block"
          type="text"
          width="250"
        />
      </div>
      <v-skeleton-loader type="heading" width="55%" height="30" />
      <v-skeleton-loader type="text" width="82%" />
      <div class="d-flex ga-2">
        <v-skeleton-loader type="chip" width="86" />
        <v-skeleton-loader type="chip" width="86" />
        <v-skeleton-loader type="chip" width="120" />
      </div>
      <v-skeleton-loader type="text" width="340" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use 'sass:map';
@use 'vuetify/settings' as vuetify;

.card-skeleton {
  height: 174px;
  max-width: 1200px;
  padding: 0;
  border: 1px solid rgb(var(--v-theme-borderSkeleton));
  border-radius: 16px !important;
  background: rgb(var(--v-theme-white));
  box-shadow: 0 1px 2px rgba(var(--v-theme-grey900), 0.08);
}

.skeleton-cover {
  width: auto;
  min-width: 0;
  height: 100%;
  min-height: 100%;
  max-height: 100%;
  aspect-ratio: 63 / 74;
  overflow: hidden;
  border-radius: 15px 0 0 15px;
}

.skeleton-body {
  gap: 4px;
  min-width: 0;
  padding: 16px 16px 8px;
}

/* Match the result card on phones so nothing jumps when results replace the skeleton */
@media #{map.get(vuetify.$display-breakpoints, 'sm-and-down')} {
  .skeleton-cover {
    width: 96px;
    aspect-ratio: auto;
  }
}
</style>
