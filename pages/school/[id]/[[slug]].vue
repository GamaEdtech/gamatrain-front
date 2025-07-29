<template>
  <div class="school-details-page">
    <v-container
      v-if="status !== 'pending' && contentData"
      id="school-details"
    >
      <v-row class="d-flex d-md-none">
        <div class="top-slide-container">
          <client-only>
            <school-detail-school-map
              :content="contentData"
              :class="topSlideClass.map"
              @location-updated="handleLocationUpdate"
            />
          </client-only>
          <school-detail-school-tour
            :class="topSlideClass.tour"
            :content="contentData"
          />
          <school-detail-image-gallery
            :content="contentData"
            :class="topSlideClass.image"
            :images="galleryImages"
            @fetch="loadGalleryImages"
          />
        </div>
      </v-row>

      <v-row class="d-none d-md-flex mt-15">
        <v-col
          cols="12"
          md="4"
        >
          <school-detail-image-gallery
            :content="contentData"
            :images="galleryImages"
            :class="topSlideClass.image"
            @fetch="loadGalleryImages"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <client-only>
            <school-detail-school-map
              :content="contentData"
              @location-updated="handleLocationUpdate"
            />
          </client-only>
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <school-detail-school-tour
            :content="contentData"
            @fetch="loadTourPanorama"
          />
        </v-col>
      </v-row>

      <!-- Data container -->
      <v-row class="data-container">
        <v-col cols="12">
          <v-row class="mt-6 d-flex d-md-none">
            <v-col
              cols="3"
              class="text-left d-block d-md-none"
            >
              <div class="text-center">
                <div class="gama-text-body2 primary-gray-500 pt-1">
                  <v-icon small>
                    mdi-update
                  </v-icon>
                  {{ $dayjs(contentData.up_date).format("YY/MM/DD") }}
                </div>
              </div>
            </v-col>
            <v-col
              cols="6"
              class="text-center d-block d-md-none"
            >
              <v-btn-toggle
                v-model="slideToggler"
                style="order: 2"
                size="x-small"
                rounded="xl"
                color="white"
                base-color="grey-lighten-3"
                selected-class="bg-white"
                active-class="bg-white"
                class="school-head-toggle"
                border
                @update:model-value="changeSlide"
              >
                <v-btn
                  color="white"
                  size="x-small"
                  class="text-transform-none gtext-t5 text-white"
                  value="image"
                >
                  <span class="text-black"> Image</span>
                </v-btn>
                <v-btn
                  color="white"
                  size="x-small"
                  class="text-transform-none gtext-t5 text-white"
                  value="map"
                >
                  <span class="text-black"> Map</span>
                </v-btn>
                <v-btn
                  color="white"
                  size="x-small"
                  class="text-transform-none gtext-t5 text-white"
                  value="tour"
                >
                  <span class="text-black"> Tour</span>
                </v-btn>
              </v-btn-toggle>
            </v-col>
            <v-col
              cols="3"
              class="text-right d-block d-md-none"
            >
              <div class="rate-section gtext-t4 font-weight-semibold ml-1">
                {{
                  ratingData.averageRate
                    ? ratingData.averageRate.toFixed(1)
                    : "New"
                }}
                <v-icon
                  size="20"
                  color="primary"
                >
                  mdi-star
                </v-icon>
              </div>
            </v-col>
          </v-row>

          <!-- General data section -->
          <v-row>
            <v-col
              cols="11"
              md="8"
            >
              <school-detail-school-title :content="contentData" />
            </v-col>
            <v-col
              cols="1"
              md="4"
              class="align-self-center"
            >
              <div class="float-right d-flex align-center mt-1">
                <span class="mr-3">
                  <v-icon
                    size="20"
                    color="primary"
                    plain
                    class=""
                    @click="reportDialog = true"
                  >mdi-alert-circle-outline</v-icon>
                </span>
                <v-icon
                  size="20"
                  class="primary-gray-300"
                >
                  mdi-heart
                </v-icon>

                <div
                  class="d-none d-md-block rate-section gtext-t4 font-weight-semibold ml-4"
                >
                  {{
                    ratingData.averageRate
                      ? ratingData.averageRate.toFixed(1)
                      : "New"
                  }}
                  <v-icon
                    size="20"
                    color="primary"
                  >
                    mdi-star
                  </v-icon>
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="8"
            >
              <school-detail-school-chips
                :content-data="contentData"
                @on-chips-click="handleQueryParameters"
              />
              <school-detail-tuition-info :content-data="contentData" />
              <school-detail-facilities
                :facilities="contentData.tags"
                @open-auth-dialog="openAuthDialog"
                @facilities-updated="refreshSchoolData"
              />
            </v-col>
            <v-col
              id="main-info-section"
              cols="12"
              md="4"
            >
              <school-detail-school-main-info :content="contentData" />
            </v-col>
          </v-row>

          <!-- End general data section -->

          <school-detail-users-score
            :rating-data="ratingData"
            @leave-comment="showLeaveCommentDialog = true"
          />
          <school-detail-recent-comments :comment-list="commentList" />
          <school-detail-similar-schools :similar-schools="similarSchools" />
        </v-col>
      </v-row>
      <!-- End data container -->

      <school-detail-leave-comment-dialog
        v-model="showLeaveCommentDialog"
        :content-data="contentData"
        @submitted="handleCommentSubmitted"
      />

      <school-detail-report-dialog
        v-model="reportDialog"
        :school-id="$route.params.id"
        @open-auth-dialog="openAuthDialog"
      />
    </v-container>
    <div v-else />

    <v-row
      justify="center"
      class="mt-10"
    >
      <v-col
        cols="12"
        md="8"
        class="text-center"
      >
        <common-ad-banner
          addslot="7199289937"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'nuxt/app'

