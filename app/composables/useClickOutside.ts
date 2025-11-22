import { onMounted, onUnmounted } from 'vue'

export function useClickOutside(
  elementRef: Ref<HTMLElement | HTMLElement[] | null | undefined>,
  callback: () => void,
) {
  const handler = (event: MouseEvent) => {
    const target = event.target as Node

    if (Array.isArray(elementRef.value)) {
      const isInside = elementRef.value.some(el => el?.contains(target))
      if (!isInside) {
        callback()
      }
    }
    else if (elementRef.value?.contains) {
      if (!elementRef.value.contains(target)) {
        callback()
      }
    }
  }

  onMounted(() => {
    document.addEventListener('click', handler)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handler)
  })
}
