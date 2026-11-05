<template>
  <v-card
    :to="`/profile/${teacher.handle}`"
    :ripple="false"
    flat
    rounded="xl"
    class="teacher-card d-flex flex-sm-column align-center ga-3 h-100 pa-3 px-sm-4 py-sm-5 text-sm-center"
  >
    <v-avatar
      class="teacher-card__avatar flex-shrink-0"
      color="primary50"
    >
      <!-- A plain <img>: v-avatar's `image` prop goes through v-img, which leaves the picture out of the server HTML. -->
      <img
        v-if="teacher.avatar"
        :src="teacher.avatar"
        alt=""
        width="80"
        height="80"
        loading="lazy"
        decoding="async"
        class="w-100 h-100"
      >
      <span
        v-else
        class="text-h5 text-sm-h3 font-weight-bold text-primaryStrong"
      >{{ initials }}</span>
    </v-avatar>

    <div class="teacher-card__body flex-grow-1">
      <h3 class="text-h5 font-weight-bold text-grey900 text-truncate">
        {{ name }}
      </h3>

      <span
        v-if="activity"
        class="d-inline-flex align-center ga-1 mt-1 text-h6 font-weight-medium text-grey600"
      >
        <span class="teacher-card__dot rounded-circle bg-success500" />
        {{ activity }}
      </span>

      <div
        v-if="skills.length"
        class="d-flex flex-sm-wrap justify-sm-center ga-1 mt-2 overflow-hidden"
      >
        <v-chip
          v-for="skill in skills.slice(0, MAX_SKILLS)"
          :key="skill"
          variant="flat"
          color="primary50"
          size="small"
          class="teacher-card__skill"
        >
          <span class="text-h6 font-weight-medium text-primaryStrong text-truncate">{{ skill }}</span>
        </v-chip>
        <v-chip
          v-if="skills.length > MAX_SKILLS"
          variant="flat"
          color="grey100"
          size="small"
          class="flex-shrink-0"
        >
          <span class="text-h6 font-weight-medium text-grey600">+{{ skills.length - MAX_SKILLS }}</span>
        </v-chip>
      </div>
    </div>

    <v-icon
      class="d-sm-none flex-shrink-0"
      color="grey400"
    >
      mdi-chevron-right
    </v-icon>
  </v-card>
</template>

<script setup lang="ts">
import type { OnlineStatus, TeacherProfileDTO } from '@/types'

const props = defineProps<{
  teacher: TeacherProfileDTO
}>()

const MAX_SKILLS = 2

// Day-level wording: this list is cached at the edge, so a live "Online" could be hours old. Teachers who have been
// away show nothing, so the list doesn't advertise it.
const ACTIVITY_TEXT: Partial<Record<OnlineStatus, string>> = {
  Online: 'Active today',
  ActiveRecently: 'Active today',
  OnlineToday: 'Active today',
  ActiveThisWeek: 'Active this week',
}

const name = computed(() => props.teacher.fullName?.trim() || 'GamaTrain teacher')
const initials = computed(() => name.value.split(/\s+/).slice(0, 2).map(word => word[0]).join('').toUpperCase())
const activity = computed(() => ACTIVITY_TEXT[props.teacher.onlineStatus])
const skills = computed(() => props.teacher.skills ?? [])
</script>

<style scoped lang="scss">
@use 'sass:map';
@use 'vuetify/settings' as vuetify;

.teacher-card {
  border: 1px solid rgb(var(--v-theme-grey200));
  transition: border-color 0.2s;

  &:hover {
    border-color: rgb(var(--v-theme-primary));
  }
}

.teacher-card__avatar {
  width: 5.6rem;
  height: 5.6rem;
  // v-avatar animates its size, which would shift the rows below while the page loads.
  transition: none;

  img {
    object-fit: cover;
  }
}

.teacher-card__body {
  min-width: 0;
  max-width: 100%;
}

.teacher-card__dot {
  width: 0.7rem;
  height: 0.7rem;
}

.teacher-card__skill {
  max-width: 100%;
  min-width: 0;

  :deep(.v-chip__content) {
    min-width: 0;
  }
}

@media #{map.get(vuetify.$display-breakpoints, 'sm-and-up')} {
  // A card without an activity line stays as tall as its neighbours.
  .teacher-card {
    min-height: 17.6rem;
  }

  .teacher-card__avatar {
    width: 8rem;
    height: 8rem;
  }
}
</style>