const route = useRoute()
const router = useRouter()
const tourPanoramas = ref([])
const slideToggler = ref('map')
const topSlideClass = reactive({
  image: 'under-image-left',
  map: 'center-image',
  tour: 'under-image-right',
})
const showLeaveCommentDialog = ref(false)
const commentList = ref([])
const reportDialog = ref(false)
const contentData = ref(null)
const ratingData = ref(null)
const similarSchools = []
const galleryImages = ref([])
const requestURL = ref(useRequestURL().host)
const { $slugGenerator } = useNuxtApp()

const fetchSchoolData = async () => {
  try {
    const response = await useApiService.get(
      `/api/v2/schools/${route.params.id}`,
    )
    return response
  }
  catch (error) {
    console.error('Error fetching data:', error)
    return null
  }
}

const fetchRatingData = async () => {
  try {
    const response = await useApiService.get(
      `/api/v2/schools/${route.params.id}/rate`,
    )
    return response
  }
  catch (error) {
    console.error('Error fetching rating data:', error)
    return null
  }
}

const {
  data: contentDataRaw,
  status,
  _refresh,
} = await useAsyncData('contentData', () => fetchSchoolData(), {
  server: true,
  lazy: false,
  immediate: true,
})

const {
  data: ratingDataRaw,
  status: _ratingStatus,
  refresh: _refreshRating,
} = await useAsyncData('ratingData', () => fetchRatingData(), {
  server: true,
  lazy: false,
  immediate: true,
})

watch(
  () => contentDataRaw.value,
  (newData) => {
    if (newData?.data) {
      contentData.value = newData.data
    }
  },
  { immediate: true },
)

useHead(() => ({
  htmlAttrs: {
    lang: 'en',
  },
  link: [
    {
      rel: 'canonical',
      href: `${requestURL.value}/school/${
        contentData.value?.id
      }/${$slugGenerator(contentData?.value?.name)}`,
    },
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon-dark.ico',
    },
  ],
}))

useSeoMeta({
  title: `${contentData.value?.name} | GamaTrain Schools`,
  description: `Discover ${contentData.value?.name} in ${contentData.value?.cityTitle}, ${contentData.value?.countryTitle}. Explore ratings, facilities, and more on GamaTrain.`,
  ogTitle: `${contentData.value?.name} | GamaTrain Schools`,
  ogDescription: `Learn more about ${contentData.value?.name} located in ${contentData.value?.cityTitle}, ${contentData.value?.countryTitle}. See ratings, facilities, and more.`,
  ogImage: contentData.value?.defaultImageUri || '/images/gamatrain-logo.png',
  ogUrl: `${requestURL.value}/school/${contentData.value?.id}/${$slugGenerator(
    contentData?.value?.name,
  )}`,
  twitterTitle: `${contentData.value?.name} | GamaTrain Schools`,
  twitterDescription: `Discover ${contentData.value?.name} in ${contentData.value?.cityTitle}, ${contentData.value?.countryTitle} on GamaTrain.`,
  twitterImage:
    contentData.value?.defaultImageUri || '/images/gamatrain-logo.png',
  twitterCard: 'summary_large_image',
})

watch(
  () => ratingDataRaw.value,
  (newData) => {
    if (newData?.data) {
      ratingData.value = newData.data
    }
  },
  { immediate: true },
)

