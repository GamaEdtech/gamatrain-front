<template>
  <v-btn
    v-if="isMapMode"
    icon
    class="near-me-button position-absolute"
    :loading="loading"
    @click="emit('updateFilter')"
  >
    <school-near-me-location-icon size="27" />
  </v-btn>
</template>

<script setup lang="ts">
interface IFab {
  isMapMode?: boolean
  loading?: boolean
}

withDefaults(defineProps<IFab>(), {
  isMapMode: false,
  loading: false,
})

const emit = defineEmits<{
  updateFilter: []
}>()
</script>

<style scoped>
.near-me-button {
    z-index: 401;
    right: 20px;
    bottom: 150px;

    @media (min-width: 1280px) {
        right: 40px;
        bottom: 50px;
    }
}
</style>
