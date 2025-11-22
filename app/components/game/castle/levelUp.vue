<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  levelUpModal: boolean
  level: number
}>()

const isModalShow = computed(() => props.levelUpModal)

const emits = defineEmits(['closeLevelUpModal'])

const closeLevelUp = () => {
  emits('closeLevelUpModal')
}
</script>

<template>
  <v-overlay
    v-model="isModalShow"
    class="level-up-overlay"
    scrim="grey-darken-3"
    persistent
  >
    <v-sheet
      color="#ffb300"
      class="level-up-card d-flex flex-column justify-center align-center text-center"
      elevation="12"
      rounded
    >
      <v-icon
        size="80"
        color="white"
        class="bounce-icon mb-4"
      >
        mdi-star
      </v-icon>

      <!-- Level Up Title -->
      <h1 class="text-h3 font-weight-bold text-white level-up-title mb-2">
        Level Up!
      </h1>

      <!-- Level Number -->
      <div class="level-number text-h2 font-weight-bold mb-4">
        Level {{ level }}
      </div>

      <p class="text-subtitle-1 text-white mb-6">
        Congratulations! You have reached a new level 🎉
      </p>

      <v-btn
        color="white"
        class="text-grey-darken-3 font-weight-bold"
        variant="flat"
        size="large"
        @click="closeLevelUp"
      >
        Continue
      </v-btn>
    </v-sheet>
  </v-overlay>
</template>

<style scoped>
.level-up-overlay :deep(.v-overlay__content) {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.level-up-card {
  padding: 40px;
  max-width: 400px;
  width: 90%;
  animation: pop 0.8s ease;
}

.bounce-icon {
  animation: bounce 1.5s infinite;
}

.level-up-title {
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
}

.level-number {
  color: white;
  background-color: rgba(0, 0, 0, 0.2);
  padding: 8px 20px;
  border-radius: 12px;
  animation: pulse 1.2s infinite;
}

/* انیمیشن ها */
@keyframes pop {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }

  60% {
    transform: scale(1.1);
    opacity: 1;
  }

  100% {
    transform: scale(1);
  }
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }
}
</style>
