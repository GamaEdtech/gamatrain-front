<template>
  <article
    class="finder-row d-flex ga-4 py-4"
    :class="{ 'finder-row--active': active }"
  >
    <!-- Fixed box for the photo, so the list never shifts while photos load. -->
    <v-img
      v-if="photo"
      :src="photo"
      :alt="school.name"
      width="112"
      height="84"
      max-width="112"
      cover
      class="flex-shrink-0 rounded bg-grey100"
      @error="onPhotoError"
    />

    <div class="flex-grow-1 finder-row__body">
      <div class="d-flex align-start ga-3">
        <component
          :is="headingTag"
          class="text-body-1 font-weight-semibold text-grey900 ma-0 flex-grow-1 finder-row__name"
        >
          <nuxt-link
            :to="schoolLink"
            class="finder-row__link"
          >{{ school.name }}</nuxt-link>
        </component>
        <span
          v-if="school.rating"
          class="text-body-2 font-weight-semibold text-grey800 text-no-wrap"
        >
          ★ {{ school.rating.toFixed(1) }}<span
            v-if="school.reviewCount"
            class="font-weight-regular text-grey600"
          > ({{ school.reviewCount }})</span>
        </span>
      </div>

      <p
        v-if="detailLine"
        class="ma-0 mt-1 text-body-2 text-grey600"
      >
        {{ detailLine }}
      </p>

      <div class="d-flex align-center ga-2 mt-1">
        <p
          v-if="tripLine"
          class="ma-0 text-body-2 text-grey800 flex-grow-1"
        >
          {{ tripLine }}
        </p>
        <v-spacer v-else />
        <v-btn
          variant="text"
          size="small"
          density="comfortable"
          :color="picked ? 'primaryStrong' : 'grey600'"
          :prepend-icon="picked ? 'md:check' : 'md:add'"
          :aria-pressed="picked"
          class="text-none px-2"
          @click="emit('toggle-compare')"
        >
          {{ picked ? 'Comparing' : 'Compare' }}
        </v-btn>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { SchoolListDTO } from '@/types'

const props = withDefaults(defineProps<{
  school: SchoolListDTO
  picked?: boolean
  active?: boolean
  busTagId?: number | null
  headingTag?: string
}>(), {
  picked: false,
  active: false,
  busTagId: null,
  headingTag: 'h2',
})

const emit = defineEmits<{ 'toggle-compare': [] }>()

const { photo, onPhotoError, locationLine } = useSchoolCard(() => props.school)
const { tripFromHome } = useSchoolHome()

const schoolLink = computed(() => `/school/${props.school.id}/${props.school.slug}`)
const hasBus = computed(() => !!props.busTagId && !!props.school.tagIds?.includes(props.busTagId))

// One quiet line each: what and where, then how far. Everything else is on the school page.
const detailLine = computed(() => [schoolTypeLabel(props.school.schoolType), locationLine.value, hasBus.value ? 'School bus' : '']
  .filter(Boolean)
  .join(' · '))

const tripLine = computed(() => {
  const trip = tripFromHome(props.school.lat, props.school.long)
  return trip?.summary ?? ''
})
</script>

<style scoped>
.finder-row {
  border-bottom: 1px solid rgb(var(--v-theme-grey100));
}

.finder-row--active {
  background: rgb(var(--v-theme-grey50));
}

.finder-row__body {
  min-width: 0;
}

.finder-row__name {
  line-height: 1.35;
}

.finder-row__link {
  color: inherit;
  text-decoration: none;
}

.finder-row__link:hover {
  text-decoration: underline;
}

.v-theme--dark .finder-row {
  border-color: rgb(var(--v-theme-borderSubtle));
}
</style>
