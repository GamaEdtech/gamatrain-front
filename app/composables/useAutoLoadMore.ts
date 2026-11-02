import { onBeforeUnmount, watch } from 'vue'
import type { Ref } from 'vue'

interface AutoLoadMoreOptions {
  /** True while another page may be loaded now (there is more, nothing is loading, the last load didn't fail). */
  canLoad: () => boolean
  load: () => unknown
  /** How far before the target reaches the screen to start loading. */
  rootMargin?: string
}

/**
 * Loads the next page when `target` (the list's "load more" area) comes near the screen, so a long list keeps
 * going as the reader scrolls. The target's own button stays as the fallback: it still works where this can't run,
 * and after a failed load, which stops the automatic loading until the reader retries.
 */
export const useAutoLoadMore = (target: Ref<HTMLElement | null | undefined>, options: AutoLoadMoreOptions) => {
  let observer: IntersectionObserver | null = null
  let visible = false

  const tryLoad = () => {
    if (visible && options.canLoad()) options.load()
  }

  const stop = () => {
    observer?.disconnect()
    observer = null
    visible = false
  }

  // The target appears and disappears with the list (it is only there while there is more to load).
  watch(target, (element) => {
    stop()
    if (!element || typeof IntersectionObserver === 'undefined') return
    observer = new IntersectionObserver((entries) => {
      visible = entries.some(entry => entry.isIntersecting)
      tryLoad()
    }, { rootMargin: options.rootMargin ?? '0px 0px 800px 0px' })
    observer.observe(element)
  }, { flush: 'post' })

  // A short page can leave the target on screen after a load; keep going while it is.
  watch(() => options.canLoad(), tryLoad, { flush: 'post' })

  onBeforeUnmount(stop)
}
