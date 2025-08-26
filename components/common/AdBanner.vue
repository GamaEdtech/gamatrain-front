<template>
  <div>
    <ins
      :data-adtest="isDev ? `on` : `off`"
      class="adsbygoogle"
      :style="style"
      :data-ad-client="adClient"
      :data-ad-slot="adslot"
      :data-ad-format="format"
      :data-full-width-responsive="responsive.toString()"
    />
  </div>
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
const isAdsLoad = defineModel({ type: Boolean, default: false })
const config = useRuntimeConfig()
const adClient = config.public.GOOGLE_ADSENSE
const isDev = import.meta.dev

const loadAdsenseScript = () => {
  if (document.getElementById('adsbygoogle-js')) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.id = 'adsbygoogle-js'
    s.async = true
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`
    s.crossOrigin = 'anonymous'
    s.onload = () => resolve(true)
    s.onerror = () => reject(new Error('AdSense script failed to load'))
    document.head.appendChild(s)
  })
}

const observeAdFill = (adsElement) => {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.attributeName === 'data-ad-status') {
        const status = adsElement.getAttribute('data-ad-status')
        if (status === 'filled') {
          isAdsLoad.value = true
          console.log('Ad filled successfully.')
        }
        else if (status === 'unfilled') {
          isAdsLoad.value = false
          console.warn('Ad unfilled.')
        }
        observer.disconnect()
      }
    }
  })
  observer.observe(adsElement, { attributes: true })
}

onMounted(async () => {
  if (import.meta.client) {
    const adsElement = document.querySelector('.adsbygoogle')
    if (!adsElement) {
      console.error('AdSense <ins> element not found.')
      isAdsLoad.value = false
      return
    }
    try {
      await loadAdsenseScript()
      observeAdFill(adsElement);
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    }
    catch (e) {
      console.error('Error loading or running AdSense:', e)
      isAdsLoad.value = false
    }
  }
  else {
    console.warn('not in client')
    isAdsLoad.value = false
  }
})
</script>
