<template>
  <v-card
    variant="flat"
    border
    rounded="lg"
    class="home-bar pa-3"
  >
    <div class="d-flex flex-wrap align-center ga-3">
      <v-avatar
        color="primary50"
        rounded="lg"
        size="40"
      >
        <v-icon color="primaryStrong">
          md:home
        </v-icon>
      </v-avatar>

      <template v-if="home && !editing">
        <div class="flex-grow-1 home-bar__text">
          <div class="text-body-1 font-weight-semibold text-grey800">
            Distances from your home: {{ home.label }}
          </div>
          <div class="text-caption text-grey600">
            Saved on this device only. Each school shows the distance and an estimated walk and drive.
          </div>
        </div>
        <v-btn
          variant="outlined"
          color="grey700"
          rounded="pill"
          class="text-none"
          @click="editing = true"
        >
          Change home
        </v-btn>
        <v-btn
          variant="text"
          color="grey700"
          rounded="pill"
          class="text-none"
          @click="clearHome"
        >
          Remove
        </v-btn>
      </template>

      <template v-else>
        <div class="flex-grow-1 home-bar__text">
          <div class="text-body-1 font-weight-semibold text-grey800">
            How far is each school from your home?
          </div>
          <div class="text-caption text-grey600">
            Set your home once to see the distance, walk and drive on every school.
          </div>
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
          clearable
          density="compact"
          variant="outlined"
          rounded="pill"
          prepend-inner-icon="md:search"
          label="Your street or area"
          class="home-bar__search"
          @update:model-value="choose"
        />
        <v-btn
          color="primary"
          rounded="pill"
          class="text-none"
          prepend-icon="md:my_location"
          :loading="isLoading"
          @click="useMyLocation"
        >
          Use my location
        </v-btn>
        <v-btn
          v-if="home"
          variant="text"
          rounded="pill"
          class="text-none"
          @click="editing = false"
        >
          Cancel
        </v-btn>
      </template>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import type { SchoolHome } from '@/composables/useSchoolHome'

interface Suggestion extends SchoolHome {
  key: string
}

const emit = defineEmits<{ changed: [home: SchoolHome | null] }>()

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
  emit('changed', value)
}

const choose = (value: Suggestion | null) => {
  if (value) save({ lat: value.lat, lng: value.lng, label: value.label })
}

const useMyLocation = async () => {
  try {
    const position = await fetchLocation()
    if (position) save({ lat: position.lat, lng: position.lng, label: 'my current location' })
  }
  catch {
    // useCurrentLocation already told the visitor why.
  }
}

const clearHome = () => save(null)
</script>

<style scoped>
.home-bar {
  background: rgb(var(--v-theme-surface));
}

.home-bar__text {
  flex: 1 1 260px;
  min-width: 0;
}

.home-bar__search {
  flex: 1 1 240px;
  min-width: 200px;
}
</style>
