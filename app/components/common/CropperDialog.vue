<template>
  <v-dialog
    v-model="dialogVisible"
    max-width="600"
  >
    <v-card id="img-cropper-dialog">
      <ClientOnly>
        <v-skeleton-loader
          v-if="loading"
          class="w-100"
          height="320"
        />

        <LazyCropper
          v-show="dialogVisible"
          :src="fileUrl"
          :stencil-props="stencilProps"
          image-restriction="stencil"
          :aspect-ratio="aspectRatio"
          @change="cropFile"
          @ready="imageLoad"
        />
      </ClientOnly>
      <v-card-actions
        style="position: sticky; bottom: 0; left: 0; right: 0"
        class="pa-0 d-flex align-center justify-center"
      >
        <v-btn
          color="primary text-h5 font-weight-bold"
          width="150"
          rounded="xl"
          size="large"
          :loading="cropFileLoading || uploadLoading"
          variant="flat"
          density="compact"
          @click="emitFile()"
        >
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  fileUrl: {
    type: String,
    default: '',
  },
  stencilProps: {
    type: Object,
    default: () => ({ width: 400, height: 150, resizable: false }),
  },
  uploadLoading: {
    type: Boolean,
    default: false,
  },
  aspectRatio: {
    type: Number,
    default: null,
  },
})
const emit = defineEmits(['update:modelValue', 'croppedData'])

const LazyCropper = defineAsyncComponent({
  loader: async () => {
    await import('vue-advanced-cropper/dist/style.css')
    const m = await import('vue-advanced-cropper')
    return m.Cropper
  },
  suspensible: false,
})

const dialogVisible = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const cropFileLoading = ref(false)
const loading = ref(true)

const imageLoad = () => {
  loading.value = false
}

watch(
  () => props.fileUrl,
  () => {
    if (props.fileUrl) {
      loading.value = true
    }
  },
)
const croppedCanvas = ref(null)
const cropFile = ({ canvas }) => {
  if (!canvas) return
  croppedCanvas.value = canvas
}

const emitFile = () => {
  if (!croppedCanvas.value) return
  cropFileLoading.value = true
  croppedCanvas.value.toBlob((blob) => {
    emit('croppedData', blob, croppedCanvas.value)
    cropFileLoading.value = false
  }, 'image/webp')
}
</script>

<style scoped></style>
