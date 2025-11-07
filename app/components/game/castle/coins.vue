<template>
  <div class="coins">
    <div class="main">
      <img
        ref="coin"
        src="../../../assets/icons/coin.svg"
        alt="coin"
      >
      <h2>{{ coins }}</h2>
    </div>
    <Transition name="slide-fade">
      <div
        v-if="notificationShow"
        class="counter"
      >
        <h2>+{{ reward }}</h2>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  coins: number
  reward: number | undefined
  isChestOpen: boolean
}>()

const isChestOpen = computed<boolean>(() => props.isChestOpen)
const notificationShow = ref<boolean>(false)
watch(isChestOpen, () => {
  notificationShow.value = true

  setTimeout(() => {
    notificationShow.value = false
  }, 3000)
})
</script>

<style scoped>
.coins {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    gap: 3rem;
}

.main{
    margin-top: 0;
    display: flex;
    align-items: center;
}

.coins img{
    object-fit: contain;
    width: 77px;
    height: 77px;
}

.coins .main h2{
    color: #FFB231;
}

.coins .counter h2 {
    color: #56472f
}

.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateY(-20px);
    opacity: 0;
}
</style>
