<template>
  <div>
    <v-dialog
      v-model="dialogVisible"
      transition="dialog-bottom-transition"
      :fullscreen="display.xs.value"
      max-width="720"
    >
      <v-card>
        <v-card-text class="py-6 py-md-8 px-6 px-md-8">
          <div class="d-flex">
            <div class="gtext-h5 priamry-gray-700">
              School images
            </div>
            <v-spacer />
            <v-btn
              icon
              variant="text"
              @click="dialogVisible = false"
            >
              <v-icon size="20">
                mdi-close
              </v-icon>
            </v-btn>
          </div>
          <v-divider class="mb-12 mt-4" />
          <v-row>
            <v-col
              cols="12"
              md="7"
            >
              <img
                v-if="mainImage"
                class="schoolDetailsImg"
                :src="mainImage"
                alt="School image"
              >
              <div
                v-else
                class="enter-img-holder pointer"
                @click="galleryDialog = true"
              >
                <div class="text-center">
                  <v-icon
                    size="48"
                    class="primary-gray-300 mb-10"
                  >
                    mdi-panorama-outline
                  </v-icon>
                  <p class="gtext-t4 primary-blue-500">
                    No image
                  </p>
                  <div class="mt-2 gtext-t6 primary-gray-400">
                    Accepted formats: JPG, PNG, WebP
                  </div>
                </div>
              </div>
              <div class="text-center gtext-t5 font-weight-heavy mt-6">
                {{ selectedImageIndex }}/<span class="gray--text">{{
                  images.length
                }}</span>
                <v-chip
                  v-if="pendingUpload"
                  small
                  color="orange"
                  class="ml-2"
                >
                  Pending upload
                </v-chip>
              </div>
            </v-col>
            <v-col
              cols="12"
              md="5"
            >
              <v-row>
                <!-- Pending upload previews -->
                <v-col
                  v-for="(preview, index) in pendingPreviews"
                  :key="`pending-${index}`"
                  cols="3"
                  class="pa-1"
                  @click="handlePreviewSelected(preview, index)"
                >
                  <div class="position-relative">
                    <v-img
                      :src="preview"
                      aspect-ratio="1"
                      class="position-relative rounded pending-thumb"
                      :class="mainImage === preview ? 'primary--border' : ''"
                      cover
                    />
                    <div class="pending-badge">
                      <v-icon
                        size="small"
                        color="white"
                      >
                        mdi-cloud-upload-outline
                      </v-icon>
                    </div>
                  </div>
                </v-col>
                <v-col
                  v-for="(item, index) in images"
                  :key="`gallery-${index}`"
                  cols="3"
                  class="pa-1 cursor-pointer"
                  @click="handleSelectedImage(item, index)"
                >
                  <div class="position-relative">
                    <v-img
                      :src="item.fileUri?.replace(/^http:\/\//, 'https://')"
                      aspect-ratio="1"
                      class="position-relative rounded"
                      :class="mainImage === item ? 'primary--border' : ''"
                      cover
                    />
                  </div>
                </v-col>

                <v-col
                  cols="4"
                  align="center"
                  justify="center"
                  class="fill-height pl-0"
                >
                  <v-btn
                    color="primary"
                    depressed
                    :class="{ 'pulse-animation': images.length === 0 }"
                    icon
                    size="large"
                    @click="openImgInput"
                  >
                    <v-icon
                      size="48"
                      color="white"
                    >
                      mdi-plus
                    </v-icon>
                  </v-btn>
                  <div class="mt-2 gtext-t6 primary-gray-400 text-center">
                    JPG, PNG, WebP
                  </div>
                  <v-file-input
                    ref="imgInputRef"
                    v-model="imgInput"
                    class="d-none"
                    accept="image/jpeg, image/png, image/jpg, image/webp"
                    hide-details
                    multiple
                    @update:model-value="validateAndOpenCropper"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="justify-center pb-13">
          <div class="d-flex flex-column align-center w-100">
            <v-btn
              class="primary black--text text-transform-none gtext-t4 font-weight-medium"
              rounded
              variant="flat"
              width="100%"
              max-width="400"
              size="x-large"
              color="primary"
              :loading="saveLoading"
              :disabled="!pendingUpload"
              @click="handleCloseDialog"
            >
              {{
                pendingUpload
                  ? Array.isArray(pendingUpload)
                    ? `Upload ${pendingUpload.length} Images & Save`
                    : "Upload & Save"
                  : "Save"
              }}
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <cropper-dialog
      v-model="showCropperDialog"
      :file_url="crop_file_url"
      :confirm_loading="crop_confirm_loading"
      @cropped-data="croppedData"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'
import { useNuxtApp } from '#app'
import CropperDialog from '@/components/common/CropperDialog.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  contentData: Object,
  images: {
    type: Array,
    default: () => [],
  },
})
const emit = defineEmits([
  'update:modelValue',
  'update:images',
  'refresh-gallery',
])
const dialogVisible = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})
const imgInput = ref(null)
const crop_confirm_loading = ref(false)
const crop_file_url = ref('')
const showCropperDialog = ref(false)
const mainImage = ref(null)
const selectedImageIndex = ref(0)
const pendingUpload = ref(null)
const pendingUploads = ref([])
const pendingPreviews = ref([])
const currentCropIndex = ref(0)
const saveLoading = ref(false)
const imgInputRef = ref(null)
const galleryDialog = ref(false)

const router = useRouter()
const route = useRoute()
const display = useDisplay()
const { $toast } = useNuxtApp()

function handleSelectedImage(row, index) {
  mainImage.value = row.fileUri
  selectedImageIndex.value = index + 1
}

function handlePreviewSelected(preview, index) {
  mainImage.value = preview
  selectedImageIndex.value = props.images.length + index + 1
}

