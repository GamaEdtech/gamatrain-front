<template>
  <v-btn
    v-if="isMapMode"
    icon
    class="near-me-button position-absolute"
    :loading="isLoading || dataLoading"
    :disabled="isLoading"
    @click="emit('updateFilter')"
  >
    <ClientOnly>
      <DotLottieVue
        src="/images/near-me-gps-dark.json"
        autoplay
        loop
      />
    </ClientOnly>
  </v-btn>
</template>

<script setup lang="ts">
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'

interface Props {
  isMapMode?: boolean
  dataLoading?: boolean
}

withDefaults(defineProps<Props>(), {
  isMapMode: false,
  dataLoading: false,
})

const emit = defineEmits<{
  updateFilter: []
}>()

const { isLoading } = useCurrentLocation()
</script>

<style scoped lang="scss">
@import '../../../assets/scss/mixin.scss';

.near-me-button {
    z-index: 401;
    right: 20px;
    bottom: 150px;

    @include main-size-xl {
        right: 40px;
        bottom: 50px;
    }
}
</style>
