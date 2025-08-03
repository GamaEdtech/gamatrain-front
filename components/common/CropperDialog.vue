<template>
  <v-dialog
    v-model="dialogVisible"
    transition="dialog-bottom-transition"
    max-width="600"
  >
    <v-card id="img-cropper-dialog">
      <cropper
        :src="file_url"
        :stencil-props="stencil_props"
        image-restriction="stencil"
        @change="cropFile"
      />
      <v-card-actions
        style="position: sticky; bottom: 0; left: 0; right: 0"
        class="pa-0"
      >
        <v-btn
          class="primary black--text text-transform-none gtext-t4 font-weight-medium"
          size="x-large"
          :loading="confirm_loading"
          block
          variant="flat"
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
import 'vue-advanced-cropper/dist/style.css'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  file_url: {
    type: String,
    default: '',
  },
  stencil_props: {
    type: Object,
    default: () => ({ width: 400, height: 150, resizable: false }),
  },
  confirm_loading: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:modelValue', 'croppedData'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const crop_file_loading = ref(false)
const cropped_data = ref(null)

function cropFile({ canvas }) {
  if (!canvas) return
  crop_file_loading.value = true
  canvas.toBlob((blob) => {
    cropped_data.value = blob
    crop_file_loading.value = false
  }, 'image/webp')
}

function emitFile() {
  emit('croppedData', cropped_data.value)
}
</script>
