<template>
  <div class="campaign-hero-text">
    <v-chip
      variant="outlined"
      class="campaign-hero-text__badge font-weight-bold"
      prepend-icon="md:sell_outlined"
    >
      {{ fill(style.badge) }}
    </v-chip>
    <h1 class="campaign-hero-text__title">
      <span :class="{ 'campaign-hero-text__shine': theme === 'BlackFriday' }">{{ fill(style.titleLines[0]) }}</span>
      <span class="campaign-hero-text__accent">{{ fill(style.titleLines[1]) }}</span>
    </h1>
    <p class="campaign-hero-text__lead">
      {{ campaign.headline || fill(style.lead) }}
    </p>
    <span class="campaign-hero-text__ends">Sale ends in</span>
    <campaign-countdown
      :ends-at="campaign.endsAt"
      class="campaign-hero-text__countdown"
    />
    <div class="campaign-hero-text__actions">
      <v-btn
        to="/user/subscription"
        size="x-large"
        rounded="lg"
        class="campaign-hero-text__cta font-weight-bold text-none"
        flat
      >
        See the plans
      </v-btn>
      <span
        v-if="style.playHint"
        class="campaign-hero-text__play"
      >
        {{ style.playHint }}<template v-if="plays > 0"> · {{ plays }}</template>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CampaignDTO, CampaignTheme } from '@/types'
import type { CampaignThemeStyle } from '@/constants'

// The home hero's text while a sale campaign is live: the theme's badge, title and line, the countdown and the way to
// the plans. The site's usual hero text comes back by itself when the campaign ends.
defineProps<{
  campaign: CampaignDTO
  theme: CampaignTheme
  style: CampaignThemeStyle
  fill: (text: string) => string
  /** Snowflakes popped or fireworks launched, for the little counter. */
  plays: number
}>()
</script>

<style scoped>
.campaign-hero-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.campaign-hero-text__badge {
  border-color: var(--campaign-highlight);
  color: var(--campaign-highlight);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.campaign-hero-text__title {
  display: flex;
  flex-direction: column;
  margin: 0;
  font-size: clamp(1.75rem, 8vw, 2.25rem);
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -0.03em;
}

.campaign-hero-text__accent {
  color: var(--campaign-accent);
}

.campaign-hero-text__shine {
  background: linear-gradient(90deg, #b07a00 0%, #ffb300 25%, #fff1c2 50%, #ffb300 75%, #b07a00 100%);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: campaign-shine 4s linear infinite;
}

.campaign-hero-text__lead {
  max-width: 32.5rem;
  margin: 0;
  color: var(--campaign-muted);
  font-size: 1rem;
  line-height: 1.45;
}

.campaign-hero-text__ends {
  color: var(--campaign-muted);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.campaign-hero-text__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.75rem 1rem;
  margin-top: 0.25rem;
}

.campaign-hero-text__cta {
  background: var(--campaign-cta-bg);
  color: var(--campaign-cta-text);
}

.campaign-hero-text__play {
  color: var(--campaign-muted);
  font-size: 0.8125rem;
  font-weight: 600;
}

@media (min-width: 960px) {
  .campaign-hero-text {
    align-items: flex-start;
    gap: 1rem;
  }

  .campaign-hero-text__title {
    font-size: 3.5rem;
  }

  .campaign-hero-text__lead {
    font-size: 1.1875rem;
  }

  .campaign-hero-text__actions {
    justify-content: flex-start;
  }
}

@keyframes campaign-shine {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .campaign-hero-text__shine {
    animation: none;
  }
}
</style>
