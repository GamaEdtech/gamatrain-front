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
                :is-downloading="isDownloading"
                :download-progress="downloadProgress"
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
      :is-downloading="isDownloading"
      :download-progress="downloadProgress"
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
const auth = useAuth()
const { user } = useUser()

definePageMeta({
  auth: false,
})

const preview_gallery = ref(null)
const route = useRoute()
const router = useRouter()
const { $toast } = useNuxtApp()
const editMode = reactive({
  title: false,
  title_loading: false,
})
const requestURL = ref(useRequestURL().host)
const breads = ref([])

const download_loading = ref(false)

// Track download progress
const downloadProgress = ref(0)
const isDownloading = ref(false)

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

const { data: contentData } = await useAsyncData(
  () => `multimedia-${route.params.id}`,
  async () => {
    try {
      const content = await useApiService.get(`/api/v1/files/${route.params.id}`)
      return content.status === 1 ? content.data : {}
    }
    catch (e) {
      if (e?.status === 404) {
        // router.push("/search?type=question");
      }
      throw e
    }
  },
  {
    watch: [() => route.params.id],
  },
)

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

const ogImage
  = contentData.value?.previewData
    && contentData.value?.previewData.preview
    && contentData.value?.previewData.preview.length > 0
    ? contentData.value?.previewData.preview[0]
    : null
useHead(() => ({
  title: contentData.value?.title || 'Multimedia Details',
  meta: [
    {
      hid: 'apple-mobile-web-app-title',
      name: 'apple-mobile-web-app-title',
      content: contentData.value?.title,
    },
    {
      hid: 'og:title',
      name: 'og:title',
      content: contentData.value?.title,
    },
    {
      hid: 'og:site_name',
      name: 'og:site_name',
      content: 'GamaTrain',
    },
    {
      hid: 'description',
      name: 'description',
      content: contentData.value?.description,
    },
    {
      hid: 'og:description',
      name: 'og:description',
      content: contentData.value?.description,
    },
    {
      hid: 'og:image',
      property: 'og:image',
      content: ogImage,
    },
    {
      hid: 'twitter:card',
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      hid: 'twitter:title',
      name: 'twitter:title',
      content: contentData.value?.title,
    },
    {
      hid: 'twitter:description',
      name: 'twitter:description',
      content: contentData.value?.description,
    },
    {
      hid: 'twitter:image',
      name: 'twitter:image',
      content: ogImage,
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: `https://${requestURL.value}/multimedia/${contentData.value.id}/${contentData.value.title_url}`,
    },
  ],
}))

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
    href: '/search?type=multimedia',
  })

  if (contentData.value.section_title) {
    breads.value.push({
      text: contentData.value.section_title,
      disabled: false,
      href: `/search?type=multimedia&section=${contentData.value.section}`,
    })
  }

  if (contentData.value.base_title) {
    breads.value.push({
      text: contentData.value.base_title,
      disabled: false,
      href: `/search?type=paper&section=${contentData.value.section}&base=${contentData.value.base}`,
    })
  }

  if (contentData.value.lesson_title) {
    breads.value.push({
      text: contentData.value.lesson_title,
      disabled: false,
      href: `/search?type=paper&section=${contentData.value.section}&base=${contentData.value.base}&lesson=${contentData.value.lesson}`,
    })
  }
}

function openAuthDialog(val) {
  router.push({ query: { auth_form: val } })
}

async function startDownload(_type) {
  download_loading.value = true
  isDownloading.value = true
  downloadProgress.value = 0

  const apiUrl = `/api/v1/files/download/${route.params.id}`

  try {
    // Simulate progressive loading for API call
    const progressInterval = setInterval(() => {
      if (downloadProgress.value < 50) {
        downloadProgress.value += Math.random() * 15
      }
    }, 100)

    const response = await useApiService.get(apiUrl)

    // Update progress to 60% after API response
    downloadProgress.value = 60
    clearInterval(progressInterval)

    // Create a custom fetch with progress tracking
    const xhr = new XMLHttpRequest()
    xhr.open('GET', response.data.url, true)
    xhr.responseType = 'blob'

    xhr.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = 60 + (event.loaded / event.total) * 40
        downloadProgress.value = Math.min(percentComplete, 100)
      }
    }

    xhr.onload = () => {
      if (xhr.status === 200) {
        downloadProgress.value = 100

        // Use file-saver to save the blob
        import('file-saver').then(({ saveAs }) => {
          saveAs(xhr.response, response.data.name)
        })

        // Clean up after a short delay
        setTimeout(() => {
          isDownloading.value = false
          downloadProgress.value = 0
        }, 1000)
      }
    }

    xhr.onerror = () => {
      isDownloading.value = false
      downloadProgress.value = 0
    }

    xhr.send()
  }
  catch (err) {
    // Clean up on error
    isDownloading.value = false
    downloadProgress.value = 0

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
