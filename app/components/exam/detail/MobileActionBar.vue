<template>
  <!-- Keeps both actions in reach on a phone, where the action card sits below the quiz details. -->
  <div class="mobile-action-bar d-flex d-md-none ga-3 px-4 py-3 bg-white">
    <v-btn
      class="flex-1-1-0 text-h5 font-weight-heavy text-none"
      color="brandNavy"
      size="large"
      rounded="lg"
      flat
      prepend-icon="md:download"
      @click="scrollToDownloads"
    >
      Download
    </v-btn>
    <v-btn
      v-if="canStart"
      class="flex-1-1-0 text-h5 font-weight-heavy text-none text-brandNavy"
      color="primary"
      size="large"
      rounded="lg"
      flat
      prepend-icon="md:play_arrow"
      @click="startExam"
    >
      {{ hasFinished ? 'Show result' : 'Start quiz' }}
    </v-btn>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  id: string
  canStart: boolean
  hasFinished: boolean
}>()

const { startExam } = useExamStart(() => props.id)

const scrollToDownloads = () => {
  document.getElementById('exam-downloads')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>

<style scoped>
/* Sits on top of the site's bottom navigation, which the default layout shows on mobile. */
.mobile-action-bar {
  position: sticky;
  bottom: calc(var(--bottom-nav-height) + env(safe-area-inset-bottom, 0px));
  z-index: 998;
  border-top: 1px solid rgb(var(--v-theme-grey200));
  box-shadow: 0 -8px 24px -12px rgba(var(--v-theme-brandNavy), 0.25);
}
</style>
