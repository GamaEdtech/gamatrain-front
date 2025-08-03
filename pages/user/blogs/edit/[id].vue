<template>
  <div class="blog-edit-page">
    <v-form
      ref="form"
      @submit.prevent="validate"
    >
      <div class="d-flex flex-wrap flex-mobile">
        <v-row>
          <v-col
            cols="12"
            md="7"
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
                  <ClientOnly>
                    <rich-editor-content
                      v-model="blog.content"
                      :rules="contentRules"
                      required
                    />
                  </ClientOnly>
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
            md="5"
          >
            <!-- Right side - Publishing Options -->
            <div class="publishing-options mobile-full">
              <v-card
                class="mb-4 options-card mobile-full"
                color="#F9FAFB"
                flat
              >
                <div
                  class="d-flex justify-space-between align-center pa-4 mobile-stack"
                >
                  <v-btn
                    color="#FFC107"
                    class="px-6 mobile-full d-none d-md-block flex-grow-1 mr-6"
                    rounded
                    :loading="loading"
                    :disabled="!isFormValid"
                    @click="validate"
                  >
                    Update
                  </v-btn>

                  <v-btn
                    icon
                    color="#344054"
                    size="small"
                    variant="text"
                    class="mobile-mb-2"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </div>
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
                        hide-details
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
                      placeholder="Search or add category"
                      hide-details
                      variant="outlined"
                      rounded
                      density="compact"
                      @keydown.enter.prevent="createCategory"
                    >
                      <template #append-inner>
                        <v-btn
                          class="input-enter-button"
                          size="small"
                          icon
                          variant="flat"
                          color="#FFB600"
                          :loading="categoryLoader"
                          @click.prevent="createCategory"
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
                  <div class="category-options-list">
                    <template v-if="categoriesLoading">
                      <v-skeleton-loader type="list-item-two-line" />
                    </template>
                    <template v-else>
                      <v-checkbox
                        v-for="cat in filteredCategories"
                        :key="cat.id"
                        v-model="blog.categories"
                        :label="cat.name"
                        :value="cat.id"
                        hide-details
                        class="category-checkbox"
                        dense
                      />
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
                      class="keyword-item mr-1 mb-2"
                    >
                      <div class="keyword-item__title">
                        {{ kitem }}
                      </div>
                      <div
                        class="keyword-item__icon cursor-pointer"
                        @click="deleteKeyword(kitem, index)"
                      >
                        <v-icon
                          small
                          color="#98A2B3"
                        >
                          mdi-close-circle
                        </v-icon>
                      </div>
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
            </div>
          </v-col>
        </v-row>
      </div>
    </v-form>

    <BlogSlugDialog
      v-model="slugDialog"
      :slug="slug"
      @save="onSlugSave"
      @close="closeDialog"
    />
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import BlogSlugDialog from '@/components/admin/blogs/BlogSlugDialog.vue'
import RichEditorContent from '@/components/common/RichEditor.vue'

const { $slugGenerator, $toast } = useNuxtApp()
const router = useRouter()
const route = useRoute()

definePageMeta({
  layout: 'dashboard-layout',
  middleware: ['auth', 'user-type'],
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
})
const slug = ref('')
const imagePreview = ref(null)
const menu = ref(false)
const categoryList = ref([])
const categoriesLoading = ref(true)
const categorySearch = ref('')
const keywordSearch = ref('')
let _slugDebounce = null

// Validation rules
const titleRules = [
  v => !!v || 'Title is required',
  v => (v && v.length >= 3) || 'Title must be at least 3 characters',
]

