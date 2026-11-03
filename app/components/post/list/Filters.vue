<template>
  <section class="w-100 d-flex flex-column ga-4 my-6">
    <v-text-field
      :model-value="title"
      variant="outlined"
      density="compact"
      hide-details
      clearable
      label="Search posts"
      rounded="lg"
      base-color="grey400"
      color="primary"
      active-color="primary"
      bg-color="transparent"
      width="300"
      prepend-inner-icon="md:search"
      glow
      class="ma-auto"
      @update:model-value="$emit('update:title', $event ?? '')"
    />

    <v-slide-group show-arrows>
      <v-slide-group-item>
        <v-chip
          class="mr-2 text-grey900 font-weight-bold text-h6"
          :color="tagId === 0 ? 'primary' : 'grey200'"
          variant="flat"
          @click="$emit('update:tagId', 0)"
        >
          All
        </v-chip>
      </v-slide-group-item>
      <v-slide-group-item
        v-for="category in categories"
        :key="category.id"
      >
        <v-chip
          class="mr-2 text-grey900 font-weight-bold text-h6"
          :color="tagId === category.id ? 'primary' : 'grey200'"
          variant="flat"
          @click="$emit('update:tagId', category.id)"
        >
          {{ category.name }}
        </v-chip>
      </v-slide-group-item>
      <template v-if="loadingCategories">
        <v-slide-group-item
          v-for="item in 10"
          :key="item"
        >
          <v-skeleton-loader
            width="90"
            height="32"
            class="mr-2 rounded-pill"
          />
        </v-slide-group-item>
      </template>
    </v-slide-group>
  </section>
</template>

<script setup lang="ts">
import type { TagDTO } from '@/types'

defineProps<{
  title: string
  tagId: number
  categories: TagDTO[]
  loadingCategories: boolean
}>()

defineEmits<{
  'update:title': [value: string]
  'update:tagId': [value: number]
}>()
</script>
