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
    <div class="w-100 d-flex align-start justify-center justify-md-space-between mt-6 flex-wrap mb-4">
      <div class="w-100 w-md-33 d-flex justify-center">
        <lazy-exam-detail-preview-card
          :id="contentData.id"
          :title="contentData.title"
          :views="contentData.views"
          :thumb-pic="contentData.thumb_pic_url"
          :question-number="contentData.tests_num"
          :level="contentData.level"
          @share="openShare = true"
        />
      </div>

      <div class="w-100 w-md-66 d-flex align-start flex-wrap mt-4 mt-md-0">
        <lazy-exam-detail-content :content-data="contentData" />

        <lazy-exam-detail-download-button
          :id="contentData.id"
          :files="contentData.price"
          :title="contentData.title"
          :title-url="contentData.title_url"
          :exam-user-data="contentData.examUserData"
        />
      </div>
    </div>

    <lazy-common-box-random-question
      :lesson="contentData.lesson"
    />

    <lazy-common-related-content
      :id="contentData.id"
      source="exam"
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
  </v-container>
</template>

<script setup lang="ts">
interface BreadCrumb {
  text: string
  disabled: boolean
  href: string
}

const route = useRoute()
const { getItemById } = useExam()

const breads = ref<BreadCrumb[]>([])
const openShare = ref(false)
const openCrashReport = ref(false)

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
watch(
  () => contentData.value,
  () => {
    initBreadCrumb()
  },
  { immediate: true },
)

const { buildSchema } = useSeoSchema()

// The meta description used to repeat the title; what the exam covers and how long it is says more.
const examDescription = computed(() => {
  const exam = contentData.value
  if (!exam) return ''
  const minutes = Number(exam.azmoon_time) || 0
  const facts = [
    Number(exam.tests_num) ? `${exam.tests_num} questions` : '',
    minutes ? `${minutes} minutes` : '',
  ].filter(Boolean).join(', ')
  const subject = [exam.lesson_title, exam.base_title, exam.section_title].map(t => t?.trim()).filter(Boolean).join(', ')
  return `${exam.title}${facts ? ` - ${facts}` : ''}. Online exam for ${subject || 'practice'} on GamaTrain.`
})

// Quiz is schema.org's LearningResource for an assessment; breadcrumbs are what Google shows in results.
const schema = computed(() => {
  const exam = contentData.value
  if (!exam) return null
  const minutes = Number(exam.azmoon_time) || 0
  const author = [exam.first_name, exam.last_name].filter(Boolean).join(' ')
  return buildSchema({
    dto: exam,
    url: canonicalUrl,
    title: exam.title,
    description: examDescription.value,
    breadcrumbs: breads.value,
    types: ['webpage', 'learning', 'breadcrumb'],
    learning: {
      '@type': 'Quiz',
      'learningResourceType': 'Practice exam',
      'educationalUse': 'Assessment',
      'teaches': exam.lesson_title?.trim() || undefined,
      'educationalLevel': exam.base_title?.trim() || undefined,
      'image': exam.thumb_pic_url || undefined,
      'timeRequired': minutes ? `PT${minutes}M` : undefined,
      ...(author && { author: { '@type': 'Person', 'name': author } }),
    },
  })
})

useHead(() => ({
  title: contentData.value?.title || 'Exam Details',
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
      content: examDescription.value,
    },
    {
      hid: 'og:description',
      name: 'og:description',
      content: examDescription.value,
    },
    {
      hid: 'og:image',
      property: 'og:image',
      content: contentData.value?.thumb_pic_url ?? null,
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
      content: examDescription.value,
    },
    {
      hid: 'twitter:image',
      name: 'twitter:image',
      content: contentData.value?.thumb_pic_url ?? null,
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
</script>

<style scoped>
</style>
