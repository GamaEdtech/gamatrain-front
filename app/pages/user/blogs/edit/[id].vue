<template>
  <div class="blog-edit-page">
    <v-form
      ref="form"
      @submit.prevent="validate"
    >
      <div class="d-flex flex-wrap flex-mobile">
        <v-row class="w-100">
          <v-col
            cols="12"
            md="8"
          >
            <!-- Left side - Content Editor -->
            <div class="content-editor">
              <!-- Title input -->
              <div class="title-section mb-4">
                <label class="mb-2 d-block form-label-title">Title</label>
                <v-text-field
                  v-model="blog.title"
                  rounded
                  variant="outlined"
                  class="title-input"
                  :rules="titleRules"
                  required
                >
                  <template #append-inner>
                    <div
                      class="cursor-pointer"
                      @click="showSlugDialog"
                    >
                      <v-icon color="#2E90FA">
                        mdi-link
                      </v-icon>
                    </div>
                  </template>
                </v-text-field>
              </div>

              <div class="mt-10">
                <label class="mb-2 d-block form-label-title">Abstract</label>
                <v-textarea
                  v-model="blog.summary"
                  rounded
                  class="textarea-input"
                  variant="outlined"
                  placeholder="Enter here.............."
                />
              </div>

              <!-- Rich text editor -->
              <div class="editor-container">
                <label class="mb-2 d-block form-label-title">Main</label>
                <div class="w-100 overflow-hidden relative">
                  <common-rich-editor
                    v-model="blog.content"
                    :enable-extra-plugins="true"
                    :rules="contentRules"
                    required
                  />
                </div>
              </div>

              <!-- Bottom update button -->
              <div class="d-flex justify-start mt-6">
                <v-btn
                  color="#FFC107"
                  class="update-btn mobile-full"
                  height="50"
                  width="320"
                  rounded
                  :loading="loading"
                  :disabled="!isFormValid"
                  @click="validate"
                >
                  Update
                </v-btn>
              </div>
            </div>
          </v-col>

          <v-col
            cols="12"
            md="4"
          >
            <!-- Right side - Publishing Options -->
            <div class="publishing-options mobile-full">
              <v-card
                class="mb-4 options-card mobile-full"
                color="#F9FAFB"
                flat
              >
                <div
                  class="d-flex align-center justify-space-between mb-3 pa-4 mobile-stack"
                >
                  <div class="primary-gray-700 font-size-16">
                    State
                  </div>
                  <div class="card-select-item mobile-full">
                    <v-select
                      v-model="blog.status"
                      variant="outlined"
                      dense
                      rounded
                      density="compact"
                      hide-details
                      :items="['Drafted', 'Published', 'Archived']"
                      value="Drafted"
                      class="rounded-select mobile-full"
                    />
                  </div>
                </div>
                <div
                  class="d-flex align-center justify-space-between mb-3 pa-4 mobile-stack"
                >
                  <div class="primary-gray-700 font-size-16">
                    Visibility
                  </div>
                  <div class="card-select-item mobile-full">
                    <v-select
                      v-model="blog.visibility"
                      variant="outlined"
                      density="compact"
                      hide-details
                      rounded
                      :items="['General', 'Premium', 'Private']"
                      value="General"
                      class="rounded-select mobile-full"
                    />
                  </div>
                </div>
                <div
                  class="d-flex align-center justify-space-between mb-3 pa-4 mobile-stack"
                >
                  <div class="primary-gray-700 font-size-16">
                    Publish time
                  </div>
                  <div class="card-select-item mobile-full">
                    <v-select
                      v-model="blog.publishTime"
                      variant="outlined"
                      density="compact"
                      rounded
                      hide-details
                      :items="['Immediately', 'Schedule']"
                      class="rounded-select mobile-full"
                    />
                  </div>
                </div>
                <div
                  v-if="blog.publishTime === 'Schedule'"
                  class="px-4 pb-4"
                >
                  <v-menu
                    v-model="menu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    location="bottom"
                  >
                    <template #activator="{ props }">
                      <v-text-field
                        v-model="blog.scheduledDate"
                        label="Select date"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="props"
                        density="compact"
                        variant="outlined"
                        :rules="scheduledDateRules"
                        class="rounded-select mobile-full"
                      />
                    </template>
                    <v-date-picker
                      v-model="blog.scheduledDate"
                      @update:model-value="menu = false"
                    />
                  </v-menu>
                </div>
              </v-card>

              <v-card
                class="mb-4 options-card mobile-full category-card"
                color="#F9FAFB"
                flat
              >
                <v-card-title class="options-title pb-1 mt-3 primary-gray-700">
                  Category
                </v-card-title>
                <v-card-text class="pt- mt-3">
                  <div class="category-search-row">
                    <v-text-field
                      v-model="categorySearch"
                      class="category-search-input w-100"
                      placeholder="Search"
                      hide-details
                      variant="outlined"
                      rounded
                      density="compact"
                    />
                  </div>
                  <div class="category-options-list">
                    <template v-if="categoriesLoading">
                      <v-skeleton-loader type="list-item-two-line" />
                    </template>
                    <template v-else>
                      <v-checkbox
                        v-for="cat in filteredCategories"
                        :key="cat.id"
                        v-model="blog.categories"
                        :value="cat.id"
                        hide-details
                        color="primary"
                        false-icon="md:check_box_outline_blank"
                        true-icon="md:check_box"
                        dense
                        class="text-h5"
                      >
                        <template #label>
                          <span class="text-h5 font-weight-medium">{{
                            cat.name
                          }}</span>
                        </template>
                      </v-checkbox>
                    </template>
                  </div>
                </v-card-text>
              </v-card>

              <v-card
                class="mb-4 options-card mobile-full category-card"
                color="#F9FAFB"
                flat
              >
                <v-card-title class="options-title pb-1 mt-3 primary-gray-700">
                  keyword
                </v-card-title>
                <v-card-text class="pt- mt-3">
                  <div class="category-search-row">
                    <v-text-field
                      v-model="keywordSearch"
                      class="category-search-input w-100"
                      placeholder="Search or add category"
                      hide-details
                      variant="outlined"
                      rounded
                      density="compact"
                      @keydown.enter.prevent="createKeyword"
                    >
                      <template #append-inner>
                        <v-btn
                          class="input-enter-button"
                          size="small"
                          icon
                          variant="flat"
                          color="#FFB600"
                          :loading="categoryLoader"
                          @click.prevent="createKeyword"
                        >
                          <v-icon
                            size="small"
                            color="#1D2939"
                          >
                            mdi-subdirectory-arrow-left
                          </v-icon>
                        </v-btn>
                      </template>
                    </v-text-field>
                  </div>
                  <div class="search-hint-label mt-3 mb-7">
                    You can also use commas
                  </div>

                  <div class="d-flex flex-wrap align-center">
                    <div
                      v-for="(kitem, index) in keywords"
                      :key="index"
                      class="mr-1 mb-2"
                    >
                      <v-chip
                        closable
                        color="#01579B"
                        @click:close="deleteKeyword(kitem, index)"
                      >
                        {{ kitem }}
                      </v-chip>
                    </div>
                  </div>
                </v-card-text>
              </v-card>

              <v-card
                class="options-card mobile-full"
                color="#F9FAFB"
                flat
              >
                <v-card-title class="options-title pb-4 mt-3 primary-gray-700">
                  Index image
                </v-card-title>
                <v-card-text class="pt-0">
                  <div
                    v-if="imagePreview"
                    class="image-preview mb-2"
                  >
                    <img
                      :src="imagePreview"
                      alt="Index image"
                      class="preview-image"
                    >
                  </div>
                  <div class="d-flex justify-space-between mobile-stack">
                    <v-btn
                      color="white"
                      class="black--text px-6 mobile-full upload-btn"
                      rounded
                      variant="flat"
                      @click="triggerImageUpload"
                    >
                      {{ imagePreview ? "Change image" : "Upload image" }}
                    </v-btn>
                    <v-btn
                      icon
                      variant="text"
                      color="error"
                      :disabled="!imagePreview"
                      class="mobile-mb-2"
                      size="small"
                      @click="deleteImage"
                    >
                      <v-icon class="primary-gray-500">
                        mdi-delete
                      </v-icon>
                    </v-btn>
                    <input
                      ref="imageInput"
                      type="file"
                      accept="image/*"
                      style="display: none"
                      @change="onImageSelected"
                    >
                  </div>
                </v-card-text>
              </v-card>

              <v-card
                class="options-card mobile-full mb-4"
                color="#F9FAFB"
                flat
              >
                <v-card-title class="options-title pb-4 mt-3 primary-gray-700">
                  Podcast
                </v-card-title>
                <v-card-text class="pt-0">
                  <div
                    v-if="podcastPreview"
                    class="image-preview mb-2"
                  >
                    <audio
                      controls
                      :src="podcastPreview"
                    />
                  </div>
                  <div class="d-flex justify-space-between mobile-stack">
                    <v-btn
                      color="white"
                      class="black--text px-6 mobile-full upload-btn"
                      rounded
                      variant="flat"
                      @click="triggerPodcastUpload"
                    >
                      {{ podcastPreview ? "Change Podcast" : "Upload Podcast" }}
                    </v-btn>
                    <v-btn
                      icon
                      variant="text"
                      color="error"
                      :disabled="!podcastPreview"
                      class="mobile-mb-2"
                      size="large"
                      @click="deletePodcast"
                    >
                      <v-icon
                        size="large"
                        class="primary-gray-500"
                      >
                        mdi-delete
                      </v-icon>
                    </v-btn>
                    <input
                      ref="podcastInput"
                      type="file"
                      accept="audio/*"
                      style="display: none"
                      @change="onPoscastSelected"
                    >
                  </div>
                </v-card-text>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-form>
    <common-cropper-dialog
      v-model="showCropperDialog"
      :file-url="cropFileUrl"
      :stencil-props="{ width: 740, height: 555, resizable: false }"
      @cropped-data="croppedData"
    />

    <admin-blogs-slug-dialog
      v-model="slugDialog"
      :slug="slug"
      @save="onSlugSave"
      @close="closeDialog"
    />
  </div>
