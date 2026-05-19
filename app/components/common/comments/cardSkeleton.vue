<template>
  <div
    class="main-comment w-100 d-flex flex-column ga-4 pb-4 position-relative"
  >
    <div class="w-100 d-flex align-center justify-space-between">
      <div class="img-name d-flex ga-2 align-center">
        <v-skeleton-loader
          width="40"
          height="40"
          class="rounded-circle image-user"
        />

        <div class="d-flex flex-column align-start">
          <v-skeleton-loader
            width="80"
            height="20"
            class="rounded-lg"
          />
        </div>
      </div>
    </div>
    <v-skeleton-loader
      width="260"
      height="20"
      class="rounded-lg pl-6 pl-sm-8"
    />

    <div
      class="w-100 pl-6 pl-sm-8 d-flex align-center justify-space-between"
    >
      <div class="d-flex ga-4 option-div">
        <v-skeleton-loader
          width="40"
          height="20"
          class="rounded-lg"
        />

        <v-skeleton-loader
          width="40"
          height="20"
          class="rounded-lg"
        />
      </div>
      <v-skeleton-loader
        width="80"
        height="20"
        class="rounded-lg"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.image-user {
  z-index: 4;
}
</style>
