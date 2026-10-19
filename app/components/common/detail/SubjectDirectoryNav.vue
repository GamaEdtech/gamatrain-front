<template>
  <nuxt-link
    v-if="directoryLink"
    :to="directoryLink"
    class="w-100 rounded-lg d-flex align-center justify-space-between flex-wrap pa-2 ga-2 mt-2 border border-grey300 subject-directory-alert"
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
      tag="span"
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

<script setup lang="ts">
const props = defineProps({
  contentData: Object,
})

const hasValue = (value: unknown) => value !== undefined && value !== null && value !== ''

// Only link when board, grade and subject are all known: empty result lists and teacher
// profiles have none of them, which used to produce ?board=undefined&grade=undefined&subject=undefined.
const directoryLink = computed(() => {
  const { section, base, lesson } = props.contentData ?? {}
  if (![section, base, lesson].every(hasValue)) return null

  return {
    path: '/subject-directory',
    query: { board: String(section), grade: String(base), subject: String(lesson) },
  }
})
</script>

<style scoped>
.subject-directory-alert {
  background-color: rgba(var(--v-theme-info), 0.15);
}
</style>
