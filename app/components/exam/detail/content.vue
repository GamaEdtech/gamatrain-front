<template>
  <div class="w-100 d-flex align-center justify-space-between">
    <div class="ga-1 d-flex align-center">
      <v-img
        width="48"
        height="48"
        :src="contentData?.avatar"
        class="rounded-circle"
        alt="user profile"
      />
      <p class="text-grey700 text-h5 font-weight-bold">
        {{ contentData?.first_name }} {{ contentData?.last_name }}
      </p>
    </div>
    <span class="text-h5 d-flex align-center text-info ga-1">
      <v-icon color="info">md:notifications_outlined</v-icon>
      follow
    </span>
  </div>

  <div
    class="d-flex align-center flex-wrap w-100 bg-grey100 mt-2 rounded-lg pa-4"
  >
    <span class="w-50 text-grey700 font-weight-medium text-h5">
      <v-icon>md:play_circle</v-icon>
      Start:
      {{ contentData.start_date ? contentData.start_date : "-" }}
    </span>

    <span class="w-50 text-grey700 font-weight-medium text-h5">
      <v-icon>md:stop_circle</v-icon>
      End:
      {{ contentData.end_date ? contentData.end_date : "-" }}
    </span>

    <span class="w-50 text-grey700 font-weight-medium text-h5 mt-2">
      <v-icon>md:alarm</v-icon>
      Duration:
      {{ contentData.azmoon_time }}
    </span>

    <div
      v-if="contentData.topics && contentData.topics.length > 0"
      class="w-100 mt-2 d-flex flex-column"
    >
      <span
        class="text-grey700 font-weight-medium text-h5"
      >
        <v-icon>
          md:list
        </v-icon>
        Topics:
      </span>
      <ul class="ml-4 mt-4">
        <li
          v-for="(item, index) in contentData.topics"
          :key="index"
          class="text-grey700 font-weight-medium text-h6"
        >
          {{ item.title }}
        </li>
      </ul>
    </div>
  </div>

  <div class="w-100 d-flex align-center justify-space-between mt-4">
    <span class="text-h5 d-flex align-center text-grey600 ga-1">
      <v-icon color="grey600">md:files_outlined</v-icon>
      {{ contentData?.azmoon_type_title }}
    </span>
    <span class="text-h5 d-flex align-center text-grey600 ga-1">
      <v-icon color="grey600">md:update</v-icon>
      {{ fromNowLocal(contentData?.up_date) }}
    </span>
  </div>

  <div class="w-100 d-flex flex-wrap ga-2 mt-3">
    <v-chip
      class="bg-grey100"
      :small="mdAndDown"
      :to="`/search?type=quizhub&section=${contentData?.section}`"
      flat
    >
      <span class="text-grey500 text-h6 font-weight-bold">
        {{ contentData?.section_title }}</span>
    </v-chip>
    <v-chip
      class="bg-grey100"
      flat
      :small="mdAndDown"
      :to="`/search?type=quizhub&section=${contentData?.section}&base=${contentData?.base}`"
    >
      <span class="text-grey500 text-h6 font-weight-bold">
        {{ contentData?.base_title }}</span>
    </v-chip>
    <v-chip
      class="bg-grey100"
      flat
      :small="mdAndDown"
      :to="`/search?type=quizhub&section=${contentData?.section}&base=${contentData?.base}&lesson=${contentData?.lesson}`"
    >
      <span class="text-grey500 text-h6 font-weight-bold">
        {{ contentData?.lesson_title }}</span>
    </v-chip>
  </div>
</template>

<script setup lang="ts">
import type { ExamDetaiDTO } from '@/types'
import { useDisplay } from 'vuetify'

defineProps<{
  contentData: ExamDetaiDTO
}>()

const { fromNowLocal } = useDateTime()
const { mdAndDown } = useDisplay()
</script>

<style scoped>
</style>
