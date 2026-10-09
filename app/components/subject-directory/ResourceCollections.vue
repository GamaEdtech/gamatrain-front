<template>
  <v-col
    v-if="isLoading || error || collections.length"
    cols="12"
    class="pb-4"
  >
    <v-skeleton-loader
      v-if="isLoading"
      class="bg-transparent"
      type="article"
      aria-label="Loading resource collections"
    />
    <v-alert
      v-else-if="error"
      type="error"
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
    <section
      v-else
      class="resource-collections"
      aria-labelledby="resource-collections-title"
    >
      <div class="resource-collections__intro">
        <h2
          id="resource-collections-title"
          class="resource-collections__heading text-grey900"
        >
          Resources
        </h2>
      </div>
      <div class="resource-collections__buttons d-flex flex-wrap ga-3">
        <v-btn
          v-for="collection in collections"
          :key="collection.id"
          class="resource-collection text-none"
          :class="{ 'resource-collection--active': selectedId === collection.id }"
          variant="outlined"
          rounded="lg"
          :aria-label="collection.count != null ? `${collection.label}, ${collection.count} resources` : collection.label"
          :aria-expanded="selectedId === collection.id"
          :aria-controls="selectedId === collection.id ? expansionId : undefined"
          @click="toggleCollection(collection.id)"
        >
          <v-icon
            :icon="collection.icon"
            size="22"
            class="mr-2"
          />
          <span class="resource-collection__label">{{ collection.label }}</span>
          <span
            v-if="collection.count != null"
            class="resource-collection__count bg-white text-grey900 ml-3"
          >{{ collection.count }}</span>
          <v-icon
            :icon="selectedId === collection.id ? 'md:keyboard_arrow_up' : 'md:keyboard_arrow_down'"
            size="20"
            class="ml-2"
          />
        </v-btn>
      </div>

      <section
        v-if="selectedCollection"
        :id="expansionId"
        class="resource-expansion mt-2"
        :aria-labelledby="`${expansionId}-title`"
      >
        <div class="d-flex align-center justify-space-between ga-3 mb-2">
          <h3
            :id="`${expansionId}-title`"
            class="resource-expansion__title text-grey900"
          >
            {{ selectedCollection.title }}
          </h3>
          <v-btn
            variant="text"
            color="grey600"
            height="32"
            class="text-none flex-shrink-0 px-2"
            append-icon="md:keyboard_arrow_up"
            @click="selectedId = null"
          >
            Collapse
          </v-btn>
        </div>
        <v-list
          class="resource-expansion__list bg-transparent pa-0"
          aria-label="Resources in this collection"
        >
          <v-list-item
            v-for="item in previewItems"
            :key="item.id"
            :to="item.to"
            class="resource-expansion__item text-grey900"
          >
            <v-list-item-title class="resource-expansion__item-title">
              {{ item.title }}
            </v-list-item-title>
            <template #append>
              <v-icon
                icon="md:arrow_outward"
                color="grey500"
                size="22"
                class="ml-3"
              />
            </template>
          </v-list-item>
        </v-list>
        <v-btn
          :to="getDirectoryResourceSearchLink(selectedCollection, context)"
          variant="text"
          color="info"
          class="resource-expansion__view-all text-none mt-2 px-0"
          append-icon="md:arrow_forward"
        >
          View all {{ selectedCollection.title }}
        </v-btn>
        <v-divider class="resource-expansion__divider mt-3" />
      </section>
    </section>
  </v-col>
</template>

<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'
import { getDirectoryResourceCollections, getDirectoryResourceSearchLink } from '~/utils/directoryResources'
import type { DirectoryResourceContext, DirectoryResourceGroup } from '~/types/subject-directory/resources'

const props = withDefaults(defineProps<{
  data?: DirectoryResourceGroup[]
  context: DirectoryResourceContext
  isLoading?: boolean
  error?: boolean
}>(), { data: () => [], isLoading: false, error: false })
const emit = defineEmits<{ retry: [] }>()
const expansionId = useId()
const selectedId = ref<string | number | null>(null)
const collections = computed(() => getDirectoryResourceCollections(props.data))
const selectedCollection = computed(() => collections.value.find(collection => collection.id === selectedId.value))
const previewItems = computed(() => selectedCollection.value?.items.slice(0, 4) || [])

const toggleCollection = (id: string | number) => {
  selectedId.value = selectedId.value === id ? null : id
}

watch(() => [props.data, props.context.boardId, props.context.gradeId, props.context.subjectId, props.isLoading], () => {
  selectedId.value = null
})
</script>

<style scoped>
.resource-collections {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
}
.resource-collections__intro {
  align-self: flex-start;
  max-width: 100%;
}
.resource-collections__heading {
  font-size: 22px;
  font-weight: 600;
  line-height: 1.4;
  overflow-wrap: anywhere;
}
.resource-collections__buttons {
  min-width: 0;
  align-content: center;
}
.resource-collection {
  min-height: 48px;
  height: auto !important;
  padding: 10px 14px;
  color: rgb(var(--v-theme-grey900));
  background: rgb(var(--v-theme-surfaceSecondary));
  border: 1px solid rgb(var(--v-theme-grey200));
  border-radius: 12px !important;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: normal;
}
.resource-collection:hover,
.resource-collection--active {
  color: rgb(var(--v-theme-info));
  border-color: rgb(var(--v-theme-info));
  background: rgb(var(--v-theme-blue50));
}
.resource-collection:focus-visible {
  outline: 2px solid rgb(var(--v-theme-info));
  outline-offset: 3px;
}
.resource-collection__count {
  display: inline-flex;
  min-width: 26px;
  height: 26px;
  padding: 0 6px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
}
.resource-expansion__title {
  min-width: 0;
  overflow-wrap: anywhere;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.4;
}
.resource-expansion__list { overflow: visible; }
.resource-expansion__item { padding: 12px 0; }
.resource-expansion__item + .resource-expansion__item {
  border-top: 1px solid rgb(var(--v-theme-grey200));
}
.resource-expansion__item-title {
  white-space: normal;
  overflow-wrap: anywhere;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.5;
}
.resource-expansion__view-all {
  max-width: 100%;
  min-height: 40px;
  height: auto;
  padding-block: 8px;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: normal;
}
.resource-expansion__view-all :deep(.v-btn__content) {
  white-space: normal;
  overflow-wrap: anywhere;
  text-align: start;
}
.resource-expansion__divider {
  border-color: rgb(var(--v-theme-grey200));
  opacity: 1;
}
@media (max-width: 599px) {
  .resource-collection { width: 100%; }
  .resource-collection :deep(.v-btn__content) { width: 100%; justify-content: flex-start; }
  .resource-collection__label { min-width: 0; white-space: normal; text-align: left; }
  .resource-collection__count { margin-left: auto !important; flex-shrink: 0; }
  .resource-expansion__item-title { font-size: 16px; }
}
</style>
