<template>
  <v-container
    v-if="contentData"
    class="d-flex flex-column mt-16"
  >
    <lazy-widgets-breadcrumb
      background-color="white"
      :breads="breads"
    />
    <div
      class="w-100 d-flex align-center ga-1"
    >
      <v-icon color="primary">
        md:chevron_backward
      </v-icon>
      <h1 class="text-h4 font-weight-bold">
        {{ contentData.title }}
      </h1>
      <v-icon color="primary">
        md:chevron_forward
      </v-icon>

      <v-btn
        v-if="contentData.owner"
        color="info"
        class="rounded-circle"
        size="24"
        flat
        variant="tonal"
        @click="openEditModal = true"
      >
        <v-icon size="16">
          md:edit
        </v-icon>
      </v-btn>
    </div>
    <div class="w-100 d-flex align-start justify-center justify-md-space-between mt-6 flex-wrap mb-4">
      <div class="w-100 w-md-33 d-flex justify-center">
        <lazy-multimedia-preview-card
          :id="contentData.id"
          :title="contentData.title"
          :views="contentData.views"
          :score="contentData.ref_score"
          :page-count="contentData.file_pages"
          :preview-data="contentData.previewData"
          @share="openShare = true"
        />
      </div>

      <div class="w-100 w-md-66 d-flex align-start flex-wrap mt-4 mt-md-0">
        <lazy-multimedia-content-detail :content-data="contentData" />

        <lazy-multimedia-download-button
          :id="contentData.id"
          :files="contentData.files"
          :title="contentData.title"
          :title-url="contentData.title_url"
        />
      </div>
    </div>

    <lazy-common-box-random-question
      :lesson="contentData.lesson"
    />

    <lazy-common-related-content
      :id="contentData.id"
      source="file"
      :request="[`test`, `file`, `exam`, `question`, `tutorial`]"
    />

    <span
      class="d-flex align-center ga-1 text-h5 cursor-pointer text-lightError mt-4"
      @click="openCrashReport = true"
    >
      <v-icon
        color="lightError"
        class="mb-1"
      >md:warning_outlined</v-icon>
      Crash report
    </span>

    <lazy-common-modal-base
      v-model:show-dialog="openCrashReport"
      title="Crash Report"
    >
      <lazy-common-modal-crash-report
        :id="contentData.id"
        type-crash-report="test"
        @close="openCrashReport = false"
      />
    </lazy-common-modal-base>

    <lazy-common-modal-base
      v-model:show-dialog="openShare"
      title="Share"
    >
      <lazy-common-modal-share :title="contentData.title" />
    </lazy-common-modal-base>

    <lazy-common-modal-base
      v-if="openEditModal"
      v-model:show-dialog="openEditModal"
      title="Edit"
    >
      <lazy-multimedia-modal-edit
        :id="contentData.id"
        :title="contentData.title"
        :description="contentData.description"
        @close="openEditModal = false"
        @success="editSuccessfully"
      />
    </lazy-common-modal-base>
  </v-container>
</template>

<script setup lang="ts">
interface BreadCrumb {
  text: string
  disabled: boolean
  href: string
}

const route = useRoute()
const { getItemById } = useMultimedia()

const breads = ref<BreadCrumb[]>([])
const openShare = ref(false)
const openCrashReport = ref(false)
const openEditModal = ref(false)

const { data: contentData } = await useAsyncData(
  `multimedia-${route.params.id}`,
  async () => {
    try {
      const response = await getItemById(route.params.id as string)
      return response.status == 1 && response.data ? response.data : null
    }
    catch {
      return null
    }
  },
)

// showError inside the handler only lands in useAsyncData's error, so SSR answered 200 with an empty page.
// Throwing from setup makes Nuxt render the error page with a real 404.
if (!contentData.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found',
    fatal: true,
  })
}

const { url: canonicalUrl } = await useCanonicalContentPath('multimedia', contentData.value.id, contentData.value.title_url)

const initBreadCrumb = () => {
  if (!contentData.value) return
  breads.value = []
  breads.value.push({
    text: 'Multimedia',
    disabled: false,
    href: '/search?type=multimedia',
  })
  if (contentData.value.section_title) {
    breads.value.push(
      {
        text: contentData.value.section_title,
        disabled: false,
        href: `/search?type=multimedia&section=${contentData.value.section}`,
      })
  }
  if (contentData.value.base_title) {
    breads.value.push(
      {
        text: contentData.value.base_title,
        disabled: false,
        href: `/search?type=multimedia&section=${contentData.value.section}&base=${contentData.value.base}`,
      })
  }
  if (contentData.value.lesson_title) {
    breads.value.push(

      {
        text: contentData.value.lesson_title,
        disabled: false,
        href: `/search?type=multimedia&section=${contentData.value.section}&base=${contentData.value.base}&lesson=${contentData.value.lesson}`,
      },
    )
  }
}

if (contentData.value) {
  initBreadCrumb()
}

const ogImage
  = contentData.value?.previewData
    && contentData.value?.previewData.preview
    && contentData.value?.previewData.preview.length > 0
    ? contentData.value?.previewData.preview[0]
    : null

const { buildSchema } = useSeoSchema()

// Most multimedia items are documents (PDF, Word, slides) rather than videos, so a LearningResource
// describes them; breadcrumbs are what Google shows in results.
const schema = computed(() => {
  const item = contentData.value
  if (!item) return null
  const author = [item.first_name, item.last_name].filter(Boolean).join(' ')
  return buildSchema({
    dto: item,
    url: canonicalUrl,
    title: item.title,
    description: item.description || item.title,
    breadcrumbs: breads.value,
    types: ['webpage', 'learning', 'breadcrumb'],
    learning: {
      learningResourceType: item.content_type_title || item.type_title || 'Learning material',
      teaches: item.lesson_title?.trim() || undefined,
      educationalLevel: item.base_title?.trim() || undefined,
      image: ogImage || item.lesson_pic || undefined,
      ...(author && { author: { '@type': 'Person', 'name': author } }),
    },
  })
})

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
  script: schema.value
    ? [{ key: 'json-ld-schema', type: 'application/ld+json', innerHTML: JSON.stringify(schema.value) }]
    : [],
  link: [
    {
      rel: 'canonical',
      href: canonicalUrl,
    },
  ],
}))

const editSuccessfully = (data: {
  title: string
  description: string
}) => {
  if (contentData.value) {
    contentData.value = {
      ...contentData.value,
      title: data.title,
      description: data.description,
    }
  }
}
</script>

<style scoped>
</style>
