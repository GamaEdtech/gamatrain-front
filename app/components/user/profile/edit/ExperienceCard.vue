<template>
  <v-card
    flat
    rounded="lg"
    border
    tag="section"
    class="pa-4 pa-sm-6 experience-card"
    aria-labelledby="experience-card-title"
  >
    <div class="d-flex flex-wrap justify-space-between align-center ga-2">
      <h2
        id="experience-card-title"
        class="text-h6 font-weight-bold text-grey900"
      >
        School history
      </h2>
      <v-btn
        variant="tonal"
        color="secondary"
        class="text-none"
        prepend-icon="mdi-plus"
        @click="emit('add')"
      >
        Add a school
      </v-btn>
    </div>
    <p class="ma-0 mt-1 text-body-2 text-grey600">
      Schools you've studied or worked at, with the years you were there.
    </p>

    <v-list
      v-if="sorted.length"
      class="pa-0 mt-2"
      bg-color="transparent"
    >
      <v-list-item
        v-for="item in sorted"
        :key="item.id"
        class="px-0 experience-card__row"
      >
        <v-list-item-title class="font-weight-medium text-grey900 text-wrap">
          <nuxt-link
            v-if="item.schoolId"
            :to="`/school/${item.schoolId}`"
            class="text-grey900 text-decoration-none experience-card__school"
          >
            {{ item.schoolTitle || 'School' }}
          </nuxt-link>
          <span v-else>{{ item.schoolTitle || 'School' }}</span>
        </v-list-item-title>
        <v-list-item-subtitle class="text-wrap">
          {{ years(item) }}<template v-if="item.description">
            · {{ item.description }}
          </template>
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
    <p
      v-else
      class="ma-0 mt-3 text-body-2 text-grey700"
    >
      No schools yet. Adding one completes the biggest level-up quest.
    </p>
  </v-card>
</template>

<script setup lang="ts">
import type { ExperienceDTO } from '@/types'

const props = defineProps<{ experiences: ExperienceDTO[] }>()
const emit = defineEmits<{ add: [] }>()

/** Most recent first; a school you're still at (no end date) on top. */
const sorted = computed(() => [...props.experiences].sort((a, b) =>
  (b.endDate ? Date.parse(b.endDate) : Infinity) - (a.endDate ? Date.parse(a.endDate) : Infinity)
  || Date.parse(b.startDate) - Date.parse(a.startDate)))

const year = (value: string) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : String(date.getFullYear())
}

const years = (item: ExperienceDTO) => {
  const from = year(item.startDate)
  const to = item.endDate ? year(item.endDate) : 'now'
  return from ? `${from} – ${to}` : ''
}
</script>

<style scoped>
.experience-card {
  border-color: rgb(var(--v-theme-borderSubtle)) !important;
}

.experience-card__row + .experience-card__row {
  border-top: 1px solid rgb(var(--v-theme-borderSubtle));
}

.experience-card__school:hover,
.experience-card__school:focus-visible {
  text-decoration: underline !important;
}
</style>