</template>

<script setup>
const { $slugGenerator, $toast } = useNuxtApp()
const router = useRouter()
const route = useRoute()

definePageMeta({
  layout: 'dashboard-layout',
  middleware: ['auth', 'user-type'],
})

useHead({
  title: 'Edit blog',
})

// Form refs
const form = ref(null)
const imageInput = ref(null)

// Form state
const categoryLoader = ref(false)
const slugDialog = ref(false)
const loading = ref(false)
const isFormValid = ref(false)
const keywords = ref([])
const imageValidation = ref('')
const blog = ref({
  title: '',
  content: '',
  summary: null,
  status: 'draft',
  visibility: 'General',
  publishTime: 'Immediately',
  categories: [],
  image: null,
  scheduledDate: null,
  podcast: null,
})
const slug = ref('')
const imagePreview = ref(null)
const menu = ref(false)
const categoryList = ref([])
const categoriesLoading = ref(true)
const categorySearch = ref('')
const keywordSearch = ref('')
let _slugDebounce = null

const podcastPreview = ref(null)
const podcastInput = ref()

const triggerPodcastUpload = () => {
  podcastInput.value.click()
}
const deletePodcast = () => {
  blog.value.podcast = null
  podcastPreview.value = null
  podcastInput.value.value = ''
}
const onPoscastSelected = (event) => {
  const file = event.target.files[0]
  blog.value.podcast = file
  podcastPreview.value = URL.createObjectURL(file)
}

