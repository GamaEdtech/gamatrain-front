<template>
  <div
    class="w-100 card-skelton rounded-lg px-2 py-4 d-flex flex-wrap ga-3 align-center justify-start"
  >
    <div class="d-flex ga-3 align-stretch justify-start">
      <v-skeleton-loader
        type="image"
        class="img-div rounded-ts-lg rounded-bs-lg"
      />
      <div
        class="content-card d-flex flex-column ga-2 align-start justify-center justify-sm-space-between"
      >
        <v-skeleton-loader
          type="heading"
          width="200"
          height="40"
          class="w-100"
        />
        <div class="d-flex align-center justify-start flex-wrap">
          <v-skeleton-loader
            type="subtitle"
            width="150"
            height="40"
          />
          <v-skeleton-loader
            type="subtitle"
            width="150"
            height="40"
          />
        </div>
        <div class="d-none d-sm-flex align-center justify-space-between w-100">
          <v-skeleton-loader
            v-for="(item, idx) in 4"
            :key="idx"
            type="sentences"
            width="100"
            height="30"
          />
        </div>
      </div>
    </div>
    <div class="d-flex d-sm-none align-center justify-space-between w-100">
      <v-skeleton-loader
        v-for="(item, idx) in 4"
        :key="idx"
        type="sentences"
        width="120"
        height="30"
      />
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.card-skelton {
  border: 1px solid #d7d7d8;
  min-height: 120px;
  max-width: 1200px;
}
.img-div {
  min-width: 100px;
  height: 120px;
}
</style>
