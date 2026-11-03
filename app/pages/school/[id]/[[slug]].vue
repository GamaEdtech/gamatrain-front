<template>
  <div class="school-page">
    <v-container
      v-if="contentData"
      class="school-container"
    >
      <!-- Mobile: header, media, contact/location/profile, details. Desktop: details left, contact sidebar right. -->
      <div class="school-layout">
        <school-detail-school-header
          class="area-header"
          :content="contentData"
          :rating-data="ratingData"
          @leave-comment="openCommentDialog"
          @contribute="contribute"
        />

        <school-detail-school-media
          ref="mediaRef"
          v-model:images="galleryImages"
          class="area-media"
          :content="contentData"
          :tour="tour"
          :images-loaded="imagesLoaded"
          @fetch-images="loadGalleryImages"
          @fetch-tour="loadTourPanorama"
        />

        <aside class="area-side">
          <school-detail-school-main-info
            ref="contactRef"
            :content="contentData"
            @update="applyUpdate"
            @report="openReportDialog"
          />
          <school-detail-school-map
            ref="mapRef"
            :content="contentData"
            @location-updated="handleLocationUpdate"
          />
          <school-detail-profile-progress
            :content="contentData"
            :images-count="galleryImages.length"
            :has-tour="!!tour"
            :media-loaded="tourLoaded"
            @contribute="contribute"
          />
        </aside>

        <div class="area-main">
          <school-detail-tuition-info
            ref="tuitionRef"
            :content-data="contentData"
          />
          <school-detail-facilities
            ref="facilitiesRef"
            :facilities="contentData.tags || []"
          />
          <school-detail-boards
            ref="boardsRef"
            :school-boards="contentData.boards || []"
          />
          <school-detail-school-description
            ref="descriptionRef"
            :content="contentData"
            @edit="handleDescriptionEdit"
            @update="handleDescriptionUpdate"
          />
          <school-detail-users-score
            :rating-data="ratingData"
            @leave-comment="openCommentDialog"
          />
          <school-detail-recent-comments
            :comment-list="commentList"
            @reaction-updated="refreshComments()"
          />
        </div>
      </div>

      <div class="school-more">
        <school-detail-nearest-school
          :lat="contentData.latitude"
          :lng="contentData.longitude"
        />

        <nav
          v-if="exploreLinks.length"
          class="explore"
          aria-labelledby="explore-title"
        >
          <h2
            id="explore-title"
            class="section-title"
          >
            Browse more schools
          </h2>
          <div class="d-flex flex-wrap ga-2 mt-3">
            <v-chip
              v-for="link in exploreLinks"
              :key="link.to"
              :to="link.to"
              append-icon="mdi-chevron-right"
              variant="outlined"
              color="grey800"
              size="large"
              class="font-weight-medium gtext-t5 explore-link"
            >
              {{ link.label }}
            </v-chip>
          </div>
        </nav>
      </div>

      <!-- Dialogs mount on first use, so their code (and reCAPTCHA) only loads for people who open them. -->
      <lazy-school-detail-leave-comment-dialog
        v-if="commentDialogMounted"
        v-model="showLeaveCommentDialog"
        :content-data="contentData"
        @submitted="handleCommentSubmitted"
      />

      <lazy-school-detail-report-dialog
        v-if="reportDialogMounted"
        v-model="reportDialog"
        :school-id="String(route.params.id)"
        @open-auth-dialog="openAuthDialog"
      />
    </v-container>
  </div>
</template>

<script setup>
definePageMeta({
  // The site-wide post slider has nothing to do with a school; nearby schools and area links replace it.
  hidePostSlider: true,
})

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const { requireSignIn } = useContributeGate()

const showLeaveCommentDialog = ref(false)
const commentDialogMounted = ref(false)
const reportDialog = ref(false)
const reportDialogMounted = ref(false)
const commentList = ref([])
const contentData = ref(null)
const ratingData = ref(null)
const galleryImages = ref([])
const imagesLoaded = ref(false)
const tour = ref(null)
const tourLoaded = ref(false)

const mediaRef = ref(null)
const contactRef = ref(null)
const mapRef = ref(null)
const tuitionRef = ref(null)
const facilitiesRef = ref(null)
const boardsRef = ref(null)
const descriptionRef = ref(null)

