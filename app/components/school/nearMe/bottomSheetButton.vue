<template>
  <div class="d-flex justify-space-between align-center ga-2">
    <v-btn
      icon
      aria-label="Find nearest items"
      :aria-busy="isLoading"
      :disabled="isLoading"
      :loading="isLoading || dataLoading"
      :class="{ 'is-loading': isLoading }"
      size="x-small"
      color="primary"
      rounded=""
      @click="emit('updateFilter')"
      @keydown.enter.prevent="emit('updateFilter')"
      @keydown.space.prevent="emit('updateFilter')"
    >
      <!-- Lottie animation -->
      <ClientOnly class="d-inline-flex">
        <DotLottieVue
          v-if="mdAndDown"
          src="/images/near-me-gps-dark.json"
          autoplay
          loop
        />
      </ClientOnly>
    </v-btn>

    <div class="text-grey500">
      Near me
      <!-- <sp-grey7>My Location: </sp-grey7> -->
    </div>
    <!-- <p class="text-grey700">
      <span>{{ country || 'Country' }}</span> - <span>{{ postcode || 'zip code' }}</span>
    </p> -->
    <v-icon color="primary">
      mdi-chevron-right
    </v-icon>
  </div>
</template>

<script setup lang="ts">
// import { watch } from 'vue'
import { useDisplay } from 'vuetify'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'

const { mdAndDown } = useDisplay()

// interface IReverseGeocodeResponse {
//   address?: {
//     country?: string
//     postcode?: string
//     city?: string
//   }
// }

// const country = ref('')
// const postcode = ref('')

withDefaults(
  defineProps<{
    enableReverseGeocoding?: boolean
    dataLoading?: boolean
  }>(),
  {
    enableReverseGeocoding: false,
    dataLoading: false,
  },
)

const emit = defineEmits<{
  (e: 'updateFilter'): void
}>()

const { isLoading } = useCurrentLocation()

// watch(() => location.value, async (newLocation) => {
//   if (!props.enableReverseGeocoding) return
//   if (!newLocation) return

//   const response = await $fetch<IReverseGeocodeResponse>(
//     'https://nominatim.openstreetmap.org/reverse',
//     {
//       query: {
//         lat: newLocation.lat,
//         lon: newLocation.lng,
//         format: 'jsonv2',
//       },
//       headers: {
//         'Accept-Language': 'en',
//       },
//     },
//   )

//   country.value = response.address?.country ?? ''
//   postcode.value = response.address?.postcode ?? ''
// })
</script>
