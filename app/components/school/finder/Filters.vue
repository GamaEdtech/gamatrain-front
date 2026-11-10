<template>
  <div class="finder-filters d-flex flex-column ga-5">
    <div class="d-flex align-center justify-space-between">
      <h2 class="text-subtitle-1 font-weight-bold text-grey800 ma-0">
        Filters
      </h2>
      <v-btn
        v-if="canClear"
        variant="text"
        color="primaryStrong"
        class="text-none px-1"
        @click="emit('clear')"
      >
        Clear all
      </v-btn>
    </div>

    <section aria-labelledby="filter-area">
      <h3
        id="filter-area"
        class="finder-filters__title"
      >
        Area
      </h3>
      <div class="d-flex flex-column ga-2">
        <v-autocomplete
          :model-value="filters.country"
          :items="countries"
          :loading="loading.country"
          item-title="title"
          item-value="id"
          label="Country"
          density="compact"
          variant="outlined"
          hide-details
          clearable
          @update:model-value="pickCountry"
        />
        <v-autocomplete
          :model-value="filters.state"
          :items="states"
          :loading="loading.state"
          :disabled="!filters.country"
          item-title="title"
          item-value="id"
          label="State / region"
          density="compact"
          variant="outlined"
          hide-details
          clearable
          @update:model-value="pickState"
        />
        <v-autocomplete
          :model-value="filters.city"
          :items="cities"
          :loading="loading.city"
          :disabled="!filters.state"
          item-title="title"
          item-value="id"
          label="City / district"
          density="compact"
          variant="outlined"
          hide-details
          clearable
          @update:model-value="(city: number | null) => emit('update', { city: city ?? null })"
        />
      </div>
    </section>

    <section aria-labelledby="filter-distance">
      <h3
        id="filter-distance"
        class="finder-filters__title"
      >
        Distance from home
      </h3>
      <v-chip-group
        :model-value="filters.within"
        selected-class="finder-filters__chip--on"
        column
        :disabled="!hasHome"
        @update:model-value="(km: number | null) => emit('update', { within: km ?? null })"
      >
        <v-chip
          v-for="km in SCHOOL_FINDER_DISTANCES"
          :key="km"
          :value="km"
          filter
          variant="outlined"
        >
          {{ km }} km
        </v-chip>
      </v-chip-group>
      <p
        v-if="!hasHome"
        class="text-caption text-grey600 ma-0"
      >
        Set your home above to use this.
      </p>
    </section>

    <section
      v-if="busTag || boardingTag"
      aria-labelledby="filter-getting-there"
    >
      <h3
        id="filter-getting-there"
        class="finder-filters__title"
      >
        Getting there and staying
      </h3>
      <v-checkbox
        v-if="busTag"
        :model-value="filters.facilities.includes(busTag.id)"
        density="compact"
        hide-details
        color="primaryStrong"
        @update:model-value="toggleFacility(busTag.id)"
      >
        <template #label>
          <span class="flex-grow-1">School bus</span>
          <span class="text-grey600 ml-2">{{ formatCount(busTag.count) }}</span>
        </template>
      </v-checkbox>
      <v-checkbox
        v-if="boardingTag"
        :model-value="filters.facilities.includes(boardingTag.id)"
        density="compact"
        hide-details
        color="primaryStrong"
        @update:model-value="toggleFacility(boardingTag.id)"
      >
        <template #label>
          <span class="flex-grow-1">Boarding (dormitory)</span>
          <span class="text-grey600 ml-2">{{ formatCount(boardingTag.count) }}</span>
        </template>
      </v-checkbox>
    </section>

    <section
      v-if="typeOptions.length"
      aria-labelledby="filter-type"
    >
      <h3
        id="filter-type"
        class="finder-filters__title"
      >
        School type
      </h3>
      <v-checkbox
        v-for="option in typeOptions"
        :key="option.value"
        :model-value="filters.types.includes(option.value)"
        density="compact"
        hide-details
        color="primaryStrong"
        @update:model-value="toggleType(option.value)"
      >
        <template #label>
          <span class="flex-grow-1">{{ option.title }}</span>
          <span class="text-grey600 ml-2">{{ formatCount(option.count) }}</span>
        </template>
      </v-checkbox>
    </section>

    <section
      v-if="facilityOptions.length"
      aria-labelledby="filter-facilities"
    >
      <h3
        id="filter-facilities"
        class="finder-filters__title"
      >
        Facilities
      </h3>
      <v-checkbox
        v-for="tag in visibleFacilities"
        :key="tag.id"
        :model-value="filters.facilities.includes(tag.id)"
        density="compact"
        hide-details
        color="primaryStrong"
        @update:model-value="toggleFacility(tag.id)"
      >
        <template #label>
          <span class="flex-grow-1">{{ tag.name }}</span>
          <span class="text-grey600 ml-2">{{ formatCount(tag.count) }}</span>
        </template>
      </v-checkbox>
      <v-btn
        v-if="facilityOptions.length > 4"
        variant="text"
        color="primaryStrong"
        class="text-none px-1"
        @click="showAllFacilities = !showAllFacilities"
      >
        {{ showAllFacilities ? 'Show fewer' : `Show ${facilityOptions.length - 4} more` }}
      </v-btn>
    </section>

    <section aria-labelledby="filter-info">
      <h3
        id="filter-info"
        class="finder-filters__title"
      >
        Information available
      </h3>
      <v-checkbox
        :model-value="filters.photos"
        density="compact"
        hide-details
        color="primaryStrong"
        @update:model-value="(value: boolean | null) => emit('update', { photos: !!value })"
      >
        <template #label>
          <span class="flex-grow-1">Has photos</span>
          <span
            v-if="facets"
            class="text-grey600 ml-2"
          >{{ formatCount(facets.withImage) }}</span>
        </template>
      </v-checkbox>
      <v-checkbox
        :model-value="filters.rated"
        density="compact"
        hide-details
        color="primaryStrong"
        @update:model-value="(value: boolean | null) => emit('update', { rated: !!value })"
      >
        <template #label>
          <span class="flex-grow-1">Rated by parents</span>
          <span
            v-if="facets"
            class="text-grey600 ml-2"
          >{{ formatCount(facets.withRating) }}</span>
        </template>
      </v-checkbox>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { SchoolFacetsDTO } from '@/types'
