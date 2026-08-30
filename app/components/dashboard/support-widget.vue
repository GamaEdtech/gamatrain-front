<template>
  <v-card
    flat
    class="dashboard-card pa-4 d-flex flex-column justify-space-between"
  >
    <div>
      <p class="gama-text-h6 font-weight-bold text-grey900 mb-2">
        Need help?
      </p>
      <p class="gama-text-body1 text-grey600 mb-0">
        Reach our support team anytime from the ticket center.
      </p>
    </div>
    <v-btn
      class="dashboard-btn mt-4"
      color="primary"
      variant="tonal"
      rounded="pill"
      to="/user/ticket"
      prepend-icon="mdi-lifebuoy"
      block
    >
      Open ticket center
    </v-btn>
  </v-card>
</template>

<script setup>
</script>

<style scoped>
.dashboard-card {
  border-radius: 1rem;
  border: 1px solid #E4E7EC;
}

/* See general-info-dashboard.vue: Vuetify 3's button size scale is tuned
   for a 16px root; this project forces html { font-size: 10px }. */
.dashboard-btn {
  font-size: 1.4rem !important;
}
</style>
