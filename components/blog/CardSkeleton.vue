<template>
  <v-col cols="12">
    <div class="d-none d-sm-flex ga-4">
      <div>
        <v-skeleton-loader
          width="120"
          height="120"
          class="rounded-lg"
        />
      </div>
      <div class="d-flex flex-column justify-center ga-3">
        <v-skeleton-loader
          width="200"
          height="20"
          class="rounded-lg"
        />
        <v-skeleton-loader
          width="100"
          height="10"
          class="rounded-lg"
        />
      </div>
    </div>
    <div class="d-flex d-sm-none mobile-item">
      <v-skeleton-loader
        class="mx-auto slide-loading"
        type="image"
      />
    </div>
  </v-col>
</template>

<script setup></script>

<style></style>
