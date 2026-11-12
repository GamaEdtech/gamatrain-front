<template>
  <section class="recent-teachers rounded-lg border-sm border-opacity-100 border-grey200 pa-4 pa-sm-6">
    <div class="d-flex flex-column flex-sm-row align-sm-end justify-space-between ga-3 mb-5">
      <div>
        <span class="text-caption font-weight-bold text-primaryStrong text-uppercase">New to GamaTrain</span>
        <h2 class="text-h6 text-sm-h4 font-weight-bold text-grey900 mt-1">
          Meet recently joined teachers
        </h2>
        <p class="text-body-1 text-grey500 mt-1">
          Discover more educators and explore what they teach.
        </p>
      </div>
      <v-btn
        to="/teacher"
        variant="text"
        color="info"
        class="align-self-start align-self-sm-auto"
      >
        Browse all teachers
        <v-icon
          icon="md:arrow_forward"
          end
          size="18"
        />
      </v-btn>
    </div>

    <v-slide-group
      show-arrows
      class="recent-teachers__slider"
    >
      <template #prev>
        <v-btn
          icon="md:chevron_left"
          color="surface"
          variant="flat"
          size="small"
          class="border-sm border-opacity-100 border-grey200"
          aria-label="Previous teachers"
        />
      </template>

      <template #next>
        <v-btn
          icon="md:chevron_right"
          color="surface"
          variant="flat"
          size="small"
          class="border-sm border-opacity-100 border-grey200"
          aria-label="Next teachers"
        />
      </template>

      <v-slide-group-item
        v-for="teacher in recentTeachers"
        :key="teacher.handle"
      >
        <div class="recent-teachers__item flex-shrink-0 pa-2">
          <ProfileRecentTeacherCard :teacher="teacher" />
        </div>
      </v-slide-group-item>
    </v-slide-group>
  </section>
</template>

<script setup lang="ts">
import type { TeacherProfileDTO } from '@/types'

const recentTeachers: TeacherProfileDTO[] = [
  {
    avatar: '/images/member/fahim-kavian.jpeg',
    fullName: 'Fahim Kavian',
    onlineStatus: 'ActiveRecently',
    userRateLevel: 'New teacher',
    skills: ['Mathematics', 'Algebra'],
    handle: 'fahim-kavian',
  },
  {
    avatar: '/images/member/mohammad-salehi.jpeg',
    fullName: 'Mohammad Salehi',
    onlineStatus: 'OnlineToday',
    userRateLevel: 'New teacher',
    skills: ['Physics', 'Mechanics'],
    handle: 'mohammad-salehi',
  },
  {
    avatar: '/images/member/mehdi-zare.png',
    fullName: 'Mehdi Zare',
    onlineStatus: 'ActiveThisWeek',
    userRateLevel: 'New teacher',
    skills: ['Chemistry', 'Science'],
    handle: 'mehdi-zare',
  },
  {
    avatar: '/images/member/ramin-naderi.png',
    fullName: 'Ramin Naderi',
    onlineStatus: 'NewUser',
    userRateLevel: 'New teacher',
    skills: ['Biology', 'IGCSE'],
    handle: 'ramin-naderi',
  },
  {
    avatar: '/images/member/sadeq-naderi.png',
    fullName: 'Sadeq Naderi',
    onlineStatus: 'ActiveRecently',
    userRateLevel: 'New teacher',
    skills: ['Computer Science', 'Programming'],
    handle: 'sadeq-naderi',
  },
  {
    avatar: '/images/member/ali-poorbazargan.png',
    fullName: 'Ali Poorbazargan',
    onlineStatus: 'ActiveThisWeek',
    userRateLevel: 'New teacher',
    skills: ['English', 'Literature'],
    handle: 'ali-poorbazargan',
  },
]
</script>

<style scoped>
.recent-teachers {
  background: linear-gradient(145deg, rgb(var(--v-theme-grey50)), rgb(var(--v-theme-surface)));
  box-shadow: 0 12px 30px rgba(var(--v-theme-grey400), 0.14);
}

.recent-teachers__item {
  width: 240px;
}

.recent-teachers__slider :deep(.v-slide-group__content) {
  align-items: stretch;
}

@media (max-width: 600px) {
  .recent-teachers__item {
    width: 220px;
  }
}
</style>