// Validation rules
const titleRules = [
  v => !!v || 'Title is required',
  v => (v && v.length >= 3) || 'Title must be at least 3 characters',
]

const contentRules = [
  v => !!v || 'Content is required',
  v => (v && v.trim() !== '' && v !== '<p></p>') || 'Content cannot be empty',
]

const scheduledDateRules = [
  (v) => {
    if (blog.value.publishTime === 'Schedule') {
      if (!v) return 'Scheduled date is required when using Schedule option'
      const selectedDate = new Date(v)
      const now = new Date()
      if (selectedDate < now) return 'Scheduled date cannot be in the past'
    }
    return true
  },
]

// Remove category rules since they're not required
// const categoryRules = [
//   (v) => (v && v.length > 0) || "Select at least one category",
// ];

// Fetch existing blog data
const fetchBlogData = async () => {
  try {
    loading.value = true
    const response = await useApiService.get(
      `/api/v2/blogs/contributions/${route.params.id}`,
    )
    if (response && response.succeeded) {
      const blogData = response.data
      // Determine if this is a scheduled post by checking if publishDate is in the future
      const publishDate = blogData.publishDate
        ? new Date(blogData.publishDate)
        : null
      const isScheduled = publishDate && publishDate > new Date()

      blog.value = {
        title: blogData.title,
        content: blogData.body,
        summary: blogData.summary,
        status: blogData.status,
        visibility: blogData.visibilityType,
        publishTime: isScheduled ? 'Schedule' : 'Immediately',
        categories: blogData.tags,
        scheduledDate: isScheduled ? blogData.publishDate : null,
      }
      slug.value = blogData.slug

      if (blogData.imageUri) {
        imagePreview.value = blogData.imageUri
        imageValidation.value = 'valid'
      }

      if (blogData.podcastUri) {
        podcastPreview.value = blogData.podcastUri
      }
      // Split the keywords string into array

      keywords.value = blogData.keywords
        ? blogData.keywords.split(',').map(k => k.trim())
        : []

      // Trigger initial validation after loading data
      nextTick(async () => {
        if (form.value) {
          const { valid } = await form.value.validate()
          isFormValid.value = valid
        }
      })
    }
    else {
      $toast.error(
        response?.errors?.[0]?.message || 'Failed to fetch blog data',
      )
      router.push('/user/blogs')
    }
  }
  catch (error) {
    console.error('Error fetching blog:', error)
    $toast.error('Network error while fetching blog data. Please try again.')
    router.push('/user/blogs')
  }
  finally {
    loading.value = false
  }
}

