<template>
  <v-col
    v-if="isLoading || error || collections.length"
    cols="12"
  >
    <v-skeleton-loader
      v-if="isLoading"
      class="rounded-xl"
      type="article"
      aria-label="Loading resource collections"
    />
    <v-alert
      v-else-if="error"
      type="error"
      variant="tonal"
      rounded="lg"
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
      class="resource-collections bg-white"
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
          :key="collection.id || collection.title"
          class="resource-collection text-none"
          :class="{ 'resource-collection--active': dialogOpen && selectedCollection?.id === collection.id }"
          variant="outlined"
          rounded="lg"
          :aria-label="`${collection.label}, ${collection.count} resources`"
          aria-haspopup="dialog"
          :aria-expanded="dialogOpen && selectedCollection?.id === collection.id"
          @click="openCollection(collection)"
        >
          <v-icon
            :icon="collection.icon"
            size="22"
            class="mr-2"
          />
          <span class="resource-collection__label">{{ collection.label }}</span>
          <span class="resource-collection__count bg-white text-grey900 ml-3">{{ collection.count }}</span>
        </v-btn>
      </div>
    </section>

    <v-dialog
      v-model="dialogOpen"
      max-width="780"
      aria-labelledby="resource-dialog-title"
    >
      <v-card
        v-if="selectedCollection"
        class="resource-dialog bg-white"
        rounded="xl"
      >
        <div class="resource-dialog__header d-flex align-center justify-space-between ga-4 flex-shrink-0">
          <div>
            <p class="resource-dialog__eyebrow text-grey500 mb-2">
              Resource collection
            </p>
            <h2
              id="resource-dialog-title"
              class="resource-dialog__title text-grey900"
            >
              {{ selectedCollection.title }}
            </h2>
          </div>
          <v-btn
            icon="md:close"
            aria-label="Close resource collection"
            variant="flat"
            color="grey100"
            rounded="lg"
            size="48"
            class="flex-shrink-0 text-grey900"
            @click="dialogOpen = false"
          />
        </div>
        <div class="resource-dialog__search flex-shrink-0">
          <v-text-field
            v-model="searchText"
            label="Search this collection"
            prepend-inner-icon="md:search"
            clear-icon="md:close"
            clearable
            hide-details
            variant="outlined"
            rounded="lg"
            density="comfortable"
            color="info"
          />
        </div>
        <v-list
          class="resource-dialog__list bg-white pa-0"
          aria-label="Resources in this collection"
        >
          <v-list-item
            v-for="item in filteredItems"
            :key="item.id"
            :to="item.to"
            class="resource-dialog__item text-grey900"
            @click="dialogOpen = false"
          >
            <v-list-item-title class="resource-dialog__item-title">
              {{ item.title }}
            </v-list-item-title>
            <template #append>
              <v-icon
                icon="md:arrow_outward"
                color="grey500"
                size="24"
                class="ml-4"
              />
            </template>
          </v-list-item>
          <div
            v-if="!filteredItems.length"
            class="pa-6 text-grey500 resource-dialog__empty"
            role="status"
          >
            No resources match “{{ searchText }}”.
          </div>
        </v-list>
        <v-card-actions class="resource-dialog__footer flex-shrink-0">
          <v-btn
            :to="getDirectoryResourceSearchLink(selectedCollection, context)"
            block
            variant="flat"
            color="grey900"
            rounded="lg"
            height="58"
            class="resource-dialog__view-all text-none"
            @click="dialogOpen = false"
          >
            View all {{ selectedCollection.count }} {{ selectedCollection.count === 1 ? 'resource' : 'resources' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-col>
</template>

<script setup>
import { getDirectoryResourceCollections, getDirectoryResourceSearchLink } from '~/utils/directoryResources'

const props = defineProps({
  data: { type: Array, default: () => [] },
  context: { type: Object, required: true },
  isLoading: { type: Boolean, default: false },
  error: { type: Boolean, default: false },
})
const emit = defineEmits(['retry'])
const collections = computed(() => getDirectoryResourceCollections(props.data))
const selectedCollection = ref(null)
const dialogOpen = ref(false)
const searchText = ref('')
const filteredItems = computed(() => {
  const query = (searchText.value || '').trim().toLocaleLowerCase()
  return (selectedCollection.value?.items || []).filter(item => item.title.toLocaleLowerCase().includes(query))
})
const openCollection = (collection) => {
  selectedCollection.value = collection
  searchText.value = ''
  dialogOpen.value = true
}
watch(() => [props.data, props.context.subjectId, props.isLoading], () => {
  dialogOpen.value = false
  selectedCollection.value = null
  searchText.value = ''
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
  background: rgb(var(--v-theme-white));
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
.resource-dialog {
  max-height: 85dvh;
  overflow: hidden;
  border: 1px solid rgb(var(--v-theme-grey200));
}
.resource-dialog__header { padding: 28px 24px 20px; }
.resource-dialog__eyebrow { font-size: 16px; }
.resource-dialog__title { font-size: 24px; font-weight: 600; line-height: 1.4; }
.resource-dialog__search { padding: 0 24px 20px; }
.resource-dialog__list {
  min-height: 0;
  flex: 1 1 auto;
  margin: 0 24px;
  overflow-y: auto;
  border-top: 1px solid rgb(var(--v-theme-grey200));
}
.resource-dialog__item {
  min-height: 76px;
  padding: 20px 4px;
  border-bottom: 1px solid rgb(var(--v-theme-grey200));
}
.resource-dialog__item-title {
  white-space: normal;
  overflow-wrap: anywhere;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.5;
}
.resource-dialog__empty { font-size: 16px; }
.resource-dialog__footer { padding: 16px 24px 24px; }
.resource-dialog__view-all { font-size: 18px; font-weight: 500; letter-spacing: normal; }
@media (max-width: 599px) {
  .resource-collection { width: 100%; }
  .resource-collection :deep(.v-btn__content) { width: 100%; justify-content: flex-start; }
  .resource-collection__label { min-width: 0; white-space: normal; text-align: left; }
  .resource-collection__count { margin-left: auto !important; flex-shrink: 0; }
  .resource-dialog__header { padding: 20px 16px 16px; }
  .resource-dialog__title { font-size: 20px; }
  .resource-dialog__search { padding: 0 16px 16px; }
  .resource-dialog__list { margin: 0 16px; }
  .resource-dialog__item-title { font-size: 16px; }
  .resource-dialog__footer { padding: 16px; }
  .resource-dialog__view-all { font-size: 16px; }
}
</style>
