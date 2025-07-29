//
<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold">
          {{ pageData.title }}
        </h1>

        <p
          class="mt-3"
          v-html="pageData.content"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'StaticPage',
  async asyncData({ params, error }) {
    let param = ''
    if (params.static_page == 'terms-and-conditions') param = 'terms'
    else param = params.static_page

    const page_info = await useApiService.get(`/api/v1/pages/${param}`)

    if (!page_info.data.title)
      error({ statusCode: 404, message: 'Page not found' })
    else {
      const pageData = page_info.data
      return { pageData }
    }
  },
  head() {
    return {
      title: this.pageData.title,
    }
  },
}
</script>
