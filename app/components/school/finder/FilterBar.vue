<template>
  <div
    class="filter-bar d-flex align-center ga-2"
    role="group"
    aria-label="Filters"
  >
    <v-menu
      v-model="homeOpen"
      :close-on-content-click="false"
      location="bottom start"
    >
      <template #activator="{ props: menu }">
        <v-chip
          v-bind="menu"
          :variant="home ? 'flat' : 'outlined'"
          :color="home ? 'success' : 'grey500'"
          prepend-icon="md:home"
          append-icon="md:expand_more"
          class="filter-bar__chip"
        >
          <span class="filter-bar__label">{{ home ? home.label : 'Set home' }}</span>
        </v-chip>
      </template>
      <school-finder-home-menu @done="homeOpen = false" />
    </v-menu>

    <v-menu
      v-model="areaOpen"
      :close-on-content-click="false"
      location="bottom start"
    >
      <template #activator="{ props: menu }">
        <v-chip
          v-bind="menu"
          :variant="areaLabel ? 'flat' : 'outlined'"
          :color="areaLabel ? 'grey800' : 'grey500'"
          prepend-icon="md:location_on"
          :append-icon="areaLabel ? undefined : 'md:expand_more'"
          class="filter-bar__chip"
        >
          <span class="filter-bar__label">{{ areaLabel || 'Area' }}</span>
          <v-btn
            v-if="areaLabel"
            icon="md:cancel"
            size="22"
            variant="text"
            class="ms-1 me-n2"
            aria-label="Remove area"
            @click.stop="clearArea"
          />
        </v-chip>
      </template>
      <v-card
        width="320"
        class="pa-3"
      >
        <!-- One box for any place: a country, a region or a city, with the place it belongs to. -->
        <v-autocomplete
          ref="areaField"
          v-model:search="areaQuery"
          :items="areaResults"
          :loading="areaLoading"
          item-title="title"
          return-object
          no-filter
          hide-details
          autofocus
          density="compact"
          variant="solo-filled"
          flat
          rounded="lg"
          prepend-inner-icon="md:search"
          placeholder="Country, region or city"
          :no-data-text="areaQuery && areaQuery.length > 1 ? 'No place with that name' : 'Type at least 2 letters'"
          @update:model-value="pickArea"
        >
          <template #item="{ props: item, item: { raw } }">
            <v-list-item
              v-bind="item"
              :subtitle="placeContext(raw)"
            >
              <template #prepend>
                <v-icon
                  size="18"
                  color="grey500"
                >
                  {{ raw.type === 'country' ? 'md:public' : raw.type === 'state' ? 'md:map' : 'md:location_city' }}
                </v-icon>
              </template>
            </v-list-item>
          </template>
        </v-autocomplete>
        <v-btn
          v-if="filters.country"
          variant="text"
          size="small"
          color="grey600"
          class="text-none px-2 mt-2"
          prepend-icon="md:public"
          @click="clearArea"
        >
          All countries
        </v-btn>
      </v-card>
    </v-menu>

    <v-menu location="bottom start">
      <template #activator="{ props: menu }">
        <v-chip
          v-bind="menu"
          :variant="filters.within ? 'flat' : 'outlined'"
          :color="filters.within ? 'grey800' : 'grey500'"
          :append-icon="filters.within ? undefined : 'md:expand_more'"
          class="filter-bar__chip"
        >
          {{ filters.within ? `Within ${filters.within} km` : 'Distance' }}
          <v-btn
            v-if="filters.within"
            icon="md:cancel"
            size="22"
            variant="text"
            class="ms-1 me-n2"
            aria-label="Remove distance"
            @click.stop="emit('update', { within: null })"
          />
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
          :append-icon="filters.types.length ? undefined : 'md:expand_more'"
          class="filter-bar__chip"
        >
          {{ filters.types.length ? `Type · ${filters.types.length}` : 'Type' }}
          <v-btn
            v-if="filters.types.length"
            icon="md:cancel"
            size="22"
            variant="text"
            class="ms-1 me-n2"
            aria-label="Remove school types"
            @click.stop="emit('update', { types: [] })"
          />
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
          :append-icon="pickedFacilities ? undefined : 'md:expand_more'"
          class="filter-bar__chip"
        >
          {{ pickedFacilities ? `Facilities · ${pickedFacilities}` : 'Facilities' }}
          <v-btn
            v-if="pickedFacilities"
            icon="md:cancel"
            size="22"
            variant="text"
            class="ms-1 me-n2"
            aria-label="Remove facilities"
            @click.stop="clearFacilities"
          />
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

// ---- Home ----
const { home } = useSchoolHome()
const homeOpen = ref(false)

// ---- Area: one search over countries, regions and cities ----
interface PlaceResult {
  id: number
  title: string
  type: 'country' | 'state' | 'city'
  stateId: number | null
  stateTitle: string | null
  countryId: number | null
  countryTitle: string | null
}

const areaOpen = ref(false)
const areaField = ref<{ focus: () => void } | null>(null)

// The box is ready to type in as soon as the menu opens.
watch(areaOpen, async (open) => {
  if (!open) return
  await nextTick()
  setTimeout(() => areaField.value?.focus(), 50)
})
const areaQuery = ref('')
const areaResults = ref<PlaceResult[]>([])
const areaLoading = ref(false)
let areaTimer: ReturnType<typeof setTimeout> | null = null

watch(areaQuery, (value) => {
  if (areaTimer) clearTimeout(areaTimer)
  const text = (value ?? '').trim()
  if (text.length < 2) {
    areaResults.value = []
    return
  }
  areaTimer = setTimeout(async () => {
    areaLoading.value = true
    try {
      const response = await useApiService.get<{ data?: PlaceResult[] }>('/api/v2/locations/search', { query: text, size: 10 }, { public: true })
      if ((areaQuery.value ?? '').trim() === text) areaResults.value = response?.data ?? []
    }
    catch {
      areaResults.value = []
    }
    finally {
      areaLoading.value = false
    }
  }, 300)
})

const placeContext = (place: PlaceResult) => {
  const kind = place.type === 'country' ? 'Country' : place.type === 'state' ? 'Region' : 'City'
  return [kind, place.stateTitle, place.countryTitle].filter(Boolean).join(' · ')
}

const pickArea = (place: PlaceResult | null) => {
  if (!place) return
  if (place.type === 'country') emit('update', { country: place.id, state: null, city: null })
  else if (place.type === 'state') emit('update', { country: place.countryId, state: place.id, city: null })
  else emit('update', { country: place.countryId, state: place.stateId, city: place.id })
  areaOpen.value = false
  areaQuery.value = ''
}

// The bus has its own chip, so removing "Facilities" keeps it.
const clearFacilities = () => emit('update', { facilities: props.filters.facilities.filter(id => id === busTag.value?.id) })

const clearArea = () => {
  emit('update', { country: null, state: null, city: null })
  areaOpen.value = false
}
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

.filter-bar__label {
  display: inline-block;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
}
</style>
