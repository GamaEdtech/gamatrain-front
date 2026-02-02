export const useNetwork = () => {
  const isOnline = ref(true)

  if (import.meta.client) {
    isOnline.value = navigator.onLine

    window.addEventListener('online', () => {
      isOnline.value = true
    })

    window.addEventListener('offline', () => {
      isOnline.value = false
    })
  }

  return { isOnline }
}
