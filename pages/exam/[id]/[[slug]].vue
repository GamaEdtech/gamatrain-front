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
      @download="startDownload"
      @login="openAuthDialog('login')"
      @register="openAuthDialog('register')"
    />

    <common-crash-report ref="crash_report" />
  </div>
</template>

<script setup>
// Get api, router, and route
const route = useRoute()
const router = useRouter()
const auth = useAuth()
const user = useUser()
const { $toast } = useNuxtApp()
const requestURL = ref(useRequestURL().host)
// Component data
const contentData = ref({})
const crash_report = ref(null)
const copy_btn = ref('Copy')
const download_loading = ref(false)

const breads = reactive([])

const galleryImages = ref([])
const galleryHelpData = ref({
  state: '',
  section: '',
  base: '',
  course: '',
  lesson: '',
})

// Fetch the exam data
async function fetchExamData() {
  const { id } = route.params
  const response = await useApiService.get(`/api/v1/exams/${id}`)

  if (response.status === 1 && response.data) {
    return response.data
  }

  return response
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
    href: '/search?type=azmoon',
  })

  if (contentData.value.section_title) {
    breads.push({
      text: contentData.value.section_title,
      disabled: false,
      href: `/search?type=azmoon&section=${contentData.value.section}`,
    })
  }

  if (contentData.value.base_title) {
    breads.push({
      text: contentData.value.base_title,
      disabled: false,
      href: `/search?type=azmoon&section=${contentData.value.section}&base=${contentData.value.base}`,
    })
  }

  if (contentData.value.lesson_title) {
    breads.push({
      text: contentData.value.lesson_title,
      disabled: false,
      href: `/search?type=azmoon&section=${contentData.value.section}&base=${contentData.value.base}&lesson=${contentData.value.lesson}`,
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

useHead(() => ({
  title: contentData.value?.title || 'Exam Details',
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

const startDownload = async () => {
  download_loading.value = true
  try {
    const response = await useApiService.get(
      `/api/v1/exams/download/${route.params.id}`,
    )
    const FileSaver = await import('file-saver')
    FileSaver.saveAs(response.data.url, response.data.name)
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
