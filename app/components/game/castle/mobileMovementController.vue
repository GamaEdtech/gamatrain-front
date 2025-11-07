<template>
  <div
    v-if="isMobileOrTablet"
    class="mobile-controls"
  >
    <v-btn
      v-for="(btn, index) in buttons"
      :key="index"
      size="70"
      :icon="btn.icon"
      :color="btn.color"
      class="control-btn"
      density="comfortable"
      :class="btn.class"
      variant="elevated"
      @touchstart.prevent="handleTouchStart(btn.action)"
      @touchend.prevent="handleTouchEnd(btn.action)"
    />
  </div>
</template>

<script setup lang="ts">
const _props = defineProps<{
  isMobileOrTablet: boolean
}>()

// Event emitter for movement controls
const emit = defineEmits<{
  (e: 'moveStart' | 'moveEnd', direction: string): void
}>()

// Movement buttons configuration
const buttons = [
  {
    icon: 'mdi-arrow-up',
    action: 'forward',
    color: '#ffb300',
    class: 'top-btn',
  },
  {
    icon: 'mdi-arrow-left',
    action: 'left',
    color: '#ffb300',
    class: 'left-btn',
  },
  {
    icon: 'mdi-arrow-right',
    action: 'right',
    color: '#ffb300',
    class: 'right-btn',
  },
  {
    icon: 'mdi-arrow-down',
    action: 'backward',
    color: '#ffb300',
    class: 'bottom-btn',
  },
]

// Handle touch start (button press)
const handleTouchStart = (direction: string) => {
  emit('moveStart', direction)
}

// Handle touch end (button release)
const handleTouchEnd = (direction: string) => {
  emit('moveEnd', direction)
}
</script>

<style scoped>
.mobile-controls {
  position: absolute;
  bottom: 8rem;
  left: 20px;
  width: 150px;
  height: 150px;
  z-index: 100;
}

.control-btn {
  position: absolute;
  opacity: 0.8;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
}

.top-btn {
  top: 0;
  left: 50px;
}

.left-btn {
  top: 50px;
  left: 0;
}

.right-btn {
  top: 50px;
  left: 100px;
}

.bottom-btn {
  top: 100px;
  left: 50px;
}
</style>
