<template>
  <div class="w-100 h-100 d-flex flex-column align-center justify-center px-2">
    <h1 class="text-h2 text-sm-h1 text-primary font-weight-black">
      {{ errorInfo[statusCode].title ?? '500' }}
    </h1>

    <img
      :src="errorInfo[statusCode].image ?? error500"
      :alt="errorInfo[statusCode].title.toString() ?? '500'"
      height="300"
      width="300"
      class="w-100 max-width-img"
    >

    <span class="text-h4 font-weight-bold text-grey700 mt-8 text-center"> {{ errorInfo[statusCode].subtitle ?? 'There was a problem on our side!' }}</span>

    <v-btn
      flat
      color="primary"
      width="350"
      rounded="pill"
      class="text-h5 mt-4"
      to="/"
    >
      Return To Home
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import type { StatusErrorCodeApp } from '@/types/api'
import error500 from '@/assets/images/error/error-500.svg'
import error404 from '@/assets/images/error/error-404.svg'
import error403 from '@/assets/images/error/error-403.svg'
import errorDisconnect from '@/assets/images/error/error-disconnect.svg'

interface IError {
  statusCode: StatusErrorCodeApp
}

defineProps<IError>()

const errorInfo = {
  500: {
    title: 500,
    image: error500,
    subtitle: 'There was a problem on our side!',
  },
  404: {
    title: 404,
    image: error404,
    subtitle: 'Page not found!',
  },
  403: {
    title: 403,
    image: error403,
    subtitle: 'You do not have access to this page!',
  },
  401: {
    title: 401,
    image: error403,
    subtitle: 'You are not authenticated. Please log in to continue.',
  },
  disconnect: {
    title: 'Disconnect',
    image: errorDisconnect,
    subtitle: 'First check the internet',
  },
}
</script>

<style scoped>
.max-width-img{
  max-width: 350px;
}
</style>
