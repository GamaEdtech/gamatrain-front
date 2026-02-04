<template>
  <div class="school-details-page">
    <v-container
      v-if="status !== 'pending' && contentData"
      id="school-details"
    >
      <v-row class="d-flex d-md-none">
        <div class="top-slide-container">
          <school-detail-school-map
            :content="contentData"
            :class="topSlideClass.map"
            @location-updated="handleLocationUpdate"
          />
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
          <school-detail-school-map
            :content="contentData"
            @location-updated="handleLocationUpdate"
          />
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
          <v-row class="mt-6 d-flex d-md-none justify-center">
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
          </v-row>
          <v-row class="d-flex d-md-none">
            <v-col
              cols="6"
              class="text-left d-block d-md-none"
            >
              <div class="text-start">
                <div
                  class="d-flex align-center ga-1 gama-text-body2 primary-gray-500 pt-1"
                >
                  <v-icon small>
                    mdi-update
                  </v-icon>
                  {{ $dayjs(contentData.up_date).format("YY/MM/DD") }}
                </div>
              </div>
            </v-col>
            <v-col
              cols="6"
              class="d-block d-md-none"
            >
              <div
                class="d-flex justify-end align-center ga-1 rate-section gtext-t4 font-weight-semibold"
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
              <school-detail-boards :school-boards="contentData.boards" />
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
          <v-row class="mt-10">
            <v-col cols="12">
              <school-detail-school-description
                :content="contentData"
                @edit="handleDescriptionEdit"
                @update="handleDescriptionUpdate"
              />
            </v-col>
          </v-row>
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
                v-model="isAdsLoad"
                adslot="9511163476"
              />
            </v-col>
          </v-row>

          <school-detail-users-score
            :rating-data="ratingData"
            @leave-comment="showLeaveCommentDialog = true"
          />
          <school-detail-recent-comments
            :comment-list="commentList"
            @reaction-updated="refreshComments()"
          />
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
          v-model="isAdsLoad"
          adslot="7199289937"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
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
const isAdsLoad = ref(false)

const requestURL = ref(useRequestURL().host)

const breadcrumbSchema = computed(() => {
  if (!contentData.value) return null

  return {
    '@type': 'BreadcrumbList',
    '@id': 'https://gamatrain.com/school/123#breadcrumb',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://gamatrain.com',
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Schools',
        'item': 'https://gamatrain.com/schools',
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': contentData.value.name,
        'item': `https://${requestURL.value}/school/${contentData.value.id}/${contentData.value.slug}`,
      },
    ],
  }
})

const ratingSchema = computed(() => {
  if (
    !ratingData.value
    || !ratingData.value.averageRate
    || !ratingData.value.totalCount
  ) {
    return null
  }

  return {
    '@type': 'AggregateRating',
    'ratingValue': ratingData.value.averageRate.toFixed(1),
    'reviewCount': ratingData.value.totalCount,
  }
})

const schoolSchema = computed(() => {
  if (!contentData.value) return null

  const imageUrl = contentData.value.defaultImageUri
    ? contentData.value.defaultImageUri.replace(/^http:\/\//, 'https://')
    : 'https://gamatrain.com/android-chrome-512x512-light.png'

  return {
    '@type': 'School',
    '@id': `https://${requestURL.value}/school/${contentData.value.id}#school`,
    'name': contentData.value.name,
    'description': contentData.value.description,
    'url': `https://${requestURL.value}/school/${contentData.value.id}/${contentData.value.slug}`,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://${requestURL.value}/school/${contentData.value.id}/${contentData.value.slug}`,
    },
    'image': [{
      '@type': 'ImageObject',
      'url': imageUrl,
    }],
    ...(contentData.value.phoneNumber && { telephone: contentData.value.phoneNumber }),
    ...(contentData.value.email && { email: contentData.value.email }),
    'address': {
      '@type': 'PostalAddress',
      ...(contentData.value.cityTitle && { addressLocality: contentData.value.cityTitle }),
      ...(contentData.value.stateTitle && { addressRegion: contentData.value.stateTitle }),
      ...(contentData.value.countryTitle && { addressCountry: contentData.value.countryTitle }),
    },
    ...(ratingSchema.value && { aggregateRating: ratingSchema.value }),
  }
})

