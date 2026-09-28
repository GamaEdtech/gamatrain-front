<template>
  <span
    v-if="price && price != 0"
    :aria-label="`${price} gems`"
  >{{ price }}
    <v-icon
      size="20"
      :color="color"
      aria-hidden="true"
    >
      md:diamond_outlined
    </v-icon>
  </span>
</template>

<script setup lang="ts">
// Shared by the download buttons (paper/exam/multimedia) so the price+gem
// markup, icon, and accessibility label live in one place instead of being
// copy-pasted per file. `class` passed at the call site lands on the root
// <span> via Vue's default attribute inheritance, so callers keep their
// own text-color class unchanged.
defineProps<{
  price?: number | null
  color: string
}>()
</script>
