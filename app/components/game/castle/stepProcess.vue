<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  step: number
}>()

const step = computed(() => props.step)
const progress = computed(() => ((step.value - 1) / 4) * 100) // درصد پیشرفت
</script>

<template>
  <div class="progress-container">
    <div class="progress-wrapper">
      <v-progress-linear
        :model-value="progress"
        color="#ffb300"
        height="24"
        rounded
        class="progress-bar"
      >
        <template #default>
          <div class="progress-text">
            Steps
          </div>
        </template>
      </v-progress-linear>
    </div>
  </div>
</template>

<style scoped>
.progress-container {
    position: absolute;
    z-index: 100;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
}

.progress-wrapper {
    width: 75%;
    margin: 0 auto;
}

.progress-bar {
    width: 100%;
}

.progress-text {
    text-align: center;
    font-weight: bold;
}
</style>
