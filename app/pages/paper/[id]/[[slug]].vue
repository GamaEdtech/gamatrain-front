<template>
  <main>
    <v-container
      v-if="contentData"
      class="d-flex flex-column mt-16"
    >
      <v-row>
        <widgets-breadcrumb
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
          <CommonDetailPreviewActionCard
            :id="contentData.id"
            :thumb-pic="contentData.thumb_pic"
            :title="contentData.title"
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
          <CommonDetailContentDetailsSection :content-data="contentData" />

          <CommonDetailDownloadAndPurchaseButtons
            :id="contentData.id"
            :files="contentData.files"
            :year="contentData.edu_year"
            :title="contentData.title"
            :title-url="contentData.title_url"
            :section="contentData.section"
            :base="contentData.base"
            :lesson="contentData.lesson"
            :exams="contentData.exams"
          />
          <CommonDetailSubjectDirectoryNav :content-data="contentData" />
        </v-col>

        <CommonDetailBoxRandomQuestion :lesson="contentData.lesson" />

        <v-col cols="12">
          <CommonDetailRelatedContent
            :id="contentData.id"
            source="test"
            :request="[`test`, `file`, `exam`, `question`, `tutorial`]"
          />
        </v-col>

        <!-- <v-col
        cols="12"
        class="mb-6"
      >
        <CommonComments />
      </v-col> -->

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
            <common-ad-banner
              v-model="isAdsLoad"
              adslot="7199289937"
            />
          </v-col>
        </ClientOnly>
      </v-row>
      <CommonCrashReportModal
        :id="contentData.id"
        v-model:show-dialog="openCrashReport"
        type-crash-report="test"
      />
      <CommonShareModal
        v-model:show-dialog="openShare"
        :title="contentData.title"
      />
    </v-container>
  </main>
</template>

<script setup lang="ts">
import type { ApiResult, PastPaperDTO, AppError } from '~/types/api'

interface BreadCrumb {
  text: string
  disabled: boolean
  href: string
}
interface SchemaNode {
  [key: string]: string | object
}

const route = useRoute()
const router = useRouter()

const requestURL = ref(useRequestURL().host)
const pageDescribe = ref('')
const pageTitle = ref('')
const breads = ref<BreadCrumb[]>([])
const openCrashReport = ref(false)
const openShare = ref(false)
const isAdsLoad = ref(false)

// Track loading state

const { data: contentData } = await useAsyncData(
  `paper-${route.params.id}`,
  async () => {
    try {
      const response = (await useApiService.get(
        `/api/v1/tests/${route.params.id}`,
      )) as ApiResult<PastPaperDTO>

      return response.data
    }
    catch (e: unknown) {
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

const organizationSchema = {
  '@type': 'Organization',
  '@id': 'https://gamatrain.com/#organization',
  'name': 'GamaTrain',
  'url': 'https://gamatrain.com',
  'logo': {
    '@type': 'ImageObject',
    'url': 'https://gamatrain.com/android-chrome-512x512-light.png',
  },
}
const breadcrumbSchema = computed(() => {
  if (!breads.value.length) return null

  return {
    '@type': 'BreadcrumbList',
    'itemListElement': breads.value.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.text,
      'item': `https://${requestURL.value}${item.href}`,
    })),
  }
})

const articleSchema = computed(() => {
  if (!contentData.value) return null

  const image
    = contentData.value.thumb_pic
      || contentData.value.lesson_pic
      || 'https://gamatrain.com/android-chrome-512x512-light.png'

  return {
    '@type': 'Article',
    '@id': `https://${requestURL.value}/paper/${contentData.value.id}#article`,
    'headline': pageTitle.value,
    'description': pageDescribe.value,
    'image': [image],
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://${requestURL.value}/paper/${contentData.value.id}/${contentData.value.title_url}`,
    },
    'author': {
      '@type': 'Person',
      'name': `${contentData.value.first_name} ${contentData.value.last_name}`,
    },
    'publisher': {
      '@type': 'Organization',
      '@id': 'https://gamatrain.com/#organization',
    },
    'dateModified': new Date(contentData.value.up_date).toISOString(),
    'datePublished': new Date(contentData.value.up_date).toISOString(),
  }
})

const fullSchema = computed(() => {
  if (!articleSchema.value) return null

  const graph: SchemaNode[] = [
    organizationSchema,
    articleSchema.value,
  ]

  if (breadcrumbSchema.value) {
    graph.push(breadcrumbSchema.value)
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  }
})

const setMetaData = () => {
  if (!contentData.value) return

  const { section_title, base_title, title, is_paper } = contentData.value

  // Build common title parts
  const titleParts = [section_title, base_title, title].filter(Boolean)
  const baseTitle = titleParts.join(' ')

  if (is_paper) {
    pageTitle.value = `${baseTitle} past paper`
    pageDescribe.value = `Download ${baseTitle} past paper with mark scheme (MS). Access a full collection of past papers for study, revision, and exam practice.`
  }
  else {
    pageTitle.value = baseTitle
    pageDescribe.value = `Free download of ${title} – ${base_title}, ${section_title} curriculum. Ideal for quick revision, practice, and exam prep.`
  }

  const ogImage = contentData.value?.thumb_pic
    ? contentData.value?.thumb_pic
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
    script: [
      {
        key: 'json-ld-schema',
        type: 'application/ld+json',
        innerHTML: JSON.stringify(fullSchema.value),
      },
    ],
    link: [
      {
        rel: 'canonical',
        href: contentData.value
          ? `https://${requestURL.value}/paper/${contentData.value.id}/${contentData.value.title_url}`
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
