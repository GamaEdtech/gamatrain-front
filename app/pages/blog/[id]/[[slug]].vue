<template>
  <v-container id="main-blog-div">
    <v-row v-if="error">
      <h1 class="text-h3 font-weight-bold">
        Pleas Try Again Later.
      </h1>
    </v-row>
    <v-row v-else>
      <v-col
        cols="12"
        class="d-flex flex-column pa-6 mt-4 position-relative"
      >
        <div
          class="bg-primary-gray-100 rounded-lg left-0 top-0 gray-background-div w-100 position-absolute"
        />
        <div class="w-100 d-flex flex-column align-center set-z-index">
          <h1 class="d-flex align-center ga-2 w-100 text-h4 text-sm-h3 text-md-h2 font-weight-bold">
            <v-btn
              icon
              color="primary"
              flat
              variant="outlined"
              width="30"
              height="30"
              :disabled="!contentData.previousId"
              :to="`/blog/${contentData.previousId}`"
            >
              <v-icon
                color="primary"
                size="24"
              >
                md:chevron_left
              </v-icon>
            </v-btn>

            {{ contentData.title }}
            <v-btn
              icon
              color="primary"
              flat
              variant="outlined"
              width="30"
              height="30"
              :disabled="!contentData.nextId"
              :to="`/blog/${contentData.nextId}`"
            >
              <v-icon
                color="primary"
                size="24"
              >
                md:chevron_right
              </v-icon>
            </v-btn>
          </h1>
          <div
            v-if="contentData.tags && contentData.tags.length > 0"
            class="w-100 d-flex flex-wrap align-center justify-end ga-2 mt-4"
          >
            <v-chip
              v-for="(tag, index) in contentData.tags"
              :key="index"
              :to="`/blog?page=1&cat=${tag.id}`"
              class="text-subtitle-1 text-sm-h5 text-white font-weight-bold pa-3"
              color="#a7b1c2"
              variant="flat"
              :size="xs ? `x-small` : `default`"
            >
              {{ tag.name }}
            </v-chip>
          </div>
        </div>
        <img
          v-if="contentData.imageUri"
          class="w-100 rounded-lg main-blog-img set-z-index mt-4"
          :src="
            contentData.imageUri
              ? contentData.imageUri.replace(/^http:\/\//, 'https://')
              : '/default-blog-image.jpg'
          "
          :alt="contentData.title"
        >
        <div
          class="w-100 d-flex flex-wrap align-center justify-space-between mt-2 set-z-index"
        >
          <div class="w-50 d-flex align-center ga-2">
            <v-img
              :src="
                contentData.creationUserAvatar
                  ? contentData.creationUserAvatar
                  : '/images/member/avatar.svg'
              "
              width="30"
              max-width="30"
              height="30"
              rounded="circle"
            />
            <span class="text-subtitle-1 font-weight-bold">{{
              contentData.creationUser
                ? contentData.creationUser
                : "Unknown Author"
            }}</span>
          </div>
          <div class="w-50 d-flex align-center justify-end ga-1 ga-sm-3">
            <v-icon
              color="#667085"
              :size="xs ? 14 : 20"
              @click="share"
            >
              md:share
            </v-icon>
            <div class="d-flex align-center ga-1">
              <v-icon
                color="#667085"
                :size="xs ? 14 : 20"
              >
                md:visibility
              </v-icon>
              <span class="gama-text-overline">
                {{ contentData.viewCount || 0 }}
              </span>
            </div>
            <div class="d-flex align-center ga-1">
              <v-icon
                color="#667085"
                :size="xs ? 14 : 20"
              >
                md:calendar_month
              </v-icon>
              <span class="gama-text-overline">
                {{ $dayjs(contentData.publishDate).format("YYYY-MM-DD") }}
              </span>
            </div>
          </div>
        </div>
      </v-col>
      <v-col
        ref="blogContentRef"
        cols="12"
        class="d-flex flex-column mt-6"
      >
        <div
          id="blog-describe"
          v-html="contentData.body"
        />
      </v-col>
      <v-col
        v-if="contentData.keywords"
        cols="12"
        class="d-flex justify-center ga-1 flex-wrap"
      >
        <v-btn
          v-for="(item, index) in contentData.keywords.split(',')"
          :key="index"
          :to="`/blog/${blogId}/${contentData.slug}`"
          variant="plain"
          class="text-h5 font-weight-bold"
          :x-small="xs"
          :small="sm"
        >
          #{{ item }}
        </v-btn>
      </v-col>
      <v-col
        cols="12"
        class="d-flex flex-column ga-3 align-center justify-center"
      >
        <p class="text-h4 mb-4">
          Did you like this article?
        </p>
        <div class="d-flex align-center ga-2">
          <v-btn
            icon
            width="40"
            height="40"
            flat
            color="#919491"
          >
            <v-icon color="white">
              md:thumb_down
            </v-icon>
          </v-btn>
          <v-btn
            icon
            width="40"
            height="40"
            flat
            color="primary"
          >
            <v-icon color="white">
              md:thumb_up
            </v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'

const { $toast, $renderMathInElement, $ensureMathJaxReady } = useNuxtApp()
const route = useRoute()
const blogId = route.params.id
const { xs, sm } = useDisplay()
const requestURL = ref(useRequestURL().host)
const blogContentRef = ref(null)
const { data: contentData, error } = await useAsyncData(
  `blog-${blogId}`,
  () => useApiService.get(`/api/v2/blogs/posts/${blogId}`),
  {
    transform: response => response.data,
  },
)

// SEO
useHead({
  title: contentData.value?.title || 'Blog Post',
  meta: [
    {
      hid: 'apple-mobile-web-app-title',
      name: 'apple-mobile-web-app-title',
      content: contentData.value?.title || 'Blog Post',
    },
    {
      hid: 'og:title',
      name: 'og:title',
      content: contentData.value?.title || 'Blog Post',
    },
    {
      hid: 'og:site_name',
      name: 'og:site_name',
      content: 'GamaTrain',
    },
    {
      hid: 'description',
      name: 'description',
      content: contentData.value?.summary || 'Read this blog post on Gamatrain',
    },
    {
      hid: 'og:description',
      name: 'og:description',
      content: contentData.value?.summary || 'Read this blog post on Gamatrain',
    },
    {
      property: 'og:image',
      content: contentData.value?.imageUri.replace(/^http:\/\//, 'https://'),
    },
    {
      hid: 'twitter:card',
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      hid: 'twitter:title',
      name: 'twitter:title',
      content: contentData.value?.title || 'Blog Post',
    },
    {
      hid: 'twitter:description',
      name: 'twitter:description',
      content: contentData.value?.summary || 'Read this blog post on Gamatrain',
    },
    {
      hid: 'twitter:image',
      name: 'twitter:image',
      content: contentData.value?.imageUri?.replace(/^http:\/\//, 'https://'),
    },
    {
      hid: 'keywords',
      name: 'keywords',
      content: contentData.value?.keywords || '',
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: contentData.value
        ? `https://${requestURL.value}/blog/${blogId}/${contentData.value.slug}`
        : `https://${requestURL.value}/blog/${blogId}`,
    },
  ],
})

const share = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: contentData.value.title,
        text: contentData.value.summary,
        url: `https://gamatrain.com/blog/${blogId}`,
      })
    }
    catch (error) {
      console.error('Error sharing:', error)
    }
  }
  else {
    try {
      await navigator.clipboard.writeText(requestURL.value)
      $toast.success('Link copied to clipboard!')
    }
    catch (error) {
      console.warn(
        'Share API and clipboard API are not supported in this browser',
        error,
      )
      $toast.info('Share feature is not supported in this browser')
    }
  }
}

