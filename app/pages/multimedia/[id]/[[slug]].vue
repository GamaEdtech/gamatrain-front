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
    <div class="w-100 d-flex align-start justify-center justify-md-space-between mt-6 flex-wrap">
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
      </div>
    </div>

    <lazy-common-share-modal
      v-if="openShare"
      v-model:show-dialog="openShare"
      :title="contentData.title"
    />
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
const { getItemById } = useMultimedia()

const breads = ref<BreadCrumb[]>([])
const openShare = ref(false)

const { data: contentData } = await useAsyncData(
  `multimedia-${route.params.id}`,
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
console.log(contentData.value)

const initBreadCrumb = () => {
  if (!contentData.value) return
  breads.value = []
  breads.value.push({
    text: 'Multimedia',
    disabled: false,
    href: '/search?type=multimedia',
  })
  breads.value.push(
    {
      text: contentData.value.section_title,
      disabled: false,
      href: `/search?type=multimedia&section=${contentData.value.section}`,
    },
    {
      text: contentData.value.base_title,
      disabled: false,
      href: `/search?type=multimedia&section=${contentData.value.section}&base=${contentData.value.base}`,
    },
    {
      text: contentData.value.lesson_title,
      disabled: false,
      href: `/search?type=multimedia&section=${contentData.value.section}&base=${contentData.value.base}&lesson=${contentData.value.lesson}`,
    },
  )
}

if (contentData.value) {
  initBreadCrumb()
}
</script>

<style scoped>
</style>
