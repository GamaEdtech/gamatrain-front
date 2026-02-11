<template>
  <div
    class="w-100 pa-0 rounded-lg d-flex flex-column align-start card-school justify-end position-relative"
  >
    <v-skeleton-loader
      width="100"
      height="100"
      class="d-flex w-100 h-100 rounded-lg position-absolute"
    />
    <div
      class="name-address-image pa-2 w-100 d-flex ga-1 position-relative justify-start rounded-t-xl"
    >
      <div
        class="w-100 d-flex flex-column align-start justify-start ga-2"
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

        <div
          class="w-100 d-flex align-strach justify-space-between pt-2"
        >
          <v-skeleton-loader
            width="60"
            height="20"
            class="rounded-xl"
          />
          <v-divider
            :thickness="1"
            class="border-opacity-100 bg-grey300 w-100"
            vertical
          />
          <v-skeleton-loader
            width="60"
            height="20"
            class="rounded-xl"
          />
        </div>
      </div>
    </div>
    <div
      class="w-100 d-flex align-center justify-space-between rounded-b-lg mt-0 flex-wrap ga-5 bottom-section px-1 py-2"
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
      <div class="d-flex align-center">
        <v-skeleton-loader
          width="50"
          height="20"
          class="rounded-xl"
        />
      </div>
      <div class="d-none d-md-flex align-center ga-2">
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
  background-color: rgb(var(--v-theme-grey50));
  border: none;
  min-height: 260px;
  max-width: 560px;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  text-decoration: none;
}
.without-image {
  min-height: unset;
  max-height: fit-content;
}
.image-school {
  max-height: 130px;
}
.name-address-image {
  background-color: rgba(var(--v-theme-white),0.95);
  z-index: 2;
  border : 1px solid rgb(var(--v-theme-grey200));
}
.position-bookmark {
  z-index: 2;
  top: 10px;
  right: 10px;
}
.bottom-section {
  background-color: rgb(var(--v-theme-grey50));
  z-index: 2;
}
</style>
