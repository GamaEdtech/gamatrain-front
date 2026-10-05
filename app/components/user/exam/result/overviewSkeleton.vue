<template>
  <v-card
    class="w-100 mt-4 pa-4"
    flat
    rounded="lg"
    border
  >
    <div class="w-100 d-flex align-center justify-space-between ga-2 flex-wrap">
      <div class="d-flex align-center ga-2">
        <v-skeleton-loader
          height="24"
          width="24"
          class="rounded-lg"
        />
        <v-skeleton-loader
          height="24"
          width="110"
        />
      </div>

      <v-skeleton-loader
        height="32"
        width="100"
        class="rounded-pill"
      />
    </div>

    <div class="w-100 d-flex flex-wrap ga-2 mt-4">
      <v-card
        class="flex-grow-1 pa-3 d-flex align-center ga-3"
        color="grey100"
        flat
        rounded="lg"
        border
        min-width="180"
      >
        <v-skeleton-loader
          height="64"
          width="64"
          class="rounded-circle"
        />
        <div class="d-flex flex-column ga-2">
          <v-skeleton-loader
            height="24"
            width="160"
          />
          <v-skeleton-loader
            height="18"
            width="120"
          />
        </div>
      </v-card>

      <v-card
        v-for="item in 6"
        :key="item"
        class="pa-3 d-flex flex-column ga-2 flex-grow-1"
        color="grey100"
        flat
        rounded="lg"
        border
        min-width="180"
      >
        <v-skeleton-loader
          height="18"
          width="90"
        />
        <v-skeleton-loader
          height="24"
          width="130"
        />
      </v-card>
    </div>
  </v-card>
</template>
