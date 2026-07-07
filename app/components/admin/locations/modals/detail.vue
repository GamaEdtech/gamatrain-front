<template>
  <div class="w-100 d-flex flex-column pa-4">
    <v-form
      v-model="isFormValid"
      class="w-100 d-flex flex-column align-start ga-1"
    >
      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 ml-2">
          Title
        </div>
        <v-text-field
          v-model="newItem.title"
          rounded="lg"
          density="compact"
          placeholder="Title"
          variant="outlined"
          autocomplete="off"
          persistent-clear
          base-color="grey200"
          color="primary"
          active-color="primary"
          bg-color="white"
          class="w-100"
        >
          <template #prepend-inner>
            <v-progress-circular
              v-if="loadingLocation"
              indeterminate
              size="20"
              color="#ffb300"
              class="mr-2"
            />
          </template>
        </v-text-field>
      </div>

      <div class="w-100 d-flex flex-column flex-sm-row align-start ga-2">
        <div class="w-100 d-flex flex-column align-start justify-start ga-1">
          <div class="text-h6 text-grey700 ml-2">
            Local Title
          </div>
          <v-text-field
            v-model="newItem.localTitle"
            rounded="lg"
            density="compact"
            placeholder="Local Title"
            variant="outlined"
            autocomplete="off"
            persistent-clear
            base-color="grey200"
            color="primary"
            active-color="primary"
            bg-color="white"
            class="w-100"
          />
        </div>

        <div class="w-100 d-flex flex-column align-start justify-start ga-1">
          <div class="text-h6 text-grey700 ml-2">
            Code
          </div>
          <v-text-field
            v-model="newItem.code"
            rounded="lg"
            density="compact"
            placeholder="Code"
            variant="outlined"
            autocomplete="off"
            persistent-clear
            base-color="grey200"
            color="primary"
            active-color="primary"
            bg-color="white"
            class="w-100"
            :rules="[rules.required]"
          />
        </div>
      </div>

      <div
        v-if="locationType !== 'countries'"
        class="w-100 d-flex flex-column flex-sm-row align-start ga-2"
      >
        <div class="w-100 d-flex flex-column align-start justify-start ga-1">
          <common-gombo-box
            v-model="selectedCountryId"
            label="Country"
            :items="countries.map((item) => ({
              id: item.id,
              title: item.title,
            }))"
            :data-loading="loadingCountries"
            :infinite-loading="true"
            :loading-more="loadingMoreCountries"
            :has-more-items="countriesHasMoreItems"
            rounded="lg"
            density="compact"
            base-color="grey200"
            color="primary"
            :defalut-lable="false"
            :loading-value="loadingLocation"
            :rules="[rules.required]"
            @load-more="loadMoreCountries"
          />
        </div>

        <div
          v-if="locationType === 'cities'"
          class="w-100 d-flex flex-column align-start justify-start ga-1"
        >
          <common-gombo-box
            v-model="newItem.parentId"
            label="State"
            :items="states.map((item) => ({
              id: item.id,
              title: item.title,
            }))"
            :data-loading="loadingStates"
            :infinite-loading="true"
            :loading-more="loadingMoreStates"
            :has-more-items="statesHasMoreItems"
            rounded="lg"
            density="compact"
            base-color="grey200"
            color="primary"
            :defalut-lable="false"
            :disabled="!selectedCountryId"
            :loading-value="loadingLocation"
            :rules="[rules.required]"
            @load-more="loadMoreStates"
          />
        </div>
      </div>

      <div class="w-100 d-flex flex-column flex-sm-row align-start ga-2">
        <div class="w-100 d-flex flex-column align-start justify-start ga-1">
          <div class="text-h6 text-grey700 ml-2">
            Latitude
          </div>
          <v-text-field
            v-model="newItem.latitude"
            rounded="lg"
            density="compact"
            placeholder="Latitude"
            variant="outlined"
            autocomplete="off"
            persistent-clear
            base-color="grey200"
            color="primary"
            active-color="primary"
            bg-color="white"
            class="w-100"
            type="number"
            :rules="[rules.required, rules.onlyNumbers]"
          />
        </div>

        <div class="w-100 d-flex flex-column align-start justify-start ga-1">
          <div class="text-h6 text-grey700 ml-2">
            Longitude
          </div>
          <v-text-field
            v-model="newItem.longitude"
            rounded="lg"
            density="compact"
            placeholder="Longitude"
            variant="outlined"
            autocomplete="off"
            persistent-clear
            base-color="grey200"
            color="primary"
            active-color="primary"
            bg-color="white"
            class="w-100"
            type="number"
            :rules="[rules.required, rules.onlyNumbers]"
          />
        </div>
      </div>
    </v-form>

    <v-btn
      color="success"
      rounded="xl"
      variant="outlined"
      height="40"
      width="200"
      class="text-h5 mt-8 mx-auto"
      :loading="loadingEditLocation"
      :disabled="!isFormValid || loadingLocation"
      flat
      @click="edit"
    >
      Edit
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import type {
  AddAdminLocationDTO,
  AdminLocationTypeDTO,
} from '@/types'

