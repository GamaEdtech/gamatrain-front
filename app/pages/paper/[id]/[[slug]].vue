<template>
  <v-container
    v-if="contentData"
    class="paper-details d-flex flex-column mt-16 pb-0"
  >
    <widgets-breadcrumb
      flush
      background-color="transparent"
      :breads="breads"
    />

    <header class="mt-2">
      <div class="d-flex align-start ga-2">
        <h1 class="gama-text-h2 text-brandNavy">
          {{ contentData.title }}
        </h1>
        <v-btn
          v-if="isOwner"
          color="info"
          class="rounded-circle flex-shrink-0 mt-1"
          size="28"
          flat
          variant="tonal"
          aria-label="Edit title and description"
          @click="openEditModal = true"
        >
          <v-icon size="16">
            md:edit
          </v-icon>
        </v-btn>
      </div>

      <div class="d-flex flex-wrap ga-2 mt-4">
        <v-chip
          v-for="chip in chips"
          :key="chip.text"
          :to="chip.to"
          :color="chip.color"
          variant="tonal"
          class="text-h6 font-weight-bold"
        >
          {{ chip.text }}
        </v-chip>
      </div>

      <ul class="paper-stats d-none d-md-flex flex-wrap ga-6 mt-4 pa-0 text-h5 text-grey600">
        <li
          v-for="stat in stats"
          :key="stat.label"
          class="d-flex align-center ga-1"
        >
          <v-icon
            size="18"
            :color="stat.iconColor ?? 'grey600'"
            aria-hidden="true"
          >
            {{ stat.icon }}
          </v-icon>
          <b class="text-grey900">{{ stat.value }}</b> {{ stat.label }}
        </li>
      </ul>
    </header>

    <!-- Phones read: title, the paper with its facts, the download card, about. Parts below the fold are
         server-rendered but hydrate only when scrolled into view, which keeps the main thread free during load. -->
    <div class="paper-layout mt-6">
      <aside class="paper-preview">
        <paper-preview-action-card
          :id="contentData.id"
          :thumb-pic="contentData.thumb_pic"
          :title="contentData.title"
          :alt="pageTitle"
          :files="contentData.files"
          :q-file-pages="contentData.q_file_pages"
        >
          <ul class="paper-stats paper-stats--compact d-md-none pa-0 text-h6 text-grey600">
            <li
              v-for="stat in stats"
              :key="stat.label"
            >
              <b :class="stat.iconColor ? 'text-primary' : 'text-grey900'">{{ stat.value }}</b> {{ stat.label }}
            </li>
          </ul>
        </paper-preview-action-card>
      </aside>

      <div class="paper-main d-flex flex-column ga-5">
        <paper-action-card
          :id="contentData.id"
          :title="contentData.title"
          :title-url="contentData.title_url"
          :files="contentData.files"
          :is-paper="contentData.is_paper"
          :q-file-pages="contentData.q_file_pages"
          :online-exam-id="onlineExamId"
          :answers-in-file="answersInFile"
          @share="openShare = true"
          @report="openCrashReport = true"
        />

        <!-- A real link, unlike Start quiz: it is how crawlers reach the paper's online test. -->
        <nuxt-link
          v-if="onlineExamId"
          :to="contentPath('exam', onlineExamId)"
          class="text-h6 text-generalSearchQuiz font-weight-semibold"
        >
          Take this {{ contentData.is_paper ? 'past paper' : 'question set' }} as an online test, with your score and the correct answers
        </nuxt-link>

        <lazy-paper-content-details-section
          hydrate-on-visible
          :content-data="contentData"
        />

        <lazy-common-detail-subject-directory-nav
          hydrate-on-visible
          :content-data="contentData"
        />
      </div>
    </div>

    <lazy-common-practice-question
      hydrate-on-visible
      class="mt-10"
      :lesson="contentData.lesson"
      :topic="contentData.topic"
      :subject="contentData.lesson_title?.trim()"
      :exam-id="onlineExamId"
    />

    <div class="mt-6 mx-n4">
      <lazy-common-related-content
        :id="contentData.id"
        source="test"
        :request="[`test`, `file`, `exam`, `question`, `tutorial`]"
      />
    </div>

    <p class="text-h6 text-grey500 mt-8">
      Spotted a mistake?
      <a
        href="#"
        class="text-decoration-underline text-grey600"
        @click.prevent="openCrashReport = true"
      >Report a problem with this paper</a>
    </p>

    <!-- The ad's space is kept before it loads, so it doesn't push the page when it arrives. -->
    <div class="paper-ad text-center mt-8">
      <ClientOnly>
        <lazy-common-ad-banner
          v-model="isAdsLoad"
          adslot="7199289937"
        />
      </ClientOnly>
    </div>

    <exam-detail-mobile-action-bar
      :id="onlineExamId ?? ''"
      :can-start="!!onlineExamId"
      :has-finished="false"
      downloads-id="paper-downloads"
    />

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
      <lazy-paper-modal-edit
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
import type { ApiResult, PastPaperDTO } from '@/types'

// The page's own Download / Start quiz bar takes the bottom of the screen on a phone; the site menu under it
// doubled the bars (about 140px) with links a reader doesn't need here.
definePageMeta({ hideBottomNav: true })

