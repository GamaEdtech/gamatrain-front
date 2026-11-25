<template>
  <div class="question-image d-flex align-center flex-wrap ga-3">
    <div
      v-if="shown"
      class="question-image__frame rounded-lg border-md"
      :class="{ 'question-image__frame--removed': removed }"
    >
      <button
        type="button"
        class="question-image__zoom"
        :aria-label="`View ${label} at full size`"
        @click="zoom = true"
      >
        <img
          :src="shown"
          :alt="label"
        >
      </button>
      <v-chip
        v-if="pending || removed"
        :color="removed ? 'error' : 'primary'"
        size="x-small"
        variant="flat"
        class="question-image__badge"
      >
        {{ removed ? 'Will be removed' : 'New' }}
      </v-chip>
    </div>

    <div class="d-flex align-center flex-wrap ga-1">
      <v-btn
        v-if="!removed"
        :prepend-icon="shown ? 'md:sync' : 'md:add_photo_alternate'"
        :variant="shown ? 'tonal' : 'text'"
        :color="shown ? 'primary' : 'grey700'"
        size="small"
        class="text-none"
        @click="picker?.click()"
      >
        {{ shown ? 'Replace' : label }}
      </v-btn>
      <v-btn
        v-if="shown && !pending && !removed"
        prepend-icon="md:delete"
        variant="text"
        color="error"
        size="small"
        class="text-none"
        @click="emit('change', null)"
      >
        Remove
      </v-btn>
      <v-btn
        v-if="change !== undefined"
        prepend-icon="md:undo"
        variant="text"
        size="small"
        class="text-none"
        @click="emit('change', undefined)"
      >
        Undo
      </v-btn>
      <span
        v-if="change !== undefined"
        class="text-caption text-grey600"
      >
        Saved with the question
      </span>
    </div>

    <!-- The image at its real size (never scaled up); a bigger one scrolls inside the dialog. -->
    <v-dialog
      v-model="zoom"
      width="auto"
      max-width="95vw"
      scrollable
    >
      <v-card>
        <v-card-title class="d-flex align-center ga-2 py-2">
          <span class="text-body-1">{{ label }}</span>
          <span
            v-if="size"
            class="text-caption text-grey600"
          >{{ size }}</span>
          <v-spacer />
          <v-btn
            icon="md:close"
            size="small"
            variant="text"
            aria-label="Close"
            @click="zoom = false"
          />
        </v-card-title>
        <v-card-text class="question-image__full pa-3">
          <img
            :src="shown ?? ''"
            :alt="label"
            @load="measure"
          >
        </v-card-text>
      </v-card>
    </v-dialog>

    <input
      ref="picker"
      type="file"
      accept="image/png,image/jpeg,image/webp"
      hidden
      @change="pick"
    >

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

const picker = ref<HTMLInputElement | null>(null)
const pending = computed(() => (props.change instanceof File ? props.change : null))
const removed = computed(() => props.change === null && !!props.url)
const objectUrl = ref<string | null>(null)
const cropUrl = ref('')
const cropping = ref(false)

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

// The new image, or the saved one (faded while it is marked for removal).
const shown = computed(() => objectUrl.value ?? props.url ?? null)

const zoom = ref(false)
// The image's own pixel size, shown in the full-size view.
const size = ref('')
const measure = (event: Event) => {
  const img = event.target as HTMLImageElement
  size.value = `${img.naturalWidth} × ${img.naturalHeight} px`
}
watch(shown, () => {
  size.value = ''
})

const pick = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  // Cleared, so picking the same file again opens the cropper again.
  input.value = ''
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
.question-image__frame {
  position: relative;
  padding: 6px;
  background: rgb(var(--v-theme-surface));
  border-color: rgb(var(--v-theme-grey200)) !important;
}

.question-image__frame img {
  display: block;
  max-width: 260px;
  max-height: 150px;
  object-fit: contain;
}

.question-image__zoom {
  display: block;
  cursor: zoom-in;
}

/* Real size: no max-width, so the image is never scaled down; the dialog body scrolls instead. */
.question-image__full {
  overflow: auto;
  background: rgb(var(--v-theme-surface));
}

.question-image__full img {
  display: block;
  max-width: none;
}

.question-image__frame--removed img {
  opacity: 0.35;
  filter: grayscale(1);
}

.question-image__badge {
  position: absolute;
  top: 6px;
  right: 6px;
}
</style>
