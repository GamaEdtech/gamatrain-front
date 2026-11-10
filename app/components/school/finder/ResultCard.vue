<template>
  <v-card
    variant="flat"
    rounded="lg"
    class="finder-card"
    :class="{ 'finder-card--picked': picked, 'finder-card--active': active }"
  >
    <div class="d-flex ga-4 pa-4">
      <!-- Fixed box for the photo, so the list never shifts while photos load. -->
      <v-img
        v-if="photo"
        :src="photo"
        :alt="school.name"
        width="148"
        height="112"
        max-width="148"
        cover
        class="flex-shrink-0 rounded-lg bg-grey100 d-none d-sm-block"
        @error="onPhotoError"
      />
      <v-avatar
        v-else
        rounded="lg"
        size="56"
        color="grey100"
        class="flex-shrink-0 text-grey600 font-weight-bold d-none d-sm-flex"
      >
        {{ initials }}
      </v-avatar>

      <div class="flex-grow-1 d-flex flex-column ga-1 finder-card__body">
        <div class="d-flex align-start ga-2 flex-wrap">
          <component
            :is="headingTag"
            class="text-subtitle-1 font-weight-semibold text-grey800 finder-card__name"
          >
            <nuxt-link
              :to="schoolLink"
              class="finder-card__link"
            >{{ school.name }}</nuxt-link>
          </component>
          <v-chip
            v-if="typeLabel"
            size="x-small"
            label
            variant="tonal"
            color="grey700"
          >
            {{ typeLabel }}
          </v-chip>
          <span
            class="ml-auto d-inline-flex align-center ga-1 text-body-2 font-weight-bold text-grey800"
          >
            <v-icon
              size="18"
              color="primary"
            >md:star</v-icon>
            {{ ratingText }}
            <span class="font-weight-regular text-grey600">{{ reviewsText }}</span>
          </span>
        </div>

        <p
          v-if="locationLine"
          class="ma-0 text-caption text-grey600"
        >
          {{ locationLine }}
        </p>

        <div
          v-if="trip"
          class="d-flex flex-wrap align-center ga-3 text-body-2 font-weight-medium"
        >
          <span class="d-inline-flex align-center ga-1 text-grey800">
            <v-icon
              size="18"
              color="primaryStrong"
            >md:home_pin</v-icon>
            {{ trip.distance }} from home
          </span>
          <span class="d-inline-flex align-center ga-1 text-grey600">
            <v-icon size="18">md:directions_walk</v-icon>{{ trip.walk }}
          </span>
          <span class="d-inline-flex align-center ga-1 text-grey600">
            <v-icon size="18">md:directions_car</v-icon>{{ trip.drive }}
          </span>
        </div>

        <div
          v-if="hasBus || facilityNames.length"
          class="d-flex flex-wrap ga-1"
        >
          <v-chip
            v-if="hasBus"
            size="small"
            color="info"
            variant="tonal"
            prepend-icon="md:directions_bus"
          >
            School bus
          </v-chip>
          <v-chip
            v-for="facility in facilityNames"
            :key="facility"
            size="small"
            variant="outlined"
            color="grey500"
            class="text-grey700"
          >
            {{ facility }}
          </v-chip>
        </div>

        <div class="d-flex flex-wrap align-center ga-3 mt-1 text-caption text-grey600">
          <span
            v-for="contact in contacts"
            :key="contact.icon"
            class="d-inline-flex align-center"
            :title="contact.label"
          >
            <v-icon
              size="18"
              :aria-label="contact.label"
            >{{ contact.icon }}</v-icon>
          </span>
          <span v-if="school.lastModifyDate">Updated {{ updated }}</span>
          <v-btn
            :variant="picked ? 'flat' : 'outlined'"
            :color="picked ? 'primary' : 'grey700'"
            size="small"
            rounded="pill"
            class="ml-auto text-none"
            :prepend-icon="picked ? 'md:check' : 'md:add'"
            :aria-pressed="picked"
            @click="emit('toggle-compare')"
          >
            Compare
          </v-btn>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import type { SchoolListDTO } from '@/types'

const props = withDefaults(defineProps<{
  school: SchoolListDTO
  picked?: boolean
  active?: boolean
  /** Facility tag names by id, from the facets. */
  tagNames?: Record<number, string>
  busTagId?: number | null
  headingTag?: string
}>(), {
  picked: false,
  active: false,
  tagNames: () => ({}),
  busTagId: null,
  headingTag: 'h2',
})

const emit = defineEmits<{ 'toggle-compare': [] }>()

const { photo, onPhotoError, locationLine, contacts } = useSchoolCard(() => props.school)
const { tripFromHome } = useSchoolHome()
const { fromNowLocal } = useDateTime()

const schoolLink = computed(() => `/school/${props.school.id}/${props.school.slug}`)
const typeLabel = computed(() => schoolTypeLabel(props.school.schoolType))
const initials = computed(() => (props.school.name || '?').split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]).join('').toUpperCase())
const ratingText = computed(() => (props.school.rating ? props.school.rating.toFixed(1) : 'New'))
const reviewsText = computed(() => {
  const count = props.school.reviewCount ?? 0
  return count ? `(${count} ${count === 1 ? 'review' : 'reviews'})` : ''
})
const trip = computed(() => tripFromHome(props.school.lat, props.school.long))
const hasBus = computed(() => !!props.busTagId && !!props.school.tagIds?.includes(props.busTagId))
// A few facilities, so the card stays scannable; the school page lists them all.
const facilityNames = computed(() => (props.school.tagIds ?? [])
  .filter(id => id !== props.busTagId && props.tagNames[id])
  .map(id => props.tagNames[id] as string)
  .slice(0, 3))
const updated = computed(() => fromNowLocal(props.school.lastModifyDate))
</script>

<style scoped>
.finder-card {
  border: 1px solid rgb(var(--v-theme-grey200));
}

.finder-card--picked {
  border-color: rgb(var(--v-theme-primary));
  box-shadow: inset 0 0 0 1px rgb(var(--v-theme-primary));
}

.finder-card--active {
  box-shadow: 0 0 0 2px rgb(var(--v-theme-primary));
}

.finder-card__body {
  min-width: 0;
}

.finder-card__name {
  line-height: 1.3;
}

.finder-card__link {
  color: inherit;
  text-decoration: none;
}

.finder-card__link:hover {
  text-decoration: underline;
}

.v-theme--dark .finder-card {
  border-color: rgb(var(--v-theme-borderSubtle));
}
</style>
