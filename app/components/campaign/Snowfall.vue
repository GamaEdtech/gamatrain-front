<template>
  <canvas
    ref="canvas"
    class="campaign-canvas"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
// Christmas snow in the hero. Tapping a flake pops it (it falls again from the top a moment later); the parent counts
// the pops. Fewer flakes on phones.
const emit = defineEmits<{ pop: [] }>()

interface Flake { x: number, y: number, r: number, vy: number, drift: number, phase: number, pop: number }

const canvas = ref<HTMLCanvasElement | null>(null)
let flakes: Flake[] = []

const spawn = (width: number, height: number, anywhere: boolean): Flake => ({
  x: Math.random() * width,
  y: anywhere ? Math.random() * height : -10,
  r: 1.5 + Math.random() * 2.5,
  vy: 25 + Math.random() * 45,
  drift: 8 + Math.random() * 18,
  phase: Math.random() * Math.PI * 2,
  pop: 0,
})

useCampaignCanvas(canvas, {
  resize: (width, height) => {
    const count = width < 600 ? 20 : 40
    flakes = Array.from({ length: count }, () => spawn(width, height, true))
  },
  frame: (ctx, dt, width, height) => {
    for (let i = 0; i < flakes.length; i++) {
      const flake = flakes[i]!
      if (flake.pop > 0) {
        // A popped flake: a ring that grows and fades, then a new flake from the top.
        flake.pop += dt
        const t = flake.pop / 0.35
        if (t >= 1) {
          flakes[i] = spawn(width, height, false)
          continue
        }
        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - t})`
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(flake.x, flake.y, flake.r + t * 12, 0, Math.PI * 2)
        ctx.stroke()
        continue
      }
      flake.phase += dt
      flake.y += flake.vy * dt
      flake.x += Math.sin(flake.phase) * flake.drift * dt
      if (flake.y > height + 10) flakes[i] = spawn(width, height, false)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
      ctx.beginPath()
      ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2)
      ctx.fill()
    }
  },
  tap: (x, y) => {
    // Small and moving: a generous hit area.
    const hit = flakes.find(f => f.pop === 0 && (f.x - x) ** 2 + (f.y - y) ** 2 < (f.r + 16) ** 2)
    if (hit) {
      hit.pop = 0.0001
      emit('pop')
    }
  },
})
</script>

<style scoped>
.campaign-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
