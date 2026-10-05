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
          width="150"
        />
      </div>

      <v-skeleton-loader
        height="20"
        width="90"
      />
    </div>

    <div class="w-100 d-flex flex-wrap ga-3 mt-4">
      <v-card
        class="pa-4 d-flex flex-column align-center justify-center ga-3 flex-grow-1"
        color="grey100"
        flat
        rounded="lg"
        border
        min-width="260"
      >
        <v-skeleton-loader
          height="150"
          width="150"
          class="rounded-circle"
        />
        <div class="w-100 d-flex flex-column ga-2">
          <v-skeleton-loader
            v-for="item in 3"
            :key="item"
            height="22"
            width="100%"
          />
        </div>
      </v-card>

      <v-card
        class="pa-4 d-flex flex-column ga-4 flex-grow-1"
        color="grey100"
        flat
        rounded="lg"
        border
        min-width="280"
      >
        <div class="w-100 d-flex flex-column ga-2">
          <v-skeleton-loader
            height="22"
            width="180"
          />
          <v-skeleton-loader
            height="8"
            width="100%"
            class="rounded-pill"
          />
          <div class="d-flex flex-wrap ga-2">
            <v-skeleton-loader
              v-for="item in 4"
              :key="item"
              height="18"
              width="100"
            />
          </div>
        </div>

        <div class="w-100 d-flex flex-wrap ga-2">
          <v-card
            v-for="item in 3"
            :key="item"
            class="pa-3 d-flex flex-column ga-2 flex-grow-1"
            color="white"
            flat
            rounded="lg"
            border
            min-width="150"
          >
            <v-skeleton-loader
              height="18"
              width="90"
            />
            <v-skeleton-loader
              height="24"
              width="110"
            />
          </v-card>
        </div>
      </v-card>
    </div>
  </v-card>
</template>
