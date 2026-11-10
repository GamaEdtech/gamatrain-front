<template>
  <div
    class="filter-bar d-flex align-center ga-2"
    role="group"
    aria-label="Filters"
  >
    <v-menu
      :close-on-content-click="false"
      location="bottom start"
    >
      <template #activator="{ props: menu }">
        <v-chip
          v-bind="menu"
          :variant="areaLabel ? 'flat' : 'outlined'"
          :color="areaLabel ? 'grey800' : 'grey500'"
          append-icon="md:expand_more"
          class="filter-bar__chip"
        >
          {{ areaLabel || 'Area' }}
        </v-chip>
      </template>
      <v-card
        width="300"
        class="pa-3 d-flex flex-column ga-2"
      >
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
          @update:model-value="(country: number | null) => emit('update', { country: country ?? null, state: null, city: null })"
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
          @update:model-value="(state: number | null) => emit('update', { state: state ?? null, city: null })"
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
      </v-card>
    </v-menu>

    <v-menu location="bottom start">
      <template #activator="{ props: menu }">
        <v-chip
          v-bind="menu"
          :variant="filters.within ? 'flat' : 'outlined'"
          :color="filters.within ? 'grey800' : 'grey500'"
          append-icon="md:expand_more"
          class="filter-bar__chip"
        >
          {{ filters.within ? `Within ${filters.within} km` : 'Distance' }}
        </v-chip>
      </template>
      <v-list
        density="compact"
        width="220"
      >
        <v-list-subheader v-if="!hasHome">
          Set your home first
        </v-list-subheader>
        <v-list-item
          title="Any distance"
          :active="!filters.within"
          @click="emit('update', { within: null })"
        />
        <v-list-item
          v-for="km in SCHOOL_FINDER_DISTANCES"
          :key="km"
          :title="`Within ${km} km of home`"
          :active="filters.within === km"
          :disabled="!hasHome"
          @click="emit('update', { within: km })"
        />
      </v-list>
    </v-menu>

    <v-menu
      v-if="showTypes"
      :close-on-content-click="false"
      location="bottom start"
    >
      <template #activator="{ props: menu }">
        <v-chip
          v-bind="menu"
          :variant="filters.types.length ? 'flat' : 'outlined'"
          :color="filters.types.length ? 'grey800' : 'grey500'"
          append-icon="md:expand_more"
          class="filter-bar__chip"
        >
          {{ filters.types.length ? `Type · ${filters.types.length}` : 'Type' }}
        </v-chip>
      </template>
      <v-list
        density="compact"
        width="260"
        select-strategy="leaf"
      >
        <v-list-item
          v-for="option in typeOptions"
          :key="option.value"
          :title="option.title"
          @click="toggle('types', option.value)"
        >
          <template #prepend>
            <v-checkbox-btn
              :model-value="filters.types.includes(option.value)"
              density="compact"
              color="grey800"
              tabindex="-1"
            />
          </template>
          <template #append>
            <span class="text-caption text-grey600">{{ formatCount(option.count) }}</span>
          </template>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-menu
      v-if="facilityOptions.length"
      :close-on-content-click="false"
      location="bottom start"
    >
      <template #activator="{ props: menu }">
        <v-chip
          v-bind="menu"
          :variant="pickedFacilities ? 'flat' : 'outlined'"
          :color="pickedFacilities ? 'grey800' : 'grey500'"
          append-icon="md:expand_more"
          class="filter-bar__chip"
        >
          {{ pickedFacilities ? `Facilities · ${pickedFacilities}` : 'Facilities' }}
        </v-chip>
      </template>
      <v-list
        density="compact"
        width="280"
        max-height="360"
      >
        <v-list-item
          v-for="tag in facilityOptions"
          :key="tag.id"
          :title="tag.name"
          @click="toggle('facilities', tag.id)"
        >
          <template #prepend>
            <v-checkbox-btn
              :model-value="filters.facilities.includes(tag.id)"
              density="compact"
              color="grey800"
              tabindex="-1"
            />
          </template>
          <template #append>
            <span class="text-caption text-grey600">{{ formatCount(tag.count) }}</span>
          </template>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-chip
      v-if="busTag"
      :variant="busOn ? 'flat' : 'outlined'"
      :color="busOn ? 'grey800' : 'grey500'"
      class="filter-bar__chip"
      @click="toggle('facilities', busTag.id)"
    >
      School bus
    </v-chip>
    <v-chip
      v-if="showPhotos"
      :variant="filters.photos ? 'flat' : 'outlined'"
      :color="filters.photos ? 'grey800' : 'grey500'"
      class="filter-bar__chip"
      @click="emit('update', { photos: !filters.photos })"
    >
      Has photos
    </v-chip>
    <v-chip
      v-if="showRated"
      :variant="filters.rated ? 'flat' : 'outlined'"
      :color="filters.rated ? 'grey800' : 'grey500'"
      class="filter-bar__chip"
      @click="emit('update', { rated: !filters.rated })"
    >
      Rated
    </v-chip>

    <v-btn
      v-if="canClear"
      variant="text"
      size="small"
      color="primaryStrong"
      class="text-none flex-shrink-0"
      @click="emit('clear')"
    >
      Clear
    </v-btn>
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
  /** The current area's name, from the list (e.g. "Mbeya"). */
  areaName?: string
}>()

