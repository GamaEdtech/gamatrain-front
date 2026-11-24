<template>
  <div class="campaign-gift">
    <template v-if="!opened">
      <button
        type="button"
        class="campaign-gift__box"
        :aria-label="`Open your ${label} gift`"
        @click="open"
      >
        <svg
          class="campaign-gift__shake"
          aria-hidden="true"
          viewBox="0 0 100 100"
        >
          <ellipse
            cx="40"
            cy="22"
            rx="12"
            ry="7"
            transform="rotate(-25 40 22)"
            fill="none"
            :stroke="colors.ribbon"
            stroke-width="5"
          />
          <ellipse
            cx="60"
            cy="22"
            rx="12"
            ry="7"
            transform="rotate(25 60 22)"
            fill="none"
            :stroke="colors.ribbon"
            stroke-width="5"
          />
          <rect
            x="12"
            y="44"
            width="76"
            height="50"
            rx="4"
            :fill="colors.box"
          />
          <rect
            x="6"
            y="30"
            width="88"
            height="17"
            rx="4"
            :fill="colors.lid"
          />
          <rect
            x="45"
            y="30"
            width="10"
            height="64"
            :fill="colors.ribbon"
          />
          <circle
            cx="50"
            cy="29"
            r="6"
            :fill="colors.knot"
          />
        </svg>
      </button>
      <span class="campaign-gift__hint">Tap to open your gift</span>
    </template>
    <div
      v-else
      class="campaign-gift__opened"
      role="status"
    >
      <span
        v-if="justOpened"
        class="campaign-gift__confetti"
        aria-hidden="true"
      >
        <span
          v-for="bit in confetti"
          :key="bit.deg"
          class="campaign-gift__ray"
          :style="{ transform: `rotate(${bit.deg}deg)` }"
        >
          <span
            class="campaign-gift__bit"
            :style="{ background: bit.color }"
          />
        </span>
      </span>
      <nuxt-link
        to="/user/subscription"
        class="campaign-gift__badge"
        :class="{ 'campaign-gift__badge--pop': justOpened }"
        :style="{ background: colors.badge, color: colors.onBadge }"
        :aria-label="`${percent}% off unlocked: see the plans`"
      >
        <span class="campaign-gift__percent">-{{ percent }}%</span>
        <span class="campaign-gift__unlocked">unlocked</span>
      </nuxt-link>
      <span class="campaign-gift__hint campaign-gift__see">See the plans</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CampaignTheme } from '@/types'

// "Tap to open your gift": everyone gets the same discount, the reveal is only for fun and never pretends to be random.
// Opening is remembered per campaign in this browser, so it stays open on the next visit.
const props = defineProps<{ campaignId: number, theme: CampaignTheme, percent: number, label: string }>()

const PALETTES: Record<CampaignTheme, { box: string, lid: string, ribbon: string, knot: string, badge: string, onBadge: string, confetti: string[] }> = {
  BlackFriday: { box: '#1F1F27', lid: '#2C2C36', ribbon: '#FFB300', knot: '#FFD066', badge: '#FFB300', onBadge: '#0B0B0F', confetti: ['#FFB300', '#FFFFFF', '#FFD066', '#B07A00'] },
  Christmas: { box: '#E5484D', lid: '#C42B31', ribbon: '#2F9E6E', knot: '#3FBF86', badge: '#E5484D', onBadge: '#FFFFFF', confetti: ['#E5484D', '#FFFFFF', '#2F9E6E', '#FFD066'] },
  NewYear: { box: '#5EEAD4', lid: '#2BBFA8', ribbon: '#FFB300', knot: '#FFD066', badge: '#5EEAD4', onBadge: '#0D1226', confetti: ['#FFB300', '#5EEAD4', '#FF7AB6', '#A78BFA'] },
  Generic: { box: '#FFB300', lid: '#E09E00', ribbon: '#1E2A44', knot: '#33446A', badge: '#FFB300', onBadge: '#1E2A44', confetti: ['#FFB300', '#FFFFFF', '#FFD066', '#33446A'] },
}

const colors = computed(() => PALETTES[props.theme])
const confetti = computed(() => Array.from({ length: 16 }, (_, i) => ({ deg: i * 22.5, color: colors.value.confetti[i % 4] })))
const storageKey = computed(() => `campaign-gift-${props.campaignId}`)
const opened = ref(false)
const justOpened = ref(false)

onMounted(() => {
  try {
    opened.value = localStorage.getItem(storageKey.value) === '1'
  }
  catch {
    // Private mode without storage: the gift just starts closed.
  }
})

const open = () => {
  opened.value = true
  justOpened.value = true
  try {
    localStorage.setItem(storageKey.value, '1')
  }
  catch {
    // Not remembered; nothing else changes.
  }
}
</script>

<style scoped>
.campaign-gift {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.campaign-gift__box {
  width: 5.5rem;
  height: 5.5rem;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.campaign-gift__box svg {
  width: 100%;
  height: 100%;
}

.campaign-gift__shake {
  transform-origin: 50% 90%;
  animation: gift-shake 2.6s ease-in-out infinite;
}

.campaign-gift__hint {
  color: var(--campaign-highlight, #fff);
  font-size: 0.8125rem;
  font-weight: 800;
  white-space: nowrap;
}

.campaign-gift__opened {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 6.5rem;
  height: 6.5rem;
}

.campaign-gift__badge {
  display: flex;
  text-decoration: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 5.75rem;
  height: 5.75rem;
  border-radius: 50%;
  box-shadow: 0 0 0 0.375rem rgba(255, 255, 255, 0.15);
}

.campaign-gift__badge--pop {
  animation: gift-pop 0.5s ease-out both;
}

.campaign-gift__percent {
  font-size: 1.75rem;
  font-weight: 900;
  line-height: 1;
}

.campaign-gift__unlocked {
  font-size: 0.625rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.campaign-gift__see {
  margin-top: 0.25rem;
}

.campaign-gift__confetti {
  position: absolute;
  top: 40%;
  left: 50%;
}

.campaign-gift__ray {
  position: absolute;
  top: 0;
  left: 0;
}

.campaign-gift__bit {
  position: absolute;
  top: -2px;
  left: -4px;
  width: 8px;
  height: 4px;
  border-radius: 1px;
  animation: gift-fly 1.2s ease-out forwards;
}

@media (min-width: 960px) {
  .campaign-gift__box {
    width: 8rem;
    height: 8rem;
  }

  .campaign-gift__opened {
    width: 9rem;
    height: 9rem;
  }

  .campaign-gift__badge {
    width: 8rem;
    height: 8rem;
  }

  .campaign-gift__percent {
    font-size: 2.5rem;
  }

  .campaign-gift__unlocked {
    font-size: 0.75rem;
  }
}

@keyframes gift-shake {
  0%, 30%, 100% { transform: rotate(0); }
  5% { transform: rotate(-9deg); }
  10% { transform: rotate(9deg); }
  15% { transform: rotate(-6deg); }
  20% { transform: rotate(6deg); }
  25% { transform: rotate(-2deg); }
}

@keyframes gift-pop {
  0% { transform: scale(0.2); opacity: 0; }
  60% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes gift-fly {
  0% { transform: translateY(0) rotate(0); opacity: 1; }
  100% { transform: translateY(-7.5rem) rotate(400deg); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .campaign-gift__shake,
  .campaign-gift__badge--pop {
    animation: none;
  }

  .campaign-gift__confetti {
    display: none;
  }
}
</style>
