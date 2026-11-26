<template>
  <!-- A plan's treasure chest: it grows and holds more gems with each level. Decoration only, the plan name and its
       gems are written next to it. -->
  <svg
    :width="size.width"
    :height="size.height"
    viewBox="0 0 72 64"
    aria-hidden="true"
    class="flex-shrink-0"
  >
    <template v-if="tier === 3">
      <path
        d="M8 30h56v26a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4z"
        fill="#5C6B8A"
      />
      <path
        d="M8 30c0-12 12-20 28-20s28 8 28 20z"
        fill="#7C8BAA"
      />
      <rect
        x="8"
        y="28"
        width="56"
        height="6"
        fill="#33415F"
      />
      <rect
        x="31"
        y="30"
        width="10"
        height="12"
        rx="2"
        fill="#FFB300"
      />
      <path
        d="M18 6l4 5-4 5-4-5z"
        fill="#FFE08A"
      />
      <path
        d="M30 2l4 5-4 5-4-5z"
        fill="#FFB300"
      />
      <path
        d="M42 2l4 5-4 5-4-5z"
        fill="#FFE08A"
      />
      <path
        d="M54 6l4 5-4 5-4-5z"
        fill="#FFB300"
      />
    </template>
    <template v-else-if="tier === 2">
      <path
        d="M10 30h52v26a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4z"
        fill="#D9932B"
      />
      <path
        d="M10 30c0-12 11-20 26-20s26 8 26 20z"
        fill="#F2B544"
      />
      <rect
        x="10"
        y="28"
        width="52"
        height="6"
        fill="#8A5A22"
      />
      <rect
        x="31"
        y="30"
        width="10"
        height="12"
        rx="2"
        fill="#FFE08A"
      />
      <path
        d="M24 4l4 5-4 5-4-5z"
        fill="#FFE08A"
      />
      <path
        d="M36 0l5 6-5 6-5-6z"
        fill="#FFB300"
      />
      <path
        d="M48 4l4 5-4 5-4-5z"
        fill="#FFE08A"
      />
    </template>
    <template v-else>
      <path
        d="M10 30h52v26a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4z"
        fill="#C98A3B"
      />
      <path
        d="M10 30c0-12 11-20 26-20s26 8 26 20z"
        fill="#E0A452"
      />
      <rect
        x="10"
        y="28"
        width="52"
        height="6"
        fill="#8A5A22"
      />
      <rect
        x="31"
        y="30"
        width="10"
        height="12"
        rx="2"
        fill="#FFB300"
      />
      <path
        d="M36 2l5 6-5 6-5-6z"
        fill="#FFB300"
      />
    </template>
  </svg>
</template>

<script setup lang="ts">
const props = defineProps<{
  /** The plan's level, 1 for the smallest. Anything past 3 draws the biggest chest. */
  level: number
}>()

const tier = computed(() => Math.min(Math.max(props.level, 1), 3))
const size = computed(() => ({ 1: { width: 64, height: 57 }, 2: { width: 80, height: 71 }, 3: { width: 72, height: 64 } }[tier.value]!))
</script>
