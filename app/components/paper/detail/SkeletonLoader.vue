<template>
  <div class="skeleton-loader">
    <!-- Breadcrumb skeleton -->
    <section>
      <v-container class="">
        <v-row class="mt-12">
          <!-- Skeleton for gallery -->
          <v-col cols="12">
            <v-skeleton-loader
              class="mx-auto"
              height="70"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
          >
            <v-skeleton-loader
              class="mx-auto"
              height="300"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-skeleton-loader
              class="mx-auto"
              height="300"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
          >
            <v-skeleton-loader
              class="mx-auto"
              height="300"
            />
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>

<script setup>
// No props or specific logic needed for the skeleton
</script>

<style scoped>
.fixed-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
  background: #f6f8fa !important;
  border-top: 0.1rem solid #e1e2e3;
}
</style>
