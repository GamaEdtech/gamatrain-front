<template>
  <v-container id="blog-list-page">
    <!-- Featued blog section -->
    <v-row
      id="desktop-featured-blog"
      class="d-none d-md-flex"
    >
      <v-col
        id="preview-section"
        cols="9"
      >
        <v-skeleton-loader
          v-if="isLoading"
          class="mx-auto slide-loading"
          type="image"
        />
        <v-card
          v-else-if="featuredItems[0]"
          flat
          :to="`/blog/${featuredItems[slideIndex].id}/${$slugGenerator(
            featuredItems[0].title,
          )}`"
          class="ma-1"
        >
          <v-card>
            <NuxtImg
              width="880px"
              height="500px"
              :src="featuredItems[slideIndex].pic"
              placeholder
              :class="activeSlide ? 'active-img' : ''"
            />
            <v-card-title>
              <span class="gama-text-h6">
                {{ featuredItems[slideIndex].title }}
              </span>
            </v-card-title>
          </v-card>
        </v-card>
      </v-col>
      <v-col
        id="list-section"
        cols="3"
      >
        <h2 class="gama-text-button">
          Featured Post
        </h2>
        <div v-if="isLoading">
          <v-row
            v-for="i in 5"
            :key="i"
            class="featured-item"
          >
            <div class="d-flex">
              <div>
                <v-skeleton-loader type="image" />
              </div>
              <div class="text-loader-section">
                <v-skeleton-loader type="heading" />
              </div>
            </div>
          </v-row>
        </div>
        <div
          v-for="(item, n) in featuredItems.slice(0, 5)"
          v-else
          :key="n"
          class="featured-item"
        >
          <nuxt-link :to="`/blog/${item.id}/${$slugGenerator(item.title)}`">
            <div class="v-responsive v-img">
              <NuxtImg
                width="100px"
                height="100px"
                :src="item.pic"
                placeholder
                class="mobile-image-feature nuxt-image"
              />
            </div>
          </nuxt-link>

          <div class="item-text">
            <nuxt-link :to="`/blog/${item.id}/${$slugGenerator(item.title)}`">
              <h2 class="gama-text-caption">{{ item.title }}</h2>
            </nuxt-link>
          </div>
        </div>
      </v-col>
    </v-row>
    <div
      id="featured-blog"
      class="d-block d-md-none"
    >
      <v-row>
        <v-col cols="12">
          <v-slide-group
            v-model="featureVal"
            class="slider py-sm-4"
            :show-arrows="lgAndUp"
          >
            <div
              v-if="isLoading"
              class="d-flex"
            >
              <v-slide-group-item
                v-for="i in 10"
                :key="i"
              >
                <v-skeleton-loader
                  class="mx-auto slide-loading"
                  type="image"
                />
              </v-slide-group-item>
            </div>

            <v-slide-group-item
              v-for="(item, n) in featuredItems"
              v-else
              :key="n"
            >
              <v-card
                flat
                :to="`/blog/${item.id}/${$slugGenerator(item.title)}`"
                class="ma-1"
              >
                <v-card>
                  <NuxtImg
                    width="350px"
                    height="350px"
                    :src="item.pic"
                    placeholder
                    class="mobile-image-feature"
                  />
                  <!-- <v-img cover :src="item.pic" /> -->
                  <v-card-title>
                    <span class="gama-text-h6">
                      {{ item.title }}
                    </span>
                  </v-card-title>
                </v-card>
              </v-card>
            </v-slide-group-item>
          </v-slide-group>
        </v-col>
      </v-row>
    </div>
    <!-- End featured blog section -->

    <!-- Search section -->
    <v-row id="blog-search">
      <v-col
        cols="12"
        class="pb-0"
      >
        <v-text-field
          v-model="searchQuery"
          class="rounded-ts pr-0"
          density="compact"
          variant="outlined"
          hide-details
          label="Search"
        >
          <template #append>
            <v-btn
              :loading="searchLoading"
              density="compact"
              color="#FFB300"
              class="text-white"
            >
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
    <!-- Search section -->

    <!-- Category section -->
    <v-row
      id="category-section"
      justify="space-around"
    >
      <v-col cols="12">
        <v-card
          flat
          class="pb-4 px-1"
        >
          <v-chip-group
            v-model="categoryValue"
            mandatory
            selected-class="active-cate"
          >
            <v-chip
              :key="0"
              :x-small="xs"
              :large="mdAndUp"
              :value="0"
              @click="categoryValue = 0"
            >
              All
            </v-chip>
            <v-chip
              v-for="cat in blogCategories"
              :key="cat.id"
              :x-small="xs"
              :large="mdAndUp"
              :value="cat.id"
              @click="categoryValue = cat.id"
            >
              {{ cat.title }}
            </v-chip>
          </v-chip-group>
        </v-card>
      </v-col>
    </v-row>
    <!-- End Category section -->

    <!-- Blog list section -->
    <div id="blog-list-section">
      <div v-if="blogList.length">
        <v-row
          v-for="(item, index) in blogList"
          :key="index"
          class="blog-item"
        >
          <v-col
            cols="9"
            class="mobile-item d-block d-sm-none"
          >
            <v-card
              flat
              :to="`/blog/${item.id}/${$slugGenerator(item.title)}`"
            >
              <v-card class="ma-1">
                <NuxtImg
                  width="180px"
                  height="135px"
                  :src="item.pic"
                  placeholder
                  class="nuxt-image"
                />
                <v-card-title>
                  <span class="gama-text-button">
                    {{ item.title }}
                  </span>
                </v-card-title>
              </v-card>
              <div class="gama-text-subtitle2">
                <span v-html="truncateBody(item.body, 32)" />
                <span class="read-more">Read more</span>
              </div>
            </v-card>
          </v-col>
          <v-col
            cols="10"
            sm="10"
            class="d-none d-sm-block"
          >
            <div class="d-flex">
              <nuxt-link :to="`/blog/${item.id}/${$slugGenerator(item.title)}`">
                <NuxtImg
                  width="180px"
                  height="135px"
                  :src="item.pic"
                  placeholder
                  class="nuxt-image"
                />
              </nuxt-link>

              <div class="item-text">
                <nuxt-link
                  :to="`/blog/${item.id}/${$slugGenerator(item.title)}`"
                >
                  <h2 class="gama-text-button">{{ item.title }}</h2>
                  <span
                    class="gama-text-subtitle2"
                    v-html="truncateBody(item.body, 142)"
                  />
                  <span class="gama-text-subtitle2 read-more">Read more</span>
                </nuxt-link>
              </div>
            </div>
          </v-col>
          <v-col
            cols="3"
            sm="2"
          >
            <div class="date-holder-container">
              <div class="date-holder">
                <div>
                  <div class="gama-text-button d-block">
                    {{ $dayjs(item.subdate).format("DD") }}
                  </div>
                  <div class="gama-text-overline d-block">
                    {{ $dayjs(item.subdate).format("MMM") }}
                  </div>
                </div>
              </div>
              <div class="vertical-line" />
              <div
                v-if="blogList.length - 1 == index"
                class="last-vertical-line"
              />
              <div
                v-if="item.yearDisplay"
                class="year-holder"
              >
                <div
                  v-if="index != 0"
                  class="top-sign"
                />
                <div class="gama-text-overline">
                  {{ $dayjs(item.subdate).format("YYYY") }}
                </div>
                <div class="bottom-sign" />
              </div>
            </div>
          </v-col>
        </v-row>
        <v-row
          v-if="
            allDataLoaded == false
              && paginateStatus == false
              && blogList.length > 2
          "
          class="blog-item"
        >
          <v-col cols="12">
            <div class="d-none d-sm-flex">
              <div>
                <v-skeleton-loader type="image" />
              </div>
              <div class="text-loader-section">
                <v-skeleton-loader type="heading,list-item-two-line" />
              </div>
            </div>
            <div class="d-flex d-sm-none mobile-item">
              <v-skeleton-loader
                class="mx-auto slide-loading"
                type="image"
              />
            </div>
          </v-col>
        </v-row>
      </div>
      <div
        v-else-if="blogList.length == 0 && blogLoading == false"
        class="text-center"
      >
        <span class="gama-text-button"> Opps! no data found </span>
      </div>
      <div v-else>
        <v-row
          v-for="i in 3"
          :key="i"
          class="blog-item"
        >
          <v-col cols="12">
            <div class="d-none d-sm-flex">
              <div>
                <v-skeleton-loader type="image" />
              </div>
              <div class="text-loader-section">
                <v-skeleton-loader type="heading,list-item-two-line" />
              </div>
            </div>
            <div class="d-flex d-sm-none mobile-item">
              <v-skeleton-loader
                class="mx-auto slide-loading"
                type="image"
              />
            </div>
          </v-col>
        </v-row>
      </div>

      <div class="text-center">
        <v-pagination
          v-if="paginateStatus"
          v-model="pageNum"
          :length="pageCount"
          circle
        />
      </div>

      <div ref="loaderSection" />
    </div>
    <!-- End blog list section -->
  </v-container>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { useDisplay } from 'vuetify'

const route = useRoute()
const router = useRouter()

const { lgAndUp, mdAndUp, xs, sm } = useDisplay()
const { $slugGenerator } = useNuxtApp()

// SEO
useHead({
  title: 'Exploring the Latest Insights in K12 Education | GamaTrain Blog',
  meta: [
    {
      name: 'apple-mobile-web-app-title',
      content:
        'Exploring the Latest Insights in K12 Education | GamaTrain Blog',
    },
    {
      name: 'og:title',
      content:
        'Exploring the Latest Insights in K12 Education | GamaTrain Blog',
    },
    {
      name: 'og:site_name',
      content: 'GamaTrain',
    },
    {
      name: 'description',
      content:
        'Stay informed and inspired with GamaTrain\'s insightful blog, featuring thought-provoking articles on the latest trends and best practices in K12 education.',
    },
    {
      name: 'og:description',
      content:
        'Stay informed and inspired with GamaTrain\'s insightful blog, featuring thought-provoking articles on the latest trends and best practices in K12 education.',
    },
  ],
})

onMounted(() => {
  window.addEventListener('scroll', setupScrollListener)
  updateQueryParams()
  handleAutoCycle()
})

onBeforeUnmount(() => {
  stopInterval()
  window.removeEventListener('scroll', setupScrollListener)
})

// Featued blog section Start
const { data: featuredItemsResponse, pending: loadingFeatured }
  = await useAsyncData('featured', () =>
    $fetch('/api/v1/blogs/search', { params: { featured: 1 } }),
  )
const featuredItems = ref(featuredItemsResponse.value?.data.list || [])
const isLoading = ref(loadingFeatured.value)
const featureVal = ref(0)
const intervalId = ref(null)
const slideIndex = ref(0)
const activeSlide = ref(true)

const handleAutoCycle = () => {
  intervalId.value = setInterval(() => {
    activeSlide.value = false
    if (slideIndex.value == featuredItems.value.length - 1)
      slideIndex.value = 0
    else slideIndex.value += 1
    setTimeout(() => {
      activeSlide.value = true
    }, 300)
  }, 5000)
}
const stopInterval = () => {
  clearInterval(intervalId.value) // Clear the interval using the interval ID
}
// Featued blog section End

// blog serch section Start
const searchLoading = ref(false)
const searchQuery = ref(route.query.keyword || '')
const timer = ref(null)

watch(
  () => route.query.keyword,
  (_value) => {
    searchLoading.value = true

    if (timer.value) {
      clearTimeout(timer.value)
      timer.value = null
    }

    timer.value = setTimeout(() => {
      allDataLoaded.value = false
      paginateStatus.value = false
      printedYearArr.value = []
      pageNum.value = 1
      blogList.value = []

      getBlogList()
    }, 800)
  },
)

watch(
  () => searchQuery.value,
  (_value) => {
    updateQueryParams()
  },
)
// blog serch section End

// category section start
const { data: blogCategoriesResponse } = await useAsyncData('categories', () =>
  $fetch('/api/v1/types/list', { params: { type: 'blog_cat' } }),
)

const categoryValue = ref(route.query.cat || 0)
const blogCategories = ref(blogCategoriesResponse.value?.data || [])

watch(
  () => route.query.cat,
  (_value) => {
    allDataLoaded.value = false
    paginateStatus.value = false
    printedYearArr.value = []
    pageNum.value = 1
    blogList.value = []
    getBlogList()
  },
)

watch(
  () => categoryValue.value,
  (_value) => {
    updateQueryParams()
  },
)

// category section end

// Blog List Section Start
const blogList = ref([])
const printedYearArr = ref([])
const pageNum = ref(1)
const pageSize = ref(15)
const pageCount = ref(0)
const allDataLoaded = ref(false)
const paginateStatus = ref(false)
const enablePaginateStatus = 10

const { data: initialBlogs, pending: loadingBlogsServer } = await useAsyncData(
  'blogListSSR',
  () => {
    const params = {
      title: route.query.keyword || '',
      cat: route.query.cat || 0,
      page: 1,
      perpage: pageSize.value,
    }

    return $fetch('/api/v1/blogs/search', { params })
  },
)

const blogLoading = ref(loadingBlogsServer.value)

const processBlogs = (list) => {
  for (let i = 0; i < list.length; i++) {
    const year = dayjs(list[i].subdate).format('YYYY')
    if (printedYearArr.value.includes(year)) {
      list[i].yearDisplay = false
    }
    else {
      list[i].yearDisplay = true
      printedYearArr.value.push(year)
    }
  }
  return list
}

if (initialBlogs.value?.data?.list) {
  blogList.value = processBlogs(initialBlogs.value.data.list)
  pageCount.value = Math.ceil(initialBlogs.value.data.num / pageSize.value)
}

const getBlogList = async () => {
  const params = {}
  blogLoading.value = true
  params.title = searchQuery.value

  if (categoryValue.value != 0) {
    params.cat = categoryValue.value
  }

  params.page = pageNum.value
  params.perpage = pageSize.value

  try {
    const response = await $fetch('/api/v1/blogs/search', { params })
    const data = response.data
    pageCount.value = Math.ceil(data.num / pageSize.value)

    if (data.list.length === 0 && paginateStatus.value == false) {
      allDataLoaded.value = true // To end loop
      pageNum.value -= 1
    }

    // Arrange data for show year
    for (let i = 0; i < data.list.length; i++) {
      const year = dayjs(data.list[i].subdate).format('YYYY')
      if (printedYearArr.value.includes(year)) {
        data.list[i].yearDisplay = false
      }
      else {
        data.list[i].yearDisplay = true
        printedYearArr.value.push(year)
      }
    }
    // End arrange data for show year

    if (paginateStatus.value == false) {
      blogList.value.push(...data.list)
    }
    else {
      blogList.value = data.list
    }
  }
  catch (error) {
    console.log(error)
  }
  finally {
    blogLoading.value = false
    searchLoading.value = false
    if (pageNum.value > enablePaginateStatus) paginateStatus.value = true
  }
}

const updateQueryParams = () => {
  const query = {}
  if (pageNum.value !== 0) {
    query.page = pageNum.value
  }
  if (searchQuery.value != '') {
    query.keyword = searchQuery.value
  }
  if (categoryValue.value !== 0) {
    query.cat = categoryValue.value
  }

  // Handle more query parameters here ...
  router.replace({ query: query }).catch((_err) => {
    // Do noting
  })
}
// Blog List Section End

const truncateBody = (text, fixedLength = null) => {
  let cutLength = fixedLength ?? 200
  if (!fixedLength) {
    if (sm.value) cutLength = 142
    else if (xs.value) cutLength = 38
  }
  return text.length > cutLength ? text.slice(0, cutLength) + '...' : text
}

// Start Infinit Scroll Section
const loaderSection = ref(null)

const setupScrollListener = () => {
  if (!loaderSection.value) return
  const rect = loaderSection.value.getBoundingClientRect()
  const isDivInView = rect.top >= 0 && rect.bottom <= window.innerHeight

  if (
    isDivInView
    && !allDataLoaded.value
    && !blogLoading.value
    && !paginateStatus.value
  ) {
    pageNum.value += 1
    getBlogList()
  }
}

watch(
  () => pageNum.value,
  (_value) => {
    updateQueryParams()
  },
)

watch(
  () => route.query.page,
  (_value) => {
    if (paginateStatus.value) {
      const currentScrollPosition = window.scrollY
      if (currentScrollPosition >= 10) {
        window.scrollTo(0, currentScrollPosition - 10)
      }
      else {
        window.scrollTo(0, 0)
      }
      printedYearArr.value = []
      getBlogList()
    }
  },
)
// End Infinit Scroll Section
</script>

<style scope>
#blog-list-page {
  .text-loader-section {
    min-width: 80%;
  }
  .nuxt-image {
    object-fit: cover;
    border-radius: 1rem;
  }
  .mobile-image-feature {
    width: 100%;
    height: 100%;
  }

  .blog-item {
    margin-bottom: 4.8rem;

    .v-img,
    .v-skeleton-loader__image {
      max-width: 17.9rem;
      min-width: 17.9rem;
      width: 17.9rem;
      height: 13.5rem;
      border-radius: 1rem;
      float: left;
    }

    .item-text {
      float: right;
      padding-left: 1.6rem;

      .gama-text-button {
        color: #24292f;
        margin-bottom: 2.4rem;
      }

      .gama-text-subtitle2 {
        color: #6e7781;
      }
    }

    .date-holder-container {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      .date-holder {
        width: 5.6rem;
        height: 5.6rem;
        border-radius: 0.4rem;
        background: #ebebeb;
        display: flex;
        align-items: center;
        justify-content: center;

        z-index: 2;

        .gama-text-button {
          color: #24292f;
          margin-bottom: 0.4rem;
        }

        .gama-text-overline {
          color: #a7b1c2;
        }
      }

      .vertical-line {
        position: absolute;
        top: 6.5rem;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto auto;
        transform: translateX(-50%);
        width: 1px;
        height: 25.5rem;
        background-color: #ebebeb;
        z-index: 1;
      }

      .last-vertical-line {
        position: absolute;
        top: 15.5rem;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto auto;
        transform: translateX(-50%);
        width: 2px;
        height: 15.5rem;
        background-color: #fff;
        z-index: 1;
      }

      .year-holder {
        position: absolute;
        top: -1rem;
        background: #fff;
        z-index: 2;

        .gama-text-overline {
          color: #a7b1c2;
        }

        .top-sign {
          position: absolute;
          top: -0.4rem;
          left: 0;
          right: 0.1rem;
          margin: auto auto;
          width: 0.4rem;
          height: 0.4rem;
          border-radius: 50%;
          background: #ebebeb;
        }

        .bottom-sign {
          position: absolute;
          bottom: -0.4rem;
          left: 0;
          right: 0.1rem;
          margin: auto auto;
          width: 0.4rem;
          height: 0.4rem;
          background: #ebebeb;
          border-radius: 50%;
        }
      }
    }

    .mobile-item {
      .slide-loading {
        .v-skeleton-loader__image {
          min-width: 24rem;
          height: 18rem;
          position: relative;
          border-radius: 0.6rem;
        }
      }

      .v-card {
        width: 24rem;
        height: 18rem;
        margin: auto auto;
        position: relative;
        border-radius: 0.6rem;
        row-gap: 10px;
        display: flex;
        flex-direction: column;
        overflow: unset;

        .v-card {
          width: 24rem;
          height: 18rem;

          .v-card-title {
            border-radius: 0px 0px 6px 6px;
            background: rgba(36, 41, 47, 0.7);
            backdrop-filter: blur(7.5px);
            position: absolute;
            bottom: 0;
            right: 0;
            left: 0;
            font-family: "Inter";
            margin: 0 auto;
            color: #fff;
            padding-top: 0.6rem !important;
            padding-bottom: 0.6rem;
            height: 4.9rem;
            max-height: 4.9rem;
            white-space: wrap;
            display: flex;
            align-items: center;

            .gama-text-button {
              color: #fff;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }
          }
          .nuxt-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 1rem;
          }

          .v-img {
            min-width: 24rem;
            height: 18rem;
          }
        }
      }

      .gama-text-subtitle2 {
        margin: auto auto;
        max-width: 18.2rem;
        text-align: left;
        color: #6e7781;

        & > a {
          color: #ffb600;
        }
        .read-more {
          color: #ffb600;
        }
      }
    }
  }

  #featured-blog {
    margin: 5rem auto 2.4rem auto;
    height: 18rem;

    .slider {
      .slide-loading {
        .v-skeleton-loader__image {
          width: 24rem;
          height: 18rem;
          margin-right: 1.6rem !important;
          position: relative;
          border-radius: 0.6rem;
        }
      }

      .v-card {
        width: 24rem;
        height: 18rem;
        max-height: 18rem;
        margin-right: 1.6rem;
        position: relative;
        border-radius: 0.6rem;

        .v-card {
          height: 18rem;

          .v-card-title {
            border-radius: 0px 0px 6px 6px;
            background: rgba(36, 41, 47, 0.7);
            backdrop-filter: blur(7.5px);
            position: absolute;
            bottom: 0;
            right: 0;
            left: 0;
            font-family: "Inter";
            margin: 0 auto;
            color: #fff;
            padding-top: 0.6rem !important;
            padding-bottom: 0.6rem;
            height: 5rem;
            max-height: 5rem;
            white-space: wrap;
            display: flex;
            align-items: center;

            .gama-text-h6 {
              color: #fff;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }
          }

          .v-img {
            width: 24rem;
            height: 18rem;
          }
        }
      }

      .gama-text-subtitle2 {
        margin: auto auto;
        max-width: 18.2rem;
        text-align: left;
        color: #6e7781;

        & > a {
          color: #ffb600;
        }
      }
    }
  }

  #blog-search {
    .v-text-field {
      width: 80%;
      min-height: auto;
      height: 4rem !important;
      margin: 1.6rem auto 1.6rem auto;

      .v-input__control > .v-field {
        min-height: auto;
        height: 4rem !important;
        border-radius: inherit;
        border-radius: 3.8rem 0.4rem 0.4rem 3.8rem;

        &:before {
          border-style: none;
        }
      }

      .v-field--focused {
        color: #ffb300;
      }

      .v-field__input {
        color: black;
      }

      .v-label {
        font-size: 16px;
      }

      .v-input__append {
        margin: 0 0 0 0.8rem !important;

        .v-btn {
          min-width: auto;
          width: 4rem !important;
          height: 4rem;
          border-radius: 0.4rem 3rem 3rem 0.4rem;

          .v-icon {
            color: #fff;
            font-size: 2.2rem;
          }
          .v-btn__loader {
            color: white;
          }
        }
      }
    }
  }

  #category-section {
    .v-chip {
      padding: 0.8rem 2rem;
      color: rgba(255, 255, 255, 0.87);
      background: #a7b1c2 !important;
    }

    .active-cate {
      background: #ffb600 !important;
    }
  }
}

@media (min-width: 600px) {
  #blog-list-page {
    margin-top: 64px;

    .text-loader-section {
      min-width: 80%;
    }

    .blog-item {
      margin-bottom: 4.8rem;

      .v-img,
      .v-skeleton-loader__image {
        max-width: 17.9rem;
        min-width: 17.9rem;
        width: 17.9rem;
        height: 13.5rem;
        border-radius: 1rem;
        float: left;
      }

      .item-text {
        float: right;
        padding-left: 1.6rem;

        .gama-text-button {
          color: #24292f;
          margin-bottom: 2.4rem;
        }

        .gama-text-subtitle2 {
          color: #6e7781;
        }

        .read-more {
          color: #ffb600;
        }
      }

      .date-holder-container {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;

        .date-holder {
          width: 8.2rem;
          height: 8.2rem;
          border-radius: 0.4rem;
          background: #ebebeb;
          display: flex;
          align-items: center;
          justify-content: center;

          z-index: 2;

          .gama-text-button {
            color: #24292f;
          }

          .gama-text-overline {
            color: #a7b1c2;
          }
        }

        .vertical-line {
          position: absolute;
          top: 6.5rem;
          bottom: 0;
          left: 0;
          right: 0;
          margin: auto auto;
          transform: translateX(-50%);
          width: 1px;
          height: 21.5rem;
          background-color: #ebebeb;
          z-index: 1;
        }

        .last-vertical-line {
          position: absolute;
          top: 15.5rem;
          bottom: 0;
          left: 0;
          right: 0;
          margin: auto auto;
          transform: translateX(-50%);
          width: 2px;
          height: 11.5rem;
          background-color: #fff;
          z-index: 1;
        }

        .year-holder {
          position: absolute;
          top: -1rem;
          background: #fff;
          z-index: 2;

          .gama-text-overline {
            color: #a7b1c2;
          }

          .top-sign {
            position: absolute;
            top: -0.4rem;
            left: 0;
            right: 0.1rem;
            margin: auto auto;
            width: 0.4rem;
            height: 0.4rem;
            border-radius: 50%;
            background: #ebebeb;
          }

          .bottom-sign {
            position: absolute;
            bottom: -0.4rem;
            left: 0;
            right: 0.1rem;
            margin: auto auto;
            width: 0.4rem;
            height: 0.4rem;
            background: #ebebeb;
            border-radius: 50%;
          }
        }
      }
    }

    #featured-blog {
      margin: 0 auto 2.4rem auto;
      height: 28.1rem;

      .slider {
        .slide-loading {
          .v-skeleton-loader__image {
            width: 34.8rem;
            height: 26.1rem;
            margin-right: 1.6rem !important;
            position: relative;
            border-radius: 0.6rem;
          }
        }

        .v-card {
          width: 34.8rem;
          height: 26.1rem;
          max-height: 26.1rem;

          .v-card {
            height: 26.1rem;

            .v-card-title {
              padding-top: 1.16rem !important;
              padding-bottom: 1.16rem;
              height: 7.25rem;
              max-height: 7.25rem;
              white-space: wrap;
              display: flex;
              align-items: center;
            }

            .v-img {
              width: 34.8rem;
              height: 26.1rem;
            }
          }
        }
      }
    }

    #blog-search {
      .v-text-field {
        width: 35.3rem;
        border-radius: 4rem 0.4rem 0.4rem 4rem;
      }
    }
  }
}

@media (min-width: 960px) {
  #blog-list-page {
    margin-top: 6.4rem;

    .text-loader-section {
      min-width: 80%;
    }

    .blog-item {
      padding-left: 1.2rem;
      padding-right: 1.2rem;
      margin-bottom: 4.8rem;

      .v-img,
      .v-skeleton-loader__image {
        max-width: 17.9rem;
        min-width: 17.9rem;
        width: 17.9rem;
        height: 13.5rem;
        border-radius: 1rem;
        float: left;
      }

      .item-text {
        float: right;
        padding-left: 1.6rem;

        .gama-text-button {
          color: #24292f;
          margin-bottom: 2.4rem;
        }

        .gama-text-subtitle2 {
          color: #6e7781;
        }

        .read-more {
          color: #ffb600;
        }
      }

      .date-holder-container {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;

        .date-holder {
          width: 8.2rem;
          height: 8.2rem;
          border-radius: 0.4rem;
          background: #ebebeb;
          display: flex;
          align-items: center;
          justify-content: center;

          z-index: 2;

          .gama-text-button {
            color: #24292f;
            margin-bottom: 1.4rem;
          }

          .gama-text-overline {
            color: #a7b1c2;
          }
        }

        .vertical-line {
          position: absolute;
          top: 6.5rem;
          bottom: 0;
          left: 0;
          right: 0;
          margin: auto auto;
          transform: translateX(-50%);
          width: 1px;
          height: 21.5rem;
          background-color: #ebebeb;
          z-index: 1;
        }

        .last-vertical-line {
          position: absolute;
          top: 15.5rem;
          bottom: 0;
          left: 0;
          right: 0;
          margin: auto auto;
          transform: translateX(-50%);
          width: 2px;
          height: 11.5rem;
          background-color: #fff;
          z-index: 1;
        }

        .year-holder {
          position: absolute;
          top: -1rem;
          background: #fff;
          z-index: 2;

          .gama-text-overline {
            color: #a7b1c2;
          }

          .top-sign {
            position: absolute;
            top: -0.4rem;
            left: 0;
            right: 0.1rem;
            margin: auto auto;
            width: 0.4rem;
            height: 0.4rem;
            border-radius: 50%;
            background: #ebebeb;
          }

          .bottom-sign {
            position: absolute;
            bottom: -0.4rem;
            left: 0;
            right: 0.1rem;
            margin: auto auto;
            width: 0.4rem;
            height: 0.4rem;
            background: #ebebeb;
            border-radius: 50%;
          }
        }
      }
    }

    #desktop-featured-blog {
      margin: 0.7rem auto 6.4rem auto;
      height: 50rem;

      #list-section {
        .gama-text-button {
          color: #7f8a9c;
          margin-bottom: 1.6rem;
        }

        .featured-item {
          margin-bottom: 0.8rem;
          display: flex;

          .v-skeleton-loader__image {
            width: 11.6rem;
            height: 8.7rem;
            margin-left: 0.8rem;
            border-radius: 0.6rem;
          }

          .v-skeleton-loader__card-heading {
            width: 15.2rem;
            max-width: 15.2rem;
          }

          .v-img {
            width: 11.6rem;
            height: 8.7rem;
            border-radius: 0.6rem;
          }

          .item-text {
            padding: 0.8rem;

            .gama-text-caption {
              color: #24292f;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 4;
              -webkit-box-orient: vertical;
            }
          }
        }
      }

      #preview-section {
        border-radius: 1rem;

        .v-skeleton-loader__image {
          height: 50rem;
          min-height: 50rem;
          max-height: 50rem;
          border-radius: 1rem;
        }

        .v-card {
          height: 50rem;
          max-height: 50rem;
          min-height: 50rem;

          border-radius: 1rem;

          .v-card {
            border-radius: 1rem;

            .v-card-title {
              border-radius: 0px 0px 6px 6px;
              background: rgba(36, 41, 47, 0.7);
              backdrop-filter: blur(7.5px);
              position: absolute;
              bottom: 0;
              right: 0;
              left: 0;
              font-family: "Inter";
              margin: 0 auto;
              color: #fff;
              padding-top: 0.6rem !important;
              padding-bottom: 0.6rem;
              height: 6.4rem;
              max-height: 6.4rem;
              border-radius: 0 0 1rem 1rem;
              white-space: wrap;
              display: flex;
              align-items: center;

              .gama-text-h6 {
                color: #fff;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
              }
            }

            .v-img {
              max-height: 50rem;
              min-height: 50rem;
              border-radius: 1rem;
              opacity: 0.5;
            }

            .active-img {
              opacity: 1 !important;
              transition: opacity 1s ease;
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
        }
      }
    }

    #blog-search {
      .v-text-field {
        width: 50rem;
        border-radius: 4rem 0.4rem 0.4rem 4rem;
      }
    }

    #category-section {
      .v-chip {
        height: 54px;
        font-size: 16px;
      }
    }
  }
}

@media (min-width: 1264px) {
  #blog-list-page {
    width: 72%;
    max-width: 72%;
    margin-top: 6.4rem;
  }
}
</style>