const contentRules = [
  v => !!v || 'Content is required',
  v => (v && v.trim() !== '' && v !== '<p></p>') || 'Content cannot be empty',
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
      `/api/v2/blogs/posts/${route.params.id}`,
    )
    if (response && response.succeeded) {
      const blogData = response.data
      blog.value = {
        title: blogData.title,
        content: blogData.body,
        summary: blogData.summary,
        status: blogData.status,
        visibility: blogData.visibilityType,
        publishTime: blogData.scheduledDate ? 'Schedule' : 'Immediately',
        categories: blogData.tags?.map(k => k.id) || [],
        scheduledDate: blogData.scheduledDate,
      }
      slug.value = blogData.slug

      if (blogData.imageUri) {
        imagePreview.value = blogData.imageUri
        imageValidation.value = 'valid'
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
      $toast.error('Failed to fetch blog data')
      router.push('/user/blogs')
    }
  }
  catch (error) {
    console.error('Error fetching blog:', error)
    $toast.error('Failed to fetch blog data')
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

function _reset() {
  form.value.reset()
  isFormValid.value = false
}

function _resetValidation() {
  form.value.resetValidation()
  isFormValid.value = false
}

const onSubmit = async () => {
  try {
    loading.value = true
    const formData = new FormData()

    // Add text fields
    formData.append('Title', blog.value.title)
    formData.append('Body', blog.value.content)
    formData.append('Summary', blog.value.summary || '')
    formData.append('VisibilityType', blog.value.visibility.toLowerCase())

    let publishDate
    if (blog.value.publishTime === 'Immediately') {
      publishDate = new Date().toISOString()
    }
    else if (
      blog.value.publishTime === 'Schedule'
      && blog.value.scheduledDate
    ) {
      const date = new Date(blog.value.scheduledDate)
      publishDate = date.toISOString()
    }

    formData.append('PublishDate', publishDate)
    formData.append('Slug', slug.value)

    // Add categories
    blog.value.categories.forEach((categoryId) => {
      formData.append('Tags[]', categoryId)
    })

    // Add keywords
    if (keywords.value.length >= 1) {
      formData.append('Keywords', keywords.value.join(','))
    }

    // Add image if exists
    if (blog.value.image) {
      formData.append('image', blog.value.image)
    }

    const response = await useApiService.put(
      `/api/v2/blogs/contributions/${route.params.id}`,
      formData,
    )

    if (response && response.succeeded) {
      $toast.success('Blog post updated successfully!')
      router.push('/user/blogs')
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
const triggerImageUpload = () => {
  imageInput.value.click()
}

const onImageSelected = (event) => {
  const file = event.target.files[0]
  if (file) {
    blog.value.image = file
    imagePreview.value = URL.createObjectURL(file)
    imageValidation.value = 'valid'
  }
}

const deleteImage = () => {
  blog.value.image = null
  imagePreview.value = null
  imageInput.value.value = ''
  imageValidation.value = ''
}

// Category handling
const createCategory = async () => {
  const name = categorySearch.value && categorySearch.value.trim()
  if (!name) {
    $toast.error('Please enter a category name.')
    return
  }
  try {
    categoryLoader.value = true
    const response = await useApiService.post('/api/v2/admin/tags', {
      name,
      icon: 'shape-outline',
      tagType: 'Post',
    })
    if (response && response.succeeded) {
      $toast.success('Category created successfully!')
      categorySearch.value = ''
      await fetchCategories()
    }
    else {
      $toast.error(
        response?.errors?.[0]?.message || 'Failed to create category.',
      )
    }
  }
  catch {
    $toast.error('Failed to create category.')
  }
  finally {
    categoryLoader.value = false
  }
}

const fetchCategories = async () => {
  try {
    categoriesLoading.value = true
    const response = await useApiService.get('/api/v2/tags/Post')
    if (response && response.succeeded) {
      categoryList.value = response.data
    }
  }
  catch {
    $toast.error('Failed to load categories')
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

const deleteKeyword = async (row, index) => {
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
      slug.value = $slugGenerator.convert(blog.value.title || '')
      return slug.value
    }
  }
  catch {
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
  [() => blog.value.title, () => blog.value.content],
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
.keyword-item {
  background: #1d2939;
  color: #fcfcfd;
  font-size: 12px;
  font-weight: 400;
  width: 73px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px;
  padding: 11px 9px;
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
  .preview-image {
    height: 90px !important;
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

.editor-container :deep(.ck-editor__editable) {
  min-height: 250px !important;
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
.category-checkbox {
  padding-left: 16px;
  margin-bottom: 2px !important;
}

.category-checkbox :deep(.v-selection-control) {
  margin-bottom: 0;
  min-height: 32px;
}

.preview-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
}

.error-message {
  color: #e53935;
  font-size: 13px;
  margin-top: 9px;
}
</style>
