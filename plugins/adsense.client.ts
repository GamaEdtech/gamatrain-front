export default defineNuxtPlugin(() => {
  const router = useRouter()

  router.afterEach(() => {
    if (typeof window !== 'undefined' && 'adsbygoogle' in window) {
      // Cast safely to known Google Ads type
      const adsbygoogle = (window as typeof window & {
        adsbygoogle: unknown[]
      }).adsbygoogle

      if (Array.isArray(adsbygoogle)) {
        try {
          adsbygoogle.push({})
        }
        catch (e) {
          console.warn('AdSense auto reload failed:', e)
        }
      }
    }
  })
})