const typesetMathInSpecificContainer = async (containerRef) => {
  if (import.meta.client && containerRef.value) {
    try {
      await $ensureMathJaxReady()

      if (!window.MathJax || !window.MathJax.Hub) {
        return
      }

      let elementToProcess = null
      if (
        containerRef.value.$el
        && containerRef.value.$el instanceof HTMLElement
      ) {
        elementToProcess = containerRef.value.$el
      }
      else if (containerRef.value instanceof HTMLElement) {
        elementToProcess = containerRef.value
      }

      if (elementToProcess) {
        await nextTick()
        $renderMathInElement(elementToProcess)
      }
    }
    catch (error) {
      console.error('Error during MathJax typesetting:', error)
    }
  }
}
onMounted(() => {
  typesetMathInSpecificContainer(blogContentRef)
})
</script>

<style>
#main-blog-div {
  margin-top: 64px;
  min-height: 100vh;
  max-width: 800px !important;
}

#main-blog-div table{
  width: 100%;
}

.main-blog-img {
  height: auto;
  object-fit: cover;
}
.gray-background-div {
  height: calc(100% - 140px);
}
.set-z-index {
  z-index: 2;
}

#blog-describe {
  margin-bottom: 4.8rem !important;
  width: 98%;
  margin: auto auto 8.8rem auto;

  h2 {
    font-family: Inter;
    font-size: 3rem;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    margin-top: 2.4rem;
    margin-bottom: 2.4rem;
  }

  h3 {
    font-family: Inter;
    font-size: 2.8rem;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }

  h4 {
    font-family: Inter;
    font-size: 2.4rem;
    font-style: normal;
    font-weight: 800;
    line-height: normal;
  }

  h5 {
    font-family: Inter;
    font-size: 2rem;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }

  h6 {
    font-family: Inter;
    font-size: 1.6rem;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }

  p {
    color: rgba(36, 41, 47, 0.8);
    font-family: Inter;
    font-size: 1.4rem !important;
    font-style: normal;
    font-weight: 400 !important;
    line-height: 2.4rem;
    margin-bottom: 1rem;
  }

  ul {
    color: rgba(36, 41, 47, 0.8);
    font-family: Inter;
    font-size: 1.4rem;
    font-style: normal;
    font-weight: 400;
    line-height: 2.4rem;
  }
  img {
    border-radius: 2rem;
    margin-top: 2rem;
    margin-bottom: 1rem;
    height: auto;
    max-width: 100%;
  }
}

