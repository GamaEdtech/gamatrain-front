<template>
  <v-card
    flat
    class="dashboard-card bg-primary50 pa-4 d-flex align-center justify-space-between flex-wrap ga-3"
  >
    <div class="d-flex align-center ga-3">
      <v-avatar
        color="white"
        rounded="lg"
        size="44"
      >
        <v-icon color="primary">
          mdi-star-four-points-outline
        </v-icon>
      </v-avatar>
      <div>
        <p class="gama-text-h6 font-weight-bold text-grey900 mb-0">
          Go Pro
        </p>
        <p class="gama-text-body2 text-grey700 mb-0">
          Unlock every content type — plans are coming soon
        </p>
      </div>
    </div>
    <v-chip
      class="gama-text-body2"
      color="primary"
      variant="tonal"
    >
      Coming soon
    </v-chip>
  </v-card>
</template>

<script setup>
// No subscription/plan API exists yet, so this is intentionally informational
// only (no CTA, no fabricated plan status) until a real plans/billing flow ships.
</script>

<style scoped>
.dashboard-card {
  border-radius: 1rem;
  border: 1px solid #E4E7EC;
}
</style>
