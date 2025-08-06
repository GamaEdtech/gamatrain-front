<template>
  <div class="test-details-content">
    <common-category />

    <section>
      <v-container class="py-0">
        <v-row class="mt-0 py-0">
          <v-col cols="12">
            <!-- Skeleton loader for breadcrumb -->
            <v-skeleton-loader
              v-if="pending"
              class="mx-auto"
              height="60"
            />
            <!-- Actual breadcrumb when loaded -->
            <widgets-breadcrumb
              v-else
              :breads="breads"
            />
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section>
      <v-container class="py-0">
        <div
          v-if="pending"
          class="detail mt-md-8"
        >
          <v-row>
            <v-col
              cols="12"
              md="4"
            >
              <v-skeleton-loader
                class="mx-auto"
                height="300"
              />
            </v-col>

            <v-col
              cols="12"
              md="5"
            >
              <v-skeleton-loader
                class="mx-auto"
                height="300"
              />
            </v-col>

            <v-col md="3">
              <v-skeleton-loader
                class="mx-auto"
                type="list-item-avatar"
              />

              <v-skeleton-loader
                class="mx-auto mt-2"
                type="list-item-three-line"
                repeat="4"
              />

              <v-skeleton-loader
                class="mx-auto mt-4"
                type="button"
              />
            </v-col>
          </v-row>
        </div>

        <div
          v-else
          class="detail mt-md-8"
        >
          <v-row>
            <v-col
              cols="12"
              md="4"
            >
              <details-multimedia-preview-gallery
                ref="preview_gallery"
                :gallery-images="previewImages"
                :link-data="previewLinkData"
                :initial-slide="0"
              />
            </v-col>
            <v-col
              cols="12"
              md="5"
            >
              <div class="d-flex mb-4">
                <div class="w-100">
                  <div class="d-flex align-center justify-space-between header">
                    <h1
                      v-show="!editMode.title"
                      class="gama-text-h5 font-weight-bold"
                    >
                      {{ contentData?.title }}
                      <v-btn
                        v-if="user?.id == contentData?.user_"
                        icon
                        size="x-small"
                        @click="editMode.title = true"
                      >
                        <v-icon> mdi-pencil </v-icon>
                      </v-btn>
                    </h1>
                  </div>

                  <div class="w-100">
                    <v-textarea
                      v-if="editMode.title"
                      v-model="contentData.title"
                      width="100%"
                      rows="3"
                      placeholder="Title"
                    >
                      <template #append-inner>
                        <v-btn
                          color="success"
                          icon
                          :loading="editMode.title_loading"
                          size="x-small"
                          @click="updateDetails()"
                        >
                          <v-icon> mdi-check </v-icon>
                        </v-btn>
                      </template>
                    </v-textarea>
                  </div>

                  <multimedia-detail-description-section
                    :description="contentData?.description"
                    :collection-list="contentData?.collectionList"
                    :can-edit="user?.id == contentData?.user_"
                    @update:description="contentData.description = $event"
                    @save="updateDetails"
                  />

                  <multimedia-detail-tag-section
                    :section-id="contentData?.section"
                    :section-title="contentData?.section_title"
                    :base-id="contentData?.base"
                    :base-title="contentData?.base_title"
                    :lesson-id="contentData?.lesson"
                    :lesson-title="contentData?.lesson_title"
                  />
                </div>
              </div>
              <div class="text-center download-sec">
                <multimedia-detail-download-section
                  :file-ext="contentData?.files?.ext || 'pptx'"
                  :price="contentData?.files?.price || 0"
                  :file-id="route.params.id"
                  :credit="user?.credit || 0"
                  @login="openAuthDialog('login')"
                  @register="openAuthDialog('register')"
                />
              </div>
            </v-col>
            <v-col md="3">
              <multimedia-detail-sidebar
                :avatar="contentData?.avatar"
                :first-name="contentData?.first_name"
                :last-name="contentData?.last_name"
                :content-type-title="contentData?.content_type_title"
                :file-pages="contentData?.file_pages"
                :views="contentData?.views"
                :up-date="contentData?.up_date"
                :file-ext="contentData?.files?.ext || 'pptx'"
                :price="contentData?.files?.price || 0"
                :title="contentData?.title"
                :download-loading="download_loading"
                @download="startDownload"
              />
            </v-col>
          </v-row>
        </div>
      </v-container>
    </section>

    <multimedia-detail-mobile-order-section
      v-if="!pending"
      :file-ext="contentData?.files?.ext || 'pptx'"
      :price="contentData?.files?.price || 0"
      :credit="user?.credit || 0"
      :is-logged-in="isLoggedIn"
      :download-loading="download_loading"
      @download="startDownload"
      @login="openAuthDialog('login')"
      @register="openAuthDialog('register')"
    />

    <v-container>
      <v-row v-if="pending">
        <v-col
          cols="12"
          md="6"
        >
          <v-skeleton-loader
            class="mx-auto mb-4"
            type="card"
            height="200"
          />
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <v-skeleton-loader
            class="mx-auto mb-4"
            type="card"
            height="200"
          />
        </v-col>
      </v-row>

      <v-row v-else>
        <v-col
          cols="12"
          md="6"
        />
        <v-col
          cols="12"
          md="6"
        />
      </v-row>
      <common-related-portrait-content
        page-type="multimedia"
        page-name="Multimedia"
        source="file"
        request="file"
      />
    </v-container>
    <section class="feed" />

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
import { useFetch, useAsyncData } from '#app'

