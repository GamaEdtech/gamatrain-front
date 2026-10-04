<template>
  <v-icon
    v-tooltip:top="`${difficulty.label} difficulty`"
    :icon="difficulty.icon"
    :color="difficulty.color"
    :size="size"
    role="img"
    :aria-label="`${difficulty.label} difficulty`"
  />
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  level?: string | number
  size?: number
}>(), {
  level: '2',
  size: 28,
})

const DIFFICULTIES = {
  1: { label: 'Easy', icon: 'md:signal_cellular_alt_1_bar', color: 'greenLight700' },
  2: { label: 'Medium', icon: 'md:signal_cellular_alt_2_bar', color: 'warning400' },
  3: { label: 'Hard', icon: 'md:signal_cellular_alt', color: 'lightError' },
} as const

const difficulty = computed(() =>
  DIFFICULTIES[Number(props.level) as keyof typeof DIFFICULTIES] ?? DIFFICULTIES[2],
)
</script>
