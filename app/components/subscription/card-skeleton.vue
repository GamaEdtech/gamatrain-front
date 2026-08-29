<template>
  <div class="d-flex flex-column align-center justify-start plan-card rounded-xl pa-3 pa-md-4 elevation-3 simple-card">
    <div class="price-div w-100 d-flex flex-column align-start justify-start pa-3 pa-md-4 rounded-lg">
      <div class="w-100 d-flex align-center justify-space-between mb-2">
        <v-skeleton-loader
          width="105"
          height="20"
          class="rounded-pill"
        />

        <v-skeleton-loader
          width="74"
          height="20"
          class="rounded-pill flex-shrink-0"
        />
      </div>

      <v-skeleton-loader
        width="72"
        height="16"
        class="rounded-pill mb-1"
      />

      <div class="w-100 d-flex align-center justify-space-between mt-2">
        <div class="d-flex align-end">
          <v-skeleton-loader
            width="96"
            height="30"
            class="rounded-pill"
          />
          <v-skeleton-loader
            width="34"
            height="16"
            class="rounded-pill ml-2 mb-1"
          />
        </div>

        <v-skeleton-loader
          width="20"
          height="20"
          class="rounded-circle"
        />
      </div>

      <v-skeleton-loader
        width="140"
        height="18"
        class="rounded-pill mt-2"
      />
    </div>

    <div class="w-100 d-flex align-center justify-start mt-2">
      <v-skeleton-loader
        width="16"
        height="16"
        class="rounded-circle mr-2"
      />
      <v-skeleton-loader
        width="110"
        height="16"
        class="rounded-pill"
      />
    </div>

    <ul class="features w-100 text-left mt-4 pa-0">
      <li
        v-for="i in 4"
        :key="i"
        class="d-flex align-center mb-2"
      >
        <v-skeleton-loader
          width="18"
          height="18"
          class="rounded-circle mr-2 flex-shrink-0"
        />
        <v-skeleton-loader
          :width="i % 2 === 0 ? 168 : 132"
          height="14"
          class="rounded-pill"
        />
      </li>
    </ul>

    <v-skeleton-loader
      width="100%"
      height="48"
      class="rounded-lg mt-6"
    />
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.plan-card {
  max-width : 260px;
  min-width: 260px;
  height : fit-content;
  min-height : 380px;
}
.simple-card{
  border : 2px solid rgb(var(--v-theme-grey300));
}
.features {
  list-style: none;
}
.price-div {
  background: linear-gradient(135deg, rgb(var(--v-theme-white)) 0%, rgb(var(--v-theme-grey100)) 100%);
}
.plan-card:nth-of-type(3n+1) .price-div {
  background: linear-gradient(135deg, rgb(var(--v-theme-white)) 0%, #e7eefb 100%);
}
.plan-card:nth-of-type(3n+2) .price-div {
  background: linear-gradient(135deg, rgb(var(--v-theme-white)) 0%, #f1e6f6 100%);
}
.plan-card:nth-of-type(3n+3) .price-div {
  background: linear-gradient(135deg, rgb(var(--v-theme-white)) 0%, #f7f1e1 100%);
}
@media screen and (max-width: 600px) {
 .plan-card {
   width : 100% !important;
   max-width : 220px;
   min-width: 220px;
   min-height : 360px;
 }
}
</style>
