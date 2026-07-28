<template>
  <v-container
    v-if="contentData"
    class="d-flex flex-column mt-16"
  >
    <v-row>
      <lazy-widgets-breadcrumb
        background-color="white"
        :breads="breads"
      />
    </v-row>
    <v-row>
      <v-col
        cols="12"
        class="d-flex align-center ga-1"
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
      </v-col>
      <v-col
        cols="12"
        md="4"
        class="d-flex justify-center justify-md-start"
      >
        <lazy-common-detail-preview-action-card
          :id="contentData.id"
          :thumb-pic="contentData.thumb_pic"
          :title="contentData.title"
          :alt="pageTitle"
          :views="contentData.views"
          :score="contentData.ref_score"
          @share="openShare = true"
        />
      </v-col>

      <v-col
        cols="12"
        md="8"
        class="d-flex h-100 align-start flex-wrap"
      >
        <lazy-common-detail-content-details-section :content-data="contentData" />

        <lazy-common-detail-download-and-purchase-buttons
          :id="contentData.id"
          :files="contentData.files"
          :year="contentData.edu_year"
          :title="contentData.title"
          :title-url="contentData.title_url"
          :section="contentData.section"
          :base="contentData.base"
          :lesson="contentData.lesson"
          :exams="contentData.exams"
          :test-type="contentData.test_type"
          :is-paper="contentData.is_paper"
        />
        <lazy-common-detail-subject-directory-nav :content-data="contentData" />
      </v-col>

      <lazy-common-detail-box-random-question :lesson="contentData.lesson" />

      <v-col cols="12">
        <lazy-common-detail-related-content
          :id="contentData.id"
          source="test"
          :request="[`test`, `file`, `exam`, `question`, `tutorial`]"
        />
      </v-col>

      <v-col
        cols="12"
        class="mt-6"
      >
        <span
          class="d-flex align-center ga-1 text-h5 cursor-pointer text-crash-report"
          @click="openCrashReport = true"
        >
          <v-icon
            color="#C62828"
            class="mb-1"
          >md:warning_outlined</v-icon>
          Crash report
        </span>
      </v-col>

      <ClientOnly>
        <v-col
          cols="12"
          class="text-center mt-10"
        >
          <lazy-common-ad-banner
            v-model="isAdsLoad"
            adslot="7199289937"
          />
        </v-col>
      </ClientOnly>
    </v-row>
    <lazy-common-crash-report-modal
      v-if="openCrashReport"
      :id="contentData.id"
      v-model:show-dialog="openCrashReport"
      type-crash-report="test"
    />
    <lazy-common-share-modal
      v-if="openShare"
      v-model:show-dialog="openShare"
      :title="contentData.title"
    />
  </v-container>
</template>

<script setup lang="ts">
import type { ApiResult, PastPaperDTO, AppError } from '@/types'

interface BreadCrumb {
  text: string
  disabled: boolean
  href: string
}

const route = useRoute()
const router = useRouter()

const { buildSchema } = useSeoSchema()

const requestURL = ref(useRequestURL().host)
const pageDescribe = ref('')
const pageTitle = ref('')
const breads = ref<BreadCrumb[]>([])
const openCrashReport = ref(false)
const openShare = ref(false)
const isAdsLoad = ref(false)

const { data: contentData } = await useAsyncData(
  `paper-${route.params.id}`,
  async () => {
    try {
      const response = (await useApiService.get(
        `/api/v1/tests/${route.params.id}`,
        undefined,
        {
          public: true,
          proxy: true,
        },
      )) as ApiResult<PastPaperDTO>

      if (response.data) {
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
    finally {
      // Reset loading states if needed
    }
  },
)

const schema = computed(() => {
  if (!contentData.value) return null

  const dto = contentData.value

  const url = `https://${requestURL.value}/paper/${dto.id}/${dto.title_url}`

  const title = pageTitle.value
  const description = pageDescribe.value

  return buildSchema({
    dto,
    url,
    title,
    description,
    breadcrumbs: breads.value,
    types: ['article', 'breadcrumb'],
  })
})

const setMetaData = () => {
  if (!contentData.value) return

  const dto: PastPaperDTO = contentData.value
  const { section_title, base_title, title, is_paper } = dto

  // Build title parts safely from DTO
  const titleParts = [
    section_title,
    base_title,
    title,
  ].filter(Boolean)

  const baseTitle = titleParts.join(' ')

  if (is_paper) {
    pageTitle.value = `${baseTitle} past paper`
    pageDescribe.value = `Download ${baseTitle} past paper with mark scheme (MS). Access a full collection of past papers for study, revision, and exam practice.`
  }
  else {
    pageTitle.value = baseTitle
    pageDescribe.value = `Download ${title} – ${base_title}, ${section_title} curriculum. Ideal for quick revision, practice, and exam prep.`
  }

  const ogImage = dto.thumb_pic
    ? dto.thumb_pic
    : null

  useHead({
    title: pageTitle.value,
    meta: [
      {
        name: 'apple-mobile-web-app-title',
        content: pageTitle.value,
      },
      {
        name: 'og:title',
        content: pageTitle.value,
      },
      {
        name: 'og:site_name',
        content: 'GamaTrain',
      },
      {
        name: 'description',
        content: pageDescribe.value,
      },
      {
        name: 'og:description',
        content: pageDescribe.value,
      },
      {
        property: 'og:image',
        content: ogImage,
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: pageTitle.value,
      },
      {
        name: 'twitter:description',
        content: pageDescribe.value,
      },
      {
        name: 'twitter:image',
        content: ogImage,
      },
    ],
    script: schema.value
      ? [
          {
            key: 'json-ld-schema',
            type: 'application/ld+json',
            innerHTML: JSON.stringify(schema.value),
          },
        ]
      : [],
    link: [
      {
        rel: 'canonical',
        href: dto
          ? `https://${requestURL.value}/paper/${dto.id}/${dto.title_url}`
          : `https://${requestURL.value}/paper/${route.params.id}`,
      },
    ],
  })
}

const initBreadCrumb = () => {
  if (!contentData.value) return
  breads.value = []
  breads.value.push({
    text: 'Paper',
    disabled: false,
    href: '/search?type=paper',
  })
  breads.value.push(
    {
      text: contentData.value.section_title,
      disabled: false,
      href: `/search?type=paper&section=${contentData.value.section}`,
    },
    {
      text: contentData.value.base_title,
      disabled: false,
      href: `/search?type=paper&section=${contentData.value.section}&base=${contentData.value.base}`,
    },
    {
      text: contentData.value.lesson_title,
      disabled: false,
      href: `/search?type=paper&section=${contentData.value.section}&base=${contentData.value.base}&lesson=${contentData.value.lesson}`,
    },
  )
}

if (contentData.value) {
  initBreadCrumb()
  setMetaData()
}
</script>

<style scoped>
.text-crash-report {
  color: #c62828;
}
</style>
