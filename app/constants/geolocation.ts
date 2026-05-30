/**
 * Geolocation Constants
 * Centralized constants/configuration
 * for current location composable
 */

/**
 * Supported toast variants
 */
type ToastType = "error" | "warning" | "success" | "info";

/**
 * Geolocation error config shape
 */
export type GeolocationErrorConfig = {
  message: string;
  type: ToastType;
};

/**
 * Available geolocation error keys
 */
export type GeolocationErrorKey =
  | "PERMISSION_DENIED"
  | "POSITION_UNAVAILABLE"
  | "TIMEOUT"
  | "UNSUPPORTED_BROWSER"
  | "DEFAULT";

/**
 * Request cooldown duration
 * Prevents spam clicks
 */
export const LOCATION_REQUEST_COOLDOWN_MS = 3_000; // 3 seconds

/**
 * Geolocation request options
 */
export const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 10_000,
  maximumAge: 0, // Prevent cached locations
} as const;

/**
 * Geolocation error messages
 */
export const GEOLOCATION_ERRORS: Record<
  GeolocationErrorKey,
  GeolocationErrorConfig
> = {
  PERMISSION_DENIED: {
    message: "Location access was denied. Please enable location permission.",

    type: "warning",
  },

  POSITION_UNAVAILABLE: {
    message: "Your location is currently unavailable.",

    type: "error",
  },

  TIMEOUT: {
    message: "Location request timed out. Please try again.",

    type: "warning",
  },

  UNSUPPORTED_BROWSER: {
    message: "Your browser does not support location services.",

    type: "error",
  },

  DEFAULT: {
    message: "Unable to retrieve your location.",

    type: "error",
  },
} as const;
