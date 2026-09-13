<template>
  <v-card
    class="w-100 mt-4 mb-8 pa-4"
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
          width="130"
        />
      </div>

      <v-skeleton-loader
        height="20"
        width="70"
      />
    </div>

    <div class="w-100 d-flex align-center flex-wrap ga-4 mt-4">
      <div
        v-for="item in 4"
        :key="item"
        class="d-flex align-center ga-2"
      >
        <v-skeleton-loader
          height="24"
          width="24"
          class="rounded-lg"
        />
        <v-skeleton-loader
          height="18"
          width="120"
        />
      </div>
    </div>

    <div class="w-100 d-flex flex-wrap ga-2 mt-4">
      <v-card
        v-for="item in 8"
        :key="item"
        class="question-card pa-3 d-flex align-center justify-space-between ga-3 flex-wrap"
        color="grey100"
        flat
        rounded="lg"
        border
      >
        <div class="d-flex align-center ga-2">
          <v-skeleton-loader
            height="32"
            width="32"
            class="rounded-lg"
          />
          <v-skeleton-loader
            height="24"
            width="80"
            class="rounded-pill"
          />
        </div>

        <div class="d-flex align-center ga-2">
          <v-skeleton-loader
            v-for="choice in 4"
            :key="choice"
            height="24"
            width="24"
            class="rounded-lg"
          />
        </div>
      </v-card>
    </div>
  </v-card>
</template>

<style scoped>
.question-card {
  width: 100%;
}

@media screen and (min-width: 600px) {
  .question-card {
    width: calc(50% - 4px);
  }
}
</style>
