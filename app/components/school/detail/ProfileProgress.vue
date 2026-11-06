<template>
  <v-sheet
    v-if="missing.length"
    tag="section"
    color="softGold"
    rounded="lg"
    class="d-flex flex-column ga-3 pa-4"
    aria-labelledby="profile-progress-title"
  >
    <div class="d-flex justify-space-between align-baseline ga-2">
      <h2
        id="profile-progress-title"
        class="section-title"
      >
        Know this school? Fill in the gaps
      </h2>
      <span class="flex-shrink-0 text-generalSearchSchool font-weight-bold profile-percent">{{ percent }}% complete</span>
    </div>
    <v-progress-linear
      :model-value="percent"
      color="primary"
      bg-color="primary100"
      bg-opacity="1"
      height="6"
      rounded
      aria-label="How much of this school's page is filled in"
    />
    <p class="ma-0 text-grey700 profile-hint">
      This page is built by parents, students and teachers like you. Share what you know. Every approved edit earns you points.
    </p>
    <div class="d-flex flex-wrap ga-2">
      <v-chip
        v-for="item in missing"
        :key="item.key"
        prepend-icon="mdi-plus"
        color="grey800"
        variant="outlined"
        class="bg-surface font-weight-medium gtext-t5 profile-chip"
        @click="emit('contribute', item.key)"
      >
        {{ item.label }}
      </v-chip>
    </div>
  </v-sheet>
</template>

<script setup lang="ts">
import type { SchoolDetailDTO } from '@/types'

const props = withDefaults(defineProps<{
  content: SchoolDetailDTO
  imagesCount?: number
  hasTour?: boolean
  mediaLoaded?: boolean
}>(), { imagesCount: 0, hasTour: false, mediaLoaded: false })
const emit = defineEmits<{ contribute: [field: string] }>()

const fields = computed(() => {
  const school = props.content
  return [
    { key: 'photo', label: 'Photo', done: !!school.defaultImageUri || props.imagesCount > 0 },
    { key: 'phone', label: 'Phone', done: !!school.phoneNumber?.trim() },
    { key: 'website', label: 'Website', done: !!school.webSite?.trim() },
    { key: 'email', label: 'Email', done: !!school.email?.trim() },
    { key: 'location', label: 'Map location', done: !!(school.latitude && school.longitude) },
    { key: 'address', label: 'Address', done: !!school.address?.trim() },
    { key: 'tuition', label: 'Tuition fee', done: school.tuition !== null && school.tuition !== undefined },
    { key: 'facilities', label: 'Facilities', done: !!school.tags?.length },
    { key: 'boards', label: 'Education board', done: !!school.boards?.length },
    { key: 'description', label: 'Description', done: !!school.description?.trim() },
    // The tour is only known after the page loads; don't ask for it before then.
    { key: 'tour', label: '360° tour', done: props.hasTour || !props.mediaLoaded },
  ]
})

const missing = computed(() => fields.value.filter(field => !field.done))
const percent = computed(() =>
  Math.round(((fields.value.length - missing.value.length) / fields.value.length) * 100))
</script>

<style scoped>
.profile-percent {
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}

.profile-hint {
  font-size: 14px;
  line-height: 1.5;
}

.profile-chip {
  border-color: rgb(var(--v-theme-borderSubtle));
}
</style>
