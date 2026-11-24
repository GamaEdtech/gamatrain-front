import type { Ref } from 'vue'

interface CampaignCanvasOptions {
  /** Draws one frame: `dt` in seconds since the last one, sizes in CSS pixels. */
  frame: (ctx: CanvasRenderingContext2D, dt: number, width: number, height: number) => void
  /** Called when the canvas is resized (and once at start), to place things. */
  resize?: (width: number, height: number) => void
  /** A tap on the area the canvas covers, in CSS pixels, that didn't land on a link, button or field. */
  tap?: (x: number, y: number) => void
}

const INTERACTIVE = 'a, button, input, textarea, select, label, [role="button"], [role="combobox"], .v-field, .v-btn'

/**
 * A decorative canvas for a campaign effect (snow, fireworks), kept cheap: nothing runs for visitors who ask for
 * reduced motion, it draws only while on screen and the tab is visible, it is capped at 2x pixel density, and it never
 * takes clicks: taps are read from its parent and skipped when they land on something interactive.
 */
export const useCampaignCanvas = (canvas: Ref<HTMLCanvasElement | null>, options: CampaignCanvasOptions) => {
  const enabled = ref(false)
  let ctx: CanvasRenderingContext2D | null = null
  let raf = 0
  let last = 0
  let width = 0
  let height = 0
  let onScreen = true
  let resizeObserver: ResizeObserver | undefined
  let intersectionObserver: IntersectionObserver | undefined
  let host: HTMLElement | null = null

  const running = () => onScreen && document.visibilityState === 'visible'

  const loop = (time: number) => {
    raf = 0
    if (!ctx || !running()) return
    const dt = last ? Math.min((time - last) / 1000, 0.05) : 0
    last = time
    ctx.clearRect(0, 0, width, height)
    options.frame(ctx, dt, width, height)
    raf = requestAnimationFrame(loop)
  }

  const start = () => {
    if (!raf && ctx && running()) {
      last = 0
      raf = requestAnimationFrame(loop)
    }
  }

  const stop = () => {
    if (raf) cancelAnimationFrame(raf)
    raf = 0
  }

  const fit = () => {
    const element = canvas.value
    if (!element || !ctx) return
    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    width = element.clientWidth
    height = element.clientHeight
    element.width = Math.round(width * ratio)
    element.height = Math.round(height * ratio)
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    options.resize?.(width, height)
  }

  const onPointerDown = (event: PointerEvent) => {
    const element = canvas.value
    if (!element || !options.tap || (event.target as Element | null)?.closest(INTERACTIVE)) return
    const rect = element.getBoundingClientRect()
    options.tap(event.clientX - rect.left, event.clientY - rect.top)
  }

  const onVisibility = () => (running() ? start() : stop())

  onMounted(() => {
    const element = canvas.value
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    ctx = element.getContext('2d')
    if (!ctx) return
    enabled.value = true
    host = element.parentElement
    fit()
    resizeObserver = new ResizeObserver(fit)
    resizeObserver.observe(element)
    intersectionObserver = new IntersectionObserver(([entry]) => {
      onScreen = entry?.isIntersecting ?? true
      onVisibility()
    })
    intersectionObserver.observe(element)
    document.addEventListener('visibilitychange', onVisibility)
    host?.addEventListener('pointerdown', onPointerDown, { passive: true })
    start()
  })

  onBeforeUnmount(() => {
    stop()
    resizeObserver?.disconnect()
    intersectionObserver?.disconnect()
    document.removeEventListener('visibilitychange', onVisibility)
    host?.removeEventListener('pointerdown', onPointerDown)
  })

  return { enabled }
}
