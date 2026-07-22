<template>
  <v-container
    v-if="contentData"
    class="d-flex flex-column mt-16"
  >
    <v-row>
      <v-col
        cols="0"
        md="3"
        class="pa-0"
      >
        <div class="tree-container">
          <tutorial-lesson-tree
            v-model:show-drawer="showLessonTree"
            :units="lessonTree?.list ?? []"
          />
        </div>
      </v-col>
      <v-col
        cols="12"
        md="9"
        class="d-flex flex-column ga-1"
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
          <div class="w-100 d-flex align-center ga-3 mt-8 px-4">
            <span class="text-h5 d-flex align-end text-grey400 ga-1">
              <v-icon>md:visibility_outlined</v-icon>
              {{ contentData?.views }}
            </span>
            <span class="text-h5 d-flex align-end text-grey400 ga-1">
              <v-icon>md:update</v-icon>
              {{ fromNowLocal(contentData?.up_date) }}
            </span>

            <v-icon color="grey400">
              md:bookmark_outlined
            </v-icon>

            <v-icon
              color="grey400"
              class="cursor-pointer"
              @click="openShare = true"
            >
              md:share_outlined
            </v-icon>
          </div>

          <!-- <div class="w-100 d-flex flex-wrap ga-2 mt-3 px-4">
          <v-chip
            class="bg-grey100"
            :small="mdAndDown"
            :to="`/search?type=dars&section=${contentData?.section}`"
            flat
          >
            <span class="text-grey500 text-h6 font-weight-bold">
              {{ contentData?.section_title }}
            </span>
          </v-chip>
          <v-chip
            class="bg-grey100"
            flat
            :small="mdAndDown"
            :to="`/search?type=dars&section=${contentData?.section}&base=${contentData?.base}`"
          >
            <span class="text-grey500 text-h6 font-weight-bold">
              {{ contentData?.base_title }}
              Base Title
            </span>
          </v-chip>
          <v-chip
            class="bg-grey100"
            flat
            :small="mdAndDown"
            :to="`/search?type=dars&section=${contentData?.section}&base=${contentData?.base}&lesson=${contentData?.lesson}`"
          >
            <span class="text-grey500 text-h6 font-weight-bold">
              {{ contentData?.lesson_title }}
            </span>
          </v-chip>
        </div> -->

          <div
            ref="bookContentRef"
            class="book-content w-100 mt-4"
          >
            <div
              class="bookText e-mathjax"
              v-html="contentData.content"
            />
          </div>
        </v-row>
      </v-col>
    </v-row>
    <v-row class="mt-4">
      <v-btn
        class="position-fixed d-flex d-md-none button-open-tree"
        rounded="circle"
        color="primary"
        width="48"
        height="48"
        flat
        icon
        @click="showLessonTree = !showLessonTree"
      >
        <v-icon
          color="black"
          size="24"
        >
          md:format_list_bulleted
        </v-icon>
      </v-btn>
      <CommonDetailBoxRandomQuestion :lesson="contentData.lesson" />

      <v-col cols="12">
        <CommonDetailRelatedContent
          :id="contentData.id"
          source="tutorial"
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
            color="#F04438"
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
      type-crash-report="tutorial"
    />
    <CommonShareModal
      v-model:show-dialog="openShare"
      :title="contentData.title"
    />
  </v-container>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'
import type { ApiResult, TutorialDTO, AppError, LessonTreeDTO } from '@/types'

interface BreadCrumb {
  text: string
  disabled: boolean
  href: string
}

const { $renderMathInElement, $ensureMathJaxReady } = useNuxtApp()
const { fromNowLocal } = useDateTime()
const { mdAndUp } = useDisplay()
const route = useRoute()
const router = useRouter()

const { buildSchema } = useSeoSchema()

const breads = ref<BreadCrumb[]>([])
const openCrashReport = ref(false)
const openShare = ref(false)
const pageDescribe = ref('')
const pageTitle = ref('')
const isAdsLoad = ref(false)
const bookContentRef = ref<HTMLElement | null>(null)
const showLessonTree = ref(false)