import type { SchoolFinderFilters } from '@/composables/useSchoolFinder'

interface LocationOption {
  id: number
  title: string
}

const props = defineProps<{
  filters: SchoolFinderFilters
  facets: SchoolFacetsDTO | null
  hasHome: boolean
  canClear: boolean
}>()

const emit = defineEmits<{
  update: [patch: Partial<SchoolFinderFilters>]
  clear: []
}>()

const formatCount = (value: number) => value.toLocaleString('en-US')

const busTag = computed(() => props.facets?.tags.find(tag => tag.name === SCHOOL_BUS_TAG_NAME) ?? null)
const boardingTag = computed(() => props.facets?.tags.find(tag => tag.name === 'Dormitory') ?? null)

// Picked options stay listed even when the current filters leave none of them.
const typeOptions = computed(() => {
  const counts = new Map((props.facets?.schoolTypes ?? []).map(item => [item.schoolType ?? '', item.count]))
  return Object.entries(SCHOOL_TYPE_LABELS)
    .map(([value, title]) => ({ value, title, count: counts.get(value) ?? 0 }))
    .filter(option => option.count > 0 || props.filters.types.includes(option.value))
    .sort((a, b) => b.count - a.count)
})

const facilityOptions = computed(() => (props.facets?.tags ?? [])
  .filter(tag => tag.id !== busTag.value?.id && tag.id !== boardingTag.value?.id))
const showAllFacilities = ref(false)
const visibleFacilities = computed(() => (showAllFacilities.value ? facilityOptions.value : facilityOptions.value.slice(0, 4)))

const toggleType = (value: string) => {
  const types = props.filters.types.includes(value)
    ? props.filters.types.filter(type => type !== value)
    : [...props.filters.types, value]
  emit('update', { types })
}

const toggleFacility = (id: number) => {
  const facilities = props.filters.facilities.includes(id)
    ? props.filters.facilities.filter(item => item !== id)
    : [...props.filters.facilities, id]
  emit('update', { facilities })
}

// Locations load on demand: a country's states only once it is picked.
const countries = ref<LocationOption[]>([])
const states = ref<LocationOption[]>([])
const cities = ref<LocationOption[]>([])
const loading = reactive({ country: false, state: false, city: false })

const loadLocations = async (kind: 'country' | 'state' | 'city', endpoint: string, target: Ref<LocationOption[]>) => {
  loading[kind] = true
  try {
    const response = await useApiService.get<{ data?: { list?: LocationOption[] } }>(endpoint, { 'PagingDto.PageFilter.Size': 10000 }, { public: true })
    target.value = response?.data?.list ?? []
  }
  catch {
    target.value = []
  }
  finally {
    loading[kind] = false
  }
}

onMounted(() => {
  loadLocations('country', '/api/v2/locations/countries', countries)
})

watch(() => props.filters.country, (country) => {
  states.value = []
  if (country) loadLocations('state', `/api/v2/locations/states/${country}`, states)
}, { immediate: true })

watch(() => props.filters.state, (state) => {
  cities.value = []
  if (state) loadLocations('city', `/api/v2/locations/cities/${state}`, cities)
}, { immediate: true })

const pickCountry = (country: number | null) => emit('update', { country: country ?? null, state: null, city: null })
const pickState = (state: number | null) => emit('update', { state: state ?? null, city: null })
</script>

<style scoped>
.finder-filters__title {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 6px;
  color: rgb(var(--v-theme-grey800));
}

.finder-filters :deep(.v-checkbox .v-label) {
  width: 100%;
  opacity: 1;
  color: rgb(var(--v-theme-grey800));
}

.finder-filters__chip--on {
  background: rgb(var(--v-theme-grey800));
  color: rgb(var(--v-theme-surface));
}
</style>
