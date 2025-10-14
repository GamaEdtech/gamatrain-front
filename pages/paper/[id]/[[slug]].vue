<template>
  <v-container
    v-if="contentData"
    class="d-flex flex-column margin-top-handle"
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
        class="d-flex justify-center"
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
        <nuxt-link
          :to="`/subject-directory?board=${contentData?.section}&grade=${contentData?.base}&subject=${contentData?.lesson}`"
          class="w-100 rounded-lg d-flex align-center justify-start pa-1 pa-sm-3 ga-2 mt-2 subject-directory-alert"
        >
          <v-icon color="primary">md:files_outlined</v-icon>
          <span class="text-h6 text-sm-h5 font-weight-bold">+ 8000
            <span class="font-weight-medium">{{ contentData?.lesson_title }} resources in one place</span>
          </span>
          <v-icon color="primary">md:chevron_forward</v-icon>
        </nuxt-link>
      </v-col>

      <CommonDetailBoxRandomQuestion :lesson="contentData.lesson" />

      <v-col cols="12">
        <CommonDetailRelatedContent
          :id="contentData.id"
          source="test"
          :request="[`test`, `file`, `exam`, `question`, `tutorial`]"
        />
      </v-col>

      <v-col
        cols="12"
        class="mb-6"
      >
        <CommonComments />
      </v-col>

      <v-col cols="12">
        <span
          class="d-flex align-center ga-1 text-h5 cursor-pointer text-crash-report"
          @click="openCrashReport = true"
        >
          <v-icon
            color="#F04438"
            class="mb-1"
          >md:warning_outlined</v-icon>
          Crash report
        </span>
      </v-col>
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
</template>

<script setup lang="ts">
interface BreadCrumb {
  text: string
  disabled: boolean
  href: string
}
interface ApiErrorResponse {
  status?: number
  data?: {
    error?: string
    status?: number
  }
}

interface AppError {
  response?: ApiErrorResponse
  message?: string
  status?: number
}
interface IFileInfo {
  exist: boolean
  size: string | number
  ext: string | false
  price: number
  type_title?: string
  id?: string
}

interface IContentFiles {
  word: IFileInfo
  pdf: IFileInfo
  answer: IFileInfo
  extra?: IFileInfo[]
}
interface ContentData {
  id: string
  title: string
  title_url: string
  thumb_pic: string
  lesson_pic: string | null
  description: string
  views: number
  ref_score: number
  edu_year: string
  section: string
  base: string
  lesson: string
  exams: {
    id: string
    status: string
  }[]
  files: IContentFiles
  lesson_title: string
  base_title: string
  section_title: string
  is_paper: boolean
  avatar: string
  first_name: string
  last_name: string
  test_type_title?: string
  up_date: string
  edu_month_title: string
}

interface ApiResponse<T> {
  data: T
  succeeded: boolean
  status: number
  errors: {
    message: string
    code: string
    reference: string
    info: string
    value: string
  }[]
}

const route = useRoute()
const router = useRouter()

const requestURL = ref(useRequestURL().host)
const pageDescribe = ref('')
const pageTitle = ref('')
const breads = ref<BreadCrumb[]>([])
const openCrashReport = ref(false)
const openShare = ref(false)

// Track loading state

const { data: contentData } = await useAsyncData(
  `paper-${route.params.id}`,
  async () => {
    try {
      const response = (await $fetch(
        `/api/v1/tests/${route.params.id}`,
        {},
      )) as ApiResponse<ContentData>

      return response.data
    }
    catch (e: unknown) {
      const error = e as AppError
      if (error?.status === 404) {
        router.push('/search?type=test')
      }
      throw error
    }
    finally {
      // Reset loading states if needed
    }
  },
)

const schemaData = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'LearningResource',
  'name': contentData.value?.title || 'GamaEdtech',
  'image':
    contentData.value?.thumb_pic
    || contentData.value?.lesson_pic
    || 'https://gamatrain.com/images/gamatrain-logo.svg',
  'url': route.fullPath || '',
  'description': contentData.value?.description || 'GamaEdtech',
}))

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
        innerHTML: JSON.stringify(schemaData.value),
        type: 'application/ld+json',
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
    href: '/search?type=test',
  })
  breads.value.push(
    {
      text: contentData.value.section_title,
      disabled: false,
      href: `/search?type=test&section=${contentData.value.section}`,
    },
    {
      text: contentData.value.base_title,
      disabled: false,
      href: `/search?type=test&section=${contentData.value.section}&base=${contentData.value.base}`,
    },
    {
      text: contentData.value.lesson_title,
      disabled: false,
      href: `/search?type=test&section=${contentData.value.section}&base=${contentData.value.base}&lesson=${contentData.value.lesson}`,
    },
  )
}

if (contentData.value) {
  initBreadCrumb()
  setMetaData()
}
</script>

<style scoped>
.margin-top-handle {
  margin-top: 64px;
}

.subject-directory-alert {
  height: 64px;
  background-color: #efffe5;
}
.text-crash-report {
  color: #f04438;
}
@media (min-width: 960px) {
  .margin-top-handle {
    margin-top: 6.4rem;
  }
}
</style>
