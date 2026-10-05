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

        <div class="ml-auto">
          <div
            v-if="numPages > 0"
            class="d-flex align-center ga-1 ml-auto mr-2"
          >
            <div class="d-flex align-center ga-1">
              <v-btn
                v-tooltip="'Previous page'"
                icon
                size="small"
                :disabled="currentPage <= 1 || navigating"
                @click="goToPreviousPage"
              >
                <v-icon size="20">
                  mdi-chevron-up
                </v-icon>
              </v-btn>

              <div
                v-tooltip="'Go to page'"
                class="d-flex align-center ga-1 text-caption"
              >
                <v-text-field
                  v-model.number="pageInput"
                  class="page-input-field"
                  density="compact"
                  variant="outlined"
                  hide-details
                  single-line
                  type="number"
                  aria-label="Page number"
                  @keyup.enter="goToPageInput"
                  @blur="resetPageInput"
                />
                <span class="text-white">/ {{ numPages }}</span>
              </div>

              <v-btn
                v-tooltip="'Next page'"
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

            <v-divider
              vertical
              :opacity="0.4"
              length="24"
              class="mx-1"
            />

            <!-- Zoom Controls -->
            <div class="d-flex align-center ga-1">
              <v-btn
                v-tooltip="'Zoom out'"
                icon
                size="small"
                :disabled="!numPages || zoom <= MIN_ZOOM"
                @click="zoomOut"
              >
                <v-icon size="20">
                  mdi-magnify-minus-outline
                </v-icon>
              </v-btn>

              <v-chip
                v-if="numPages"
                v-tooltip="'Reset zoom'"
                size="small"
                variant="outlined"
                color="white"
                class="cursor-pointer"
                @click="resetZoom"
              >
                {{ Math.round(zoom * 100) }}%
              </v-chip>

              <v-btn
                v-tooltip="'Zoom in'"
                icon
                size="small"
                :disabled="!numPages || zoom >= MAX_ZOOM"
                @click="zoomIn"
              >
                <v-icon size="20">
                  mdi-magnify-plus-outline
                </v-icon>
              </v-btn>
            </div>

            <v-divider
              vertical
              :opacity="0.4"
              length="24"
              class="mx-1"
            />

            <v-btn
              v-tooltip="'Rotate'"
              icon
              size="small"
              :disabled="!numPages"
              @click="rotate"
            >
              <v-icon size="20">
                mdi-rotate-right-variant
              </v-icon>
            </v-btn>
          </div>
        </div>
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
              v-for="pageNum in renderedPages"
              :key="pageNum"
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
                    @click="renderPage(pageNum)"
                  >
                    Load Page
                  </v-btn>
                </div>
              </div>

              <canvas
                v-show="loadedPages.has(pageNum)"
                :ref="(el) => setCanvasRef(pageNum, el)"
                class="pdf-page"
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
import * as pdfjsLib from 'pdfjs-dist'
import pdfWorkerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import type { PDFDocumentProxy, PDFPageProxy, RenderTask } from 'pdfjs-dist'
import type { ComponentPublicInstance } from 'vue'

// Single, module-level worker setup - pdf.js runs parsing/rendering on this worker thread
// instead of blocking the main thread. Assigning it once (not per component instance) since
// it's a global on pdfjsLib, not component state.
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerSrc

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
const MIN_ZOOM = 0.25
const MAX_ZOOM = 3
const ZOOM_STEP = 0.25

const dialog = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
})

// State
const loading = ref(false)
const error = ref('')
const scrollContainer = ref<HTMLElement>()
const pdfDocument = ref<PDFDocumentProxy | null>(null)
const numPages = ref(0)
const currentPage = ref(1)
const pageInput = ref(1)
const navigating = ref(false)
const zoom = ref(1)
const rotation = ref(0)
const scrollTop = ref(0)
const pageHeights = ref<Map<number, number>>(new Map())
const loadedPages = ref<Set<number>>(new Set())
const loadingPages = ref<Set<number>>(new Set())
const canvasRefs = new Map<number, HTMLCanvasElement>()
const renderTasks = new Map<number, RenderTask>()
let scrollTimeout: ReturnType<typeof setTimeout> | null = null
let navigationTimeout: ReturnType<typeof setTimeout> | null = null
// Defense-in-depth against loadPdf ever being invoked twice concurrently (the watcher above is
// now structured to prevent that, but if some future change reintroduces it, a stale call's
// result must not be allowed to overwrite state committed by a newer one).
let loadSequence = 0

function setInitialZoom() {
  zoom.value = isMobile.value ? 0.5 : 1
}

