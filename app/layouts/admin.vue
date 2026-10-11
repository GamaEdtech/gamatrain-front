<template>
  <v-app>
    <error-temp
      v-if="!isOnline"
      status-code="disconnect"
    />
    <template v-else>
      <admin-layout-drawer-menu v-model:show-drawer="drawer" />

      <v-app-bar
        app
        color="grey800"
        dark
      >
        <v-app-bar-nav-icon
          class="d-flex d-lg-none"
          @click="drawer = !drawer"
        />
      </v-app-bar>

      <v-main>
        <NuxtPage class="pa-5" />
      </v-main>
      <AppGlobalSnackbar />
    </template>
  </v-app>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const { mdAndDown } = useDisplay()
const { isOnline } = useNetwork()
const drawer = ref(!mdAndDown.value)
</script>

<style scoped>
</style>
