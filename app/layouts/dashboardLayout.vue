<template>
  <v-app>
    <error-temp
      v-if="!isOnline"
      status-code="disconnect"
    />
    <template v-else>
      <main_header :is-user-dashboard="true" />
      <div class="mt-16 mt-md-0 position-relative">
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
      <menu-bottom-nav-menu />
      <AppGlobalSnackbar />
    </template>
  </v-app>
</template>

<script setup>
import main_header from '../components/common/header.vue'
import category from '../components/common/category'

const { isOnline } = useNetwork()
</script>

<style scoped></style>