function handleCloseDialog() {
  if (!pendingUpload.value && props.images.length === 0) {
    return
  }
  if (pendingUpload.value) {
    uploadImage()
  }
  else {
    dialogVisible.value = false
  }
}

async function uploadImage() {
  saveLoading.value = true
  const filesToUpload = Array.isArray(pendingUpload.value)
    ? pendingUpload.value
    : [pendingUpload.value]

  try {
    const uploadPromises = filesToUpload.map((file) => {
      const formData = new FormData()
      formData.append('File', file)
      formData.append('FileType', 'SimpleImage')
      return useApiService
        .post(`/api/v2/schools/${route.params.id}/images`, formData)
        .then((response) => {
          return response
        })
        .catch((error) => {
          $toast.error('Error uploading file: Unauthorized', {
            containerClass: 'toast-dialog-notif',
          })
          throw error
        })
    })

    try {
      const responses = await Promise.all(uploadPromises)
      const newImageUrls = responses
        .filter(response => response && response.url)
        .map(response => response.url)
      if (newImageUrls.length > 0) {
        const updatedImages = [...newImageUrls, ...props.images]
        emit('update:images', updatedImages)
      }
      $toast.success(
        `Your images have been submitted but need to be reviewed by the community before being shown`,
        { containerClass: 'toast-dialog-notif' },
      )
      pendingUpload.value = null
      pendingUploads.value = []
      pendingPreviews.value = []
      currentCropIndex.value = 0
      dialogVisible.value = false
      emit('refresh-gallery')
    }
    catch (error) {
      console.error('Error cleaning up after upload:', error)
      $toast.error('Error occurred while finalizing upload', {
        containerClass: 'toast-dialog-notif',
      })
    }
  }
  catch (err) {
    if (err.response?.status == 401 || err.response?.status == 403) {
      openAuthDialog('login')
    }
    else {
      $toast.error(err.response?.data?.message || 'Upload failed', {
        containerClass: 'toast-dialog-notif',
      })
    }
  }
  finally {
    saveLoading.value = false
  }
}

function openImgInput() {
  if (imgInputRef.value) {
    const input
      = imgInputRef.value.$el?.querySelector('input') || imgInputRef.value.input
    if (input) input.click()
  }
}

function validateAndOpenCropper(files) {
  if (!files || files.length === 0) return
  pendingUploads.value = []
  pendingPreviews.value = []
  currentCropIndex.value = 0
  const filesArray = Array.isArray(files) ? files : [files]
  for (let i = 0; i < filesArray.length; i++) {
    const file = filesArray[i]
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
    if (!validTypes.includes(file.type)) {
      $toast.error(
        `File ${file.name}: Invalid file type. Please use JPG, PNG or WebP images.`,
        { containerClass: 'toast-dialog-notif' },
      )
      continue
    }
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      $toast.error(`File ${file.name}: Too large. Maximum size is 5MB.`, {
        containerClass: 'toast-dialog-notif',
      })
      continue
    }
    pendingUploads.value.unshift(file)
    const previewUrl = URL.createObjectURL(file)
    pendingPreviews.value.unshift(previewUrl)
  }
  if (pendingPreviews.value.length > 0) {
    mainImage.value = pendingPreviews.value[0]
  }
  if (pendingUploads.value.length > 0) {
    openCropper(pendingUploads.value[0])
  }
  else {
    imgInput.value = null
  }
}

function openCropper(file) {
  crop_file_url.value = URL.createObjectURL(file)
  if (crop_file_url.value) showCropperDialog.value = true
}

function openAuthDialog(val) {
  router.push({ query: { auth_form: val } })
}

function croppedData(data) {
  const timestamp = new Date().getTime()
  const _originalFile = pendingUploads.value[currentCropIndex.value]
  const fileType = 'image/webp'
  const fileExt = 'webp'
  const filename = `image_${timestamp}_${currentCropIndex.value}.${fileExt}`
  const file = new File([data], filename, { type: fileType })
  if (!pendingUpload.value) {
    pendingUpload.value = []
  }
  else if (!Array.isArray(pendingUpload.value)) {
    pendingUpload.value = [pendingUpload.value]
  }
  pendingUpload.value.unshift(file)
  currentCropIndex.value++
  if (currentCropIndex.value < pendingUploads.value.length) {
    openCropper(pendingUploads.value[currentCropIndex.value])
  }
  else {
    showCropperDialog.value = false
    const fileCount = pendingUpload.value.length
    $toast.info(
      `${fileCount} ${
        fileCount === 1 ? 'image' : 'images'
      } ready to upload. Click Save to complete the upload.`,
      { containerClass: 'toast-dialog-notif' },
    )
  }
}

watch(
  () => props.images,
  (newValue) => {
    if (newValue.length >= 1) {
      mainImage.value = newValue[0].fileUri
      selectedImageIndex.value = 1
    }
  },
  { immediate: true },
)

onMounted(() => {
  if (props.images && props.images.length > 0) {
    mainImage.value = props.images[0].fileUri
    selectedImageIndex.value = 1
  }
})
</script>

<style scoped>
.schoolDetailsImg {
  height: 28.1rem;
  max-height: 28.1rem;
  width: 100%;
  border-radius: 0.6rem;
}

.schoolThumbImg {
  width: 100%;
  height: 6.4247rem;
  max-height: 6.4247rem;
  border-radius: 0.4rem;
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

.pulse-animation {
  animation: pulse 1.5s infinite;
}

.pending-thumb {
  filter: blur(1px);
  opacity: 0.8;
  transition: all 0.3s ease;
}

.pending-thumb:hover {
  filter: blur(0);
  opacity: 1;
}

.pending-badge {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--v-primary-base), 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(var(--v-primary-base), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--v-primary-base), 0);
  }
}
</style>
