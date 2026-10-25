<template>
  <div class="w-100 d-flex flex-column ga-5">
    <div class="offer-hero w-100 rounded-xl pa-6 pa-md-8 d-flex flex-column flex-md-row align-md-center ga-6">
      <div class="d-flex flex-column ga-4 flex-grow-1">
        <v-chip
          v-if="status.offerOpen && offerEndsLabel"
          color="primary"
          variant="flat"
          class="align-self-start text-h6 font-weight-bold"
          prepend-icon="md:schedule"
        >
          Your {{ formatPercent(status.offerPercent) }} offer is open until {{ offerEndsLabel }}
        </v-chip>

        <h2 class="text-h3 text-md-h2 font-weight-bold text-white">
          Bring your students to Gamatrain, and get {{ formatPercent(status.joinPercent) }} as a thank-you
        </h2>
        <p class="text-h5 text-grey300 font-weight-regular">
          Your students get free past papers, online exams and study tools. If any of them later choose a paid plan, you
          receive {{ formatPercent(status.joinPercent) }} of it, for as long as they stay subscribed. They pay nothing extra.
        </p>

        <v-alert
          v-if="offerEnded"
          type="info"
          variant="tonal"
          density="compact"
          class="text-h6"
        >
          Your {{ formatPercent(status.offerPercent) }} offer has ended. You can still join today at
          {{ formatPercent(status.joinPercent) }}.
        </v-alert>

        <div class="d-flex flex-column flex-sm-row align-sm-center ga-3 mt-2">
          <v-btn
            color="primary"
            rounded="pill"
            height="48"
            flat
            :loading="loading"
            class="text-h5 font-weight-bold px-8"
            prepend-icon="md:lock"
            @click="emit('join')"
          >
            Join and lock {{ formatPercent(status.joinPercent) }}
          </v-btn>
          <span class="text-h6 text-grey300">
            Free to join. Your rate is locked once you're in.
          </span>
        </div>
      </div>

      <div class="percent-badge d-none d-md-flex flex-column align-center justify-center flex-shrink-0">
        <span class="percent-value font-weight-black">{{ formatPercent(status.joinPercent) }}</span>
        <span class="text-h6 text-grey700 font-weight-bold">for life</span>
      </div>
    </div>

    <user-invite-how-it-works />
  </div>
</template>

<script setup lang="ts">
import type { ReferralStatusDTO } from '@/types'

const props = defineProps<{
  status: ReferralStatusDTO
  loading: boolean
}>()
const emit = defineEmits(['join'])

const { formatLocal } = useDateTime()

const offerEndsLabel = computed(() =>
  props.status.offerExpirationDate ? formatLocal(props.status.offerExpirationDate, 'D MMMM YYYY') : '')

const offerEnded = computed(() =>
  props.status.offerPercent !== null && !props.status.offerOpen && props.status.offerPercent !== props.status.joinPercent)

const formatPercent = (value: number | null) => `${Number(value ?? 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}%`
</script>

<style scoped>
.offer-hero {
  background: linear-gradient(135deg, rgb(var(--v-theme-brandNavy)) 0%, #2b3a5c 100%);
}

.percent-badge {
  width: 168px;
  height: 168px;
  border-radius: 50%;
  background: rgb(var(--v-theme-primary));
  box-shadow: 0 0 0 10px rgba(255, 179, 0, 0.2);
}

.percent-value {
  font-size: 48px;
  line-height: 1;
  color: rgb(var(--v-theme-grey900));
}
</style>