// Falls back to the static default (an A4-ish estimate) only until the current page has
// actually been measured - once real render output is available, virtual-scroll sizing uses
// that instead of the guess. Real measurements are in sync with the current zoom because a
// zoom change clears and re-renders every loaded page (see the [zoom, rotation] watcher below).
const estimatedPageHeight = computed(() => {
  const measured = pageHeights.value.get(currentPage.value)
  if (measured) return measured + PAGE_MARGIN * 2
  return DEFAULT_PAGE_HEIGHT * zoom.value + PAGE_MARGIN * 2
})
const estimatedTotalHeight = computed(() => {
  return numPages.value * estimatedPageHeight.value
})

// Very large documents (500+ page scanned answer sheets do happen) get a tighter render window -
// fewer simultaneously-rendered canvases at a time keeps memory bounded regardless of how long
// the document is, since only pages near the current one are ever mounted either way.
const LARGE_DOCUMENT_PAGE_THRESHOLD = 200
const effectiveBufferPages = computed(() =>
  numPages.value > LARGE_DOCUMENT_PAGE_THRESHOLD ? 1 : BUFFER_PAGES,
)

const visiblePageRange = computed(() => {
  if (!numPages.value) return { start: 1, end: 1 }
  const buffer = effectiveBufferPages.value
  const start = Math.max(1, currentPage.value - buffer)
  const end = Math.min(numPages.value, currentPage.value + buffer)
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

// A single watcher over both [dialog.value, props.pdfUrl] together - the parent sets both in the
// same synchronous block (previewPdfUrl then previewDialog), so two separate watchers here would
// both fire in the same reactive flush and each independently call loadPdf(), racing two
// concurrent getDocument() calls against the same data. That's what caused the "two network
// requests for the same file" + the private-field TypeError (state from one call overwriting/
// crossing with the other mid-flight).
let loadedForUrl: string | undefined
watch(
  [() => dialog.value, () => props.pdfUrl],
  async ([open, url]) => {
    if (open && url) {
      if (url === loadedForUrl && pdfDocument.value) {
        // Already loaded this exact document (e.g. dialog closed and reopened without the URL
        // changing) - nothing to redo.
        return
      }
      loadedForUrl = url
      setInitialZoom()
      await loadPdf(url)
      await nextTick()
      await loadInitialPages()
    }
    else {
      // Covers both "user closed the dialog" and "no url" - fully release the parsed document,
      // its worker connection, and every rendered page's memory rather than leaving them alive
      // for as long as this component instance stays mounted (which, since the preview button
      // stays on the page after closing, could otherwise be indefinitely - a real risk for large,
      // 500+ page documents). Reopening the same document afterwards just re-fetches it, which is
      // cheap thanks to range-request streaming - not a full re-download.
      loadedForUrl = undefined
      clearState()
    }
  },
  { immediate: true },
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
    const stillVisible = new Set(newPages)

    // A page that scrolled out of the buffered window no longer needs its canvas kept around -
    // cancel any in-flight render for it and drop its cached state so memory doesn't grow
    // unbounded while scrolling through a long document.
    for (const pageNum of loadedPages.value) {
      if (!stillVisible.has(pageNum)) {
        cancelPageRender(pageNum)
        loadedPages.value.delete(pageNum)
        canvasRefs.delete(pageNum)
      }
    }

    newPages.forEach((pageNum) => {
      if (!loadedPages.value.has(pageNum) && !loadingPages.value.has(pageNum)) {
        renderPage(pageNum)
      }
    })
  },
  { immediate: true },
)

let zoomRerenderTimeout: ReturnType<typeof setTimeout> | null = null
watch([zoom, rotation], () => {
  // Debounced - rapid zoom-in/out clicks (or a zoom button held down) would otherwise trigger a
  // full re-render cycle of every loaded page on each individual click.
  if (zoomRerenderTimeout) clearTimeout(zoomRerenderTimeout)
  zoomRerenderTimeout = setTimeout(() => {
    // Re-render every currently-loaded page at the new scale/rotation - cheap relative to a full
    // document reload since the document itself (pdfDocument) is already parsed and stays cached.
    const pagesToRerender = [...loadedPages.value]
    pagesToRerender.forEach((pageNum) => {
      cancelPageRender(pageNum)
      loadedPages.value.delete(pageNum)
      renderPage(pageNum)
    })
  }, 200)
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

function cancelPageRender(pageNum: number) {
  const task = renderTasks.get(pageNum)
  if (task) {
    task.cancel()
    renderTasks.delete(pageNum)
  }
  loadingPages.value.delete(pageNum)
}

function cancelAllRenderTasks() {
  for (const pageNum of renderTasks.keys()) {
    cancelPageRender(pageNum)
  }
}

function clearState() {
  loading.value = false
  error.value = ''
  numPages.value = 0
  cancelAllRenderTasks()
  pdfDocument.value?.destroy()
  pdfDocument.value = null
  rotation.value = 0
  currentPage.value = 1
  pageInput.value = 1
  scrollTop.value = 0
  navigating.value = false
  pageHeights.value.clear()
  loadedPages.value.clear()
  loadingPages.value.clear()
  canvasRefs.clear()
  clearTimeouts()
}

async function loadPdf(url: string) {
  const sequence = ++loadSequence
  clearState()
  if (!url) return

  try {
    loading.value = true
    error.value = ''

    // Hand pdf.js the URL rather than fetching the whole file into memory ourselves - some past
    // papers run 500+ pages, which can be a very large file (scanned answer sheets especially).
    // With disableAutoFetch, pdf.js only downloads the specific byte ranges needed for pages
    // actually requested via getPage() (using HTTP range requests when the server supports them,
    // falling back to a normal full-file fetch automatically otherwise) instead of buffering the
    // entire document in memory upfront - the fix that matters for not crashing low-memory
    // devices on a huge document. (An earlier "empty page" bug here was mis-diagnosed as a
    // URL-loading/CORS problem and briefly fixed by fetching the whole file instead - the actual
    // cause was the missing markRaw() below, unrelated to how the bytes are fetched.)
    const loadingTask = pdfjsLib.getDocument({
      url,
      disableAutoFetch: true,
    })
    const document = await loadingTask.promise

    if (sequence !== loadSequence) {
      // Superseded by a newer loadPdf() call while this one was in flight - discard rather than
      // clobbering state a later call already owns.
      document.destroy()
      return
    }

    // markRaw is required here: pdf.js's PDFDocumentProxy/PDFPageProxy use native private class
    // fields (#field) internally. Vue's ref() wraps assigned objects in a reactive Proxy, and
    // calling a method through that Proxy runs it with `this` bound to the Proxy rather than the
    // real instance - private-field access then throws "Cannot read private member ... from an
    // object whose class did not declare it", deterministically, on every call. markRaw tells
    // Vue to never wrap this value, since pdf.js's internal state has no business being reactive
    // anyway (it's opaque to Vue - nothing here should ever trigger a template re-render).
    pdfDocument.value = markRaw(document)
    numPages.value = pdfDocument.value.numPages
    currentPage.value = 1
    pageInput.value = 1
  }
  catch (err) {
    console.error('PDF loading error:', err)
    if (sequence === loadSequence) {
      error.value = 'Failed to load PDF.'
    }
  }
  finally {
    if (sequence === loadSequence) {
      loading.value = false
    }
  }
}

async function loadInitialPages() {
  await nextTick()
  if (numPages.value > 0) {
    await renderPage(1)
  }
}

function onScroll() {
  if (scrollContainer.value && !navigating.value) {
    scrollTop.value = scrollContainer.value.scrollTop
  }
}

// Vue's element-ref callback type is broader than "HTMLCanvasElement | null" (it covers every
// possible template ref target) - narrow it here rather than casting inside the template, which
// the SFC template compiler doesn't accept TS assertion syntax for.
function setCanvasRef(pageNum: number, el: Element | ComponentPublicInstance | null) {
  if (el instanceof HTMLCanvasElement) {
    canvasRefs.set(pageNum, el)
    // The ref can attach after the page was already queued to render (v-show keeps the canvas
    // mounted once loaded, but on first mount the ref callback fires as part of the same patch
    // that made the v-if placeholder give way) - render as soon as both are ready.
    if (loadingPages.value.has(pageNum) && !renderTasks.has(pageNum)) {
      renderPageToCanvas(pageNum, el)
    }
  }
  else {
    canvasRefs.delete(pageNum)
  }
}

async function renderPage(pageNum: number): Promise<boolean> {
  if (!pdfDocument.value || pageNum < 1 || pageNum > numPages.value) {
    console.warn(`Invalid page number: ${pageNum}`)
    return false
  }

  if (loadingPages.value.has(pageNum) || loadedPages.value.has(pageNum)) {
    return loadedPages.value.has(pageNum)
  }

  loadingPages.value.add(pageNum)

  const canvas = canvasRefs.get(pageNum)
  if (canvas) {
    return renderPageToCanvas(pageNum, canvas)
  }

  // Canvas isn't mounted yet (placeholder still showing) - setCanvasRef will pick this up and
  // render once its ref callback fires, since loadingPages already has this page marked.
  return false
}

async function renderPageToCanvas(pageNum: number, canvas: HTMLCanvasElement): Promise<boolean> {
  if (!pdfDocument.value) return false

  loadingPages.value.add(pageNum)

  let page: PDFPageProxy | undefined
  try {
    page = await pdfDocument.value.getPage(pageNum)
    const viewport = page.getViewport({ scale: zoom.value, rotation: rotation.value })

    // Render at native device resolution (crisp on retina/high-DPI screens) while keeping the
    // element's CSS/layout size at the logical viewport size.
    const outputScale = (typeof window !== 'undefined' && window.devicePixelRatio) || 1
    canvas.width = Math.floor(viewport.width * outputScale)
    canvas.height = Math.floor(viewport.height * outputScale)
    canvas.style.width = `${Math.floor(viewport.width)}px`
    canvas.style.height = `${Math.floor(viewport.height)}px`

    const context = canvas.getContext('2d')
    if (!context) return false

    const renderTask = page.render({
      canvasContext: context,
      viewport,
      transform: outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined,
    })
    renderTasks.set(pageNum, renderTask)

    await renderTask.promise

    renderTasks.delete(pageNum)
    loadingPages.value.delete(pageNum)
    loadedPages.value.add(pageNum)
    pageHeights.value.set(pageNum, viewport.height)
    return true
  }
  catch (err) {
    renderTasks.delete(pageNum)
    loadingPages.value.delete(pageNum)

    // A cancelled render (page scrolled out, or zoom changed mid-render) isn't a real error -
    // the page will simply be re-requested if it becomes visible again.
    if (err instanceof pdfjsLib.RenderingCancelledException) {
      return false
    }

    console.error(`Error rendering page ${pageNum}:`, err)
    loadedPages.value.delete(pageNum)
    return false
  }
  finally {
    page?.cleanup()
  }
}

async function goToPage(page: number) {
  if (page < 1 || page > numPages.value || !scrollContainer.value) {
    console.warn(`Invalid navigation to page ${page}`)
    return
  }
  navigating.value = true

  try {
    clearTimeouts()
    currentPage.value = page
    resetPageInput()
    await renderPage(page)
    await nextTick()
    const targetPosition = Math.max(0, (page - 1) * estimatedPageHeight.value)
    scrollContainer.value.scrollTo({
      top: targetPosition,
      behavior: 'smooth',
    })
    navigationTimeout = setTimeout(() => {
      navigating.value = false
    }, 700)
  }
  catch (err) {
    console.error('Navigation error:', err)
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
  const pageHeight = pageHeights.value.get(pageNum) || DEFAULT_PAGE_HEIGHT * zoom.value
  const scaledHeight = pageHeight

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

function zoomIn() {
  zoom.value = Math.min(zoom.value + ZOOM_STEP, MAX_ZOOM)
}

function zoomOut() {
  zoom.value = Math.max(zoom.value - ZOOM_STEP, MIN_ZOOM)
}

function resetZoom() {
  setInitialZoom()
}

function rotate() {
  rotation.value = (rotation.value + 90) % 360
}

function closeDialog() {
  dialog.value = false
}

function handleKeydown(event: KeyboardEvent) {
  if (!dialog.value) return
  // Don't hijack typing in the page-number input itself.
  if (event.target instanceof HTMLInputElement) return

  switch (event.key) {
    case 'ArrowUp':
    case 'ArrowLeft':
      event.preventDefault()
      goToPreviousPage()
      break
    case 'ArrowDown':
    case 'ArrowRight':
      event.preventDefault()
      goToNextPage()
      break
    case '+':
    case '=':
      event.preventDefault()
      zoomIn()
      break
    case '-':
      event.preventDefault()
      zoomOut()
      break
    case 'r':
    case 'R':
      event.preventDefault()
      rotate()
      break
    // Escape is already handled natively by v-dialog (closes unless persistent), no need to
    // duplicate that here.
  }
}

onMounted(async () => {
  setInitialZoom()
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
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

/* A real Vuetify text field, just narrow - there's no Vuetify utility for a fixed ~40px input
   width, so this is the one spot that genuinely needs custom CSS rather than a utility class. */
.page-input-field {
  width: 44px;
}

.page-input-field :deep(.v-field__input) {
  text-align: center;
  font-size: 0.8rem;
  color: white;
  padding: 4px 2px;
  min-height: 32px;
}

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

/* Extra small screens */
@media (max-width: 600px) {
  .mobile-title {
    max-width: 80px;
  }

  .page-input-field {
    width: 40px;
  }
}
</style>
