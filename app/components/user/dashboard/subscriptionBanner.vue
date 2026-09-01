<template>
  <div
    class="dashboard-card bg-primary50 pa-4 d-flex align-center justify-space-between flex-wrap ga-3"
  >
    <div class="d-flex align-start ga-3">
      <v-avatar
        color="white"
        rounded="lg"
        size="44"
      >
        <v-icon color="primary">
          md:star_shine_outlined
        </v-icon>
      </v-avatar>
      <div>
        <p class="text-h5 text-sm-h4 font-weight-bold text-grey900 mb-0">
          Go Pro
        </p>
        <p class="text-h6 text-sm-h5 text-grey700 mb-0">
          Unlock every content type — plans are coming soon
        </p>
      </div>
    </div>
    <v-chip
      class="bg-white text-primary text-h6 font-weight-bold"
      variant="flat"
    >
      Coming soon
    </v-chip>
  </div>
</template>

<script setup>
// No subscription/plan API exists yet, so this is intentionally informational
// only (no CTA, no fabricated plan status) until a real plans/billing flow ships.
</script>

<style scoped>
.dashboard-card {
  border-radius: 1rem;
  border: 1px solid rgb(var(--v-theme-grey200));
}
</style>
