<template>
  <!-- Without a photo the card is a compact block of text, so a phone screen shows several schools, not one placeholder. -->
  <NuxtLink
    class="w-100 pa-0 rounded-lg d-flex flex-column align-start card-school overflow-hidden"
    :to="`/school/${school.id}/${school.slug}`"
  >
    <v-img
      v-if="photo"
      :alt="school.name"
      :src="photo"
      height="140"
      cover
      class="w-100 flex-grow-0"
      @error="onPhotoError"
    />
    <div class="w-100 d-flex flex-column ga-1 pa-3">
      <h2 class="text-h5 text-grey800 font-weight-semibold">
        {{ school.name }}
      </h2>
      <p
        v-if="locationLine"
        class="ma-0 text-h6 font-weight-regular text-grey600"
      >
        {{ locationLine }}
      </p>
    </div>
    <div class="w-100 d-flex align-center justify-space-between ga-3 bottom-section px-3 py-2">
      <div class="d-flex align-center flex-wrap ga-3 text-h6">
        <span
          v-if="rating"
          class="d-flex align-center ga-1 text-grey800 font-weight-semibold"
        >
          <v-icon
            color="primary"
            size="18"
          >md:star</v-icon>
          {{ rating }}
        </span>
        <span
          v-if="distance"
          class="text-grey800 font-weight-semibold"
        >{{ distance }}</span>
        <v-icon
          v-for="contact in contacts"
          :key="contact.icon"
          :aria-label="contact.label"
          size="20"
          color="grey600"
        >
          {{ contact.icon }}
        </v-icon>
      </div>
      <span class="d-flex align-center flex-shrink-0 text-h6 font-weight-regular text-grey700">
        Details
        <v-icon
          size="small"
          color="grey700"
        >md:chevron_forward</v-icon>
      </span>
    </div>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  school: {
    type: Object,
  },
})

const { photo, onPhotoError, locationLine, rating, distance, contacts } = useSchoolCard(() => props.school)
</script>

<style scoped>
.card-school {
  background-color: rgb(var(--v-theme-surface));
  border: 1px solid rgb(var(--v-theme-grey200));
  max-width: 320px;
  min-width: 300px;
  box-shadow: 2px 6px 24px rgba(var(--v-theme-shadowNeutral), 0.06);
  text-decoration: none;
}

.bottom-section {
  background-color: rgb(var(--v-theme-grey50));
  border-top: 1px solid rgb(var(--v-theme-grey100));
}

/* Dark: lift the card off the list instead of looking sunken. */
.v-theme--dark .card-school,
.v-theme--dark .bottom-section {
  background-color: rgb(var(--v-theme-surfaceTertiary));
}

.v-theme--dark .card-school,
.v-theme--dark .bottom-section {
  border-color: rgb(var(--v-theme-borderSubtle));
}
</style>
