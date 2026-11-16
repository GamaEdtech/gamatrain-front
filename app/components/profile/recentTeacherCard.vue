<template>
  <v-card
    :to="`/profile/${teacher.handle}`"
    :ripple="false"
    flat
    rounded="lg"
    class="recent-teacher-card h-100 border-sm border-opacity-100 border-grey200 overflow-hidden"
  >
    <div class="recent-teacher-card__cover position-relative d-flex justify-end pa-3">
      <v-chip
        color="surface"
        variant="flat"
        size="small"
        class="position-relative"
      >
        <v-icon
          icon="md:person_add"
          color="primaryStrong"
          size="15"
          start
        />
        <span class="text-caption font-weight-bold text-primaryStrong">New teacher</span>
      </v-chip>
    </div>

    <div class="recent-teacher-card__body position-relative d-flex flex-column align-center px-4 pb-4 text-center">
      <v-avatar
        color="primary50"
        size="76"
        class="recent-teacher-card__avatar border-lg border-opacity-100 border-surface"
      >
        <img
          v-if="teacher.avatar"
          :src="teacher.avatar"
          :alt="`${teacher.fullName} profile`"
          width="76"
          height="76"
          loading="lazy"
          decoding="async"
          class="w-100 h-100"
        >
        <span
          v-else
          class="text-h5 font-weight-bold text-primaryStrong"
        >{{ initials }}</span>
      </v-avatar>

      <h3 class="recent-teacher-card__name text-body-1 font-weight-bold text-grey900 text-truncate mt-3">
        {{ teacher.fullName }}
      </h3>

      <div class="d-flex align-center ga-1 mt-1 text-caption font-weight-medium text-grey500">
        <span
          class="recent-teacher-card__status rounded-circle"
          :class="isRecentlyActive ? 'bg-success500' : 'bg-grey300'"
        />
        {{ activityLabel }}
      </div>

      <div class="recent-teacher-card__skills d-flex justify-center flex-wrap ga-1 mt-3 overflow-hidden">
        <v-chip
          v-for="skill in teacher.skills?.slice(0, 2)"
          :key="skill"
          color="primary50"
          variant="flat"
          size="small"
        >
          <span class="text-caption font-weight-medium text-primaryStrong">{{ skill }}</span>
        </v-chip>
      </div>

      <v-divider
        color="grey200"
        opacity="100"
        class="w-100 mt-4 mb-3"
      />

      <div class="w-100 d-flex align-center justify-space-between">
        <span class="d-flex align-center ga-1 text-caption text-grey500">
          <v-icon
            icon="md:schedule"
            size="15"
          />
          Joined recently
        </span>
        <span class="d-flex align-center ga-1 text-caption font-weight-bold text-info">
          View profile
          <v-icon
            icon="md:arrow_forward"
            size="16"
          />
        </span>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import type { OnlineStatus, TeacherProfileDTO } from '@/types'

const props = defineProps<{
  teacher: TeacherProfileDTO
}>()

const ACTIVE_STATUSES: OnlineStatus[] = ['Online', 'ActiveRecently', 'OnlineToday', 'ActiveThisWeek']

const activityLabels: Partial<Record<OnlineStatus, string>> = {
  Online: 'Online now',
  ActiveRecently: 'Active recently',
  OnlineToday: 'Active today',
  ActiveThisWeek: 'Active this week',
  NewUser: 'Just joined',
}

const initials = computed(() => props.teacher.fullName
  .split(/\s+/)
  .slice(0, 2)
  .map(word => word[0])
  .join('')
  .toUpperCase())

const isRecentlyActive = computed(() => ACTIVE_STATUSES.includes(props.teacher.onlineStatus))
const activityLabel = computed(() => activityLabels[props.teacher.onlineStatus] ?? 'Recently joined')
</script>

<style scoped>
.recent-teacher-card {
  min-height: 270px;
  transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}

.recent-teacher-card:hover {
  border-color: rgb(var(--v-theme-primary)) !important;
  box-shadow: 0 10px 24px rgba(var(--v-theme-grey900), 0.08);
  transform: translateY(-3px);
}

.recent-teacher-card__cover {
  height: 72px;
  background:
    radial-gradient(circle at 18% 35%, rgba(255, 255, 255, 0.32) 0 8px, transparent 9px),
    linear-gradient(120deg, rgb(var(--v-theme-secondary)), rgb(var(--v-theme-primaryStrong)));
}

.recent-teacher-card__body {
  min-height: 198px;
}

.recent-teacher-card__avatar {
  margin-top: -38px;
}

.recent-teacher-card__avatar img {
  object-fit: cover;
}

.recent-teacher-card__name {
  max-width: 100%;
}

.recent-teacher-card__status {
  width: 7px;
  height: 7px;
}

.recent-teacher-card__skills {
  min-height: 32px;
  max-height: 32px;
}
</style>
