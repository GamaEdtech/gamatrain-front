<template>
  <section class="referral-section py-16">
    <v-container>
      <v-row justify="center">
        <v-col
          cols="12"
          md="8"
          lg="6"
        >
          <div class="text-center mb-8">
            <h2 class="gama-text-h2 text-white mb-4">
              Invite your friends to experience the future of decentralized education and create value.
            </h2>
          </div>

          <div class="referral-card bg-white rounded-lg pa-8">
            <!-- Loading State -->
            <div
              v-if="loading"
              class="text-center py-8"
            >
              <v-progress-circular
                indeterminate
                color="primary"
                size="48"
              />
              <p class="gama-text-body1 mt-4">
                Loading...
              </p>
            </div>

            <!-- Error State -->
            <div
              v-else-if="error"
              class="text-center py-8"
            >
              <v-icon
                color="error"
                size="48"
                class="mb-4"
              >
                mdi-alert-circle
              </v-icon>
              <p class="gama-text-body1 text-error mb-4">
                {{ error }}
              </p>
              <v-btn
                color="primary"
                @click="checkExistingReferral"
              >
                Try Again
              </v-btn>
            </div>

            <!-- Referral Link Exists -->
            <div
              v-else-if="referralLink"
              class="text-center"
            >
              <div class="mb-6">
                <v-icon
                  color="success"
                  size="64"
                  class="mb-4"
                >
                  mdi-check-circle
                </v-icon>
                <h3 class="gama-text-h4 mb-2">
                  Your Referral Link is Ready!
                </h3>
                <p class="gama-text-body2 primary-gray-600">
                  Share this link with your friends to earn rewards
                </p>
              </div>

              <div class="referral-link-container mb-6">
                <v-text-field
                  v-model="referralLink"
                  readonly
                  variant="outlined"
                  class="referral-input"
                  :append-inner-icon="copied ? 'mdi-check' : 'mdi-content-copy'"
                  @click:append-inner="copyToClipboard"
                  @click="copyToClipboard"
                />
              </div>

              <v-btn
                color="primary"
                size="large"
                class="gama-primary-btn font-weight-bold"
                elevation="1"
                rounded
                @click="copyToClipboard"
              >
                <v-icon
                  left
                  class="mx-1"
                >
                  {{ copied ? 'mdi-check' : 'mdi-content-copy' }}
                </v-icon>
                {{ copied ? 'Copied!' : 'Copy Link' }}
              </v-btn>
            </div>

            <!-- Not Authenticated -->
            <div
              v-else-if="!auth.isAuthenticated.value"
              class="text-center"
            >
              <div class="mb-6">
                <img
                  src="/images/token/referral-icon.svg"
                  alt="Referral"
                  class="referral-icon mb-4"
                  style="width: 80px; height: 80px;"
                >
                <h3 class="gama-text-h4 mb-2">
                  Get Your Referral Code
                </h3>
                <p class="gama-text-body2 primary-gray-600">
                  Please login to generate your unique referral link
                </p>
              </div>

              <v-btn
                color="primary"
                size="large"
                class="gama-primary-btn"
                @click="openAuthDialog"
              >
                Login to Get Referral Code
              </v-btn>
            </div>

            <!-- Generate New Referral -->
            <div
              v-else
              class="text-center"
            >
              <div class="mb-6">
                <img
                  src="/images/token/referral-icon.svg"
                  alt="Referral"
                  class="referral-icon mb-4"
                  style="width: 80px; height: 80px;"
                >
                <h3 class="gama-text-h4 mb-2">
                  Get Your Referral Code
                </h3>
                <p class="gama-text-body2 primary-gray-600">
                  Generate your unique referral link and start earning rewards
                </p>
              </div>

              <div class="d-flex flex-column align-center gap-3">
                <v-btn
                  color="primary"
                  size="large"
                  class="gama-primary-btn"
                  :loading="generating"
                  @click="generateReferralLink"
                >
                  Get Your Referral Code
                </v-btn>

                <v-btn
                  variant="text"
                  size="small"
                  :loading="loading"
                  @click="checkExistingReferral"
                >
                  <v-icon left>
                    mdi-refresh
                  </v-icon>
                  Check Again
                </v-btn>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useAuth } from '~/composables/useAuth'

// Reactive state
const loading = ref(true)
const generating = ref(false)
const error = ref(null)
const referralLink = ref(null)
const copied = ref(false)

// Composables
const auth = useAuth()
const { $toast } = useNuxtApp()
const router = useRouter()

