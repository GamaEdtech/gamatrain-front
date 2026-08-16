<template>
  <v-card
    :class="`plan-card border-solid border-sm border-grey600 px-3 py-6 pa-md-6 text-center`"
  >
    <v-skeleton-loader
      width="80"
      height="30"
      class="rounded-pill mb-3 mx-auto"
    />

    <v-skeleton-loader
      width="120"
      height="10"
      class="rounded-pill mb-2 mx-auto"
    />

    <v-skeleton-loader
      width="80"
      height="20"
      class="rounded-pill mb-8 mx-auto"
    />

    <ul class="mb-6 pa-0 mx-auto">
      <template
        v-for="i in 4"
        :key="i"
      >
        <v-skeleton-loader
          width="160"
          height="10"
          class="rounded-pill mb-2 mx-auto"
        />
      </template>
    </ul>

    <!-- Button -->
    <v-skeleton-loader
      width="160"
      height="40"
      class="rounded-pill mx-auto"
    />
  </v-card>
</template>

<script setup lang="ts">
</script>

<style scoped>
.plan-card {
  height : fit-content;
  width : 30%;
  border-radius: 16px;
  transition: all 0.25s ease;
}
.plan-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.08);
}

.features {
  list-style: none;
}
@media screen and (max-width: 600px) {
 .plan-card {
   width : 100%;
   max-width : 220px;
 }
}
</style>
