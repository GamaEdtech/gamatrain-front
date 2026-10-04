<template>
  <NuxtLink
    :to="`/profile/${teacher.handle}`"
    class="w-100 h-100 d-flex flex-column ga-4 pa-4 bg-white rounded-lg text-decoration-none teacher-card"
  >
    <div class="d-flex align-start ga-3">
      <div class="teacher-avatar-holder rounded-circle position-relative d-flex align-center justify-center flex-shrink-0">
        <img
          :src="teacher.avatar || '/images/default-user.svg'"
          :alt="teacher.fullName || 'Teacher avatar'"
          class="teacher-avatar rounded-circle"
          width="72"
          height="72"
        >
        <div :class="`teacher-status-dot rounded-circle position-absolute bg-${onlineStatus.nameColor}`" />
      </div>

      <div class="d-flex flex-column align-start ga-2 min-width-0">
        <span class="text-h5 text-sm-h4 font-weight-bold text-grey900 teacher-name">
          {{ teacher.fullName || 'Unknown teacher' }}
        </span>
        <span class="text-h6 font-weight-medium text-grey500 d-flex align-center ga-1">
          <v-icon
            color="primary"
            size="18"
          >
            md:user_attributes_outlined
          </v-icon>
          {{ teacher.userRateLevel || 'Beginner' }}
        </span>
      </div>
    </div>

    <div class="d-flex align-start ga-2">
      <v-icon
        color="grey300"
        size="18"
      >
        md:wifi_outlined
      </v-icon>
      <span class="text-h6 text-grey500 font-weight-regular">
        {{ onlineStatus.text }}
      </span>
    </div>

    <div
      v-if="teacher.skills && teacher.skills.length > 0"
      class="d-flex flex-wrap ga-2"
    >
      <v-chip
        v-for="skill in teacher.skills.slice(0, 3)"
        :key="skill"
        variant="flat"
        color="primary50"
        size="small"
      >
        <span class="text-h6 font-weight-medium text-primary">
          {{ skill }}
        </span>
      </v-chip>
      <v-chip
        v-if="teacher.skills.length > 3"
        variant="flat"
        color="grey100"
        size="small"
      >
        <span class="text-h6 font-weight-medium text-grey500">
          +{{ teacher.skills.length - 3 }}
        </span>
      </v-chip>
    </div>

    <span
      v-else
      class="text-h6 font-weight-regular text-grey400"
    >
      No skills added yet
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { OnlineStatus, TeacherProfileDTO } from '@/types'

const props = defineProps<{
  teacher: TeacherProfileDTO
}>()

const userOnlineStatus: Record<OnlineStatus, { text: string, nameColor: string }> = {
  NewUser: {
    text: 'New here',
    nameColor: 'primary',
  },
  ActiveLongTimeAgo: {
    text: 'Long time no see',
    nameColor: 'grey300',
  },
  ActiveThisMonth: {
    text: 'Missing for days',
    nameColor: 'grey400',
  },
  ActiveThisWeek: {
    text: 'Was here this week',
    nameColor: 'warning300',
  },
  OnlineToday: {
    text: 'Was here today',
    nameColor: 'warning500',
  },
  ActiveRecently: {
    text: 'Be right back',
    nameColor: 'success300',
  },
  Online: {
    text: 'Online',
    nameColor: 'success500',
  },
}

const onlineStatus = computed(() => {
  return userOnlineStatus[props.teacher.onlineStatus] ?? userOnlineStatus.NewUser
})
</script>

<style scoped>
.teacher-card {
  border: 1px solid rgb(var(--v-theme-grey300));
  box-shadow: 0px 12px 30px 0px #141a270d;
  transition: 0.2s;
}
.teacher-card:hover{
  border: 1px solid rgb(var(--v-theme-primary));
  transform : translateY(-10px)
}

.teacher-avatar-holder {
  min-width: 84px;
  width: 84px;
  height: 84px;
  border: 2px solid transparent;
  background:
    linear-gradient(rgb(var(--v-theme-white)), rgb(var(--v-theme-white))) padding-box,
    linear-gradient(to right, rgb(var(--v-theme-grey700)), rgb(var(--v-theme-primary))) border-box;
}

.teacher-avatar {
  width: 72px;
  height: 72px;
  object-fit: cover;
}

.teacher-status-dot {
  width: 14px;
  height: 14px;
  right: 7px;
  top: 10px;
  border: 2px solid rgb(var(--v-theme-white));
}

.teacher-name {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.min-width-0 {
  min-width: 0;
}
</style>
