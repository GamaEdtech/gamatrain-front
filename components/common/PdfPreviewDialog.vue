<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    :scrim="false"
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar
        color="primary"
        dark
      >
        <v-btn
          v-tooltip="'Close'"
          icon
          dark
          @click="closeDialog"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ title || "PDF Preview" }}</v-toolbar-title>
        <v-spacer />
        <v-btn
          v-if="pdfUrl"
          v-tooltip="'Open in new tab'"
          icon
          dark
          @click="openInNewTab"
        >
          <v-icon>mdi-open-in-new</v-icon>
        </v-btn>

        <v-btn
          v-if="pdfUrl"
          v-tooltip="'Download PDF'"
          icon
          dark
          :loading="downloadLoading"
          @click="downloadPdf"
        >
          <v-icon>mdi-download</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="pa-0">
        <div
          v-if="loading"
          class="d-flex justify-center align-center"
          style="height: 80vh"
        >
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
          />
        </div>

        <div
          v-else-if="error"
          class="d-flex flex-column justify-center align-center"
          style="height: 80vh"
        >
          <v-icon
            size="64"
            color="error"
            class="mb-4"
          >
            mdi-alert-circle
          </v-icon>
          <h3 class="text-h6 mb-2">
            Unable to load PDF
          </h3>
          <p class="text-body-1 text-center mb-4">
            {{ error }}
          </p>
        </div>

        <div
          v-else-if="pdfUrl"
          class="pdf-container"
        >
          <div
            v-if="embedBlocked"
            class="pdf-blocked-container"
          >
            <v-icon
              size="64"
              color="warning"
              class="mb-4"
            >
              mdi-shield-alert
            </v-icon>
            <h3 class="text-h6 mb-3">
              PDF Preview Restricted
            </h3>
            <p class="text-body-1 text-center mb-4">
              This PDF cannot be previewed due to security restrictions.
            </p>
            <div class="d-flex gap-3 justify-center">
              <v-btn
                color="primary"
                prepend-icon="mdi-open-in-new"
                @click="openInNewTab"
              >
                Open PDF
              </v-btn>
              <v-btn
                color="success"
                :loading="downloadLoading"
                prepend-icon="mdi-download"
                @click="downloadPdf"
              >
                Download PDF
              </v-btn>
            </div>
          </div>
          <embed
            v-else
            :src="pdfUrl"
            type="application/pdf"
            referrerpolicy="strict-origin-when-cross-origin"
            class="pdf-embed"
            @error="handleEmbedError"
            @load="handleEmbedSuccess"
          >
        </div>

        <div
          v-else
          class="d-flex justify-center align-center"
          style="height: 80vh"
        >
          <v-icon
            size="64"
            color="grey"
          >
            mdi-file-pdf-box
          </v-icon>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  pdfUrl: {
    type: String,
    default: '',
  },
  fileName: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const dialog = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const loading = ref(false)
const error = ref('')
const downloadLoading = ref(false)
const embedBlocked = ref(false)

watch(dialog, (newVal) => {
  if (newVal && props.pdfUrl) {
    embedBlocked.value = false
  }
})

const closeDialog = () => {
  dialog.value = false
}

const openInNewTab = () => {
  if (props.pdfUrl) {
    window.open(props.pdfUrl, '_blank')
  }
}

const downloadPdf = async () => {
  if (!props.pdfUrl) return

  try {
    downloadLoading.value = true
    const FileSaver = await import('file-saver')
    await FileSaver.saveAs(props.pdfUrl, props.fileName || 'document.pdf')
  }
  catch (err) {
    console.error('Download error:', err)
    window.open(props.pdfUrl, '_blank')
  }
  finally {
    downloadLoading.value = false
  }
}

const handleEmbedSuccess = () => {
  embedBlocked.value = false
}

const handleEmbedError = () => {
  embedBlocked.value = true
  console.warn('PDF embed blocked, likely due to X-Frame-Options restriction')
}
</script>

<style scoped>
.pdf-container {
  width: 100%;
  height: calc(100vh - 64px);
  overflow: hidden;
}

.pdf-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.pdf-embed {
  width: 100%;
  height: 100%;
  border: none;
}

.pdf-blocked-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 2rem;
}

@media (max-width: 768px) {
  .pdf-container {
    height: calc(100vh - 56px);
  }
}
</style>
