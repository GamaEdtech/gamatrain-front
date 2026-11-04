import type { SchoolListDTO } from '@/types'

/** What the school list cards show: only what the school has, so nothing on a card looks like a dead button. */
export const useSchoolCard = (school: MaybeRefOrGetter<SchoolListDTO | undefined>) => {
  // A photo that fails to load is dropped, so the card falls back to its compact shape instead of a blank box.
  const photoFailed = ref(false)
  const photo = computed(() =>
    photoFailed.value ? '' : toValue(school)?.defaultImageUri?.replace(/^http:\/\//, 'https://') || '')
  const onPhotoError = () => {
    photoFailed.value = true
  }
  // The map's school popup reuses one card for each school it shows.
  watch(() => toValue(school)?.id, () => {
    photoFailed.value = false
  })

  const locationLine = computed(() => {
    const s = toValue(school)
    return s ? [s.cityTitle, s.stateTitle, s.countryTitle].filter(Boolean).join(', ') : ''
  })

  const rating = computed(() => {
    const value = toValue(school)?.rating
    return value ? value.toFixed(1) : ''
  })

  const distance = computed(() => {
    const value = toValue(school)?.distance
    if (!value) return ''
    return value < 1000 ? `${Math.round(value)} m` : `${(value / 1000).toFixed(1)} km`
  })

  // Shown as icons, not buttons: the whole card opens the school, where these details are.
  const contacts = computed(() => {
    const s = toValue(school)
    if (!s) return []
    return [
      s.hasLocation && { icon: 'md:location_on', label: 'Has a map location' },
      s.hasPhone && { icon: 'md:call', label: 'Has a phone number' },
      s.hasEmail && { icon: 'md:mail', label: 'Has an email' },
      s.hasWebsite && { icon: 'md:language', label: 'Has a website' },
    ].filter((item): item is { icon: string, label: string } => !!item)
  })

  return { photo, onPhotoError, locationLine, rating, distance, contacts }
}
