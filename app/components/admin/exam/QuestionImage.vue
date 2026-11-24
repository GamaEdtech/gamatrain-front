<template>
  <div class="d-flex flex-column ga-1">
    <img
      v-if="preview"
      :src="preview"
      :alt="label"
      class="question-image"
    >
    <div class="d-flex align-center flex-wrap ga-2">
      <v-file-input
        :key="inputKey"
        :label="preview ? `Replace ${label.toLowerCase()}` : `Add ${label.toLowerCase()}`"
        accept="image/png,image/jpeg,image/webp"
        prepend-icon="md:image"
        variant="outlined"
        density="compact"
        hide-details
        class="image-input"
        @update:model-value="pick"
      />
      <v-btn
        v-if="preview && !pending"
        variant="text"
        color="error"
        size="small"
        prepend-icon="md:delete"
        @click="emit('change', null)"
      >
        Remove
      </v-btn>
      <v-btn
        v-if="change !== undefined"
        variant="text"
        size="small"
        @click="emit('change', undefined)"
      >
        Undo
      </v-btn>
    </div>
    <!-- The test maker's cropper: the admin crops the picked image, which comes back as WebP. -->
    <common-cropper-dialog
      v-model="cropping"
      :file-url="cropUrl"
      :stencil-props="{ movable: true, resizable: true }"
      :canvas="{ maxWidth: 1600, maxHeight: 1600 }"
      :quality="0.9"
      @cropped-data="cropped"
    />
  </div>
</template>

<script setup lang="ts">
// One of a question's separate images (gama-api's way: one image file per text). A picked image is cropped first, as in
// the test maker, and the change is only queued here (a WebP file, null to remove, undefined for none); the page sends
// it when the question is saved.
const props = defineProps<{
  label: string
  url: string | null | undefined
  change: File | null | undefined
}>()

const emit = defineEmits<{ change: [File | null | undefined] }>()

const pending = computed(() => (props.change instanceof File ? props.change : null))
const objectUrl = ref<string | null>(null)
const cropUrl = ref('')
const cropping = ref(false)
// Re-created after each pick, so picking the same file again opens the cropper again.
const inputKey = ref(0)

watch(pending, (file) => {
  if (objectUrl.value) URL.revokeObjectURL(objectUrl.value)
  objectUrl.value = file ? URL.createObjectURL(file) : null
})

watch(cropping, (open) => {
  if (!open && cropUrl.value) {
    URL.revokeObjectURL(cropUrl.value)
    cropUrl.value = ''
  }
})

onBeforeUnmount(() => {
  if (objectUrl.value) URL.revokeObjectURL(objectUrl.value)
  if (cropUrl.value) URL.revokeObjectURL(cropUrl.value)
})

const preview = computed(() => (props.change === null ? null : objectUrl.value ?? props.url ?? null))

const pick = (value: File | File[] | null) => {
  const file = Array.isArray(value) ? value[0] : value
  inputKey.value++
  if (!file) return
  cropUrl.value = URL.createObjectURL(file)
  cropping.value = true
}

const cropped = (blob: Blob | null) => {
  cropping.value = false
  if (blob) emit('change', new File([blob], 'image.webp', { type: 'image/webp' }))
}
</script>

<style scoped>
.question-image {
  max-width: 320px;
  max-height: 180px;
  object-fit: contain;
  align-self: flex-start;
}

.image-input {
  max-width: 320px;
}
</style>
