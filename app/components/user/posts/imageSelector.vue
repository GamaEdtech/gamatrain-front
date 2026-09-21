<template>
  <div class="w-100 d-flex flex-column align-start justify-start">
    <span class="w-50 text-h5 font-weight-medium text-grey700 mt-1">
      <v-badge
        floating
        location="top right"
        color="transparent"
        overlap
      >
        <template #badge>
          <v-icon
            size="large"
            color="error"
          >
            md:star
          </v-icon>
        </template>
        <span>Index image</span>
      </v-badge>
    </span>

    <v-skeleton-loader
      v-if="loading"
      class="w-100 mt-2 rounded-lg"
      height="154"
    />
    <div
      v-if="previewImage && !loading"
      class="mt-2 w-100 container-image"
    >
      <img
        :src="previewImage as string"
        alt="Index image"
        class="w-100 h-100 rounded-lg"
      >
    </div>
    <div class="w-100 d-flex justify-space-between align-center mt-2">
      <v-btn
        color="white"
        rounded="pill"
        variant="flat"
        class="text-grey900 font-weight-medium text-h5 border-grey400 border-solid border-md"
        @click="triggerImageUpload"
      >
        {{ previewImage ? "Change image" : "Upload image" }}
      </v-btn>
      <v-btn
        icon
        flat
        variant="text"
        :disabled="!previewImage"
        @click="deleteImage"
      >
        <v-icon
          size="large"
          color="grey500"
        >
          md:delete
        </v-icon>
      </v-btn>
      <input
        ref="imageInput"
        type="file"
        accept="image/*"
        style="display: none"
        @change="onImageSelected"
      >
    </div>
    <div
      v-if="errorMessage"
      class="text-error text-subtitle-1 mt-1"
    >
      {{ errorMessage }}
    </div>
    <common-cropper-dialog
      v-model="showCropperDialog"
      :file-url="cropFileUrl"
      :stencil-props="{ width: 740, height: 555, resizable: false }"
      @cropped-data="croppedData"
    />
  </div>
</template>

<script setup lang="ts">
interface IImageSelector {
  image: string | File | null
  loading?: boolean
  rules?: ((value: File | string | null) => true | string)[]
}

const props = withDefaults(defineProps<IImageSelector>(), {
  loading: false,
  rules: () => [],
})
const emit = defineEmits(['update:image'])
const imageLocal = ref(props.image)
const previewImage = ref(props.image)
const showCropperDialog = ref(false)
const cropFileUrl = ref('')
const imageInput = ref<HTMLInputElement>()
const errorMessage = ref('')
const isTouched = ref(false)

watch(
  () => props.image,
  (val) => {
    imageLocal.value = val
    if (typeof val == 'string') {
      previewImage.value = val
    }
  },
)

const croppedData = (data: Blob) => {
  showCropperDialog.value = false
  const timestamp = new Date().getTime()
  const fileType = 'image/webp'
  const fileExt = 'webp'
  const filename = `image_${timestamp}.${fileExt}`
  const file = new File([data], filename, { type: fileType })

  previewImage.value = URL.createObjectURL(file)
  imageLocal.value = file
  emit('update:image', imageLocal.value)
  isTouched.value = true
  validate()
}
const triggerImageUpload = () => {
  (imageInput.value as HTMLInputElement).click()
}

const onImageSelected = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    cropFileUrl.value = URL.createObjectURL(file)
    showCropperDialog.value = true
  }
}

const deleteImage = () => {
  previewImage.value = ''
  imageLocal.value = ''
  cropFileUrl.value = ''
  emit('update:image', imageLocal.value)
  isTouched.value = true
  validate()
}

const validate = (force = false) => {
  if (!isTouched.value && !force) {
    errorMessage.value = ''
    return true
  }

  if (!props.rules?.length) {
    errorMessage.value = ''
    return true
  }

  for (const rule of props.rules) {
    const result = rule(imageLocal.value)

    if (result !== true) {
      errorMessage.value = result
      return false
    }
  }

  errorMessage.value = ''
  return true
}
</script>

<style scoped>
.container-image{
  min-height : 134px
}
</style>
