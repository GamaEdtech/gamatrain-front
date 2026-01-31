<template>
  <v-app>
    <v-container
      class="d-flex flex-column mt-16"
    >
      <error-temp :status-code="error.statusCode as StatusErrorCodeApp ?? 400" />
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
import type { StatusErrorCodeApp } from '@/types/api'

defineProps<{
  error: {
    statusCode?: number
    message?: string
  }
}>()

onMounted(() => {
  setFavicon()
})

const setFavicon = () => {
  const prefersDarkMode
    = window.matchMedia
      && window.matchMedia('(prefers-color-scheme: dark)').matches
  const faviconElement = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
  if (faviconElement) {
    faviconElement.href = prefersDarkMode
      ? '/favicon-dark.ico'
      : '/favicon-light.ico'
  }
}
</script>

<style scoped>

</style>
