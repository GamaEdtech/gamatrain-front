<template>
  <v-infinite-scroll
    ref="infiniteScroll"
    class="w-100 overflow-hidden"
    mode="intersect"
    side="end"
    margin="80"
    @load="$emit('load', $event)"
  >
    <div class="w-100 d-flex flex-column">
      <v-btn
        v-if="firstLoadedPage > 1"
        flat
        rounded="lg"
        color="grey200"
        class="text-grey700 align-self-center mb-6"
        :loading="loadingPrevious"
        @click="$emit('loadPrevious')"
      >
        <v-icon start>
          {{ loadPreviousError ? 'md:refresh' : 'md:keyboard_arrow_up' }}
        </v-icon>
        {{ loadPreviousError ? "Couldn't load previous posts. Try again" : 'Load previous posts' }}
      </v-btn>

      <template v-if="loadingFilters">
        <PostListItemSkeleton
          v-for="item in 3"
          :key="item"
        />
      </template>

      <template v-else>
        <v-sheet
          v-if="loadError && posts.length === 0"
          min-height="220"
          rounded="lg"
          color="grey50"
          class="d-flex flex-column align-center justify-center ga-3 pa-8 text-center"
        >
          <v-icon
            color="grey400"
            size="48"
          >
            md:cloud_off
          </v-icon>
          <div class="text-h5 font-weight-bold text-grey700">
            Couldn't load posts
          </div>
          <div class="text-body-2 text-grey500">
            Check your connection and try again.
          </div>
          <v-btn
            flat
            rounded="lg"
            color="primary"
            @click="$emit('retry')"
          >
            Try again
          </v-btn>
        </v-sheet>

        <v-sheet
          v-else-if="posts.length === 0 && allDataLoaded"
          min-height="220"
          rounded="lg"
          color="grey50"
          class="d-flex flex-column align-center justify-center ga-3 pa-8 text-center"
        >
          <v-icon
            color="grey400"
            size="48"
          >
            md:article
          </v-icon>
          <div class="text-h5 font-weight-bold text-grey700">
            No posts found
          </div>
          <div class="text-body-2 text-grey500">
            Try changing the title or category filter.
          </div>
        </v-sheet>

        <template v-else>
          <PostListItemSkeleton
            v-for="item in loadingPrevious ? 2 : 0"
            :key="`previous-${item}`"
          />
          <PostListItem
            v-for="(post, index) in posts"
            :key="post.id"
            :post="post"
            :show-year="shouldShowYear(post, index)"
          />
        </template>
      </template>
    </div>

    <template #loading>
      <PostListItemSkeleton v-if="posts.length > 0 && !loadingFilters" />
    </template>
    <template #error="{ props: retryProps }">
      <div class="d-flex justify-center my-4">
        <v-btn
          v-bind="retryProps"
          flat
          rounded="lg"
          color="grey200"
          class="text-grey700"
        >
          Couldn't load more posts. Try again
        </v-btn>
      </div>
    </template>
    <template #empty>
      <div />
    </template>
  </v-infinite-scroll>
</template>

<script setup lang="ts">
import type { PostDTO } from '@/types'

const props = defineProps<{
  posts: PostDTO[]
  firstLoadedPage: number
  loadingFilters: boolean
  loadingPrevious: boolean
  loadPreviousError: boolean
  allDataLoaded: boolean
  loadError: boolean
}>()

defineEmits<{
  load: [options: { done: (status: 'ok' | 'empty' | 'loading' | 'error') => void }]
  loadPrevious: []
  retry: []
}>()

const infiniteScroll = ref<{ reset: () => void } | null>(null)
const { formatLocal } = useDateTime()

const shouldShowYear = (post: PostDTO, index: number) => {
  if (index === 0) return true
  return formatLocal(post.publishDate, 'YYYY') !== formatLocal(props.posts[index - 1]!.publishDate, 'YYYY')
}

defineExpose({ reset: () => infiniteScroll.value?.reset() })
</script>
