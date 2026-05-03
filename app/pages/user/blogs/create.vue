<template>
  <div class="w-100 d-flex flex-column">
    <v-row>
      <v-col
        cols="12"
        md="8"
        class="d-flex flex-column ga-1"
      >
        <div class="w-100 d-flex flex-column align-start justify-start ga-1">
          <div class="text-h4 font-weight-bold text-grey700 ml-2">
            <v-badge
              floating
              location="top right"
              color="transparent"
              overlap
            >
              <template #badge>
                <v-icon
                  size="large"
                  color="error"
                >
                  md:star
                </v-icon>
              </template>
              <span>Title</span>
            </v-badge>
          </div>
          <v-text-field
            v-model="blog.title"
            :rules="titleRules"
            rounded="lg"
            density="default"
            placeholder="Title"
            variant="outlined"
            autocomplete="off"
            persistent-clear
            base-color="grey200"
            color="primary"
            active-color="primary"
            bg-color="white"
            class="w-100"
          >
            <template #append-inner>
              <v-icon
                color="info"
                size="28"
                class="cursor-pointer"
                @click="showSlugModal = true"
              >
                md:link
              </v-icon>
            </template>
          </v-text-field>
        </div>
        <div class="w-100 d-flex flex-column align-start justify-start ga-1">
          <div class="text-h4 font-weight-bold text-grey700 ml-2">
            <v-badge
              floating
              location="top right"
              color="transparent"
              overlap
            >
              <template #badge>
                <v-icon
                  size="large"
                  color="error"
                >
                  md:star
                </v-icon>
              </template>
              <span>Abstract</span>
            </v-badge>
          </div>
          <v-textarea
            v-model="blog.summary"
            :rules="summaryRules"
            rounded="lg"
            density="default"
            placeholder="Enter Here..."
            variant="outlined"
            autocomplete="off"
            persistent-clear
            base-color="grey200"
            color="primary"
            active-color="primary"
            bg-color="white"
            class="w-100"
            no-resize
            rows="10"
          />
        </div>

        <div class="w-100 d-flex flex-column align-start justify-start ga-1">
          <div class="text-h4 font-weight-bold text-grey700 ml-2">
            <v-badge
              floating
              location="top right"
              color="transparent"
              overlap
            >
              <template #badge>
                <v-icon
                  size="large"
                  color="error"
                >
                  md:star
                </v-icon>
              </template>
              <span>Main</span>
            </v-badge>
          </div>
          <common-rich-editor
            v-model="blog.content"
            mode="full"
            :rules="contentRules"
          />
        </div>
      </v-col>
      <v-col
        cols="12"
        md="4"
        class="d-flex flex-column ga-3"
      >
        <div class="extra-data-div bg-grey50 rounded-lg pa-4 d-flex flex-column align-center justify-center ga-3">
          <div
            class="w-100
            d-flex
            align-center
            justify-space-between ga-1"
          >
            <span class="w-50 text-h5 font-weight-medium text-grey700 mt-1">
              State
            </span>
            <common-gombo-box
              v-model="blog.status"
              label=""
              :items="statusItems.map((item) => ({
                id: item,
                title: item,
              }))"
              rounded="xl"
              density="compact"
              base-color="grey200"
              color="primary"
              :defalut-lable="false"
              :clearable="false"
            />
          </div>

          <div
            class="w-100
            d-flex
            align-center
            justify-space-between ga-1"
          >
            <span class="w-50 text-h5 font-weight-medium text-grey700 mt-1">
              Visibility
            </span>
            <common-gombo-box
              v-model="blog.visibility"
              label=""
              :items="visibilityItems.map((item) => ({
                id: item,
                title: item,
              }))"
              rounded="xl"
              density="compact"
              base-color="grey200"
              color="primary"
              :defalut-lable="false"
              :clearable="false"
            />
          </div>

          <div
            class="w-100
            d-flex
            align-center
            justify-space-between ga-1"
          >
            <span class="w-50 text-h5 font-weight-medium text-grey700 mt-1">
              Publish time
            </span>
            <common-gombo-box
              v-model="blog.publishTime"
              label=""
              :items="publishTimeItems.map((item) => ({
                id: item,
                title: item,
              }))"
              rounded="xl"
              density="compact"
              base-color="grey200"
              color="primary"
              :defalut-lable="false"
              :clearable="false"
            />
          </div>

          <div
            v-if="blog.publishTime == 'Schedule'"
            class="w-100
            d-flex
            align-start
            justify-space-between ga-1"
          >
            <span class="w-50 text-h5 font-weight-medium text-grey700 mt-2">
              <v-badge
                floating
                location="top right"
                color="transparent"
                overlap
              >
                <template #badge>
                  <v-icon
                    size="large"
                    color="error"
                  >
                    md:star
                  </v-icon>
                </template>
                <span>Select Date</span>
              </v-badge>
            </span>
            <v-menu
              v-model="publishDateMenuOpen"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
            >
              <template #activator="{ props }">
                <v-text-field
                  v-model="blog.scheduledDate"
                  :rules="dateRules"
                  readonly
                  v-bind="props"
                  clearable
                  rounded="xl"
                  placeholder="Select Date"
                  density="compact"
                  variant="outlined"
                  autocomplete="off"
                  persistent-clear
                  base-color="grey200"
                  color="primary"
                  active-color="primary"
                  bg-color="white"
                  class="w-100"
                />
              </template>
              <v-date-picker
                v-model="blog.scheduledDate"
                color="primary"
                @update:model-value="() => (publishDateMenuOpen = false)"
              />
            </v-menu>
          </div>
        </div>

        <div class="bg-grey50 rounded-lg pa-4 d-flex align-center justify-center">
          <user-blogs-tag-list
            v-model:categories="blog.categories"
            :rules="categoryRules"
          />
        </div>

        <div class="bg-grey50 rounded-lg pa-4 d-flex align-center justify-center">
          <user-blogs-keyword-list v-model:keywords="blog.keywords" />
        </div>

        <div class="bg-grey50 rounded-lg pa-4 d-flex align-center justify-center">
          <user-blogs-image-selector
            v-model:image="blog.image"
            :rules="imageRules"
          />
        </div>

        <div class="bg-grey50 rounded-lg pa-4 d-flex align-center justify-center">
          <user-blogs-podcast-selector v-model:podcast="blog.podcast" />
        </div>
      </v-col>

      <user-blogs-translation-form
        v-for="(item, index) in translations"
        :key="index"
        v-model="translations[index]!"
        :languages="languages"
        :loading-languages="loadingGetLanguages"
        @delete="removeTranslation(index)"
      />

      <v-col
        cols="12"
        class="d-flex justify-center align-center ga-2 mt-4"
      >
        <v-btn
          color="primary"
          rounded="pill"
          variant="flat"
          class="text-grey900 font-weight-medium text-h5"
          width="150"
          :loading="loadingCreateBlog"
          @click="publish"
        >
          Publish
        </v-btn>
        <v-btn
          color="primary"
          rounded="pill"
          flat
          variant="outlined"
          class="text-grey900 font-weight-medium text-h5"
          width="150"
          :loading="loadingGetLanguages"
          @click="AddAnotherLanguage"
        >
          Add Language
        </v-btn>
      </v-col>

      <user-blogs-modals-slug
        v-model:show-dialog="showSlugModal"
        @save-slug-successfull="slugSave"
      />
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { TranslationDTO } from '~/types/api'