// Form methods
async function validate() {
  const { valid } = await form.value.validate()
  isFormValid.value = valid

  if (valid) {
    onSubmit()
  }
}

const onSubmit = async () => {
  try {
    loading.value = true

    // Validate scheduled publishing
    if (blog.value.publishTime === 'Schedule' && !blog.value.scheduledDate) {
      $toast.error('Please select a scheduled date when using Schedule option')
      loading.value = false
      return
    }

    const formData = new FormData()

    // Add text fields
    formData.append('Title', blog.value.title)
    formData.append('Body', blog.value.content)
    formData.append('Summary', blog.value.summary || '')
    formData.append('VisibilityType', blog.value.visibility.toLowerCase())

    // Handle publish date logic
    let publishDate
    if (blog.value.publishTime === 'Immediately') {
      // Always send current timestamp for immediate publishing
      publishDate = new Date().toISOString()
    }
    else if (blog.value.publishTime === 'Schedule') {
      // Send the selected scheduled date, preserving the selected date without timezone issues
      const selectedDate = new Date(blog.value.scheduledDate)
      // Set time to noon to avoid timezone conversion issues
      selectedDate.setHours(12, 0, 0, 0)
      publishDate = selectedDate.toISOString()
    }

    formData.append('PublishDate', publishDate)
    formData.append('Slug', slug.value)

    // Add categories
    blog.value.categories.forEach((categoryId) => {
      if (!categoryId) return
      formData.append('Tags[]', categoryId)
    })

    if (blog.value.categories?.length < 1) {
      $toast.error('Please select at least one category.')
      return
    }

    // Add keywords
    if (keywords.value.length >= 1) {
      formData.append('Keywords', keywords.value.join(','))
    }

    // Add image if exists
    if (blog.value.image) {
      formData.append('image', blog.value.image)
    }

    formData.append('Podcast', blog.value.podcast)

    const response = await useApiService.put(
      `/api/v2/blogs/contributions/${route.params.id}`,
      formData,
    )

    if (response && response.succeeded) {
      $toast.success('Blog post updated successfully!')
      const fromPage = route.query.fromPage ? route.query.fromPage : '1'
      router.push(`/user/blogs?page=${fromPage}`)
    }
    else {
      $toast.error(
        response?.errors?.[0]?.message || 'Failed to update blog post.',
      )
    }
  }
  catch (error) {
    console.error('Error updating blog post:', error)
    $toast.error('Failed to update blog post. Please try again.')
  }
  finally {
    loading.value = false
  }
}

