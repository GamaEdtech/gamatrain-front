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
        <tutorial-lesson-tree
          v-model:show-drawer="showLessonTree"
          :units="lessonTree?.list ?? []"
        />
      </v-col>
      <v-col
        cols="12"
        md="9"
        class="d-flex flex-column"
      >
        <widgets-breadcrumb
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
        <div class="w-100 d-flex align-center ga-3 mt-8 px-4">
          <span class="text-h5 d-flex align-end text-grey400 ga-1">
            <v-icon>md:visibility_outlined</v-icon>
            {{ contentData?.views }}
          </span>
          <span class="text-h5 d-flex align-end text-grey400 ga-1">
            <v-icon>md:update</v-icon>
            {{ $dayjs(contentData?.up_date).fromNow() }}
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

        <div class="w-100 d-flex flex-wrap ga-2 mt-3 px-4">
          <v-chip
            class="bg-primary-gray-100"
            :small="mdAndDown"
            :to="`/search?type=dars&section=${contentData?.section}`"
            flat
          >
            <span class="primary-gray-500 text-h6 font-weight-bold">
              <!-- {{ contentData?.section_title }} -->
              Section title
            </span>
          </v-chip>
          <v-chip
            class="bg-primary-gray-100"
            flat
            :small="mdAndDown"
            :to="`/search?type=dars&section=${contentData?.section}&base=${contentData?.base}`"
          >
            <span class="primary-gray-500 text-h6 font-weight-bold">
              <!-- {{ contentData?.base_title }} -->
              Base Title
            </span>
          </v-chip>
          <v-chip
            class="bg-primary-gray-100"
            flat
            :small="mdAndDown"
            :to="`/search?type=dars&section=${contentData?.section}&base=${contentData?.base}&lesson=${contentData?.lesson}`"
          >
            <span class="primary-gray-500 text-h6 font-weight-bold">
              <!-- {{ contentData?.lesson_title }} -->
              Lesson Title
            </span>
          </v-chip>
        </div>

        <div
          ref="bookContentRef"
          class="book-content w-100 mt-4"
        >
          <div
            class="bookText e-mathjax"
            v-html="contentData.content"
          />
        </div>
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
import type { ApiResult, TutorialDTO, AppError, LessonTreeDTO } from '~/types/api'

interface BreadCrumb {
  text: string
  disabled: boolean
  href: string
}

const { $dayjs, $renderMathInElement, $ensureMathJaxReady } = useNuxtApp()
const { mdAndDown, mdAndUp } = useDisplay()
const route = useRoute()
const router = useRouter()

const breads = ref<BreadCrumb[]>([])
const openCrashReport = ref(false)
const openShare = ref(false)
const isAdsLoad = ref(false)
const bookContentRef = ref<HTMLElement | null>(null)
const showLessonTree = ref(false)

const { data: contentData } = await useAsyncData(
  `tutorial-${route.params.id}`,
  async () => {
    try {
      const response = (await useApiService.get(
        `/api/v1/tutorials/${route.params.id}`,
      )) as ApiResult<TutorialDTO>

      return response.data
    }
    catch (e: unknown) {
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
      `/api/v1/tutorials/lessonTree/${contentData.value?.lesson}`,
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
      // text: contentData.value.section_title,
      text: 'ُSection title',
      disabled: false,
      href: `/search?type=dars&section=${contentData.value.section}`,
    },
    {
      // text: contentData.value.base_title,
      text: 'Base title',
      disabled: false,
      href: `/search?type=dars&section=${contentData.value.section}&base=${contentData.value.base}`,
    },
    {
      // text: contentData.value.lesson_title,
      text: 'Lesson title',
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

  const sliced = input.slice(0, length)

  const lastClosingTag = sliced.lastIndexOf('>')

  const safeSlice
    = lastClosingTag !== -1 ? sliced.slice(0, lastClosingTag + 1) : sliced

  const text = safeSlice
    .replace(/<!--[\s\S]*?-->/g, '') // remove comments
    .replace(/<\/?[^>]+(>|$)/g, '') // remove tags
    .replace(/&#\d+;/g, '') // remove emojies and icons
    .replace(/&[a-zA-Z]+;/g, '') // remove entity like &nbsp;
    .replace(/\s+/g, ' ') // add spaces for better result
    .trim()

  return text + '...'
}

defineOgImageComponent('TutorialDetail', {
  title: contentData.value?.title,
  views: contentData.value?.views,
  up_date: contentData.value?.up_date,
})
useHead({
  title: `${contentData.value?.title} booklet`,
  meta: [
    {
      name: 'apple-mobile-web-app-title',
      content: contentData.value?.title || '',
    },
    {
      name: 'og:title',
      content: contentData.value?.title || '',
    },
    {
      name: 'og:site_name',
      content: 'GamaTrain',
    },
    {
      name: 'description',
      content: stripHtmlTags(contentData.value?.content || ''),
    },
    {
      name: 'og:description',
      content: stripHtmlTags(contentData.value?.content || ''),
    },
    {
      name: 'keywords',
      content: [
        `${contentData.value?.title} study guide`,
        `${contentData.value?.title} easy tutorial`,
        `${contentData.value?.title} tutorial`,
        `${contentData.value?.title} for students`,
        `${contentData.value?.title} note`,
        `${contentData.value?.title} revision note`,
        `${contentData.value?.title} simple guide`,
        `${contentData.value?.title} cheatsheet`,
        `${contentData.value?.title} definition`,
      ].join(', ') },
  ],
  link: [
    {
      rel: 'canonical',
      href: `https://${requestURL.value}/tutorial/${contentData.value?.id}/${contentData.value?.title_url}`,
    },
  ],
})
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

.book-content {
  overflow-x: auto !important;
}

.table-holder {
  overflow-x: auto !important;
}

.book-content img {
  max-width: 86vw !important;
  margin-right: 0.1rem !important;
  margin-left: 0.1rem !important;
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
