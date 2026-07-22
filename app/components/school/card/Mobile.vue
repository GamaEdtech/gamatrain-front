<template>
  <NuxtLink
    class="w-100 pa-0 rounded-lg d-flex flex-column align-start card-school justify-end position-relative"
    :to="`/school/${school.id}/${school.slug}`"
  >
    <div
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
      :alt="school?.name"
      width="320px"
      height="320px"
      cover
      :src="school.defaultImageUri ? school.defaultImageUri?.replace(/^http:\/\//, 'https://') : defaultImage"
      class="d-flex w-100 h-100 rounded-lg position-absolute"
    />
    <div
      class="name-address-image pa-2 w-100 d-flex ga-1 position-relative justify-start rounded-t-xl"
    >
      <div
        class="w-100 d-flex flex-column align-start justify-start ga-2 pa-1"
      >
        <h2 class="text-h5 text-grey800 font-weight-semibold">{{ school.name }}</h2>
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

        <div
          class="w-100 d-flex align-strach justify-space-between pt-2"
        >
          <div
            class="d-flex align-center w-100 text-h6 font-weight-regular ga-1 text-grey500"
          >
            Score:
            <v-icon color="primary"> md:star </v-icon>
            <span class="text-grey800 font-weight-semibold">{{ school.rating ? school.rating.toFixed(1) : "N/A" }}</span>
          </div>
          <v-divider
            :thickness="1"
            class="border-opacity-100 w-100"
            vertical
            color="grey300"
          />
          <div
            class="d-flex align-center justify-end ga-2 text-h6  w-100"
          >
            <v-icon color="grey500">md:update</v-icon>
            <span class="text-grey800 font-weight-semibold">
              {{ formatLocal(school.lastModifyDate, "YYYY-MM-DD") }}
            </span>
          </div>
        </div>
        <div
          v-if="school.distance"
          class="d-flex align-start justify-start"
        >
          <div
            class="d-flex align-center w-100 text-h6 font-weight-regular ga-1 text-grey500"
          >
            Distance :

            <span class="text-grey800 font-weight-semibold">        {{ school.distance < 1000 ? Math.round(school.distance) + " m" : (school.distance / 1000).toFixed(1) + " km" }}</span>
          </div>
        </div>
      </div>
    </div>
    <div
      class="w-100 d-flex align-center justify-space-between rounded-b-lg mt-0 flex-wrap ga-5 bottom-section py-1 px-2"
    >
      <div class="d-flex align-center ga-2">
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
            size="x-large"
            color="grey700"
          >
            {{ btn.icon }}
          </v-icon>
        </v-btn>
      </div>
      <div class="d-flex align-center">
        <span class="text-h6 font-weight-regular text-grey700">Details</span>
        <v-icon
          size="small"
          color="grey700"
        >md:chevron_forward</v-icon>
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
  background-color: rgb(var(--v-theme-grey50));
  border : 1px solid rgb(var(--v-theme-grey200));
  min-height: 260px;
  max-width: 320px;
  min-width : 300px;
  box-shadow: 2px 6px 24px 0px #1018280D;
  text-decoration: none;
}

.image-school {
  max-height: 130px;
}
.name-address-image {
  background-color: rgba(var(--v-theme-white),0.95);
  z-index: 2;
  border : 1px solid rgb(var(--v-theme-grey200));
}
.position-bookmark {
  z-index: 2;
  top: 10px;
  right: 10px;
}
.bottom-section {
  background-color: rgb(var(--v-theme-grey50));
  z-index: 2;
}
</style>
