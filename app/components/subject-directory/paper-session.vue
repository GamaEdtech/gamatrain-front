<template>
  <v-infinite-scroll
    ref="infiniteScroll"
    class="directory-session-results"
    :aria-label="label"
    :aria-busy="state.loading"
    :margin="160"
    @load="load"
  >
    <subject-directory-paper-row
      v-for="paper in state.items"
      :key="paper.id"
      :paper="paper"
      :subject-title="subjectTitle"
      :downloads="downloads"
    />
    <template #loading>
      <div
        v-if="state.hasMore"
        class="d-flex align-center justify-center ga-3 pa-4 text-grey600"
        role="status"
      >
        <v-progress-circular
          indeterminate
          size="24"
          width="2"
          color="directoryInk"
        />
        <span>Loading papers…</span>
      </div>
    </template>
    <template #empty>
      <p
        v-if="state.loaded && !state.items.length"
        class="pa-6 ma-0 text-grey600 text-center"
        role="status"
      >
        No papers match these filters.
      </p>
    </template>
    <template #error="{ props: retryProps }">
      <div
        class="d-flex align-center justify-center flex-wrap ga-3 pa-4"
        role="alert"
      >
        <span class="text-grey600">Unable to load papers.</span>
        <v-btn
          v-bind="retryProps"
          variant="text"
          color="directoryInk"
          class="text-none"
        >
          Retry
        </v-btn>
      </div>
    </template>
  </v-infinite-scroll>
</template>

<script setup>
const props = defineProps({
  state: { type: Object, required: true },
  active: { type: Boolean, default: false },
  label: { type: String, required: true },
  subjectTitle: { type: String, default: '' },
  downloads: { type: Object, required: true },
  loadPage: { type: Function, required: true },
})
const infiniteScroll = ref(null)
const load = async ({ done }) => {
  if (!props.active) return done('empty')
  const status = await props.loadPage()
  done(status === 'cancelled' ? 'empty' : status)
}
watch(() => props.active, async (active) => {
  if (active) {
    await nextTick()
    infiniteScroll.value?.reset('end')
  }
})
</script>

<style scoped>
.directory-session-results {
  overflow: visible;
}

.directory-session-results :deep(.v-infinite-scroll__side) {
  padding: 0;
}
</style>
