<template>
  <div
    class="w-100 pa-0 pa-md-4 rounded-lg d-flex flex-column align-start justify-md-space-between card-school justify-end position-relative"
  >
    <v-skeleton-loader
      width="100"
      height="100"
      class="d-flex d-md-none w-100 h-100 rounded-lg position-absolute"
    />
    <div
      class="name-address-image pa-2 pa-md-0 w-100 d-flex ga-1 ga-md-5 position-relative justify-start justify-sm-space-between rounded-t-xl"
    >
      <div
        class="w-100 d-flex flex-column align-start justify-start ga-2 ga-md-5"
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
          class="w-100 d-flex d-md-none align-strach justify-space-between pt-2"
        >
          <v-skeleton-loader
            width="60"
            height="20"
            class="rounded-xl"
          />
          <v-divider
            :thickness="1"
            class="border-opacity-100 primary-gray-300 w-100"
            vertical
          />
          <v-skeleton-loader
            width="60"
            height="20"
            class="rounded-xl"
          />
        </div>
      </div>
      <div class="d-none d-md-block image-school">
        <v-skeleton-loader
          width="130"
          height="130"
          class="rounded-lg"
        />
      </div>
    </div>
    <v-divider
      class="w-100 mt-2 d-none d-md-flex"
      thickness="2"
    />
    <div
      class="w-100 d-flex align-center justify-space-between rounded-b-lg mt-0 mt-md-3 flex-wrap ga-5 bottom-section pt-1 pb-1 pl-2 pr-2 pt-md-0 pb-md-0 pl-md-0 pr-md-0"
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
      <div class="d-flex d-md-none align-center">
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
  background-color: #f2f4f7;
  border: none;
  min-height: 260px;
  max-width: 560px;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
}
.image-school {
  max-height: 130px;
}
.name-address-image {
  min-height: unset;
  background-color: #fffffff2;
  z-index: 2;
}
.position-bookmark {
  z-index: 2;
  top: 10px;
  right: 10px;
}
.bottom-section {
  background-color: #f2f4f7;
  z-index: 2;
}
@media (min-width: 960px) {
  .name-address-image {
    min-height: 130px;
  }
  .card-school {
    min-height: unset;
    background-color: rgba(255, 255, 255, 0.95);
    border: 1px solid rgba(242, 244, 247, 1);
    max-width: unset;
  }
  .bottom-section {
    background-color: unset;
  }
}
</style>
