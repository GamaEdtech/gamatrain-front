<template>
  <span
    v-tooltip:top="`Quality: ${safeScore} of 5`"
    class="d-inline-flex align-center ga-1 flex-shrink-0 font-weight-medium text-grey700"
    role="img"
    :aria-label="`Quality: ${safeScore} of 5`"
  >
    <v-icon
      icon="md:star"
      color="primary"
      :size="size"
      aria-hidden="true"
    />
    <span aria-hidden="true">{{ safeScore }}</span>
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  score?: number
  size?: number
}>(), {
  score: 0,
  size: 28,
})

const safeScore = computed(() => Math.min(5, Math.max(0, Math.round(props.score))))
</script>
