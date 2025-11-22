<template>
  <v-row>
    <v-col
      id="details-gallery-landscape"
      cols="12"
      class="product-gallery rounded-lg"
    >
      <div class="card-carousel">
        <v-row justify="center">
          <!-- Side section -->
          <v-col
            cols="2"
            class="pr-0 pl-0 d-flex flex-column align-center"
          >
            <v-btn
              v-for="(item, index) in items"
              :key="index"
              icon
              large
              :small="display.xs.value"
              :to="`${item.link}&state=${help_link_data.state}&section=${help_link_data.section}&base=${help_link_data.base}&course=${help_link_data.course}
                  &lesson=${help_link_data.lesson}`"
              class="mb-3 bg-blue-grey-darken-2 flex-shrink-0"
            >
              <span
                v-tooltip="item.text"
                style="font-size: 26px"
                :class="`text-white text--lighten-1 icon icon-${item.icon} pt-1 `"
              />
            </v-btn>
          </v-col>
          <!-- End side section -->

          <v-col cols="10">
            <div>
              <v-carousel
                v-model="carouselVal"
                height="296"
                hide-delimiters
              >
                <v-carousel-item
                  v-for="(image, index) in images"
                  :key="index"
                  :src="image"
                  cover
                />
              </v-carousel>
              <div
                v-if="images.length > 1"
                class="thumbnails"
              >
                <v-slide-group
                  center-active
                  class="pa-4"
                  active-class="success"
                  show-arrows
                >
                  <v-slide-group-item
                    v-for="(image, index) in images"
                    :key="index"
                  >
                    <v-img
                      :class="{
                        'mx-2 thumbnail_itm': true,
                        'active_slide': carouselVal === index,
                      }"
                      :src="image"
                      height="60"
                      width="80"
                      cover
                      @click="changeSlide(index)"
                    />
                  </v-slide-group-item>
                </v-slide-group>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useDisplay } from 'vuetify'

// Define props
const props = defineProps({
  galleryImages: {
    type: Array,
    default: () => [],
  },
  linkData: {
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

// Setup Vuetify display composable
const display = useDisplay()

// Define refs and reactive state
const carouselVal = ref(props.initialSlide)
const images = ref(props.galleryImages || [])
const help_link_data = reactive({ ...props.linkData })

// Watch for prop changes
watch(
  () => props.galleryImages,
  (newImages) => {
    if (newImages && newImages.length) {
      images.value = newImages
    }
  },
  { immediate: true },
)

watch(
  () => props.linkData,
  (newData) => {
    if (newData) {
      Object.assign(help_link_data, newData)
    }
  },
  { immediate: true, deep: true },
)

watch(
  () => props.initialSlide,
  (newSlide) => {
    if (newSlide !== undefined) {
      carouselVal.value = newSlide
    }
  },
)

const _active_img = ref(1)

const items = [
  {
    class: 'exam',
    text: 'Related exam',
    icon: 'exam',
    link: '/search?type=azmoon',
  },
  {
    class: 'paper',
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
  // { class: "school", text: "School", icon: "school" ,link:"/search?type=school" },
  // { class: "tutor", text: "Tutor", icon: "teacher" ,link:"/search?type=tutor" },
]

// Methods
function changeSlide(index) {
  carouselVal.value = index
}

// Still expose refs for backward compatibility
defineExpose({
  carouselVal,
  images,
  help_link_data,
  changeSlide,
})
</script>

<style lang="scss" scoped>
.product-gallery {
}

.thumbnails {
  display: flex;
  justify-content: space-evenly;
  flex-direction: row;
  cursor: pointer;
  width: 100%;
}

.thumbnail_itm {
  max-width: 80px !important;
  max-height: 80px !important;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;

  &:hover {
    transform: translateY(-2px);
  }
}

@media screen and (max-width: 600px) {
  .thumbnails {
    display: flex;
    justify-content: space-evenly;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
  }

  .thumbnail_itm {
    max-width: 50px !important;
    max-height: 40px !important;
  }
}

.active_slide {
  border: 2px solid #000;
  border-radius: 5px;
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
</style>
