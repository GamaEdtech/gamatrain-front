<template>
  <v-container
    class="d-flex flex-column ga-2 mt-16"
  >
    <profile-header />
    <profile-skills class="box-shadow-div" />
    <profile-experience class="box-shadow-div" />
    <profile-register-content class="box-shadow-div" />
    <profile-education class="box-shadow-div" />
  </v-container>
</template>

<script setup lang="ts">
</script>

<style scoped>
.box-shadow-div{
  box-shadow: 0px 12px 30px 0px #1018280D;
}
</style>
