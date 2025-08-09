<script setup>
import useApiService from '~/composables/useApiService'

const props = defineProps({
  modelValue: Boolean,
  location: String,
  locationType: String,
})
const { $toast } = useNuxtApp()

const emit = defineEmits(['update:modelValue', 'fetchLocations'])

const form = ref(null)
const formIsValid = ref(false)

const newLocation = reactive({
  title: '',
  localTitle: '',
  code: '',
  parentId: null,
  latitude: null,
  longitude: null,
})

const rules = {
  required: v => !!v || 'This field is required',
  onlyNumbers: v => /^-?\d+(\.\d+)?$/.test(v) || 'Only numbers are allowed',
}

const parentCountries = ref([])
const parentStates = ref([])
const chosenCountry = ref(null)

const fetchCountries = async () => {
  if (parentCountries.value.length == 0) {
    try {
      const response = await useApiService.get(`/api/v2/admin/locations/countries`, {
        'PagingDto.PageFilter.Size': 300,
        'PagingDto.PageFilter.Skip': 0,
        'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
      })
      parentCountries.value = response.data.list.slice().reverse()
    }
    catch (err) {
      if (err.response?.status === 400) {
        $toast.error(err.response.data.message)
      }
    }
  }
}
const fetchStates = async () => {
  try {
    const response = await useApiService.get(`/api/v2/locations/states/${chosenCountry.value}`, {
      'PagingDto.PageFilter.Size': 1000,
      'PagingDto.PageFilter.Skip': 0,
      'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
    })
    parentStates.value = response.data.list.slice().reverse()
  }
  catch (err) {
    if (err.response?.status === 400) {
      $toast.error(err.response.data.message)
    }
  }
}

const submitLocation = async () => {
  if (props.locationType == 'states')
    newLocation.parentId = chosenCountry.value
  try {
    const res = await useApiService.post(`/api/v2/admin/locations/${props.locationType}`, {
      title: newLocation.title,
      localTitle: newLocation.localTitle,
      code: newLocation.code,
      parentId: newLocation.parentId || null,
      latitude: newLocation.latitude,
      longitude: newLocation.longitude,
    })
    if (res.succeeded) {
      Object.keys(newLocation).forEach((key) => {
        newLocation[key] = ''
      })
      form.value.reset()
      $toast.success('Location Added Successfully')
      emit('update:modelValue', false)
      emit('fetchLocations')
    }
    else
      $toast.error(res.errors[0].message)
  }
  catch (err) {
    if (err.response?.status === 400)
      $toast.error(err.response.data.message)
  }
}