const { data: contentData } = await useAsyncData(
  `tutorial-${route.params.id}`,
  async () => {
    try {
      const response = (await useApiService.get(
        `/api/v1/tutorials/${route.params.id}`, undefined, { public: true },
      )) as ApiResult<TutorialDTO>

      if (response.status === 1) {
        return response.data
      }
      else {
        showError({
          statusCode: 404,
          statusMessage: 'Page Not Founded!',
        })
        return response.data
      }
    }
    catch (e: unknown) {
      showError({
        statusCode: 404,
        statusMessage: 'Page Not Founded!',
      })
      const error = e as AppError
      if (error?.status === 404) {
        router.push('/search?type=test')
      }
      throw error
    }
  },
)

const { data: lessonTree } = await useAsyncData(
  `lessonTree-${route.params.id}`,
  async () => {
    if (!contentData.value?.lesson) return null
    const response = await useApiService.get(
      `/api/v1/tutorials/lessonTree/${contentData.value?.lesson}`, undefined, { public: true },
    ) as ApiResult<LessonTreeDTO>
    return response.data
  },
)
const initBreadCrumb = () => {
  if (!contentData.value) return
  breads.value = []
  breads.value.push({
    text: 'Tutorial',
    disabled: false,
    href: '/search?type=dars',
  })
  breads.value.push(
    {
      text: contentData.value.section_title,
      disabled: false,
      href: `/search?type=dars&section=${contentData.value.section}`,
    },
    {
      text: contentData.value.base_title,
      disabled: false,
      href: `/search?type=dars&section=${contentData.value.section}&base=${contentData.value.base}`,
    },
    {
      text: contentData.value.lesson_title,
      disabled: false,
      href: `/search?type=dars&section=${contentData.value.section}&base=${contentData.value.base}&lesson=${contentData.value.lesson}`,
    },
  )
}

if (contentData.value) {
  initBreadCrumb()
}

const typesetMathInSpecificContainer = async (containerRef: Ref<HTMLElement | null>) => {
  if (import.meta.client && containerRef.value) {
    try {
      await $ensureMathJaxReady()

      if (!window.MathJax || !window.MathJax.Hub) {
        return
      }

      if (containerRef.value) {
        await nextTick()
        $renderMathInElement(containerRef.value)
      }
    }
    catch (error) {
      console.error('Error during MathJax typesetting:', error)
    }
  }
}
onMounted(() => {
  if (mdAndUp.value) {
    showLessonTree.value = true
  }
  if (bookContentRef.value) {
    typesetMathInSpecificContainer(bookContentRef)
  }
})

