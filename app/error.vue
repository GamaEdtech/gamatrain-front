<template>
  <v-app>
    <v-container
      class="d-flex flex-column mt-16"
    >
      <error-temp :status-code="statusCode" />
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
import type { StatusErrorCodeApp } from '@/types'

const props = defineProps<{
  error: {
    statusCode?: number
    message?: string
  }
}>()

const errorTitles: Record<StatusErrorCodeApp, string> = {
  404: 'Page Not Found',
  403: 'Access Denied',
  401: 'Please Log In',
  500: 'Something Went Wrong',
  disconnect: 'Connection Lost',
}

const statusCode = computed(() => props.error.statusCode as StatusErrorCodeApp ?? 400)

useHead({
  title: errorTitles[statusCode.value] ?? 'Something Went Wrong',
})

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
