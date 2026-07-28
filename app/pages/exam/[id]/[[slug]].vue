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
    </div>
    <!-- <div class="w-100 d-flex align-start justify-center justify-md-space-between mt-6 flex-wrap mb-4">
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
          :title-url="contentData.title"
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

    <lazy-common-modal-base
      v-model:show-dialog="openShare"
      title="Share"
    >
      <lazy-common-modal-share :title="contentData.title" />
    </lazy-common-modal-base> -->
  </v-container>
</template>

<script setup lang="ts">
import type { AppError } from '@/types'

interface BreadCrumb {
  text: string
  disabled: boolean
  href: string
}

const route = useRoute()
const router = useRouter()
const { getItemById } = useExam()

// const requestURL = ref(useRequestURL().host)
const breads = ref<BreadCrumb[]>([])
// const openShare = ref(false)

const { data: contentData } = await useAsyncData(
  `exam-${route.params.id}`,
  async () => {
    try {
      const response = await getItemById(route.params.id as string)

      if (response.status == 1 && response.data) {
        return response.data
      }
      else {
        showError({
          statusCode: 404,
          statusMessage: 'Page Not Founded!',
        })
        return null
      }
    }
    catch (e: unknown) {
      showError({
        statusCode: 404,
        statusMessage: 'Page Not Founded!',
      })
      const error = e as AppError
      if (error?.status === 404) {
        router.push('/search?type=paper')
      }
      throw error
    }
  },
)

const initBreadCrumb = () => {
  if (!contentData.value) return
  breads.value = []
  breads.value.push({
    text: 'Exam',
    disabled: false,
    href: '/search?type=quizhub',
  })
  breads.value.push(
    {
      text: contentData.value.section_title,
      disabled: false,
      href: `/search?type=quizhub&section=${contentData.value.section}`,
    },
    {
      text: contentData.value.base_title,
      disabled: false,
      href: `/search?type=quizhub&section=${contentData.value.section}&base=${contentData.value.base}`,
    },
    {
      text: contentData.value.lesson_title,
      disabled: false,
      href: `/search?type=quizhub&section=${contentData.value.section}&base=${contentData.value.base}&lesson=${contentData.value.lesson}`,
    },
  )
}

if (contentData.value) {
  initBreadCrumb()
}

// const ogImage
//   = contentData.value?.previewData
//     && contentData.value?.previewData.preview
//     && contentData.value?.previewData.preview.length > 0
//     ? contentData.value?.previewData.preview[0]
//     : null
// useHead(() => ({
//   title: contentData.value?.title || 'Multimedia Details',
//   meta: [
//     {
//       hid: 'apple-mobile-web-app-title',
//       name: 'apple-mobile-web-app-title',
//       content: contentData.value?.title,
//     },
//     {
//       hid: 'og:title',
//       name: 'og:title',
//       content: contentData.value?.title,
//     },
//     {
//       hid: 'og:site_name',
//       name: 'og:site_name',
//       content: 'GamaTrain',
//     },
//     {
//       hid: 'description',
//       name: 'description',
//       content: contentData.value?.description,
//     },
//     {
//       hid: 'og:description',
//       name: 'og:description',
//       content: contentData.value?.description,
//     },
//     {
//       hid: 'og:image',
//       property: 'og:image',
//       content: ogImage,
//     },
//     {
//       hid: 'twitter:card',
//       name: 'twitter:card',
//       content: 'summary_large_image',
//     },
//     {
//       hid: 'twitter:title',
//       name: 'twitter:title',
//       content: contentData.value?.title,
//     },
//     {
//       hid: 'twitter:description',
//       name: 'twitter:description',
//       content: contentData.value?.description,
//     },
//     {
//       hid: 'twitter:image',
//       name: 'twitter:image',
//       content: ogImage,
//     },
//   ],
//   link: [
//     {
//       rel: 'canonical',
//       href: `https://${requestURL.value}/multimedia/${contentData.value?.id}/${contentData.value?.title_url}`,
//     },
//   ],
// }))
</script>

<style scoped>
</style>
