<template>
  <div class="w-100 d-flex flex-column pa-4 rounded-lg bg-grey700">
    <div class="w-100 d-flex flex-column flex-sm-row justify-space-between align-start align-sm-center ga-4">
      <div class="d-flex align-center ga-2">
        <v-skeleton-loader
          height="72"
          width="72"
          class="rounded-circle"
        />
        <div class="d-flex flex-column ga-2">
          <v-skeleton-loader
            height="28"
            width="180"
          />
          <v-skeleton-loader
            height="22"
            width="120"
          />
        </div>
      </div>
      <div class="d-flex flex-column align-start align-sm-end ga-2">
        <v-skeleton-loader
          height="32"
          width="150"
          class="rounded-pill"
        />
        <v-skeleton-loader
          height="18"
          width="190"
        />
      </div>
    </div>

    <v-divider
      class="border-opacity-50 my-4"
      color="grey300"
    />

    <div class="d-flex flex-column">
      <v-skeleton-loader
        height="20"
        width="100"
        class="mb-4"
      />
      <div class="d-flex flex-wrap ga-2">
        <v-skeleton-loader
          v-for="item in 3"
          :key="item"
          height="32"
          width="140"
          class="rounded-pill"
        />
      </div>
    </div>
  </div>
</template>
