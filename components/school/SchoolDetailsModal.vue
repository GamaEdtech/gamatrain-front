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

    <!-- School card -->
    <v-card
      v-else
      class="school-modal-card"
    >
      <v-card-text class="pa-0">
        <!-- Desktop Card Style -->
        <div
          v-if="!$vuetify.display.xs"
          class="card-school"
          @click="navigateToSchoolDetails"
        >
          <div class="name-address-image">
            <div class="name-div">
              <span class="name gtext-t4 font-weight-semibold">{{
                school?.name
              }}</span>
              <div class="d-flex align-center justify-start flex-wrap ga-3">
                <v-chip
                  v-if="school?.countryTitle && school.countryTitle.length > 0"
                  class="text-subtitle-1"
                  variant="elevated"
                  color="#546e7a"
                >
                  {{ school.countryTitle }}
                </v-chip>
                <v-chip
                  v-if="school?.stateTitle && school.stateTitle.length > 0"
                  class="text-subtitle-1"
                  variant="elevated"
                  color="#546e7a"
                >
                  {{ school.stateTitle }}
                </v-chip>
                <v-chip
                  v-if="school?.cityTitle && school.cityTitle.length > 0"
                  class="text-subtitle-1"
                  variant="elevated"
                  color="#546e7a"
                >
                  United {{ school.cityTitle }}
                </v-chip>
              </div>
            </div>
            <div
              v-if="school?.defaultImageUri"
              class="img-div"
            >
              <NuxtImg
                v-show="school?.defaultImageUri"
                :alt="school?.name"
                width="180px"
                :src="
                  school?.defaultImageUri?.replace(/^http:\/\//, 'https://')
                "
                placeholder
                class="h-100"
              />
            </div>
          </div>
          <div class="line-seperator" />
          <div
            class="w-100 d-flex align-center justify-space-between mt-3 flex-wrap ga-5"
          >
            <div class="d-flex align-center">
              <v-btn
                variant="text"
                icon
                :disabled="!school?.hasLocation"
              >
                <v-icon size="x-large">
                  mdi-map-marker
                </v-icon>
              </v-btn>
              <v-btn
                variant="text"
                icon
                :disabled="!school?.hasPhone"
              >
                <v-icon size="x-large">
                  mdi-phone
                </v-icon>
              </v-btn>
              <v-btn
                variant="text"
                icon
                :disabled="!school?.hasEmail"
              >
                <v-icon size="x-large">
                  mdi-email
                </v-icon>
              </v-btn>
              <v-btn
                variant="text"
                icon
                :disabled="!school?.hasWebsite"
              >
                <v-icon size="x-large">
                  mdi-web
                </v-icon>
              </v-btn>
            </div>
            <div class="d-flex align-center ga-2">
              <div
                class="d-flex align-center ga-2 gtext-t6 font-weight-semibold"
              >
                <v-icon
                  size="x-large"
                  color="primary"
                >
                  mdi-star
                </v-icon>
                {{ school?.score ? school.score.toFixed(1) : "New" }}
              </div>
              <div class="d-flex align-center ga-2 gtext-t6 primary-gray-300">
                <v-icon size="x-large">
                  mdi-update
                </v-icon>
                <span class="primary-gray-600">
                  {{ $dayjs(school?.lastModifyDate).format("YYYY-MM-DD") }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Card Style -->
        <div v-else>
          <div
            v-if="school?.defaultImageUri"
            class="school-card-bg"
            :style="{ backgroundImage: `url(${school?.defaultImageUri})` }"
            @click="navigateToSchoolDetails"
          >
            <div class="school-card-overlay">
              <div class="school-card-header">
                <ClientOnly>
                  <div class="school-name">
                    {{ school?.name }}
                  </div>
                </ClientOnly>
              </div>

              <div class="d-flex-col">
                <div
                  class="d-flex align-center ga-2 flex-wrap my-4 justify-space-start"
                >
                  <v-chip
                    v-if="
                      school?.countryTitle && school.countryTitle.length > 0
                    "
                    class="text-subtitle-1"
                    variant="flat"
                    density="comfortable"
                    color="rgba(52, 64, 84, 1)"
                  >
                    {{ school.countryTitle }}
                  </v-chip>
                  <v-chip
                    v-if="school?.stateTitle && school.stateTitle.length > 0"
                    class="text-subtitle-1"
                    variant="flat"
                    density="comfortable"
                    color="rgba(52, 64, 84, 1)"
                  >
                    {{ school.stateTitle }}
                  </v-chip>
                  <v-chip
                    v-if="school?.cityTitle && school.cityTitle.length > 0"
                    class="text-subtitle-1"
                    variant="flat"
                    density="comfortable"
                    color="rgba(52, 64, 84, 1)"
                  >
                    United {{ school.cityTitle }}
                  </v-chip>
                </div>
                <div class="d-flex align-strach justify-space-between pt-2">
                  <div
                    class="d-flex align-center w-100 gtext-t6 font-weight-semibold ga-1 primary-gray-500"
                  >
                    Score:
                    <v-icon color="primary">
                      mdi-star
                    </v-icon>
                    {{ school?.score ? school.score.toFixed(1) : "New" }}
                  </div>
                  <v-divider
                    :thickness="1"
                    class="border-opacity-100 primary-gray-300 w-100"
                    vertical
                  />
                  <div
                    class="d-flex align-center justify-end ga-2 gtext-t6 primary-gray-300 w-100"
                  >
                    <v-icon color="rgba(52, 64, 84, 1)">
                      mdi-update
                    </v-icon>
                    <span class="primary-gray-600">
                      {{ $dayjs(school?.lastModifyDate).format("YYYY-MM-DD") }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-else
            class="card-school"
          >
            <div class="school-card-overlay">
              <div class="school-card-header">
                <div class="school-name">
                  {{ school?.name }}
                </div>
              </div>

              <div class="d-flex-col">
                <div
                  class="d-flex align-center ga-2 flex-wrap my-6 justify-space-start"
                >
                  <v-chip
                    v-if="
                      school?.countryTitle && school.countryTitle.length > 0
                    "
                    class="text-subtitle-1"
                    variant="flat"
                    density="comfortable"
                    color="rgba(52, 64, 84, 1)"
                  >
                    {{ school.countryTitle }}
                  </v-chip>
                  <v-chip
                    v-if="school?.stateTitle && school.stateTitle.length > 0"
                    class="text-subtitle-1"
                    variant="flat"
                    density="comfortable"
                    color="rgba(52, 64, 84, 1)"
                  >
                    {{ school.stateTitle }}
                  </v-chip>
                  <v-chip
                    v-if="school?.cityTitle && school.cityTitle.length > 0"
                    class="text-subtitle-1"
                    variant="flat"
                    density="comfortable"
                    color="rgba(52, 64, 84, 1)"
                  >
                    United {{ school.cityTitle }}
                  </v-chip>
                </div>
                <div
                  class="w-100 d-flex align-strach justify-space-between pt-2"
                >
                  <div
                    class="d-flex align-center w-100 gtext-t6 font-weight-semibold ga-1 primary-gray-500"
                  >
                    Score:
                    <v-icon color="primary">
                      mdi-star
                    </v-icon>
                    {{ school?.score ? school.score.toFixed(1) : "New" }}
                  </div>
                  <v-divider
                    :thickness="1"
                    class="border-opacity-100 primary-gray-300 w-100"
                    vertical
                  />
                  <div
                    class="d-flex align-center justify-end ga-2 gtext-t6 primary-gray-300 w-100"
                  >
                    <v-icon color="rgba(52, 64, 84, 1)">
                      mdi-update
                    </v-icon>
                    <span class="primary-gray-600">
                      {{ $dayjs(school?.lastModifyDate).format("YYYY-MM-DD") }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="line-seperator" />
          <div
            class="w-100 d-flex justify-space-between align-center px-1"
            style="background: rgba(249, 250, 251, 0.7)"
          >
            <div class="d-flex align-center">
              <v-btn
                variant="text"
                icon
                :disabled="!school?.hasLocation"
              >
                <v-icon
                  size="large"
                  color="rgba(52, 64, 84, 1)"
                >
                  mdi-map-marker
                </v-icon>
              </v-btn>
              <v-btn
                variant="text"
                icon
                :disabled="!school?.hasPhone"
              >
                <v-icon
                  size="large"
                  color="rgba(52, 64, 84, 1)"
                >
                  mdi-phone
                </v-icon>
              </v-btn>
              <v-btn
                variant="text"
                icon
                :disabled="!school?.hasEmail"
              >
                <v-icon
                  size="large"
                  color="rgba(52, 64, 84, 1)"
                >
                  mdi-email
                </v-icon>
              </v-btn>
              <v-btn
                variant="text"
                icon
                :disabled="!school?.hasWebsite"
              >
                <v-icon
                  size="large"
                  color="rgba(52, 64, 84, 1)"
                >
                  mdi-web
                </v-icon>
              </v-btn>
            </div>
            <div
              class="d-flex align-center px-1 h-100"
              style="color: rgba(52, 64, 84, 1)"
            >
              <div class="font-size-12">
                Details
              </div>
              <v-icon
                color="rgba(52, 64, 84, 1)"
                style="line-height: unset; margin-inline-start: 4px"
              >
                mdi-chevron-right
              </v-icon>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, watch, ref } from 'vue'
import { useRouter } from 'vue-router'

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

const _router = useRouter()
const { $dayjs, $slugGenerator } = useNuxtApp()

// Handle v-model binding
const internalValue = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

// Navigate to school details page
const navigateToSchoolDetails = (event) => {
  if (!props.school) return

  try {
    // Prevent event propagation to avoid double-clicks
    event.stopPropagation()

    const schoolId = props.school.id
    const schoolSlug = $slugGenerator(props.school.name)
    const _schoolUrl = `/school/${schoolId}/${schoolSlug}`

    // Add active state visual feedback for touch devices
    const card = event.currentTarget
    card.style.opacity = '0.8'

    // Close the modal with a slight delay for better UX
    setTimeout(() => {
      internalValue.value = false

      emit('navigate-to-details', schoolId, schoolSlug)

      // Reset opacity
      card.style.opacity = '1'
    }, 50)
  }
  catch (error) {
    console.error('Error navigating to school details:', error)
  }
}

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

<style lang="scss" scoped>
@use "../../assets/scss/app.scss" as style;

.school-modal-card {
  cursor: pointer;
  transition: transform 0.2s ease;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }

  // Mobile-specific styles
  @media (max-width: 600px) {
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
  }
}

// Desktop card styles
.card-school {
  width: 100%;
  min-height: auto;
  background-color: white;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px;

  .name-address-image {
    width: 100%;
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    row-gap: 20px;
    min-height: 130px;
    justify-content: space-between;

    .name-div {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      row-gap: 20px;
      flex: 1;
      padding-right: 16px;
    }

    .img-div {
      min-width: 180px;
      height: 130px;
    }
  }

  .line-seperator {
    width: 100%;
    height: 2px;
    background-color: #e4e6e9;
    margin-top: 10px;
  }
}

// Mobile card styles
.school-card-bg {
  position: relative;
  width: 100%;
  height: 220px;
  background-size: cover;
  background-position: center;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
}

.school-card-overlay {
  width: inherit !important;
  background: rgba(255, 255, 255, 0.87);
  padding: 15px 12px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  position: relative;
}

.school-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.school-name {
  font-family: Inter;
  font-weight: 600;
  font-style: Semi Bold;
  font-size: 16px;
  line-height: 26px;
  letter-spacing: 0%;
}

.line-seperator {
  width: 100%;
  height: 1px;
  background-color: rgba(242, 244, 247, 1);
}

.font-size-12 {
  font-size: 12px;
}

// Bottom sheet modal styles
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