const emit = defineEmits<{
  update: [patch: Partial<SchoolFinderFilters>]
  clear: []
}>()

const formatCount = (value: number) => value.toLocaleString('en-US')

const areaLabel = computed(() => (props.filters.country ? props.areaName || 'Area' : ''))
const busTag = computed(() => props.facets?.tags.find(tag => tag.name === SCHOOL_BUS_TAG_NAME) ?? null)
const busOn = computed(() => !!busTag.value && props.filters.facilities.includes(busTag.value.id))
const pickedFacilities = computed(() => props.filters.facilities.filter(id => id !== busTag.value?.id).length)

// Picked options stay listed even when the current filters leave none of them.
const typeOptions = computed(() => {
  const counts = new Map((props.facets?.schoolTypes ?? []).map(item => [item.schoolType ?? '', item.count]))
  return Object.entries(SCHOOL_TYPE_LABELS)
    .map(([value, title]) => ({ value, title, count: counts.get(value) ?? 0 }))
    .filter(option => option.count > 0 || props.filters.types.includes(option.value))
    .sort((a, b) => b.count - a.count)
})

// A filter is offered only where the schools listed have that data: most schools carry a type and a position, few have
// photos, ratings or facility tags, and a filter that can only narrow to nothing (or to everything) is noise.
const showTypes = computed(() => props.filters.types.length > 0 || typeOptions.value.filter(option => option.count > 0).length > 1)
const hasSome = (count: number | undefined) => !!props.facets && !!count && count < props.facets.total
const showPhotos = computed(() => props.filters.photos || hasSome(props.facets?.withImage))
const showRated = computed(() => props.filters.rated || hasSome(props.facets?.withRating))

const facilityOptions = computed(() => (props.facets?.tags ?? []).filter(tag => tag.id !== busTag.value?.id))

function toggle(key: 'types', value: string): void
function toggle(key: 'facilities', value: number): void
function toggle(key: 'types' | 'facilities', value: string | number) {
  const current = props.filters[key] as (string | number)[]
  const next = current.includes(value) ? current.filter(item => item !== value) : [...current, value]
  emit('update', { [key]: next } as Partial<SchoolFinderFilters>)
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
  watch(() => props.filters.country, (country) => {
    states.value = []
    if (country) loadLocations('state', `/api/v2/locations/states/${country}`, states)
  }, { immediate: true })
  watch(() => props.filters.state, (state) => {
    cities.value = []
    if (state) loadLocations('city', `/api/v2/locations/cities/${state}`, cities)
  }, { immediate: true })
})
</script>

<style scoped>
/* One row that scrolls sideways on a phone instead of wrapping into a block of chips. */
.filter-bar {
  overflow-x: auto;
  scrollbar-width: none;
  padding-bottom: 2px;
}

.filter-bar::-webkit-scrollbar {
  display: none;
}

.filter-bar__chip {
  flex-shrink: 0;
}
</style>