const breadcrumbSchema = computed(() => {
  if (!contentData.value?.name) return null

  return {
    '@type': 'BreadcrumbList',
    '@id': `${canonicalUrl}#breadcrumb`,
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
        'item': 'https://gamatrain.com/school',
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': contentData.value.name,
        'item': canonicalUrl,
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

// Everything the school API knows about a place goes in: street address, postcode and coordinates are
// what local results and knowledge panels match a school on. Empty values are left out rather than sent
// as "" - and a school without a photo has no image, instead of claiming the GamaTrain logo as its own.
const schoolSchema = computed(() => {
  const school = contentData.value
  // A nameless school would be an Organization without its one required field.
  if (!school?.name) return null

  const latitude = Number(school.latitude)
  const longitude = Number(school.longitude)
  // webSite is free text and sometimes not a URL at all ("government").
  const website = /^https?:\/\/\S+\.\S+/i.test(school.webSite ?? '') ? school.webSite : null
  const address = {
    ...(school.address && { streetAddress: school.address }),
    ...(school.cityTitle && { addressLocality: school.cityTitle }),
    ...(school.stateTitle && { addressRegion: school.stateTitle }),
    ...(school.zipCode && { postalCode: school.zipCode }),
    ...(school.countryTitle && { addressCountry: school.countryTitle }),
  }

  return {
    '@type': 'School',
    '@id': `${canonicalUrl}#school`,
    'name': school.name,
    ...(school.localName && school.localName !== school.name && { alternateName: school.localName }),
    'description': school.description || metaDescription.value,
    'url': canonicalUrl,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    ...(school.defaultImageUri && {
      image: [{
        '@type': 'ImageObject',
        'url': school.defaultImageUri.replace(/^http:\/\//, 'https://'),
      }],
    }),
    ...(website && { sameAs: [website] }),
    ...(school.phoneNumber && { telephone: school.phoneNumber }),
    ...(school.email && { email: school.email }),
    ...(Object.keys(address).length && { address: { '@type': 'PostalAddress', ...address } }),
    ...(Number.isFinite(latitude) && Number.isFinite(longitude) && (latitude || longitude) && {
      geo: { '@type': 'GeoCoordinates', latitude, longitude },
    }),
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
      `/api/v2/schools/${route.params.id}`, undefined, { public: true },
    )
    if (response.succeeded) {
      return response
    }
    else {
      // Not-found signal only - the actual 404 response/error page is triggered below, right
      // after useAsyncData resolves. showError() called from inside this nested handler doesn't
      // reliably convert the SSR response to a real 404 (confirmed: page still returns 200 with
      // broken/undefined content), so this only returns null for the caller to act on.
      return null
    }
  }
  catch (error) {
    console.error('Error fetching data:', error)
    return null
  }
}

const fetchRatingData = async () => {
  try {
    const response = await useApiService.get(
      `/api/v2/schools/${route.params.id}/rate`, undefined, { public: true },
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
  status: _status,
  _refresh,
} = await useAsyncData(() => `contentData-${route.params.id}`, () => fetchSchoolData(), {
  server: true,
  lazy: false,
  immediate: true,
})

// Thrown here (top-level script, right after the data is awaited) rather than from inside
// fetchSchoolData - that's what actually makes Nuxt return a real 404 status and render the
// error page during SSR, instead of a 200 response with empty/undefined content.
if (!contentDataRaw.value?.data) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Founded!',
    fatal: true,
  })
}

const { url: canonicalUrl } = await useCanonicalContentPath('school', contentDataRaw.value.data.id, contentDataRaw.value.data.slug)

const {
  data: ratingDataRaw,
  status: _ratingStatus,
  refresh: _refreshRating,
} = await useAsyncData(() => `ratingData-${route.params.id}`, () => fetchRatingData(), {
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

// The gallery, tour and nearby schools are fetched from the API right after load.
const apiOrigin = (() => {
  try {
    return new URL(config.public.apiV2BaseUrl).origin
  }
  catch {
    return null
  }
})()

// The school's own photo is the biggest thing above the fold when it has one: start it early.
const heroImage = computed(() =>
  contentData.value?.defaultImageUri?.replace(/^http:\/\//, 'https://') || null)

useHead(() => ({
  htmlAttrs: {
    lang: 'en',
  },
  script: fullSchema.value
    ? [{ key: 'json-ld-schema', type: 'application/ld+json', innerHTML: JSON.stringify(fullSchema.value) }]
    : [],
  link: [
    {
      rel: 'canonical',
      href: canonicalUrl,
    },
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon-dark.ico',
    },
    ...(apiOrigin ? [{ rel: 'preconnect', href: apiOrigin, crossorigin: '' }] : []),
    ...(heroImage.value ? [{ rel: 'preload', as: 'image', href: heroImage.value, fetchpriority: 'high' }] : []),
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
  ogUrl: canonicalUrl,
  twitterTitle: () => `${contentData.value?.name} | GamaTrain Schools`,
  twitterDescription: () => metaDescription.value,
  twitterCard: 'summary_large_image',
  ogImage: () => ogImage,
  twitterImage: () => ogImage,
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

// Opens the editor for one missing detail. Sections that edit in place are scrolled into view first.
const contributeTargets = {
  photo: { ref: mediaRef, open: el => el.startAddPhoto() },
  tour: { ref: mediaRef, open: el => el.startAddTour() },
  phone: { ref: contactRef, open: el => el.startEdit('phone') },
  website: { ref: contactRef, open: el => el.startEdit('website') },
  email: { ref: contactRef, open: el => el.startEdit('email') },
  address: { ref: contactRef, open: el => el.startEdit('address') },
  location: { ref: mapRef, open: el => el.openLocationDialog() },
  tuition: { ref: tuitionRef, open: el => el.startEdit() },
  facilities: { ref: facilitiesRef, open: el => el.openModal() },
  boards: { ref: boardsRef, open: el => el.openModal() },
  description: { ref: descriptionRef, open: el => el.startEdit() },
}

function contribute(key) {
  const target = contributeTargets[key]
  if (!target?.ref.value || !requireSignIn()) return
  target.ref.value.$el?.scrollIntoView?.({ behavior: 'smooth', block: 'center' })
  target.open(target.ref.value)
}

function applyUpdate(update) {
  if (contentData.value) Object.assign(contentData.value, update)
}

function openCommentDialog() {
  commentDialogMounted.value = true
  showLeaveCommentDialog.value = true
}

function openReportDialog() {
  reportDialogMounted.value = true
  reportDialog.value = true
}

function openAuthDialog(val) {
  router.push({ query: { auth_form: val } })
}

const exploreLinks = computed(() => {
  const school = contentData.value
  if (!school) return []
  return [
    { scope: 'city', title: school.cityTitle },
    { scope: 'state', title: school.stateTitle },
    { scope: 'country', title: school.countryTitle },
  ]
    .filter(item => item.title)
    .map(item => ({ label: `Schools in ${item.title}`, to: buildSchoolListUrl(item.scope, school) }))
})

function loadTourPanorama() {
  useApiService
    .get(`/api/v2/schools/${route.params.id}/images/Tour360`, undefined, { public: true })
    .then((response) => {
      const panoramas = response.data || []
      tour.value = panoramas.length ? panoramas[panoramas.length - 1].fileUri : null
    })
    .catch(() => {})
    .finally(() => {
      tourLoaded.value = true
    })
}

// The photo list is fetched on the server too, so the gallery has its final shape in the first HTML
// (no layout shift when more photos arrive). A failure just means "no gallery", never a broken page.
const { data: galleryData, refresh: refreshGallery } = await useAsyncData(
  () => `gallery-${route.params.id}`,
  () => useApiService
    .get(`/api/v2/schools/${route.params.id}/images/SimpleImage`, undefined, { public: true })
    .catch(() => null),
  { server: true, lazy: false, immediate: true },
)

watch(
  () => galleryData.value,
  (response) => {
    galleryImages.value = [...(response?.data || [])].reverse()
    imagesLoaded.value = true
  },
  { immediate: true },
)

function loadGalleryImages() {
  refreshGallery()
}

function handleLocationUpdate(locationData) {
  applyUpdate({
    latitude: locationData.latitude,
    longitude: locationData.longitude,
    countryId: locationData.countryId,
    stateId: locationData.stateId,
    cityId: locationData.cityId,
    countryTitle: locationData.countryTitle,
    stateTitle: locationData.stateTitle,
    cityTitle: locationData.cityTitle,
  })
}

function handleCommentSubmitted() {
  refreshComments()
}

const { data: commentsData, refresh: refreshComments } = await useAsyncData(
  `comments-${route.params.id}`,
  () =>
    useApiService.get(`/api/v2/schools/${route.params.id}/comments`, {
      'PagingDto.PageFilter.Size': 20,
    }, { public: true }),
  {
    server: true,
    lazy: false,
    immediate: true,
  },
)

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
})
</script>

<style>
/* Shared look for the sections the detail components render; not scoped, so it reaches inside them. */
.school-page .detail-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.school-page .section-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.school-page .section-title {
  margin: 0;
  font-size: 19px;
  line-height: 1.3;
  font-weight: 700;
  color: rgb(var(--v-theme-grey900));
}

.school-page .v-btn,
.school-page .v-chip {
  letter-spacing: normal;
}

.school-page .section-action {
  flex-shrink: 0;
  letter-spacing: normal;
}

.school-page .section-empty {
  margin: 0;
  font-size: 14px;
  color: rgb(var(--v-theme-grey500));
}
</style>

<style scoped>
.school-container {
  max-width: 1200px;
  padding-top: 84px;
  padding-bottom: 48px;
}

.school-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas:
    "header"
    "media"
    "side"
    "main";
  gap: 28px;
}

.area-header { grid-area: header; }
.area-media { grid-area: media; }
.area-main { grid-area: main; }
.area-side { grid-area: side; }

.area-main,
.area-side {
  display: flex;
  flex-direction: column;
  gap: 32px;
  min-width: 0;
}

.area-side {
  gap: 20px;
}

@media (min-width: 960px) {
  .school-container {
    padding-top: 96px;
  }

  .school-layout {
    grid-template-columns: minmax(0, 1fr) 360px;
    grid-template-areas:
      "header header"
      "media side"
      "main side";
    column-gap: 40px;
    row-gap: 32px;
  }

  .area-side {
    align-self: start;
    position: sticky;
    top: 84px;
  }
}

.school-more {
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-top: 48px;
}

.explore-link {
  border-color: rgb(var(--v-theme-grey200));
}
</style>
