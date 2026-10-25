<template>
  <v-container
    v-if="contentData"
    class="exam-details d-flex flex-column mt-16 pb-0"
  >
    <lazy-widgets-breadcrumb
      background-color="transparent"
      :breads="breads"
    />

    <v-row class="mt-1">
      <v-col
        cols="12"
        md="8"
      >
        <v-chip
          color="generalSearchQuiz"
          variant="tonal"
          class="kicker text-h6 text-uppercase font-weight-bold"
        >
          {{ kicker }}
        </v-chip>
        <h1 class="gama-text-h1 text-brandNavy mt-3 mb-3">
          {{ seo.heading }}
        </h1>
        <p class="lede text-grey600">
          {{ lede }}
        </p>

        <v-row
          dense
          class="facts mt-5 mb-4"
        >
          <v-col
            v-for="fact in facts"
            :key="fact.label"
            cols="6"
            sm
          >
            <v-card
              rounded="lg"
              border
              elevation="0"
              class="px-4 py-3 h-100"
            >
              <p class="gama-text-h5 font-weight-heavy text-brandNavy">
                {{ fact.value }}
              </p>
              <div
                v-if="fact.level"
                class="level-bars d-flex ga-1 mt-1"
                aria-hidden="true"
              >
                <span
                  v-for="step in 3"
                  :key="step"
                  class="rounded-pill"
                  :class="step <= fact.level ? 'bg-primary' : 'bg-grey200'"
                />
              </div>
              <p class="text-h6 text-grey500 mt-1">
                {{ fact.label }}
              </p>
            </v-card>
          </v-col>
        </v-row>

        <div class="d-flex align-center flex-wrap ga-3">
          <v-avatar
            :image="contentData.avatar || '/images/member/avatar.svg'"
            size="40"
          />
          <div class="text-h5 text-grey600">
            Made by <b class="text-grey900">{{ authorName }}</b>
            <p class="text-h6 text-grey500">
              Updated {{ fromNowLocal(contentData.up_date) }}<template v-if="firstTopic">
                · {{ firstTopic }}
              </template>
            </p>
          </div>
          <common-follow-button :user-id="contentData.user_" />
        </div>
      </v-col>

      <v-col
        cols="12"
        md="4"
      >
        <div class="action-column">
          <exam-detail-action-card
            :id="contentData.id"
            :title="contentData.title"
            :title-url="contentData.title_url"
            :question-count="Number(contentData.tests_num) || 0"
            :participation="contentData.price?.participation"
            :exam-user-data="contentData.examUserData"
            @share="openShare = true"
            @report="openCrashReport = true"
            @prices="exportPrices = $event"
          />
        </div>
      </v-col>
    </v-row>

    <v-row class="mt-8">
      <v-col
        cols="12"
        md="8"
        class="d-flex flex-column ga-6"
      >
        <exam-detail-sample-questions
          :exam-id="contentData.id"
          :questions="contentData.sampleQuestions"
          :subject="seoSubject"
          :total="Number(contentData.tests_num) || 0"
          :can-start="!!contentData.price?.participation"
        />
        <v-card
          v-if="contentData.paper"
          :to="contentPath('paper', contentData.paper.id, contentData.paper.slug)"
          rounded="xl"
          border
          elevation="0"
          class="pa-4 d-flex align-center ga-3"
        >
          <v-icon
            color="primary"
            aria-hidden="true"
          >
            md:description
          </v-icon>
          <span class="text-h5 text-grey700">
            {{ contentData.paper.isPastPaper ? 'Original past paper: ' : 'The same questions as a downloadable set: ' }}
            <b class="text-brandNavy">{{ contentData.paper.title }}</b>
            {{ contentData.paper.isPastPaper ? '(question paper and mark scheme)' : '' }}
          </span>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="4"
        class="d-flex flex-column ga-4"
      >
        <exam-detail-result-preview
          v-if="contentData.price?.participation"
          :question-count="Number(contentData.tests_num) || 0"
          :participants="Number(contentData.participants_num) || 0"
        />
        <exam-detail-about-card :exam="contentData" />
        <exam-detail-topics-card :topics="contentData.topics" />
      </v-col>
    </v-row>

    <lazy-exam-detail-related-quizzes
      :id="contentData.id"
      :subject="contentData.lesson_title?.trim()"
      class="mt-10"
    />

    <exam-detail-file-comparison
      :prices="exportPrices"
      class="mt-10"
    />

    <!-- Past Papers, Multimedia and Tutorials; quizzes already have their own row above. -->
    <div class="mt-6 mx-n4">
      <lazy-common-related-content
        :id="contentData.id"
        source="exam"
        :request="[`test`, `file`, `tutorial`]"
      />
    </div>

    <lazy-exam-detail-quiz-faq
      :exam="contentData"
      :prices="exportPrices"
      class="mt-10"
    />

    <div class="d-flex justify-space-between align-center flex-wrap ga-2 text-h6 text-grey500 mt-10 mb-8">
      <span>
        Spotted a mistake?
        <a
          href="#"
          class="text-decoration-underline text-grey600"
          @click.prevent="openCrashReport = true"
        >Report a problem with this quiz</a>
      </span>
    </div>

    <exam-detail-mobile-action-bar
      :id="contentData.id"
      :can-start="!!contentData.price?.participation"
      :has-finished="hasFinished"
    />

    <lazy-common-modal-base
      v-model:show-dialog="openCrashReport"
      title="Report a problem"
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
  </v-container>
</template>

<script setup lang="ts">
import type { ExamExportPriceDTO, ExamUserDataExamDetaiDTO } from '@/types'

interface BreadCrumb {
  text: string
  disabled: boolean
  href: string
}

const route = useRoute()
const { getItemById } = useExam()
const { fromNowLocal } = useDateTime()

