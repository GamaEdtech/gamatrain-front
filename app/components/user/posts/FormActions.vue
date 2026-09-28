<template>
  <!-- Stays pinned to the bottom of the viewport so Publish/Update is always reachable on a long post. -->
  <v-col
    cols="12"
    class="form-actions position-sticky bottom-0 d-flex justify-center align-center ga-2 mt-4 py-3 bg-white border-t"
    :class="{ 'form-actions--above-nav': aboveMobileNav }"
  >
    <slot />
  </v-col>
</template>

<script setup lang="ts">
// The dashboard layout shows a 62px sticky bottom navigation on mobile; lift the bar above it there.
defineProps<{
  aboveMobileNav?: boolean
}>()
</script>

<style scoped>
/* Keeps the bar above the rich editor's own sticky toolbar while scrolling. */
.form-actions {
  z-index: 10;
}

@media (max-width: 959.98px) {
  .form-actions--above-nav {
    bottom: 62px;
  }
}
</style>
