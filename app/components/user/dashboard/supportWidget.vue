<template>
  <div
    class="dashboard-card pa-4 d-flex flex-column aligh-start w-100"
  >
    <p class="text-body-1 text-sm-h6 font-weight-bold text-grey900 mb-2">
      Need help?
    </p>
    <p class="text-caption font-weight-medium text-sm-body-1 text-grey500 mb-0">
      Reach our support team anytime from the ticket center.
    </p>
    <v-btn
      class="mt-4"
      color="primary"
      variant="tonal"
      rounded="pill"
      to="/user/ticket"
      block
    >
      <span class="text-body-1 font-weight-bold">
        <v-icon class="mr-1">md:support</v-icon>Open ticket center</span>
    </v-btn>
  </div>
</template>

<script setup>
</script>

<style scoped>
.dashboard-card {
  border-radius: 0.625rem;
  border: 1px solid rgb(var(--v-theme-grey200));
}
</style>
