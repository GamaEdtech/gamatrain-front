<template>
  <section
    class="d-flex flex-column ga-3"
    aria-label="Photos and 360° tour"
  >
    <v-btn-toggle
      v-model="tab"
      mandatory
      rounded="pill"
      density="compact"
      variant="text"
      selected-class="media-tab--on"
      class="align-self-start bg-grey100 pa-1 media-tabs"
    >
      <v-btn
        value="photos"
        class="text-none gtext-t5 text-grey600"
        rounded="pill"
      >
        Photos
        <v-badge
          v-if="photos.length"
          :content="photos.length"
          color="grey200"
          class="gtext-t6"
          inline
        />
      </v-btn>
      <v-btn
        value="tour"
        class="text-none gtext-t5 text-grey600"
        rounded="pill"
      >
        360° tour
      </v-btn>
    </v-btn-toggle>

    <template v-if="tab === 'photos'">
      <!--
        Documented exception to "Vuetify first" (AGENTS.md): plain <img> tiles in one CSS layout that is a
        swipe row on phones and a grid on desktop. The first photo is in the server HTML and is the page's
        LCP; v-img/v-carousel only show their image after hydration, which would delay it by seconds.
        Each photo fills its tile (cover), trimming whatever doesn't fit around the centre; uploads are
        cropped to 4:3, the tile's own shape, so new photos lose little or nothing.
      -->
      <div
        v-if="photos.length"
        :class="['media-gallery', `media-gallery--${Math.min(photos.length, 3)}`]"
      >
        <button
          v-for="(photo, index) in shownPhotos"
          :key="photo.src"
          type="button"
          class="media-tile bg-grey100"
          :aria-label="`Open photo ${index + 1} of ${photos.length}`"
          @click="openGallery"
        >
          <img
            :src="photo.src"
            :alt="index === 0 ? (content.name ?? '') : `${content.name ?? ''}, photo ${index + 1}`"
            class="media-tile__img"
            width="1600"
            height="1200"
            :loading="index === 0 ? 'eager' : 'lazy'"
            :fetchpriority="index === 0 ? 'high' : 'auto'"
            decoding="async"
          >
          <span
            v-if="index === 2 && hiddenCount > 0"
            class="media-tile__more d-flex align-center justify-center font-weight-bold"
          >
            +{{ hiddenCount }} more
          </span>
        </button>
      </div>
      <div
        v-else
        class="media-frame media-frame--empty bg-grey100"
      >
        <v-skeleton-loader
          v-if="!imagesLoaded"
          type="image"
          class="w-100 h-100 bg-grey100"
        />
        <school-detail-media-empty
          v-else
          icon="mdi-image-plus-outline"
          title="No photos yet"
          action="Add the first photo of this school"
          @click="startAddPhoto"
        />
      </div>
      <v-btn
        v-if="photos.length"
        variant="text"
        color="info"
        size="small"
        :prepend-icon="photos.length > 1 ? 'mdi-image-multiple-outline' : 'mdi-image-plus-outline'"
        class="align-self-start text-none gtext-t5 px-1"
        @click="photos.length > 1 ? openGallery() : startAddPhoto()"
      >
        {{ photos.length > 1 ? `View all ${photos.length} photos` : 'Add more photos' }}
      </v-btn>
    </template>
    <div
      v-else
      class="media-frame bg-grey100"
    >
      <school-detail-school-tour
        ref="tourRef"
        :tour="tour ?? undefined"
        @fetch="emit('fetch-tour')"
      />
    </div>

    <lazy-school-detail-gallery-dialog
      v-if="galleryMounted"
      v-model="showGallery"
      v-model:images="images"
      :content-data="content"
      @refresh-gallery="emit('fetch-images')"
    />
  </section>
</template>

<script setup lang="ts">
import type { SchoolDetailDTO, SchoolImageDTO } from '@/types'

