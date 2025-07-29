<template>
  <v-app>
    <main_header />
    <div class="mt-16 mt-md-0">
      <v-container class="dashboard">
        <!-- Start : Category -->
        <category />
        <!-- End:Category -->

        <v-divider class="d-block d-md-none" />
        <dashboard-mobile-menu />

        <div
          flat
          class="mt-0"
        >
          <div class="px-0 pt-0">
            <v-row>
              <!-- Desktop dashboard menu -->
              <v-col
                class="d-none d-md-block"
                md="2"
              >
                <dashboard-desktop-menu />
              </v-col>
              <!-- End desktop dashboard menu -->
              <v-col
                cols="12"
                md="10"
                class="px-0 px-md-2 pt-0 mt-3"
              >
                <slot />
              </v-col>
            </v-row>
          </div>
        </div>
      </v-container>
    </div>
    <main_footer />
    <AppGlobalSnackbar />
  </v-app>
</template>

<script setup>
import main_header from '../components/common/header.vue'
import category from '../components/common/category'
import main_footer from '../components/common/footer'
import DashboardDesktopMenu from '@/components/dashboard/desktop-menu'
import DashboardMobileMenu from '@/components/dashboard/mobile-menu'
</script>

<style scoped></style>