definePageMeta({
  layout: 'dashboard-layout',
  middleware: ['auth', 'user-type'],
})

useHead({
  title: 'Create blog',
})

const router = useRouter()
const { $toast, $slugGenerator } = useNuxtApp()
const { createBlug, loadingCreateBlog } = useBlog()
const { data: languages, loadingGetData: loadingGetLanguages, getData: getLanguages } = useLanguage()

const blog = ref({
  title: '',
  content: '',
  summary: '',
  slug: '',
  status: 'Drafted',
  visibility: 'General',
  publishTime: 'Immediately',
  categories: [],
  keywords: [],
  image: null,
  scheduledDate: null,
  podcast: null,
})
const publishDateMenuOpen = ref(false)
const showSlugModal = ref(false)
const translations = ref<TranslationDTO[]>([])

const statusItems = ['Drafted', 'Published']
const visibilityItems = ['General', 'Premium', 'Private']
const publishTimeItems = ['Immediately', 'Schedule']

const slugSave = (slug: string) => {
  blog.value.slug = slug
}

const titleRules = [
  (v: string) => !!v || 'Title is required',
  (v: string) => v?.trim() !== '' || 'Title cannot be empty',
]
const summaryRules = [
  (v: string) => !!v || 'Summary is required',
  (v: string) => v?.trim() !== '' || 'Summary cannot be empty',
]
const contentRules = [
  (v: string) => !!v || 'Content is required',
  (v: string) => (v && v !== '<p></p>') || 'Content cannot be empty',
]
const dateRules = [
  () =>
    blog.value.publishTime !== 'Schedule'
    || !!blog.value.scheduledDate
    || 'Scheduled date is required',
]
const categoryRules = [
  (v: number[]) => v.length > 0 || 'At least one category is required',
]
const imageRules = [
  (v: string | null | File) => !!v || 'Image is required',
]

const isValid = () => {
  if (!blog.value.title.trim()) return false

  if (!blog.value.summary.trim()) return false

  if (!blog.value.content || blog.value.content === '<p></p>') return false

  if (!blog.value.image) return false

  if (!blog.value.categories.length) return false

  if (
    blog.value.publishTime === 'Schedule'
    && !blog.value.scheduledDate
  ) {
    return false
  }

  for (const t of translations.value) {
    if (!t.title?.trim()) return false
    if (!t.summary?.trim()) return false
    if (!t.content || t.content === '<p></p>') return false
    if (!t.languageId) return false
  }

  return true
}

const mapToCreateBlogDTO = () => {
  return {
    title: blog.value.title,
    slug: blog.value.slug ? blog.value.slug : $slugGenerator(blog.value.title),
    summary: blog.value.summary,
    body: blog.value.content,
    image: blog.value.image!,
    podcast: blog.value.podcast || undefined,
    visibilityType: blog.value.visibility,
    publishDate: blog.value.publishTime,
    scheduledDate: blog.value.scheduledDate || undefined,
    keywords: blog.value.keywords,
    tags: blog.value.categories,
    draft: blog.value.status === 'Drafted' ? 'true' : 'false',

    localizedValues: translations.value.map(t => ({
      languageId: Number(t.languageId),
      title: t.title,
      summary: t.summary,
      body: t.content,
    })),
  }
}
const publish = async () => {
  if (!isValid()) {
    $toast.error('Please fill all required fields')
    return
  }
  const payload = mapToCreateBlogDTO()
  const response = await createBlug(payload)
  if (response && response.succeeded) {
    router.push('/user/blogs')
  }
}

const AddAnotherLanguage = async () => {
  if (languages.value.length == 0) {
    await getLanguages()
  }

  translations.value.push({
    languageId: '',
    title: '',
    summary: '',
    content: '',
  })
}
const removeTranslation = (index: number) => {
  translations.value.splice(index, 1)
  $toast.success('Translation Remove Successfully')
}
</script>

<style scoped>

</style>
