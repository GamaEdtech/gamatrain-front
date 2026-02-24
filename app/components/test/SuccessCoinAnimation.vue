<template>
  <div
    :style="coinStyles"
  >
    <ClientOnly>
      <DotLottieVue
        :style="{
          width: `120px`,
          height: `120px`,
        }"
        autoplay
        loop
        src="/static/coins/gold.json"
      />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import type { CSSProperties } from 'vue'

interface ISuccessCoinAnimation {
  isStartAnimation: boolean
}

const props = defineProps<ISuccessCoinAnimation>()
const emit = defineEmits(['completeSuccessAnimation'])

const SMALL_SIZE_COIN = 40
const BIG_SIZE_COIN = 120
const coinStyles = ref<CSSProperties>({
  position: 'fixed',
  left: '100px',
  top: '100px',
  zIndex: 999,
  pointerEvents: 'auto',
  cursor: 'pointer',
  transition: 'none',
  opacity: 0,
  scale: 1,
})

const setInitialPositionCoin = () => {
  coinStyles.value.top = `${
    window.innerHeight / 2
    - BIG_SIZE_COIN / 2
  }px`
  coinStyles.value.left = `${
    window.innerWidth / 2
    - BIG_SIZE_COIN / 2
  }px`
}
const animationSuccessCoin = () => {
  coinStyles.value.scale = SMALL_SIZE_COIN / BIG_SIZE_COIN
  coinStyles.value.opacity = 1

  setTimeout(() => {
    coinStyles.value.transition = 'all 1s ease'
    coinStyles.value.scale = 1
  }, 500)
}
const animationFadeOutCoin = () => {
  coinStyles.value.transition = 'none'
  coinStyles.value.opacity = 0
  coinStyles.value.scale = SMALL_SIZE_COIN / BIG_SIZE_COIN
  emit('completeSuccessAnimation')
}

const playSound = (sound: string) => {
  const audio = new Audio(`/assets/sounds/${sound}.mp3`)
  audio.play().catch((e) => {
    console.warn('Failed to play audio:', e)
  })
}

const startAnimation = () => {
  animationSuccessCoin()
  playSound('success')
  setTimeout(() => {
    animationFadeOutCoin()
  }, 2500)
}

watch(() => props.isStartAnimation, () => {
  if (props.isStartAnimation) {
    setInitialPositionCoin()
    startAnimation()
  }
})
</script>

<style scoped>
</style>
