<template>
  <!-- Built to take about the same room as the usual hero text, so swapping it in after the page has painted doesn't
       push the exam finder down (CLS): on phones only the title and one line; the countdown boxes and the button sit on
       one row on desktop; on phones the opened gift is the way to the plans. -->
  <div class="campaign-hero-text">
    <v-chip
      variant="outlined"
      class="campaign-hero-text__badge d-none d-md-inline-flex font-weight-bold"
      prepend-icon="md:sell_outlined"
    >
      {{ fill(style.badge) }}
    </v-chip>
    <h1 class="campaign-hero-text__title">
      <span :class="{ 'campaign-hero-text__shine': theme === 'BlackFriday' }">{{ fill(style.titleLines[0]) }}</span>
      <span class="campaign-hero-text__accent">{{ fill(style.titleLines[1]) }}</span>
    </h1>
    <p class="campaign-hero-text__line d-md-none">
      <strong>{{ fill(style.phoneLine) }}</strong>
      <campaign-countdown
        :ends-at="campaign.endsAt"
        variant="inline"
      />
    </p>
    <p class="campaign-hero-text__lead d-none d-md-block">
      {{ campaign.headline || fill(style.lead) }}
    </p>
    <div class="campaign-hero-text__row d-none d-md-flex">
      <campaign-countdown :ends-at="campaign.endsAt" />
      <div class="d-flex flex-column ga-1">
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
  gap: 0.5rem;
  animation: campaign-fade-in 0.4s ease-out;
}

.campaign-hero-text__badge {
  border-color: var(--campaign-highlight);
  color: var(--campaign-highlight);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

/* On phones every line stays one line, sized to the screen: the page first paints with a fallback font and the site's
   font is wider, so text that wraps would gain a line when it loads and push the page down (CLS). */
.campaign-hero-text__title {
  display: flex;
  flex-direction: column;
  margin: 0;
  font-size: clamp(1rem, 5.4vw, 2rem);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.03em;
}

.campaign-hero-text__title > span {
  white-space: nowrap;
}

.campaign-hero-text__title > .campaign-hero-text__shine {
  font-size: 1.45em;
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

.campaign-hero-text__line {
  display: flex;
  flex-direction: column;
  margin: 0;
  color: var(--campaign-muted);
  font-size: 0.9375rem;
  line-height: 1.4;
  white-space: nowrap;
}

.campaign-hero-text__line strong {
  color: var(--campaign-highlight);
}

.campaign-hero-text__lead {
  max-width: 32.5rem;
  margin: 0;
  color: var(--campaign-muted);
  font-size: 1.1875rem;
  line-height: 1.45;
}

.campaign-hero-text__row {
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem 1.5rem;
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

@media (min-width: 600px) {
  .campaign-hero-text__title {
    font-size: 2.25rem;
  }

  .campaign-hero-text__title > .campaign-hero-text__shine {
    font-size: 1em;
  }
}

@media (min-width: 960px) {
  .campaign-hero-text {
    align-items: flex-start;
    gap: 1rem;
  }

  .campaign-hero-text__title {
    font-size: 3.5rem;
  }

  .campaign-hero-text__title > span {
    white-space: normal;
  }
}

@keyframes campaign-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes campaign-shine {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .campaign-hero-text,
  .campaign-hero-text__shine {
    animation: none;
  }
}
</style>
