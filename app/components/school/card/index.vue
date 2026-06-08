<template>
  <div
    class="card-wrapper"
    :class="{
      'nearest-school-highlight': highlightNearest,
    }"
  >
    <div class="w-100 d-none d-md-flex justify-center">
      <school-card-desktop :school="school" />
    </div>
    <div class="w-100 d-flex justify-center d-md-none">
      <school-card-mobile :school="school" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  school: {
    type: Object,
  },
  highlightNearest: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
.card-wrapper {
  width: fit-content;
}
@media (min-width: 960px) {
  .card-wrapper {
    width: 100%;
  }
}

.nearest-school-highlight {
  position: relative;
  border-radius: 8px;
  animation: nearest-school-pulse 2s;
}

.nearest-school-highlight::before {
  content: '';
  position: absolute;
  inset: -3px;
  border: 1px solid #ffb300;
  border-radius: 8px;
  pointer-events: none;
}

@keyframes nearest-school-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 179, 0, 0.7);
  }

  70% {
    box-shadow: 0 0 0 20px rgba(76, 175, 80, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
  }
}
</style>