@media (min-width: 960px) {
  #main-blog-div {
    margin-top: 6.4rem;
  }
  #blog-describe {
    margin-bottom: 10rem !important;

    h2 {
      font-size: 4.4rem;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      margin-top: 2.4rem;
      margin-bottom: 2.4rem;
    }

    h3 {
      font-size: 3.6rem;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }

    h4 {
      font-size: 3rem;
      font-style: normal;
      font-weight: 800;
      line-height: normal;
    }

    h5 {
      font-size: 2.4rem;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }

    h6 {
      font-size: 2rem;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }

    p {
      font-size: 2rem !important;
      font-style: normal;
      font-weight: 400 !important;
      line-height: 3.2rem;
      margin-bottom: 1rem;
    }

    ul {
      font-family: Inter;
      font-size: 2rem;
      font-style: normal;
      font-weight: 400;
      line-height: 3.2rem;
    }
    img {
      border-radius: 2rem;
      margin-top: 2rem;
      margin-bottom: 1rem;
      height: auto;
      max-width: 100%;
    }
  }
}

@media (min-width: 600px) {
  .gray-background-div {
    height: calc(100% - 140px);
  }
  #blog-describe {
    margin-bottom: 6.4rem;
    width: 98%;
    display: block;
    margin: auto auto 6.8rem auto;

    h2 {
      font-family: Inter;
      font-size: 3rem;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      margin-top: 2.4rem;
      margin-bottom: 2.4rem;
    }

    h3 {
      font-family: Inter;
      font-size: 2.8rem;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }

    h4 {
      font-size: 2.6rem;
      font-style: normal;
      font-weight: 800;
      line-height: normal;
    }

    h5 {
      font-size: 2rem;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }

    h6 {
      font-size: 1.6rem;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }

    p {
      font-size: 1.6rem !important;
      font-style: normal;
      font-weight: 400 !important;
      line-height: 2.4rem;
      margin-bottom: 1rem;
    }

    ul {
      font-size: 1.6rem;
      font-style: normal;
      font-weight: 400;
      line-height: 2.4rem;
    }
    img {
      border-radius: 2rem;
      margin-top: 2rem;
      margin-bottom: 1rem;
      height: auto;
      max-width: 100%;
    }
  }
}
</style>
