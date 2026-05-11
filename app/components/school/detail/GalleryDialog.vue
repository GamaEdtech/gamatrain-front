<template>
  <v-dialog
    v-model="dialogVisible"
    transition="dialog-bottom-transition"
    :fullscreen="display.xs.value"
    max-width="820"
  >
    <v-card class="rounded-lg">
      <v-card-text class="py-6 py-md-8 px-6 px-md-8">
        <div class="d-flex align-center justify-space-between">
          <div class="text-h3 font-weight-bold priamry-gray-700">
            School images
          </div>
          <v-btn
            icon
            variant="text"
            @click="dialogVisible = false"
          >
            <v-icon
              size="26"
              color="#475467"
            >
              md:close
            </v-icon>
          </v-btn>
        </div>
        <v-row class="mt-3">
          <v-col
            cols="12"
            md="7"
            class="d-flex flex-column align-center"
          >
            <div
              v-if="mainImageInformation && mainImageInformation.src"
              class="w-100 d-flex align-center justify-center main-image-div"
            >
              <img
                class="w-100 h-100 rounded-lg image-main"
                :src="mainImageInformation.src"
                alt="School image"
              >
            </div>
            <div
              v-else
              class="w-100 rounded-lg d-flex align-center justify-center enter-img-holder cursor-pointer"
            >
              <div class="text-center">
                <v-icon
                  size="48"
                  class="primary-gray-300 mb-10"
                >
                  md:panorama
                </v-icon>
                <p class="gtext-t4 primary-blue-500">
                  No image
                </p>
                <div class="mt-2 gtext-t6 primary-gray-400">
                  Accepted formats: JPG, PNG, WebP
                </div>
              </div>
            </div>
            <div
              v-if="mainImageInformation"
              class="w-100 d-flex align-center"
            >
              <div
                v-if="!mainImageInformation.isPendingUpload"
                class="w-50 mt-6"
              >
                <v-progress-circular
                  v-show="!isDefaultImage && loadingSetDefaultImage"
                  color="primary"
                  indeterminate
                />
                <v-checkbox
                  v-show="!isDefaultImage && !loadingSetDefaultImage"
                  :model-value="isDefaultImage"
                  color="primary"
                  class="text-h4"
                  hide-details
                  false-icon="md:check_box_outline_blank"
                  true-icon="md:check_box"
                  @update:model-value="(val) => changeStatusDefaultImage(val)"
                >
                  <template #label>
                    <span class="text-h5 font-weight-bold text-no-wrap ml-1">Set as main Image</span>
                  </template>
                </v-checkbox>

                <v-chip
                  v-show="isDefaultImage"
                  class="text-h6 font-weight-bold"
                  color="success"
                >
                  Default image
                </v-chip>
              </div>
              <div
                class="w-100 d-flex align-center justify-end ga-2 text-center gtext-t5 font-weight-heavy mt-6"
              >
                <span>
                  {{ mainImageInformation.index
                  }}<span class="primary-gray-400">/{{
                    images.length
                      + (croppedUploads ? croppedUploads.length : 0)
                  }}</span></span>
                <v-chip
                  v-if="mainImageInformation.isPendingUpload"
                  class="text-h6 font-weight-bold"
                  color="orange"
                >
                  Pending upload
                </v-chip>
              </div>
            </div>
          </v-col>
          <v-col
            cols="12"
            md="5"
            class="d-flex flex-wrap"
          >
            <!-- Pending upload previews -->
            <v-col
              v-for="(preview, index) in pendingPreviews"
              :key="`pending-${index}`"
              cols="4"
              sm="3"
              md="4"
              lg="6"
              class="pa-1"
            >
              <div class="position-relative">
                <v-img
                  :src="preview"
                  aspect-ratio="1"
                  class="position-relative rounded height-images pending-thumb"
                  cover
                  @click="handlePreviewSelected(preview, index)"
                />
                <div class="pending-badge">
                  <v-btn
                    icon
                    flat
                    width="20"
                    height="20"
                    color="#00000080"
                  >
                    <v-icon
                      size="small"
                      color="white"
                    >
                      md:cloud_upload
                    </v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    flat
                    width="20"
                    height="20"
                    color="#F04438"
                    @click="deletePreviewImage(index)"
                  >
                    <v-icon
                      size="small"
                      color="white"
                    >
                      md:close
                    </v-icon>
                  </v-btn>
                </div>
              </div>
            </v-col>
            <v-col
              v-for="(item, index) in images"
              :key="`gallery-${index}`"
              cols="4"
              sm="3"
              md="4"
              lg="6"
              class="pa-1 cursor-pointer"
            >
              <div class="position-relative">
                <v-img
                  :src="item.fileUri?.replace(/^http:\/\//, 'https://')"
                  aspect-ratio="1"
                  class="position-relative rounded height-images"
                  cover
                  @click="handleSelectedImage(item, index)"
                />

                <v-btn
                  icon
                  flat
                  width="20"
                  height="20"
                  class="position-absolute position-delete"
                  color="#F04438"
                  :loading="item.loading"
                  @click="deleteImage(item)"
                >
                  <v-icon
                    size="small"
                    color="white"
                  >
                    md:close
                  </v-icon>
                </v-btn>
              </div>
            </v-col>

            <v-col
              cols="4"
              sm="3"
              md="4"
              lg="6"
              align="center"
              justify="center"
              class="fill-height"
            >
              <v-btn
                color="primary"
                icon
                @click="openSourceSelector"
              >
                <v-icon
                  size="36"
                  color="white"
                >
                  md:add
                </v-icon>
              </v-btn>
              <div class="mt-2 text-caption primary-gray-400 text-center">
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
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="justify-center pb-6 mt-10">
        <div class="d-flex flex-column align-center w-100">
          <v-btn
            class="primary black--text text-transform-none gtext-t4 font-weight-medium"
            rounded
            variant="flat"
            width="100%"
            max-width="300"
            size="x-large"
            color="primary"
            :loading="saveLoading"
            :disabled="!croppedUploads"
            @click="handleCloseDialog"
          >
            {{
              croppedUploads
                ? Array.isArray(croppedUploads)
                  ? `Upload ${croppedUploads.length} Images & Save`
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
    :file-url="cropFileUrl"
    @cropped-data="croppedData"
  />
  <modals-photo-source-selector
    v-model:show-dialog="showSourceModal"
    @open-file-system="openImgInput"
    @send-file-camera="recieveFileCamera"
  />
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
const cropFileUrl = ref('')
const showCropperDialog = ref(false)
const mainImageInformation = ref(null)
const croppedUploads = ref(null)
const selectedFiles = ref([])
const pendingPreviews = ref([])
const currentCropIndex = ref(0)
const saveLoading = ref(false)
const imgInputRef = ref(null)
const isDefaultImage = ref(true)
const loadingSetDefaultImage = ref(false)
const showSourceModal = ref(false)

const router = useRouter()
const route = useRoute()
const display = useDisplay()
const { $toast } = useNuxtApp()

const handleSelectedImage = (image, index) => {
  mainImageInformation.value = {
    id: image.id,
    src: image.fileUri,
    isPendingUpload: false,
    index: croppedUploads.value
      ? croppedUploads.value.length + index + 1
      : index + 1,
  }
  isDefaultImage.value = image.isDefault
}

const handlePreviewSelected = (preview, index) => {
  mainImageInformation.value = {
    id: 'preview',
    src: preview,
    isPendingUpload: true,
    index: index + 1,
  }
}

const changeStatusDefaultImage = async (valueCheckBox) => {
  if (valueCheckBox) {
    loadingSetDefaultImage.value = true
    const formData = { defaultImageId: mainImageInformation.value.id ?? null }
    useApiService
      .post(`/api/v2/schools/${route.params.id}/contributions`, formData)
      .then(async (response) => {
        if (response.succeeded) {
          $toast?.success('Your contribution has been successfully submitted')
          isDefaultImage.value = true
          const previousDefault = props.images.filter(item => item.isDefault)
          if (previousDefault.length > 0) {
            previousDefault[0].isDefault = false
          }

          const newDefault = props.images.filter(
            item => item.id == mainImageInformation.value.id,
          )
          if (newDefault.length > 0) {
            newDefault[0].isDefault = true
          }
        }
        else {
          $toast?.error(response?.errors[0]?.message)
        }
      })
      .catch((err) => {
        if (err?.response?.status == 401 || err?.response?.status == 403) {
          $toast?.error('Please login to update school Default Image')
        }
        else $toast?.error(err?.response?.data?.message)
      })
      .finally(() => {
        loadingSetDefaultImage.value = false
      })
  }
}

const handleCloseDialog = () => {
  if (!croppedUploads.value && props.images.length === 0) {
    return
  }
  if (croppedUploads.value) {
    uploadImage()
  }
  else {
    dialogVisible.value = false
  }
}

const uploadImage = async () => {
  saveLoading.value = true
  const filesToUpload = Array.isArray(croppedUploads.value)
    ? croppedUploads.value
    : [croppedUploads.value]

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
      await Promise.all(uploadPromises)
      $toast.success(
        `Your images have been submitted but need to be reviewed by the community before being shown`,
        { containerClass: 'toast-dialog-notif' },
      )
      croppedUploads.value = null
      selectedFiles.value = []
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

const openSourceSelector = () => {
  showSourceModal.value = true
}
const openImgInput = () => {
  if (imgInputRef.value) {
    const input
      = imgInputRef.value.$el?.querySelector('input') || imgInputRef.value.input
    if (input) input.click()
  }
}

const recieveFileCamera = (file) => {
  validateAndOpenCropper([file])
}

const validateAndOpenCropper = (files) => {
  if (!files || files.length === 0) return
  const filesArray = Array.isArray(files) ? files : [files]

  if (filesArray.length >= 7) {
    $toast.error('You can only select up to 7 images at once.', {
      containerClass: 'toast-dialog-notif',
    })
    return
  }

  if (croppedUploads.value && croppedUploads.value.length >= 5) {
    $toast.error(
      'You can only keep up to 5 cropped images before uploading. Please upload them first.',
      { containerClass: 'toast-dialog-notif' },
    )
    return
  }

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
    selectedFiles.value.unshift(file)
  }
  if (selectedFiles.value.length > 0) {
    openCropper(selectedFiles.value[0])
  }
  else {
    imgInput.value = null
  }
}

const openCropper = (file) => {
  cropFileUrl.value = URL.createObjectURL(file)
  if (cropFileUrl.value) showCropperDialog.value = true
}

const openAuthDialog = (val) => {
  router.push({ query: { auth_form: val } })
}

const croppedData = (data) => {
  const timestamp = new Date().getTime()
  const fileType = 'image/webp'
  const fileExt = 'webp'
  const filename = `image_${timestamp}_${currentCropIndex.value}.${fileExt}`
  const file = new File([data], filename, { type: fileType })
  if (!croppedUploads.value) {
    croppedUploads.value = []
  }
  else if (!Array.isArray(croppedUploads.value)) {
    croppedUploads.value = [croppedUploads.value]
  }

  currentCropIndex.value++
  croppedUploads.value.push(file)

  const previewUrl = URL.createObjectURL(file)
  pendingPreviews.value.push(previewUrl)

  selectedFiles.value.shift()

  if (selectedFiles.value.length > 0) {
    openCropper(selectedFiles.value[0])
  }
  else {
    showCropperDialog.value = false
    const fileCount = croppedUploads.value.length
    $toast.info(
      `${fileCount} ${
        fileCount === 1 ? 'image' : 'images'
      } ready to upload. Click Save to complete the upload.`,
      { containerClass: 'toast-dialog-notif' },
    )
  }
}

// When the modal is closed, intentionally or unintentionally, by clicking outside the modal, the selected file is deleted.
watch(
  () => showCropperDialog.value,
  () => {
    if (!showCropperDialog.value) {
      selectedFiles.value = []
    }
  },
)

watch(
  () => props.images,
  () => {
    const defalutImage = props.images.filter(item => item.isDefault)
    if (defalutImage.length > 0) {
      mainImageInformation.value = {
        id: defalutImage[0].id,
        src: defalutImage[0].fileUri,
        isPendingUpload: false,
        index: 1,
      }
    }
    else {
      if (props.images.length > 0) {
        mainImageInformation.value = {
          id: props.images[0].id,
          src: props.images[0].fileUri,
          isPendingUpload: false,
          index: 1,
        }
      }
    }
  },
  { immediate: true },
)

onMounted(() => {
  if (props.images && props.images.length > 0) {
    const defalutImage = props.images.filter(item => item.isDefault)
    if (defalutImage.length > 0) {
      mainImageInformation.value = {
        src: defalutImage[0].fileUri,
        isPendingUpload: false,
        index: 1,
      }
    }
    else {
      mainImageInformation.value = {
        id: props.images[0].id,
        src: props.images[0].fileUri,
        isPendingUpload: false,
        index: 1,
      }
    }
  }
})

const deletePreviewImage = (index) => {
  pendingPreviews.value.splice(index, 1)

  if (Array.isArray(croppedUploads.value)) {
    croppedUploads.value.splice(index, 1)
  }
  else {
    croppedUploads.value = []
  }
}

const deleteImage = async (image) => {
  image.loading = true
  const bodyRequest = {
    description: 'incorrect',
  }
  try {
    const response = await useApiService.post(
      `/api/v2/schools/${route.params.id}/images/${image.id}/contributions`,
      bodyRequest,
    )
    if (response.succeeded) {
      const updatedImages = props.images.filter(item => item.id != image.id)
      emit('update:images', updatedImages)
      $toast.success(
        `Your images have been deleted but need to be reviewed by the community before being shown`,
        { containerClass: 'toast-dialog-notif' },
      )
    }
    else {
      $toast.error('Error occurred while deleting', {
        containerClass: 'toast-dialog-notif',
      })
    }
  }
  catch (error) {
    $toast.error(error.response?.data?.message || 'Delete failed', {
      containerClass: 'toast-dialog-notif',
    })
  }
  finally {
    image.loading = false
  }
}
</script>

<style scoped>
.enter-img-holder {
  background: #f2f4f7;
  height: 300px;
}

.main-image-div {
  height: 300px;
  max-height: 300px;
}
.image-main {
  object-fit: fill;
}
.height-images {
  max-height: 80px;
}
@media only screen and (max-width: 960px) {
  .height-images {
    max-height: 100px;
  }
}
@media only screen and (max-width: 600px) {
  .height-images {
    max-height: 120px;
  }

  .main-image-div {
    height: 240px;
    max-height: 240px;
  }
}

.position-delete {
  top: 4px;
  right: 4px;
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
  top: 4px;
  right: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 4px;
}
</style>