interface IDetailLocationModal {
  id: string
  locationType: AdminLocationTypeDTO
}

const props = defineProps<IDetailLocationModal>()
const emit = defineEmits(['EditLocationSuccessFull'])

const {
  getLocationById,
  loadingLocation,
  editLocation,
  loadingEditLocation,
  getCountries,
  loadingCountries,
  loadingMoreCountries,
  countriesHasMoreItems,
  countries,
  getStates,
  loadingStates,
  loadingMoreStates,
  statesHasMoreItems,
  states,
  resetCountries,
  resetStates,
} = useLocationAdmin()

const newItem = reactive<AddAdminLocationDTO>({
  title: '',
  localTitle: '',
  code: '',
  parentId: null,
  latitude: null,
  longitude: null,
})

const selectedCountryId = ref<number | string | null>(null)
const isFormValid = ref(false)
const isHydrating = ref(false)
const countriesPage = ref(1)
const statesPage = ref(1)
const locationPageSize = 20

const rules = {
  required: (v: unknown) => ![null, undefined, ''].includes(v as string) || 'This field is required',
  onlyNumbers: (v: string | number) => /^-?\d+(\.\d+)?$/.test(String(v)) || 'Only numbers are allowed',
}

watch(selectedCountryId, async (countryId) => {
  if (isHydrating.value)
    return

  newItem.parentId = props.locationType === 'states' ? countryId : null
  statesPage.value = 1
  resetStates()

  if (props.locationType === 'cities' && countryId) {
    await getStates(countryId, {
      page: statesPage.value,
      pageSize: locationPageSize,
    })
  }
})

onMounted(async () => {
  isHydrating.value = true

  if (props.locationType !== 'countries') {
    resetCountries()
    await getCountries({
      page: countriesPage.value,
      pageSize: locationPageSize,
    })
  }

  const response = await getLocationById(props.locationType, props.id)

  if (response.succeeded && response.data) {
    const item = response.data
    newItem.title = item.title || ''
    newItem.localTitle = item.localTitle || ''
    newItem.code = item.code || ''
    newItem.parentId = item.parentId
    newItem.latitude = item.latitude
    newItem.longitude = item.longitude

    if (props.locationType === 'states') {
      selectedCountryId.value = item.parentId
    }

    if (props.locationType === 'cities' && item.parentId) {
      const stateResponse = await getLocationById('states', item.parentId)
      selectedCountryId.value = stateResponse.data?.parentId ?? null

      if (selectedCountryId.value) {
        await getStates(selectedCountryId.value, {
          page: statesPage.value,
          pageSize: locationPageSize,
        })
      }
    }
  }

  isHydrating.value = false
})

const loadMoreCountries = async () => {
  countriesPage.value += 1

  await getCountries(
    {
      page: countriesPage.value,
      pageSize: locationPageSize,
    },
    { append: true },
  )
}

const loadMoreStates = async () => {
  if (!selectedCountryId.value) return

  statesPage.value += 1

  await getStates(
    selectedCountryId.value,
    {
      page: statesPage.value,
      pageSize: locationPageSize,
    },
    { append: true },
  )
}

const edit = async () => {
  if (!isFormValid.value) return

  const response = await editLocation(props.locationType, props.id, {
    ...newItem,
    parentId: props.locationType === 'countries' ? null : newItem.parentId,
  })

  if (response.succeeded) {
    emit('EditLocationSuccessFull')
  }
}
</script>

<style scoped>
</style>
