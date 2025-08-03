<template>
  <div
    class="breadcrumbs-container"
    :style="{
      backgroundColor: backgroundColor,
    }"
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
  </div>
</template>

<script setup>
// Imports are auto-imported in Nuxt 3
const props = defineProps({
  breads: {
    type: Array,
    default: () => [],
  },
  backgroundColor: {
    type: String,
    default: '#f5f5f5',
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
}

.disabled {
  pointer-events: none;
  opacity: 0.6;
}
</style>
