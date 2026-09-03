<template>
  <nuxt-link
    :to="`/subject-directory?board=${contentData?.section}&grade=${contentData?.base}&subject=${contentData?.lesson}`"
    class="w-100 rounded-lg d-flex align-center justify-space-between flex-wrap pa-2 ga-2 mt-2 subject-directory-alert"
  >
    <div class="d-flex align-center ga-2">
      <v-avatar
        size="40"
        color="info"
        rounded="lg"
      >
        <v-icon color="white">md:newsstand</v-icon>
      </v-avatar>
      <div class="d-flex flex-column align-start">
        <span class="text-h5 font-weight-bold text-grey700">
          {{ contentData?.lesson_title }} Subject directory
        </span>
        <span class="text-h6 font-weight-medium text-grey500">
          All resources in one place
        </span>
      </div>
    </div>
    <v-btn
      class="bg-white"
      flat
      width="120"
      density="compact"
      rounded="lg"
    >
      <span class="text-h6 font-weight-medium text-grey500">
        Open directory
        <v-icon>md:arrow_right_alt</v-icon>
      </span>
    </v-btn>
  </nuxt-link>
</template>

<script setup>
defineProps({
  contentData: Object,
})
</script>

<style scoped>
.subject-directory-alert {
  background-color: rgba(var(--v-theme-info),0.15);
  border : 1px solid rgb(var(--v-theme-grey300))
}
</style>
