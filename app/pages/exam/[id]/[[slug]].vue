<template>
  <div class="test-details-content">
    <common-category />

    <section>
      <v-container class="py-0">
        <div class="mt-0 py-0 header-path">
          <v-skeleton-loader
            v-if="pending"
            class="mx-auto"
            height="60"
          />
          <widgets-breadcrumb
            v-else
            :breads="breads"
          />
        </div>
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
              md="3"
            >
              <v-skeleton-loader
                class="mx-auto"
                height="300"
              />
            </v-col>

            <v-col
              cols="12"
              md="6"
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
              md="3"
            >
              <details-preview-gallery
                :image-urls="galleryImages"
                :help-link-data="galleryHelpData"
                :initial-slide="1"
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <exam-detail-description-section
                :content-data="contentData"
                :is-logged-in="auth.isAuthenticated.value"
                :credit="user?.user.value?.credit || 0"
                @login="openAuthDialog('login')"
                @register="openAuthDialog('register')"
              />
            </v-col>

            <v-col md="3">
              <exam-detail-sidebar-details
                :content-data="contentData"
                :is-logged-in="auth.isAuthenticated.value"
                :credit="user?.user.value?.credit || 0"
                :download-loading="download_loading"
                :is-downloading="isDownloading"
                :download-progress="downloadProgress"
                @download="startDownload"
                @login="openAuthDialog('login')"
                @copy-url="copyUrl"
                @crash-report="openCrashReportDialog"
              />
            </v-col>
          </v-row>
        </div>
      </v-container>
    </section>

    <exam-detail-mobile-order-section
      v-if="!pending"
      :exam-id="contentData.id"
      :exam-prices="contentData.price"
      :is-logged-in="auth.isAuthenticated.value"
      :credit="user?.user.value?.credit || 0"
      :user-exam-status="contentData.examUserData?.status || 0"
      :download-loading="download_loading"
      :is-downloading="isDownloading"
      :download-progress="downloadProgress"
      @download="startDownload"
      @login="openAuthDialog('login')"
      @register="openAuthDialog('register')"
    />

    <common-crash-report ref="crash_report" />

    <ClientOnly>
      <v-container
        class="py-0"
      >
        <common-related-portrait-content
          page-type="paper"
          page-name="Past Papers"
          source="exam"
          request="test"
        />
      </v-container>
    </ClientOnly>

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

    <!-- Coin Payment Modal -->
    <lazy-modals-coin-payment-modal
      v-if="showCoinPaymentModal"
      v-model:show-dialog="showCoinPaymentModal"
      :is-processing="isLoading"
      :user-balance="balance"
      :amount-to-pay="5"
      @close="showCoinPaymentModal = false"
    />

    <!-- Coin Consumption Animation -->
    <lazy-common-coin-consumption-animation
      v-model:is-visible="showCoinAnimation"
      @animation-complete="handleAnimationComplete"
    />

    <lazy-common-modal-base
      v-model:show-dialog="downloadIssue"
      :max-width="600"
      title="Download"
    >
      <lazy-common-modal-download-file
        :link="downloadIssueLink"
        @close="downloadIssue = false"
      />
    </lazy-common-modal-base>
  </div>
</template>

<script setup>
// Get api, router, and route
const route = useRoute()
const router = useRouter()
const auth = useAuth()
const user = useUser()
const { $toast } = useNuxtApp()
const { downloadFile } = useDownload()
const requestURL = ref(useRequestURL().host)
// Component data
const contentData = ref({})
const crash_report = ref(null)
const copy_btn = ref('Copy')
const download_loading = ref(false)

// Track download progress
const downloadProgress = ref(0)
const isDownloading = ref(false)

const breads = reactive([])

const galleryImages = ref([])
const galleryHelpData = ref({
  state: '',
  section: '',
  base: '',
  course: '',
  lesson: '',
})

const isAdsLoad = ref(false)

// Fetch the exam data
async function fetchExamData() {
  try {
    const { id } = route.params

    const response = await useApiService.get(`/api/v1/exams/${id}`)

    if (response.status === 1 && response.data) {
      return response.data
    }

    showError({
      statusCode: 404,
      statusMessage: 'Page Not Founded!',
    })
    return {}
  }
  catch (err) {
    console.error('API Error:', err)

    showError({
      statusCode: 404,
      statusMessage: 'Page Not Founded!',
    })
  }
}

// Use asyncData to fetch data
const { data, pending, _error } = await useAsyncData(
  `exam-${route.params.id}`,
  async () => {
    const data = await fetchExamData()
    return data
  },
)

