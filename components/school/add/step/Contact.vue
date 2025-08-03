<template>
  <div
    class="w-100 d-flex flex-column align-center justify-space-between ga-1 max-width-container"
  >
    <div class="w-100 d-flex flex-column align-center justify-start ga-10">
      <div class="w-100 text-h4 primary-gray-500">
        School Contact
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 font-weight-bold primary-gray-700 ml-2">
          Web site
        </div>
        <v-text-field
          v-model="website"
          rounded
          density="compact"
          placeholder="Web site"
          variant="outlined"
          autocomplete="off"
          clearable
          persistent-clear
          base-color="#E4E7EC"
          color="#ffb600"
          active-color="#ffb600"
          bg-color="#ffffff"
          class="w-100"
          :rules="[urlRule, requiredRule]"
        />
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 font-weight-bold primary-gray-700 ml-2">
          Email
        </div>
        <v-text-field
          v-model="email"
          rounded
          density="compact"
          placeholder="Email"
          variant="outlined"
          autocomplete="off"
          clearable
          persistent-clear
          base-color="#E4E7EC"
          color="#ffb600"
          active-color="#ffb600"
          bg-color="#ffffff"
          class="w-100"
          :rules="[requiredRule, emailRule]"
        />
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 font-weight-bold primary-gray-700 ml-2">
          Phone
        </div>
        <v-text-field
          v-model="phone"
          rounded
          density="compact"
          placeholder="Phone"
          variant="outlined"
          autocomplete="off"
          clearable
          persistent-clear
          base-color="#E4E7EC"
          color="#ffb600"
          active-color="#ffb600"
          bg-color="#ffffff"
          class="w-100"
          :rules="[requiredRule, phoneRule]"
        />
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 font-weight-bold primary-gray-700 ml-2">
          Location
        </div>
        <v-text-field
          v-model="location"
          rounded
          density="compact"
          placeholder="Location"
          variant="outlined"
          autocomplete="off"
          clearable
          persistent-clear
          base-color="#E4E7EC"
          color="#ffb600"
          active-color="#ffb600"
          bg-color="#ffffff"
          class="w-100"
          :rules="[requiredRule]"
        />
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 font-weight-bold primary-gray-700 ml-2">
          Local Name
        </div>
        <v-text-field
          v-model="localName"
          rounded
          density="compact"
          placeholder="Local Name"
          variant="outlined"
          autocomplete="off"
          clearable
          persistent-clear
          base-color="#E4E7EC"
          color="#ffb600"
          active-color="#ffb600"
          bg-color="#ffffff"
          class="w-100"
          :rules="[requiredRule]"
        />
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 font-weight-bold primary-gray-700 ml-2">
          Zip Code
        </div>
        <v-text-field
          v-model="zipCode"
          rounded
          density="compact"
          placeholder="Zip Code"
          variant="outlined"
          autocomplete="off"
          clearable
          persistent-clear
          base-color="#E4E7EC"
          color="#ffb600"
          active-color="#ffb600"
          bg-color="#ffffff"
          class="w-100"
          :rules="[requiredRule, zipCodeRule]"
        />
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 font-weight-bold primary-gray-700 ml-2">
          Local Address
        </div>
        <v-text-field
          v-model="localAddress"
          rounded
          density="compact"
          placeholder="Local Address"
          variant="outlined"
          autocomplete="off"
          clearable
          persistent-clear
          base-color="#E4E7EC"
          color="#ffb600"
          active-color="#ffb600"
          bg-color="#ffffff"
          class="w-100"
          :rules="[requiredRule]"
        />
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 font-weight-bold primary-gray-700 ml-2">
          Fax Number
        </div>
        <v-text-field
          v-model="faxNumber"
          rounded
          density="compact"
          placeholder="Fax Number"
          variant="outlined"
          autocomplete="off"
          clearable
          persistent-clear
          base-color="#E4E7EC"
          color="#ffb600"
          active-color="#ffb600"
          bg-color="#ffffff"
          class="w-100"
          :rules="[faxRule]"
        />
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 font-weight-bold primary-gray-700 ml-2">
          Description
        </div>
        <v-textarea
          v-model="description"
          rounded="lg"
          density="compact"
          placeholder="Description"
          variant="outlined"
          autocomplete="off"
          persistent-clear
          base-color="#E4E7EC"
          color="#ffb600"
          active-color="#ffb600"
          bg-color="#ffffff"
          class="w-100"
          :rules="[descriptionRule]"
          no-resize
        />
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 font-weight-bold primary-gray-700 ml-2">
          Location On Map
        </div>
        <div class="w-100 d-flex align-center justify-start ga-1 mt-3">
          <v-icon
            size="x-large"
            :color="latLng.length > 0 ? `success` : `error`"
          >
            md:location_on
          </v-icon>
          <v-btn
            variant="outlined"
            :color="latLng.length > 0 ? `success` : `error`"
            rounded="xl"
            @click="openSelectLocationDialog"
          >
            {{ latLng.length > 0 ? `Change ` : `Choose ` }} Location
          </v-btn>
        </div>
        <common-select-location-dialog
          v-model="showSelectLocationDialog"
          :content-data="mapData"
          :map="map"
          @update="handleSelectLocationUpdate"
        />
      </div>
    </div>

    <div class="w-100 d-flex align-center justify-center ga-3 mt-2">
      <v-btn
        size="x-small"
        variant="text"
        class="text-h5"
        @click="cancel"
      >
        Cancel
      </v-btn>
      <v-btn
        icon
        color="#1D2939"
        height="40"
        width="40"
        flat
        @click="preStep"
      >
        <v-icon size="x-large">
          md:arrow_back
        </v-icon>
      </v-btn>
      <v-btn
        color="#ffb600"
        flat
        rounded="xl"
        height="40"
        max-width="180"
        class="w-100 text-h5"
        :disabled="!isFormValid"
        @click="submitForm"
      >
        Confirm
      </v-btn>
    </div>
  </div>
