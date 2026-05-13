<template>
  <v-container
    v-if="isLoading || slideItems.length > 5"
    fluid
    :class="route.path === '/' ? 'bg-grey100' : ''"
  >
    <v-container class="d-flex flex-column align-center justify-center">
      <div class="w-100 d-flex align-center justify-space-between">
        <h2 class="text-h3 text-grey700 font-weight-bold">
          Blog
        </h2>
        <v-btn
          variant="outlined"
          rounded="pill"
          outlined
          size="large"
          to="/blog"
          color="black"
          height="36"
          class="text-h5 d-none d-md-flex font-weight-bold"
        >
          Go to blog
        </v-btn>
        <router-link
          to="/blog"
          class="d-flex align-center d-md-none text-h6 text-grey600 font-weight-bold"
        >
          See all
          <v-icon color="primary">md:chevron_forward</v-icon>
        </router-link>
      </div>
      <div
        v-if="isLoading"
        class="w-100 d-flex align-center justify-center mt-8"
      >
        <v-slide-group>
          <v-slide-group-item
            v-for="(i, index) in 10"
            :key="index"
          >
            <lazy-blog-card-skeleton />
          </v-slide-group-item>
        </v-slide-group>
      </div>

      <div
        v-else
        class="w-100 d-flex align-center justify-center mt-8"
      >
        <v-slide-group>
          <v-slide-group-item
            v-for="(item, index) in slideItems"
            :key="index"
          >
            <lazy-blog-card :data="item" />
          </v-slide-group-item>
        </v-slide-group>
      </div>
    </v-container>
  </v-container>
</template>

<script setup lang="ts">
import type {
  ApiResult,
  ResponseListDTO,
  BlogDTO,
} from '@/types'

const slideItems = ref<BlogDTO[]>([])
const isLoading = ref(true)
const route = useRoute()

const loadBlog = async () => {
  isLoading.value = true
  try {
    const response = await useApiService.get<ApiResult<ResponseListDTO<BlogDTO>>>('/api/v2/blogs/posts/random', {
      Size: 10,
    })
    if (response.data && response.succeeded) {
      slideItems.value = response.data.list
    }
  }
  catch (err) {
    console.error(err)
  }
  finally {
    isLoading.value = false
  }
}

loadBlog()
</script>

<style scoped>
</style>
