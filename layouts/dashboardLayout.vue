<template>
  <v-app>
    <main_header />
    <div class="mt-16 mt-md-0 position-relative h-screen">
      <!-- Desktop dashboard menu -->
      <drawer-menu />
      <!-- End desktop dashboard menu -->
      <v-container class="dashboard">
        <!-- Start : Category -->
        <category />
        <!-- End:Category -->

        <v-divider class="d-block d-md-none" />
        <div
          flat
          class="mt-0"
        >
          <div class="px-0 pt-0">
            <v-row>
              <v-col
                cols="12"
                class="px-0 px-md-2 pt-0 mt-3"
              >
                <slot />
              </v-col>
            </v-row>
          </div>
        </div>
      </v-container>
    </div>
    <AppGlobalSnackbar />
  </v-app>
</template>

<script setup>
import main_header from '../components/common/header.vue'
import category from '../components/common/category'
import DrawerMenu from '@/components/dashboard/drawer-menu'
</script>

<style scoped></style>
