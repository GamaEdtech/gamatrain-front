<template>
  <v-container
    class="d-flex flex-column ga-2 mt-16"
  >
    <teacher-header />
    <teacher-skills class="box-shadow-div" />
    <teacher-experience class="box-shadow-div" />
    <teacher-register-content class="box-shadow-div" />
  </v-container>
</template>

<script setup lang="ts">
</script>

<style scoped>
.box-shadow-div{
  box-shadow: 0px 12px 30px 0px #1018280D;
}
</style>