const requestURL = ref(useRequestURL().host)
const stripHtmlTags = (input: string, length = 1200) => {
  if (!input) return ''

  const text = input
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/&#\d+;/g, '')
    .replace(/&[a-zA-Z]+;/g, '')
    .replace(/\$/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  return text.length > length
    ? text.slice(0, length).trim() + '...'
    : text
}

defineOgImageComponent('TutorialDetail', {
  title: contentData.value?.title,
  views: contentData.value?.views,
  up_date: contentData.value?.up_date,
})

const schema = computed(() => {
  if (!contentData.value) return null

  const dto = contentData.value

  const url = `https://${requestURL.value}/tutorial/${dto.id}/${dto.title_url}`

  const title = pageTitle.value
  const description = pageDescribe.value

  const body = stripHtmlTags(dto.content, 150)

  return buildSchema({
    dto,
    url,
    title,
    description,
    body,
    breadcrumbs: breads.value,
    types: ['webpage', 'article-learning', 'breadcrumb'],
  })
})

const setMetaData = () => {
  if (!contentData.value) return

  const dto: TutorialDTO = contentData.value

  const isGamaBoard = dto.section === '7131'

  const baseTitle = (
    isGamaBoard
      // GAMA: use only the title
      ? [dto.title]
      // Other boards: include section, base title, and title
      : [dto.section_title, dto.base_title, dto.title]
  )
    .filter(Boolean)
    .join(' ')

  pageTitle.value = baseTitle

  pageDescribe.value = `Learn ${dto.title} with step-by-step explanations and examples from the ${dto.base_title} ${dto.section_title} curriculum.`

  const ogImage
    = dto.lesson_pic
      || 'https://gamatrain.com/android-chrome-512x512-light.png'

  useHead({
    title: `${pageTitle.value}`,
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
        name: 'keywords',
        content: [
          `${dto.title} study guide`,
          `${dto.title} easy tutorial`,
          `${dto.title} tutorial`,
          `${dto.title} for students`,
          `${dto.title} note`,
          `${dto.title} revision note`,
          `${dto.title} simple guide`,
          `${dto.title} cheatsheet`,
          `${dto.title} definition`,
        ].join(', '),
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
    link: [
      {
        rel: 'canonical',
        href: `https://${requestURL.value}/tutorial/${dto.id}/${dto.title_url}`,
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
  })
}
if (contentData.value) {
  initBreadCrumb()
  setMetaData()
}
</script>

<style>
.text-crash-report {
  color: #f04438;
}
.button-open-tree{
  right: 12px;
  bottom : 70px;
  z-index : 3
}

@media (min-width: 960px) {
  .tree-container {
    position: sticky;
    top: 70px;
    height: 100vh;
  }
}

.book-content {
  overflow-x: auto !important;
}

.table-holder {
  overflow-x: auto !important;
}

.book-content img {
  max-width: 100% !important;
  height: auto !important;
  border-radius: 0.5rem;
  margin: 0.5rem 0.5rem 0.5rem 0.5rem !important;

}

/*Message style section*/
.bookText .message {
  padding: 15px !important;
  max-width: 100vw !important;
  border-radius: 5px;
  margin-bottom: 12px;
}

.bookText .segment {
  padding: 15px !important;
  border-radius: 5px;
  margin-bottom: 12px;
}

.bookText .ui.message.red {
  background-color: #fff !important;
  color: red;
  box-shadow: 0 0 0 1px red inset, 0 0 0 0 transparent;
}

.bookText .ui.message.blue {
  background-color: #fff !important;
  color: blue;
  box-shadow: 0 0 0 1px blue inset, 0 0 0 0 transparent;
}

.bookText .ui.message.green {
  background-color: #fff !important;
  color: green;
  box-shadow: 0 0 0 1px green inset, 0 0 0 0 transparent;
}

.bookText .ui.message.yellow {
  background-color: #fff !important;
  color: #b58105;
  box-shadow: 0 0 0 1px #b58105 inset, 0 0 0 0 transparent;
}

/*End message style section*/

/*Segment section*/
.bookText .ui.segment.red {
  background-color: #fff !important;
  color: #000000;
  border-top: 2px solid red;
}

.bookText .ui.segment.red h2 {
  color: red !important;
  background: transparent !important;
}

.bookText .ui.segment.blue {
  background-color: #fff !important;
  color: #000000;
  border-top: 2px solid blue;
}

.bookText .ui.segment.blue h2 {
  color: red !important;
  background: transparent !important;
}

.bookText .ui.segment.green {
  background-color: #fff !important;
  color: #000000;
  border-top: 2px solid green;
}

.bookText .ui.segment.green h2 {
  color: red !important;
  background: transparent !important;
}

.bookText .ui.segment.brown {
  background-color: #fff !important;
  color: #000000;
  border-top: 2px solid #795548;
}

.bookText .ui.segment.brown h2 {
  color: red !important;
  background: transparent !important;
}

/*End section section*/

.bookText .ui.table {
  width: 100%;
  background: #fff;
  margin: 1em 0;
  border: 1px solid rgba(34, 36, 38, 0.15);
  box-shadow: none;
  border-radius: 0.28571429rem;
  text-align: left;
  color: rgba(0, 0, 0, 0.87);
  border-collapse: separate;
  border-spacing: 0;
  overflow-x: auto;
  display: block;
}

/*Tutorial details table style*/
.bookText .ui.table td {
  padding: 20px;
}

/*End tutorial details table style*/

/*Tutorial details image caption*/
.bookText figcaption {
  background-color: #efeeee;
  padding: 5px 5px 5px 5px;
  border-radius: 5px;
  font-size: 14px;
}
</style>
