<template>
  <div class="w-100 h-100 d-flex flex-column align-center justify-center px-2">
    <h1 class="text-h2 text-sm-h1 text-primary font-weight-black">
      {{ getTitle(statusCode) }}
    </h1>

    <img
      :src="getImage(statusCode)"
      :alt="getTitle(statusCode).toString()"
      height="300"
      width="300"
      class="w-100 max-width-img"
    >

    <span class="text-h4 font-weight-bold text-grey700 mt-8 text-center"> {{ getSubtitle(statusCode) }}</span>

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

const getTitle = (code: StatusErrorCodeApp) => {
  switch (code) {
    case 500:
      return 500

    case 404:
      return 404
    case 403:
      return 403
    case 401:
      return 401
    case 'disconnect':
      return 'Disconnect'

    default:
      return 404
  }
}

const getImage = (code: StatusErrorCodeApp) => {
  switch (code) {
    case 500:
      return error500

    case 404:
      return error404
    case 403:
      return error403
    case 401:
      return error403
    case 'disconnect':
      return errorDisconnect

    default:
      return error404
  }
}

const getSubtitle = (code: StatusErrorCodeApp) => {
  switch (code) {
    case 500:
      return 'There was a problem on our side!'

    case 404:
      return 'Page not found!'
    case 403:
      return 'You do not have access to this page!'
    case 401:
      return 'You are not authenticated. Please log in to continue.'
    case 'disconnect':
      return 'First check the internet'

    default:
      return 'Page not found!'
  }
}
</script>

<style scoped>
.max-width-img{
  max-width: 350px;
}
</style>
