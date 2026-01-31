<template>
  <div class="w-100 d-flex flex-column align-center justify-center">
    <h1 class="text-h2 text-sm-h1 text-primary font-weight-black">
      {{ getTitle(statusCode) }}
    </h1>

    <img
      :src="getImage(statusCode)"
      :alt="getTitle(statusCode).toString()"
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
type StatusCode = 500 | 404 | 403 | 401 | 'disconnect'

interface IError {
  statusCode: StatusCode
}

defineProps<IError>()

const getTitle = (code: StatusCode) => {
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

const getImage = (code: StatusCode) => {
  switch (code) {
    case 500:
      return '@/assets/images/error/error-500.svg'

    case 404:
      return '@/assets/images/error/error-404.svg'
    case 403:
      return '@/assets/images/error/error-403.svg'
    case 401:
      return '@/assets/images/error/error-403.svg'
    case 'disconnect':
      return '@/assets/images/error/error-disconnect.svg'

    default:
      return '@/assets/images/error/error-404.svg'
  }
}

const getSubtitle = (code: StatusCode) => {
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
