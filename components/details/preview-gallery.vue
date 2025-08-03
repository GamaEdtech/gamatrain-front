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
            >
              <span
                v-tooltip="item.text"
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
                >
                  <v-img
                    :src="image"
                    class="carousel-img fill-height"
                  />
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
                  <img
                    :src="image"
                    class="thumbnail-preview"
                  >
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </section>
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

const items = reactive([
  {
    class: 'exam',
    text: 'Related exam',
    icon: 'exam',
    link: '/search?type=azmoon',
  },
  {
    class: 'test',
    text: 'Related paper',
    icon: 'paper',
    link: '/search?type=test',
  },
  {
    class: 'content',
    text: 'Related multimedia',
    icon: 'multimedia',
    link: '/search?type=learnfiles',
  },
  {
    class: 'faq',
    text: 'Related Q & A',
    icon: 'q-a',
    link: '/search?type=question',
  },
  {
    class: 'textbook ',
    text: 'Related tutorial',
    icon: 'tutorial',
    link: '/search?type=dars',
  },
])

// Methods
function changeSlide(index) {
  carouselVal.value = index
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
    max-width: 100%;
    height: 30rem !important;
    margin: auto;
    border-radius: 1.2rem;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

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
