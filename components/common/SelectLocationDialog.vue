<template>
  <v-dialog
    v-model="dialogVisible"
    transition="dialog-bottom-transition"
    fullscreen
    z-index="2000"
  >
    <v-card>
      <v-card-text class="pt-6 pt-md-8 px-6 px-md-8 rounded-t-xl">
        <div class="d-flex">
          <div class="gtext-h5 priamry-gray-700">
            Location
          </div>
          <v-spacer />
          <v-btn
            icon
            variant="text"
            @click="dialogVisible = false"
          >
            <v-icon size="20">
              mdi-close
            </v-icon>
          </v-btn>
        </div>
      </v-card-text>

      <div class="locationPickerMapContainer">
        <client-only>
          <l-map
            id="mapSection"
            ref="editSchoolMap"
            :zoom="map.zoom"
            :center="map.center"
            :use-global-leaflet="false"
            @move="updateMarkerPosition"
          >
            <l-tile-layer :url="map.url" />
            <l-marker
              ref="editMapMarker"
              :lat-lng="map.center"
            >
              <LIcon
                icon-url="/images/school-marker.png"
                :icon-size="[64, 64]"
                :icon-anchor="[16, 32]"
              />
            </l-marker>
          </l-map>
        </client-only>
        <locationSearch
          rounded
          label="Search anything"
          @location-selected="goToSearchLocation"
        />
      </div>
      <a
        :href="`https://www.google.com/maps?q=${contentData.latitude},${contentData.longitude}`"
        target="_blank"
        class="ml-1 text-blue text-decoration-none"
      >
        See on Google Map
      </a>
      <v-card-actions class="pb-13">
        <v-container>
          <v-row>
            <!-- Desktop view -->
            <v-col
              cols="7"
              class="d-none d-md-block"
            >
              <v-row>
                <v-col>
                  <label class="text-subtitle mb-2 d-block">Country</label>
                  <v-select
                    v-model="selectedCountry"
                    :items="countries"
                    item-title="title"
                    item-value="id"
                    rounded
                    :loading="loadingCountries"
                    density="comfortable"
                    variant="outlined"
                    hide-details
                    @update:model-value="handleCountryChange"
                  />
                </v-col>
                <v-col>
                  <label class="text-subtitle mb-2 d-block">Province</label>
                  <v-select
                    v-model="selectedState"
                    :items="states"
                    item-title="title"
                    item-value="id"
                    rounded
                    :loading="loadingStates"
                    :disabled="!selectedCountry"
                    density="comfortable"
                    variant="outlined"
                    hide-details
                    @update:model-value="handleStateChange"
                  />
                </v-col>
                <v-col>
                  <label class="text-subtitle mb-2 d-block">City</label>
                  <v-select
                    v-model="selectedCity"
                    :items="cities"
                    item-title="title"
                    item-value="id"
                    rounded
                    :loading="loadingCities"
                    :disabled="!selectedState"
                    density="comfortable"
                    variant="outlined"
                    hide-details
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col
              cols="5"
              class="d-none d-md-flex align-end"
            >
              <v-btn
                :loading="mapSubmitLoader"
                class="primary black--text text-transform-none gtext-t4 font-weight-medium w-100"
                rounded
                size="x-large"
                color="primary"
                variant="flat"
                @click="emitUpdate()"
              >
                Save
              </v-btn>
            </v-col>

            <!-- Mobile/Tablet view -->
            <v-col
              cols="12"
              class="d-md-none"
            >
              <div class="d-flex gap-4">
                <v-btn
                  :loading="mapSubmitLoader"
                  class="primary black--text text-transform-none gtext-t4 font-weight-medium flex-grow-1"
                  rounded
                  size="x-large"
                  color="primary"
                  variant="flat"
                  @click="emitUpdate()"
                >
                  Save
                </v-btn>
                <v-btn
                  class="ml-2"
                  variant="outlined"
                  icon
                  color="#F2F4F7"
                  @click="showLocationDialog = true"
                >
                  <v-icon color="#667085">
                    mdi-dots-horizontal
                  </v-icon>
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Mobile/Tablet Location Dialog -->
  <v-bottom-sheet
    v-model="showLocationDialog"
    scrollable
  >
    <v-card class="rounded-t-xl">
      <v-card-text class="pt-6">
        <div class="d-flex align-center mb-6">
          <div class="text-h6" />
          <v-spacer />
          <v-btn
            icon
            variant="text"
            @click="showLocationDialog = false"
          >
            <v-icon size="20">
              mdi-close
            </v-icon>
          </v-btn>
        </div>

        <v-form @submit.prevent="handleLocationSubmit">
          <label class="text-subtitle mb-2 d-block">Country</label>
          <v-select
            v-model="selectedCountry"
            :items="countries"
            item-title="title"
            item-value="id"
            rounded
            :loading="loadingCountries"
            density="comfortable"
            variant="outlined"
            class="mb-4"
            hide-details
            @update:model-value="handleCountryChange"
          />

          <label class="text-subtitle mb-2 d-block">Province</label>
          <v-select
            v-model="selectedState"
            :items="states"
            item-title="title"
            item-value="id"
            rounded
            :loading="loadingStates"
            :disabled="!selectedCountry"
            density="comfortable"
            variant="outlined"
            class="mb-4"
            hide-details
            @update:model-value="handleStateChange"
          />

          <label class="text-subtitle mb-2 d-block">City</label>
          <v-select
            v-model="selectedCity"
            :items="cities"
            item-title="title"
            item-value="id"
            rounded
            :loading="loadingCities"
            :disabled="!selectedState"
            density="comfortable"
            variant="outlined"
            class="mb-6"
            hide-details
          />

          <v-btn
            block
            color="primary"
            size="x-large"
            rounded
            class="mb-4"
            @click="handleLocationSubmit"
          >
            Save
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-bottom-sheet>
</template>