function changeSlide() {
  if (slideToggler.value == 'map') {
    topSlideClass.image = 'under-image-left'
    topSlideClass.map = 'center-image'
    topSlideClass.tour = 'under-image-right'
  }
  else if (slideToggler.value == 'image') {
    topSlideClass.image = 'center-image'
    topSlideClass.map = 'under-image-right'
    topSlideClass.tour = 'under-image-left'
  }
  else if (slideToggler.value == 'tour') {
    topSlideClass.image = 'under-image-right'
    topSlideClass.map = 'under-image-left'
    topSlideClass.tour = 'center-image'
  }
}
function openAuthDialog(val) {
  router.push({ query: { auth_form: val } })
}

function loadTourPanorama() {
  useApiService
    .get(`/api/v2/schools/${route.params.id}/images/Tour360`)
    .then((response) => {
      tourPanoramas.value = response.data
      if (tourPanoramas.value.length >= 1) {
        contentData.value.tour
          = tourPanoramas.value[tourPanoramas.value.length - 1].fileUri
      }
      else {
        contentData.value.tour = null
      }
    })
    .catch(() => {})
}
function refreshSchoolData() {}

function loadGalleryImages() {
  useApiService
    .get(`/api/v2/schools/${route.params.id}/images/SimpleImage`)
    .then((response) => {
      galleryImages.value = [...response.data].reverse()
    })
    .catch(() => {})
}

function handleLocationUpdate(locationData) {
  if (contentData.value) {
    contentData.value = {
      ...contentData.value,
      countryId: locationData.countryId,
      stateId: locationData.stateId,
      cityId: locationData.cityId,
      countryTitle: locationData.countryTitle,
      stateTitle: locationData.stateTitle,
      cityTitle: locationData.cityTitle,
    }
  }
}

function handleCommentSubmitted() {
  // Refresh comments when a new comment is submitted
  refreshComments()
}

function handleQueryParameters(data) {
  const _query = {}
  if (data.countryId) _query.country = data.countryId
  if (data.type === 'state' || data.type === 'city') {
    if (data.stateId) _query.state = data.stateId
  }
  if (data.type === 'city') {
    if (data.cityId) _query.city = data.cityId
  }
  router.push({ path: '/school', query: _query })
}

const {
  data: commentsData,
  refresh: _refreshComments,
  pending: _commentsPending,
} = await useAsyncData(
  `comments-${route.params.id}`,
  () =>
    useApiService.get(`/api/v2/schools/${route.params.id}/comments`, {
      'PagingDto.PageFilter.Size': 20,
    }),
  {
    server: true,
    lazy: false,
    immediate: true,
  },
)

// Watch for changes in comments data
watch(
  () => commentsData.value,
  (newData) => {
    if (newData?.data) {
      commentList.value = newData.data.list
    }
  },
  { immediate: true },
)

onMounted(() => {
  loadTourPanorama()
  loadGalleryImages()
})
</script>

<style scoped>
.school-head-toggle {
  height: 28px !important;
}

.top-slide-container {
  position: fixed;
  margin-top: 5.4rem;
  margin-bottom: 2rem;
  width: 100vw;
  height: 26.4rem;
  max-height: 26.4rem;
  overflow: hidden;
  z-index: 0;
}

.position-relative {
  position: relative;
}

@media (max-width: 600px) {
  .top-slide-container {
    margin-top: 2.4rem;
  }

  .data-container {
    margin-top: 27rem !important;
  }
}

.data-container {
  position: relative;
  z-index: 1;
  margin-top: 30rem;
  background: #fff;
  border-top-left-radius: 3.2rem;
  border-top-right-radius: 3.2rem;
}

.center-image {
  position: absolute;
  top: 0;
  left: 0 !important;
  margin: auto;
  z-index: 3;
  right: 0 !important;
  width: 70% !important;
  max-height: 26.4rem;
  overflow: hidden;
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
}

.center-image.enter-img-holder,
.center-image.position-relative {
  border-right: 1px solid white;
  border-left: 1px solid white;
}

.under-image-left,
.under-image-right {
  position: absolute;
  top: 0;
  max-height: 26.4rem;
  width: 80% !important;
}

.under-image-left {
  left: -32%;
  z-index: 1;
}

.under-image-left.enter-img-holder p,
.under-image-left.position-relative p {
  max-width: 2rem;
}

.under-image-right {
  right: -32%;
  z-index: 2;
}

.under-image-right.enter-img-holder p,
.under-image-right.position-relative p {
  max-width: 2rem;
}

@media (min-width: 960px) {
  .data-container {
    margin-top: 1rem;
  }

  .chips-container {
    white-space: normal;
    width: 80%;
  }
}

.enter-img-holder {
  background: #f2f4f7;
  height: 28.1rem;
  width: 100%;
  border-radius: 0.6rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
