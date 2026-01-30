<template>
  <v-app>
    <v-container
      class="d-flex flex-column mt-16"
    >
      <error-500 v-if="error.statusCode == 500" />
      <error-404 v-if="error.statusCode == 404" />
      <error-403 v-if="error.statusCode == 403" />
      <error-401 v-if="error.statusCode == 401" />
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
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
