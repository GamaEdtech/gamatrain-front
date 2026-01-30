<template>
  <div class="w-100 d-flex flex-column align-center justify-center">
    <h1 class="text-h2 text-sm-h1 text-primary font-weight-black">
      401
    </h1>

    <img
      src="@/assets/images/error/error-403.svg"
      alt="401"
      class="w-100 max-width-img"
    >

    <span class="text-h4 font-weight-bold text-grey700 mt-8 text-center"> You are not authenticated. Please log in to continue.</span>

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
