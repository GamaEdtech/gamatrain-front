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
            @complete="onAnimationComplete"
          />
        </ClientOnly>
        <div class="coin-multiplier">
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

function startAnimation() {
  if (!props.isVisible) return

  console.log('Starting coin consumption animation - single large coin')

  // Start animation after DOM update
  nextTick(() => {
    console.log('Starting center lottie animation...')
    const lottieInstance = centerLottieRef.value?.getDotLottieInstance()
    console.log('Center lottie instance:', lottieInstance)
    if (lottieInstance) {
      lottieInstance.play()
    }
  })

  // Fallback timeout in case animation doesn't complete properly
  setTimeout(() => {
    console.log('Animation fallback timeout triggered')
    emit('animation-complete')
  }, 3000) // 3 second fallback
}

function onAnimationComplete() {
  console.log('Lottie animation completed!')
  // Small delay before hiding
  setTimeout(() => {
    emit('animation-complete')
  }, 500)
}

// Watch for visibility changes to start animation
watch(() => props.isVisible, (newValue) => {
  console.log('Animation visibility changed to:', newValue)
  if (newValue) {
    startAnimation()
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
  margin-left: 20px;
  font-size: 48px;
  font-weight: bold;
  color: #ffd700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  animation: fadeInScale 0.5s ease-out;
  z-index: 10002;
}

@keyframes fadeInScale {
  0% {
    opacity: 0;
    transform: translateY(-50%) scale(0.5);
  }
  100% {
    opacity: 1;
    transform: translateY(-50%) scale(1);
  }
}
</style>
