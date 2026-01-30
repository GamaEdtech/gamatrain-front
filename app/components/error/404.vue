<template>
  <div class="w-100 d-flex flex-column align-center justify-center">
    <h1 class="text-h2 text-sm-h1 text-primary font-weight-black">
      404
    </h1>

    <img
      src="@/assets/images/error/error-404.svg"
      alt="404"
      class="w-100 max-width-img"
    >

    <span class="text-h4 font-weight-bold text-grey700 text-center">Page not found!</span>

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

</script>

<style scoped>
.max-width-img{
  max-width: 350px;
}
</style>
