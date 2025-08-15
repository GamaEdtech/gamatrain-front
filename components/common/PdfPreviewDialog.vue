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
        :height="isMobile ? 56 : 64"
      >
        <v-btn
          v-tooltip="'Close'"
          icon
          dark
          @click="closeDialog"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <v-toolbar-title
          class="toolbar-title"
          :class="{ 'mobile-title': isMobile }"
        >
          {{ title || "PDF Preview" }}
        </v-toolbar-title>

        <v-spacer v-if="!isMobile" />

        <!-- Mobile Layout -->
        <template v-if="isMobile">
          <!-- Page Navigation - Mobile -->
          <div
            v-if="numPages > 0"
            class="mobile-nav-group"
          >
            <v-btn
              icon
              size="small"
              :disabled="currentPage <= 1 || navigating"
              @click="goToPreviousPage"
            >
              <v-icon size="20">
                mdi-chevron-up
              </v-icon>
            </v-btn>

            <div class="mobile-page-info">
              <input
                v-model.number="pageInput"
                class="mobile-page-input"
                density="compact"
                variant="outlined"
                hide-details
                single-line
                @keyup.enter="goToPageInput"
                @blur="resetPageInput"
              >
              <span class="mobile-page-total">/ {{ numPages }}</span>
            </div>

            <v-btn
              icon
              size="small"
              :disabled="currentPage >= numPages || navigating"
              @click="goToNextPage"
            >
              <v-icon size="20">
                mdi-chevron-down
              </v-icon>
            </v-btn>
          </div>
        </template>

        <!-- Desktop Layout -->
        <template v-else>
          <!-- Page Navigation - Desktop -->
          <template v-if="numPages > 0">
            <v-btn
              icon
              :disabled="currentPage <= 1 || navigating"
              @click="goToPreviousPage"
            >
              <v-icon>mdi-chevron-up</v-icon>
            </v-btn>

            <v-text-field
              v-model.number="pageInput"
              class="mx-2 page-input"
              style="max-width: 80px"
              density="compact"
              variant="outlined"
              hide-details
              @keyup.enter="goToPageInput"
              @blur="resetPageInput"
            />

            <span class="text-body-2 mx-2">/ {{ numPages }}</span>

            <v-btn
              icon
              :disabled="currentPage >= numPages || navigating"
              @click="goToNextPage"
            >
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
          </template>

          <!-- Zoom / Rotate - Desktop -->
          <v-btn
            icon
            :disabled="!numPages"
            @click="zoomOut"
          >
            <v-icon>mdi-magnify-minus-outline</v-icon>
          </v-btn>

          <v-chip
            v-if="numPages"
            class="mx-2"
            small
            outlined
          >
            {{ Math.round(zoom * 100) }}%
          </v-chip>

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

          <!-- External actions - Desktop -->
          <v-btn
            v-if="pdfUrl"
            v-tooltip="'Open in new tab'"
            icon
            dark
            @click="openInNewTab"
          >
            <v-icon>mdi-open-in-new</v-icon>
          </v-btn>
        </template>
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

        <div
          v-else-if="numPages"
          ref="scrollContainer"
          class="pdf-scroll"
          @scroll="onScroll"
        >
          <div
            class="virtual-spacer"
            :style="{ height: estimatedTotalHeight + 'px' }"
          />
          <div
            class="rendered-pages-container"
            :style="renderedContainerStyle"
          >
            <div
              v-if="showDebug"
              class="debug-info"
            >
              <div>Current Page: {{ currentPage }}</div>
              <div>Rendered Pages: {{ renderedPages.join(", ") }}</div>
              <div>Loaded Pages: {{ Array.from(loadedPages).join(", ") }}</div>
              <div>
                Loading Pages: {{ Array.from(loadingPages).join(", ") }}
              </div>
              <div>Scroll Top: {{ scrollTop }}</div>
              <div>Navigating: {{ navigating }}</div>
              <div>Mobile: {{ isMobile }}</div>
            </div>

            <div
              v-for="pageNum in renderedPages"
              :key="`page-${pageNum}-${renderKey}`"
              class="pdf-page-wrapper"
              :data-page="pageNum"
            >
              <div
                v-if="!loadedPages.has(pageNum)"
                class="pdf-page-placeholder"
                :style="getPlaceholderStyle(pageNum)"
              >
                <v-progress-circular
                  v-if="loadingPages.has(pageNum)"
                  indeterminate
                  color="primary"
                  size="32"
                />
                <div
                  v-else
                  class="d-flex flex-column align-center"
                >
                  <v-icon
                    color="grey-lighten-1"
                    size="48"
                  >
                    mdi-file-pdf-box
                  </v-icon>
                  <span class="text-caption mt-2">Page {{ pageNum }}</span>
                  <v-btn
                    size="small"
                    color="primary"
                    variant="outlined"
                    class="mt-2"
                    @click="loadPage(pageNum)"
                  >
                    Load Page
                  </v-btn>
                </div>
              </div>

              <VuePdf
                v-else
                :key="`pdf-${pageNum}-${zoom}-${rotation}`"
                :src="pdfSrc"
                :page="pageNum"
                :rotation="rotation"
                :scale="zoom"
                class="pdf-page"
                @loaded="onPageLoaded(pageNum, $event)"
                @error="onPageError(pageNum, $event)"
              />
            </div>
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
import { useDisplay } from 'vuetify'
import { VuePdf, createLoadingTask } from 'vue3-pdfjs/esm'
import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api'

