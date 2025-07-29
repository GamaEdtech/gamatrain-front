<template>
  <v-snackbar
    v-model="isVisible"
    :color="$snackbar.color"
    :timeout="$snackbar.timeout"
    location="top"
  >
    {{ $snackbar.text }}
    <template #actions>
      <v-btn
        variant="text"
        icon="mdi-close"
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
