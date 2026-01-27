<template>
  <div
    v-if="isVisible"
    class="coin-consumption-overlay"
  >
    <div class="coin-consumption-container">
      <div class="center-coin">
        <ClientOnly>
          <DotLottieVue
            ref="centerLottieRef"
            src="/static/coins/lose.json"
            autoplay
            :loop="false"
            :style="{
              width: '500px',
              height: '500px',
            }"
          />
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script setup>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:isVisible', 'animation-complete'])

const centerLottieRef = ref(null)

const playSound = (sound) => {
  const audio = new Audio(`/assets/sounds/${sound}.mp3`)
  audio.play().catch((e) => {
    console.warn('Failed to play audio:', e)
  })
}

const startAnimation = () => {
  const lottieInstance = centerLottieRef.value?.getDotLottieInstance()
  if (lottieInstance) {
    lottieInstance.play()
  }

  setTimeout(() => {
    emit('animation-complete')
    emit('update:isVisible', false)
  }, 2000)
}

watch(
  () => props.isVisible,
  (newValue) => {
    if (newValue) {
      playSound('fail')
      startAnimation()
    }
  },
)
</script>

<style scoped>
.coin-consumption-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 10000;
  pointer-events: none;
}

.coin-consumption-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.center-coin {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 10001;
}
</style>
