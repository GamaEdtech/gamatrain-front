<template>
  <v-card
    class="resource-collections border border-borderSubtle border-opacity-100"
    color="grey25"
    rounded="lg"
    flat
    tag="section"
    aria-labelledby="resource-collections-title"
  >
    <h2
      id="resource-collections-title"
      class="resource-collections__heading bg-borderSubtle text-brandNavy px-3 py-2"
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
        :to="collection.to"
        :prepend-icon="collection.icon"
        append-icon="md:chevron_right"
        prepend-gap="8"
        min-height="44"
        class="resource-collection text-brandNavy border-t border-surfaceTertiary border-opacity-100 px-2"
        :aria-label="`${collection.label}, ${collection.count} resources`"
      >
        <v-list-item-title class="resource-collection__label">
          {{ collection.label }}
        </v-list-item-title>
        <template #append>
          <v-chip
            size="x-small"
            variant="flat"
            color="surface"
            class="resource-collection__count text-brandNavy border border-surfaceTertiary border-opacity-100 font-weight-bold mx-2"
          >
            {{ collection.count }}
          </v-chip>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  collections: { id: string | number, label: string, icon: string, count: number, to: object }[]
  isLoading?: boolean
  error?: boolean
}>()
const emit = defineEmits<{ retry: [] }>()
</script>

<style scoped>
/* px sizes: the app's 10px root font size makes Vuetify's rem-based text too small */
.resource-collections__heading {
  font-size: 18px;
  font-weight: 700;
  line-height: 28px;
}

.resource-collection__label {
  font-size: 14px;
  white-space: normal;
}

.resource-collection__count {
  font-size: 12px;
}
</style>
