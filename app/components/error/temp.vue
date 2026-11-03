<template>
  <div class="w-100 h-100 d-flex flex-column align-center justify-center px-2">
    <h1 class="text-h2 text-sm-h1 text-primary font-weight-black">
      {{ errorInfo[statusCode].title ?? '500' }}
    </h1>

    <img
      :src="image"
      :alt="errorInfo[statusCode].title.toString() ?? '500'"
      width="328"
      height="266"
      class="w-100 h-auto max-width-img"
    >

    <span class="text-h4 font-weight-bold text-grey700 mt-8 text-center"> {{ errorInfo[statusCode].subtitle ?? 'There was a problem on our side!' }}</span>

    <div class="d-flex flex-column flex-sm-row justify-center ga-3 mt-4 w-100">
      <v-btn
        v-if="canRetry"
        flat
        color="primary"
        min-width="220"
        rounded="pill"
        class="text-h5"
        prepend-icon="md:refresh"
        @click="reloadNuxtApp()"
      >
        Try again
      </v-btn>
      <v-btn
        v-else-if="listing"
        flat
        color="primary"
        min-width="220"
        rounded="pill"
        class="text-h5"
        prepend-icon="md:search"
        :to="listing.to"
      >
        {{ listing.label }}
      </v-btn>

      <v-btn
        :flat="!hasPrimaryAction"
        :variant="hasPrimaryAction ? 'outlined' : 'flat'"
        color="primary"
        :min-width="hasPrimaryAction ? 220 : 350"
        rounded="pill"
        class="text-h5"
        to="/"
      >
        Return To Home
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StatusErrorCodeApp } from '@/types'

interface IError {
  statusCode: StatusErrorCodeApp
}

const props = defineProps<IError>()

const route = useRoute()

// A server failure may be gone on the next request, so offer a retry first. A missing or forbidden
// page offers the listing it belongs to. Offline keeps just the home button: a reload would fail.
const canRetry = computed(() => props.statusCode === 500)
const listing = computed(() =>
  props.statusCode === 404 || props.statusCode === 403
    ? getErrorRecoveryListing(route.path)
    : null,
)
const hasPrimaryAction = computed(() => canRetry.value || !!listing.value)

const errorInfo = {
  500: {
    title: 500,
    image: '/images/error/error-500.svg',
    subtitle: 'There was a problem on our side!',
  },
  404: {
    title: 404,
    image: '/images/error/error-404.svg',
    subtitle: 'Page not found!',
  },
  403: {
    title: 403,
    image: '/images/error/error-403.svg',
    subtitle: 'You do not have access to this page!',
  },
  401: {
    title: 401,
    image: '/images/error/error-403.svg',
    subtitle: 'You are not authenticated. Please log in to continue.',
  },
  disconnect: {
    title: 'Disconnect',
    image: '/images/error/error-disconnect.svg',
    subtitle: 'First check the internet',
  },
}

// Each illustration has a dark-theme copy next to it (`-dark` suffix).
const { isDark } = useThemeMode()
const image = computed(() => {
  const src = errorInfo[props.statusCode]?.image ?? '/images/error/error-500.svg'
  return isDark.value ? src.replace('.svg', '-dark.svg') : src
})
</script>

<style scoped>
.max-width-img{
  max-width: 350px;
}
</style>
