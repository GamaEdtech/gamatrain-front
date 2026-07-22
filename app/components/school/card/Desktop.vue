<template>
  <NuxtLink
    class="w-100 pa-4 rounded-lg d-flex flex-column align-start justify-space-between card-school position-relative"
    :to="`/school/${school.id}/${school.slug}`"
  >
    <!-- <NuxtImg
      v-if="school?.defaultImageUri"
      :alt="school?.name"
      width="320px"
      height="320px"
      :src="school?.defaultImageUri?.replace(/^http:\/\//, 'https://')"
      placeholder
      class="d-flex d-md-none w-100 h-100 rounded-lg position-absolute"
    /> -->
    <div
      class="name-address-image pa-0 w-100 d-flex ga-5 position-relative justify-space-between rounded-t-xl "
    >
      <div
        class="w-100 d-flex flex-column align-start justify-start ga-5"
      >
        <h2 class="text-h4 text-grey800 font-weight-semibold">{{ school.name }}</h2>
        <div class="d-flex align-center justify-start flex-wrap ga-2">
          <v-chip
            v-for="(chip, index) in locationChips"
            :key="index"
            size="small"
            variant="flat"
            color="primary50"
          >
            <span class="text-h6 font-weight-medium text-primary">
              {{ chip.label }}
            </span>
          </v-chip>
        </div>
      </div>
      <div
        class="d-block image-school"
      >
        <!-- <NuxtImg
          v-show="school.defaultImageUri"
          alt="school.name"
          width="180px"
          height="130px"
          :src="school.defaultImageUri?.replace(/^http:\/\//, 'https://')"
          placeholder
          class="h-100 rounded-lg"
        /> -->
        <v-img
          :alt="school.name"
          width="180px"
          height="130px"
          cover
          :src="school.defaultImageUri ? school.defaultImageUri?.replace(/^http:\/\//, 'https://') : defaultImage"
          class="h-100 rounded-lg"
        />
      </div>
    </div>
    <v-divider
      class="w-100 mt-2 d-flex border-opacity-100"
      thickness="2"
      color="grey100"
    />
    <div
      class="w-100 d-flex align-center justify-space-between rounded-b-lg mt-3 flex-wrap ga-5 bottom-section"
    >
      <div class="d-flex align-center ga-8">
        <v-btn
          v-for="(btn, index) in actionButtons"
          :key="index"
          width="30"
          height="30"
          variant="text"
          icon
          :disabled="btn.disabled"
        >
          <v-icon
            size="24"
            color="grey700"
          >
            {{ btn.icon }}
          </v-icon>
        </v-btn>
      </div>
      <div class="d-flex align-center ga-2">
        <div class="d-flex align-center ga-2 text-grey800 font-weight-semibold text-h6">
          <v-icon
            size="x-large"
            color="primary"
          > md:star </v-icon>
          {{ school.rating ? school.rating.toFixed(1) : "New" }}
        </div>
        <div class="d-flex align-center ga-2 text-h6">
          <v-icon
            size="x-large"
            color="grey500"
          >md:update</v-icon>
          <span class="text-grey800 font-weight-semibold">
            {{ formatLocal(school.lastModifyDate, "YYYY-MM-DD") }}
          </span>
        </div>

        <div
          v-if="school.distance"
          class="d-flex align-center ga-2 text-h6"
        >
          <v-icon
            size="x-large"
            color="grey500"
          >md:distance</v-icon>
          <span class="text-grey800 font-weight-semibold">
            {{ school.distance < 1000 ? Math.round(school.distance) + " m" : (school.distance / 1000).toFixed(1) + " km" }}
          </span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
import defaultImage from '@/assets/images/default-school.png'

const { formatLocal } = useDateTime()

const props = defineProps({
  school: {
    type: Object,
  },
})

const locationChips = computed(() => {
  const s = props.school
  if (!s) return []

  return [
    s.countryTitle && {
      label: s.countryTitle,
    },
    s.stateTitle && {
      label: s.stateTitle,
    },
    s.cityTitle && {
      label: `United ${s.cityTitle}`,
    },
  ].filter(Boolean)
})

const actionButtons = computed(() => {
  const s = props.school
  if (!s) return []

  return [
    {
      icon: 'md:location_on',
      disabled: !s.hasLocation,
    },
    {
      icon: 'md:call',
      disabled: !s.hasPhone,
    },
    {
      icon: 'md:mail',
      disabled: !s.hasEmail,
    },
    {
      icon: 'md:language',
      disabled: !s.hasWebsite,
    },
  ]
})
</script>

<style scoped>
.card-school {
  background-color: rgba(var(--v-theme-white),0.95);
  border: 1px solid rgb(var(--v-theme-primary50));
  min-height: unset;
  max-width: unset;
  box-shadow: 2px 6px 24px 0px #1018280D;
  text-decoration: none;
}

.image-school {
  max-height: 130px;
}
.name-address-image {
  min-height: 130px;
  background-color: rgba(var(--v-theme-white),0.95);
  z-index: 2;
}
.position-bookmark {
  z-index: 2;
  top: 10px;
  right: 10px;
}
.bottom-section {
  background-color: unset;
  z-index: 2;
}
</style>
