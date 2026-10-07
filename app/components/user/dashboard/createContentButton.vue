<template>
  <div class="d-flex flex-wrap justify-space-between ga-2 w-100 ma-0">
    <div
      v-for="(item, index) in button_list"
      :key="index"
      class="dashboard-card pa-4 d-flex align-center justify-space-between ga-2"
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
            {{ item.count }} {{ item.countLabel }}
          </p>
        </div>
      </div>

      <v-btn
        class="text-subtitle-1 text-white font-weight-bold"
        :color="item.color"
        variant="flat"
        rounded="pill"
        size="small"
        :to="item.createLink"
      >
        + {{ item.actionLabel }}
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DashboardStatsDTO } from '@/types'
import { CONTENT_TYPE_META } from '@/constants'

interface ICreateContentButton {
  data: DashboardStatsDTO
}

const props = defineProps<ICreateContentButton>()

const button_list = reactive([
  {
    class: 'sample_exam',
    count: props.data?.test?.total || 0,
    countLabel: 'published',
    actionLabel: 'New Past Paper',
    ...CONTENT_TYPE_META.pastPaper,
  },
  {
    class: 'online_exam',
    count: props.data?.test?.total || 0,
    countLabel: 'published',
    actionLabel: 'New Quiz',
    ...CONTENT_TYPE_META.exam,
  },
])
</script>

<style scoped>
.dashboard-card {
  border-radius: 1rem;
  border: 1px solid rgb(var(--v-theme-grey200));
  width : 49%
}
.icon-size{
  font-size : 26px;
}
@media screen and (max-width: 600px) {
  .dashboard-card {
    width : 100%;
  }
}
</style>
