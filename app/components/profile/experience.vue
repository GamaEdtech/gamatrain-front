<template>
  <div
    class="w-100 d-flex flex-column pa-6 ga-4 bg-white"
  >
    <span class="text-h4 text-sm-h3 font-weight-bold text-grey700">Experience</span>
    <div class="d-flex flex-column ga-6 mt-4">
      <template
        v-for="i in 3"
        :key="i"
      >
        <div
          class="w-100 d-flex align-start justify-start ga-6 flex-column flex-sm-row"
        >
          <img
            width="86"
            height="64"
            class="rounded-lg"
            src="/images/school-default.png"
            alt="experience"
          >
          <div class="w-100 d-flex flex-column justify-start align-start ga-3">
            <span class="text-h5 text-grey500 font-weight-bold">London Metropolitan English Academy</span>
            <span class="text-h6 text-grey700 font-weight-regular">May 2023 - Present - 2 yrs 9 mos</span>
            <span class="text-h6 text-grey700 font-weight-regular">
              <v-icon
                color="grey400"
                size="12"
                class="mb-1"
              >md:location_on</v-icon>
              14 Elmwood Gardens, Islington, London N1 2AS, United Kingdom</span>

            <div class="d-flex flex-wrap ga-2">
              <v-chip
                variant="flat"
                size="small"
                color="grey100"
              >
                <span class="text-h6 font-weight-regular text-grey500">
                  Nigeria
                </span>
              </v-chip>
              <v-chip
                variant="flat"
                size="small"
                color="grey100"
              >
                <span class="text-h6 font-weight-regular text-grey500">
                  Lagos
                </span>
              </v-chip>
              <v-chip
                variant="flat"
                size="small"
                color="grey100"
              >
                <span class="text-h6 font-weight-regular text-grey500">
                  United Abule Egba
                </span>
              </v-chip>
            </div>
          </div>
        </div>
        <v-divider
          v-if="i != 3"
          color="grey300"
          class="border-opacity-100"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
// import defaultImage from '@/assets/images/default-school.png'
</script>

<style scoped>
</style>
