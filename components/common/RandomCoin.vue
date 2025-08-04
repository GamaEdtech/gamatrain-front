<template>
  <Transition name="coin-fade">
    <div
      v-if="showCoin"
      class="random-coin"
      :class="{ 'coin-clicked': isClicked }"
      :style="{
        position: 'absolute',
        left: coinPosition.x + 'px',
        top: coinPosition.y + 'px',
        width: isClicked ? '120px' : '40px',
        height: isClicked ? '120px' : '40px',
        zIndex: 9999,
        pointerEvents: 'auto',
        cursor: 'pointer',
        transition: isClicked ? 'all 0.5s ease' : 'none',
      }"
      @click="handleCoinClick"
    >
      <img
        src="/images/random-coin.png"
        alt="Coin"
        style="width: 100%; height: 100%; object-fit: contain"
      >
    </div>
  </Transition>
</template>

<script setup>
import successSound from '@/assets/sounds/success.mp3'

const route = useRoute()
const coinPosition = ref({ x: 0, y: 0 })
const showCoin = ref(false)
const isClicked = ref(false)

const generateRandomPosition = () => {
  const documentWidth = document.documentElement.scrollWidth
  const documentHeight = document.documentElement.scrollHeight
  const coinSize = 40

  const x = Math.random() * (documentWidth - coinSize)
  const y = Math.random() * (documentHeight - coinSize)

  return { x, y }
}

const playSound = (sound) => {
  const audio = new Audio(sound)
  audio.play().catch((e) => {
    console.warn('Failed to play audio:', e)
  })
}

const handleCoinClick = () => {
  if (isClicked.value) return
  isClicked.value = true
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
  }, 1000)
}

const showCoinWithAnimation = () => {
  coinPosition.value = generateRandomPosition()
  showCoin.value = true
  isClicked.value = false
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

onMounted(() => {})
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
