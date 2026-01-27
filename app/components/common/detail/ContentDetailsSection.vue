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
      <p class="text-h5 font-weight-bold">
        {{ contentData?.first_name }} {{ contentData?.last_name }}
      </p>
    </div>
    <span class="text-h5 d-flex align-center color-link ga-1">
      <v-icon color="#1a73e8">md:notifications_outlined</v-icon>
      follow
    </span>
  </div>

  <div
    :class="`w-100 text-h5 mt-4 position-relative ${
      seeCompleteDescription ? `open-description` : `close-description`
    }`"
  >
    <div
      v-if="!seeCompleteDescription"
      class="blur-div position-absolute h-100 w-100 left-0 bottom-0"
    />
    {{ contentData?.description }}
  </div>
  <span
    class="w-100 cursor-pointer text-h5 d-flex align-center color-link ga-1 mt-1"
    @click="seeCompleteDescription = !seeCompleteDescription"
  >
    {{ seeCompleteDescription ? `See Less` : `See More` }}
    <v-icon color="#1a73e8">md:chevron_forward</v-icon>
  </span>

  <div class="w-100 d-flex align-center justify-space-between mt-8">
    <span class="text-h5 d-flex align-center primary-gray-600 ga-1">
      <v-icon color="#475467">md:files_outlined</v-icon>
      {{ contentData?.test_type_title }}
    </span>
    <span class="text-h5 d-flex align-center primary-gray-600 ga-1">
      <v-icon color="#475467">md:update</v-icon>
      {{ $dayjs(contentData?.up_date).fromNow() }}
    </span>
  </div>

  <div class="w-100 d-flex flex-wrap ga-2 mt-3">
    <v-chip
      class="bg-primary-gray-100"
      :small="mdAndDown"
      :to="`/search?type=paper&section=${contentData?.section}`"
      flat
    >
      <span class="primary-gray-500 text-h6 font-weight-bold">
        {{ contentData?.section_title }}</span>
    </v-chip>
    <v-chip
      class="bg-primary-gray-100"
      flat
      :small="mdAndDown"
      :to="`/search?type=paper&section=${contentData?.section}&base=${contentData?.base}`"
    >
      <span class="primary-gray-500 text-h6 font-weight-bold">
        {{ contentData?.base_title }}</span>
    </v-chip>
    <v-chip
      class="bg-primary-gray-100"
      flat
      :small="mdAndDown"
      :to="`/search?type=paper&section=${contentData?.section}&base=${contentData?.base}&lesson=${contentData?.lesson}`"
    >
      <span class="primary-gray-500 text-h6 font-weight-bold">
        {{ contentData?.lesson_title }}</span>
    </v-chip>
    <v-chip
      class="bg-primary-gray-100"
      flat
      :small="mdAndDown"
    >
      <span class="primary-gray-500 text-h6 font-weight-bold">
        {{ contentData?.edu_month_title }}</span>
    </v-chip>
    <v-chip
      :small="mdAndDown"
      :to="`/search?type=paper&section=${contentData?.section}&base=${contentData?.base}&lesson=${contentData?.lesson}&edu_year=${contentData?.edu_year}`"
      class="bg-primary-gray-100"
      flat
    >
      <span class="primary-gray-500 text-h6 font-weight-bold">
        {{ contentData?.edu_year }}</span>
    </v-chip>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

interface IContentDetailsSection {
  avatar: string
  first_name: string
  last_name: string
  description: string
  test_type_title?: string
  up_date: string
  section: string
  section_title: string
  base: string
  base_title: string
  lesson: string
  lesson_title: string
  edu_month_title: string
  edu_year: string
}

defineProps<{
  contentData: IContentDetailsSection
}>()

const { $dayjs } = useNuxtApp()
const { mdAndDown } = useDisplay()

const seeCompleteDescription = ref(false)
</script>

<style scoped>
.color-link {
  color: #1a73e8;
}
.open-description {
  height: unset;
  min-height: 70px;
  overflow: unset;
}
.close-description {
  height: 70px;
  overflow: hidden;
}
.blur-div {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 80%);
}
</style>
