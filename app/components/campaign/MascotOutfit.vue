<template>
  <!-- Laid over the hero image (620x1134): positions are percentages of the image, so it scales with it. -->
  <svg
    v-if="theme === 'BlackFriday'"
    class="mascot-outfit"
    aria-hidden="true"
    viewBox="0 0 94 62"
    style="left: 9.1%; top: 40.9%; width: 39%"
  >
    <path
      d="M44 30 Q50 24 58 31"
      fill="none"
      stroke="#FFB300"
      stroke-width="3"
    />
    <path
      d="M76 38 L93 41"
      stroke="#0B0B0F"
      stroke-width="4"
      stroke-linecap="round"
    />
    <ellipse
      cx="28"
      cy="29"
      rx="19"
      ry="15"
      transform="rotate(12 28 29)"
      fill="#0B0B0F"
      stroke="#FFB300"
      stroke-width="2.5"
    />
    <ellipse
      cx="62"
      cy="38"
      rx="17"
      ry="14"
      transform="rotate(12 62 38)"
      fill="#0B0B0F"
      stroke="#FFB300"
      stroke-width="2.5"
    />
    <path
      d="M17 24 L27 20 M52 33 L60 30"
      stroke="#FFFFFF"
      stroke-width="3"
      stroke-linecap="round"
      opacity="0.8"
    />
  </svg>
  <svg
    v-else-if="theme === 'Christmas'"
    class="mascot-outfit"
    aria-hidden="true"
    viewBox="0 0 70 62"
    style="left: 4.1%; top: 29.1%; width: 29%; transform: rotate(-24deg)"
  >
    <path
      d="M12 50 Q20 16 48 8 Q62 22 60 50 Z"
      fill="#E5484D"
    />
    <path
      d="M48 8 Q30 0 16 18"
      fill="none"
      stroke="#E5484D"
      stroke-width="9"
      stroke-linecap="round"
    />
    <circle
      cx="14"
      cy="20"
      r="7"
      fill="#FFFFFF"
    />
    <rect
      x="5"
      y="45"
      width="62"
      height="13"
      rx="6.5"
      fill="#FFFFFF"
    />
  </svg>
  <svg
    v-else-if="theme === 'NewYear'"
    class="mascot-outfit"
    aria-hidden="true"
    viewBox="0 0 56 70"
    style="left: 5.8%; top: 26.4%; width: 23.2%; transform: rotate(-22deg)"
  >
    <path
      d="M28 8 L52 62 L4 62 Z"
      fill="#5EEAD4"
    />
    <path
      d="M22 22 L35 22 M17 34 L40 34 M12 46 L45 46"
      stroke="#FFB300"
      stroke-width="5"
    />
    <rect
      x="2"
      y="58"
      width="52"
      height="8"
      rx="4"
      fill="#FFB300"
    />
    <circle
      cx="28"
      cy="8"
      r="7"
      fill="#FF7AB6"
    />
  </svg>
</template>

<script setup lang="ts">
import type { CampaignTheme } from '@/types'

// The mascot dresses for the occasion: sunglasses for Black Friday, a Santa hat, a party hat. Generic has no outfit.
defineProps<{ theme: CampaignTheme }>()
</script>

<style scoped>
.mascot-outfit {
  position: absolute;
  z-index: 1;
  height: auto;
  pointer-events: none;
}
</style>
