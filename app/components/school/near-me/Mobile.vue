<template>
  <div class="near-me-btn-container">
    <Button icon aria-label="Find nearest items" :aria-busy="isLoading" :disabled="isLoading" :loading="isLoading"
      :class="{ 'is-loading': isLoading }" class="mt-0" size="x-small" @click="emit('update-filter')"
      @keydown.enter.prevent="emit('update-filter')" @keydown.space.prevent="emit('update-filter')">

      <!-- Lottie animation -->
      <ClientOnly class="d-inline-flex">
        <DotLottieVue src="/images/near-me-gps-dark.json" autoplay loop />
      </ClientOnly>

    </Button>

    <div class="primary-gray-500">
      <span v-if="isLoading">Finding...</span>
      <span v-else>My Location: </span>
    </div>
    <p class="primary-gray-700"><span>{{ country || 'Country' }}</span> - <span>{{ postcode || 'zip code' }}</span>
    </p>
    <v-icon color="primary"> mdi-chevron-right </v-icon>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import { useCurrentLocation } from "@/composables/useCurrentLocation";
import Button from "~/components/gama/Button.vue";

type ReverseGeocodeResponse = {
  address?: {
    country?: string;
    postcode?: string;
    city?: string;
  };
};

const country = ref('');
const postcode = ref('');

const emit = defineEmits<{
  (e: "update-filter"): void;
}>();

const { location, isLoading } = useCurrentLocation();

watch(() => location.value, async (newLocation) => {
  if (!newLocation) return;

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
    }
  );

  country.value = response.address?.country ?? '';
  postcode.value = response.address?.postcode ?? '';
});
</script>

<style scoped>
.near-me-btn-container {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
}
</style>
