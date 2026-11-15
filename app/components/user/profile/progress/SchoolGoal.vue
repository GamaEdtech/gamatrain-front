<template>
  <v-card
    flat
    rounded="lg"
    border
    tag="section"
    class="school-goal overflow-hidden"
    aria-labelledby="school-goal-title"
  >
    <template v-if="school">
      <div class="pa-4 bg-teal500">
        <p class="ma-0 text-caption font-weight-bold school-goal__eyebrow">
          YOUR SCHOOL'S GOAL
        </p>
        <h2
          id="school-goal-title"
          class="text-h6 font-weight-bold mt-1"
        >
          <nuxt-link
            :to="`/school/${school.id}`"
            class="text-decoration-none school-goal__name"
          >{{ school.name || 'Your school' }}</nuxt-link>: {{ school.reviewGoal }} reviews
        </h2>
      </div>

      <div class="pa-4 d-flex flex-column ga-3">
        <div>
          <div class="d-flex justify-space-between text-body-2">
            <span class="font-weight-bold text-grey900">{{ school.reviews }} of {{ school.reviewGoal }} reviews</span>
            <span class="text-grey600">{{ school.reviewGoal - school.reviews }} to go</span>
          </div>
          <v-progress-linear
            :model-value="(school.reviews / school.reviewGoal) * 100"
            color="teal500"
            bg-color="surfaceTertiary"
            bg-opacity="1"
            height="10"
            rounded
            class="mt-2"
            :aria-label="`${school.reviews} of ${school.reviewGoal} reviews`"
          />
        </div>

        <p
          v-if="communityLine"
          class="ma-0 text-body-2 text-grey700"
        >
          {{ communityLine }}
        </p>

        <v-list
          class="pa-0"
          bg-color="transparent"
        >
          <v-list-item
            v-for="action in actions"
            :key="action.key"
            :to="action.to"
            :disabled="!action.to"
            rounded="lg"
            border
            class="mb-2 school-goal__action"
          >
            <v-list-item-title class="font-weight-medium text-grey900 text-wrap">
              {{ action.title }}
            </v-list-item-title>
            <v-list-item-subtitle class="text-wrap">
              {{ action.hint }}
            </v-list-item-subtitle>
            <template
              v-if="action.points"
              #append
            >
              <v-chip
                size="small"
                color="primaryStrong"
                variant="tonal"
                class="font-weight-bold ms-2"
              >
                +{{ formatNumber(action.points) }} points
              </v-chip>
            </template>
          </v-list-item>
        </v-list>
      </div>
    </template>

    <div
      v-else
      class="pa-4 d-flex flex-column align-start ga-2"
    >
      <h2
        id="school-goal-title"
        class="text-h6 font-weight-bold text-grey900"
      >
        Add your school
      </h2>
      <p class="ma-0 text-body-2 text-grey700">
        Pick your school below to see how it's doing on GamaTrain and help it grow, one review or photo at a time.
      </p>
      <v-btn
        variant="tonal"
        color="secondary"
        class="text-none"
        prepend-icon="md:school"
        @click="emit('pick-school')"
      >
        Pick your school
      </v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import type { ProfileSchoolDTO } from '@/types'

const props = defineProps<{ school: ProfileSchoolDTO | null }>()
const emit = defineEmits<{ 'pick-school': [] }>()

const { formatNumber } = useFormatNumber()

const plural = (count: number, one: string, many: string) => `${formatNumber(count)} ${count === 1 ? one : many}`

/** Counts only: students are never named (see the backend's "School members" rule). */
const communityLine = computed(() => {
  const school = props.school
  if (!school) return ''
  const people = [
    school.students ? plural(school.students, 'student', 'students') : '',
    school.teachers ? plural(school.teachers, 'teacher', 'teachers') : '',
  ].filter(Boolean)
  const members = people.length ? `${people.join(' and ')} from your school ${school.students + school.teachers === 1 ? 'is' : 'are'} on GamaTrain.` : ''
  const helpers = school.helpersThisMonth ? ` ${plural(school.helpersThisMonth, 'person', 'people')} helped it this month.` : ''
  return `${members}${helpers}`.trim()
})

const actions = computed(() => {
  const school = props.school
  if (!school) return []
  const page = `/school/${school.id}`
  const review = school.myReview === 'Confirmed'
    ? { title: 'You reviewed your school', hint: 'Thanks, it counts towards the goal', to: undefined, points: 0 }
    : school.myReview === 'Review'
      ? { title: 'Your review is waiting for a check', hint: 'It counts once our team approves it', to: undefined, points: 0 }
      : { title: 'Review your school', hint: 'Counts towards the goal', to: `${page}#contribute=review`, points: school.reviewPoints }

  return [
    { key: 'review', ...review },
    { key: 'photo', title: 'Add a photo of your school', hint: 'Checked by our team first', to: `${page}#contribute=photo`, points: school.photoPoints },
    { key: 'details', title: 'Fill in your school\'s details', hint: 'Address, phone, website and more', to: page, points: school.editPoints },
  ]
})
</script>

<style scoped>
.school-goal {
  border-color: rgb(var(--v-theme-borderSubtle)) !important;
}

.school-goal__eyebrow {
  letter-spacing: 0.04em;
  opacity: 0.85;
}

.school-goal__name {
  color: inherit;
}

.school-goal__name:hover,
.school-goal__name:focus-visible {
  text-decoration: underline !important;
}

.school-goal__action {
  border-color: rgb(var(--v-theme-borderSubtle)) !important;
}
</style>
