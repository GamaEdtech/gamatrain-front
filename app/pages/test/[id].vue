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
      :show-title="true"
    />

    <v-row>
      <v-col
        cols="12"
        class="px-6"
      >
        <CommonDetailSubjectDirectoryNav :content-data="contentData" />
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

<script setup>
const { $stripHtmlTags, $cleanSubject } = useNuxtApp()
const route = useRoute()
const isAdsLoad = ref(false)

const {
  data: contentData,
  pending: _pending,
  execute: _execute,
} = await useAsyncData(`exam-test-${route.params.id}`, async () => {
  const res = await useApiService.get(`/api/v1/examTests/${route.params.id}`,
    { full: true },
  )
  if (res.status === 1) {
    return res.data
  }
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
})

useHead({
  titleTemplate: '%s Gamatrain',
  title:
      `${$stripHtmlTags(contentData.value?.question, 100)} | ${$cleanSubject(contentData.value?.lesson_title)} Quiz`,
  meta: [
    {
      name: 'apple-mobile-web-app-title',
      content:
          `${$stripHtmlTags(contentData.value?.question, 100)} | ${$cleanSubject(contentData.value?.lesson_title)} Quiz`,
    },
    {
      name: 'og:title',
      content:
          `${$stripHtmlTags(contentData.value?.question, 100)} | ${$cleanSubject(contentData.value?.lesson_title)} Quiz`,
    },
    {
      name: 'og:site_name',
      content: 'GamaTrain',
    },
    {
      name: 'description',
      content: $stripHtmlTags(contentData.value?.question),
    },
    {
      name: 'og:description',
      content: $stripHtmlTags(contentData.value?.question),
    },
  ],
})
</script>
