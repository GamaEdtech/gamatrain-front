<template>
  <div class="d-flex d-md-none">
    <div
      v-if="contentData.tour && !tourImgPreview"
      :class="tourClass"
    >
      <img
        class="pointer schoolDetailsImg"
        :src="contentData.tour"
        alt="School image Preview"
        @click="openTourImgInput"
      >

      <div class="upload-overlay">
        <v-btn
          class=""
          icon
          color="white"
          variant="text"
          @click="openTourImgInput"
        >
          <v-icon size="large">
            mdi-pencil
          </v-icon>
        </v-btn>
      </div>
    </div>
    <div
      v-else-if="tourImgPreview"
      :class="['enter-img-holder', tourClass]"
    >
      <img
        class="pointer schoolDetailsImg"
        :src="tourImgPreview"
        alt="School image Preview"
      >
      <div class="upload-overlay">
        <v-btn
          color="primary"
          size="small"
          icon
          :loading="loading"
          class="text-transform-none gtext-t6 font-weight-medium"
          @click="uploadTourImage"
        >
          <v-icon
            small
            color="white"
          >
            mdi-cloud-upload
          </v-icon>
        </v-btn>
        <v-btn
          color="error"
          size="small"
          icon
          class="text-transform-none gtext-t6 font-weight-medium"
          @click="clearTourImage"
        >
          <v-icon small>
            mdi-delete
          </v-icon>
        </v-btn>
      </div>
    </div>
    <div
      v-else
      class="enter-img-holder pointer"
      :class="tourClass"
      @click="openTourImgInput"
    >
      <div class="text-center">
        <client-only>
          <v-icon
            :size="iconSize"
            class="primary-gray-300 mb-2 mb-md-10"
          >
            mdi-rotate-360
          </v-icon>
        </client-only>

        <div class="gtext-t6 gtext-md-t4 primary-blue-500">
          Contribute
        </div>
      </div>
    </div>
  </div>
  <div class="d-none d-md-flex">
    <template v-if="contentData.tour && !tourImgPreview">
      <div class="position-relative">
        <img
          class="pointer schoolDetailsImg"
          :src="contentData.tour"
          alt="School image Preview"
        >
        <div class="upload-overlay px-3">
          <div class="px-3 d-flex justify-center align-center">
            <v-btn
              class=""
              icon
              color="white"
              variant="text"
              @click="openTourImgInput"
            >
              <v-icon size="large">
                mdi-pencil
              </v-icon>
            </v-btn>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <template v-if="tourImgPreview">
        <div class="position-relative">
          <img
            class="pointer schoolDetailsImg"
            :src="tourImgPreview"
            alt="School image Preview"
          >
          <div class="upload-overlay px-3">
            <div class="px-3 d-flex justify-center align-center">
              <v-btn
                size="small"
                icon
                color="primary"
                :loading="loading"
                class="text-transform-none gtext-t4 font-weight-medium mr-3"
                @click="uploadTourImage"
              >
                <v-icon
                  size="small"
                  color="white"
                >
                  mdi-cloud-upload
                </v-icon>
              </v-btn>
              <v-btn
                size="small"
                icon
                color="error"
                class="text-transform-none gtext-t4 font-weight-medium"
                @click="clearTourImage"
              >
                <v-icon
                  size="small"
                  color="white"
                >
                  mdi-delete
                </v-icon>
              </v-btn>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div
          class="enter-img-holder pointer"
          @click="openTourImgInput"
        >
          <div class="text-center">
            <v-icon
              size="48"
              class="primary-gray-300 mb-10"
            >
              mdi-rotate-360
            </v-icon>
            <div class="gtext-t4 primary-blue-500">
              Contribute
            </div>
            <div class="mt-2 gtext-t6 primary-gray-400">
              Accepted formats: JPG, PNG, WebP
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>

  <v-file-input
    ref="tourImgRef"
    v-model="tourImg"
    class="d-none"
    accept="image/jpeg, image/png, image/jpg, image/webp"
    hide-details
    @update:model-value="validateAndProcessImage"
  />
</template>

<script setup>
import { useDisplay } from 'vuetify/lib/composables/display'
import { computed, ref, watch, nextTick } from 'vue'

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
})
const emit = defineEmits(['fetch'])

const display = useDisplay()
const loading = ref(false)
const tourClass = ref(props.class)
const nuxtApp = useNuxtApp()
const route = useRoute()
const contentData = ref(props.content)
const tourImgPreview = ref(null)
const tourImg = ref(null)
const tourImgRef = ref(null)

// Use a computed property for icon size to avoid hydration mismatch
const iconSize = computed(() => (display.mdAndUp.value ? 48 : 24))

function validateAndProcessImage(file) {
  if (!file) return
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
  console.log('file.type', file.type)

  if (!validTypes.includes(file.type)) {
    nuxtApp.$toast?.error(
      'Invalid file type. Please use JPG, PNG or WebP images.',
    )
    tourImg.value = null
    return
  }
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    nuxtApp.$toast?.error('File too large. Maximum size is 5MB.')
    tourImg.value = null
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    tourImgPreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}
function uploadTourImage() {
  if (!tourImg.value) {
    nuxtApp.$toast?.error('Please select an image to upload')
    return
  }
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
  if (!validTypes.includes(tourImg.value.type)) {
    nuxtApp.$toast?.error(
      'Invalid file type. Please use JPG, PNG or WebP images.',
    )
    return
  }
  loading.value = true
  const formData = new FormData()
  formData.append('File', tourImg.value)
  formData.append('FileType', 'Tour360')
  useApiService
    .post(`/api/v2/schools/${route.params.id}/images`, formData)
    .then(() => {
      nuxtApp.$toast?.success(
        'Your 360° tour image has been successfully uploaded',
      )
      emit('fetch')
      tourImg.value = null
      tourImgPreview.value = null
      setTimeout(() => {
        refreshTourContent()
      }, 500)
    })
    .catch((err) => {
      if (err?.response?.status == 401 || err?.response?.status == 403) {
        nuxtApp.$toast?.error('Please login to update tour content')
      }
      else {
        nuxtApp.$toast?.error(err?.response?.data?.message || 'Upload failed')
      }
    })
    .finally(() => {
      loading.value = false
    })
}
function refreshTourContent() {
  const currentTour = contentData.value.tour
  contentData.value.tour = null
  nextTick(() => {
    contentData.value.tour = currentTour
  })
}
function openTourImgInput() {
  if (tourImgRef.value) {
    tourImgRef.value.click()
  }
}
function clearTourImage() {
  tourImg.value = null
  tourImgPreview.value = null
  nuxtApp.$toast?.info('Image removed')
}

watch(
  () => props.class,
  (val) => {
    tourClass.value = val
  },
)
watch(
  () => props.content,
  (val) => {
    contentData.value = val
  },
)
</script>

<style scoped>
.position-relative {
  position: relative;
}
.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 0.6rem;
  padding: 1rem;
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

.schoolDetailsImg {
  height: 28.1rem;
  max-height: 28.1rem;
  width: 100%;
  border-radius: 0.6rem;
}

@media (max-width: 600px) {
  .upload-overlay {
    flex-direction: column;
  }

  .upload-overlay .v-btn {
    margin: 0.25rem 0;
    flex-shrink: 0;
  }

  .upload-overlay .v-icon {
    font-size: 1.2rem !important;
  }
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
</style>
