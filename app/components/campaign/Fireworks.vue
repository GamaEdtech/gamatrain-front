<template>
  <canvas
    ref="canvas"
    class="campaign-canvas"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
// New Year fireworks in the hero: a burst every couple of seconds, and one wherever the sky is tapped (the parent
// counts them). Fewer sparks on phones.
const emit = defineEmits<{ launch: [] }>()

interface Spark { x: number, y: number, vx: number, vy: number, life: number, color: string }

const COLORS = ['#FFB300', '#5EEAD4', '#FF7AB6', '#A78BFA', '#FFFFFF']
const canvas = ref<HTMLCanvasElement | null>(null)
let sparks: Spark[] = []
let size = { width: 0, height: 0 }
let untilNext = 0.6

const burst = (x: number, y: number) => {
  const color = COLORS[Math.floor(Math.random() * COLORS.length)]!
  const count = size.width < 600 ? 18 : 28
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2
    const speed = 70 + Math.random() * 90
    sparks.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, color })
  }
  // A cap, in case someone taps very fast.
  if (sparks.length > 400) sparks = sparks.slice(-400)
}

useCampaignCanvas(canvas, {
  resize: (width, height) => {
    size = { width, height }
  },
  frame: (ctx, dt, width, height) => {
    untilNext -= dt
    if (untilNext <= 0) {
      untilNext = 1.4 + Math.random() * 1.2
      burst(width * (0.1 + Math.random() * 0.8), height * (0.1 + Math.random() * 0.35))
    }
    sparks = sparks.filter(s => s.life > 0)
    for (const spark of sparks) {
      spark.life -= dt / 1.3
      spark.vy += 60 * dt
      spark.vx *= 1 - dt * 1.2
      spark.vy *= 1 - dt * 1.2
      spark.x += spark.vx * dt
      spark.y += spark.vy * dt
      ctx.globalAlpha = Math.max(0, spark.life)
      ctx.fillStyle = spark.color
      ctx.beginPath()
      ctx.arc(spark.x, spark.y, 2, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1
  },
  tap: (x, y) => {
    burst(x, y)
    emit('launch')
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
