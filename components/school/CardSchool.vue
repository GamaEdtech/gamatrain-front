<template>
  <NuxtLink
    :class="`w-100 pa-0 pa-md-4 rounded-lg d-flex flex-column align-start justify-md-space-between card-school justify-end position-relative ${
      school?.defaultImageUri ? `` : `without-image`
    }`"
    :to="`/school/${school.id}/${$slugGenerator(school.name)}`"
  >
    <v-icon
      v-if="school?.defaultImageUri"
      color="#344054"
      size="small"
      class="d-flex d-md-none position-absolute position-bookmark"
    >md:bookmark</v-icon>
    <NuxtImg
      v-if="school?.defaultImageUri"
      :alt="school?.name"
      width="320px"
      height="320px"
      :src="school?.defaultImageUri?.replace(/^http:\/\//, 'https://')"
      placeholder
      class="d-flex d-md-none w-100 h-100 rounded-lg position-absolute"
    />
    <div
      :class="`name-address-image pa-2 pa-md-0 w-100 d-flex ga-1 ga-md-5 position-relative justify-start justify-sm-space-between ${
        school?.defaultImageUri ? `rounded-t-xl` : `rounded-t-lg`
      }`"
    >
      <div
        class="w-100 d-flex flex-column align-start justify-start ga-2 ga-md-5"
      >
        <span class="gtext-t4 font-weight-semibold">{{ school.name }}</span>
        <div class="d-flex align-center justify-start flex-wrap ga-2">
          <v-chip
            v-if="school.countryTitle && school.countryTitle.length > 0"
            class="text-subtitle-2 text-md-subtitle-1"
            size="small"
            variant="elevated"
            color="#546e7a"
          >
            {{ school.countryTitle }}
          </v-chip>
          <v-chip
            v-if="school.stateTitle && school.stateTitle.length > 0"
            class="text-subtitle-2 text-md-subtitle-1"
            size="small"
            variant="elevated"
            color="#546e7a"
          >{{ school.stateTitle }}</v-chip>
          <v-chip
            v-if="school.cityTitle && school.cityTitle.length > 0"
            class="text-subtitle-2 text-md-subtitle-1"
            size="small"
            variant="elevated"
            color="#546e7a"
          >United {{ school.cityTitle }}</v-chip>
        </div>

        <div
          class="w-100 d-flex d-md-none align-strach justify-space-between pt-2"
        >
          <div
            class="d-flex align-center w-100 gtext-t6 font-weight-semibold ga-1 primary-gray-500"
          >
            Score:
            <v-icon color="primary"> mdi-star </v-icon>
            {{ school.score ? school.score.toFixed(1) : "N/A" }}
          </div>
          <v-divider
            :thickness="1"
            class="border-opacity-100 primary-gray-300 w-100"
            vertical
          />
          <div
            class="d-flex align-center justify-end ga-2 gtext-t6 primary-gray-300 w-100"
          >
            <v-icon color="rgba(52, 64, 84, 1)">mdi-update</v-icon>
            <span class="primary-gray-600">
              {{ $dayjs(school.lastModifyDate).format("YYYY-MM-DD") }}
            </span>
          </div>
        </div>
      </div>
      <div
        v-if="school.defaultImageUri"
        class="d-none d-md-block image-school"
      >
        <NuxtImg
          v-show="school.defaultImageUri"
          alt="school.name"
          width="180px"
          height="130px"
          :src="school.defaultImageUri?.replace(/^http:\/\//, 'https://')"
          placeholder
          class="h-100 rounded-lg"
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
        <v-btn
          width="30"
          height="30"
          variant="text"
          icon
          :disabled="!school.hasLocation"
        >
          <v-icon size="x-large"> mdi-map-marker </v-icon>
        </v-btn>
        <v-btn
          width="30"
          height="30"
          variant="text"
          icon
          :disabled="!school.hasPhon"
        >
          <v-icon size="x-large"> mdi-phone </v-icon>
        </v-btn>
        <v-btn
          width="30"
          height="30"
          variant="text"
          icon
          :disabled="!school.hasEmail"
        >
          <v-icon size="x-large"> mdi-email </v-icon>
        </v-btn>
        <v-btn
          width="30"
          height="30"
          variant="text"
          icon
          :disabled="!school.hasWebsite"
        >
          <v-icon size="x-large"> mdi-web</v-icon>
        </v-btn>
      </div>
      <div class="d-flex d-md-none align-center">
        <span class="text-h6 font-weight-normal primary-gray-700">Details</span>
        <v-icon
          size="small"
          color="#344054"
        >mdi-chevron-right</v-icon>
      </div>
      <div class="d-none d-md-flex align-center ga-2">
        <div class="d-flex align-center ga-2 gtext-t6 font-weight-semibold">
          <v-icon
            size="x-large"
            color="primary"
          > mdi-star </v-icon>
          {{ school.score ? school.score.toFixed(1) : "New" }}
        </div>
        <div class="d-flex align-center ga-2 gtext-t6 primary-gray-300">
          <v-icon size="x-large">mdi-update</v-icon>
          <span class="primary-gray-600">
            {{ $dayjs(school.lastModifyDate).format("YYYY-MM-DD") }}
          </span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
defineProps({
  school: {
    type: Object,
  },
})
</script>

<style scoped>
.card-school {
  background-color: #f2f4f7;
  border: none;
  min-height: 260px;
  max-width: 560px;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
}
.without-image {
  min-height: unset;
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