interface BreadCrumb {
  text: string
  disabled: boolean
  href: string
}

const route = useRoute()
const { user } = useUser()
const { isAuthenticatedUi } = useAuth()
const { buildCambridgeMeta } = useCambridgeSeo()

const { buildSchema } = useSeoSchema()

const pageDescribe = ref('')
const pageTitle = ref('')
const breads = ref<BreadCrumb[]>([])
const openCrashReport = ref(false)
const openShare = ref(false)
const openEditModal = ref(false)
const isAdsLoad = ref(false)

const { data: contentData } = await useAsyncData(
  `paper-${route.params.id}`,
  async () => {
    try {
      // gama-api's tests/{id} through gamatrain-back, which caches it (Redis, then Cloudflare). Anonymous on purpose, so
      // one cached copy suits everyone.
      const response = (await useApiService.get(
        `/api/v2/search/papers/${route.params.id}`,
        undefined,
        {
          public: true,
          credentials: 'omit',
        },
      )) as ApiResult<PastPaperDTO>

      return response.data ?? null
    }
    catch {
      // Missing and non-public papers (the API answers those with 403 permissionDenied) both end up as 404 below.
      return null
    }
  },
)

// showError inside the handler only lands in useAsyncData's error, so SSR answered 200 with an empty page
// (just the layout's blog slider). Throwing from setup makes Nuxt render the error page with a real 404.
if (!contentData.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found',
    fatal: true,
  })
}

const { url: canonicalUrl } = await useCanonicalContentPath('paper', contentData.value.id, contentData.value.title_url)

// The published online test made from this paper, if there is one.
const onlineExamId = computed(() => contentData.value?.exams?.find(exam => exam.status == '1')?.id)

const isOwner = computed(() =>
  Boolean(isAuthenticatedUi.value && user.value && contentData.value?.user_
    && Number(contentData.value.user_) === user.value.coreId),
)

// The answers are in the question file itself (answer type 1/2 with no separate answer file).
const answersInFile = computed(() =>
  ['1', '2'].includes(String(contentData.value?.answer_type)) && !contentData.value?.files?.answer?.exist,
)

// Board, grade, subject and year link to the matching paper search; the session and paper type are labels.
const chips = computed(() => {
  const dto = contentData.value
  if (!dto) return []
  const search = `/search?type=paper&section=${dto.section}`
  return [
    { text: dto.section_title, to: search, color: 'brandNavy' },
    { text: dto.base_title, to: `${search}&base=${dto.base}`, color: 'brandNavy' },
    { text: dto.lesson_title, to: `${search}&base=${dto.base}&lesson=${dto.lesson}`, color: 'brandNavy' },
    { text: dto.edu_year, to: `${search}&base=${dto.base}&lesson=${dto.lesson}&edu_year=${dto.edu_year}`, color: 'brandNavy' },
    { text: dto.edu_month_title, to: undefined, color: 'primary' },
    { text: dto.test_type_title, to: undefined, color: 'generalSearchQuiz' },
  ]
    .map(chip => ({ ...chip, text: String(chip.text ?? '').trim() }))
    .filter(chip => chip.text && chip.text !== '0')
})

const formatCount = (value: unknown) => {
  const count = Number(value)
  return Number.isFinite(count) && count > 0 ? count.toLocaleString('en-US') : ''
}

// Plain facts, not buttons: they used to look clickable and drew dead clicks.
const stats = computed(() => {
  const dto = contentData.value
  if (!dto) return []
  return [
    { label: 'pages', value: formatCount(dto.q_file_pages), icon: 'md:description' },
    { label: 'views', value: formatCount(dto.views), icon: 'md:visibility' },
    { label: 'downloads', value: formatCount(dto.downloads), icon: 'md:download' },
    { label: 'rating', value: Number(dto.ref_score) ? Number(dto.ref_score).toFixed(1) : '', icon: 'md:star', iconColor: 'primary' },
  ].filter(stat => stat.value)
})

const schema = computed(() => {
  if (!contentData.value) return null

  const dto = contentData.value

  const url = canonicalUrl

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
  const {
    section_title,
    base_title,
    title,
    is_paper,
  } = dto

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

    const cambridgeMeta = buildCambridgeMeta(dto)

    if (cambridgeMeta) {
      pageTitle.value = `${pageTitle.value} ${cambridgeMeta.titleSuffix}`
      pageDescribe.value = cambridgeMeta.description
    }
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
        href: canonicalUrl,
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
    setMetaData()
  }
}
</script>

<style scoped lang="scss">
@use 'sass:map';
@use 'vuetify/settings' as vuetify;

.paper-details {
  max-width: 1232px;
}
.paper-stats {
  list-style: none;
}
.paper-stats--compact {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px 16px;
}
.paper-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 20px;
}
.paper-ad {
  min-height: 100px;
}
@media #{map.get(vuetify.$display-breakpoints, 'md-and-up')} {
  .paper-layout {
    grid-template-columns: minmax(280px, 340px) minmax(0, 1fr);
    gap: 32px;
    align-items: start;
  }
}
</style>
