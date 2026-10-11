<template>
  <v-card
    color="grey25"
    elevation="0"
    rounded="lg"
    min-height="174"
    max-width="1200"
    class="d-flex w-100 border border-grey200 border-opacity-100"
  >
    <div class="container-img w-100 bg-grey100">
      <v-skeleton-loader
        width="100%"
        height="100%"
        class="rounded-0"
      />
    </div>

    <div class="d-flex flex-column flex-grow-1 overflow-hidden px-4 py-3">
      <div class="d-flex align-start justify-space-between ga-4 mb-2">
        <div class="d-flex align-center ga-2 overflow-hidden">
          <v-skeleton-loader
            width="26"
            height="26"
            class="rounded-circle flex-shrink-0"
          />
          <v-skeleton-loader
            width="120"
            height="20"
            class="rounded-xl flex-shrink-1"
          />
        </div>

        <div class="d-flex align-center flex-shrink-0 ga-3 ga-md-6">
          <v-skeleton-loader
            v-for="item in 5"
            :key="item"
            width="16"
            height="16"
            class="rounded-circle"
          />
        </div>
      </div>

      <v-skeleton-loader
        width="70%"
        height="26"
        class="rounded-xl mb-1"
      />
      <v-skeleton-loader
        width="85%"
        height="20"
        class="rounded-xl"
      />

      <div class="d-flex align-center flex-nowrap overflow-hidden ga-1 mt-2 mt-sm-4">
        <v-skeleton-loader
          width="78"
          height="28"
          class="rounded-pill flex-shrink-0"
        />
        <v-skeleton-loader
          width="92"
          height="28"
          class="rounded-pill flex-shrink-0"
        />
        <v-skeleton-loader
          width="118"
          height="28"
          class="rounded-pill flex-shrink-0"
        />
      </div>

      <div class="d-flex align-center flex-nowrap overflow-hidden ga-3 ga-lg-5 mt-3">
        <v-skeleton-loader
          width="86"
          height="20"
          class="rounded-xl flex-shrink-0"
        />
        <v-skeleton-loader
          width="64"
          height="20"
          class="rounded-xl flex-shrink-0"
        />
        <v-skeleton-loader
          width="96"
          height="20"
          class="rounded-xl flex-shrink-0"
        />
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts"></script>

<style scoped>
.container-img {
  min-width: 146px;
  max-width: 146px;
}

@media (max-width: 600px) {
  .container-img {
    min-width: 96px;
    max-width: 96px;
  }
}
</style>