const props = defineProps<{
  modelValue: boolean
  title?: string
  pdfUrl?: string
  fileName?: string
  bufferPages?: number
  pageHeight?: number
  maxCachedPages?: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
}>()

const { mobile } = useDisplay()
const isMobile = computed(() => mobile.value)
const BUFFER_PAGES = props.bufferPages || 2
const DEFAULT_PAGE_HEIGHT = props.pageHeight || 842
const PAGE_MARGIN = 24

const dialog = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
})

// State
const loading = ref(false)
const error = ref('')
const downloadLoading = ref(false)
const scrollContainer = ref<HTMLElement>()
const showDebug = ref(false)
const pdfSrc = ref<string | Uint8Array | Record<string, unknown>>('')
const pdfDocument = ref<PDFDocumentProxy | null>(null)
const numPages = ref(0)
const currentPage = ref(1)
const pageInput = ref(1)
const navigating = ref(false)
const zoom = ref(1)
const rotation = ref(0)
const renderKey = ref(0)
const scrollTop = ref(0)
const pageHeights = ref<Map<number, number>>(new Map())
const loadedPages = ref<Set<number>>(new Set())
const loadingPages = ref<Set<number>>(new Set())
let scrollTimeout: ReturnType<typeof setTimeout> | null = null
let navigationTimeout: ReturnType<typeof setTimeout> | null = null
let resizeObserver: ResizeObserver | null = null
function setInitialZoom() {
  zoom.value = isMobile.value ? 0.5 : 1
  console.log(
    `Initial zoom set to ${zoom.value * 100}% for ${
      isMobile.value ? 'mobile' : 'desktop'
    }`,
  )
}

const estimatedPageHeight = computed(() => {
  const baseHeight = DEFAULT_PAGE_HEIGHT
  return baseHeight * zoom.value + PAGE_MARGIN * 2
})
const estimatedTotalHeight = computed(() => {
  return numPages.value * estimatedPageHeight.value
})

const visiblePageRange = computed(() => {
  if (!numPages.value) return { start: 1, end: 1 }
  const start = Math.max(1, currentPage.value - BUFFER_PAGES)
  const end = Math.min(numPages.value, currentPage.value + BUFFER_PAGES)
  return { start, end }
})