watchEffect(async () => {
  if (data.value) {
    contentData.value = data.value
    await initBreadCrumb()
    await updateGalleryData()
  }
})

// Method to initialize breadcrumbs
async function initBreadCrumb() {
  if (!contentData.value) return

  breads.push({
    text: 'Online exam',
    disabled: false,
    href: '/search?type=quizhub',
  })

  if (contentData.value.section_title) {
    breads.push({
      text: contentData.value.section_title,
      disabled: false,
      href: `/search?type=quizhub&section=${contentData.value.section}`,
    })
  }

  if (contentData.value.base_title) {
    breads.push({
      text: contentData.value.base_title,
      disabled: false,
      href: `/search?type=quizhub&section=${contentData.value.section}&base=${contentData.value.base}`,
    })
  }

  if (contentData.value.lesson_title) {
    breads.push({
      text: contentData.value.lesson_title,
      disabled: false,
      href: `/search?type=quizhub&section=${contentData.value.section}&base=${contentData.value.base}&lesson=${contentData.value.lesson}`,
    })
  }
}

// Function to update gallery data
function updateGalleryData() {
  if (contentData.value?.thumb_pic_url) {
    galleryImages.value = [contentData.value.thumb_pic_url]
  }

  galleryHelpData.value = {
    state: contentData.value?.state || '',
    section: contentData.value?.section || '',
    base: contentData.value?.base || '',
    course: contentData.value?.course || '',
    lesson: contentData.value?.lesson || '',
  }
}

const ogImage = contentData.value?.thumb_pic_url
  ? contentData.value?.thumb_pic_url
  : null

useHead(() => ({
  title: contentData.value?.title || 'Exam Details',
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
      href: `https://${requestURL.value}/exam/${contentData.value?.id}/${contentData.value?.title_url}`,
    },
  ],
}))

// Methods
const openAuthDialog = (val) => {
  router.push({ query: { auth_form: val } })
}

const copyUrl = () => {
  navigator.clipboard.writeText(window.location.href)
  copy_btn.value = 'Copied'
}

const { balance, isLoading } = useCoinBalance()
const showCoinPaymentModal = ref(false)
const showCoinAnimation = ref(false)
const downloadIssue = ref(false)
const downloadIssueLink = ref('')

const startDownload = async (type) => {
  download_loading.value = true
  isDownloading.value = true
  downloadProgress.value = 0

  try {
    // Simulate progressive loading for API call
    const progressInterval = setInterval(() => {
      if (downloadProgress.value < 50) {
        downloadProgress.value += Math.random() * 15
      }
    }, 100)

    const response = await downloadFile({
      contentType: 'Exam',
      fileType: type,
      id: Number(route.params.id),
    })

    // Update progress to 60% after API response
    downloadProgress.value = 60
    clearInterval(progressInterval)

    if (response.succeeded && response.data) {
      if (response.data.url) {
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

            const blob = xhr.response
            const url = window.URL.createObjectURL(blob)

            const a = document.createElement('a')
            a.href = url
            a.download = response.data?.name || 'file.pdf'
            document.body.appendChild(a)
            a.click()

            a.remove()
            window.URL.revokeObjectURL(url)
            downloadIssueLink.value = response.data?.url || ''
            if (response.data?.spent) {
              showCoinAnimation.value = true
            }
            else {
              downloadIssue.value = true
            }

            setTimeout(() => {
              isDownloading.value = false
              downloadProgress.value = 0
            }, 1000)
          }
        }

        xhr.onerror = () => {
          isDownloading.value = false
          downloadProgress.value = 0
          $toast.error('Download failed. Please try again.')
        }

        xhr.send()
      }
      if (response.data.upgradeSuggestions && response.data.upgradeSuggestions.length > 0) {
        showCoinPaymentModal.value = true
      }
    }
    else {
      if (response.errors && response.errors.length > 0) {
        const messgage = response.errors[0].message
        if (messgage == 'InsufficientBalance') {
          showCoinPaymentModal.value = true
        }
      }
      isDownloading.value = false
      downloadProgress.value = 0
    }
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

const handleAnimationComplete = async () => {
  // Close everything immediately when animation completes
  showCoinAnimation.value = false
  downloadIssue.value = true
}

const openCrashReportDialog = () => {
  crash_report.value.dialog = true
  crash_report.value.form.type = 'test'
}
</script>

<script>
// Component metadata
export default {
  name: 'ExamDetails',
  auth: false,
}
</script>

<style>
p {
  font-size: 1.3rem !important;
}
</style>
