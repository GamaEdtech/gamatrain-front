<template>
  <v-card
    class="map-preview"
    rounded="lg"
    elevation="6"
  >
    <!-- Fixed height, so the card never jumps while the photo loads. -->
    <v-img
      v-if="photo"
      :src="photo"
      :alt="point.name"
      height="132"
      cover
      class="bg-grey100"
      @error="photoFailed = true"
    />
    <v-card-item class="pb-1">
      <v-card-title class="text-body-1 font-weight-bold text-wrap">
        {{ point.name }}
      </v-card-title>
      <v-card-subtitle
        v-if="subtitle"
        class="text-wrap"
      >
        {{ subtitle }}
      </v-card-subtitle>
      <template #append>
        <v-btn
          icon="md:close"
          variant="text"
          size="small"
          density="comfortable"
          aria-label="Close"
          @click="emit('close')"
        />
      </template>
    </v-card-item>
    <v-card-actions class="px-3 pt-0">
      <v-btn
        :to="`/school/${point.id}/${point.slug}`"
        variant="text"
        color="grey900"
        class="text-none font-weight-bold"
      >
        Open school
      </v-btn>
      <v-btn
        variant="text"
        :color="picked ? 'primaryStrong' : 'grey700'"
        :prepend-icon="picked ? 'md:check' : 'md:add'"
        class="text-none"
        @click="compare.toggle({ id: point.id, name: point.name, slug: point.slug })"
      >
        {{ picked ? 'Comparing' : 'Compare' }}
      </v-btn>
      <v-btn
        :href="`https://www.google.com/maps/dir/?api=1&destination=${point.lat},${point.lng}`"
        target="_blank"
        rel="noopener nofollow"
        variant="text"
        color="grey700"
        class="text-none"
      >
        Directions
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { SchoolMapPointDTO } from '@/types'

const props = defineProps<{ point: SchoolMapPointDTO }>()
const emit = defineEmits<{ close: [] }>()

const compare = useSchoolCompare()
const { tripFromHome } = useSchoolHome()

const picked = computed(() => compare.has(props.point.id))

const photoFailed = ref(false)
watch(() => props.point.id, () => {
  photoFailed.value = false
})
const photo = computed(() => (photoFailed.value ? '' : props.point.imageUri?.replace(/^http:\/\//, 'https://') ?? ''))
const subtitle = computed(() => {
  const trip = tripFromHome(props.point.lat, props.point.lng)
  return [
    props.point.rating ? `★ ${props.point.rating.toFixed(1)} (${props.point.reviewCount})` : '',
    trip?.summary ?? '',
  ].filter(Boolean).join(' · ')
})
</script>

<style scoped>
.map-preview {
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 12px;
  max-width: 400px;
  z-index: 600;
}
</style>
