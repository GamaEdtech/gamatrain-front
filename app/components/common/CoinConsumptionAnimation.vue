<template>
  <div
    v-if="isVisible && internalVisible"
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
            @complete="onAnimationComplete"
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

const emit = defineEmits(['animation-complete'])

const centerLottieRef = ref(null)
const internalVisible = ref(true)

const playSound = (sound) => {
  const audio = new Audio(`/assets/sounds/${sound}.mp3`)
  audio.play().catch((e) => {
    console.warn('Failed to play audio:', e)
  })
}

function startAnimation() {
  if (!props.isVisible) return

  // Reset internal state
  internalVisible.value = true

  // Start animation after DOM update
  nextTick(() => {
    const lottieInstance = centerLottieRef.value?.getDotLottieInstance()
    if (lottieInstance) {
      lottieInstance.play()
    }
  })

  // Fallback timeout in case animation doesn't complete properly
  setTimeout(() => {
    hideAnimation()
    emit('animation-complete')
  }, 3000) // 3 second fallback
}

function onAnimationComplete() {
  // Hide everything immediately when animation completes
  hideAnimation()
  emit('animation-complete')
}

function hideAnimation() {
  internalVisible.value = false
}

// Watch for visibility changes to start animation
watch(
  () => props.isVisible,
  (newValue) => {
    if (newValue) {
      playSound('fail')
      startAnimation()
    }
    else {
      // Reset state when becoming invisible
      internalVisible.value = false
    }
  },
)

// Start animation if already visible on mount
onMounted(() => {
  if (props.isVisible) {
    startAnimation()
  }
})
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
