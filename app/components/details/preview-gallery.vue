<template>
  <div>
    <section
      id="details-gallery-portrate"
      class="rounded-lg"
    >
      <div class="card-carousel">
        <v-row justify="center">
          <v-col
            cols="2"
            xl="2"
            class="pr-0 pl-0 d-flex flex-column align-center"
          >
            <v-btn
              v-for="(item, index) in items"
              :key="index"
              icon
              large
              :to="`${item.link}&state=${help_link_data.state}&section=${help_link_data.section}&base=${help_link_data.base}&course=${help_link_data.course}
                  &lesson=${help_link_data.lesson}`"
              class="mb-3 bg-blue-grey-darken-2 flex-shrink-0"
              :aria-label="item.text"
            >
              <span
                v-tooltip="{
                  text: item.text,
                  id: `tooltip-${index}`,
                  ariaLabel: item.text,
                }"
                :aria-label="item.text"
                style="font-size: 26px"
                :class="`icon icon-${item.icon} text-white text--darken-1`"
              />
            </v-btn>
          </v-col>

          <v-col
            cols="10"
            md="9"
            xl="10"
            class="pl-2"
          >
            <div class="mx-4 mx-md-0">
              <v-carousel
                id="product-carousel"
                v-model="carouselVal"
                :show-arrows="false"
                :hide-delimiters="images.length <= 1"
                class="product-carousel"
                cycle
                :show-arrows-on="images.length > 1 ? 'hover' : 'never'"
                height="100%"
              >
                <v-carousel-item
                  v-for="(image, index) in images"
                  :key="index"
                  cover
                  class="carousel-item-clickable"
                  @click="handleImageClick(index)"
                >
                  <div class="carousel-item-content">
                    <v-img
                      width="170"
                      :src="image"
                      cover
                      class="carousel-img w-100 h-100"
                      preload
                      fetchpriority="high"
                      alt="Psat Paper Lesson"
                      :loading="index === 0 ? 'eager' : 'lazy'"
                    />
                    <!-- <NuxtImg
                      width="170"
                      height="auto"
                      :src="image"
                      class="carousel-img"
                      preload
                      fetchpriority="high"
                      alt="Psat Paper Lesson"
                      format="webp"
                      :loading="index === 0 ? 'eager' : 'lazy'"
                    /> -->
                    <div
                      v-if="showDocPreview"
                      class="preview-overlay"
                    >
                      <v-icon
                        size="24"
                        color="white"
                        class="preview-icon"
                      >
                        mdi-eye
                      </v-icon>
                      <span class="preview-text">Preview</span>
                    </div>
                  </div>
                </v-carousel-item>
              </v-carousel>

              <div
                v-if="images.length > 1"
                class="main-thumbnails"
              >
                <div
                  v-for="(image, index) in images"
                  :key="index"
                  class="thumbnail-box"
                  :class="{ 'active-box': carouselVal === index }"
                  @click="changeSlide(index)"
                >
                  <div class="thumbnail-content">
                    <v-img
                      width="40"
                      :src="image"
                      cover
                      class="thumbnail-preview w-100 h-100"
                      alt="Psat Paper Lesson"
                    />
                    <!-- <NuxtImg
                      width="40"
                      height="auto"
                      :src="image"
                      placeholder
                      class="thumbnail-preview"
                      alt="Psat Paper Lesson"
                      format="webp"
                    /> -->
                  </div>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </section>
    <client-only>
      <LazyCommonPdfPreviewDialog
        v-model="previewDialog"
        :title="previewTitle"
        :pdf-url="previewPdfUrl"
        :file-name="previewFileName"
      />
    </client-only>
  </div>
</template>

<script setup>
// Props with types and defaults
const props = defineProps({
  imageUrls: {
    type: Array,
    default: () => [],
  },
  helpLinkData: {
    type: Object,
    default: () => ({
      state: '',
      section: '',
      base: '',
      course: '',
      lesson: '',
    }),
  },
  initialSlide: {
    type: Number,
    default: 0,
  },
  showDocPreview: {
    type: Boolean,
    default: false,
  },
  // New props for PDF preview functionality
  paperId: {
    type: [String, Number],
    default: null,
  },
  paperTitle: {
    type: String,
    default: '',
  },
})

// Reactive state
const carouselVal = ref(0)
const images = ref([])
const help_link_data = reactive({
  state: '',
  section: '',
  base: '',
  course: '',
  lesson: '',
})

const _active_img = ref(1)

// PDF Preview related
const previewDialog = ref(false)
const previewPdfUrl = ref('')
const previewFileName = ref('')
const previewTitle = ref('')

const items = reactive([
  {
    class: 'exam',
    text: 'Related exam',
    icon: 'exam',
    link: '/search?type=quizhub',
  },
  {
    class: 'test',
    text: 'Related paper',
    icon: 'paper',
    link: '/search?type=paper',
  },
  {
    class: 'content',
    text: 'Related multimedia',
    icon: 'multimedia',
    link: '/search?type=multimedia',
  },
  {
    class: 'faq',
    text: 'Related Q & A',
    icon: 'q-a',
    link: '/search?type=forum',
  },
  {
    class: 'textbook ',
    text: 'Related tutorial',
    icon: 'tutorial',
    link: '/search?type=tutorial',
  },
])

// Methods
function changeSlide(index) {
  carouselVal.value = index
}

async function handleImageClick() {
  if (!props.paperId) {
    console.warn('No paper ID provided for PDF preview')
    return
  }

  try {
    const response = await useApiService.get(
      `/api/v1/tests/download/${props.paperId}/pdf`,
    )

    if (response.status === 1 && response.data?.url) {
      previewPdfUrl.value = response.data.url
      previewFileName.value = response.data.name || 'document.pdf'
      previewTitle.value = props.paperTitle || 'PDF Preview'
      previewDialog.value = true
    }
    else {
      console.error('Unable to load PDF preview')
    }
  }
  catch (err) {
    console.error('Error loading PDF preview:', err)
  }
}

// Watch effects
watch(
  () => props.imageUrls,
  (newVal) => {
    if (newVal && newVal.length > 0) {
      images.value = [...newVal]
    }
  },
  { immediate: true },
)

watch(
  () => props.helpLinkData,
  (newVal) => {
    if (newVal) {
      Object.assign(help_link_data, newVal)
    }
  },
  { immediate: true },
)

watch(
  () => props.initialSlide,
  (newVal) => {
    if (newVal !== undefined) {
      // carouselVal.value = newVal;
    }
  },
  { immediate: true },
)
</script>

<style lang="scss" scoped>
#details-gallery-portrate {
  #product-carousel {
    width: 100%;
    height: 30rem !important;
    margin: auto;
    border-radius: 1.2rem;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 300px;

    .v-window {
      height: 100%;
      border-radius: inherit;
      overflow: hidden;
    }

    .v-window__container {
      height: 100%;
      border-radius: inherit;
    }

    .v-carousel__item {
      height: 100%;
      border-radius: inherit;
      overflow: hidden;
    }

    .carousel-img {
      height: 100%;
      width: 100%;
      object-fit: cover;
      border-radius: inherit;
    }

    :deep(.v-window__container) {
      border-radius: inherit;
    }

    :deep(.v-carousel__item) {
      border-radius: inherit;
      overflow: hidden;
    }
  }
}

.thumbnail-nav {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  gap: 8px;
}

.thumbnail-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #ccc;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.active-dot {
  background-color: #000;
}

.main-thumbnails {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 10px;
}

.thumbnail-box {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
}

.active-box {
  border-color: #000;
}

.thumbnail-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-item-clickable {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.carousel-item-clickable:hover {
  transform: scale(1.02);
}

.carousel-item-content {
  position: relative;
  width: 100%;
  height: 100%;
}

.preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
}

.carousel-item-clickable:hover .preview-overlay {
  opacity: 1;
}

.preview-icon {
  margin-bottom: 8px;
}

.preview-text {
  font-size: 14px;
  font-weight: 500;
}

.thumbnail-content {
  position: relative;
  width: 100%;
  height: 100%;
}

.thumbnail-preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: pointer;
}

.thumbnail-box:hover .thumbnail-preview-overlay {
  opacity: 1;
}

@media screen and (max-width: 600px) {
  #details-gallery-portrate #product-carousel {
    height: 30rem !important;
  }

  .thumbnail-box {
    width: 40px;
    height: 40px;
  }

  .thumbnail-dot {
    width: 10px;
    height: 10px;
  }
}

.side-help-icon {
  padding: 0.6rem;
  display: block;
  max-width: 4rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  text-align: center;
  background-color: #f5f5f5;
}

.side-help-icon .icon {
  font-size: 1.5rem;
}

@media (min-width: 600px) {
  #details-gallery-portrate {
    #product-carousel {
      height: 30rem !important;
    }
  }
}

@media (min-width: 960px) {
  #details-gallery-portrate {
    #product-carousel {
      height: 30rem !important;
    }

    .thumbnail-box {
      width: 70px;
      height: 70px;
    }
  }
}

@media (min-width: 1264px) {
  #details-gallery-portrate {
    #product-carousel {
      height: 30rem !important;
    }

    .thumbnail-box {
      width: 80px;
      height: 80px;
    }
  }
}
</style>