const renderedPages = computed(() => {
  const { start, end } = visiblePageRange.value
  const pages = []
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const scrollOffset = computed(() => {
  if (!renderedPages.value.length) return 0

  const firstRenderedPage = renderedPages.value[0]
  const offset = Math.max(
    0,
    (firstRenderedPage - 1) * estimatedPageHeight.value,
  )

  return offset
})

const renderedContainerStyle = computed(() => ({
  position: 'absolute',
  top: `${scrollOffset.value}px`,
  left: '0',
  right: '0',
  padding: `${PAGE_MARGIN}px`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: `${PAGE_MARGIN}px`,
  zIndex: 2,
  minHeight: '100px',
}))

const currentPageFromScroll = computed(() => {
  if (scrollTop.value === 0) return 1

  const page = Math.floor(scrollTop.value / estimatedPageHeight.value) + 1
  return Math.min(numPages.value, Math.max(1, page))
})

watch(
  () => dialog.value,
  async (open) => {
    if (open && props.pdfUrl) {
      setInitialZoom()
      await loadPdf(props.pdfUrl)
      await nextTick()
      setupResizeObserver()
      await loadInitialPages()
    }
    else {
      cleanupResizeObserver()
      clearTimeouts()
    }
  },
  { immediate: true },
)

watch(
  () => props.pdfUrl,
  async (u) => {
    if (dialog.value && u) {
      await loadPdf(u)
      await loadInitialPages()
    }
    else {
      clearState()
    }
  },
)

watch(currentPageFromScroll, (newPage) => {
  if (navigating.value) return

  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }

  scrollTimeout = setTimeout(() => {
    if (!navigating.value) {
      currentPage.value = newPage
      resetPageInput()
    }
  }, 100)
})

watch(
  renderedPages,
  (newPages) => {
    console.log('Rendered pages changed:', newPages)
    newPages.forEach((pageNum) => {
      if (!loadedPages.value.has(pageNum) && !loadingPages.value.has(pageNum)) {
        loadPage(pageNum)
      }
    })
  },
  { immediate: true },
)

watch([zoom, rotation], () => {
  renderKey.value++
  // Reload visible pages
  nextTick(() => {
    renderedPages.value.forEach((pageNum) => {
      if (loadedPages.value.has(pageNum)) {
        // Page will re-render due to renderKey change
      }
    })
  })
})

function clearTimeouts() {
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
    scrollTimeout = null
  }
  if (navigationTimeout) {
    clearTimeout(navigationTimeout)
    navigationTimeout = null
  }
}

function setupResizeObserver() {
  if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(() => {})

    if (scrollContainer.value) {
      resizeObserver.observe(scrollContainer.value)
    }
  }
}

function cleanupResizeObserver() {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
}

function clearState() {
  loading.value = false
  error.value = ''
  numPages.value = 0
  pdfSrc.value = ''
  pdfDocument.value = null
  rotation.value = 0
  currentPage.value = 1
  pageInput.value = 1
  scrollTop.value = 0
  navigating.value = false
  renderKey.value = 0
  pageHeights.value.clear()
  loadedPages.value.clear()
  loadingPages.value.clear()
  clearTimeouts()
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
    pdfDocument.value = pdf
    numPages.value = pdf.numPages
    currentPage.value = 1
    pageInput.value = 1
    console.log(`PDF loaded with ${numPages.value} pages`)
  }
  catch (_e) {
    console.error('PDF loading error:', _e)
    error.value = 'Failed to load PDF.'
  }
  finally {
    loading.value = false
  }
}

async function loadInitialPages() {
  console.log('Loading initial pages...')
  await nextTick()
  if (numPages.value > 0) {
    await loadPage(1)
  }
}

function onScroll() {
  if (scrollContainer.value && !navigating.value) {
    scrollTop.value = scrollContainer.value.scrollTop
  }
}

async function loadPage(pageNum: number): Promise<boolean> {
  if (pageNum < 1 || pageNum > numPages.value) {
    console.warn(`Invalid page number: ${pageNum}`)
    return false
  }

  if (loadingPages.value.has(pageNum) || loadedPages.value.has(pageNum)) {
    console.log(`Page ${pageNum} already loaded or loading`)
    return loadedPages.value.has(pageNum)
  }

  console.log(`Loading page ${pageNum}...`)
  loadingPages.value.add(pageNum)

  try {
    // Add a small delay to ensure the component is ready
    await new Promise(resolve => setTimeout(resolve, 10))

    // Mark as loaded - the VuePdf component will handle the actual rendering
    loadedPages.value.add(pageNum)

    console.log(
      `Page ${pageNum} marked as loaded. Total loaded: ${loadedPages.value.size}`,
    )

    return true
  }
  catch (error) {
    console.error(`Error loading page ${pageNum}:`, error)
    loadedPages.value.delete(pageNum)
    return false
  }
  finally {
    loadingPages.value.delete(pageNum)
  }
}

async function goToPage(page: number) {
  if (page < 1 || page > numPages.value || !scrollContainer.value) {
    console.warn(`Invalid navigation to page ${page}`)
    return
  }

  console.log(`Navigating to page ${page}...`)
  navigating.value = true

  try {
    // Clear any existing timeouts
    clearTimeouts()

    // Update current page immediately
    currentPage.value = page
    resetPageInput()

    // Ensure target page is loaded
    await loadPage(page)

    // Force a re-render to ensure the pages are visible
    await nextTick()

    // Calculate target position
    const targetPosition = Math.max(0, (page - 1) * estimatedPageHeight.value)

    // Scroll to position
    scrollContainer.value.scrollTo({
      top: targetPosition,
      behavior: 'smooth',
    })

    console.log(`Scrolled to position ${targetPosition} for page ${page}`)

    // Reset navigating flag after scroll completes
    navigationTimeout = setTimeout(() => {
      navigating.value = false
      console.log(`Navigation to page ${page} completed`)
    }, 700)
  }
  catch (error) {
    console.error('Navigation error:', error)
    navigating.value = false
  }
}