<script setup>
import locationSearch from '@/components/form/LocationSearch.vue'
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  contentData: {
    type: Object,
    required: true,
  },
  map: {
    type: Object,
    required: true,
  },
  mapSubmitLoader: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:modelValue', 'update', 'locationSelected'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const editSchoolMap = ref(null)
const editMapMarker = ref(null)
const newCenterData = ref(null)

function updateMarkerPosition() {
  const mapInstance = editSchoolMap.value?.leafletObject
  const markerInstance = editMapMarker.value?.leafletObject
  if (!mapInstance || !markerInstance) return
  const newCenter = mapInstance.getCenter()
  markerInstance.setLatLng(newCenter)
  newCenterData.value = newCenter
}
function goToSearchLocation(val) {
  const mapInstance = editSchoolMap.value?.leafletObject
  if (!mapInstance) return
  mapInstance.setView([val[0], val[1]], 12)
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'))
  }, 100)
}

// Location data
const countries = ref([])
const states = ref([])
const cities = ref([])

const selectedCountry = ref(null)
const selectedState = ref(null)
const selectedCity = ref(null)

const loadingCountries = ref(false)
const loadingStates = ref(false)
const loadingCities = ref(false)

// Fetch countries
async function fetchCountries() {
  loadingCountries.value = true
  try {
    const response = await useApiService.get('/api/v2/locations/countries', {
      'PagingDto.PageFilter.Skip': 0,
      'PagingDto.PageFilter.Size': 1000,
      'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
    })
    if (response.succeeded) {
      countries.value = response.data.list
    }
  }
  catch (error) {
    console.error('Failed to fetch countries:', error)
  }
  finally {
    loadingCountries.value = false
  }
}

// Fetch states for selected country
async function fetchStates(countryId) {
  if (!countryId) return
  loadingStates.value = true
  try {
    const response = await useApiService.get(
      `/api/v2/locations/states/${countryId}`,
      {
        'PagingDto.PageFilter.Skip': 0,
        'PagingDto.PageFilter.Size': 1000,
        'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
      },
    )
    if (response.succeeded) {
      states.value = response.data.list
    }
  }
  catch (error) {
    console.error('Failed to fetch states:', error)
  }
  finally {
    loadingStates.value = false
  }
}

// Fetch cities for selected state
async function fetchCities(stateId) {
  if (!stateId) return
  loadingCities.value = true
  try {
    const response = await useApiService.get(
      `/api/v2/locations/cities/${stateId}`,
      {
        'PagingDto.PageFilter.Skip': 0,
        'PagingDto.PageFilter.Size': 1000,
        'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
      },
    )
    if (response.succeeded) {
      cities.value = response.data.list
    }
  }
  catch (error) {
    console.error('Failed to fetch cities:', error)
  }
  finally {
    loadingCities.value = false
  }
}

// Handle country selection change
async function handleCountryChange(countryId) {
  selectedState.value = null
  selectedCity.value = null
  states.value = []
  cities.value = []
  if (countryId) {
    await fetchStates(countryId)
  }
}

// Handle state selection change
async function handleStateChange(stateId) {
  selectedCity.value = null
  cities.value = []
  if (stateId) {
    await fetchCities(stateId)
  }
}

// Modified emitUpdate function to include location data
function emitUpdate() {
  const locationData = {
    ...newCenterData.value,
    countryId: selectedCountry.value,
    stateId: selectedState.value,
    cityId: selectedCity.value,
    countryTitle:
      countries.value.find(c => c.id === selectedCountry.value)?.title || '',
    stateTitle:
      states.value.find(s => s.id === selectedState.value)?.title || '',
    cityTitle:
      cities.value.find(c => c.id === selectedCity.value)?.title || '',
  }
  emit('update', locationData)
}

// Initialize location data from contentData
async function initializeLocationData() {
  try {
    if (props.contentData?.countryId) {
      selectedCountry.value = props.contentData.countryId

      await fetchStates(props.contentData.countryId)

      if (props.contentData?.stateId) {
        selectedState.value = props.contentData.stateId

        await fetchCities(props.contentData.stateId)

        if (props.contentData?.cityId) {
          selectedCity.value = props.contentData.cityId
        }
      }
    }
  }
  catch (error) {
    console.error('Failed to initialize location data:', error)
  }
}

// Fetch countries when dialog becomes visible
watch(
  () => dialogVisible.value,
  (newVal) => {
    if (newVal && !countries.value.length) {
      fetchCountries()
    }
    initializeLocationData()
  },
)

const showLocationDialog = ref(false)

function handleLocationSubmit() {
  showLocationDialog.value = false
}

onMounted(() => {})
</script>

<style>
.locationPickerMapContainer {
  position: relative;
  overflow-x: hidden;

  #mapSection {
    width: 100%;
    height: 80vh !important;
  }
}
</style>
