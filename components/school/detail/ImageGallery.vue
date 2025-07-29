<template>
  <div class="d-flex d-md-none">
    <v-carousel
      v-if="galleryImages && galleryImages.length > 0"
      v-model="activeGalleryIndex"
      :show-arrows="false"
      hide-delimiters
      show-arrows-on-hover
      height="26.4rem"
      :class="imageClass"
      cycle
      interval="3000"
      @click="openGalleryDialog"
      @change="updateMainGalleryImage"
    >
      <v-carousel-item
        v-for="(image, index) in galleryImages"
        :key="index"
        :src="image?.fileUri?.replace(/^http:\/\//, 'https://')"
        eager
        cover
        class="pointer"
        @click="openGalleryDialog"
      >
        <template #placeholder>
          <v-row
            class="fill-height ma-0"
            align="center"
            justify="center"
          >
            <v-progress-circular
              indeterminate
              color="primary"
            />
          </v-row>
        </template>
      </v-carousel-item>
    </v-carousel>
    <div
      v-else
      class="enter-img-holder pointer"
      :class="imageClass"
      @click="openGalleryDialog"
    >
      <div class="text-center">
        <client-only>
          <v-icon
            :size="display.mdAndUp.value ? 48 : 24"
            class="primary-gray-300 mb-2 mb-md-10"
          >
            mdi-panorama-outline
          </v-icon>
        </client-only>
        <div class="gtext-t6 gtext-md-t4 primary-blue-500">
          Contribute
        </div>
      </div>
    </div>
  </div>
  <div class="d-none d-md-flex">
    <template v-if="galleryImages && galleryImages.length > 0">
      <v-carousel
        v-model="activeGalleryIndex"
        hide-delimiters
        show-arrows="hover"
        height="28.1rem"
        class="rounded-lg gallery-carousel"
        @change="updateMainGalleryImage"
      >
        <v-carousel-item
          v-for="(image, index) in galleryImages"
          :key="index"
          :src="image.fileUri"
          eager
          cover
          class="pointer"
          @click="openGalleryDialog"
        >
          <template #placeholder>
            <v-row
              class="fill-height ma-0"
              align="center"
              justify="center"
            >
              <v-progress-circular
                indeterminate
                color="primary"
              />
            </v-row>
          </template>
        </v-carousel-item>
      </v-carousel>
    </template>
    <div
      v-else
      class="enter-img-holder pointer"
      @click="openGalleryDialog"
    >
      <div class="text-center">
        <client-only>
          <v-icon
            size="48"
            class="primary-gray-300 mb-10"
          >
            mdi-panorama-outline
          </v-icon>
        </client-only>
        <p class="gtext-t4 primary-blue-500">
          Contribute
        </p>
        <div class="mt-2 gtext-t6 primary-gray-400">
          Accepted formats: JPG, PNG, WebP
        </div>
      </div>
    </div>
  </div>

  <school-detail-gallery-dialog
    v-model="showGalleryDialog"
    :content-data="contentData"
    :images="galleryImages"
    @refresh-gallery="loadGalleryImages"
  />
</template>

<script setup>
import { useDisplay } from 'vuetify/lib/composables/display'

const display = useDisplay()
const imageClass = ref(null)
const emit = defineEmits(['fetch'])
const props = defineProps({
  content: {
    type: String,
    required: false,
    default: '',
  },
  class: {
    type: String,
    required: false,
    default: '',
  },
  images: {
    type: Array,
    required: false,
    default: () => [],
    validator(value) {
      return value.every(
        item =>
          typeof item === 'string'
          || (typeof item === 'object' && 'url' in item),
      )
    },
  },
})
const contentData = ref(props.content)
const activeGalleryIndex = ref(0)
const showGalleryDialog = ref(false)
const galleryImages = ref(props.images)

watch(
  () => props.class,
  (val) => {
    imageClass.value = val
  },
)
watch(
  () => props.images,
  (val) => {
    galleryImages.value = val
  },
)

function openGalleryDialog() {
  showGalleryDialog.value = true
}
function updateMainGalleryImage(index) {
  activeGalleryIndex.value = index
}
function loadGalleryImages() {
  emit('fetch')
}

onMounted(() => {})
</script>

<style scoped>
.gallery-carousel {
  border-radius: 0.6rem;
  cursor: pointer;
}

/* Target the carousel navigation arrows */
.gallery-carousel .v-window__prev,
.gallery-carousel .v-window__next {
  z-index: 10;
}

.center-image {
  position: absolute;
  top: 0;
  left: 0 !important;
  margin: auto;
  z-index: 3;
  right: 0 !important;
  width: 70% !important;
  max-height: 26.4rem;
  overflow: hidden;
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
}

.center-image.enter-img-holder,
.center-image.position-relative {
  border-right: 1px solid white;
  border-left: 1px solid white;
}

.under-image-left,
.under-image-right {
  position: absolute;
  top: 0;
  max-height: 26.4rem;
  width: 80% !important;
}

.under-image-left {
  left: -32%;
  z-index: 1;
}

.under-image-left.enter-img-holder p,
.under-image-left.position-relative p {
  max-width: 2rem;
}

.under-image-right {
  right: -32%;
  z-index: 2;
}

.under-image-right.enter-img-holder p,
.under-image-right.position-relative p {
  max-width: 2rem;
}
.enter-img-holder {
  background: #f2f4f7;
  height: 28.1rem;
  width: 100%;
  border-radius: 0.6rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
