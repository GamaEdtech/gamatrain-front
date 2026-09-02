<template>
  <v-row>
    <template
      v-for="(item, index) in button_list"
      :key="index"
    >
      <v-col
        v-if="!isLocked(item.class)"
        cols="12"
        sm="6"
      >
        <div
          class="dashboard-card pa-4 d-flex align-center justify-space-between ga-2"
          :class="{ 'opacity-55': isLocked(item.class) }"
        >
          <div class="d-flex align-center ga-3">
            <v-avatar
              :color="item.color"
              variant="tonal"
              rounded="lg"
              size="44"
            >
              <span :class="`${item.icon} icon-size`" />
            </v-avatar>
            <div>
              <p class="text-h5 font-weight-bold text-grey900 mb-0">
                {{ item.title }}
              </p>
              <p class="text-h6 font-weight-medium text-grey500 mb-0">
                <template v-if="isLocked(item.class)">
                  Unlocks for teachers
                </template>
                <template v-else>
                  {{ item.count }} {{ item.countLabel }}
                </template>
              </p>
            </div>
          </div>

          <v-btn
            v-if="!isLocked(item.class)"
            class="text-subtitle-1 text-white font-weight-bold"
            :color="item.color"
            variant="flat"
            rounded="pill"
            size="small"
            :to="item.createLink"
          >
            + {{ item.actionLabel }}
          </v-btn>
          <v-icon
            v-else
            color="grey400"
          >
            md:lock_outlined
          </v-icon>
        </div>
      </v-col>
    </template>
  </v-row>
</template>

<script setup lang="ts">
import type { DashboardStatsDTO } from '@/types'
import { CONTENT_TYPE_META } from '@/constants'

interface ICreateContentButton {
  data: DashboardStatsDTO
  roles: string[]
}

const props = defineProps<ICreateContentButton>()

const isLocked = (className: string) => props.roles.includes('Student') && className !== 'question_answer'

const button_list = reactive([
  {
    class: 'sample_exam',
    count: props.data?.test?.total || 0,
    countLabel: 'published',
    actionLabel: 'New Past Paper',
    ...CONTENT_TYPE_META.pastPaper,
  },
  {
    class: 'training_content',
    count: props.data?.file?.total || 0,
    countLabel: 'published',
    actionLabel: 'Add Multimedia',
    ...CONTENT_TYPE_META.multimedia,
  },
  {
    class: 'question_answer',
    count: props.data?.question?.total || 0,
    countLabel: 'questions',
    actionLabel: 'Ask a Question',
    ...CONTENT_TYPE_META.forum,
  },
])
</script>

<style scoped>
.dashboard-card {
  border-radius: 1rem;
  border: 1px solid rgb(var(--v-theme-grey200));
}
.icon-size{
  font-size : 26px;
}
</style>