const fullSchema = computed(() => {
  const schemaList = [
    breadcrumbSchema.value,
    schoolSchema.value,
  ].filter(Boolean)

  return schemaList.length
    ? {
        '@context': 'https://schema.org',
        '@graph': schemaList,
      }
    : null
})

// --- Description meta generation ---
function generateDefaultDescription(data) {
  try {
    const name = data?.name || ''
    const city = data?.cityTitle || ''
    const state = data?.stateTitle || ''
    const country = data?.countryTitle || ''
    const location = [city, state, country].filter(Boolean).join(', ')

    const facilities = Array.isArray(data?.tags)
      ? data.tags
          .map(t => (typeof t === 'string' ? t : t?.title || t?.name))
          .filter(t => typeof t === 'string' && t.trim().length > 0)
          .join(', ')
      : ''

    const phone = data?.phoneNumber || ''
    const site = data?.webSite || ''

    const parts = []
    if (name) {
      parts.push(`Discover ${name}${location ? ` in ${location}` : ''}`)
    }
    else if (location) {
      parts.push(`Discover schools in ${location}`)
    }
    else {
      parts.push('Discover this school')
    }
    if (facilities) parts.push(` — offering ${facilities} for students`)

    const contactBits = []
    if (phone) contactBits.push(`Call ${phone}`)
    if (site) contactBits.push(`visit ${site}`)
    if (contactBits.length > 0) parts.push(`. ${contactBits.join(' or ')}`)

    let sentence = parts.join('')
    if (!sentence.endsWith('.')) sentence = `${sentence}.`
    return sentence
  }
  catch {
    return 'Discover this school.'
  }
}

const editingDescription = ref('')
const defaultDescription = computed(() =>
  contentData.value ? generateDefaultDescription(contentData.value) : '',
)
const metaDescription = computed(() => {
  const live = editingDescription.value?.trim()
  if (live) return live
  const saved = contentData.value?.description
  if (typeof saved === 'string' && saved.trim().length > 0) return saved.trim()
  return defaultDescription.value
})

function handleDescriptionEdit(val) {
  editingDescription.value = typeof val === 'string' ? val : ''
}

function handleDescriptionUpdate(val) {
  const value = typeof val === 'string' ? val : ''
  if (contentData.value) contentData.value.description = value
  editingDescription.value = ''
}

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
  script: [
    {
      key: 'json-ld-schema',
      type: 'application/ld+json',
      innerHTML: JSON.stringify(fullSchema.value),
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: contentData.value
        ? `https://${requestURL.value}/school/${contentData.value.id}/${contentData.value.slug}`
        : `https://${requestURL.value}/school/${route.params.id}`,
    },
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon-dark.ico',
    },
  ],
}))
const ogImage = contentData.value?.defaultImageUri
  ? contentData.value?.defaultImageUri.replace(/^http:\/\//, 'https://')
  : null

useSeoMeta({
  title: () => `${contentData.value?.name} | GamaTrain Schools`,
  description: () => metaDescription.value,
  ogTitle: () => `${contentData.value?.name} | GamaTrain Schools`,
  ogDescription: () => metaDescription.value,
  ogUrl: () =>
    `${requestURL.value}/school/${contentData.value?.id}/${contentData?.value?.slug}`,
  twitterTitle: () => `${contentData.value?.name} | GamaTrain Schools`,
  twitterDescription: () => metaDescription.value,
  twitterCard: 'summary_large_image',
  ogImage: () => ogImage,
  twitterImage: () => ogImage,
})

if (!ogImage) {
  defineOgImageComponent('SchoolDetail', {
    title: contentData.value?.name,
    address:
      contentData.value?.countryTitle
      + ', '
      + contentData.value?.stateTitle
      + ', '
      + contentData.value?.cityTitle,
    phone: contentData.value?.phoneNumber,
    email: contentData.value?.email,
  })
}

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
      latitude: locationData.latitude,
      longitude: locationData.longitude,
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

const { data: commentsData, refresh: refreshComments } = await useAsyncData(
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
  position: absolute;
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
