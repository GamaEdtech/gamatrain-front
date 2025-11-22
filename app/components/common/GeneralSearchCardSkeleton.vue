<template>
  <NuxtLink class="w-100 d-flex align-start justify-start ga-2 px-4 py-8">
    <v-skeleton-loader
      width="60"
      height="60"
      class="rounded-circle"
    />
    <div class="d-flex flex-column align-start justify-center ga-4">
      <v-skeleton-loader
        width="120"
        height="20"
        class="rounded-xl"
      />

      <div class="d-flex flex-wrap align-center ga-2">
        <v-skeleton-loader
          width="80"
          height="20"
          class="rounded-pill"
        />
        <v-skeleton-loader
          width="80"
          height="20"
          class="rounded-pill"
        />
        <v-skeleton-loader
          width="80"
          height="20"
          class="rounded-pill"
        />
      </div>
    </div>
  </NuxtLink>
</template>

<script setup></script>

<style scoped></style>
