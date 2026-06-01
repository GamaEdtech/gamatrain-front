<template>
  <div class="near-me-btn-container">
    <Button icon aria-label="Find nearest items" :aria-busy="isLoading" :disabled="isLoading"
      :loading="isLoading || dataLoading" :class="{ 'is-loading': isLoading }" class="mt-0" size="x-small"
      @click="emit('update-filter')" @keydown.enter.prevent="emit('update-filter')"
      @keydown.space.prevent="emit('update-filter')">

      <!-- Lottie animation -->
      <ClientOnly class="d-inline-flex">
        <DotLottieVue src="/images/near-me-gps-dark.json" v-if="mdAndDown" autoplay loop />
      </ClientOnly>

    </Button>

    <div class="primary-gray-500">
      <span>My Location: </span>
    </div>
    <p class="primary-gray-700"><span>{{ country || 'Country' }}</span> - <span>{{ postcode || 'zip code' }}</span>
    </p>
    <v-icon color="primary"> mdi-chevron-right </v-icon>
  </div>
</template>

<script setup lang="ts">
/**
 * SchoolNearMeBottomSheetButton
 *
 * Mobile "Near Me" action that emits `update-filter`.
 * Can optionally reverse geocode the user's location and
 * display country/postcode information.
 */

import { watch } from 'vue'
import { useDisplay } from 'vuetify'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import { useCurrentLocation } from '@/composables/useCurrentLocation'
import Button from '~/components/gama/Button.vue'

const { mdAndDown } = useDisplay()

type ReverseGeocodeResponse = {
  address?: {
    country?: string
    postcode?: string
    city?: string
  }
}

const country = ref('')
const postcode = ref('')

const props = withDefaults(
  defineProps<{
    enableReverseGeocoding?: boolean,
    dataLoading?: boolean
  }>(),
  {
    enableReverseGeocoding: false,
    dataLoading: false
  },
)

const emit = defineEmits<{
  (e: 'update-filter'): void
}>()

const { location, isLoading } = useCurrentLocation()

watch(() => location.value, async (newLocation) => {
  if (!props.enableReverseGeocoding) return
  if (!newLocation) return

  const response = await $fetch<ReverseGeocodeResponse>(
    'https://nominatim.openstreetmap.org/reverse',
    {
      query: {
        lat: newLocation.lat,
        lon: newLocation.lng,
        format: 'jsonv2',
      },
      headers: {
        'Accept-Language': 'en',
      },
    },
  )

  country.value = response.address?.country ?? ''
  postcode.value = response.address?.postcode ?? ''
})
</script>

<style scoped>
.near-me-btn-container {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
}
</style>
