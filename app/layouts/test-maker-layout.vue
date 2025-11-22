<template>
  <v-app>
    <main_header :is-user-dashboard="true" />
    <div class="mt-16 mt-md-0">
      <test-maker-menu />
      <NuxtPage />
    </div>
    <AppGlobalSnackbar />
  </v-app>
</template>

<script setup>
import main_header from '../components/common/header.vue'
</script>
