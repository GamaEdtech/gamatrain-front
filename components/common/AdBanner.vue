<template>
  <ins
    :data-adtest="isDev ? `on` : `off`"
    class="adsbygoogle"
    :style="style"
    :data-ad-client="adClient"
    :data-ad-slot="adslot"
    :data-ad-format="format"
    :data-full-width-responsive="responsive.toString()"
  />
</template>

<script setup>
defineProps({
  adslot: {
    type: String,
    required: true,
  },
  format: {
    type: String,
    default: 'auto',
  },
  responsive: {
    type: Boolean,
    default: true,
  },
  style: {
    type: String,
    default: 'display:block',
  },
})

const isAdsLoad = defineModel()

const config = useRuntimeConfig()
const adClient = config.public.GOOGLE_ADSENSE
const isDev = import.meta.dev

onMounted(() => {
  if (import.meta.client) {
    if (typeof window !== 'undefined' && 'adsbygoogle' in window) {
      const adsElement = document.querySelector('.adsbygoogle')

      if (adsElement) {
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.attributeName === 'data-ad-status') {
              const status = adsElement.getAttribute('data-ad-status')

              if (status === 'filled') {
                isAdsLoad.value = true
              }
              else if (status === 'unfilled') {
                isAdsLoad.value = false
              }
              observer.disconnect()
            }
          })
        })

        observer.observe(adsElement, {
          attributes: true,
        })
      }
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      }
      catch (e) {
        console.log('AdSense error:', e)
        isAdsLoad.value = false
      }
    }
    else {
      isAdsLoad.value = false
    }
  }
})
</script>
