<template>
  <!-- Keeps both actions in reach on a phone, where the action card sits below the quiz details.
       The outer box keeps the bar's height in the page flow so the fixed bar never covers the page's last lines. -->
  <div class="mobile-action-bar-spacer d-md-none">
    <div class="mobile-action-bar d-flex ga-3 px-4 py-3 bg-surface">
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
        class="flex-1-1-0 text-h5 font-weight-heavy text-none"
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
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  /** The quiz Start opens. */
  id: string
  canStart: boolean
  hasFinished: boolean
  /** The download section Download scrolls to; the past paper page reuses this bar with its own. */
  downloadsId?: string
}>(), {
  downloadsId: 'exam-downloads',
})

const { startExam } = useExamStart(() => props.id)

const scrollToDownloads = () => {
  document.getElementById(props.downloadsId)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>

<style scoped>
.mobile-action-bar-spacer {
  height: calc(72px + env(safe-area-inset-bottom, 0px));
}
/* The pages that use this bar hide the site's bottom navigation (hideBottomNav), so it sits at the screen's edge. */
.mobile-action-bar {
  position: fixed;
  right: 0;
  bottom: 0;
  padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px)) !important;
  left: 0;
  z-index: 998;
  border-top: 1px solid rgb(var(--v-theme-grey200));
  box-shadow: 0 -8px 24px -12px rgba(var(--v-theme-brandNavy), 0.25);
}
</style>
