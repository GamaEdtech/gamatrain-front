<template>
  <v-container class="d-flex flex-column margin-top-handle">
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
          type="paper"
          title="Past Papers"
          source="test"
          request="test"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

const requestURL = ref(useRequestURL().host)
const pageDescribe = ref('')
const pageTitle = ref('')
const breads = ref([])

// Track loading state

const { data: contentData } = await useAsyncData(
  `paper-${route.params.id}`,
  async () => {
    try {
      const response = await $fetch(`/api/v1/tests/${route.params.id}`, {})

      return response.data
    }
    catch (e) {
      if (e?.status === 404) {
        router.push('/search?type=test')
      }
      throw e
    }
    finally {
      // Reset loading states if needed
    }
  },
  {
    server: true,
    lazy: false,
    immediate: true,
    watch: [() => route.params.id],
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
        hid: 'apple-mobile-web-app-title',
        name: 'apple-mobile-web-app-title',
        content: pageTitle.value,
      },
      {
        hid: 'og:title',
        name: 'og:title',
        content: pageTitle.value,
      },
      {
        hid: 'og:site_name',
        name: 'og:site_name',
        content: 'GamaTrain',
      },
      {
        hid: 'description',
        name: 'description',
        content: pageDescribe.value,
      },
      {
        hid: 'og:description',
        name: 'og:description',
        content: pageDescribe.value,
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: ogImage,
      },
      {
        hid: 'twitter:card',
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: pageTitle.value,
      },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content: pageDescribe.value,
      },
      {
        hid: 'twitter:image',
        name: 'twitter:image',
        content: ogImage,
      },
    ],
    script: [
      {
        hid: 'json-ld-schema',
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
    __dangerouslyDisableSanitizersByTagID: {
      'json-ld-schema': ['innerHTML'],
    },
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
  console.log('contentData.value', contentData.value)

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

@media (min-width: 960px) {
  .margin-top-handle {
    margin-top: 6.4rem;
  }
}
</style>
