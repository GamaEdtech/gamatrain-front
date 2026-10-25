<template>
  <v-container class="d-flex flex-column mt-10 mt-md-16">
    <template v-if="!contentData">
      <v-skeleton-loader type="subtitle" />
      <v-skeleton-loader
        v-for="(loader, index) in 4"
        :key="index"
        type="paragraph"
      />
    </template>

    <test-details
      v-if="contentData"
      :content-data="contentData"
      :show-chips="true"
    />

    <v-row>
      <v-col
        cols="12"
        class="px-6"
      >
        <CommonDetailSubjectDirectoryNav :content-data="contentData || undefined" />
      </v-col>
    </v-row>

    <v-row
      justify="center"
      class="mt-10"
    >
      <v-col
        cols="12"
        md="8"
        class="text-center"
      >
        <common-ad-banner
          v-model="isAdsLoad"
          adslot="7199289937"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import type { ApiResult, QuestionDTO } from '@/types'

const { $cleanSubject } = useNuxtApp()
const pageDescribe = ref('')
const pageTitle = ref('')
const isAdsLoad = ref(false)
const route = useRoute()

const { buildSchema } = useSeoSchema()

const {
  data: contentData,
  pending: _pending,
  execute: _execute,
} = await useAsyncData(`exam-test-${route.params.id}`, async () => {
  try {
    const res = await useApiService.get(`/api/v1/examTests/${route.params.id}`,
      { full: true },
    ) as ApiResult<QuestionDTO>

    // A missing question still answers status 1, with every field of data null.
    return res.status === 1 && res.data?.id ? res.data : null
  }
  catch {
    return null
  }
})

// An error thrown inside the handler only lands in useAsyncData's error, so SSR answered 200 with an empty page.
// Throwing from setup makes Nuxt render the error page with a real 404.
if (!contentData.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found',
    fatal: true,
  })
}

// The page answers to both the numeric id and the short code; the code is the one canonical URL, since
// sequential ids are easy for scrapers to walk. /test/25704 301s to /test/Las3zk.
const { url: canonicalUrl } = await useCanonicalContentPath('test', contentData.value.code || contentData.value.id)

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
const normalizedDto = computed(() => {
  if (!contentData.value) return null

  const dto = contentData.value

  return {
    ...dto,
    question: stripHtmlTags(dto.question),
    answer_a: stripHtmlTags(dto.answer_a),
    answer_b: stripHtmlTags(dto.answer_b),
    answer_c: stripHtmlTags(dto.answer_c),
    answer_d: stripHtmlTags(dto.answer_d),
  }
})
const schema = computed(() => {
  if (!normalizedDto.value) return null

  return buildSchema({
    dto: normalizedDto.value,
    url: canonicalUrl,
    title: pageTitle.value,
    description: pageDescribe.value,
    types: ['quiz'],
  })
})
const setMetaData = () => {
  if (!contentData.value) return

  const dto: QuestionDTO = contentData.value

  const questionText = stripHtmlTags(dto.question, 130)

  pageTitle.value
    = `${questionText} | ${$cleanSubject(dto.lesson_title)} Quiz`

  pageDescribe.value = stripHtmlTags(dto.question, 300)

  const ogImage = dto.q_file && dto.q_file !== '0'
    ? dto.q_file
    : 'https://gamatrain.com/android-chrome-512x512-light.png'

  useHead({
    titleTemplate: '%s Gamatrain',
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
        href: canonicalUrl,
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
  setMetaData()
}
</script>