const auth = useAuth()
const { user } = useUser()

definePageMeta({
  auth: false,
})

const preview_gallery = ref(null)
const route = useRoute()
const router = useRouter()
const { $toast } = useNuxtApp()
const contentData = ref({})
const editMode = reactive({
  title: false,
  title_loading: false,
})
const requestURL = ref(useRequestURL().host)
const breads = ref([])

const download_loading = ref(false)

const isAdsLoad = ref(false)

const previewImages = computed(() => {
  return contentData.value?.previewData?.preview || []
})

const previewLinkData = computed(() => {
  return {
    state: contentData.value?.state || '',
    section: contentData.value?.section || '',
    base: contentData.value?.base || '',
    course: contentData.value?.course || '',
    lesson: contentData.value?.lesson || '',
  }
})

const isLoggedIn = computed(() => {
  return auth.isAuthenticated.value ?? false
})

useHead(() => ({
  title: contentData.value?.title || 'Multimedia Details',
  link: [
    {
      rel: 'canonical',
      href: `https://${requestURL.value}/multimedia/${contentData.value.id}/${contentData.value.title_url}`,
    },
  ],
}))

async function fetchContentData() {
  const { id } = route.params

  // Use key to ensure proper caching and refresh behavior
  const { data: content } = await useFetch(`/api/v1/files/${id}`, {
    key: `file-${id}`,
    dedupe: 'cancel', // Cancel previous identical requests
    server: true, // Ensure it runs on server
    immediate: true, // Start fetching immediately
  })

  if (!content.value) {
    throw new Error('Content not found - No data returned')
  }

  if (content.value?.status === 1 && content.value?.data) {
    // Create a proper slug from the title
    const correctSlug
      = content.value.data.title_url
        || content.value.data.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/-$/, '')

    // Verify the URL slug matches the content
    if (route.params.slug !== correctSlug) {
      // If slugs don't match, continue with correct data
    }

    return content.value.data
  }
  else {
    throw new Error('Content not found')
  }
}

// const {
//   pending,
//   error,
//   data: asyncContentData,
// } = useAsyncData(
//   `multimedia-details-${route.params.id}`,
//   async () => {
//     try {
//       const data = await fetchContentData();

//       if (data) {
//         contentData.value = data;

//         initBreadCrumb();
//       }

//       return data;
//     } catch (err) {
//       showError({
//         statusCode: err.response?.status || 500,
//         message:
//           err.response?.data?.message ||
//           "Something went wrong loading the content",
//       });
//       return null;
//     }
//   },
//   {
//     server: true,
//     lazy: false,
//     immediate: true,
//     watch: [() => route.params.id],
//   }
// );
const { data, pending, _error } = await useAsyncData(
  `multimedia-details-${route.params.id}`,
  async () => {
    const data = await fetchContentData()
    return data
  },
)
watchEffect(async () => {
  if (data.value) {
    contentData.value = data.value
    await initBreadCrumb()
  }
})

