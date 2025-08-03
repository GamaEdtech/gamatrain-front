<template>
  <div class="pt-16 pt-md-14 pt-lg-4">
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
  </div>
</template>

<script setup>
const route = useRoute()
const testId = ref(route.params.id)
const isAdsLoad = ref(false)

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
