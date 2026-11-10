<template>
  <!-- The content of the "Home" chip's menu: find the home by address, or take the current location. -->
  <v-card
    width="320"
    class="pa-3"
  >
    <div class="text-body-2 font-weight-bold text-grey900">
      Your home
    </div>
    <div class="text-caption text-grey600 mb-3">
      Each school then shows its distance and an estimated walk and drive. Saved on this device only.
    </div>
    <v-autocomplete
      v-model="picked"
      v-model:search="search"
      :items="suggestions"
      :loading="searching"
      item-title="label"
      return-object
      no-filter
      hide-no-data
      hide-details
      autofocus
      density="compact"
      variant="solo-filled"
      flat
      rounded="lg"
      prepend-inner-icon="md:search"
      placeholder="Street or area"
      @update:model-value="choose"
    />
    <div class="d-flex align-center ga-1 mt-2">
      <v-btn
        variant="text"
        size="small"
        color="primaryStrong"
        class="text-none px-2"
        prepend-icon="md:my_location"
        :loading="isLoading"
        @click="useMyLocation"
      >
        Use my location
      </v-btn>
      <v-spacer />
      <v-btn
        v-if="home"
        variant="text"
        size="small"
        color="grey600"
        class="text-none px-2"
        @click="save(null)"
      >
        Remove home
      </v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import type { SchoolHome } from '@/composables/useSchoolHome'

interface Suggestion extends SchoolHome {
  key: string
}

const emit = defineEmits<{ done: [] }>()

const { home, setHome } = useSchoolHome()
const { isLoading, fetchLocation } = useCurrentLocation()

const search = ref('')
const picked = ref<Suggestion | null>(null)
const suggestions = ref<Suggestion[]>([])
const searching = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

// OpenStreetMap's geocoder allows one request a second, so wait until typing stops.
watch(search, (value) => {
  if (timer) clearTimeout(timer)
  if (!value || value.length < 3 || value === picked.value?.label) return
  timer = setTimeout(async () => {
    searching.value = true
    try {
      const results = await $fetch<{ place_id: number, display_name: string, lat: string, lon: string }[]>(
        'https://nominatim.openstreetmap.org/search',
        { params: { q: value, format: 'json', limit: 6 }, headers: { 'Accept-Language': 'en' } },
      )
      suggestions.value = results.map(result => ({
        key: String(result.place_id),
        label: result.display_name.split(',').slice(0, 3).join(',').trim(),
        lat: Number(result.lat),
        lng: Number(result.lon),
      }))
    }
    catch {
      suggestions.value = []
    }
    finally {
      searching.value = false
    }
  }, 700)
})

const save = (value: SchoolHome | null) => {
  setHome(value)
  emit('done')
}

const choose = (value: Suggestion | null) => {
  if (value) save({ lat: value.lat, lng: value.lng, label: value.label })
}

const useMyLocation = async () => {
  try {
    const position = await fetchLocation()
    if (position) save({ lat: position.lat, lng: position.lng, label: 'My location' })
  }
  catch {
    // useCurrentLocation already told the visitor why.
  }
}
</script>
