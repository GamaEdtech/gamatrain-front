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
      @next="handleLoadNextTest"
    />
    <section class="my-4">
      <v-container>
        <v-row justify="center">
          <v-col
            cols="12"
            md="10"
          >
            <v-chip
              link
              class="mr-1 bg-blue-grey-darken-1 text-white"
              :small="display.mdAndDown"
            >
              <nuxt-link
                :to="`/search?type=test&section=${contentData?.section}`"
              >
                {{ contentData?.section_title }}
              </nuxt-link>
            </v-chip>
            <v-chip
              link
              class="mr-1 bg-blue-grey-darken-1 text-white"
              :small="display.mdAndDown"
            >
              <nuxt-link
                :to="`/search?type=test&section=${contentData?.section}&base=${contentData?.base}`"
              >
                {{ contentData?.base_title }}
              </nuxt-link>
            </v-chip>
            <v-chip
              class="ma-1 bg-blue-grey-darken-1 text-white"
              :small="display.mdAndDown"
            >
              <nuxt-link
                :to="`/search?type=test&section=${contentData?.section}&base=${contentData?.base}&lesson=${contentData?.lesson}`"
              >
                {{ contentData?.lesson_title }}
              </nuxt-link>
            </v-chip>
            <v-chip
              :small="display.mdAndDown"
              :to="`/subject-directory?board=${contentData?.section}&grade=${contentData?.base}&subject=${contentData?.lesson}`"
              class="ma-1 bg-primary text-white"
            >
              {{ contentData?.lesson_title }} directory
            </v-chip>
          </v-col>
        </v-row>
      </v-container>
    </section>

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

<script setup>
const route = useRoute()
const testId = ref(route.params.id)
const isAdsLoad = ref(false)
const display = useGlobalDisplay()

// Fetch data
const {
  data: contentData,
  pending: _pending,
  refresh,
  execute: _execute,
} = await useAsyncData(`exam-test-${route.params.id}`, async () => {
  const res = await $fetch(`/api/v1/examTests/${route.params.id}`, {
    params: { full: true },
  })
  if (res.status === 1) {
    return res.data
  }
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
})

const handleLoadNextTest = (id) => {
  testId.value = id
  refresh()
}

// Utility functions
const stripHtml = html => (html ? html.replace(/<[^>]+>/g, '') : '')
const cleanSubject = name => (name ? name.replace(/\s*\(.*?\)/, '') : '')

// Head/meta
useHead({
  titleTemplate: '%s Gamatrain',
  title: computed(
    () =>
      `${stripHtml(contentData.value?.question)?.substring(
        0,
        100,
      )} | ${cleanSubject(contentData.value?.lesson_title)} Quiz`,
  ),
  meta: [
    {
      name: 'apple-mobile-web-app-title',
      content: computed(
        () =>
          `${stripHtml(contentData.value?.question)?.substring(
            0,
            100,
          )} | ${cleanSubject(contentData.value?.lesson_title)} Quiz`,
      ),
    },
    {
      name: 'og:title',
      content: computed(
        () =>
          `${stripHtml(contentData.value?.question)?.substring(
            0,
            100,
          )} | ${cleanSubject(contentData.value?.lesson_title)} Quiz`,
      ),
    },
    {
      name: 'og:site_name',
      content: 'GamaTrain',
    },
    {
      name: 'description',
      content: computed(() => stripHtml(contentData.value?.question)),
    },
    {
      name: 'og:description',
      content: computed(() => stripHtml(contentData.value?.question)),
    },
  ],
})
</script>