// Check if user has existing referral link
const checkExistingReferral = async () => {
  try {
    loading.value = true
    error.value = null

    if (!auth.isAuthenticated.value) {
      loading.value = false
      return
    }

    const response = await useApiService.get('/api/v2/identities/profiles')
    console.log('Profile response:', response) // Debug log

    // Check multiple possible locations for referral_id
    let referralId = null

    // Try different possible paths in the response
    if (response?.data) {
      referralId = response.data.referral_id
        || response.data.referralId
        || response.data.refId
        || response.data.ref_id
    }

    // Also check direct response properties
    if (!referralId) {
      referralId = response?.referral_id
        || response?.referralId
        || response?.refId
        || response?.ref_id
    }

    // Check if it's nested deeper
    if (!referralId && response?.data?.user) {
      referralId = response.data.user.referral_id
        || response.data.user.referralId
        || response.data.user.refId
        || response.data.user.ref_id
    }

    if (referralId) {
      referralLink.value = `https://gamatrain.com/get-token?ref=${referralId}`
      console.log('Found existing referral:', referralId)
    }
    else {
      console.log('No referral ID found in profile response')
      console.log('Available keys in response.data:', response?.data ? Object.keys(response.data) : 'No data')
    }
  }
  catch (err) {
    console.error('Error checking existing referral:', err)
    const status = err?.response?.status

    if (status === 401 || status === 403) {
      error.value = 'Please login to access referral features'
    }
    else if (status === 500 || status === 504) {
      error.value = 'Server error. Please try again later.'
    }
    else {
      error.value = 'Failed to check existing referral. Please try again.'
    }
  }
  finally {
    loading.value = false
  }
}

// Generate new referral link
const generateReferralLink = async () => {
  try {
    generating.value = true
    error.value = null

    if (!auth.isAuthenticated.value) {
      error.value = 'Please login to generate a referral link'
      return
    }

    const response = await useApiService.post('/api/v2/referral/generate')

    if (response?.status === 1 && response.data?.referral_id) {
      referralLink.value = `https://gamatrain.com/get-token?ref=${response.data.referral_id}`
      $toast.success('Referral link generated successfully!')
    }
    else if (response?.data?.referral_id) {
      referralLink.value = `https://gamatrain.com/get-token?ref=${response.data.referral_id}`
      $toast.success('Referral link generated successfully!')
    }
    else {
      throw new Error('Invalid response from server')
    }
  }
  catch (err) {
    console.error('Error generating referral:', err)
    const status = err?.response?.status
    const errorData = err?.response?._data || err?.response?.data

    if (status === 401 || status === 403) {
      error.value = 'Please login to generate a referral link'
    }
    else if (status === 400 && errorData?.errors?.[0]?.message === 'AlreadyHaveReferralId') {
      // User already has a referral ID, let's try to get it from profile again
      $toast.info('You already have a referral link. Fetching it...')
      await checkExistingReferral()

      // If we still don't have the referral link after checking profile,
      // show an error asking user to contact support
      if (!referralLink.value) {
        error.value = 'You already have a referral link, but we cannot retrieve it. Please contact support.'
      }
    }
    else if (status === 400 && errorData?.message) {
      error.value = errorData.message
      $toast.error(errorData.message)
    }
    else if (status === 500 || status === 504) {
      error.value = 'Server error. Please try again later.'
      $toast.error('Server error. Please try again later.')
    }
    else {
      error.value = 'Failed to generate referral link. Please try again.'
      $toast.error('Failed to generate referral link')
    }
  }
  finally {
    generating.value = false
  }
}

// Copy link to clipboard
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(referralLink.value)
    copied.value = true
    $toast.success('Referral link copied to clipboard!')

    // Reset copied state after 2 seconds
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
  catch (err) {
    console.error('Failed to copy to clipboard:', err)
    $toast.error('Failed to copy link')
  }
}

// Open authentication dialog
const openAuthDialog = () => {
  router.push({ query: { auth_form: 'login' } })
}

// Watch for authentication changes
watch(() => auth.isAuthenticated.value, (isAuthenticated) => {
  if (isAuthenticated) {
    checkExistingReferral()
  }
  else {
    referralLink.value = null
    error.value = null
    loading.value = false
  }
})

// Initialize component
onMounted(() => {
  checkExistingReferral()
})
</script>

<style scoped>
.referral-section {
  position: relative;
  overflow: hidden;
  background-color: rgba(36, 41, 47, 1);
}

.referral-card {
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
}

.referral-link-container {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
  border: 2px solid #e4e7ec;
  transition: all 0.3s ease;
}

.referral-link-container:hover {
  border-color: #ffb600;
  background: #fffbf0;
}

.referral-input :deep(.v-field__input) {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.referral-input :deep(.v-field__append-inner) {
  cursor: pointer;
}

.referral-input :deep(.v-field__append-inner .v-icon) {
  transition: color 0.3s ease;
}

.referral-input :deep(.v-field__append-inner .v-icon:hover) {
  color: #ffb600;
}

.referral-icon {
  filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.1));
}

@media (max-width: 600px) {
  .referral-section {
    padding: 32px 0;
  }

  .referral-card {
    margin: 0 16px;
    padding: 24px 16px;
  }

  .referral-link-container {
    padding: 12px;
  }
}
</style>
