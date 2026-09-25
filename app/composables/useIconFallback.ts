import { shallowRef } from 'vue'

export const useIconFallback = () => {
  const failedIconSources = shallowRef(new Set<string>())

  const normalizeIconSource = (source: unknown) => String(source ?? '')

  const hasIconFailed = (source: unknown) => {
    const normalizedSource = normalizeIconSource(source)
    return normalizedSource !== '' && failedIconSources.value.has(normalizedSource)
  }

  const markIconFailed = (source: unknown) => {
    const normalizedSource = normalizeIconSource(source)
    if (!normalizedSource || failedIconSources.value.has(normalizedSource)) return

    failedIconSources.value = new Set([
      ...failedIconSources.value,
      normalizedSource,
    ])
  }

  const clearIconFailure = (source: unknown) => {
    const normalizedSource = normalizeIconSource(source)
    if (!normalizedSource || !failedIconSources.value.has(normalizedSource)) return

    const nextFailedSources = new Set(failedIconSources.value)
    nextFailedSources.delete(normalizedSource)
    failedIconSources.value = nextFailedSources
  }

  const resetIconFailures = () => {
    failedIconSources.value = new Set()
  }

  return {
    hasIconFailed,
    markIconFailed,
    clearIconFailure,
    resetIconFailures,
  }
}
