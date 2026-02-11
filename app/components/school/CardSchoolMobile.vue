<template>
  <NuxtLink
    :class="`w-100 pa-0 rounded-lg d-flex flex-column align-start card-school justify-end position-relative ${
      school?.defaultImageUri ? `` : `without-image`
    }`"
    :to="`/school/${school.id}/${school.slug}`"
  >
    <div
      v-if="school?.defaultImageUri"
      class="pa-1 d-flex align-center justify-center position-absolute  position-bookmark rounded-circle bg-grey100"
    >
      <v-icon

        color="grey700"
        size="16"
      >md:bookmark_outlined</v-icon>
    </div>

    <!-- <NuxtImg
      v-if="school?.defaultImageUri"
      :alt="school?.name"
      width="320px"
      height="320px"
      :src="school?.defaultImageUri?.replace(/^http:\/\//, 'https://')"
      placeholder
      class="d-flex d-md-none w-100 h-100 rounded-lg position-absolute"
    /> -->
    <v-img
      v-if="school?.defaultImageUri"
      :alt="school?.name"
      width="320px"
      height="320px"
      cover
      :src="school.defaultImageUri?.replace(/^http:\/\//, 'https://')"
      class="d-flex w-100 h-100 rounded-lg position-absolute"
    />
    <div
      :class="`name-address-image pa-2 w-100 d-flex ga-1 position-relative justify-start ${
        school?.defaultImageUri ? `rounded-t-xl` : `rounded-t-lg`
      }`"
    >
      <div
        class="w-100 d-flex flex-column align-start justify-start ga-2"
      >
        <h2 class="gtext-t4 font-weight-semibold">{{ school.name }}</h2>
        <div class="d-flex align-center justify-start flex-wrap ga-2">
          <v-chip
            v-if="school.countryTitle && school.countryTitle.length > 0"
            class="text-subtitle-2"
            size="small"
            variant="elevated"
            color="#546e7a"
          >
            {{ school.countryTitle }}
          </v-chip>
          <v-chip
            v-if="school.stateTitle && school.stateTitle.length > 0"
            class="text-subtitle-2"
            size="small"
            variant="elevated"
            color="#546e7a"
          >{{ school.stateTitle }}</v-chip>
          <v-chip
            v-if="school.cityTitle && school.cityTitle.length > 0"
            class="text-subtitle-2"
            size="small"
            variant="elevated"
            color="#546e7a"
          >United {{ school.cityTitle }}</v-chip>
        </div>

        <div
          class="w-100 d-flex align-strach justify-space-between pt-2"
        >
          <div
            class="d-flex align-center w-100 gtext-t6 font-weight-semibold ga-1 primary-gray-500"
          >
            Score:
            <v-icon color="primary"> md:star </v-icon>
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
            <v-icon color="rgba(52, 64, 84, 1)">md:update</v-icon>
            <span class="primary-gray-600">
              {{ $dayjs(school.lastModifyDate).format("YYYY-MM-DD") }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div
      class="w-100 d-flex align-center justify-space-between rounded-b-lg mt-0 flex-wrap ga-5 bottom-section py-1 px-2"
    >
      <div class="d-flex align-center ga-2">
        <v-btn
          width="30"
          height="30"
          variant="text"
          icon
          :disabled="!school.hasLocation"
        >
          <v-icon
            size="x-large"
            color="#546e7a"
          > md:location_on </v-icon>
        </v-btn>
        <v-btn
          width="30"
          height="30"
          variant="text"
          icon
          :disabled="!school.hasPhone"
        >
          <v-icon
            size="x-large"
            color="#546e7a"
          > md:call</v-icon>
        </v-btn>
        <v-btn
          width="30"
          height="30"
          variant="text"
          icon
          :disabled="!school.hasEmail"
        >
          <v-icon
            size="x-large"
            color="#546e7a"
          > md:mail</v-icon>
        </v-btn>
        <v-btn
          width="30"
          height="30"
          variant="text"
          icon
          :disabled="!school.hasWebsite"
        >
          <v-icon
            size="x-large"
            color="#546e7a"
          > md:language</v-icon>
        </v-btn>
      </div>
      <div class="d-flex align-center">
        <span class="text-h6 font-weight-normal primary-gray-700">Details</span>
        <v-icon
          size="small"
          color="#344054"
        >md:chevron_forward</v-icon>
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
  text-decoration: none;
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
</style>
