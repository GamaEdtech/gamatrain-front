<template>
  <v-card
    color="secondary"
    rounded="lg"
    flat
    tag="section"
    class="pa-4 pa-sm-6 level-header"
    aria-labelledby="level-header-title"
  >
    <div class="d-flex flex-wrap align-center ga-6">
      <v-progress-circular
        :model-value="progress.percent"
        :size="112"
        :width="8"
        color="primary"
        bg-color="onInverseSurfaceMuted"
        class="flex-shrink-0"
        :aria-label="`Profile ${progress.percent}% complete`"
      >
        <v-avatar
          :size="88"
          color="teal500"
        >
          <v-img
            v-if="avatarUri"
            :src="avatarUri"
            alt=""
            cover
          />
          <span
            v-else
            class="text-h5 font-weight-bold"
          >{{ initials }}</span>
        </v-avatar>
      </v-progress-circular>

      <div class="flex-grow-1 level-header__main">
        <!-- Who: the name and the public @username (one header for the whole dashboard; it used to repeat in a card above). -->
        <p class="ma-0 text-h6 font-weight-bold text-truncate">
          <template v-if="fullName">
            {{ fullName }}
          </template>
          <nuxt-link
            v-else
            to="/user/profile"
            class="level-header__link"
          >Add your name</nuxt-link>
        </p>
        <div class="d-flex align-center ga-1 mb-3 text-body-2 text-onInverseSurfaceSubtle">
          <nuxt-link
            v-if="handle"
            :to="`/profile/${encodeURIComponent(handle)}`"
            class="level-header__link"
          >@{{ handle }}</nuxt-link>
          <span v-else>No username yet</span>
          <v-btn
            icon
            variant="text"
            size="x-small"
            :aria-label="handle ? 'Change your username' : 'Choose a username'"
            @click="emit('editHandle')"
          >
            <v-icon size="16">
              md:edit
            </v-icon>
          </v-btn>
        </div>
        <p class="ma-0 text-caption font-weight-bold text-primary level-header__eyebrow">
          LEVEL {{ levelNumber }} OF {{ PROFILE_LEVELS.length }} · {{ progress.level.toUpperCase() }}
        </p>
        <h2
          id="level-header-title"
          class="text-h5 font-weight-bold mt-1"
        >
          {{ headline }}
        </h2>
        <v-progress-linear
          :model-value="progress.percent"
          color="primary"
          bg-color="onInverseSurfaceMuted"
          height="10"
          rounded
          class="mt-3 level-header__bar"
          aria-hidden="true"
        />
        <p class="ma-0 mt-2 text-body-2 text-onInverseSurfaceSubtle">
          Profile {{ progress.percent }}%<template v-if="progress.nextLevelAtPercent !== null">
            · {{ progress.nextLevel }} at {{ progress.nextLevelAtPercent }}%
          </template>
        </p>
      </div>

      <div class="d-flex flex-wrap ga-3 level-header__stats">
        <div class="level-header__stat">
          <p class="ma-0 text-h6 font-weight-bold text-no-wrap">
            {{ formatNumber(progress.points) }}
          </p>
          <p class="ma-0 text-caption text-onInverseSurfaceSubtle">
            points · Level {{ xpLevel.level }} {{ xpLevel.title }}
          </p>
        </div>
        <div class="level-header__stat">
          <p class="ma-0 text-h6 font-weight-bold text-no-wrap">
            {{ progress.practice.current }} {{ progress.practice.current === 1 ? 'day' : 'days' }}
          </p>
          <p class="ma-0 text-caption text-onInverseSurfaceSubtle">
            practice streak
          </p>
        </div>
        <nuxt-link
          v-if="progress.rank !== null"
          to="/leader-board"
          class="level-header__stat level-header__stat--link text-decoration-none"
        >
          <p class="ma-0 text-h6 font-weight-bold text-no-wrap">
            #{{ formatNumber(progress.rank) }}
          </p>
          <p class="ma-0 text-caption text-onInverseSurfaceSubtle">
            on the leaderboard
          </p>
        </nuxt-link>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import type { ProfileProgressDTO } from '@/types'

const props = defineProps<{
  progress: ProfileProgressDTO
  firstName?: string | null
  lastName?: string | null
  avatarUri?: string | null
  handle?: string | null
}>()
const emit = defineEmits<{ editHandle: [] }>()

const fullName = computed(() => `${props.firstName?.trim() ?? ''} ${props.lastName?.trim() ?? ''}`.trim())
// The points level (XP), shown with the points instead of in a second header.
const xpLevel = computed(() => useLevel(props.progress.points))

const { formatNumber } = useFormatNumber()

const levelNumber = computed(() => profileLevelNumber(props.progress.level))

const initials = computed(() =>
  `${props.firstName?.[0] ?? ''}${props.lastName?.[0] ?? ''}`.toUpperCase() || '?')

/** The fewest quests that reach the next level: the biggest pending ones first. */
const stepsToNext = computed(() => {
  const need = (props.progress.nextLevelAtPercent ?? 0) - props.progress.percent
  let sum = 0
  let count = 0
  for (const quest of props.progress.quests.filter(t => !t.done).sort((a, b) => b.percent - a.percent)) {
    if (sum >= need) break
    sum += quest.percent
    count++
  }
  return count
})

const headline = computed(() => {
  if (props.progress.nextLevel === null) return 'Your profile is complete'
  return `You're ${stepsToNext.value} ${stepsToNext.value === 1 ? 'step' : 'steps'} from ${props.progress.nextLevel}`
})
</script>

<style scoped>
.level-header {
  color: rgb(var(--v-theme-on-secondary));
}

.level-header__main {
  min-width: 0;
  flex-basis: 260px;
}

.level-header__link {
  color: inherit;
}

.level-header__link:hover,
.level-header__link:focus-visible {
  text-decoration: underline;
}

.level-header__eyebrow {
  letter-spacing: 0.04em;
}

.level-header__bar {
  max-width: 460px;
}

.level-header__stats {
  flex: 1 1 340px;
}

.level-header__stat {
  flex: 1 1 96px;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(var(--v-theme-on-secondary), 0.08);
  color: inherit;
}

.level-header__stat--link:hover,
.level-header__stat--link:focus-visible {
  background: rgba(var(--v-theme-on-secondary), 0.16);
}
</style>
