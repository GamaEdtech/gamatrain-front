<template>
  <div class="d-flex justify-space-between align-center ga-2">
    <v-btn
      v-if="mdAndDown"
      icon
      aria-label="Find nearest items"
      :aria-busy="isLoading"
      :disabled="isLoading"
      :loading="isLoading || dataLoading"
      :class="{ 'is-loading': isLoading }"
      color="primary"
      rounded=""
      size="x-small"
      @click="handleTrigger"
      @keydown.enter.space.prevent="handleTrigger"
    >
      <school-near-me-location-icon size="20" />
    </v-btn>

    <span class="text-grey500 text-no-wrap">
      Near me
      <!-- <sp-grey7>My Location: </sp-grey7> -->
    </span>
    <!-- <p class="text-grey700">
      <span>{{ country || 'Country' }}</span> - <span>{{ postcode || 'zip code' }}</span>
    </p> -->
    <v-icon color="primary">
      md:keyboard_arrow_right
    </v-icon>
  </div>
</template>

<script setup lang="ts">
// import { watch } from 'vue'
import { useDisplay } from 'vuetify'

interface IBottomSheetButton {
  enableReverseGeocoding?: boolean
  dataLoading?: boolean
}

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
  defineProps<IBottomSheetButton>(),
  {
    enableReverseGeocoding: false,
    dataLoading: false,
  },
)

const emit = defineEmits<{
  (e: 'updateFilter'): void
}>()

const { isLoading } = useCurrentLocation()

const handleTrigger = () => {
  emit('updateFilter')
}

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
