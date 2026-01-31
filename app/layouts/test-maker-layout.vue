<template>
  <v-app>
    <error-temp
      v-if="!isOnline"
      status-code="disconnect"
    />
    <template v-else>
      <main_header :is-user-dashboard="true" />
      <div class="mt-16 mt-md-0">
        <test-maker-menu />
        <NuxtPage />
      </div>
      <AppGlobalSnackbar />
    </template>
  </v-app>
</template>

<script setup>
import main_header from '../components/common/header.vue'

const { isOnline } = useNetwork()
</script>
