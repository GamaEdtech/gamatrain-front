<template>
  <div class="home-bar d-flex flex-wrap align-center ga-2 text-body-2">
    <v-icon
      size="18"
      color="grey600"
    >
      md:home
    </v-icon>

    <template v-if="home && !editing">
      <span class="text-grey700">Distances from <strong class="text-grey900">{{ home.label }}</strong></span>
      <v-btn
        variant="text"
        size="small"
        color="primaryStrong"
        class="text-none px-1"
        @click="editing = true"
      >
        Change
      </v-btn>
      <v-btn
        variant="text"
        size="small"
        color="grey600"
        class="text-none px-1"
        @click="clearHome"
      >
        Remove
      </v-btn>
    </template>

    <template v-else>
      <span class="text-grey700">Set your home to see how far each school is.</span>
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
        density="compact"
        variant="underlined"
        placeholder="Street or area"
        class="home-bar__search"
        @update:model-value="choose"
      />
      <v-btn
        variant="text"
        size="small"
        color="primaryStrong"
        class="text-none px-1"
        prepend-icon="md:my_location"
        :loading="isLoading"
        @click="useMyLocation"
      >
        Use my location
      </v-btn>
      <v-btn
        v-if="home"
        variant="text"
        size="small"
        color="grey600"
        class="text-none px-1"
        @click="editing = false"
      >
        Cancel
      </v-btn>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { SchoolHome } from '@/composables/useSchoolHome'

interface Suggestion extends SchoolHome {
  key: string
}

const { home, setHome } = useSchoolHome()
const { isLoading, fetchLocation } = useCurrentLocation()

const editing = ref(false)
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
  editing.value = false
}

const choose = (value: Suggestion | null) => {
  if (value) save({ lat: value.lat, lng: value.lng, label: value.label })
}

const useMyLocation = async () => {
  try {
    const position = await fetchLocation()
    if (position) save({ lat: position.lat, lng: position.lng, label: 'your current location' })
  }
  catch {
    // useCurrentLocation already told the visitor why.
  }
}

const clearHome = () => save(null)
</script>

<style scoped>
.home-bar {
  min-height: 40px;
}

.home-bar__search {
  flex: 0 1 240px;
  min-width: 160px;
}
</style>
