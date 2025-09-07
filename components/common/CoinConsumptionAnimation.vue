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
        <div
          v-if="showMultiplier"
          class="coin-multiplier"
        >
          -{{ coinCount }}
        </div>
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
  coinCount: {
    type: Number,
    default: 5,
  },
})

const emit = defineEmits(['animation-complete'])

const centerLottieRef = ref(null)
const internalVisible = ref(true)
const showMultiplier = ref(true)

function startAnimation() {
  if (!props.isVisible) return

  // Reset internal state
  internalVisible.value = true
  showMultiplier.value = true

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
  showMultiplier.value = false
  internalVisible.value = false
}

// Watch for visibility changes to start animation
watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    startAnimation()
  }
  else {
    // Reset state when becoming invisible
    internalVisible.value = false
    showMultiplier.value = false
  }
})

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

.coin-multiplier {
  position: absolute;
  top: 50%;
  left: 100%;
  transform: translateY(-50%);
  font-size: 38px;
  font-weight: bold;
  color: #ffd700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  animation: fadeInScale 1.5s ease-out forwards;
  z-index: 10002;
}

@keyframes fadeInScale {
  0% {
    opacity: 1;
    padding: 1rem;
    transform: translateY(-50%) scale(1);
    background-color: #5c4f04;
    border-radius: 50%;
  }
  70% {
    opacity: 1;
    transform: translateY(-50%) scale(1.1);
    background-color: #5c4f04;
  }
  100% {
    opacity: 0;
    padding: auto;
    transform: translateY(-50%) scale(0.1);
    background-color: #998304;
    border-radius: 50%;
  }
}
</style>
