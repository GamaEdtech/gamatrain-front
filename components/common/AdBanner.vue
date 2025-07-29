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

const config = useRuntimeConfig()
const adClient = config.public.GOOGLE_ADSENSE

onMounted(() => {
  if (import.meta.client) {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    }
    catch (e) {
      console.error('AdSense error:', e)
    }
  }
})
</script>

<template>
  <ins
    class="adsbygoogle"
    :style="style"
    :data-ad-client="adClient"
    :data-ad-slot="adslot"
    :data-ad-format="format"
    :data-full-width-responsive="responsive.toString()"
  />
</template>
