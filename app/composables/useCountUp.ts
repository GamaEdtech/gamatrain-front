type CountValue = number | string | null

const DURATION_MS = 900
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3

/**
 * Counts each numeric value in the list up (or down) to its new value whenever the source changes.
 * Other values, such as null (still loading) or '—', are shown as they are.
 */
export const useCountUp = (source: () => CountValue[]) => {
  const display = ref<CountValue[]>(source())
  let frame = 0

  watch(source, (next) => {
    cancelAnimationFrame(frame)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      display.value = next
      return
    }

    const from = display.value.map(value => (typeof value === 'number' ? value : 0))
    const start = performance.now()
    const tick = (now: number) => {
      const eased = easeOutCubic(Math.min((now - start) / DURATION_MS, 1))
      display.value = next.map((to, i) =>
        typeof to === 'number' ? Math.round(from[i]! + (to - from[i]!) * eased) : to,
      )
      if (eased < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
  })

  onBeforeUnmount(() => cancelAnimationFrame(frame))

  return display
}
