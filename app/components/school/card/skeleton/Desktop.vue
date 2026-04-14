<template>
  <div
    class="w-100 pa-4 rounded-lg d-flex flex-column align-start justify-space-between card-school position-relative"
  >
    <div
      class="name-address-image w-100 d-flex ga-5 position-relative justify-space-between rounded-t-xl"
    >
      <div
        class="w-100 d-flex flex-column align-start justify-start ga-5"
      >
        <v-skeleton-loader
          width="200"
          height="20"
          class="rounded-xl"
        />
        <div class="d-flex align-center justify-start flex-wrap ga-2">
          <v-skeleton-loader
            width="80"
            height="20"
            class="rounded-xl"
          />
          <v-skeleton-loader
            width="60"
            height="20"
            class="rounded-xl"
          />
          <v-skeleton-loader
            width="110"
            height="20"
            class="rounded-xl"
          />
        </div>
      </div>
      <div class="d-block image-school">
        <v-skeleton-loader
          width="130"
          height="130"
          class="rounded-lg"
        />
      </div>
    </div>
    <v-divider
      class="w-100 mt-2 d-flex border-opacity-100"
      thickness="2"
      color="grey100"
    />
    <div
      class="w-100 d-flex align-center justify-space-between rounded-b-lg mt-3 flex-wrap ga-5 bottom-section"
    >
      <div class="d-flex align-center ga-2">
        <v-skeleton-loader
          v-for="item in 4"
          :key="item"
          width="30"
          height="30"
          class="rounded-circle"
        />
      </div>

      <div class="d-flex align-center ga-2">
        <v-skeleton-loader
          width="60"
          height="20"
          class="rounded-xl"
        />
        <v-skeleton-loader
          width="60"
          height="20"
          class="rounded-xl"
        />
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.card-school {
  background-color: rgba(var(--v-theme-white),0.95);
  border: 1px solid rgb(var(--v-theme-primary50));
  min-height: unset;
  max-width: unset;
  box-shadow: 2px 6px 24px 0px #1018280D;
  text-decoration: none;
}
.without-image {
  min-height: unset;
}
.image-school {
  max-height: 130px;
}
.name-address-image {
  min-height: 130px;
  background-color: rgba(var(--v-theme-white),0.95);
  z-index: 2;
}
.position-bookmark {
  z-index: 2;
  top: 10px;
  right: 10px;
}
.bottom-section {
  background-color: unset;
  z-index: 2;
}
</style>