// Image handling functions
const showCropperDialog = ref(false)
const cropFileUrl = ref('')

const croppedData = (data) => {
  showCropperDialog.value = false
  const timestamp = new Date().getTime()
  const fileType = 'image/webp'
  const fileExt = 'webp'
  const filename = `image_${timestamp}.${fileExt}`
  const file = new File([data], filename, { type: fileType })

  blog.value.image = file
  imagePreview.value = URL.createObjectURL(file)
  imageValidation.value = 'valid' // Set validation when image is selected
}
const triggerImageUpload = () => {
  imageInput.value.click()
}

const onImageSelected = (event) => {
  const file = event.target.files[0]
  if (file) {
    cropFileUrl.value = URL.createObjectURL(file)
    showCropperDialog.value = true
  }
}

const deleteImage = () => {
  blog.value.image = null
  imagePreview.value = null
  cropFileUrl.value = ''
  imageInput.value.value = ''
  imageValidation.value = ''
}

const fetchCategories = async () => {
  try {
    categoriesLoading.value = true
    const response = await useApiService.get('/api/v2/tags/Post')

    if (response && response.succeeded) {
      categoryList.value = response.data
    }
    else {
      $toast.error(
        response?.errors?.[0]?.message || 'Failed to load categories',
      )
    }
  }
  catch (error) {
    console.error('Error fetching categories:', error)
    $toast.error('Network error while loading categories. Please try again.')
  }
  finally {
    categoriesLoading.value = false
  }
}

// Keyword handling
const createKeyword = async () => {
  if (!keywordSearch.value) return
  const newKeywords = keywordSearch.value
    .split(',')
    .map(k => k.trim())
    .filter(k => k.length > 0)
  keywords.value.push(...newKeywords)
  keywordSearch.value = ''
}

const deleteKeyword = async (kitem, index) => {
  keywords.value.splice(index, 1)
}

// Slug handling
const createSlug = async () => {
  if (!blog.value.title) {
    slug.value = ''
    return ''
  }
  try {
    const response = await useApiService.get('/api/v2/blogs/slugs/generate', {
      title: blog.value.title,
    })
    if (response && response.succeeded && response.data) {
      slug.value = response.data
      return response.data
    }
    else {
      // Fallback to local slug generation
      slug.value = $slugGenerator.convert(blog.value.title || '')
      return slug.value
    }
  }
  catch (error) {
    console.error('Error generating slug:', error)
    // Fallback to local slug generation
    slug.value = $slugGenerator.convert(blog.value.title || '')
    return slug.value
  }
}

const showSlugDialog = () => {
  slugDialog.value = true
}

const closeDialog = () => {
  slugDialog.value = false
}

const onSlugSave = (newSlug) => {
  slug.value = newSlug
  closeDialog()
}

// Computed
const filteredCategories = computed(() => {
  if (!categorySearch.value) return categoryList.value
  return categoryList.value.filter(cat =>
    cat.name.toLowerCase().includes(categorySearch.value.toLowerCase()),
  )
})

// Watch for title changes to generate slug
watch(
  () => blog.value.title,
  () => {
    if (_slugDebounce) clearTimeout(_slugDebounce)
    _slugDebounce = setTimeout(() => {
      createSlug()
    }, 500)
  },
)

// Watch for changes in required fields to validate form
watch(
  [
    () => blog.value.title,
    () => blog.value.content,
    () => blog.value.publishTime,
    () => blog.value.scheduledDate,
  ],
  async () => {
    if (form.value) {
      const { valid } = await form.value.validate()
      isFormValid.value = valid
    }
  },
  { deep: true },
)

