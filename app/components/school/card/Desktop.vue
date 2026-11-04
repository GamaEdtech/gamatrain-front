<template>
  <NuxtLink
    class="w-100 pa-4 rounded-lg d-flex flex-column align-start justify-space-between ga-3 card-school"
    :to="`/school/${school.id}/${school.slug}`"
  >
    <div class="w-100 d-flex ga-5 justify-space-between">
      <div class="d-flex flex-column align-start justify-start ga-2">
        <h2 class="text-h4 text-grey800 font-weight-semibold">
          {{ school.name }}
        </h2>
        <p
          v-if="locationLine"
          class="ma-0 text-h6 font-weight-regular text-grey600"
        >
          {{ locationLine }}
        </p>
      </div>
      <v-img
        v-if="photo"
        :alt="school.name"
        :src="photo"
        width="180"
        height="130"
        max-width="180"
        cover
        class="flex-shrink-0 rounded-lg"
        @error="onPhotoError"
      />
    </div>
    <v-divider
      class="w-100 border-opacity-100"
      thickness="2"
      color="grey100"
    />
    <div class="w-100 d-flex align-center justify-space-between flex-wrap ga-5">
      <div class="d-flex align-center ga-4">
        <v-icon
          v-for="contact in contacts"
          :key="contact.icon"
          :aria-label="contact.label"
          size="22"
          color="grey600"
        >
          {{ contact.icon }}
        </v-icon>
      </div>
      <div class="d-flex align-center ga-4 text-h6">
        <span
          v-if="rating"
          class="d-flex align-center ga-1 text-grey800 font-weight-semibold"
        >
          <v-icon
            size="x-large"
            color="primary"
          >md:star</v-icon>
          {{ rating }}
        </span>
        <span
          v-if="school.lastModifyDate"
          class="d-flex align-center ga-1 text-grey600"
        >
          <v-icon
            size="x-large"
            color="grey500"
          >md:update</v-icon>
          Updated <span class="text-grey800 font-weight-semibold">{{ formatLocal(school.lastModifyDate, "YYYY-MM-DD") }}</span>
        </span>
        <span
          v-if="distance"
          class="d-flex align-center ga-1 text-grey800 font-weight-semibold"
        >
          <v-icon
            size="x-large"
            color="grey500"
          >md:distance</v-icon>
          {{ distance }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
const { formatLocal } = useDateTime()

const props = defineProps({
  school: {
    type: Object,
  },
})

const { photo, onPhotoError, locationLine, rating, distance, contacts } = useSchoolCard(() => props.school)
</script>

<style scoped>
.card-school {
  background-color: rgba(var(--v-theme-surface), 0.95);
  border: 1px solid rgb(var(--v-theme-primary50));
  box-shadow: 2px 6px 24px rgba(var(--v-theme-shadowNeutral), 0.06);
  text-decoration: none;
}

/* Dark: the list is `surface` too, so lift the card and give it a visible edge */
.v-theme--dark .card-school {
  background-color: rgb(var(--v-theme-surfaceTertiary));
  border-color: rgb(var(--v-theme-borderSubtle));
}
</style>
