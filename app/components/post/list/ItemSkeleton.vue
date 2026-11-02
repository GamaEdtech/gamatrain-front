<template>
  <v-row class="w-100 ma-0 align-stretch">
    <v-col
      cols="9"
      sm="10"
    >
      <v-card
        flat
        color="transparent"
        :width="xs ? 240 : '100%'"
        class="h-100 rounded-lg ma-auto"
      >
        <div class="d-flex flex-column flex-sm-row ga-4">
          <div class="position-relative flex-shrink-0">
            <v-skeleton-loader
              :max-width="xs ? 240 : 180"
              :width="xs ? 240 : 180"
              :height="xs ? 160 : 135"
              class="rounded-lg"
            />

            <div class="d-flex d-sm-none w-100 position-absolute bottom-0 pa-2">
              <v-skeleton-loader
                width="180"
                height="20"
                class="rounded"
              />
            </div>
          </div>

          <div class="d-none d-sm-flex w-100 flex-column ga-3 pa-2">
            <v-skeleton-loader
              width="65%"
              height="28"
              class="rounded"
            />
            <div class="d-flex w-100 flex-column ga-2">
              <v-skeleton-loader
                width="100%"
                height="16"
                class="rounded"
              />
              <v-skeleton-loader
                width="90%"
                height="16"
                class="rounded"
              />
              <v-skeleton-loader
                width="55%"
                height="16"
                class="rounded"
              />
            </div>
          </div>

          <div class="d-flex d-sm-none w-100 flex-column ga-2">
            <v-skeleton-loader
              width="100%"
              height="14"
              class="rounded"
            />
            <v-skeleton-loader
              width="85%"
              height="14"
              class="rounded"
            />
            <v-skeleton-loader
              width="55%"
              height="14"
              class="rounded"
            />
          </div>
        </div>
      </v-card>
    </v-col>

    <v-col
      cols="3"
      sm="2"
      class="d-flex flex-column align-center ga-2 position-relative"
    >
      <v-divider
        :thickness="2"
        color="grey100"
        vertical
        class="border-opacity-100 h-100 position-absolute divider-position"
      />
      <v-skeleton-loader
        width="42"
        height="18"
        class="rounded skeleton-content"
      />
      <v-skeleton-loader
        :width="xs ? 52 : 62"
        :height="xs ? 52 : 62"
        class="rounded-lg skeleton-content"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const { xs } = useDisplay()
</script>

<style scoped>
.skeleton-content {
  z-index: 2;
}

.divider-position {
  right: 50%;
}
</style>