const breads = ref<BreadCrumb[]>([])
const openShare = ref(false)
const openCrashReport = ref(false)
// Filled by the action card once the export prices load, for the comparison table and the FAQ.
const exportPrices = ref<ExamExportPriceDTO[]>([])

const { data: contentData } = await useAsyncData(
  `exam-${route.params.id}`,
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

const { url: canonicalUrl } = await useCanonicalContentPath('exam', contentData.value.id, contentData.value.title_url)

const initBreadCrumb = () => {
  if (!contentData.value) return
  breads.value = []
  breads.value.push({
    text: 'QuizHub',
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
watch(
  () => contentData.value,
  () => {
    initBreadCrumb()
  },
  { immediate: true },
)

const difficultyLabels: Record<number, string> = { 1: 'Easy', 2: 'Medium', 3: 'Hard' }

const topicTitles = computed(() =>
  (contentData.value?.topics ?? []).map(topic => topic.title?.trim()).filter(Boolean) as string[],
)
const firstTopic = computed(() => topicTitles.value[0] ?? '')

const authorName = computed(() =>
  [contentData.value?.first_name, contentData.value?.last_name].map(name => name?.trim()).filter(Boolean).join(' '),
)

const hasFinished = computed(() => {
  const userData = contentData.value?.examUserData as ExamUserDataExamDetaiDTO | boolean | undefined
  return typeof userData === 'object' && userData?.status == '1'
})

const kicker = computed(() => {
  const type = contentData.value?.azmoon_type_title?.trim()
  return `${type ? `${type} quiz` : 'Quiz'} · online or printable`
})

// The intro under the title, built from the quiz's own facts so every page has its own description.
const lede = computed(() => {
  const exam = contentData.value
  if (!exam) return ''
  const questions = Number(exam.tests_num) || 0
  const minutes = Number(exam.azmoon_time) || 0
  const subject = [exam.section_title, exam.base_title, exam.lesson_title].map(t => t?.trim()).filter(Boolean).join(' ')
  const about = [
    questions ? `${questions} questions` : 'Questions',
    topicTitles.value.length ? ` on ${topicTitles.value.join(', ')}` : '',
    subject ? ` for ${subject}` : '',
  ].join('')
  if (!exam.price?.participation) return `${about}. Download it as a PDF, Word or PowerPoint file for your class.`
  return `${about}. Take it online${minutes ? ` with a ${minutes}-minute timer` : ''} and get your score, your rank and `
    + 'the correct answers as soon as you finish, or download it as a PDF, Word or PowerPoint file for your class.'
})

const facts = computed(() => {
  const exam = contentData.value
  if (!exam) return []
  const level = Number(exam.level)
  const participants = Number(exam.participants_num) || 0
  const views = Number(exam.views) || 0
  return [
    { label: 'questions', value: Number(exam.tests_num) ? exam.tests_num : '' },
    { label: 'time limit', value: Number(exam.azmoon_time) ? `${exam.azmoon_time} min` : '' },
    { label: 'difficulty', value: difficultyLabels[level] ?? '', level: difficultyLabels[level] ? level : 0 },
    { label: participants === 1 ? 'student took it' : 'students took it', value: participants ? formatExamCount(participants) : '' },
    { label: views === 1 ? 'view' : 'views', value: views ? formatExamCount(views) : '' },
  ].filter(fact => fact.value)
})

const { buildSchema } = useSeoSchema()

// Title, H1 and description worded the way people search (see utils/examSeo.ts).
const seo = computed(() => buildExamSeoText(contentData.value!))
const examDescription = computed(() => seo.value.description)
// What the sample questions come from: the paper's clean title when there is one.
const seoSubject = computed(() => contentData.value?.paper?.title?.trim() || cleanExamTitle(contentData.value?.title ?? ''))

// Quiz is schema.org's LearningResource for an assessment; breadcrumbs are what Google shows in results.
const schema = computed(() => {
  const exam = contentData.value
  if (!exam) return null
  return buildSchema({
    dto: exam,
    url: canonicalUrl,
    title: seo.value.title,
    description: examDescription.value,
    breadcrumbs: breads.value,
    types: ['webpage', 'learning', 'breadcrumb'],
    learning: examQuizSchema(exam),
  })
})

const shareImage = computed(() => contentData.value?.thumb_pic_url || contentData.value?.lesson_pic || undefined)

useHead(() => ({
  title: seo.value.title,
  meta: [
    { key: 'apple-mobile-web-app-title', name: 'apple-mobile-web-app-title', content: seo.value.title },
    { key: 'description', name: 'description', content: examDescription.value },
    { key: 'og:type', property: 'og:type', content: 'website' },
    { key: 'og:url', property: 'og:url', content: canonicalUrl },
    { key: 'og:site_name', property: 'og:site_name', content: 'GamaTrain' },
    { key: 'og:title', property: 'og:title', content: seo.value.title },
    { key: 'og:description', property: 'og:description', content: examDescription.value },
    { key: 'og:image', property: 'og:image', content: shareImage.value },
    { key: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
    { key: 'twitter:title', name: 'twitter:title', content: seo.value.title },
    { key: 'twitter:description', name: 'twitter:description', content: examDescription.value },
    { key: 'twitter:image', name: 'twitter:image', content: shareImage.value },
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
</script>

<style scoped>
.exam-details {
  max-width: 1232px;
}
.lede {
  font-size: 1.7rem;
  line-height: 1.6;
  max-width: 640px;
}
.level-bars span {
  flex: 1;
  height: 5px;
}
.kicker {
  letter-spacing: 0.04em;
}
.tag-chip {
  background-color: rgb(var(--v-theme-white));
}
@media (min-width: 960px) {
  .action-column {
    position: sticky;
    top: 88px;
  }
}
</style>