// Watch for changes tags(catergories) to validate form
watch(
  () => blog.value.categories,
  async () => {
    if (form.value) {
      const { valid } = await form.value.validate()
      isFormValid.value = valid
    }
  },
  { deep: true },
)

// Lifecycle
onMounted(() => {
  fetchCategories()
  fetchBlogData()
})
</script>

<style scoped>
.upload-btn {
  border: 1px solid #e4e7ec !important;
}

.search-hint-label {
  color: #98a2b3;
  font-size: 14px;
  font-weight: 400;
}
.input-enter-button {
  width: 30px;
  height: 30px;
}
.form-label-title {
  color: #344054;
  font-size: 20px;
  font-weight: 600;
}
.textarea-input {
  border-radius: 16px !important;
}
@media (max-width: 900px) {
  .blog-edit-page {
    padding: 8px;
  }
  .d-flex.flex-wrap.flex-mobile {
    flex-direction: column !important;
    gap: 0;
  }

  .ml-4 {
    margin-left: 0 !important;
  }
  .mobile-full {
    width: 100% !important;
    min-width: 0 !important;
    max-width: 100% !important;
    box-sizing: border-box;
  }
  .mobile-stack {
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 8px;
  }
  .mobile-mb-2 {
    margin-bottom: 12px !important;
  }
}

.card-select-item {
  width: 150px;
}
.blog-edit-page {
  padding: 20px;
}

.title-input {
  font-size: 18px;
  border-radius: 16px !important;
}

.editor-container {
  margin-bottom: 20px;
}

.editor-container :deep(.ck-source-editing-area) {
  min-height: 750px !important;
}
.editor-container :deep(.ck-editor__editable) {
  min-height: 750px !important;
  max-height: 750px !important;
}
.editor-container :deep(.ck-source-editing-area) {
  min-height: 750px !important;
}
.editor-container :deep(.ck-source-editing-area textarea) {
  max-height: 750px !important;
  height: 750px;
  overflow: scroll; /* hide scrollbars */
}

.editor-container :deep(.ck-toolbar) {
  border-radius: 8px 8px 0 0;
}

.editor-container :deep(.ck-content) {
  border-radius: 0 0 8px 8px;
}

.editor-toolbar {
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  padding: 6px 16px;
}

.editor-menu-item {
  font-size: 14px;
  margin-right: 16px;
  cursor: pointer;
}

.toolbar-buttons {
  border-bottom: 1px solid #e0e0e0;
  background-color: #f9f9f9;
}

.heading-toolbar {
  border-bottom: 1px solid #e0e0e0;
  background-color: #f9f9f9;
}

.heading-select,
.style-select {
  max-width: 150px;
}

.editor-content {
  min-height: 400px;
  background-color: #ffffff;
}

.editor-placeholder {
  color: #9e9e9e;
}

.update-btn {
  text-transform: none;
  font-weight: 500;
  font-size: 16px;
}

.options-card {
  border-radius: 16px;
  overflow: hidden;
}

.rounded-select >>> .v-input__slot {
  border-radius: 20px !important;
  background-color: white !important;
}

.options-title {
  font-size: 16px !important;
  font-weight: 500 !important;
  color: #344054;
}

.category-search-row {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
.category-search-input {
  min-width: 100%;
  flex: 1;
  border-radius: 24px !important;
  background: #fff !important;
  margin-right: 8px;
}
.category-search-btn {
  border-radius: 50% !important;
  min-width: 44px !important;
  width: 44px !important;
  height: 44px !important;
  box-shadow: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
.category-options-list {
  background: #fff;
  border-radius: 16px;
  padding: 16px 0;
  max-height: 180px;
  overflow-y: auto;
  margin-bottom: 8px;
}

.preview-image {
  width: 100%;
  height: 100%;
  max-height: 550px;
  object-fit: cover;
  border-radius: 4px;
}

.error-message {
  color: #e53935;
  font-size: 13px;
  margin-top: 9px;
}
</style>
