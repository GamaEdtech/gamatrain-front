<template>
  <div class="w-100 d-flex flex-column align-center justify-center pt-4">
    <h1 class="text-h2 text-sm-h1 text-primary font-weight-black">
      Disconnect
    </h1>

    <img
      src="@/assets/images/error/error-disconnect.svg"
      alt="disconnect"
      class="w-100 max-width-img"
    >

    <span class="text-h4 font-weight-bold text-grey700 mt-8 text-center">First check the internet</span>

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
