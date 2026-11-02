<template>
  <v-sheet
    class="breadcrumbs-container"
    :class="{ 'breadcrumbs-container--flush': flush }"
    :color="backgroundColor"
  >
    <v-breadcrumbs
      v-if="breadItems.length"
      class="overflow-x-auto"
      :items="breadItems"
    >
      <template #divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
  </v-sheet>
</template>

<script setup>
// Imports are auto-imported in Nuxt 3
const props = defineProps({
  breads: {
    type: Array,
    default: () => [],
  },
  // A theme colour name (e.g. 'surface', 'grey100') or 'transparent', so it follows light/dark mode.
  // No left/right padding, so the first crumb lines up with the page title under it.
  flush: {
    type: Boolean,
    default: false,
  },
  backgroundColor: {
    type: String,
    default: 'grey100',
  },
})

// Transform breadcrumb data to match Vuetify's expected format
const breadItems = computed(() => {
  if (!props.breads || props.breads.length === 0) {
    return []
  }

  return props.breads.map(bread => ({
    title: bread.text,
    disabled: bread.disabled,
    to: bread.href,
    exact: true,
  }))
})
</script>

<style scoped>
.breadcrumbs-container {
  border-radius: 8px;
  padding: 8px;
  overflow-x: auto;
}

.breadcrumbs-container--flush,
.breadcrumbs-container--flush :deep(.v-breadcrumbs) {
  padding-inline: 0;
}
/* Long trails still scroll sideways on a phone, without a scrollbar drawn under them. */
.breadcrumbs-container,
.breadcrumbs-container :deep(.v-breadcrumbs) {
  scrollbar-width: none;
}
.breadcrumbs-container::-webkit-scrollbar,
.breadcrumbs-container :deep(.v-breadcrumbs)::-webkit-scrollbar {
  display: none;
}

.disabled {
  pointer-events: none;
  opacity: 0.6;
}
</style>
