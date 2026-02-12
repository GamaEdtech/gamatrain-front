<template>
  <v-dialog
    v-model="internalValue"
    location="bottom"
    max-width="800"
    transition="dialog-bottom-transition"
    :persistent="false"
    :fullscreen="false"
    content-class="bottom-sheet-modal"
    @keydown.esc="closeModal"
    @click:outside="closeModal"
  >
    <!-- Error state -->
    <v-card
      v-if="hasError"
      class="error-card"
    >
      <v-card-text class="d-flex flex-column align-center justify-center pa-4">
        <v-icon
          color="error"
          size="large"
          class="mb-3"
        >
          mdi-alert-circle
        </v-icon>
        <div class="text-h6 mb-2">
          {{ errorMessage || "Unable to display school information" }}
        </div>
        <div class="text-body-2 mb-4 text-center text-grey-600">
          There was an issue loading the school details. You can still view the
          full information by visiting the school page directly.
        </div>
        <div class="d-flex gap-2">
          <v-btn
            color="primary"
            @click="closeModal"
          >
            Close
          </v-btn>
          <v-btn
            v-if="school?.id"
            variant="outlined"
            color="primary"
            @click="navigateToSchoolDetailsDirect"
          >
            View Details
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- Loading state -->
    <v-card
      v-else-if="isLoading"
      class="loading-card"
    >
      <v-card-text class="d-flex flex-column align-center justify-center pa-4">
        <v-progress-circular
          indeterminate
          color="primary"
          class="mb-3"
        />
        <div class="text-body-1">
          Loading school information...
        </div>
      </v-card-text>
    </v-card>

    <school-card-mobile :school="school" />
  </v-dialog>
</template>

<script setup>
import { computed, watch, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  school: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'navigate-to-details'])

// Error handling state
const hasError = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)

const { $slugGenerator } = useNuxtApp()

// Handle v-model binding
const internalValue = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

// Close the modal
const closeModal = () => {
  internalValue.value = false
  hasError.value = false
  isLoading.value = false
  errorMessage.value = ''
}

// Navigate directly to school details (for error fallback)
const navigateToSchoolDetailsDirect = () => {
  if (!props.school?.id) return

  const schoolSlug
    = props.school.name && props.school.name !== 'Loading...'
      ? $slugGenerator(props.school.name)
      : 'school'
  const schoolUrl = `/school/${props.school.id}/${schoolSlug}`

  closeModal()
  window.open(schoolUrl, '_blank')
}

// Validate school data for display
const validateSchoolForDisplay = (school) => {
  if (!school) return false

  // Check if we have minimal data for display
  const hasMinimalData = school.id && school.name

  // Check if we're in a loading state (has ID but minimal other data)
  const isLoadingState = school.id && school.name === 'Loading...'

  return { hasMinimalData, isLoadingState }
}

// Watch for school changes to handle edge cases and loading states
watch(
  () => props.school,
  (newSchool) => {
    if (!newSchool) {
      // If school data is removed, close the modal
      internalValue.value = false
      hasError.value = false
      isLoading.value = false
      return
    }

    const validation = validateSchoolForDisplay(newSchool)

    if (validation.isLoadingState) {
      // School is in loading state
      isLoading.value = true
      hasError.value = false
    }
    else if (validation.hasMinimalData) {
      // School has valid data
      isLoading.value = false
      hasError.value = false
    }
    else {
      // School data is invalid
      hasError.value = true
      isLoading.value = false
      errorMessage.value = 'Unable to load school information'
    }
  },
  { deep: true, immediate: true },
)
</script>

<style scoped>
:deep(.bottom-sheet-modal) {
  position: fixed !important;
  bottom: 10% !important;
  top: auto !important;
  left: 0 !important;
  right: 0 !important;
  margin: 0 !important;
  max-height: 70vh !important;
  border-top-left-radius: 16px !important;
  border-top-right-radius: 16px !important;
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;

  @media (min-width: 600px) {
    max-width: 500px !important;
    left: 50% !important;
    right: auto !important;
    transform: translateX(-50%) !important;
  }
  @media (max-width: 600px) {
    max-width: 300px !important;
    left: 50% !important;
    right: auto !important;
    transform: translateX(-50%) !important;
  }
}

:deep(.v-overlay__content) {
  align-items: center !important;
  justify-content: center !important;
  width: auto;
  height: auto;
}
</style>
