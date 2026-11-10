import { distanceInMeters } from '@/utils/geoDistance'

export interface SchoolHome {
  lat: number
  lng: number
  label: string
}

const STORAGE_KEY = 'gama-school-home'

// Straight-line distance is shorter than the road; these turn it into a fair estimate of the trip.
const ROUTE_FACTOR = 1.3
const WALK_METERS_PER_MINUTE = 80
const DRIVE_METERS_PER_MINUTE = 400
const DRIVE_START_MINUTES = 2
// Beyond these, a walk or a drive time is meaningless ("1,233 h walk"): only the distance is shown.
const MAX_WALK_METERS = 6000
const MAX_DRIVE_METERS = 300000

const formatMinutes = (minutes: number) => {
  const rounded = Math.max(1, Math.round(minutes))
  if (rounded < 60) return `${rounded} min`
  const hours = Math.floor(rounded / 60)
  const rest = rounded % 60
  return rest ? `${hours} h ${rest} min` : `${hours} h`
}

export const formatSchoolDistance = (meters: number) =>
  meters < 1000 ? `${Math.round(meters / 10) * 10} m` : `${(meters / 1000).toFixed(meters < 10000 ? 1 : 0)} km`

/**
 * The visitor's home point, from which the school finder shows each school's distance and trip time. Only kept in this
 * browser (localStorage), never sent to the server except as the centre of a "near my home" search.
 */
export const useSchoolHome = () => {
  const home = useState<SchoolHome | null>('school-home', () => null)
  const loaded = useState('school-home-loaded', () => false)

  if (import.meta.client && !loaded.value) {
    onNuxtReady(() => {
      if (loaded.value) return
      loaded.value = true
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
        if (saved && Number.isFinite(saved.lat) && Number.isFinite(saved.lng)) home.value = saved
      }
      catch {
        // Storage blocked or corrupt: no home yet.
      }
    })
  }

  const setHome = (value: SchoolHome | null) => {
    home.value = value
    try {
      if (value) localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
      else localStorage.removeItem(STORAGE_KEY)
    }
    catch {
      // Private mode: kept for this visit only.
    }
  }

  /** Distance and trip estimates from home, or null without a home or a school position. */
  const tripFromHome = (lat?: number | null, lng?: number | null) => {
    if (!home.value || lat == null || lng == null) return null
    const meters = distanceInMeters(home.value, { lat, lng })
    const road = meters * ROUTE_FACTOR
    const distance = formatSchoolDistance(meters)
    const walk = road <= MAX_WALK_METERS ? formatMinutes(road / WALK_METERS_PER_MINUTE) : ''
    const drive = road <= MAX_DRIVE_METERS ? formatMinutes((road / DRIVE_METERS_PER_MINUTE) + DRIVE_START_MINUTES) : ''
    return {
      meters,
      distance,
      walk,
      drive,
      /** One line: "1.6 km from home · 26 min walk · 7 min drive", the times only where they make sense. */
      summary: [`${distance} from home`, walk && `${walk} walk`, drive && `${drive} drive`].filter(Boolean).join(' · '),
    }
  }

  return { home, setHome, tripFromHome }
}
