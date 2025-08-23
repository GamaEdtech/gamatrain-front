<template>
  <v-dialog
    v-model="dialogModel"
    max-width="400"
    :fullscreen="!mdAndUp"
    @click="clickOnOverlay"
  >
    <div
      class="w-100 d-flex flex-wrap flex-column bg-white pa-6 rounded-xl mobile-style"
      @click="clickOnModal"
    >
      <v-row class="align-center">
        <v-col cols="10">
          <span class="text-h4 font-weight-bold">Select Coordinates</span>
        </v-col>
        <v-col
          cols="2"
          class="d-flex align-center justify-end ga-2"
        >
          <v-icon
            class="ml-4"
            size="x-large"
            color="#D0D5DD"
            @click="closeModal"
          >
            md:close
          </v-icon>
        </v-col>
      </v-row>

      <div
        class="w-100 d-flex flex-column align-center justify-center ga-4 mt-4"
      >
        <v-text-field
          v-model="lat"
          label="latitude"
          variant="outlined"
          color="#FFB600"
          density="compact"
          rounded="xl"
          class="w-100"
          :rules="latRules"
        />
        <v-text-field
          v-model="lng"
          label="longitude"
          variant="outlined"
          color="#FFB600"
          density="compact"
          rounded="xl"
          class="w-100"
          :rules="lngRules"
        />

        <v-btn
          block
          color="primary"
          rounded="xl"
          class="mt-2 font-weight-bold text-h5"
          :disabled="!canSubmit"
          @click="findLocation"
        >
          Find
        </v-btn>
      </div>
    </div>
  </v-dialog>
</template>

<script setup>
import { useDisplay } from 'vuetify'
import { ref, computed } from 'vue'

const { mdAndUp } = useDisplay()

const props = defineProps({
  showDialog: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:showDialog', 'sendLatLgn'])

const lat = ref()
const lng = ref()

const required = v =>
  (v !== null && v !== undefined && String(v).trim() !== '')
  || 'Field is required'

const isNumber = v =>
  !v || (!isNaN(parseFloat(v)) && isFinite(v)) || 'Must Be Number'

const latRange = (v) => {
  const n = parseFloat(v)
  return !v || (n >= -90 && n <= 90) || 'Latitude must be between -90 and 90'
}

const lngRange = (v) => {
  const n = parseFloat(v)
  return (
    !v || (n >= -180 && n <= 180) || 'Longitude must be between -180 and 180'
  )
}

const latRules = [isNumber, latRange]
const lngRules = [isNumber, lngRange]

const canSubmit = computed(() => {
  const checks = [
    required(lat.value) === true,
    isNumber(lat.value) === true,
    latRange(lat.value) === true,
    required(lng.value) === true,
    isNumber(lng.value) === true,
    lngRange(lng.value) === true,
  ]
  return checks.every(Boolean)
})

const findLocation = () => {
  if (canSubmit.value) {
    emit('sendLatLgn', parseFloat(lat.value), parseFloat(lng.value))
  }
}

// Start Section Handle Status Modal
const dialogModel = computed({
  get: () => props.showDialog,
  set: value => emit('update:showDialog', value),
})

const closeModal = () => {
  emit('update:showDialog', false)
}
// End Section Handle Status Modal

const clickOnOverlay = () => {
  if (!mdAndUp.value) {
    emit('update:showDialog', false)
  }
}

const clickOnModal = (event) => {
  event.stopPropagation()
}
</script>

<style scoped>
.size-icon {
  font-size: 24px;
  margin-right: 12px;
}
@media only screen and (max-width: 960px) {
  .mobile-style {
    position: absolute;
    bottom: 0;
    border-radius: 24px 24px 0 0 !important;
  }
}
</style>
