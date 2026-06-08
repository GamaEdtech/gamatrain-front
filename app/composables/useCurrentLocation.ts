import { onUnmounted, type Ref } from 'vue'

import {
  type GeolocationErrorConfig,
  GEOLOCATION_ERRORS,
  GEOLOCATION_OPTIONS,
  LOCATION_REQUEST_COOLDOWN_MS,
} from '~/constants/geolocation'

type UserLocation = {
  lat: number
  lng: number
}

type UseCurrentLocationReturn = {
  location: Ref<UserLocation | null>
  error: Ref<string | null>
  isLoading: Ref<boolean>
  isCooldownActive: Ref<boolean>
  fetchLocation: () => void
}

export const useCurrentLocation = (): UseCurrentLocationReturn => {
  /**
   * Shared geolocation state.
   * Persists and synchronizes location-related data
   * across all consumers of this composable.
   */
  const location = useState<UserLocation | null>('user-location', () => null)
  const error = useState<string | null>('user-location-error', () => null)
  const isLoading = useState('user-location-loading', () => false)
  const isCooldownActive = useState('user-location-cooldown', () => false)

  let cooldownTimeout: ReturnType<typeof setTimeout> | null = null

  const { $toast } = useNuxtApp()

  const handleLocationError = (geoError?: GeolocationPositionError) => {
    let errorConfig: GeolocationErrorConfig = GEOLOCATION_ERRORS.DEFAULT

    if (!geoError) {
      errorConfig = GEOLOCATION_ERRORS.UNSUPPORTED_BROWSER
    }
    else {
      switch (geoError.code) {
        case geoError.PERMISSION_DENIED:
          errorConfig = GEOLOCATION_ERRORS.PERMISSION_DENIED
          break

        case geoError.POSITION_UNAVAILABLE:
          errorConfig = GEOLOCATION_ERRORS.POSITION_UNAVAILABLE
          break

        case geoError.TIMEOUT:
          errorConfig = GEOLOCATION_ERRORS.TIMEOUT
          break
      }
    }

    error.value = errorConfig.message

    $toast[errorConfig.type](errorConfig.message)

    location.value = null

    isLoading.value = false
  }

  const startCooldown = () => {
    isCooldownActive.value = true

    if (cooldownTimeout) {
      clearTimeout(cooldownTimeout)
    }

    cooldownTimeout = setTimeout(() => {
      isCooldownActive.value = false

      cooldownTimeout = null
    }, LOCATION_REQUEST_COOLDOWN_MS)
  }

  const fetchLocation = (): void => {
    /**
     * Prevent:
     * - repeated clicks
     * - concurrent requests
     * - requests during cooldown
     */
    if (isLoading.value || isCooldownActive.value) {
      return
    }

    /**
     * Browser does not support geolocation
     */
    if (!('geolocation' in navigator)) {
      handleLocationError()

      return
    }

    error.value = null
    isLoading.value = true

    startCooldown()

    navigator.geolocation.getCurrentPosition(
      (position) => {
        location.value = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }

        error.value = null
        isLoading.value = false
      },

      (geoError) => {
        handleLocationError(geoError)
      },

      GEOLOCATION_OPTIONS,
    )
  }

  onUnmounted(() => {
    if (cooldownTimeout) {
      clearTimeout(cooldownTimeout)
    }
  })

  return {
    location,
    error,
    isLoading,
    isCooldownActive,
    fetchLocation,
  }
}
