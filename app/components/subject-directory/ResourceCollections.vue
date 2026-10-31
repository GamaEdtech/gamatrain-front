<template>
  <v-card
    v-if="isLoading || error || collections.length"
    class="resource-collections"
    variant="outlined"
    color="grey25"
    elevation="0"
    tag="section"
    aria-labelledby="resource-collections-title"
  >
    <h2
      id="resource-collections-title"
      class="resource-collections__heading bg-borderSubtle text-brandNavy d-flex align-center px-3 py-2"
    >
      Resources
    </h2>
    <v-skeleton-loader
      v-if="isLoading"
      class="bg-transparent"
      type="list-item, list-item, list-item"
      aria-label="Loading resource collections"
    />
    <v-alert
      v-else-if="error"
      type="error"
      color="errorStrong"
      variant="text"
    >
      Resources could not be loaded.
      <v-btn
        variant="text"
        class="text-none"
        @click="emit('retry')"
      >
        Retry
      </v-btn>
    </v-alert>
    <v-list
      v-else
      class="bg-transparent pa-0"
      density="compact"
      aria-label="Resource collections"
    >
      <v-list-item
        v-for="collection in collections"
        :key="collection.id"
        :to="getDirectoryResourceSearchLink(collection, context)"
        class="resource-collection text-brandNavy px-2"
        :aria-label="collection.count != null ? `${collection.label}, ${collection.count} resources` : collection.label"
      >
        <template #prepend>
          <v-icon
            :icon="collection.icon"
            size="20"
            class="resource-collection__icon"
          />
        </template>
        <v-list-item-title class="resource-collection__label">
          {{ collection.label }}
        </v-list-item-title>
        <template #append>
          <span
            v-if="collection.count != null"
            class="resource-collection__count bg-white text-brandNavy ml-2"
          >{{ collection.count }}</span>
          <v-icon
            icon="md:chevron_right"
            size="18"
            class="ml-2"
          />
        </template>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getDirectoryResourceCollections, getDirectoryResourceSearchLink } from '~/utils/directoryResources'
import type { DirectoryResourceContext, DirectoryResourceGroup } from '~/types/subject-directory/resources'

const props = withDefaults(defineProps<{
  data?: DirectoryResourceGroup[]
  context: DirectoryResourceContext
  isLoading?: boolean
  error?: boolean
}>(), { data: () => [], isLoading: false, error: false })
const emit = defineEmits<{ retry: [] }>()
const collections = computed(() => getDirectoryResourceCollections(props.data))
</script>

<style scoped>
.resource-collections {
  border: 1px solid rgb(var(--v-theme-borderSubtle));
  border-radius: 12px;
  background: rgb(var(--v-theme-grey25));
}
.resource-collections__heading {
  min-height: 44px;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.4;
}
.resource-collection {
  min-height: 44px;
  border-top: 1px solid rgb(var(--v-theme-surfaceTertiary));
  transition: background-color 160ms ease;
}
.resource-collection:hover {
  background: rgb(var(--v-theme-surfaceSecondary));
}
.resource-collection:active {
  background: rgb(var(--v-theme-surfaceTertiary));
}
.resource-collection :deep(.v-list-item__overlay) {
  opacity: 0 !important;
}
.resource-collection:focus-visible {
  outline: 3px solid rgba(var(--v-theme-primary), 0.28);
  outline-offset: -3px;
}
.resource-collection :deep(.v-list-item__prepend > .v-list-item__spacer) {
  width: 8px;
}
.resource-collection__icon { opacity: 1; }
.resource-collection__label {
  white-space: normal;
  overflow-wrap: anywhere;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
}
.resource-collection__count {
  display: inline-flex;
  min-width: 24px;
  height: 24px;
  padding: 0 5px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgb(var(--v-theme-surfaceTertiary));
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
}
@media (prefers-reduced-motion: reduce) {
  .resource-collection { transition: none; }
}
</style>
