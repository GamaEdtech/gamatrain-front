<template>
  <v-snackbar
    v-model="isVisible"
    :color="$snackbar.color"
    :timeout="$snackbar.timeout"
    location="top"
  >
    <span class="text-h6 text-sm-h5 font-weight-bold">
      {{ $snackbar.text }}</span>
    <template #actions>
      <v-btn
        variant="text"
        icon="md:close"
        @click="isVisible = false"
      />
    </template>
  </v-snackbar>
</template>

<script setup>
import { computed } from 'vue'

const { $snackbar } = useNuxtApp()

// Create a computed property for the snackbar visibility
const isVisible = computed({
  get: () => $snackbar.show,
  set: (value) => {
    $snackbar.show = value
  },
})
</script>