function goToPreviousPage() {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1)
  }
}

function goToNextPage() {
  if (currentPage.value < numPages.value) {
    goToPage(currentPage.value + 1)
  }
}

function goToPageInput() {
  const targetPage = pageInput.value
  if (targetPage >= 1 && targetPage <= numPages.value) {
    goToPage(targetPage)
  }
  else {
    resetPageInput()
  }
}

function resetPageInput() {
  pageInput.value = currentPage.value
}

function getPlaceholderStyle(pageNum: number) {
  const pageHeight = pageHeights.value.get(pageNum) || DEFAULT_PAGE_HEIGHT
  const scaledHeight = pageHeight * zoom.value

  return {
    width: `${Math.round(scaledHeight * 0.707)}px`,
    height: `${scaledHeight}px`,
    backgroundColor: '#f8f9fa',
    border: '2px dashed #dee2e6',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  }
}

function onPageLoaded(pageNum: number, event) {
  console.log(`VuePdf page ${pageNum} loaded successfully`, event)
  if (event && event.height) {
    pageHeights.value.set(pageNum, event.height)
  }
}

function onPageError(pageNum: number, error) {
  console.error(`VuePdf page ${pageNum} error:`, error)
  loadedPages.value.delete(pageNum)
  loadingPages.value.delete(pageNum)
}

function zoomIn() {
  zoom.value = Math.min(zoom.value + 0.25, 3)
}

function zoomOut() {
  zoom.value = Math.max(zoom.value - 0.25, 0.25)
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

onMounted(async () => {
  setInitialZoom()
})

onBeforeUnmount(() => {
  cleanupResizeObserver()
  clearTimeouts()
  clearState()
})
</script>

<style scoped>
.pdf-scroll {
  width: 100%;
  height: calc(100vh - 64px);
  overflow: auto;
  background: #f8f9fa;
  position: relative;
}

.virtual-spacer {
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  pointer-events: none;
  z-index: 1;
}

.rendered-pages-container {
  width: 100%;
}

.pdf-page-wrapper {
  width: auto;
  display: flex;
  justify-content: center;
  margin-bottom: 0;
}

.pdf-page {
  display: block;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: white;
  border-radius: 4px;
  max-width: 100%;
  height: auto;
}

.pdf-page-placeholder {
  margin: 0 auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.page-input :deep(.v-field__input) {
  text-align: center;
  font-size: 0.875rem;
}

.debug-info {
  position: fixed;
  top: 100px;
  right: 10px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 15px;
  font-size: 12px;
  font-family: monospace;
  border-radius: 4px;
  z-index: 1000;
  line-height: 1.4;
  min-width: 200px;
}

/* Mobile specific styles */
@media (max-width: 960px) {
  .pdf-scroll {
    height: calc(100vh - 56px);
  }

  .toolbar-title {
    font-size: 1rem;
  }

  .mobile-title {
    max-width: 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mobile-nav-group {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-left: auto;
    margin-right: 8px;
  }

  .mobile-page-info {
    display: flex;
    align-items: center;
    gap: 2px;
    font-size: 0.75rem;
  }

  .mobile-page-input {
    width: 45px !important;
    max-width: 45px !important;
  }

  .mobile-page-input :deep(.v-field) {
    font-size: 0.75rem !important;
    min-height: 32px !important;
  }

  .mobile-page-input :deep(.v-field__input) {
    padding: 4px 6px !important;
    min-height: 24px !important;
    text-align: center;
  }

  .mobile-page-total {
    font-size: 0.75rem;
    white-space: nowrap;
    color: rgba(255, 255, 255, 0.87);
  }

  .mobile-control-group {
    margin-bottom: 24px;
  }

  .mobile-control-group h4 {
    text-align: center;
    color: rgba(0, 0, 0, 0.87);
    font-weight: 500;
  }
}

/* Extra small screens */
@media (max-width: 600px) {
  .mobile-title {
    max-width: 80px;
  }

  .mobile-page-input {
    width: 20px !important;
    max-width: 20px !important;
  }

  .mobile-page-total {
    font-size: 0.7rem;
  }
}
</style>
