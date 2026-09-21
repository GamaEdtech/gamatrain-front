<template>
  <div
    class="main-translation-div d-flex flex-column ga-1 border-solid border-md border-grey600 rounded-lg pa-8 mt-2 mx-auto"
  >
    <div class="w-100 d-flex align-center justify-space-between mb-4">
      <span class="text-h4 text-md-h3 font-weight-bold text-grey700">New translation</span>
    </div>
    <div
      class="w-100 d-flex flex-column align-start justify-start ga-1 mb-4"
    >
      <span class="text-h4 font-weight-bold text-grey700 ml-2">
        Language
      </span>
      <v-skeleton-loader
        class="w-100 rounded-lg"
        height="56"
      />
    </div>
    <div class="w-100 d-flex flex-column align-start justify-start ga-1">
      <div class="text-h4 font-weight-bold text-grey700 ml-2">
        <v-badge
          floating
          location="top right"
          color="transparent"
          overlap
        >
          <template #badge>
            <v-icon
              size="large"
              color="error"
            >
              md:star
            </v-icon>
          </template>
          <span>Title</span>
        </v-badge>
      </div>
      <v-skeleton-loader
        class="w-100 rounded-lg"
        height="56"
      />
    </div>
    <div class="w-100 d-flex flex-column align-start justify-start ga-1">
      <div class="text-h4 font-weight-bold text-grey700 ml-2">
        <v-badge
          floating
          location="top right"
          color="transparent"
          overlap
        >
          <template #badge>
            <v-icon
              size="large"
              color="error"
            >
              md:star
            </v-icon>
          </template>
          <span>Abstract</span>
        </v-badge>
      </div>
      <v-skeleton-loader
        class="w-100 rounded-lg"
        height="272"
      />
    </div>

    <div class="w-100 d-flex flex-column align-start justify-start ga-1">
      <div class="text-h4 font-weight-bold text-grey700 ml-2">
        <v-badge
          floating
          location="top right"
          color="transparent"
          overlap
        >
          <template #badge>
            <v-icon
              size="large"
              color="error"
            >
              md:star
            </v-icon>
          </template>
          <span>Main</span>
        </v-badge>
      </div>
      <v-skeleton-loader
        class="w-100 rounded-lg"
        height="350"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.main-translation-div{
  width : calc(100% - 64px)
}
</style>
