<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    :scrim="false"
    transition="dialog-bottom-transition"
  >
    <v-card>
      <!-- Toolbar -->
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

        <!-- Zoom / Rotate -->
        <v-btn
          icon
          :disabled="!numPages"
          @click="zoomOut"
        >
          <v-icon>mdi-magnify-minus-outline</v-icon>
        </v-btn>
        <v-btn
          icon
          :disabled="!numPages"
          @click="zoomIn"
        >
          <v-icon>mdi-magnify-plus-outline</v-icon>
        </v-btn>
        <v-btn
          icon
          :disabled="!numPages"
          @click="rotate"
        >
          <v-icon>mdi-rotate-right</v-icon>
        </v-btn>

        <!-- External actions -->
        <v-btn
          v-if="pdfUrl"
          v-tooltip="'Open in new tab'"
          icon
          dark
          @click="openInNewTab"
        >
          <v-icon>mdi-open-in-new</v-icon>
        </v-btn>

        <!-- <v-btn
          v-if="pdfUrl"
          v-tooltip="'Download PDF'"
          icon
          dark
          :loading="downloadLoading"
          @click="downloadPdf"
        >
          <v-icon>mdi-download</v-icon>
        </v-btn> -->
      </v-toolbar>

      <v-card-text class="pa-0">
        <!-- Loading -->
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

        <!-- Error -->
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
          <div
            v-if="pdfUrl"
            class="d-flex gap-3 justify-center"
          >
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

        <!-- PDF pages -->
        <div
          v-else-if="numPages"
          class="pdf-scroll"
        >
          <div
            class="pdf-pages"
            :style="pagesStyle"
          >
            <!-- Render all pages -->
            <VuePdf
              v-for="p in numPages"
              :key="p"
              :src="pdfSrc"
              :page="p"
              :rotation="rotation"
              class="pdf-page"
            />
          </div>
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

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { VuePdf, createLoadingTask } from 'vue3-pdfjs/esm'
import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api'

const props = defineProps<{
  modelValue: boolean
  title?: string
  pdfUrl?: string
  fileName?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
}>()

const dialog = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
})

const loading = ref(false)
const error = ref('')
const downloadLoading = ref(false)

const pdfSrc = ref<string | Uint8Array | Record<string, unknown>>('')
const numPages = ref(0)

const zoom = ref(1)
const rotation = ref(0)

const pagesStyle = computed(() => ({
  transform: `scale(${zoom.value})`,
  transformOrigin: 'top left',
}))

watch(
  () => dialog.value,
  async (open) => {
    if (open && props.pdfUrl) await loadPdf(props.pdfUrl)
  },
  { immediate: true },
)

watch(
  () => props.pdfUrl,
  async (u) => {
    if (dialog.value && u) await loadPdf(u)
    else {
      clearState()
    }
  },
)

function clearState() {
  loading.value = false
  error.value = ''
  numPages.value = 0
  pdfSrc.value = ''
  zoom.value = 1
  rotation.value = 0
}

async function loadPdf(url: string) {
  clearState()
  if (!url) return
  try {
    loading.value = true
    error.value = ''
    pdfSrc.value = url

    const task = createLoadingTask(pdfSrc.value)
    const pdf: PDFDocumentProxy = await task.promise
    numPages.value = pdf.numPages
  }
  catch (_e) {
    console.error(_e)
    error.value = 'Failed to load PDF.'
  }
  finally {
    loading.value = false
  }
}

function zoomIn() {
  zoom.value = Math.min(zoom.value + 0.1, 3)
}
function zoomOut() {
  zoom.value = Math.max(zoom.value - 0.1, 0.3)
}
function rotate() {
  rotation.value = (rotation.value + 90) % 360
}

function closeDialog() {
  dialog.value = false
}

function openInNewTab() {
  if (props.pdfUrl) window.open(props.pdfUrl, '_blank', 'noopener')
}

async function downloadPdf() {
  if (!props.pdfUrl) return
  try {
    downloadLoading.value = true
    const FileSaver = await import('file-saver')
    await FileSaver.saveAs(props.pdfUrl, props.fileName || 'document.pdf')
  }
  catch (err) {
    console.error('Download error:', err)
    window.open(props.pdfUrl, '_blank', 'noopener')
  }
  finally {
    downloadLoading.value = false
  }
}

onBeforeUnmount(() => {})
</script>

<style scoped>
.pdf-scroll {
  width: 100%;
  height: calc(100vh - 64px);
  overflow: auto;
  background: #1212120a;
}

.pdf-pages {
  padding: 24px;
}

.pdf-page {
  display: block;
  margin: 0 auto 24px auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  background: white;
}

@media (max-width: 768px) {
  .pdf-scroll {
    height: calc(100vh - 56px);
  }
}
</style>