// onMounted(async () => {
//   if (pending.value) {
//     await _waitForAsyncData();
//   }

//   if (!contentData.value || Object.keys(contentData.value).length === 0) {
//     if (asyncContentData.value) {
//       contentData.value = asyncContentData.value;
//       initBreadCrumb();
//     }
//   }
// });

function _waitForAsyncData() {
  return new Promise((resolve) => {
    if (!pending.value) {
      resolve()
      return
    }

    const checkInterval = setInterval(() => {
      if (!pending.value) {
        clearInterval(checkInterval)
        resolve()
      }
    }, 100)

    // Add a safety timeout after 5 seconds
    setTimeout(() => {
      clearInterval(checkInterval)
      resolve()
    }, 5000)
  })
}

watch(
  contentData,
  (newData) => {
    if (newData) {
      initBreadCrumb()
    }
  },
  { deep: true },
)

async function initBreadCrumb() {
  if (!contentData.value || !contentData.value.section_title) {
    return
  }

  breads.value.push({
    text: 'Multimedia',
    disabled: false,
    href: '/search?type=learnfiles',
  })

  if (contentData.value.section_title) {
    breads.value.push({
      text: contentData.value.section_title,
      disabled: false,
      href: `/search?type=learnfiles&section=${contentData.value.section}`,
    })
  }

  if (contentData.value.base_title) {
    breads.value.push({
      text: contentData.value.base_title,
      disabled: false,
      href: `/search?type=test&section=${contentData.value.section}&base=${contentData.value.base}`,
    })
  }

  if (contentData.value.lesson_title) {
    breads.value.push({
      text: contentData.value.lesson_title,
      disabled: false,
      href: `/search?type=test&section=${contentData.value.section}&base=${contentData.value.base}&lesson=${contentData.value.lesson}`,
    })
  }
}

function openAuthDialog(val) {
  router.push({ query: { auth_form: val } })
}

async function startDownload(_type) {
  download_loading.value = true
  const apiUrl = `/api/v1/files/download/${route.params.id}`
  try {
    const response = await useApiService.get(apiUrl)
    const FileSaver = await import('file-saver')
    await FileSaver.saveAs(response.data.url, response.data.name)
  }
  catch (err) {
    if (err.response?.status == 400) {
      if (
        err.response.data.status == 0
        && err.response.data.error == 'creditNotEnough'
      ) {
        $toast.info('No enough credit')
      }
    }
  }
  finally {
    download_loading.value = false
  }
}

function urlencodeFormData(fd) {
  let s = ''
  for (const pair of fd.entries()) {
    if (typeof pair[1] == 'string') {
      s += (s ? '&' : '') + encode(pair[0]) + '=' + encode(pair[1])
    }
  }
  return s
}

function encode(s) {
  return encodeURIComponent(s).replace(/%20/g, '+')
}

async function updateDetails() {
  // Arrange to form data
  const isEditingTitle = editMode.title
  if (isEditingTitle) {
    editMode.title_loading = true
  }

  const formData = new FormData()
  formData.append('title', contentData.value?.title)
  formData.append('description', contentData.value?.description)

  try {
    const { data } = await useApiService.put(
      `/api/v1/files/${route.params.id}`,
      urlencodeFormData(formData),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )

    if (data.value?.id == 0 && data.value?.repeated) {
      $toast.info('The multimedia is duplicated')
    }
    else {
      $toast.success('Updated successfully')
    }
  }
  catch (err) {
    if (err.response?.status == 403) {
      $toast.error('You do not have permission to update this content')
    }
    else if (err.response?.status == 400) {
      $toast.error(err.response.data.message)
    }
  }
  finally {
    editMode.title = false
    editMode.title_loading = false
  }
}
</script>

<style>
.content_main_info {
  padding: 27px;
  background: #f5f5f5 !important;
  border-radius: 6px;
}

.content_main_info .creator_title {
  font-size: 18px;
}

p {
  font-size: 1.3rem !important;
}
</style>