watch(chosenCountry, (_newVal) => {
  fetchStates()
})
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="500px"
    @click:outside="$emit('update:modelValue', false)"
  >
    <v-card class="bg-primary-gray-200 rounded-xl">
      <v-card-title class="d-flex flex-column align-center py-10 pb-6 ga-3 bg-white">
        <div class="rounded-pill bg-primary-gray-100 pa-4">
          <v-icon class="fontsize-80 color-12b76a">
            mdi mdi-plus-circle
          </v-icon>
        </div>
        <span class="gtext-t3 font-weight-medium">Add New {{ location }}</span>
      </v-card-title>

      <v-card-text class="py-2">
        <v-form
          ref="form"
          v-model="formIsValid"
        >
          <div class="w-100">
            <label class="primary-gray-700 gtext-t6 font-weight-medium mt-3">
              Title
            </label>
            <v-text-field
              v-model="newLocation.title"
              variant="solo"
              density="compact"
            />
          </div>
          <div class="d-flex flex-column w-100 ga-2 flex-sm-row">
            <div class="w-100">
              <label class="primary-gray-700 gtext-t6 font-weight-medium mt-3">
                Local Title
              </label>
              <v-text-field
                v-model="newLocation.localTitle"
                variant="solo"
                density="compact"
              />
            </div>
            <div class="w-100">
              <label class="primary-gray-700 gtext-t6 font-weight-medium mt-3">
                Code
              </label>
              <v-text-field
                v-model="newLocation.code"
                variant="solo"
                density="compact"
                :rules="[rules.required]"
              />
            </div>
          </div>
          <div class="d-flex flex-column w-100 ga-2 flex-sm-row">
            <div
              v-if="props.locationType != 'countries'"
              class="w-100"
            >
              <label class="primary-gray-700 gtext-t6 font-weight-medium mt-3">
                Country
              </label>
              <v-select
                v-model="chosenCountry"
                variant="solo"
                density="compact"
                :rules="[rules.required]"
                :items="parentCountries"
                item-title="title"
                item-value="id"
                @click="fetchCountries"
              />
            </div>
            <div
              v-if="props.locationType == 'cities'"
              class="w-100"
            >
              <label class="primary-gray-700 gtext-t6 font-weight-medium mt-3">
                State
              </label>
              <v-select
                v-model="newLocation.parentId"
                :disabled="!chosenCountry"
                variant="solo"
                density="compact"
                :rules="[rules.required]"
                :items="parentStates"
                item-title="title"
                item-value="id"
              />
            </div>
          </div>
          <div class="d-flex flex-column w-100 ga-2 flex-sm-row">
            <div class="w-100">
              <label class="primary-gray-700 gtext-t6 font-weight-medium mt-3">
                Latitude
              </label>
              <v-text-field
                v-model="newLocation.latitude"
                variant="solo"
                density="compact"
                type="number"
                :rules="[rules.required, rules.onlyNumbers]"
              />
            </div>
            <div class="w-100">
              <label class="primary-gray-700 gtext-t6 font-weight-medium mt-3">
                Longitude
              </label>
              <v-text-field
                v-model="newLocation.longitude"
                variant="solo"
                density="compact"
                type="number"
                :rules="[rules.required, rules.onlyNumbers]"
              />
            </div>
          </div>
        </v-form>
      </v-card-text>

      <v-card-actions class="d-flex justify-center ga-10 mb-2">
        <v-btn
          class="closeBtn"
          variant="plain"
          @click="$emit('update:modelValue', false)"
        >
          <span class="mdi mdi-close gtext-t1" />
        </v-btn>
        <v-btn
          class="rounded-pill gtext-t5 ml-4 submitBtn"
          :disabled="!formIsValid"
          @click="submitLocation"
        >
          <span>Submit</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
:deep(.v-btn__content span){
  font-family: Inter, sans-serif !important;
  font-size: 1.4rem;
  font-style: normal;
  font-weight: 700;
  line-height: 0 !important;
}
:deep(.v-btn__content){
  font-family: Inter, sans-serif !important;
  font-size: 1.4rem;
  font-style: normal;
  font-weight: 700;
  line-height: 0 !important;
}
:deep(.v-field__input){
  font-family: Inter, sans-serif;
  font-size: 1.4rem;
  line-height: 1rem;
  font-weight: 400;
}
:deep(.v-field){
  border-radius: 16px;
  border: 1px solid #c6c6c6;
  box-shadow: none;
}
.v-input{
  font-family: Inter, sans-serif !important;
  font-size: 1.2rem !important;
  line-height: 1rem !important;
  font-weight: 400 !important;
}
.submitBtn{
    height: 3.4rem;
    padding: 0.6rem 1.8rem;
    background: #ffb600;
    color: #24292f;
    border-radius: 3rem;
}
.closeBtn {
    width: 24px !important;
    min-width: 24px !important;
    height: 24px !important;
    color: #919191;
    position: absolute;
    top: 16px;
    left: 16px;
    padding: 0px !important;
    &:hover{
        color: #F04438;
        transition: 300ms;
    }
}

/* Scoped to dialog card's scrollbar */
:deep(.v-dialog::-webkit-scrollbar) {
  width: 60px;
}

:deep(.v-dialog::-webkit-scrollbar-thumb) {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

.v-dialog .v-card::-webkit-scrollbar-track {
  background: transparent;
}

/* Chrome, Safari, Edge, Opera */
:deep(input::-webkit-outer-spin-button),
:deep(input::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
:deep(input[type=number]) {
  -moz-appearance: textfield;
}

.fontsize-80{
    font-size: 80px !important;
}

.color-12b76a{
    color: #12b76a !important;
}
</style>
