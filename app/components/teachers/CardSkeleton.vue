<template>
  <div class="w-100 d-flex flex-column ga-4 pa-4 bg-white rounded-lg teacher-card-skeleton">
    <div class="d-flex align-start ga-3">
      <v-skeleton-loader
        width="84"
        height="84"
        class="rounded-circle flex-shrink-0"
      />

      <div class="w-100 d-flex flex-column ga-2">
        <v-skeleton-loader
          width="65%"
          height="24"
          class="rounded-xl"
        />
        <v-skeleton-loader
          width="120"
          height="20"
          class="rounded-xl"
        />
      </div>
    </div>

    <v-skeleton-loader
      width="150"
      height="20"
      class="rounded-xl"
    />

    <div class="d-flex flex-wrap ga-2">
      <v-skeleton-loader
        v-for="item in 4"
        :key="item"
        width="80"
        height="28"
        class="rounded-pill"
      />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.teacher-card-skeleton {
  border: 1px solid rgb(var(--v-theme-grey300));
  box-shadow: 0px 12px 30px 0px #141a270d;
}
</style>
