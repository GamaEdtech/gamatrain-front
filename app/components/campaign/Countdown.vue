<template>
  <div
    v-if="variant === 'boxes'"
    class="campaign-countdown"
    role="timer"
    :aria-label="`Sale ends in ${left.short}`"
  >
    <div
      v-for="unit in left.units"
      :key="unit.label"
      class="campaign-countdown__box"
    >
      <span class="campaign-countdown__value">{{ unit.value }}</span>
      <span class="campaign-countdown__label">{{ unit.label }}</span>
    </div>
  </div>
  <span
    v-else
    class="campaign-countdown--inline"
  >Ends in {{ left.short }}</span>
</template>

<script setup lang="ts">
// The sale's countdown: four boxes in the hero, one line in the plans dialog. Colours come from the parent's
// --campaign-* variables, so each theme styles it.
const props = withDefaults(defineProps<{ endsAt: string, variant?: 'boxes' | 'inline' }>(), { variant: 'boxes' })
const left = useCampaignCountdown(() => props.endsAt)
</script>

<style scoped>
.campaign-countdown {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 4.625rem));
  gap: 0.5rem;
}

.campaign-countdown__box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem 0;
  border: 1px solid var(--campaign-box-border, rgba(255, 255, 255, 0.18));
  border-radius: 0.75rem;
  background: var(--campaign-box-bg, rgba(255, 255, 255, 0.08));
}

.campaign-countdown__value {
  color: var(--campaign-highlight, #fff);
  font-size: 1.5rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  line-height: 1.2;
}

.campaign-countdown__label {
  color: var(--campaign-muted, #a9b4c8);
  font-size: 0.6875rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.campaign-countdown--inline {
  font-variant-numeric: tabular-nums;
}

@media (min-width: 960px) {
  .campaign-countdown__value {
    font-size: 1.875rem;
  }
}
</style>