const props = withDefaults(defineProps<{
  content: SchoolDetailDTO
  tour?: string | null
  imagesLoaded?: boolean
}>(), { tour: null, imagesLoaded: false })
const emit = defineEmits<{
  'fetch-images': []
  'fetch-tour': []
}>()
const images = defineModel<SchoolImageDTO[]>('images', { default: () => [] })
const { requireSignIn } = useContributeGate()

const tab = ref<'photos' | 'tour'>('photos')
const showGallery = ref(false)
const galleryMounted = ref(false)
const tourRef = ref<{ openTourImgInput: () => void } | null>(null)

const https = (src?: string | null) => src?.replace(/^http:\/\//, 'https://')

// The school's default photo first, then the rest of the gallery. The default comes with the school
// itself, so even before the gallery list is known there is something to show.
const photos = computed(() => {
  const list = images.value.map(image => https(image.fileUri)).filter((src): src is string => !!src)
  const main = https(props.content.defaultImageUri) || list[0]
  return [main, ...list.filter(src => src !== main)]
    .filter((src): src is string => !!src)
    .map(src => ({ src }))
})

// Phones swipe through all of them; the desktop grid shows three and says how many more there are.
const shownPhotos = computed(() => photos.value.slice(0, 8))
const hiddenCount = computed(() => Math.max(photos.value.length - 3, 0))

const openGallery = () => {
  galleryMounted.value = true
  showGallery.value = true
}

// Adding needs an account; looking at photos doesn't.
const startAddPhoto = () => {
  tab.value = 'photos'
  if (requireSignIn()) openGallery()
}

const startAddTour = async () => {
  tab.value = 'tour'
  await nextTick()
  tourRef.value?.openTourImgInput()
}

defineExpose({ startAddPhoto, startAddTour })
</script>

<style scoped>
.media-tabs .v-btn {
  letter-spacing: normal;
}

.media-tabs .media-tab--on {
  background: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-grey900)) !important;
  font-weight: 600;
}

.media-tabs .media-tab--on :deep(.v-btn__overlay) {
  opacity: 0;
}

.media-tabs :deep(.v-badge__badge) {
  font-size: 12px;
  color: rgb(var(--v-theme-grey800));
}

.media-frame {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  max-height: 420px;
  border-radius: 14px;
  overflow: hidden;
}

@media (min-width: 960px) {
  .media-frame--empty {
    aspect-ratio: auto;
    height: 260px;
  }
}

/* Phones: a swipe row. Each photo is 4:3 and the next one peeks in, so it's clear there are more. */
.media-gallery {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  border-radius: 14px;
}

.media-gallery::-webkit-scrollbar {
  display: none;
}

.media-tile {
  position: relative;
  flex: 0 0 88%;
  aspect-ratio: 4 / 3;
  border-radius: 14px;
  overflow: hidden;
  scroll-snap-align: start;
}

.media-gallery--1 .media-tile {
  flex-basis: 100%;
}

.media-tile__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.media-tile__more {
  display: none !important;
}

/*
  Desktop: one big photo and up to two beside it. The grid's shape is set so every tile comes out
  4:3 - the shape uploads are cropped to - so new photos fill their tile without losing anything:
  three photos at 2:1 (a 2/3-wide 4:3 tile beside two stacked 1/3-wide ones), two side by side at
  8:3, one on its own at 16:10.
*/
@media (min-width: 960px) {
  .media-gallery {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-template-rows: 1fr 1fr;
    aspect-ratio: 2 / 1;
    overflow: visible;
  }

  .media-gallery--1 {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    aspect-ratio: 16 / 10;
  }

  .media-gallery--2 {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
    aspect-ratio: 8 / 3;
  }

  .media-tile {
    aspect-ratio: auto;
    height: 100%;
  }

  .media-gallery--3 .media-tile:first-child {
    grid-row: span 2;
  }

  .media-tile:nth-child(n + 4) {
    display: none;
  }

  .media-tile__more {
    display: flex !important;
    position: absolute;
    inset: 0;
    background: rgba(var(--v-theme-inverseSurfaceStrong), 0.55);
    color: rgb(var(--v-theme-white));
    font-size: 18px;
  }
}
</style>
