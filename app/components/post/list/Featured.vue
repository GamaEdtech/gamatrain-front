<template>
  <section class="w-100">
    <v-row class="d-none d-md-flex">
      <v-col cols="9">
        <v-skeleton-loader
          v-if="loading"
          height="500"
          width="500"
          class="rounded-lg w-100"
        />
        <v-card
          v-else-if="activePost"
          flat
          rounded="lg"
          :to="contentPath('post', activePost.id, activePost.slug)"
        >
          <v-img
            :src="secureImageUrl(activePost.imageUri)"
            :alt="activePost.title"
            min-height="500"
            max-height="500"
            class="w-100 h-100"
          >
            <template #default>
              <div class="d-flex h-100 align-end">
                <v-card-title class="w-100 background-title text-white text-h4 font-weight-bold py-4">
                  {{ activePost.title }}
                </v-card-title>
              </div>
            </template>
          </v-img>
        </v-card>
      </v-col>

      <v-col cols="3">
        <div class="text-h5 text-grey500 font-weight-bold mb-3">
          Featured posts
        </div>
        <div class="d-flex flex-column ga-2">
          <template v-if="loading">
            <div
              v-for="item in 5"
              :key="item"
              class="d-flex ga-2 align-start"
            >
              <v-skeleton-loader
                width="120"
                height="80"
                class="rounded-lg"
              />
              <v-skeleton-loader
                width="80"
                height="20"
                class="rounded-lg"
              />
            </div>
          </template>
          <v-card
            v-for="(post, index) in posts.slice(0, 5)"
            v-else
            :key="post.id"
            flat
            rounded="lg"
            class="pa-1"
            :color="index === selectedIndex ? 'grey100' : undefined"
            @click="selectPost(index)"
          >
            <div class="d-flex ga-2 align-center">
              <v-img
                :src="secureImageUrl(post.imageUri)"
                :alt="post.title"
                max-width="120"
                min-height="80"
                max-height="80"
                cover
                class="h-100 w-100 rounded-lg"
              />
              <span class="text-subtitle-1 font-weight-semibold text-grey800">
                {{ truncateText(post.title, 64) }}
              </span>
            </div>
          </v-card>
        </div>
      </v-col>
    </v-row>

    <v-slide-group
      class="d-flex d-md-none py-4"
    >
      <template v-if="loading">
        <v-slide-group-item
          v-for="item in 3"
          :key="item"
        >
          <v-skeleton-loader
            class="mobile-feature-skeleton mr-3 rounded-lg"
          />
        </v-slide-group-item>
      </template>
      <template v-else>
        <v-slide-group-item
          v-for="post in posts"
          :key="post.id"
        >
          <v-card
            flat
            rounded="lg"
            class="mobile-feature-card mr-3"
            :to="contentPath('post', post.id, post.slug)"
          >
            <v-img
              :src="secureImageUrl(post.imageUri)"
              :alt="post.title"
              height="260"
              max-height="260"
              class="h-100"
            >
              <template #default>
                <div class="d-flex h-100 align-end">
                  <v-card-title class="w-100 background-title text-white text-h6 font-weight-bold text-wrap py-2">
                    {{ truncateText(post.title, 74) }}
                  </v-card-title>
                </div>
              </template>
            </v-img>
          </v-card>
        </v-slide-group-item>
      </template>
    </v-slide-group>
  </section>
</template>

<script setup lang="ts">
import type { PostDTO } from '@/types'
import { contentPath } from '@/utils/contentPath'
import { secureImageUrl, truncateText } from '@/utils/postCard'
import { useDisplay } from 'vuetify'

const props = defineProps<{
  posts: PostDTO[]
  loading: boolean
}>()

const { mdAndUp } = useDisplay()

const AUTO_CYCLE_DELAY = 5000
const selectedIndex = ref(0)
const activePost = computed(() => props.posts[selectedIndex.value] ?? props.posts[0])
let autoCycleTimer: ReturnType<typeof setInterval> | null = null
let isMounted = false

const stopAutoCycle = () => {
  if (!autoCycleTimer) return

  clearInterval(autoCycleTimer)
  autoCycleTimer = null
}

const startAutoCycle = () => {
  stopAutoCycle()

  if (!isMounted || !mdAndUp.value || props.posts.length < 2) return

  autoCycleTimer = setInterval(() => {
    selectedIndex.value = (selectedIndex.value + 1) % Math.min(props.posts.length, 5)
  }, AUTO_CYCLE_DELAY)
}

const selectPost = (index: number) => {
  selectedIndex.value = index
  startAutoCycle()
}

watch(() => props.posts, () => {
  selectedIndex.value = 0
  startAutoCycle()
})

watch(mdAndUp, startAutoCycle)

onMounted(() => {
  isMounted = true
  startAutoCycle()
})

onBeforeUnmount(() => {
  isMounted = false
  stopAutoCycle()
})
</script>

<style scoped lang="scss">
@use 'sass:map';
@use 'vuetify/settings' as vuetify;

.mobile-feature-skeleton {
  width: 350px;
  height: 200px;
}

.mobile-feature-card {
  width: 350px;
}

.background-title{
  background-color: rgba(var(--v-theme-inverseSurface), 0.6);
  backdrop-filter: blur(10px);
}

@media #{map.get(vuetify.$display-breakpoints, 'xs')} {
  .mobile-feature-skeleton,
  .mobile-feature-card {
    width: 280px;
  }

  .mobile-feature-skeleton {
    height: 160px;
  }
}
</style>