</template>

<script setup>
const router = useRouter()

const props = defineProps({
  schoolInformation: {
    type: Object,
  },
})

watch(
  () => props.schoolInformation,
  () => {
    if (props.schoolInformation) {
      if (props.schoolInformation.countryId) {
        mapData.value.countryId = props.schoolInformation.countryId
      }
      if (props.schoolInformation.stateId) {
        mapData.value.stateId = props.schoolInformation.stateId
      }
      if (props.schoolInformation.cityId) {
        mapData.value.cityId = props.schoolInformation.cityId
      }
    }
  },
)

const emit = defineEmits(['nextStep', 'prevStep'])

const website = ref('')
const email = ref('')
const phone = ref('')
const location = ref('')

const localName = ref('')
const zipCode = ref('')
const localAddress = ref('')
const faxNumber = ref('')
const description = ref('')
const latLng = ref([])

const showSelectLocationDialog = ref(false)
const map = reactive({
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  zoom: 10,
  minZoom: 2,
  center: [0, 0],
  latLng: [0, 0],
  object: null,
  boundingBox: {},
  schoolIcon: '/images/school-marker.png',
})
const mapData = ref({
  latitude: 0,
  longitude: 0,
  countryId: null,
  stateId: null,
  cityId: null,
})

const handleSelectLocationUpdate = (dataMap) => {
  latLng.value[0] = dataMap.lat
  latLng.value[1] = dataMap.lng
  showSelectLocationDialog.value = false
}
const openSelectLocationDialog = () => {
  showSelectLocationDialog.value = true
}

const requiredRule = value => !!value || 'This field is required'
const emailRule = (value) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return pattern.test(value) || 'Enter a valid email address'
}
const phoneRule = (value) => {
  const numericPattern = /^[0-9]+$/
  if (!numericPattern.test(value)) return 'Only numbers are allowed'
  if (value.length < 8) return 'At least 8 digits required'
  return true
}
const urlRule = (value) => {
  if (!value) return true
  const pattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
  return pattern.test(value) || 'Enter a valid URL'
}

const zipCodeRule = (value) => {
  const numericPattern = /^[0-9]+$/
  return numericPattern.test(value) || 'Only numbers are allowed'
}
const faxRule = (value) => {
  if (!value) return true
  const numericPattern = /^[0-9]+$/
  return numericPattern.test(value) || 'Only numbers are allowed'
}
const descriptionRule = (value) => {
  if (!value) return true
  return value.length <= 500 || 'Maximum 500 characters allowed'
}

const isFormValid = computed(() => {
  return (
    emailRule(email.value) === true
    && phoneRule(phone.value) === true
    && requiredRule(location.value) === true
    && requiredRule(website.value) === true
    && requiredRule(localName.value) === true
    && requiredRule(zipCode.value) === true
    && zipCodeRule(zipCode.value) === true
    && requiredRule(localAddress.value) === true
    && (faxNumber.value ? faxRule(faxNumber.value) === true : true)
    && (description.value ? descriptionRule(description.value) === true : true)
    && latLng.value.length > 0
  )
})
const submitForm = () => {
  if (isFormValid.value) {
    const contactStepInfo = {
      webSite: website.value,
      email: email.value,
      phoneNumber: phone.value,
      address: location.value,
      localName: localName.value,
      zipCode: zipCode.value,
      localAddress: localAddress.value,
      faxNumber: faxNumber.value,
      description: description.value,
      latitude: latLng.value[0],
      longitude: latLng.value[1],
    }
    emit('nextStep', contactStepInfo)
  }
}

const preStep = () => {
  emit('prevStep')
}

const cancel = () => {
  router.push('/school')
}
</script>

<style scoped>
.max-width-container {
  max-width: 500px;
}
</style>
