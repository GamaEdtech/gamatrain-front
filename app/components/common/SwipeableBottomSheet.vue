<template>
  <div
    ref="sheet"
    class="bottom-nav d-flex flex-column align-center justify-start w-100 rounded-t-xl bg-white position-absolute bottom-0"
  >
    <div
      class="w-100 d-flex align-center justify-center py-4 cursor-pointer"
      @pointerdown="onPointerDown"
    >
      <div class="grab bg-grey400 rounded-pill" />
    </div>

    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  openSheet: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'update:openSheet', value: boolean): void
}>()

const SHEET_CLOSE_RATIO = 0.7
const VELOCITY_THRESHOLD = 0.5 // px/ms
const SNAP_DURATION = 300

const OPEN_Y = 0
const CLOSED_Y = () => window.innerHeight * SHEET_CLOSE_RATIO
const getThreshold = () => CLOSED_Y() / 2

const sheet = ref<HTMLElement | null>(null)
const isOpen = ref(props.openSheet)

let isDragging = false
let dragStartY = 0
let sheetOffsetY = 0

let lastPointerY = 0
let lastTime = 0
let pointerVelocityY = 0

const clampTranslateY = (y: number) =>
  Math.max(OPEN_Y, Math.min(CLOSED_Y(), y))

const getTranslateY = () => {
  if (!sheet.value) return 0
  const matrix = new DOMMatrix(
    getComputedStyle(sheet.value).transform,
  )
  return matrix.m42
}

const updateVelocity = (e: PointerEvent) => {
  const now = performance.now()
  const dy = e.clientY - lastPointerY
  const dt = now - lastTime

  pointerVelocityY = dy / dt
  lastPointerY = e.clientY
  lastTime = now
}

const resolveFinalState = (y: number) => {
  if (pointerVelocityY > VELOCITY_THRESHOLD) return false
  if (pointerVelocityY < -VELOCITY_THRESHOLD) return true
  return y <= getThreshold()
}

const runSnapAnimation = (targetY: number) => {
  if (!sheet.value) return

  sheet.value.style.transition
    = `transform ${SNAP_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1)`

  sheet.value.style.transform
    = `translate3d(0, ${targetY}px, 0)`

  setTimeout(() => {
    if (sheet.value) sheet.value.style.transition = ''
  }, SNAP_DURATION)
}

const setSheetState = (open: boolean) => {
  if (isOpen.value !== open) {
    isOpen.value = open
    emit('update:openSheet', open)
  }

  sheetOffsetY = open ? OPEN_Y : CLOSED_Y()
  runSnapAnimation(sheetOffsetY)
}

const onPointerDown = (e: PointerEvent) => {
  isDragging = true
  dragStartY = e.clientY

  lastPointerY = e.clientY
  lastTime = performance.now()
}

const onPointerMove = (e: PointerEvent) => {
  if (!isDragging || !sheet.value) return

  updateVelocity(e)

  const delta = e.clientY - dragStartY
  const nextY = clampTranslateY(sheetOffsetY + delta)

  sheet.value.style.transform
    = `translate3d(0, ${nextY}px, 0)`
}

const onPointerUp = () => {
  if (!isDragging) return
  isDragging = false

  const y = getTranslateY()
  setSheetState(resolveFinalState(y))
}

onMounted(() => {
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
})

onUnmounted(() => {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
})
</script>

<style>
.bottom-nav {
  min-height: 90%;
  max-height: 90%;
  transform: translate3d(0, 0, 0);
  will-change: transform;
  touch-action: none;
  z-index: 2;
}

.grab {
  width: 100px;
  height: 10px;
}
</style>
