<template>
  <Transition name="coin-fade">
    <div
      v-if="showCoin"
      ref="coinEl"
      class="random-coin"
      :class="{ 'coin-clicked': isClicked }"
      :style="{
        position: 'absolute',
        left: coinPosition.x + 'px',
        top: coinPosition.y + 'px',
        zIndex: 9999,
        pointerEvents: 'auto',
        cursor: 'pointer',
        transition: isClicked ? 'all 0.5s ease' : 'none',
      }"
      @click="handleCoinClick"
    >
      <ClientOnly>
        <DotLottieVue
          ref="lottieRef"
          loop
          :style="{
            width: isClicked ? '120px' : '40px',
            height: isClicked ? '120px' : '40px',
          }"
          src="/static/data.json"
        />
      </ClientOnly>
    </div>
  </Transition>
</template>

<script setup>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import successSound from '@/assets/sounds/success.mp3'

const route = useRoute()

const coinPosition = ref({ x: 0, y: 0 })
const showCoin = ref(false)
const isClicked = ref(false)

const lottieRef = ref(null)
const coinEl = ref(null)

let scrollHandler = null

function setInitialFrame() {
  const inst = lottieRef.value?.getDotLottieInstance()
  if (inst && inst.isLoaded) {
    inst.setFrame(19)
    inst.pause()
  }
  else {
    setTimeout(setInitialFrame, 50)
  }
}

function checkCoinVisibility() {
  if (!coinEl.value) return
  const rect = coinEl.value.getBoundingClientRect()

  const viewportHeight = window.innerHeight
  const margin = 200 // distance in px before it's considered "near"

  const inView = rect.top < viewportHeight + margin && rect.bottom > -margin

  if (inView) {
    lottieRef.value?.getDotLottieInstance()?.play()
  }
}

function generateRandomPosition() {
  if (typeof window === 'undefined') return { x: 0, y: 0 } // SSR fallback

  const documentWidth = document.documentElement.scrollWidth
  const documentHeight = document.documentElement.scrollHeight
  const coinSize = 40

  const x = Math.random() * (documentWidth - coinSize)
  const y = Math.random() * (documentHeight - coinSize)

  return { x, y }
}

function playSound(sound) {
  const audio = new Audio(sound)
  audio.play().catch(e => console.warn('Failed to play audio:', e))
}

function handleCoinClick() {
  if (isClicked.value) return

  isClicked.value = true

  nextTick(() => {
    lottieRef.value?.getDotLottieInstance()?.resize()
    lottieRef.value?.getDotLottieInstance()?.play()
  })
  playSound(successSound)

  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const scrollX = window.pageXOffset || document.documentElement.scrollLeft
  const scrollY = window.pageYOffset || document.documentElement.scrollTop

  coinPosition.value = {
    x: scrollX + (viewportWidth - 120) / 2,
    y: scrollY + (viewportHeight - 120) / 2,
  }

  setTimeout(() => {
    showCoin.value = false
    isClicked.value = false
  }, 2000)
}

const showCoinWithAnimation = async () => {
  await nextTick(() => {
    coinPosition.value = generateRandomPosition()
    showCoin.value = true
    isClicked.value = false
  })
}

watch(
  () => route.path,
  () => {
    setTimeout(() => {
      showCoinWithAnimation()
    }, 1000)
  },
  { immediate: true },
)

watch(showCoin, async (visible) => {
  if (visible) {
    await nextTick()
    setInitialFrame()
    scrollHandler = () => checkCoinVisibility()
    window.addEventListener('scroll', scrollHandler, { passive: true })
    checkCoinVisibility()
  }
  else {
    if (scrollHandler) {
      window.removeEventListener('scroll', scrollHandler)
      scrollHandler = null
    }
  }
})

onBeforeUnmount(() => {
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler)
  }
})
</script>

<style scoped>
.coin-fade-enter-active,
.coin-fade-leave-active {
  transition: all 0.5s ease;
}

.coin-fade-enter-from {
  opacity: 0;
  transform: scale(0.5) rotate(-180deg);
}

.coin-fade-leave-to {
  opacity: 0;
  transform: scale(0.5) rotate(180deg);
}

.coin-fade-enter-to,
.coin-fade-leave-from {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}

.coin-clicked {
  transform: scale(3) !important;
  transition: all 0.5s ease !important;
}
</style>
