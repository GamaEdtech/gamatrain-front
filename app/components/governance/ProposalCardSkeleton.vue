<template>
  <div
    class="proposal-card"
  >
    <div
      class="governance-proposals__badge"
    >
      <v-skeleton-loader
        width="70"
        height="22"
        class="rounded-pill"
      />
    </div>

    <div
      class="delete-button"
    >
      <v-skeleton-loader
        width="30"
        height="30"
        class="rounded-circle"
      />
    </div>

    <div class="mt-2">
      <v-skeleton-loader
        width="200"
        height="30"
        class="rounded-lg"
      />
    </div>

    <div class="d-flex flex-column ga-1 mt-4">
      <v-skeleton-loader
        width="180"
        height="14"
        class="rounded-lg"
      />
      <v-skeleton-loader
        width="180"
        height="14"
        class="rounded-lg"
      />
      <v-skeleton-loader
        width="180"
        height="14"
        class="rounded-lg"
      />
    </div>

    <div class="d-flex justify-space-between align-center mb-5 mt-4">
      <v-skeleton-loader
        width="70"
        height="22"
        class="rounded-pill"
      />
      <v-skeleton-loader
        width="80"
        height="14"
        class="rounded-pill"
      />
    </div>

    <div class="d-flex flex-column align-center justify-center">
      <div class="w-100 d-flex justify-space-between align-center mb-2">
        <v-skeleton-loader
          width="80"
          height="14"
          class="rounded-pill"
        />
        <v-skeleton-loader
          width="80"
          height="14"
          class="rounded-pill"
        />
      </div>

      <v-skeleton-loader
        height="10"
        class="rounded-pill w-100"
      />

      <div class="w-100 d-flex mt-2">
        <v-skeleton-loader
          width="80"
          height="14"
          class="rounded-pill"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.proposal-card {
  border-radius: 16px;
  padding: 12px;
  position: relative;
  border: 1px solid  rgb(var(--v-theme-grey100));
  cursor: pointer;

  .governance-proposals__badge {
    position: absolute;
    top: -9px;
    right: 12px;
    z-index: 2;
  }

  .delete-button {
    position: absolute;
    top: 18px;
    right: 8px;
    z-index: 1;
  }
}
</style>
